module.exports.config = {
    name: "event",
    version: "1.0.0",
    hasPermission: 2,
    credits: "Hoàng Ngọc Từ",
    description: "lệnh admin",
    commandCategory: "ADMIN",
    usePrefix: true,
    usages: "Sử dụng .event [load] [eventModuleName] để tải lại các module sự kiện.",
    cooldowns: 0,
    dependencies: {
      "fs-extra": "",
      "child_process": "",
      "path": ""
    }
  };
  const path = require('path');
  const { readdirSync, readFileSync, writeFileSync, unlinkSync } = require('fs-extra');
  const { execSync } = require('child_process');
  
  const loadEventModules = function({ moduleList, threadID, messageID, api }) {
    const eventModuleDir = path.join(__dirname, '../../module/events');
    const configPath = path.join(__dirname, '../../config.json');
    const logger = require(path.join(__dirname, '../../utils/log'));
  
    var errorList = [];
    delete require.cache[require.resolve(configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + '.temp', JSON.stringify(configValue, null, 2), 'utf8');
  
    if (moduleList.includes("All")) {
      moduleList = readdirSync(eventModuleDir).filter(file => file.endsWith('.js')).map(file => file.slice(0, -3));
    }
  
    for (const nameModule of moduleList) {
      try {
        const dirModule = path.join(eventModuleDir, nameModule + '.js'); // Sử dụng path.join
        delete require.cache[require.resolve(dirModule)];
        const eventModule = require(dirModule);
        global.client.events.delete(nameModule);
        if (!eventModule.config || !eventModule.handleEvent || !eventModule.config.name)
          throw new Error('Module không đúng định dạng!');
        global.client.eventRegistered = global.client.eventRegistered.filter(info => info !== eventModule.config.name);
  
        if (eventModule.config.dependencies && typeof eventModule.config.dependencies === 'object') {
          const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
          const listbuiltinModules = require('module').builtinModules;
  
          for (const packageName in eventModule.config.dependencies) {
            var tryLoadCount = 0, loadSuccess = false, error;
            const moduleDir = path.join(__dirname, 'node_modules', packageName); // Sử dụng path.join
            try {
              if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) {
                global.nodemodule[packageName] = require(packageName);
              } else {
                global.nodemodule[packageName] = require(moduleDir);
              }
            } catch {
              logger.loader('Không tìm thấy package ' + packageName + ' hỗ trợ cho module ' + eventModule.config.name + ', tiến hành cài đặt...', 'warn');
              const insPack = { stdio: 'inherit', env: process.env, shell: true, cwd: __dirname };
              execSync('npm install ' + packageName + (eventModule.config.dependencies[packageName] === '*' || eventModule.config.dependencies[packageName] === '' ? '' : '@' + eventModule.config.dependencies[packageName]), insPack);
              for (tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                require.cache = {};
                try {
                  if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) {
                    global.nodemodule[packageName] = require(packageName);
                  } else {
                    global.nodemodule[packageName] = require(moduleDir);
                  }
                  loadSuccess = true;
                  break;
                } catch (error) {
                  error = error;
                }
                if (loadSuccess || !error) break;
              }
              if (!loadSuccess || error) throw 'Không thể tải package ' + packageName + ' cho module ' + eventModule.config.name + ', lỗi: ' + error + ' ' + error.stack;
            }
          }
          logger.loader('Đã tải thành công toàn bộ package cho module ' + eventModule.config.name);
        }
  
        if (eventModule.config.envConfig && typeof eventModule.config.envConfig === 'object') {
          try {
            for (const [key, value] of Object.entries(eventModule.config.envConfig)) {
              if (typeof global.configModule[eventModule.config.name] === 'undefined')
                global.configModule[eventModule.config.name] = {};
              if (typeof configValue[eventModule.config.name] === 'undefined')
                configValue[eventModule.config.name] = {};
              if (typeof configValue[eventModule.config.name][key] !== 'undefined')
                global.configModule[eventModule.config.name][key] = configValue[eventModule.config.name][key];
              else global.configModule[eventModule.config.name][key] = value || '';
              if (typeof configValue[eventModule.config.name][key] === 'undefined')
                configValue[eventModule.config.name][key] = value || '';
            }
            logger.loader('Đã tải cấu hình cho module ' + eventModule.config.name);
          } catch (error) {
            throw new Error('Không thể tải cấu hình module, lỗi: ' + JSON.stringify(error));
          }
        }
  
        if (eventModule.onLoad) {
          try {
            const onLoads = { configValue };
            eventModule.onLoad(onLoads);
          } catch (error) {
            throw new Error('Không thể thực thi onLoad module, lỗi: ' + JSON.stringify(error));
          }
        }
  
        if (eventModule.handleEvent) global.client.eventRegistered.push(eventModule.config.name);
        if (global.config.eventDisabled.includes(nameModule + '.js') || configValue.eventDisabled.includes(nameModule + '.js')) {
          configValue.eventDisabled = configValue.eventDisabled.filter(module => module !== nameModule + '.js');
          global.config.eventDisabled = global.config.eventDisabled.filter(module => module !== nameModule + '.js');
        }
        global.client.events.set(eventModule.config.name, eventModule);
        logger.loader('Đã tải module sự kiện ' + eventModule.config.name + '!');
      } catch (error) {
        errorList.push('- ' + nameModule + ' reason:' + error + ' at ' + error.stack);
      }
    }
  
    if (typeof api === 'undefined') {
      throw new Error('api is not defined');
    }
  
    if (errorList.length !== 0) api.sendMessage('Những module vừa xảy ra sự cố khi tải: ' + errorList.join(' '), threadID, messageID);
    api.sendMessage('Đã tải thành công ' + (moduleList.length - errorList.length) + ' module sự kiện ✅', threadID, messageID);
    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(configPath + '.temp');
    return;
  };
  


  module.exports.run = async function({ event, args, api, Users }) {
    const allowedAdmins = ["100029043375434", "61561753304881", "61563982612558"];
    if (!allowedAdmins.includes(event.senderID.toString())) {
      return api.sendMessage(
        "Chỉ ADMIN mới có quyền sử dụng lệnh này.",
        event.threadID,
        event.messageID
      );
    }
  
    const { threadID, messageID } = event;
    var moduleList = args.slice(1);
  
    if (moduleList.length === 0)
      return api.sendMessage(
        "Tên module không được bỏ trống.",
        threadID,
        messageID
      );
    else return loadEventModules({ moduleList, threadID, messageID, api });
  };
  