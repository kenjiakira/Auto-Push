const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Cấu hình thư mục dự án và kho Git
const projectDir = 'D:/PACK-2.1.3-main';
const git = simpleGit(projectDir);

// Cấu hình lệnh
const config = {
  name: "push",
  version: "1.0.0",
  description: "Tự động gửi thay đổi lên GitHub",
  hasPermission: 0,
  credits: "ChatGPT",
  commandCategory: "automation",
  usages: "node git-upload.js",
  cooldowns: 5
};

// Hàm kiểm tra trạng thái Git
const checkGitStatus = () => {
  return new Promise((resolve, reject) => {
    exec('git status --porcelain', { cwd: projectDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`ERROR: Không thể kiểm tra trạng thái git. ${stderr}`);
        reject(new Error('Không thể kiểm tra trạng thái git.'));
      } else {
        resolve(stdout);
      }
    });
  });
};

// Hàm thêm thay đổi vào staging area
const addChanges = () => {
  return git.add('.').then(() => console.log('Thay đổi đã được thêm vào staging area.'));
};

// Hàm commit thay đổi
const commitChanges = () => {
  const commitMessage = `Auto-commit: ${new Date().toLocaleString()}`;
  return git.commit(commitMessage).then(() => console.log('Commit thành công.'));
};

// Hàm kiểm tra cấu hình remote
const checkRemoteConfig = () => {
  return git.getRemotes(true).then(remotes => {
    if (remotes.length === 0) {
      throw new Error('Không có cấu hình remote.');
    }
    console.log('Cấu hình remote:', remotes);
  });
};

// Hàm đẩy thay đổi lên GitHub
const pushChanges = () => {
  return git.push('origin', 'main').then(() => console.log('Đẩy thay đổi lên GitHub thành công.'));
};

// Hàm chính để thực hiện lệnh
const run = async () => {
  try {
    console.log('Checking git status...');
    const status = await checkGitStatus();
    if (!status) {
      console.log('No changes to commit.');
      return;
    }

    console.log('Adding changes to staging area...');
    await addChanges();
    
    console.log('Committing changes...');
    await commitChanges();

    console.log('Checking remote configuration...');
    await checkRemoteConfig();

    console.log('Pushing changes to GitHub...');
    await pushChanges();

    console.log('Push thành công.');
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
  }
};

// Chạy script
run();
