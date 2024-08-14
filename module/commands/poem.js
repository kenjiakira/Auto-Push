module.exports.config = {
  name: "poem",
  version: "1.1.0",
  hasPermission: 0,
  credits: "Akira",
  description: "Đọc thơ",
  commandCategory: "Giải Trí",
  usePrefix: true,
  usages: "Sử dụng: .poem",
  cooldowns: 5
};

const poems = [
  {
    title: "Việt Bắc - Tố Hữu",
    category: "Cách mạng",
    excerpt: `
Mình về mình có nhớ ta
Mười lăm năm ấy thiết tha mặn nồng
Mình về mình có nhớ không
Nhìn cây nhớ núi, nhìn sông nhớ nguồn?

Tiếng ai tha thiết bên cồn
Bâng khuâng trong dạ, bồn chồn bước đi
Áo chàm đưa buổi phân ly
Cầm tay nhau biết nói gì hôm nay...

Mình đi, có nhớ những ngày
Mưa nguồn suối lũ, những mây cùng mù
Mình về, có nhớ chiến khu
Miếng cơm chấm muối, mối thù nặng vai?

Mình về, rừng núi nhớ ai
Trám bùi để rụng, măng mai để già
Mình đi, có nhớ những nhà
Hắt hiu lau xám, đậm đà lòng son?
    `
  },
  {
    title: "Tây Tiến - Quang Dũng",
    category: "Cách mạng",
    excerpt: `
Sông Mã xa rồi Tây Tiến ơi
Nhớ về rừng núi nhớ chơi vơi
Sài Khao sương lấp đoàn quân mỏi
Mường Lát hoa về trong đêm hơi.

Dốc lên khúc khuỷu dốc thăm thẳm
Heo hút cồn mây súng ngửi trời
Ngàn thước lên cao ngàn thước xuống
Nhà ai Pha Luông mưa xa khơi.
    `
  },
  {
    title: "Đất Nước - Nguyễn Khoa Điềm",
    category: "Cách mạng",
    excerpt: `
Khi ta lớn lên Đất Nước đã có rồi
Đất Nước có trong những cái "ngày xửa ngày xưa..." mẹ thường hay kể
Đất Nước bắt đầu với miếng trầu bây giờ bà ăn
Đất Nước lớn lên khi dân mình biết trồng tre mà đánh giặc
Tóc mẹ thì bới sau đầu
Cha mẹ thương nhau bằng gừng cay muối mặn
Cái kèo cái cột thành tên
Hạt gạo phải một nắng hai sương xay, giã, giần, sàng
Đất Nước có từ ngày đó...
    `
  },
  {
    title: "Tương Tư - Nguyễn Bính",
    category: "Trữ tình",
    excerpt: `
Thôn Đoài ngồi nhớ thôn Đông
Một người chín nhớ mười mong một người.
Gió mưa là bệnh của giời
Tương tư là bệnh của tôi yêu nàng.

Hai thôn chung lại một làng,
Cớ sao bên ấy chẳng sang bên này?
Ngày qua ngày lại qua ngày,
Lá xanh nhuộm đã thành cây lá vàng.

Bảo rằng cách trở đò giang,
Không sang là chẳng đường sang đã đành.
Nhưng đây cách một đầu đình,
Có xa xôi mấy cho tình xa xôi…

Tương tư thức mấy đêm rồi,
Biết cho ai, hỏi ai người biết cho!
Bao giờ bến mới gặp đò?
Hoa khuê các bướm giang hồ gặp nhau? 

Nhà em có một giàn giầu
Nhà anh có một hàng cau liên phòng
Thôn Đoài thì nhớ thôn Đông
Cau thôn Đoài nhớ giầu không thôn nào?
    `
  },
  {
    title: "Tình yêu Vĩnh cửu",
    category: "Lục bát",
    excerpt: `
  Em là mây trắng trên trời
Anh là cơn gió ngậm ngùi nhớ mong
Bên nhau hai đứa thong dong
Mình cùng đan kết tình nồng duyên thơ

Anh ngồi dệt mộng bên bờ
Em là dòng suối lững lờ trôi qua
Một đời mình mãi thiết tha
Nhớ thương từng phút như hoa nở vàng

Đêm dài em đứng ngóng trông
Anh về bên cạnh ấm lòng đôi ta
Giữa đời dẫu có phong ba
Vẫn luôn gắn bó như là trăng sao

Thương nhau cho đến bạc đầu
Chẳng còn chi ngại, lòng đau chẳng còn
Yêu thương giữ mãi sắt son
Tình anh với em, trường tồn mãi thôi

Bốn mùa xuân hạ thu đông
Dẫu bao thay đổi vẫn không phai mờ
Yêu nhau trọn kiếp ngàn thơ
Trái tim hòa nhịp đôi bờ mong manh

Thế gian muôn kiếp xoay vần
Mình luôn vững bước tình gần chẳng xa
Dẫu rằng gian khó muôn nhà
Tình yêu hai đứa vẫn là viên mãn

Và dù năm tháng phai tàn
Tình mình vẫn mãi chứa chan muôn đời
Em là ánh sáng trong ngời
Anh là ngọn gió bên trời yêu em.
    `
  },
  {
    title: "Sóng - Xuân Quỳnh",
    category: "Trữ tình",
    excerpt: `
Dữ dội và dịu êm
Ồn ào và lặng lẽ
Sóng không hiểu nổi mình
Sóng tìm ra tận bể

Ôi con sóng ngày xưa
Và ngày sau vẫn thế
Nỗi khát vọng tình yêu
Bồi hồi trong ngực trẻ

Trước muôn trùng sóng bể
Em nghĩ về anh, em
Em nghĩ về biển lớn
Từ nơi nào sóng lên?

Sóng bắt đầu từ gió
Gió bắt đầu từ đâu?
Em cũng không biết nữa
Khi nào ta yêu nhau

Con sóng dưới lòng sâu
Con sóng trên mặt nước
Ôi con sóng nhớ bờ
Ngày đêm không ngủ được

Lòng em nhớ đến anh
Cả trong mơ còn thức
Dẫu xuôi về phương Bắc
Dẫu ngược về phương Nam
Nơi nào em cũng nghĩ
Hướng về anh - một phương

Ở ngoài kia đại dương
Trăm nghìn con sóng đó
Con nào chẳng tới bờ
Dù muôn vời cách trở

Cuộc đời tuy dài thế
Năm tháng vẫn đi qua
Như biển kia dẫu rộng
Mây vẫn bay về xa

Làm sao được tan ra
Thành trăm con sóng nhỏ
Giữa biển lớn tình yêu
Để ngàn năm còn vỗ.
    `
  },
  {
    title: "Chân Quê - Nguyễn Bính",
    category: "Trữ tình",
    excerpt: `
  Hôm qua em đi tỉnh về
Đợi em ở mãi con đê đầu làng
Khăn nhung quần lĩnh rộn ràng
Áo cài khuy bấm em làm khổ tôi
Nào đâu cái yếm lụa sồi
Cái dây lưng đuỗi nhuộm hồi sang xuân.
Nào đâu cái áo tứ thân,
Cái khăn mỏ quạ
Cái quần nái đen?
Nói ra sợ mất lòng em
Van em em hãy giữ nguyên quê mùa
Như hôm em đi lễ chùa.
Cứ ăn mặc thế cho vừa lòng anh.
Hoa chanh nở giữa vườn chanh.
Thầy u mình với chúng mình chân quê

Hôm qua em đi tỉnh về
Hương đồng gió nội bay đi ít nhiều....
    `
  },
  {
    title: "Nàng đi lấy chồng - Nguyễn Bính",
    category: "Trữ tình",
    excerpt: `
  Hôm nay ăn hỏi tưng bừng
Ngày mai thì cưới, độ chừng ngày kia
Nàng cùng chồng mới nàng về
Rồi cùng chồng mới nàng đi theo chồng
Tôi về dạm vợ là xong
Vợ người làng, vợ xóm Đông quê mùa
Vợ tôi không đợi, không chờ
Không nhan sắc lắm, không thơ mộng gì
Lấy tôi bởi đã đến thì
Lấy tôi không phải bởi vì yêu tôi
Hôm nay tôi lấy vợ rồi
Từ đây tôi sẽ là người bỏ đi
Pháo ơi, mày nổ làm gì?
Biến ra tất cả pháo xì cho tao!
    `
  },
  {
    title: "Lá đỏ - Nguyễn Đình Thi",
    category: "Cách mạng",
    excerpt: `
  Gặp em trên cao lộng gió
Rừng lạ ào ào lá đỏ
Em đứng bên đường như quê hương
Vai ác bạc quàng súng trường.
Ðoàn quân vẫn đi vội vã
Bụi Trường Sơn nhoà trời lửa.
Chào em, em gái tiền phương
Hẹn gặp nhau nhé giữa Sài Gòn.
Em vẫy cười đôi mắt trong.
    `
  },
  {
    title: "Mặt Quê Hương - Tế Hanh",
    category: "Cách Mạng",
    excerpt: `
  Mặt em như tấm gương
Anh nhìn thấy quê hương
Kìa đôi mắt, đôi mắt
Dòng sông yêu trong vắt

Kìa vừng trán thanh thanh
Khoảng trời xa yên lành
Miệng em cười tươi thắm
Như vườn xanh nắng ấm

Hơi thở em chan hoà
Như hơi thở quê ta
Hôm qua ai thù giặc
Mà môi em mím chặt?

Hôm nay ai xót thương
Mà mi em mờ sương?
Ôi miền Nam yêu dấu
Trên mặt em yêu dấu

Ôi tháng năm nhớ thương
Mặt em là quê hương.
    `
  },
  {
    title: "Truyện Kiều I - Nguyễn Du",
    category: "Lục bát",
    excerpt: `
  Kiều Thăm Mộ Đạm Tiên (Câu 1-244)
1.Trăm năm trong cõi người ta,
Chữ tài chữ mệnh khéo là ghét nhau.
Trải qua một cuộc bể dâu,
Những điều trông thấy mà đau đớn lòng.
5.Lạ gì bỉ sắc tư phong,
Trời xanh quen thói má hồng đánh ghen.
Cảo thơm lần giở trước đèn,
Phong tình cổ lục còn truyền sử xanh.
Rằng năm Gia Tĩnh triều Minh,
10.Bốn phương phẳng lặng, hai kinh vững vàng.
Có nhà viên ngoại họ Vương,
Gia tư nghĩ cũng thường thường bực trung.
Một trai con thứ rốt lòng,
Vương Quan là chữ, nối dòng nho gia.
15.Đầu lòng hai ả tố nga,
Thúy Kiều là chị, em là Thúy Vân.
Mai cốt cách, tuyết tinh thần,
Mỗi người một vẻ, mười phân vẹn mười.
Vân xem trang trọng khác vời,
20.Khuôn trăng đầy đặn, nét ngài nở nang.
Hoa cười ngọc thốt đoan trang,
Mây thua nước tóc, tuyết nhường màu da.
Kiều càng sắc sảo, mặn mà,
So bề tài, sắc, lại là phần hơn.
25.Làn thu thủy, nét xuân sơn,
Hoa ghen thua thắm, liễu hờn kém xanh.
Một, hai nghiêng nước nghiêng thành,
Sắc đành đòi một, tài đành họa hai.
Thông minh vốn sẵn tư trời,
30.Pha nghề thi họa, đủ mùi ca ngâm.
Cung thương làu bậc ngũ âm,
Nghề riêng ăn đứt Hồ cầm một trương.
Khúc nhà tay lựa nên chương,
Một thiên bạc mệnh, lại càng não nhân.
35.Phong lưu rất mực hồng quần,
Xuân xanh sấp xỉ tới tuần cập kê
Êm đềm trướng rủ màn che,
Tường đông ong bướm đi về mặc ai.
Ngày xuân con én đưa thoi,
40.Thiều quang chín chục đã ngoài sáu mươi.
Cỏ non xanh tận chân trời,
Cành lê trắng điểm một vài bông hoa.
Thanh minh trong tiết tháng ba,
Lễ là tảo mộ, hội là đạp Thanh.
45.Gần xa nô nức yến anh,
Chị em sắm sửa bộ hành chơi xuân.
Dập dìu tài tử, giai nhân,
Ngựa xe như nước áo quần như nêm.
Ngổn ngang gò đống kéo lên,
50.Thoi vàng vó rắc tro tiền giấy bay.

Tà tà bóng ngả về tây,
Chị em thơ thẩn dan tay ra về.
Bước dần theo ngọn tiểu khê,
Lần xem phong cảnh có bề thanh thanh.
55.Nao nao dòng nước uốn quanh,
Dịp cầu nho nhỏ cuối ghềnh bắc ngang.
Sè sè nấm đất bên đàng,
Dàu dàu ngọn cỏ nửa vàng nửa xanh.
Rằng: Sao trong tiết thanh minh,
60.Mà đây hương khói vắng tanh thế mà?
Vương Quan mới dẫn gần xa:
Đạm Tiên nàng ấy xưa là ca nhi.
Nổi danh tài sắc một thì,
Xôn xao ngoài cửa hiếm gì yến anh.
65.Kiếp hồng nhan có mong manh,
Nửa chừng xuân thoắt gãy cành thiên hương.
Có người khách ở viễn phương,
Xa nghe cũng nức tiếng nàng tìm chơi.
Thuyền tình vừa ghé tới nơi,
70.Thì đà trâm gẫy bình rơi bao giờ.
Buồng không lạnh ngắt như tờ,
Dấu xe ngựa đã rêu lờ mờ xanh.
Khóc than khôn xiết sự tình,
Khéo vô duyên ấy là mình với ta.
75.Đã không duyên trước chăng mà,
Thì chi chút ước gọi là duyên sau.
Sắm xanh nếp tử xe châu,
Vùi nông một nấm mặc dầu cỏ hoa.
Trải bao thỏ lặn ác tà,
80.Ấy mồ vô chủ, ai mà viếng thăm!
Lòng đâu sẵn mối thương tâm,
Thoắt nghe Kiều đã đầm đầm châu sa.
Đau đớn thay phận đàn bà!
Lời rằng bạc mệnh cũng là lời chung.
85.Phũ phàng chi bấy hoá công,
Ngày xanh mòn mỏi má hồng phôi pha.
Sống làm vợ khắp người ta,
Khéo thay thác xuống làm ma không chồng.
Nào người phượng chạ loan chung,
90.Nào người tích lục tham hồng là ai?
Đã không kẻ đoái người hoài,
Sẵn đây ta kiếm một vài nén hương.
Gọi là gặp gỡ giữa đường,
Họa là người dưới suối vàng biết cho.
95.Lầm rầm khấn khứa nhỏ to,
Sụp ngồi vài gật trước mồ bước ra.
Một vùng cỏ áy bóng tà,
Gió hiu hiu thổi một vài bông lau.
Rút trâm sẵn giắt mái đầu,
100.Vạch da cây vịnh bốn câu ba vần.
Lại càng mê mẩn tâm thần
Lại càng đứng lặng tần ngần chẳng ra.
Lại càng ủ dột nét hoa,
Sầu tuôn đứt nối, châu sa vắn dài.
105.Vân rằng: Chị cũng nực cười,
Khéo dư nước mắt khóc người đời xưa.
Rằng: Hồng nhan tự thuở xưa,
Cái điều bạc mệnh có chừa ai đâu?
Nỗi niềm tưởng đến mà đau,
110.Thấy người nằm đó biết sau thế nào?
Quan rằng: Chị nói hay sao,
Một lời là một vận vào khó nghe.
Ở đây âm khí nặng nề,
Bóng chiều đã ngả dậm về còn xa.
115.Kiều rằng: Những đấng tài hoa,
Thác là thể phách, còn là tinh anh,
Dễ hay tình lại gặp tình,
Chờ xem ắt thấy hiển linh bây giờ.
Một lời nói chửa kịp thưa,
120.Phút đâu trận gió cuốn cờ đến ngay.
Ào ào đổ lộc rung cây,
Ở trong dường có hương bay ít nhiều.
Đè chừng ngọn gió lần theo,
Dấu giày từng bước in rêu rành rành.
125.Mắt nhìn ai nấy đều kinh,
Nàng rằng: Này thực tinh thành chẳng xa.
Hữu tình ta lại gặp ta,
Chớ nề u hiển mới là chị em.
Đã lòng hiển hiện cho xem,
Tạ lòng nàng lại nối thêm vài lời.
130.Lòng thơ lai láng bồi hồi,
Gốc cây lại vạch một bài cổ thi.

Dùng dằng nửa ở nửa về,
Nhạc vàng đâu đã tiếng nghe gần gần.
135.Trông chừng thấy một văn nhân,
Lỏng buông tay khấu bước lần dặm băng.
Đề huề lưng túi gió trăng,
Sau chân theo một vài thằng con con.
Tuyết in sắc ngựa câu giòn,
140.Cỏ pha màu áo nhuộm non da trời.
Nẻo xa mới tỏ mặt người,
Khách đà xuống ngựa tới nơi tự tình.
Hài văn lần bước dặm xanh,
Một vùng như thể cây quỳnh cành dao.
145.Chàng Vương quen mặt ra chào,
Hai Kiều e lệ nép vào dưới hoa.
Nguyên người quanh quất đâu xa,
Họ Kim tên Trọng vốn nhà trâm anh.
Nền phú hậu, bậc tài danh,
150.Văn chương nết đất, thông minh tính trời.
Phong tư tài mạo tót vời,
Vào trong phong nhã, ra ngoài hào hoa.
Chung quanh vẫn đất nước nhà,
Với Vương Quan trước vẫn là đồng thân.
155.Vẫn nghe thơm nức hương lân,
Một nền đồng Tước khoá xuân hai Kiều.
Nước non cách mấy buồng thêu,
Những là trộm nhớ thầm yêu chốc mòng.
May thay giải cấu tương phùng,
160.Gặp tuần đố lá thoả lòng tìm hoa.
Bóng hồng nhác thấy nẻo xa,
Xuân lan thu cúc mặn mà cả hai.
Người quốc sắc, kẻ thiên tài,
Tình trong như đã, mặt ngoài còn e.
165.Chập chờn cơn tỉnh cơn mê.
Rốn ngồi chẳng tiện, dứt về chỉn khôn.
Bóng tà như giục cơn buồn,
Khách đà lên ngựa, người còn nghé theo.
Dưới cầu nước chảy trong veo,
170.Bên cầu tơ liễu bóng chiều thướt tha.

Kiều từ trở gót trướng hoa,
Mặt trời gác núi chiêng đà thu không.
Mảnh trăng chênh chếch dòm song,
Vàng gieo ngấn nước, cây lồng bóng sân.
175.Hải đường lả ngọn đông lân,
Giọt sương gieo nặng cành xuân la đà.
Một mình lặng ngắm bóng nga,
Rộn đường gần với nỗi xa bời bời:
Người mà đến thế thì thôi,
180.Đời phồn hoa cũng là đời bỏ đi!
Người đâu gặp gỡ làm chi,
Trăm năm biết có duyên gì hay không?
Ngổn ngang trăm mối bên lòng,
Nên câu tuyệt diệu ngụ trong tính tình.
185.Chênh chênh bóng nguyệt xế mành,
Tựa nương bên triện một mình thiu thiu.
Thoắt đâu thấy một tiểu kiều,
Có chiều thanh vận, có chiều thanh tân.
Sương in mặt, tuyết pha thân,
190.Sen vàng lãng đãng như gần như xa.
Chào mừng đón hỏi dò la:
Đào nguyên lạc lối đâu mà đến đây?
Thưa rằng: Thanh khí xưa nay,
Mới cùng nhau lúc ban ngày đã quên.
195.Hàn gia ở mé tây thiên,
Dưới dòng nước chảy bên trên có cầu.
Mấy lòng hạ cố đến nhau,
Mấy lời hạ tứ ném châu gieo vàng.
Vâng trình hội chủ xem tường,
200.Mà sao trong sổ đoạn trường có tên.
Âu đành quả kiếp nhân duyên,
Cùng người một hội, một thuyền đâu xa!
Này mười bài mới mới ra,
Câu thần lại mượn bút hoa vẽ vời.
205.Kiều vâng lĩnh ý đề bài,
Tay tiên một vẫy đủ mười khúc ngâm.
Xem thơ nức nở khen thầm:
Giá đành tú khẩu cẩm tâm khác thường
Ví đem vào tập Đoạn Trường
210.Thì treo giải nhất chi nhường cho ai.
Thềm hoa khách đã trở hài,
Nàng còn cầm lại một hai tự tình.
Gió đâu xịch bức mành mành,
Tỉnh ra mới biết rằng mình chiêm bao.
215.Trông theo nào thấy đâu nào
Hương thừa dường hãy ra vào đâu đây.
Một mình lưỡng lự canh chầy,
Đường xa nghĩ nỗi sau này mà kinh.
Hoa trôi bèo dạt đã đành,
220.Biết duyên mình, biết phận mình thế thôi!
Nỗi riêng lớp lớp sóng dồi,
Nghĩ đòi cơn lại sụt sùi đòi cơn.
Giọng Kiều rền rĩ trướng loan,
Nhà Huyên chợt tỉnh hỏi: Cơn cớ gì?
225.Cớ sao trằn trọc canh khuya,
Màu hoa lê hãy dầm dề giọt mưa?
Thưa rằng: Chút phận ngây thơ,
Dưỡng sinh đôi nợ tóc tơ chưa đền.
Buổi ngày chơi mả Đạm Tiên,
230.Nhắp đi thoắt thấy ứng liền chiêm bao.
Đoạn trường là số thế nào,
Bài ra thế ấy, vịnh vào thế kia.
Cứ trong mộng triệu mà suy,
Phận con thôi có ra gì mai sau!
235.Dạy rằng: Mộng triệu cớ đâu,
Bỗng không mua não chuốc sầu nghĩ nao.
Vâng lời khuyên giải thấp cao,
Chưa xong điều nghĩ đã dào mạch Tương.
Ngoài song thỏ thẻ oanh vàng,
240.Nách tường bông liễu bay ngang trước mành.
Hiên tà gác bóng chênh chênh,
Nỗi riêng, riêng trạnh tấc riêng một mình.
Cho hay là thói hữu tình,
Đố ai gỡ mối tơ mành cho xong.
    `
  },
  {
    title: "Truyện Kiều II - Nguyễn Du",
    category: "Lục bát",
    excerpt: `
  Kiều Gặp Kim Trọng (Câu 245-572)
245.Chàng Kim từ lại thư song,
Nỗi nàng canh cánh bên lòng biếng khuây.
Sầu đong càng lắc càng đầy,
Ba thu dồn lại một ngày dài ghê.
Mây Tần khóa kín song the,
250.Bụi hồng lẽo đẽo đi về chiêm bao.
Tuần trăng khuyết, đĩa dầu hao,
Mặt mơ tưởng mặt, lòng ngao ngán lòng.
Buồng văn hơi giá như đồng,
Trúc se ngọn thỏ, tơ chùng phím loan.
255.Mành Tương phất phất gió đàn,
Hương gây mùi nhớ, trà khan giọng tình.
Vì chăng duyên nợ ba sinh,
Thì chi đem thói khuynh thành trêu ngươi.
Bâng khuâng nhớ cảnh, nhớ người,
260.Nhớ nơi kỳ ngộ vội dời chân đi.
Một vùng cỏ mọc xanh rì,
Nước ngâm trong vắt, thấy gì nữa đâu!
Gió chiều như gợi cơn sầu,
Vi lô hiu hắt như màu khảy trêu.
265.Nghề riêng nhớ ít tưởng nhiều,
Xăm xăm đè nẻo Lam Kiều lần sang.
Thâm nghiêm kín cổng cao tường,
Cạn dòng lá thắm dứt đường chim xanh.
Lơ thơ tơ liễu buông mành,
270.Con oanh học nói trên cành mỉa mai.
Mấy lần cửa đóng then cài,
Đầy thềm hoa rụng, biết người ở đâu?
Tần ngần đứng suốt giờ lâu,
Dạo quanh chợt thấy mái sau có nhà.
275.Là nhà Ngô Việt thương gia,
Buồng không để đó người xa chưa về.
Lấy điều du học hỏi thuê,
Túi đàn cặp sách đề huề dọn sang.
Có cây, có đá sẵn sàng,
280.Có hiên Lãm thúy, nét vàng chưa phai.
Mừng thầm chốn ấy chữ bài,
Ba sinh âu hẳn duyên trời chi đây.
Song hồ nửa khép cánh mây,
Tường đông ghé mắt ngày ngày hằng trông.
285.Tấc gang đồng tỏa nguyên phong,
Tuyệt mù nào thấy bóng hồng vào ra.
Nhẫn từ quán khách lân la,
Tuần trăng thấm thoắt nay đà thèm hai.
Cách tường phải buổi êm trời,
290.Dưới đào dường có bóng người thướt tha.
Buông cầm xốc áo vội ra,
Hương còn thơm nức, người đà vắng tanh.
Lần theo tường gấm dạo quanh,
Trên đào nhác thấy một cành kim thoa.
295.Giơ tay với lấy về nhà:
Này trong khuê các đâu mà đến đây?
Ngẫm âu người ấy báu này,
Chẳng duyên chưa dễ vào tay ai cầm!
Liền tay ngắm nghía biếng nằm,
300.Hãy còn thoang thoảng hương trầm chưa phai.

Tan sương đã thấy bóng người,
Quanh tường ra ý tìm tòi ngẩn ngơ.
Sinh đà có ý đợi chờ,
Cách tường lên tiếng xa đưa ướm lòng:
305.Thoa này bắt được hư không,
Biết đâu Hợp Phố mà mong châu về?
Tiếng Kiều nghe lọt bên kia:
Ơn lòng quân tử sá gì của rơi.
Chiếc thoa nào của mấy mươi,
310.Mà lòng trọng nghĩa khinh tài xiết bao!
Sinh rằng: Lân lý ra vào,
Gần đây nào phải người nào xa xôi.
Được rày nhờ chút thơm rơi,
Kể đà thiểu não lòng người bấy nay!
315.Bấy lâu mới được một ngày,
Dừng chân gạn chút niềm tây gọi là.
Vội về thêm lấy của nhà,
Xuyến vàng đôi chiếc khăn là một vuông.
Bậc mây rón bước ngọn tường,
320.Phải người hôm nọ rõ ràng chẳng nhe?
Sượng sùng giữ ý rụt rè,
Kẻ nhìn rõ mặt người e cúi đầu.
Rằng: Từ ngẫu nhĩ gặp nhau.
Thầm trông trộm nhớ bấy lâu đã chồn.
325.Xương mai tính đã rũ mòn,
Lần lừa ai biết hãy còn hôm nay!
Tháng tròn như gởi cung mây,
Trần trần một phận ấp cây đã liều!
Tiện đây xin một hai điều,
330.Đài gương soi đến dấu bèo cho chăng?
Ngần ngừ nàng mới thưa rằng:
Thói nhà băng tuyết chất hằng phỉ phong,
Dù khi lá thắm chỉ hồng,
Nên chăng thì cũng tại lòng mẹ cha.
335.Nặng lò xót liễu vì hoa,
Trẻ thơ đã biết đâu mà dám thưa!
Sinh rằng: Rày gió mai mưa,
Ngày xuân đã dễ tình cờ mấy khi!
Dù chăng xét tấm tình si,
340.Thiệt đây mà có ích gì đến ai?
Chút chi gắn bó một hai,
Cho đành rồi sẽ liệu bài mối manh.
Khuôn thiêng dù phụ tấc thành,
Cũng liều bỏ quá xuân xanh một đời.
345.Lượng xuân dù quyết hẹp hòi,
Công đeo đuổi chẳng thiệt thòi lắm ru!
Lặng nghe lời nói như ru,
Chiều xuân dễ khiến nét thu ngại ngùng.
Rằng: Trong buổi mới lạ lùng,
350.Nể lòng có lẽ cầm lòng cho đang!
Đã lòng quân tử đa mang,
Một lời vàng tạc đá vàng thủy chung.
Được lời như cởi tấm lòng,
Giờ kim hoàn với khăn hồng trao tay.
355.Rằng: Trăm năm cũng từ đây,
Của tin gọi một chút này làm ghi.
Sẵn tay khăn gấm quạt quỳ,
Với cành thoa ấy tức thì đổi trao.
Một lời vừa gắn tất giao,
360.Mái sau dường có xôn xao tiếng người.
Vội vàng lá rụng hoa rơi,
Chàng về viện sách nàng dời lầu trang.

Từ phen đá biết tuổi vàng,
Tình càng thấm thía dạ càng ngẩn ngơ.
365.Sông Tương một dải nông sờ,
Bên trông đầu nọ bên chờ suối kia.
Một tường tuyết trở sương che.
Tin xuân đâu dễ đi về cho năng.
Lần lần ngày gió đêm trăng,
370.Thưa hồng rậm lục đã chừng xuân qua.
Ngày vừa sinh nhật ngoại gia,
Trên hai đường dưới nữa là hai em.
Tưng bừng sắm sửa áo xiêm,
Biện dâng một lễ xa đem tấc thành.
375.Nhà lan thanh vắng một mình,
Ngẫm cơ hội ngộ đã dành hôm nay.
Thời trân thức thức sẵn bày,
Gót sen thoăn thoắt dạo ngay mái tường.
Cách hoa sẽ dặng tiếng vàng,
380.Dưới hoa đã thấy có chàng đứng trông:
Trách lòng hờ hững với lòng,
Lửa hương chốc để lạnh lùng bấy lâu.
Những là đắp nhớ đổi sầu,
Tuyết sương nhuốm nửa mái đầu hoa râm.
385.Nàng rằng: Gió bắt mưa cầm,
Đã cam tệ với tri âm bấy chầy.
Vắng nhà được buổi hôm nay,
Lấy lòng gọi chút ra đây tạ lòng!
Lần theo núi giả đi vòng,
390.Cuối tường dường có nẻo thông mới rào.
Xắn tay mở khóa động đào,
Rẽ mây trông tỏ lối vào Thiên-thai.
Mặt nhìn mặt càng thêm tươi,
Bên lời vạn phúc bên lời hàn huyên.
395.Sánh vai về chốn thư hiên,
Góp lời phong nguyệt nặng nguyền non sông.
Trên yên bút giá thi đồng,
Đạm thanh một bức tranh tùng treo trên.
Phong sương được vẻ thiên nhiên,
400.Mặt khen nét bút càng nhìn càng tươi.
Sinh rằng: Phác họa vừa rồi,
Phẩm đề xin một vài lời thêm hoa.
Tay tiên gió táp mưa sa,
Khoảng trên dừng bút thảo và bốn câu.
405.Khen: Tài nhả ngọc phun châu,
Nàng Ban ả Tạ cũng đâu thế này!
Kiếp tu xưa ví chưa dày,
Phúc nào nhắc được giá này cho ngang!
Nàng rằng: Trộm liếc dung quang,
410.Chẳng sân bội ngọc cũng phường kim môn.
Nghĩ mình phận mỏng cánh chuồn,
Khuôn xanh biết có vuông tròn mà hay?
Nhớ từ năm hãy thơ ngây,
Có người tướng sĩ đoán ngay một lời:
415.Anh hoa phát tiết ra ngoài,
Nghìn thu bạc mệnh một đời tài hoa.
Trông người lại ngẫm đến ta,
Một dầy một mỏng biết là có nên?
Sinh rằng: Giải cấu là duyên,
420.Xưa nay nhân định thắng thiên cũng nhiều.
Ví dù giải kết đến điều,
Thì đem vàng đá mà liều với thân!
Đủ điều trung khúc ân cần,
Lòng xuân phơi phới chén xuân tàng tàng.
425.Ngày vui ngắn chẳng đầy gang,
Trông ra ác đã ngậm gương non đoài.
Vắng nhà chẳng tiện ngồi dai,
Giã chàng nàng mới kíp dời song sa.

Đến nhà vừa thấy tin nhà,
430.Hai thân còn dở tiệc hoa chưa về.
Cửa ngoài vội rủ rèm the,
Xăm xăm băng lối vườn khuya một mình.
Nhặt thưa gương giọi đầu cành,
Ngọn đèn trông lọt trướng huỳnh hắt hiu.
435.Sinh vừa tựa án thiu thiu,
Dở chiều như tỉnh dở chiều như mê.
Tiếng sen sẽ động giấc hòe,
Bóng trăng đã xế hoa lê lại gần.
Bâng khuâng đỉnh Giáp non Thần,
440.Còn ngờ giấc mộng đêm xuân mơ màng.
Nàng rằng: Khoảng vắng đêm trường,
Vì hoa nên phải đánh đường tìm hoa.
Bây giờ rõ mặt đôi ta,
Biết đâu rồi nữa chẳng là chiêm bao?
445.Vội mừng làm lễ rước vào,
Đài sen nối sáp song đào thêm hương.
Tiên thề cùng thảo một chương,
Tóc mây một món dao vàng chia đôi.
Vầng trăng vằng vặc giữa trời,
450.Đinh ninh hai mặt một lời song song.
Tóc tơ căn vặn tấc lòng,
Trăm năm tạc một chữ đồng đến xương.
Chén hà sánh giọng quỳnh tương,
Dải là hương lộn bình gương bóng lồng.
455.Sinh rằng: Gió mát trăng trong,
Bấy lâu nay một chút lòng chưa cam.
Chày sương chưa nện cầu Lam,
Sợ lần khân quá ra sàm sỡ chăng?
Nàng rằng: Hồng diệp xích thằng,
460.Một lời cũng đã tiếng rằng tương tri.
Đừng điều nguyệt nọ hoa kia.
Ngoài ra ai lại tiếc gì với ai.
Rằng: Nghe nổi tiếng cầm đài,
Nước non luống những lắng tai Chung Kỳ.
465.Thưa rằng: Tiện kỹ sá chi,
Đã lòng dạy đến dạy thì phải vâng.
Hiên sau treo sẵn cầm trăng,
Vội vàng Sinh đã tay nâng ngang mày.
Nàng rằng: Nghề mọn riêng tay,
470.Làm chi cho bận lòng này lắm thân!
So dần dây vũ dây văn,
Bốn dây to nhỏ theo vần cung thương.
Khúc đâu Hán Sở chiến trường,
Nghe ra tiếng sắt tiếng vàng chen nhau.
475.Khúc đâu Tư mã Phượng cầu,
Nghe ra như oán như sầu phải chăng!
Kê Khang này khúc Quảng lăng,
Một rằng lưu thủy hai rằng hành vân.
Qua quan này khúc Chiêu Quân,
480.Nửa phần luyến chúa nửa phần tư gia.
Trong như tiếng hạc bay qua,
Đục như tiếng suối mới sa nửa vời.
Tiếng khoan như gió thoảng ngoài,
Tiếng mau sầm sập như trời đổ mưa.
485.Ngọn đèn khi tỏ khi mờ,
Khiến người ngồi đó cũng ngơ ngẩn sầu.
Khi tựa gối khi cúi đầu,
Khi vò chín khúc khi chau đôi mày.
Rằng: Hay thì thật là hay,
490.Nghe ra ngậm đắng nuốt cay thế nào!
Lựa chi những bậc tiêu tao,
Dột lòng mình cũng nao nao lòng người?
Rằng: Quen mất nết đi rồi,
Tẻ vui thôi cũng tính trời biết sao!
495.Lời vàng âm lĩnh ý cao,
Họa dần dần bớt chút nào được không.
Hoa hương càng tỏ thức hồng,
Đầu mày cuối mắt càng nồng tấm yêu.
Sóng tình dường đã xiêu xiêu,
500.Xem trong âu yếm có chiều lả lơi.
Thưa rằng: đừng lấy làm chơi,
Dẽ cho thưa hết một lời đã nao!
Vẻ chi một đóa yêu đào,
Vườn hồng chi dám ngăn rào chim xanh.
505.Đã cho vào bậc bố kinh,
Đạo tòng phu lấy chữ trinh làm đầu
Ra tuồng trên Bộc trong dâu,
Thì con người ấy ai cầu làm chi!
Phải điều ăn xổi ở thì,
510.Tiết trăm năm nỡ bỏ đi một ngày!
Ngẫm duyên kỳ ngộ xưa nay,
Lứa đôi ai đẹp lại tày Thôi Trương.
Mây mưa đánh đổ đá vàng,
Quá chiều nên đã chán chường yến anh.
505.Trong khi chắp cánh liền cành,
Mà lòng rẻ rúng đã dành một bên.
Mái tây để lạnh hương nguyền,
Cho duyên đằm thắm ra duyên bẽ bàng.
Gieo thoi trước chẳng giữ giàng,
520.Để sau nên thẹn cùng chàng bởi ai?
Vội chi liễu ép hoa nài,
Còn thân ắt lại đền bồi có khi!
Thấy lời đoan chính dễ nghe,
Chàng càng thêm nể thêm vì mười phân.

525.Bóng tàu vừa lạt vẻ ngân,
Tin đâu đã thấy cửa ngăn gọi vào.
Nàng thì vội trở buồng thêu,
Sinh thì dạo gót sân đào bước ra.
Cửa sài vừa ngỏ then hoa,
530.Gia đồng vào gởi thư nhà mới sang.
Đem tin thúc phụ từ đường,
Bơ vơ lữ thấn tha hương đề huề.
Liêu dương cách trở sơn khê,
Xuân đường kíp gọi sinh về hộ tang.
535.Mảng tin xiết nỗi kinh hoàng,
Băng mình lẻn trước đài trang tự tình.
Gót đầu mọi nỗi đinh ninh,
Nỗi nhà tang tóc nỗi mình xa xôi:
Sự đâu chưa kịp đôi hồi,
540.Duyên đâu chưa kịp một lời trao tơ,
Trăng thề còn đó trơ trơ,
Dám xa xôi mặt mà thưa thớt lòng.
Ngoài nghìn dặm chốc ba đông,
Mối sầu khi gỡ cho xong còn chầy!
545.Gìn vàng giữ ngọc cho hay,
Cho đành lòng kẻ chân mây cuối trời.
Tai nghe ruột rối bời bời,
Ngập ngừng nàng mới giãi lời trước sau:
Ông tơ ghét bỏ chi nhau,
550.Chưa vui sum họp đã sầu chia phôi!
Cùng nhau trót đã nặng lời,
Dẫu thay mái tóc dám dời lòng tơ!
Quản bao tháng đợi năm chờ,
Nghĩ người ăn gió nằm mưa xót thầm.
555.Đã nguyền hai chữ đồng tâm,
Trăm năm thề chẳng ôm cầm thuyền ai.
Còn non còn nước còn dài,
Còn về còn nhớ đến người hôm nay!
Dùng dằng chưa nỡ rời tay,
560.Vầng đông trông đã đứng ngay nóc nhà.
Ngại ngùng một bước một xa,
Một lời trân trọng châu sa mấy hàng.
Buộc yên quảy gánh vội vàng,
Mối sầu xẻ nửa bước đường chia hai.
565.Buồn trông phong cảnh quê người,
Đầu cành quyên nhặt cuối trời nhạn thưa.
Não người cữ gió tuần mưa,
Một ngày nặng gánh tương tư một ngày.
Nàng còn đứng tựa hiên tây,
570.Chín hồi vấn vít như vầy mối tơ.
Trông chừng khói ngất song thưa,
Hoa trôi trác thắm, liễu xơ xác vàng.
    `
  },
  {
    title: "Truyện Kiều III - Nguyễn Du",
    category: "Lục bát",
    excerpt: `
  Kiều Bán Mình Chuộc Cha (Câu 573-804)
Tần ngần dạo gót lầu trang,
Một đoàn mừng thọ ngoại hương mới về,
575.Hàn huyên chưa kịp giãi dề,
Sai nha bỗng thấy bốn bề xôn xao.
Người nách thước, kẻ tay đao;
Đầu trâu mặt ngựa ào ào như sôi.
Già giang một lão một trai,
580.Một dây vô lại buộc hai thâm tình.
Đầy nhà vang tiếng ruồi xanh,
Rụng rời khung dệt, tan tành gói may.
Đồ tế nhuyễn, của riêng tây,
Sạch sành sanh vét cho đầy túi tham.
585.Điều đâu bay buộc ai làm?
Này ai dan dậm, giật giàm bỗng dưng?
Hỏi ra sau mới biết rằng:
Phải tên xưng xuất là thằng bán tơ.
Một nhà hoảng hốt ngẩn ngơ,
590.Tiếng oan dậy đất, án ngờ lòa mây.
Hạ từ van lạy suốt ngày,
Điếc tai lân tuất, phũ tay tồi tàn.
Rường cao rút ngược dây oan,
Dẫu là đá cũng nát gan, lọ người.
595.Mặt trông đau đớn rụng rời,
Oan này còn một kêu trời, nhưng xa.
Một ngày lạ thói sai nha,
Làm cho khốc hại chẳng qua vì tiền.
Sao cho cốt nhục vẹn tuyền,
600.Trong khi ngộ biến tòng quyền biết sao?
Duyên hội ngộ, đức cù lao,
Bên tình bên hiếu, bên nào nặng hơn?
Để lời thệ hải minh sơn,
Làm con trước phải đền ơn sinh thành.
605.Quyết tình nàng mới hạ tình:
Dẽ cho để thiếp bán mình chuộc cha!
Họ Chung có kẻ lại già,
Cũng trong nha dịch lại là từ tâm.
Thấy nàng hiếu trọng tình thâm,
610.Vì nàng nghĩ cũng thương thầm xót vay.
Tính bài lót đó luồn đây,
Có ba trăm lạng việc này mới xuôi.
Hãy về tạm phó giam ngoài,
Dặn nàng qui liệu trong đôi ba ngày.
615.Thương tình con trẻ thơ ngây,
Gặp cơn vạ gió tai bay bất kỳ!
Đau lòng tử biệt sinh ly,
Thân còn chẳng tiếc, tiếc gì đến duyên!
Hạt mưa sá nghĩ phận hèn,
620.Liều đem tấc cỏ quyết đền ba xuân.

Sự lòng ngỏ với băng nhân,
Tin sương đồn đại xa gần xôn xao.
Gần miền có một mụ nào,
Đưa người viễn khách tìm vào vấn danh.
625.Hỏi tên rằng: Mã Giám sinh.
Hỏi quê, rằng: Huyện Lâm Thanh cũng gần.
Quá niên trạc ngoại tứ tuần,
Mày râu nhẵn nhụi, áo quần bảnh bao.
Trước thầy sau tớ lao xao
630.Nhà băng đưa mối rước vào lầu trang.
Ghế trên ngồi tót sỗ sàng,
Buồng trong mối đã giục nàng kíp ra.
Nỗi mình thêm tức nỗi nhà,
Thềm hoa một bước, lệ hoa mấy hàng!
635.Ngại ngùng giợn gió e sương,
Nhìn hoa bóng thẹn, trông gương mặt dày.
Mối càng vén tóc bắt tay,
Nét buồn như cúc, điệu gầy như mai.
Đắn đo cân sắc cân tài,
640.Ép cung cầm nguyệt, thử bài quạt thơ.
Mặn nồng một vẻ một ưa,
Bằng lòng khách mới tùy cơ dặt dìu.
Rằng: Mua ngọc đến Lam Kiều,
Sính nghi xin dạy bao nhiêu cho tường?
645.Mối rằng: đáng giá nghìn vàng,
Gấp nhà nhờ lượng người thương dám nài.
Cò kè bớt một thêm hai,
Giờ lâu ngã giá vàng ngoài bốn trăm.
Một lời thuyền đã êm dằm
650.Hãy đưa canh thiếp trước cầm làm ghi.
Định ngày nạp thái vu qui,
Tiền lưng đã sẵn việc gì chẳng xong!
Một lời cậy với Chung công,
Khất từ tạm lĩnh Vương ông về nhà.
655.Thương tình con trẻ cha già,
Nhìn nàng ông những máu sa ruột dàu:
Nuôi con những ước về sau,
Trao tơ phải lứa, gieo cầu đáng nơi.
Trời làm chi cực bấy trời,
660.Này ai vu thác cho người hợp tan!
Búa rìu bao quản thân tàn,
Nỡ đầy đọa trẻ, càng oan khốc già.
Một lần sau trước cũng là,
Thôi thì mặt khuất chẳng thà lòng đau!
665.Theo lời càng chảy dòng châu,
Liều mình ông rắp gieo đầu tường vôi.
Vội vàng kẻ giữ người coi,
Nhỏ to nàng lại tìm lời khuyên can:
Vẻ chi một mảnh hồng nhan,
670.Tóc tơ chưa chút đền ơn sinh thành.
Dâng thư đã thẹn nàng Oanh,
Lại thua ả Lý bán mình hay sao?
Cỗi xuân tuổi hạc càng cao,
Một cây gánh vác biết bao nhiêu cành.
675.Lòng tơ dù chẳng dứt tình,
Gió mưa âu hẳn tan tành nưóc non.
Thà rằng liều một thân con,
Hoa dù rã cánh, lá còn xanh cây.
Phận sao đành vậy cũng vầy,
680.Cầm như chẳng đậu những ngày còn xanh.
Cũng đừng tính quẩn lo quanh,
Tan nhà là một thiệt mình là hai.
Phải lời ông cũng êm tai,
Nhìn nhau giọt vắn giọt dài ngổn ngang.

685.Mái ngoài họ Mã vừa sang,
Tờ hoa đã ký, cân vàng mới trao.
Trăng già độc địa làm sao?
Cầm dây chẳng lựa buộc vào tự nhiên.
Trong tay đã sẵn đồng tiền,
690.Dầu lòng đổi trắng thay đen khó gì!
Họ Chung ra sức giúp vì,
Lễ tâm đã đặt, tụng kỳ cũng xong.
Việc nhà đã tạm thong dong,
Tinh kỳ giục giã đã mong độ về.
695.Một mình nàng ngọn đèn khuya,
Áo dầm giọt lệ, tóc xe mối sầu.
Phận dầu, dầu vậy cũng dầu,
Xót lòng đeo đẳng bấy lâu một lời!
Công trình kể biết mấy mươi.
700.Vì ta khăng khít, cho người dở dang.
Thề hoa chưa ráo chén vàng,
Lỗi thề thôi đã phụ phàng với hoa.
Trời Liêu non nước bao xa.
Nghĩ đâu rẽ cửa chia nhà tự tôi.
705.Biết bao duyên nợ thề bồi.
Kiếp này thôi thế thì thôi còn gì.
Tái sinh chưa dứt hương thề.
Làm thân trâu ngựa đền nghì trúc mai.
Nợ tình chưa trả cho ai,
710.Khối tình mang xuống tuyền đài chưa tan.
Nỗi riêng riêng những bàng hoàng,
Dầu chong trắng đĩa lệ tràn thấm khăn.
Thúy Vân chợt tỉnh giấc xuân,
Dưới đèn ghé đến ân cần hỏi han:
715.Cơ trời dâu bể đa đoan,
Một nhà để chị riêng oan một mình,
Cớ chi ngồi nhẫn tàn canh?
Nỗi riêng còn mắc mối tình chi đây?
Rằng: Lòng đương thổn thức đầy,
720.Tơ duyên còn vướng mối này chưa xong.
Hở môi ra cũng thẹn thùng,
Để lòng thì phụ tấm lòng với ai.
Cậy em, em có chịu lời,
Ngồi lên cho chị lạy rồi sẽ thưa.
725.Giữa đường đứt gánh tương tư,
Loan giao chắp mối tơ thừa mặc em.
Kể từ khi gặp chàng Kim,
Khi ngày quạt ước, khi đêm chén thề.
Sự đâu sóng gió bất kỳ,
730.Hiếu tình khôn lẽ hai bề vẹn hai!
Ngày xuân em hãy còn dài,
Xót tình máu mủ, thay lời nước non.
Chị dù thịt nát xương mòn,
Ngậm cười chín suối hãy còn thơm lây.
735.Chiếc thoa với bức tờ mây,
Duyên này thì giữ vật này của chung.
Dù em nên vợ nên chồng,
Xót người mệnh bạc, ắt lòng chẳng quên.
Mất người còn chút của tin,
740.Phím đàn với mảnh hương nguyền ngày xưa.
Mai sao dầu có bao giờ.
Đốt lò hương ấy, so tơ phím này.
Trông ra ngọn cỏ lá cây,
Thấy hiu hiu gió thì hay chị về.
745.Hồn còn mang nặng lời thề,
Nát thân bồ liễu, đền nghì trúc mai;
Dạ đài cách mặt khuất lời,
Rẩy xin chén nước cho người thác oan.
Bây giờ trâm gẫy bình tan,
750.Kể làm sao xiết muôn vàn ái ân.
Trăm nghìn gửi lại tình quân,
Tơ duyên ngắn ngủi có ngần ấy thôi.
Phận sao phận bạc như vôi,
Đã đành nước chẩy hoa trôi lỡ làng.
755.Ôi Kim lang! Hỡi Kim lang!
Thôi thôi thiếp đã phụ chàng từ đây!
Cạn lời hồn ngất máu say,
Một hơi lặng ngắt đôi tay giá đồng.

Xuân Huyên chợt tỉnh giấc nồng,
760.Một nhà tấp nập, kẻ trong người ngoài.
Kẻ thang người thuốc bời bời,
Mới dằn cơn vựng, chưa phai giọt hồng.
Hỏi: Sao ra sự lạ lùng?
Kiều càng nức nở mở không ra lời.
765.Nỗi nàng Vân mới rỉ tai,
Chiếc thoa này với tờ bồi ở đây..
Này cha làm lỗi duyên mày,
Thôi thì nỗi ấy sau này đã em.
Vì ai rụng cải rơi kim,
770.Để con bèo nổi mây chìm vì ai.
Lời con dặn lại một hai,
Dẫu mòn bia đá, dám sai tấc vàng.
Lậy thôi, nàng lại thưa chiềng,
Nhờ cha trả được nghĩa chàng cho xuôi.
775.Sá chi thân phận tôi đòi,
Dẫu rằng xương trắng quê người quản đâu.
Xiết bao kể nỗi thảm sầu!
Khắc canh đã giục nam lâu mấy hồi.
Kiệu hoa đâu đã đến ngoài,
780.Quản huyền đâu đã giục người sinh ly.
Đau lòng kẻ ở người đi,
Lệ rơi thấm đá tơ chia rũ tằm.
Trời hôm mây kéo tối rầm,
Rầu rầu ngọn cỏ đầm đầm cành sương.
785.Rước nàng về đến trú phường,
Bốn bề xuân khóa một nàng ở trong.
Ngập ngừng thẹn lục e hồng,
Nghĩ lòng lại xót xa lòng đòi phen.
Phẩm tiên rơi đến tay hèn,
790.Hoài công nắng giữ mưa gìn với ai:
Biết thân đến bước lạc loài,
Nhị đào thà bẻ cho người tình chung.
Vì ai ngăn đón gió đông,
Thiệt lòng khi ở đau lòng khi đi.
795.Trùng phùng dầu họa có khi,
Thân này thôi có còn gì mà mong.
Đã sinh ra số long đong,
Còn mang lấy kiếp má hồng được sao?
Trên yên sẵn có con dao,
800.Giấu cầm nàng đã gói vào chéo khăn:
Phòng khi nước đã đến chân,
Dao này thì liệu với thân sau này.
Đêm thu một khắc một chầy,
Bâng khuâng như tỉnh như say một mình.
    `
  },
  {
    title: "Truyện Kiều IV - Nguyễn Du",
    category: "Lục bát",
    excerpt: `
  Kiều Rơi Vào Tay Tú Bà & Mã Giám Sinh (Câu 805-1056)
805.Chẳng ngờ gã Mã Giám Sinh,
Vẫn là một đứa phong tình đã quen.
Quá chơi lại gặp hồi đen,
Quen mùi lại kiếm ăn miền nguyệt hoa.
Lầu xanh có mụ Tú Bà,
810.Làng chơi đã trở về già hết duyên.
Tình cờ chẳng hẹn mà nên,
Mạt cưa mướp đắng đôi bên một phường.
Chung lưng mở một ngôi hàng,
Quanh năm buôn phấn bán hương đã lề.
815.Dạo tìm khắp chợ thì quê,
Giả danh hầu hạ dạy nghề ăn chơi.
Rủi may âu cũng tại trời,
Đoạn trường lại chọn mặt người vô duyên.
Xót nàng chút phận thuyền quyên,
820.Cành hoa đem bán vào thuyền lái buôn.
Mẹo lừa đã mắc vào khuôn,
Sính nghi rẻ giá nghênh hôn sẵn ngày.
Mừng thầm: Cờ đã đến tay!
Càng nhìn vẻ ngọc càng say khúc vàng.
825.Đã nên quốc sắc thiên hương,
Một cười này hẳn nghìn vàng chẳng ngoa.
Về đây nước trước bẻ hoa,
Vương tôn quý khách ắt là đua nhau.
Hẳn ba trăm lạng kém đâu,
830.Cũng đà vừa vốn còn sau thì lời,
Miếng ngon kề đến tận nơi,
Vốn nhà cũng tiếc của trời cũng tham.
Đào tiên đã bén tay phàm,
Thì vin cành quít cho cam sự đời!
835.Dưới trần mấy mặt làng chơi,
Chơi hoa đã dễ mấy người biết hoa.
Nước vỏ lựu máu mào gà,
Mượn màu chiêu tập lại là còn nguyên.
Mập mờ đánh lận con đen,
840.Bao nhiêu cũng bấy nhiêu tiền mất chi?
Mụ già hoặc có điều gì,
Liều công mất một buổi quỳ mà thôi.
Vả đây đường xá xa xôi,
Mà ta bất động nữa người sinh nghi.
845.Tiếc thay một đóa trà mi,
Con ong đã tỏ đường đi lối về.
Một cơn mưa gió nặng nề,
Thương gì đến ngọc tiếc gì đến hương.
Đêm xuân một giấc mơ màng,
850.Đuốc hoa để đó, mặc nàng nằm trơ.
Giọt riêng tầm tã tuôn mưa,
Phần căm nỗi khách phần dơ nỗi mình:
Tuồng chi là giống hôi tanh,
Thân nghìn vàng để ô danh má hồng.
855.Thôi còn chi nữa mà mong?
Đời người thôi thế là xong một đời.
Giận duyên tủi phận bời bời,
Cầm dao nàng đã toan bài quyên sinh.
Nghĩ đi nghĩ lại một mình:
860.Một mình thì chớ hai tình thì sao?
Sao dầu sinh sự thế nào,
Truy nguyên chẳng kẻo lụy vào song thân.
Nỗi mình âu cũng giãn dần,
Kíp chầy thôi cũng một lần mà thôi.
865.Những là đo đắn ngược xuôi,
Tiếng gà nghe đã gáy sôi mái tường.

Lầu mai vừa rúc còi sương,
Mã Sinh giục giã vội vàng ra đi.
Đoạn trường thay lúc phân kỳ!
870.Vó câu khấp khểnh bóng xe gập ghềnh.
Bề ngoài mười dặm trường đình,
Vương ông mở tiệc tiễn hành đưa theo.
Ngoài thì chủ khách dập dìu,
Một nhà huyên với một Kiều ở trong.
875.Nhìn càng lã chã giọt hồng,
Rỉ tai nàng mới giãi lòng thấp cao:
Hổ sinh ra phận thơ đào,
Công cha nghĩa mẹ kiếp nào trả xong?
Lỡ làng nước đục bụi trong,
880.Trăm năm để một tấm lòng từ đây.
Xem gương trong bấy nhiêu ngày,
Thân con chẳng kẻo mắc tay bợm già!
Khi về bỏ vắng trong nhà,
Khi vào dùng dắng khi ra vội vàng.
885.Khi ăn khi nói lỡ làng,
Khi thầy khi tớ xem thường xem khinh.
Khác màu kẻ quý người thanh,
Ngẫm ra cho kỹ như hình con buôn.
Thôi con còn nói chi con?
890.Sống nhờ đất khách thác chôn quê người!
Vương bà nghe bấy nhiêu lời,
Tiếng oan đã muốn vạch trời kêu lên.
Vài tuần chưa cạn chén khuyên.
Mái ngoài nghỉ đã giục liền ruổi xe.
895.Xót con lòng nặng trì trì,
Trước yên ông đã nằn nì thấp cao:
Chút thân yếu liễu tơ đào,
Rớp nhà đến nỗi giấn vào tôi ngươi.
Từ đây góc bể bên trời,
900.Nắng mưa thui thủi quê người một thân.
Nghìn tầm nhờ bóng tùng quân,
Tuyết sương che chở cho thân cát đằng.
Cạn lời khách mới thưa rằng:
Buộc chân thôi cũng xích thằng nhiệm trao.
905.Mai sau dầu đến thế nào,
Kìa gương nhật nguyệt nọ dao quỉ thần!
Đùng đùng gió giục mây vần,
Một xe trong cõi hồng trần như bay.
Trông vời gạt lệ chia tay,
910.Góc trời thăm thẳm đêm ngày đăm đăm.
Nàng thì dặm khách xa xăm,
Bạc phau cầu giá đen rầm ngàn mây.
Vi lô san sát hơi may,
Một trời thu để riêng ai một người.
915.Dặm khuya ngất tạnh mù khơi,
Thấy trăng mà thẹn những lời non sông.
Rừng thu từng biếc xen hồng,
Nghe chim như nhắc tấm lòng thần hôn.

Những là lạ nước lạ non,
920.Lâm Truy vừa một tháng tròn tới nơi.
Xe châu dừng bánh cửa ngoài,
Rèm trong đã thấy một người bước ra.
Thoắt trông nhờn nhợt màu da,
Ăn gì cao lớn đẫy đà làm sao!
925.Trước xe lơi lả han chào,
Vâng lời nàng mới bước vào tận nơi.
Bên thì mấy ả mày ngài,
Bên thì ngồi bốn năm người làng chơi.
Giữa thì hương án hẳn hoi,
930.Trên treo một tượng trắng đôi lông mày.
Lầu xanh quen lối xưa nay,
Nghề này thì lấy ông này tiên sư,
Hương hôm hoa sớm phụng thờ.
Cô nào xấu vía có thưa mối hàng,
935.Cởi xiêm lột áo sỗ sàng,
Trước thần sẽ nguyện mảnh hương lầm rầm.
Đổi hoa lót xuống chiếu nằm,
Bướm hoa bay lại ầm ầm tứ vi!
Kiều còn ngơ ngẩn biết gì,
940.Cứ lời lạy xuống mụ thì khấn ngay:
Cửa hàng buôn bán cho may,
Đêm đêm Hàn thực ngày ngày Nguyên tiêu.
Muôn nghìn người thấy cũng yêu,
Xôn xao oanh yến rập rìu trúc mai.
945.Tin nhạn vẩn lá thư bài,
Đưa người cửa trước rước người cửa sau.
Lạ tai nghe chửa biết đâu,
Xem tình ra cũng những màu dở dang.
Lễ xong hương hỏa gia đường,
950.Tú Bà vắt nóc lên giường ngồi ngay.
Dạy rằng: Con lạy mẹ đây,
Lạy rồi sang lạy cậu mày bên kia.
Nàng rằng: Phải bước lưu ly,
Phận hèn vâng đã cam bề tiểu tinh.
955.Điều đâu lấy yến làm oanh,
Ngây thơ chẳng biết là danh phận gì?
Đủ điều nạp thái vu qui,
Đã khi chung chạ lại khi đứng ngồi.
Giờ ra thay mặt đổi ngôi,
960.Dám xin gửi lại một lời cho minh.
Mụ nghe nàng nói hay tình,
Bấy giờ mới nổi tam bành mụ lên:
Này này sự đã quả nhiên,
Thôi đà cướp sống chồng min đi rồi.
965.Bảo rằng đi dạo lấy người,
Đem về rước khách kiếm lời mà ăn.
Tuồng vô nghĩa ở bất nhân,
Buồn mình trước đã tần mần thử chơi.
Màu hồ đã mất đi rồi,
970.Thôi thôi vốn liếng đi đời nhà ma!
Con kia đã bán cho ta,
Nhập ra phải cứ phép nhà tao đây.
Lão kia có giở bài bây,
Chẳng văng vào mặt mà mày lại nghe.
975.Cớ sao chịu tốt một bề,
Gái tơ mà đã ngứa nghề sớm sao?
Phải làm cho biết phép tao!
Chập bì tiên rắp sấn vào ra tay.
Nàng rằng: Trời thẳm đất dày!
980.Thân này đã bỏ những ngày ra đi.
Thôi thì thôi có tiếc gì!
Sẵn dao tay áo tức thì giở ra.
Sợ gan nát ngọc liều hoa!
Mụ còn trông mặt nàng đà quá tay.
985.Thương ôi tài sắc bậc này,
Một dao oan nghiệt đứt dây phong trần.

Nỗi oan vỡ lở xa gần,
Trong nhà người chật một lần như nêm.
Nàng thì bằn bặt giấc tiên,
990.Mụ thì cầm cập mặt nhìn hồn bay.
Vực nàng vào chốn hiên tây,
Cắt người coi sóc chạy thầy thuốc thang.
Nào hay chưa hết trần duyên,
Trong mê dường đã đứng bên một nàng.
995.Rỉ rằng: Nhân quả dở dang,
Đã toan trốn nợ đoạn trường được sao?
Số còn nặng nợ má đào,
Người dầu muốn quyết trời nào đã cho.
Hãy xin hết kiếp liễu bồ,
1000.Sông Tiền đường sẽ hẹn hò về sau.
Thuốc thang suốt một ngày thâu,
Giấc mê nghe đã dàu dàu vừa tan.
Tú bà chực sẵn bên màn,
Lựa lời khuyên giải mơn man gỡ dần:
1005.Một người dễ có mấy thân!
Hoa xuân đương nhụy, ngày xuân còn dài.
Cũng là lỡ một lầm hai,
Đá vàng sao nỡ ép nài mưa mây!
Lỡ chưn trót đã vào đây,
1010.Khóa buồng xuân để đợi ngày đào non.
Người còn thì của hãy còn,
Tìm nơi xứng đáng là con cái nhà.
Làm chi tội báo oán gia,
Thiệt mình mà hại đến ta hay gì?
1015.Kề tai mấy mỗi nằn nì,
Nàng nghe dường cũng thị phi rạch ròi.
Vả suy thần mộng mấy lời,
Túc nhân âu cũng có trời ở trong.
Kiếp này nợ trả chưa xong,
1020.Làm chi thêm một nợ chồng kiếp sau!
Lặng nghe, thấm thía gót đầu,
Thưa rằng: Ai có muốn đâu thế này?
Được như lời, thế là may,
Hẳn rằng mai có như rày cho chăng!
1025.Sợ khi ong bướm đãi đằng,
Đến điều sống đục, sao bằng thác trong!
Mụ rằng: Con hãy thong dong,
Phải điều lòng lại dối lòng mà chơi!
Mai sau ở chẳng như lời,
1030.Trên đầu có bóng mặt trời rạng soi.
Thấy lời quyết đoán hẳn hoi,
Đành lòng, nàng cũng sẽ nguôi nguôi dần.
Trước lầu Ngưng Bích khóa xuân,
Vẻ non xa, tấm trăng gần, ở chung.
1035.Bốn bề bát ngát xa trông,
Cát vàng cồn nọ, bụi hồng dặm kia.
Bẽ bàng mây sớm đèn khuya,
Nửa tình, nửa cảnh như chia tấm lòng.
Tưởng người dưới nguyệt chén đồng,
1040.Tin sương luống những rày trông mai chờ.
Bên trời góc bể bơ vơ,
Tấm son gột rửa bao giờ cho phai.
Xót người tựa cửa hôm mai,
Quạt nồng ấp lạnh, những ai đó giờ?
1045.Sân Lai cách mấy nắng mưa,
Có khi gốc tử đã vừa người ôm?
Buồn trông cửa bể chiều hôm,
Thuyền ai thấp thoáng cánh buồm xa xa?
Buồn trông ngọn nước mới sa,
1050.Hoa trôi man mác, biết là về đâu?
Buồn trông nội cỏ dàu dàu,
Chân mây mặt đất một màu xanh xanh.
Buồn trông gió cuốn mặt ghềnh
Ầm ầm tiếng sóng kêu quanh ghế ngồị
1055.Chung quanh những nước non người,
Đau lòng lưu lạc, nên vài bốn câu.
    `
  },
  {
    title: "Truyện Kiều V - Nguyễn Du",
    category: "Lục bát",
    excerpt: `
  Kiều Mắc Lừa Sở Khanh (Câu 1057-1274)
Ngậm ngùi rủ bước rèm châu,
Cách tường, nghe có tiếng đâu họa vần.
Một chàng vừa trạc thanh xuân,
1060.Hình dong chải chuốt, áo khăn dịu dàng.
Nghĩ rằng cũng mạch thư hương,
Hỏi ra mới biết rằng chàng Sở Khanh.
Bóng Nga thấp thoáng dưới mành,
Trông nàng, chàng cũng ra tình đeo đai.
1065.Than ôi! sắc nước hương trời,
Tiếc cho đâu bỗng lạc loài đến đây?
Giá đành trong nguyệt trên mây,
Hoa sao, hoa khéo đọa đày bấy hoa?
Tức gan riêng giận trời già,
1070.Lòng này ai tỏ cho ta, hỡi lòng?
Thuyền quyên ví biết anh hùng,
Ra tay tháo cũi, sổ lồng như chơi!
Song thu đã khép cánh ngoài,
Tai còn đồng vọng mấy lời sắt đanh.
1075.Nghĩ người thôi lại nghĩ mình,
Cám lòng chua xót, nhạt tình chơ vơ.
Những là lần lữa nắng mưa,
Kiếp phong trần biết bao giờ mới thôi?
Đánh liều nhắn một hai lời,
1080.Nhờ tay tế độ vớt người trầm luân.
Mảnh tiên kể hết xa gần,
Nỗi nhà báo đáp, nỗi thân lạc loài.
Tan sương vừa rạng ngày mai,
Tiện hồng nàng mới nhắn lời gửi sang.
1085.Trời tây lãng đãng bóng vàng,
Phúc thư đã thấy tin chàng đến nơi.
Mở xem một bức tiên mai,
Rành rành tích việt có hai chữ đề.
Lấy trong ý tứ mà suy:
1090.Ngày hai mươi mốt, tuất thì phải chăng?
Chim hôm thoi thót về rừng,
Đóa trà mi đã ngậm trăng nửa vành.
Tường đông lay động bóng cành,
Rẽ song, đã thấy Sở Khanh lẻn vào.
1095.Sượng sùng đánh dạn ra chào,
Lạy thôi, nàng mới rỉ tai ân cần.
Rằng: Tôi bèo bọt chút thân,
Lạc đàn mang lấy nợ nần yến anh.
Dám nhờ cốt nhục tử sinh,
1100.Còn nhiều kết cỏ ngậm vành về sau!
Lặng nghe, lẩm nhẩm gật đầu:
Ta đây phải mượn ai đâu mà rằng!
Nàng đà biết đến ta chăng,
Bể trầm luân, lấp cho bằng mới thôi!
1105.Nàng rằng: Muôn sự ơn người,
Thế nào xin quyết một bài cho xong.
Rằng: Ta có ngựa truy phong,
Có tên dưới trướng, vốn dòng kiện nhi.
Thừa cơ lẻn bước ra đi,
1110.Ba mươi sáu chước, chước gì là hơn.
Dù khi gió kép, mưa đơn,
Có ta đây cũng chẳng cơn cớ gì!
Nghe lời nàng đã sinh nghi,
Song đà quá đỗi, quản gì được thân.
1115.Cũng liều nhắm mắt đưa chân,
Mà xem con Tạo xoay vần đến đâu!

Cùng nhau lẻn bước xuống lầu,
Song song ngựa trước, ngựa sau một đoàn.
Đêm thâu khắc lậu canh tàn,
1120.Gió cây trút lá, trăng ngàn ngậm gương.
Lối mòn cỏ nhợt mù sương,
Lòng quê đi một bước đường, một đau.
Tiếng gà xao xác gáy mau,
Tiếng người đâu đã mái sau dậy dàng.
Nàng càng thổn thức gan vàng,
Sở Khanh đã rẽ dây cương lối nào!
Một mình khôn biết làm sao,
Dặm rừng bước thấp, bước cao hãi hùng.
Hóa nhi thật có nỡ lòng,
1130.Làm chi dày tía, vò hồng, lắm nau!
Một đoàn đổ đến trước sau,
Vuốt đâu xuống đất, cánh đâu lên trời.
Tú bà tốc thẳng đến nơi,
Hầm hầm áp điệu một hơi lại nhà.
1135.Hung hăng chẳng nói chẳng tra,
Đang tay vùi liễu, giập hoa tơi bời.
Thịt da ai cũng là người,
Lòng nào hồng rụng, thắm rời chẳng đau.
Hết lời thú phục, khẩn cầu,
1140.Uốn lưng thịt đổ, cất đầu máu sa.
Rằng: Tôi chút phận đàn bà,
Nước non lìa cửa, lìa nhà, đến đây.
Bây giờ sống chết ở tay,
Thân này đã đến thế này thì thôi!
1145.Nhưng tôi có sá chi tôi,
Phận tôi đành vậy, vốn người để đâu?
Thân lươn bao quản lấm đầu,
Chút lòng trinh bạch từ sau xin chừa!
Được lời mụ mới tùy cơ,
1150.Bắt người bảo lĩnh làm tờ cung chiêu.
Bày vai có ả Mã Kiều,
Xót nàng, ra mới đánh liều chịu đoan.
Mụ càng kể nhặt, kể khoan,
Gạn gùng đến mực, nồng nàn mới tha.
1155.Vực nàng vào nghỉ trong nhà,
Mã Kiều lại ngỏ ý ra dặn lời:
Thôi đà mắc lận thì thôi!
Đi đâu chẳng biết con người Sở Khanh?
Bạc tình, nổi tiếng lầu xanh,
1160.Một tay chôn biết mấy cành phù dung!
Đà đao lập sẵn chước dùng,
Lạ gì một cốt một đồng xưa nay!
Có ba mươi lạng trao tay,
Không dưng chi có chuyện này, trò kia!
1165.Rồi ra trở mặt tức thì,
Bớt lời, liệu chớ sân si, thiệt đời!
Nàng rằng: Thề thốt nặng lời,
Có đâu mà lại ra người hiểm sâu!
Còn đương suy trước, nghĩ sau,
1170.Mặt mo đã thấy ở đâu dẫn vào.
Sở Khanh lên tiếng rêu rao:
Rằng nghe mới có con nào ở đây.
Phao cho quyến gió rủ mây,
Hãy xem có biết mặt này là ai
1175.Nàng rằng: Thôi thế thì thôi!
Rằng không, thì cũng vâng lời là không!
Sở Khanh quát mắng đùng đùng,
Sấn vào, vừa rắp thị hùng ra tay,
Nàng rằng: Trời nhé có hay!
1180.Quyến anh, rủ yến, sự này tại ai?
Đem người giẩy xuống giếng khơi,
Nói rồi, rồi lại ăn lời được ngay!
Còn tiên tích việt ở tay,
Rõ ràng mặt ấy, mặt này chứ ai?
1185.Lời ngay, đông mặt trong ngoài,
Kẻ chê bất nghĩa, người cười vô lương!
Phụ tình án đã rõ ràng,
Dơ tuồng, nghỉ mới kiếm đường tháo lui.
Buồng riêng, riêng những sụt sùi:
1190.Nghĩ thân, mà lại ngậm ngùi cho thân.
Tiếc thay trong giá trắng ngần,
Đến phong trần, cũng phong trần như ai!
Tẻ vui cũng một kiếp người,
Hồng nhan phải giống ở đời mãi ru!
1195.Kiếp xưa đã vụng đường tu,
Kiếp này chẳng kẻo đền bù mới xuôi!
Dù sao bình đã vỡ rồi,
Lấy thân mà trả nợ đời cho xong!

Vừa tuần nguyệt sáng, gương trong,
1200.Tú bà ghé lại thong dong dặn dò:
Nghề chơi cũng lắm công phu,
Làng chơi ta phải biết cho đủ điều.
Nàng rằng: Mưa gió dập dìu,
Liều thân, thì cũng phải liều thế thôi!
1205.Mụ rằng: Ai cũng như ai,
Người ta ai mất tiền hoài đến đây?
Ở trong còn lắm điều hay,
Nỗi đêm khép mở, nỗi ngày riêng chung.
Này con thuộc lấy nằm lòng,
1210.Vành ngoài bảy chữ, vành trong tám nghề.
Chơi cho liễu chán, hoa chê,
Cho lăn lóc đá, cho mê mẩn đời.
Khi khóe hạnh, khi nét ngài,
Khi ngâm ngợi nguyệt, khi cười cợt hoa.
1215.Đều là nghề nghiệp trong nhà,
Đủ ngần ấy nết, mới là người soi.
Gót đầu vâng dạy mấy lời,
Dường chau nét nguyệt, dường phai vẻ hồng.
Những nghe nói, đã thẹn thùng,
1220.Nước đời lắm nỗi lạ lùng, khắt khe!
Xót mình cửa các, buồng khuê,
Vỡ lòng, học lấy những nghề nghiệp hay!
Khéo là mặt dạn, mày dày,
Kiếp người đã đến thế này thì thôi!
1225.Thương thay thân phận lạc loài,
Dẫu sao cũng ở tay người biết sao?
Lầu xanh, mới rủ trướng đào,
Càng treo giá ngọc, càng cao phẩm người.
Biết bao bướm lả, ong lơi,
1230.Cuộc say đầy tháng, trận cười suốt đêm.
Dập dìu lá gió, cành chim,
Sớm đưa Tống Ngọc, tối tìm Tràng Khanh.
Khi tỉnh rượu, lúc tàn canh,
Giật mình, mình lại thương mình xót xa.
1235.Khi sao phong gấm rủ là,
Giờ sao tan tác như hoa giữa đường?
Mặt sao dày gió dạn sương,
Thân sao bướm chán, ong chường bấy thân?
Mặc người mưa Sở, mây Tần,
1240.Những mình nào biết có xuân là gì!
Đôi phen gió tựa, hoa kề,
Nửa rèm tuyết ngậm, bốn bề trăng thâu.
Cảnh nào cảnh chẳng đeo sầu,
Người buồn, cảnh có vui đâu bao giờ!
1245.Đòi phen nét vẽ, câu thơ,
Cung cầm trong nguyệt, nước cờ dưới hoa,
Vui là vui gượng kẻo mà,
Ai tri âm đó, mặn mà với ai?
Thờ ơ gió trúc, mưa mai,
1250.Ngẩn ngơ trăm nỗi, giùi mài một thân.
Ôm lòng đòi đoạn xa gần,
Chẳng vò mà rối, chẳng dần mà đau!
Nhớ ơn chín chữ cao sâu,
Một ngày một ngả bóng dâu tà tà.
1255.Dặm ngàn, nước thẳm, non xa,
Nghĩ đâu thân phận con ra thế này!
Sân hòe đôi chút thơ ngây
Trân cam, ai kẻ đỡ thay việc mình?
Nhớ lời nguyện ước ba sinh,
1260.Xa xôi ai có thấu tình chăng ai?
Khi về hỏi liễu Chương đài,
Cành xuân đã bẻ cho người chuyên tay.
Tình sâu mong trả nghĩa dày,
Hoa kia đã chắp cành này cho chưa?
1265.Mối tình đòi đoạn vò tơ,
Giấc hương quan luống lần mơ canh dài.
Song sa vò võ phương trời,
Nay hoàng hôn, đã lại mai hôn hoàng.
Lần lần thỏ bạc ác vàng,
1270.Xót người trong hội đoạn tràng đòi cơn!
Đã cho lấy chữ hồng nhan,
Làm cho, cho hại, cho tàn, cho cân!
Đã đày vào kiếp phong trần,
Sao cho sỉ nhục một lần mới thôi!
    `
  },
  {
    title: "Truyện Kiều VI - Nguyễn Du",
    category: "Lục bát",
    excerpt: `
  Kiều Gặp Thúc Sinh (Câu 1275-1472)
1275.Khách du bỗng có một người,
Kỳ Tâm họ Thúc cũng nòi thư hương.
Vốn người huyện Tích châu Thường,
Theo nghiêm đường mở ngôi hàng Lâm Tri.
Hoa khôi mộ tiếng Kiều nhi,
1280.Thiếp hồng tìm đến hương khuê gửi vào.
Trướng tô giáp mặt hoa đào,
Vẻ nào chẳng mặn nét nào chẳng ưa?
Hải đường mơn mởn cành tơ,
Ngày xuân càng gió càng mưa càng nồng.
1285.Nguyệt hoa hoa nguyệt não nùng,
Đêm xuân ai dễ cầm lòng được chăng?
Lạ gì thanh khí lẽ hằng,
Một dây một buộc ai giằng cho ra.
Sớm đào tối mận lân la,
1290.Trước còn trăng gió sau ra đá vàng.
Dịp đâu may mắn lạ dường,
Lại vừa gặp khoảng xuân đường lại quê.
Sinh càng một tỉnh mười mê,
Ngày xuân lắm lúc đi về với xuân.
1295.Khi gió gác khi trăng sân,
Bầu tiên chuốc rượu câu thần nối thơ.
Khi hương sớm khi trà trưa,
Bàn vây điểm nước đường tơ họa đàn.
Miệt mài trong cuộc truy hoan,
1300.Càng quen thuộc nết càng dan díu tình.
Lạ cho cái sóng khuynh thành,
Làm cho đổ quán xiêu đình như chơi.
Thúc sinh quen thói bốc rời,
Trăm nghìn đổ một trận cười như không.
1305.Mụ càng tô lục chuốt hồng,
Máu tham hễ thấy hơi đồng thì mê.

Dưới trăng quyên đã gọi hè,
Đầu tường lửa lựu lập loè đâm bông.
Buồng the phải buổi thong dong,
1310.Thang lan rủ bức trướng hồng tẩm hoa.
Rõ màu trong ngọc trắng ngà!
Dày dày sẵn đúc một tòa thiên nhiên.
Sinh càng tỏ nét càng khen,
Ngụ tình tay thảo một thiên luật đường.
1315.Nàng rằng: Vâng biết ý chàng.
Lời lời châu ngọc hàng hàng gấm thêu.
Hay hèn lẽ cũng nối điêu,
Nỗi quê nghĩ một hai điều ngang ngang.
Lòng còn gửi áng mây Vàng.
1320.Họa vần xin hãy chịu chàng hôm nay.
Rằng: Sao nói lạ lùng thay!
Cành kia chẳng phải cỗi này mà ra?
Nàng càng ủ đột thu ba,
Đoạn trường lúc ấy nghĩ mà buồn tênh:
1325.Thiếp như hoa đã lìa cành,
Chàng như con bướm lượn vành mà chơi.
Chúa xuân đành đã có nơi,
Vắn ngày thôi chớ dài lời làm chi.
Sinh rằng: Từ thuở tương tri,
1330.Tấm riêng riêng những nặng vì nước non.
Trăm năm tính cuộc vuông tròn,
Phải dò cho đến ngọn nguồn lạch sông.
Nàng rằng: Muôn đội ơn lòng.
Chút e bên thú bên tòng dễ đâu.
1335.Bình Khang nấn ná bấy lâu,
Yêu hoa yêu được một màu điểm trang.
Rồi ra lạt phấn phai hương,
Lòng kia giữ được thường thường mãi chăng?
Vả trong thềm quế cung trăng,
1340.Chủ trương đành đã chị Hằng ở trong.
Bấy lâu khăng khít dải đồng,
Thêm người người cũng chia lòng riêng tây.
Vẻ chi chút phận bèo mây,
Làm cho bể ái khi đầy khi vơi.
1345.Trăm điều ngang ngửa vì tôi,
Thân sau ai chịu tội trời ấy cho?
Như chàng có vững tay co,
Mười phần cũng đắp điếm cho một vài.
Thế trong dầu lớn hơn ngoài,
1350.Trước hàm sư tử gửi người đằng la.
Cúi đầu luồn xuống mái nhà,
Giấm chua lại tội bằng ba lửa nồng.
Ở trên còn có nhà thông,
Lượng trên trông xuống biết lòng có thương?
1355.Sá chi liễu ngõ hoa tường?
Lầu xanh lại bỏ ra phường lầu xanh.
Lại càng dơ dáng dại hình,
Đành thân phận thiếp ngại danh giá chàng.
Thương sao cho vẹn thì thương.
1360.Tính sao cho vẹn mọi đường xin vâng.
Sinh rằng: Hay nói đè chừng!
Lòng đây lòng đấy chưa từng hay sao?
Đường xa chớ ngại Ngô Lào,
Trăm điều hãy cứ trông vào một ta.
1365.Đã gần chi có điều xa?
Đá vàng đã quyết phong ba cũng liều.
Cùng nhau căn vặn đến điều,
Chỉ non thề bể nặng gieo đến lời.
Nỉ non đêm ngắn tình dài,
1370.Ngoài hiên thỏ đã non đoài ngậm gương.
Mượn điều trúc viện thừa lương,
Rước về hãy tạm giấu nàng một nơi.
Chiến hòa sắp sẵn hai bài,
Cậy tay thầy thợ mượn người dò la.
1375.Bắn tin đến mặt Tú bà,
Thua cơ mụ cũng cầu hòa dám sao.
Rõ ràng của dẫn tay trao,
Hoàn lương một thiếp thân vào cửa công.
Công tư đôi lẽ đều xong,
1380.Gót tiên phút đã thoát vòng trần ai.
Một nhà sum họp trúc mai,
Càng sâu nghĩa bể càng dài tình sông.
Hương càng đượm lửa càng nồng,
Càng sôi vẻ ngọc càng lồng màu sen.

1385.Nửa năm hơi tiếng vừa quen,
Sân ngô cành biếc đã chen lá vàng.
Giậu thu vừa nảy giò sương,
Gối yên đã thấy xuân đường đến nơi.
Phong lôi nổi trận bời bời,
1390.Nặng lòng e ấp tính bài phân chia.
Quyết ngay biện bạch một bề,
Dạy cho má phấn lại về lầu xanh.
Thấy lời nghiêm huấn rành rành,
Đánh liều sinh mới lấy tình nài kêu.
1395.Rằng: Con biết tội đã nhiều,
Dẫu rằng sấm sét búa rìu cũng cam.
Trót vì tay đã nhúng chàm,
Dại rồi còn biết khôn làm sao đây.
Cùng nhau vả tiếng một ngày,
1400.Ôm cầm ai nỡ dứt dây cho đành.
Lượng trên quyết chẳng thương tình,
Bạc đen thôi có tiếc mình làm chi.
Thấy lời sắt đá tri tri,
Sốt gan ông mới cáo quì cửa công.
1405.Đất bằng nổi sóng đùng đùng,
Phủ đường sai lá phiếu hồng thôi tra.
Cùng nhau theo gót sai nha,
Song song vào trước sân hoa lạy quì.
Trông lên mặt sắt đen sì,
1410.Lập nghiêm trước đã ra uy nặng lời:
Gã kia dại nết chơi bời,
Mà con người thế là người đong đưa.
Tuồng chi hoa thải hương thừa,
Mượn màu son phấn đánh lừa con đen.
1415.Suy trong tình trạng nguyên đơn,
Bề nào thì cũng chưa yên bề nào.
Phép công chiếu án luận vào.
Có hai đường ấy muốn sao mặc mình.
Một là cứ phép gia hình,
1420.Một là lại cứ lầu xanh phó về.
Nàng rằng: đã quyết một bề!
Nhện này vương lấy tơ kia mấy lần.
Đục trong thân cũng là thân.
Yếu thơ vâng chịu trước sân lôi đình!
1425.Dạy rằng: Cứ phép gia hình!
Ba cây chập lại một cành mẫu đơn.
Phận đành chi dám kêu oan,
Đào hoen quẹn má liễu tan tác mày.
Một sân lầm cát đã đầy,
1430.Gương lờ nước thủy mai gầy vóc sương.
Nghĩ tình chàng Thúc mà thương,
Nẻo xa trông thấy lòng càng xót xa.
Khóc rằng: Oan khốc vì ta!
Có nghe lời trước chẳng đà lụy sau.
1435.Cạn lòng chẳng biết nghĩ sâu.
Để ai trăng tủi hoa sầu vì ai.
Phủ đường nghe thoảng vào tai,
Động lòng lại gạn đến lời riêng tây.
Sụt sùi chàng mới thưa ngay,
1440.Đầu đuôi kể lại sự ngày cầu thân:
Nàng đà tính hết xa gần,
Từ xưa nàng đã biết thân có rày.
Tại tôi hứng lấy một tay,
Để nàng cho đến nỗi này vì tôi.
1445.Nghe lời nói cũng thương lời,
Dẹp uy mới dạy cho bài giải vi.
Rằng: Như hẳn có thế thì
Trăng hoa song cũng thị phi biết điều.
Sinh rằng: Chút phận bọt bèo,
1450.Theo đòi vả cũng ít nhiều bút nghiên.
Cười rằng: đã thế thì nên!
Mộc già hãy thử một thiên trình nghề.
Nàng vâng cất bút tay đề,
Tiên hoa trình trước án phê xem tường.
1455.Khen rằng: Giá đáng Thịnh đường!
Tài này sắc ấy nghìn vàng chưa cân!
Thật là tài tử giai nhân,
Châu Trần còn có Châu Trần nào hơn?
Thôi đừng rước dữ cưu hờn,
1460.Làm chi lỡ nhịp cho đòn ngang cung.
Đã đưa đến trước cửa công,
Ngoài thì là lý song trong là tình.
Dâu con trong đạo gia đình,
Thôi thì dẹp nỗi bất bình là xong.
1465.Kíp truyền sắm sửa lễ công,
Kiệu hoa cất gió đuốc hồng điểm sao.
Bày hàng cổ xúy xôn xao,
Song song đưa tới trướng đào sánh đôi.
Thương vì hạnh trọng vì tài,
1470.Thúc ông thôi cũng dẹp lời phong ba.
Huệ lan sực nức một nhà,
Từng cay đắng lại mặn mà hơn xưa.
    `
  },
  {
    title: "Truyện Kiều VII - Nguyễn Du",
    category: "Lục bát",
    excerpt: `
  Kiều Và Hoạn Thư (Câu 1473-1704)
Mảng vui rượu sớm cờ trưa,
Đào đà phai thắm sen vừa nẩy xanh.
1475.Trướng hồ vắng vẻ đêm thanh,
E tình nàng mới bày tình riêng chung:
Phận bồ từ vẹn chữ tòng,
Đổi thay nhạn yến đã hòng đầy niên.
Tin nhà ngày một vắng tin,
1480.Mặn tình cát lũy lạt tình tào khang.
Nghĩ ra thật cũng nên đường,
Tăm hơi ai dễ giữ giàng cho ta?
Trộm nghe kẻ lớn trong nhà,
Ở vào khuôn phép nói ra mối đường.
1485.E thay những dạ phi thường,
Dễ dò rốn bể khôn lường đáy sông!
Mà ta suốt một năm ròng,
Thế nào cũng chẳng giấu xong được nào
Bấy chầy chưa tỏ tiêu hao,
1490.Hoặc là trong có làm sao chăng là?
Xin chàng kíp liệu lại nhà,
Trước người đẹp ý sau ta biết tình.
Đêm ngày giữ mức giấu quanh,
Rày lần mai lữa như hình chưa thông.
1495.Nghe lời khuyên nhủ thong dong,
Đành lòng sinh mới quyết lòng hồi trang.
Rạng ra gửi đến xuân đường,
Thúc ông cũng vội giục chàng ninh gia.
Tiễn đưa một chén quan hà,
1500.Xuân đình thoắt đã dạo ra cao đình.
Sông Tần một dải xanh xanh,
Loi thoi bờ liễu mấy cành Dương quan.
Cầm tay dài ngắn thở than,
Chia phôi ngừng chén hợp tan nghẹn lời.
1505.Nàng rằng: Non nước xa khơi,
Sao cho trong ấm thì ngoài mới êm.
Dễ lòa yếm thắm trôn kim,
Làm chi bưng mắt bắt chim khó lòng!
Đôi ta chút nghĩa đèo bòng,
1510.Đến nhà trước liệu nói sòng cho minh.
Dù khi sóng gió bất tình,
Lớn ra uy lớn tôi đành phận tôi.
Hơn điều giấu ngược giấu xuôi.
Lại mang những việc tày trời đến sau.
1515.Thương nhau xin nhớ lời nhau,
Năm chầy cũng chẳng đi đâu mà chầy.
Chén đưa nhớ bữa hôm nay,
Chén mừng xin đợi ngày này năm sau!
Người lên ngựa kẻ chia bào,
1520.Rừng phong thu đã nhuốm màu quan san.
Dặm hồng bụi cuốn chinh an,
Trông người đã khuất mấy ngàn dâu xanh.
Người về chiếc bóng năm canh,
Kẻ đi muôn dặm một mình xa xôi.
1525.Vầng trăng ai xẻ làm đôi,
Nửa in gối chiếc, nửa soi dặm trường.

Kể chi những nỗi dọc đường,
Buồn trong này nỗi chủ trương ở nhà:
Vốn dòng họ Hoạn danh gia,
1530.Con quan Lại Bộ tên là Hoạn Thư.
Duyên đằng thuận nẻo gió đưa,
Cùng chàng kết tóc xe tơ những ngày.
Ở ăn thì nết cũng hay,
Nói điều ràng buộc thì tay cũng già.
1535.Từ nghe vườn mới thêm hoa,
Miệng người đã lắm tin nhà thì không.
Lửa tâm càng dập càng nồng,
Trách người đen bạc ra lòng trăng hoa:
Ví bằng thú thật cùng ta,
1540.Cũng dung kẻ dưới mới là lượng trên.
Dại chi chẳng giữ lấy nền,
Tốt chi mà rước tiếng ghen vào mình?
Lại còn bưng bít giấu quanh,
Làm chi những thói trẻ ranh nực cười!
1545.Tính rằng cách mặt khuất lời,
Giấu ta ta cũng liệu bài giấu cho!
Lo gì việc ấy mà lo,
Kiến trong miệng chén có bò đi đâu?
Làm cho nhìn chẳng được nhau,
1550.Làm cho đầy đọa cất đầu chẳng lên!
Làm cho trông thấy nhãn tiền,
Cho người thăm ván bán thuyền biết tay.
Nỗi lòng kín chẳng ai hay,
Ngoài tai để mặc gió bay mái ngoài.
1555.Tuần sau bỗng thấy hai người,
Mách tin ý cũng liệu bài tâng công.
Tiểu thư nổi giận đùng đùng:
Gớm tay thêu dệt ra lòng trêu ngươi!
Chồng tao nào phải như ai,
1560.Điều này hẳn miệng những người thị phi!
Vội vàng xuống lệnh ra uy,
Đứa thì vả miệng đứa thì bẻ răng.
Trong ngoài kín mít như bưng.
Nào ai còn dám nói năng một lời!
1565.Buồng đào khuya sớm thảnh thơi,
Ra vào một mực nói cười như không.
Đêm ngày lòng những dặn lòng,
Sinh đà về đến lầu hồng xuống yên.
Lời tan hợp nỗi hàn huyên,
1570.Chữ tình càng mặn chữ duyên càng nồng.
Tẩy trần vui chén thong dong,
Nỗi lòng ai ở trong lòng mà ra.
Chàng về xem ý tứ nhà,
Sự mình cũng rắp lân la giãi bày.
1575.Mấy phen cười nói tỉnh say,
Tóc tơ bất động mảy may sự tình.
Nghĩ đà bưng kín miệng bình,
Nào ai có khảo mà mình đã xưng?
Những là e ấp dùng dằng,
1580.Rút dây sợ nữa động rừng lại thôi.
Có khi vui chuyện mua cười,
Tiểu thư lại giở những lời đâu đâu.
Rằng: Trong ngọc đá vàng thau,
Mười phần ta đã tin nhau cả mười.
1585.Khen cho những chuyện dông dài,
Bướm ong lại đặt những lời nọ kia.
Thiếp dù bụng chẳng hay suy,
Đã dơ bụng nghĩ lại bia miệng cười!
Thấy lời thủng thỉnh như chơi,
1590.Thuận lời chàng cũng nói xuôi đỡ đòn.
Những là cười phấn cợt son,
Đèn khuya chung bóng trăng tròn sánh vai.
Thú quê thuần hức bén mùi,
Giếng vàng đã rụng một vài lá ngô.

1595.Chạnh niềm nhớ cảnh giang hồ,
Một màu quan tái mấy mùa gió trăng.
Tình riêng chưa dám rỉ răng,
Tiểu thư trước đã liệu chừng nhủ qua:
Cách năm mây bạc xa xa,
1600.Lâm Tri cũng phải tính mà thần hôn.
Được lời như cởi tấc son,
Vó câu chẳng ruổi nước non quê người.
Long lanh đáy nước in trời,
Thành xây khói biếc non phơi bóng vàng.
1605.Roi câu vừa gióng dặm trường,
Xe hương nàng cũng thuận đường quy ninh.
Thưa nhà huyên hết mọi tình,
Nỗi chàng ở bạc nỗi mình chịu đen.
Nghĩ rằng: Ngứa ghẻ hờn ghen,
1610.Xấu chàng mà có ai khen chi mình!
Vậy nên ngảnh mặt làm thinh,
Mưu cao vốn đã rắp ranh những ngày.
Lâm Tri đường bộ tháng chầy,
Mà đường hải đạo sang ngay thì gần.
1615.Dọn thuyền lựa mặt gia nhân,
Hãy đem dây xích buộc chân nàng về.
Làm cho cho mệt cho mê,
Làm cho đau đớn ê chề cho coi!
Trước cho bõ ghét những người,
1620.Sau cho để một trò cười về sau.
Phu nhân khen chước rất mầu,
Chiều con mới dạy mặc dầu ra tay.
Sửa sang buồm gió lèo mây,
Khuyển ưng lại chọn một bầy côn quang.
1625.Dặn dò hết các mọi đường,
Thuận phong một lá vượt sang bến Tề.

Nàng từ chiếc bóng song the,
Đường kia nỗi nọ như chia mối sầu.
Bóng đâu đã xế ngang đầu,
1630.Biết đâu ấm lạnh biết đâu ngọt bùi.
Tóc thề đã chấm ngang vai,
Nào lời non nước nào lời sắt son.
Sắn bìm chút phận cỏn con,
Khuôn duyên biết có vuông tròn cho chăng?
1635.Thân sao nhiều nỗi bất bằng,
Liều như cung Quảng ả Hằng nghĩ nao!
Đêm thu gió lọt song đào,
Nửa vành trăng khuyết ba sao giữa trời.
Nén hương đến trước Phật đài,
1640.Nỗi lòng khấn chửa cạn lời vân vân.
Dưới hoa dậy lũ ác nhân,
Ầm ầm khốc quỷ kinh thần mọc ra.
Đầy sân gươm tuốt sáng lòa,
Thất kinh nàng chửa biết là làm sao.
1645.Thuốc mê đâu đã rưới vào,
Mơ màng như giấc chiêm bao biết gì.
Vực ngay lên ngựa tức thì,
Phòng đào viện sách bốn bề lửa dong.
Sẵn thây vô chủ bên sông,
1650.Đem vào để đó lộn sòng ai hay?
Tôi đòi phách lạc hồn bay,
Pha càn bụi cỏ gốc cây ẩn mình.
Thúc ông nhà cũng gần quanh,
Chợt trông ngọn lửa thất kinh rụng rời.
1655.Tớ thầy chạy thẳng đến nơi,
Tơi bời tưới lửa tìm người lao xao.
Gió cao ngọn lửa càng cao,
Tôi đòi tìm đủ nàng nào thấy đâu!
Hớt hơ hớt hải nhìn nhau,
1660.Giếng sâu bụi rậm trước sau tìm quàng.
Chạy vào chốn cũ phòng hương,
Trong tro thấy một đống xương cháy tàn.
Tình ngay ai biết mưu gian,
Hẳn nàng thôi lại còn bàn rằng ai!
1665.Thúc ông sùi sụt ngắn dài,
Nghĩ con vắng vẻ thương người nết na.
Di hài nhặt gói về nhà,
Nào là khâm liệm nào là tang trai.
Lễ thường đã đủ một hai,
1670.Lục trình chàng cũng đến nơi bấy giờ.
Bước vào chốn cũ lầu thơ,
Tro than một đống nắng mưa bốn tường.
Sang nhà cha tới trung đường,
Linh sàng bài vị thờ nàng ở trên.
1675.Hỡi ôi nói hết sự duyên,
Tơ tình đứt ruột lửa phiền cháy gan!
Gieo mình vật vã khóc than:
Con người thế ấy thác oan thế này.
Chắc rằng mai trúc lại vầy,
1680.Ai hay vĩnh quyết là ngày đưa nhau!
Thương càng nghĩ nghĩ càng đau,
Dễ ai lấp thảm quạt sầu cho khuây.
Gần miền nghe có một thầy,
Phi phù trí quỷ cao tay thông huyền.
1685.Trên tam đảo dưới cửu tuyền,
Tìm đâu thì cũng biết tin rõ ràng.
Sắm sanh lễ vật rước sang,
Xin tìm cho thấy mặt nàng hỏi han.
Đạo nhân phục trước tĩnh đàn,
1690.Xuất thần giây phút chưa tàn nén hương.
Trở về minh bạch nói tường:
Mặt nàng chẳng thấy việc nàng đã tra.
Người này nặng kiếp oan gia,
Còn nhiều nợ lắm sao đà thoát cho!
1695.Mệnh cung đang mắc nạn to,
Một năm nữa mới thăm dò được tin.
Hai bên giáp mặt chiền chiền,
Muốn nhìn mà chẳng dám nhìn lạ thay!
Điều đâu nói lạ dường này,
1700.Sự nàng đã thế lời thầy dám tin!
Chẳng qua đồng cốt quàng xiên,
Người đâu mà lại thấy trên cõi trần?
Tiếc hoa những ngậm ngùi xuân,
Thân này dễ lại mấy lần gặp tiên.

1705.Nước trôi hoa rụng đã yên,
Hay đâu địa ngục ở miền nhân gian.
Khuyển ưng đã đắt mưu gian,
Vực nàng đưa xuống để an dưới thuyền.
Buồm cao lèo thẳng cánh suyền,
1710.Đè chừng huyện Tích băng miền vượt sang.
Dỡ đò lên trước sảnh đường,
Khuyển ưng hai đứa nộp nàng dâng công.
Vực nàng tạm xuống môn phòng,
Hãy còn thiêm thiếp giấc nồng chưa phai.
1715.Hoàng lương chợt tỉnh hồn mai,
Cửa nhà đâu mất lâu đài nào đây?
Bàng hoàng giở tỉnh giở say,
Sảnh đường mảng tiếng đòi ngay lên hầu.
A hoàn trên dưới giục mau,
1720.Hãi hùng nàng mới theo sau một người.
Ngước trông tòa rộng dãy dài,
Thiên Quan Trủng Tể có bài treo trên.
Ban ngày sáp thắp hai bên,
Giữa giường thất bảo ngồi trên một bà.
1725.Gạn gùng ngọn hỏi ngành tra,
Sự mình nàng phải cứ mà gửi thưa.
Bất tình nổi trận mây mưa,
Mắng rằng: Những giống bơ thờ quen thân!
Con này chẳng phải thiện nhân,
1730.Chẳng phường trốn chúa thì quân lộn chồng.
Ra tuồng mèo mả gà đồng,
Ra tuồng lúng túng chẳng xong bề nào.
Đã đem mình bán cửa tao,
Lại còn khủng khỉnh làm cao thế này.
1735.Nào là gia pháp nọ bay!
Hãy cho ba chục biết tay một lần.
A hoàn trên dưới dạ ran,
Dẫu rằng trăm miệng không phân lẽ nào.
Trúc côn ra sức đập vào,
1740.Thịt nào chẳng nát gan nào chẳng kinh.
Xót thay đào lý một cành,
Một phen mưa gió tan tành một phen.
Hoa nô truyền dạy đổi tên,
Buồng the dạy ép vào phiên thị tì.
1745.Ra vào theo lũ thanh y,
Dãi dầu tóc rối da chì quản bao.
Quản gia có một mụ nào,
Thấy người thấy nết ra vào mà thương.
Khi chè chén khi thuốc thang,
1750.Đem lời phương tiện mở đường hiếu sinh.
Dạy rằng: May rủi đã đành,
Liễu bồ mình giữ lấy mình cho hay.
Cũng là oan nghiệp chi đây,
Sa cơ mới đến thế này chẳng dưng.
1755.Ở đây tai vách mạch rừng,
Thấy ai người cũ cũng đừng nhìn chi.
Kẻo khi sấm sét bất kỳ,
Con ong cái kiến kêu gì được oan?
Nàng càng giọt ngọc như chan,
1760.Nỗi lòng luống những bàng hoàng niềm tây:
Phong trần kiếp chịu đã đầy,
Lầm than lại có thứ này bằng hai.
Phận sao bạc chẳng vừa thôi,
Khăng khăng buộc mãi lấy người hồng nhan.
1765.Đã đành túc trái tiền oan,
Cũng liều ngọc nát hoa tàn mà chi.
Những là nương náu qua thì,
Tiểu thư phải buổi mới về ninh gia.
Mẹ con trò chuyện lân la,
1770.Phu nhân mới gọi nàng ra dạy lời:
Tiểu thư dưới trướng thiếu người,
Cho về bên ấy theo đòi lầu trang.

Lãnh lời nàng mới theo sang,
Biết đâu địa ngục thiên đàng là đâu.
1775.Sớm khuya khăn mắt lược đầu,
Phận con hầu giữ con hầu dám sai.
Phải đêm êm ả chiều trời,
Trúc tơ hỏi đến nghề chơi mọi ngày.
Lĩnh lời nàng mới lựa dây,
1780.Nỉ non thánh thót dễ say lòng người.
Tiểu thư xem cũng thương tài,
Khuôn uy dường cũng bớt vài bốn phân.
Cửa người đày đọa chút thân,
Sớm ngơ ngẩn bóng đêm năn nỉ lòng.
1785.Lâm Tri chút nghĩa đèo bồng,
Nước bèo để chữ tương phùng kiếp sau.
Bốn phương mây trắng một màu,
Trông vời cố quốc biết đâu là nhà.
Lần lần tháng trọn ngày qua,
1790.Nỗi gần nào biết đường xa thế này.
Lâm Tri từ thuở uyên bay,
Buồng không thương kẻ tháng ngày chiếc thân.
Mày ai trăng mới in ngần,
Phần thừa hương cũ bội phần xót xa.
1795.Sen tàn cúc lại nở hoa,
Sầu dài ngày ngắn đông đà sang xuân.
Tìm đâu cho thấy cố nhân?
Lấy câu vận mệnh khuây dần nhớ thương.

Chạnh niềm nhớ cảnh gia hương,
1800.Nhớ quê chàng lại tìm đường thăm quê.
Tiểu thư đón cửa giãi giề,
Hàn huyên vừa cạn mọi bề gần xa.
Nhà hương cao cuốn bức là,
Buồng trong truyền gọi nàng ra lạy mừng.
1805.Bước ra một bước một dừng,
Trông xa nàng đã tỏ chừng nẻo xa:
Phải chăng nắng quáng đèn lòa,
Rõ ràng ngồi đó chẳng là Thúc Sinh?
Bây giờ tình mới rõ tình,
1810.Thôi thôi đã mắc vào vành chẳng sai.
Chước đâu có chước lạ đời?
Người đâu mà lại có người tinh ma?
Rõ ràng thật lứa đôi ta,
Làm ra con ở chúa nhà đôi nơi.
1815.Bề ngoài thơn thớt nói cười,
Mà trong nham hiểm giết người không dao.
Bây giờ đất thấp trời cao,
Ăn làm sao nói làm sao bây giờ?
Càng trông mặt càng ngẩn ngơ,
1820.Ruột tằm đòi đoạn như tơ rối bời.
Sợ uy dám chẳng vâng lời,
Cúi đầu nép xuống sân mai một chiều.
Sinh đà phách lạc hồn siêu:
Thương ơi chẳng phải nàng Kiều ở đây?
1825.Nhân làm sao đến thế này?
Thôi thôi ta đã mắc tay ai rồi!
Sợ quen dám hở ra lời,
Không ngăn giọt ngọc sụt sùi nhỏ sa.
Tiểu thư trông mặt hỏi tra:
1830.Mới về có việc chi mà động dong?
Sinh rằng hiếu phục vừa xong,
Suy lòng trắc dĩ đau lòng chung thiên.
Khen rằng: Hiếu tử đã nên!
Tẩy trần mượn chén giải phiền đêm thu.
1835.Vợ chồng chén tạc chén thù,
Bắt nàng đứng chực trì hồ hai nơi.
Bắt khoan bắt nhặt đến lời,
Bắt quì tận mặt bắt mời tận tay.
Sinh càng như dại như ngây,
1840.Giọt dài giọt ngắn chén đầy chén vơi.
Ngảnh đi chợt nói chợt cười,
Cáo say chàng đã giạm bài lảng ra.
Tiểu thư vội thét: Con Hoa!
Khuyên chàng chẳng cạn thì ta có đòn.
1845.Sinh càng nát ruột tan hồn,
Chén mời phải ngậm bồ hòn ráo ngay.
Tiểu thư cười nói tỉnh say,
Chưa xong cuộc rượu lại bày trò chơi.
Rằng: Hoa nô đủ mọi tài,
1850.Bản đàn thử dạo một bài chàng nghe.
Nàng đà tán hoán tê mê,
Vâng lời ra trước bình the vặn đàn.
Bốn dây như khóc như than,
Khiến người trên tiệc cũng tan nát lòng.
1855.Cùng chung một tiếng tơ đồng,
Người ngoài cười nụ người trong khóc thầm.
Giọt châu lã chã khôn cầm,
Cúi đầu chàng những gạt thầm giọt Tương.
Tiểu thư lại thét lấy nàng:
1860.Cuộc vui gảy khúc đoạn trường ấy chi?
Sao chẳng biết ý tứ gì?
Cho chàng buồn bã tội thì tại ngươi.
Sinh càng thảm thiết bồi hồi,
Vội vàng gượng nói gượng cười cho qua.
1865.Giọt rồng canh đã điểm ba,
Tiểu thư nhìn mặt dường đà can tâm.
Lòng riêng khấp khởi mừng thầm:
Vui này đã bõ đau ngầm xưa nay.
Sinh thì gan héo ruột đầy,
1870.Nỗi lòng càng nghĩ càng cay đắng lòng.

Người vào chung gối loan phòng,
Nàng ra tựa bóng đèn chong canh dài:
Bây giờ mới rõ tăm hơi,
Máu ghen đâu có lạ đời nhà ghen!
1875.Chước đâu rẽ thúy chia uyên,
Ai ra đường nấy ai nhìn được ai.
Bây giờ một vực một trời,
Hết điều khinh trọng hết lời thị phi.
Nhẹ như bấc nặng như chì,
1880.Gỡ cho ra nữa còn gì là duyên?
Lỡ làng chút phận thuyền quyên,
Bể sâu sóng cả có tuyền được vay?
Một mình âm ỉ đêm chày,
Đĩa dầu vơi nước mắt đầy năm canh.
1885.Sớm trưa hầu hạ đài doanh,
Tiểu thư chạm mặt đè tình hỏi tra.
Lựa lời nàng mới thưa qua:
Phải khi mình lại xót xa nỗi mình.
Tiểu thư hỏi lại Thúc Sinh:
1890.Cậy chàng tra lấy thực tình cho nao!
Sinh đà rát ruột như bào,
Nói ra chẳng tiện trông vào chẳng đang!
Những e lại lụy đến nàng,
Đánh liều mới sẽ lựa đường hỏi tra.
1895.Cúi đầu quỳ trước sân hoa,
Thân cung nàng mới dâng qua một tờ.
Diện tiền trình với Tiểu thư,
Thoạt xem dường có ngẩn ngơ chút tình.
Liền tay trao lại Thúc Sinh,
1900.Rằng: Tài nên trọng mà tình nên thương!
Ví chăng có số giàu sang,
Giá này dẫu đúc nhà vàng cũng nên!
Bể trần chìm nổi thuyền quyên,
Hữu tài thương nỗi vô duyên lạ đời!
1905.Sinh rằng: Thật có như lời,
Hồng nhan bạc mệnh một người nào vay!
Nghìn xưa âu cũng thế này,
Từ bi âu liệu bớt tay mới vừa.
Tiểu thư rằng: ý trong tờ,
1910.Rắp đem mệnh bạc xin nhờ cửa Không.
Thôi thì thôi cũng chiều lòng,
Cũng cho khỏi lụy trong vòng bước ra.
Sẵn Quan Âm Các vườn ta,
Có cây trăm thước, có hoa bốn mùa.
1915.Có cổ thụ, có sơn hồ,
Cho nàng ra đó giữ chùa chép kinh.
Tàng tàng trời mới bình minh,
Hương hoa, ngũ cúng, sắm sanh lễ thường.
Đưa nàng đến trước Phật đường,
1920.Tam qui, ngũ giới, cho nàng xuất gia.
Áo xanh đổi lấy cà sa,
Pháp danh lại đổi tên ra Trạc Tuyền.
Sớm khuya sắm đủ dầu đèn,
Xuân, Thu, cắt sẵn hai tên hương trà.
1925.Nàng từ lánh gót vườn hoa,
Dường gần rừng tía, dường xa bụi hồng.
Nhân duyên đâu lại còn mong,
Khỏi điều thẹn phấn, tủi hồng thì thôi.
Phật tiền thảm lấp sầu vùi,
1930.Ngày pho thủ tự, đêm nồi tâm hương.
Cho hay giọt nước cành dương,
Lửa lòng tưới tắt mọi đường trần duyên.
Nâu sồng từ trở màu thiền,
Sân thu trăng đã vài phen đứng đầu,
1935.Cửa thiền, then nhặt, lưới mau,
Nói lời trước mặt, rời châu vắng người.

Gác kinh viện sách đôi nơi,
Trong gang tấc lại gấp mười quan san.
Những là ngậm thở nuốt than,
1940.Tiểu thư phải buổi vấn an về nhà.
Thừa cơ, sinh mới lẻn ra,
Xăm xăm đến mé vườn hoa với nàng.
Sụt sùi giở nỗi đoạn tràng,
Giọt châu tầm tã đẫm tràng áo xanh:
1945.Đã cam chịu bạc với tình,
Chúa xuân để tội một mình cho hoa!
Thấp cơ thua trí đàn bà,
Trông vào đau ruột nói ra ngại lời.
Vì ta cho lụy đến người,
1950.Cát lầm ngọc trắng, thiệt đời xuân xanh!
Quản chi lên thác xuống ghềnh,
Cũng toan sống thác với tình cho xong.
Tông đường chút chửa cam lòng,
Nghiến răng bẻ một chữ đồng làm hai.
1955.Thẹn mình đá nát vàng phai,
Trăm thân dễ chuộc một lời được sao?
Nàng rằng: Chiếc bách sóng đào,
Nổi chìm cũng mặc lúc nào rủi may!
Chút thân quằn quại vũng lầy,
1960.Sống thừa còn tưởng đến rày nữa sao?
Cũng liều một giọt mưa rào,
Mà cho thiên hạ trông vào cũng hay!
Xót vì cầm đã bén dây,
Chẳng trăm năm cũng một ngày duyên ta.
1965.Liệu bài mở cửa cho ra,
Ấy là tình nặng ấy là ân sâu!
Sinh rằng: Riêng tưởng bấy lâu,
Lòng người nham hiểm biết đâu mà lường.
Nữa khi giông tố phũ phàng,
1970.Thiệt riêng đó cũng lại càng cực đây.
Liệu mà xa chạy cao bay,
Ái ân ta có ngần này mà thôi!
Bây giờ kẻ ngược người xuôi,
Biết bao giờ lại nối lời nước non?
1975.Dẫu rằng sông cạn đá mòn,
Con tằm đến thác cũng còn vương tơ!
Cùng nhau kể lể sau xưa,
Nói rồi lại nói, lời chưa hết lời.
Mặt trông tay chẳng nỡ rời,
1980.Hoa tì đã động tiếng người nẻo xa.
Nhận ngừng, nuốt tủi, lảng ra,
Tiểu thư đâu đã rẽ hoa bước vào.
Cười cười, nói nói ngọt ngào,
Hỏi: Chàng mới ở chốn nào lại chơi?
1985.Dối quanh Sinh mới liệu lời:
Tìm hoa quá bước, xem người viết kinh.
Khen rằng: Bút pháp đã tinh,
So vào với thiếp Lan đình nào thua!
Tiếc thay lưu lạc giang hồ,
1990.Nghìn vàng, thật cũng nên mua lấy tài!
Thiền trà cạn chén hồng mai,
Thong dong nối gót thư trai cùng về.
Nàng càng e lệ ủ ê,
Rỉ tai, hỏi lại hoa tì trước sau.
1995.Hoa rằng: Bà đã đến lâu,
Rón chân đứng nép độ đâu nữa giờ.
Rành rành kẽ tóc chân tơ,
Mấy lời nghe hết đã dư tỏ tường.
Bao nhiêu đoạn khổ, tình thương,
2000.Nỗi ông vật vã, nỗi nàng thở than.
Ngăn tôi đứng lại một bên,
Chán tai rồi mới bước lên trên lầu.
Nghe thôi kinh hãi xiết đâu:
Đàn bà thế ấy thấy âu một người!
2005.Ấy mới gan ấy mới tài,
Nghĩ càng thêm nỗi sởn gai rụng rời!
Người đâu sâu sắc nước đời,
Mà chàng Thúc phải ra người bó tay!
Thực tang bắt được dường này,
2010.Máu ghen ai cũng chau mày nghiến răng.
Thế mà im chẳng đãi đằng,
Chào mời vui vẻ nói năng dịu dàng!
Giận dầu ra dạ thế thường,
Cười dầu mới thực khôn lường hiểm sâu!
2015.Thân ta ta phải lo âu,
Miệng hùm nọc rắn ở đâu chốn này!
Ví chăng chắp cánh cao bay,
Rào cây lâu cũng có ngày bẻ hoa!
Phận bèo bao quản nước sa,
2020.Lênh đênh đâu nữa cũng là lênh đênh.
Chỉn e quê khách một mình,
Tay không chưa dễ tìm vành ấm no!
Nghĩ đi nghĩ lại quanh co,
Phật tiền sẵn có mọi đồ kim ngân.
2025.Bên mình giắt để hộ thân,
Lần nghe canh đã một phần trống ba.
Cất mình qua ngọn tường hoa,
Lần đường theo bóng trăng tà về tây.
    `
  },
  {
    title: "Truyện Kiều VIII- Nguyễn Du",
    category: "Lục bát",
    excerpt: `
  Kiều Gặp Từ Hải (Câu 2029-2288)
Mịt mù dặm cát đồi cây,
2030.Tiếng gà điếm nguyệt dấu giày cầu sương.
Canh khuya thân gái dặm trường,
Phần e đường xá, phần thương dãi dầu!
Trời đông vừa rạng ngàn dâu,
Bơ vơ nào đã biết đâu là nhà!
2035.Chùa đâu trông thấy nẻo xa,
Rành rành Chiêu Ẩn Am ba chữ bài.
Xăm xăm gõ mái cửa ngoài,
Trụ trì nghe tiếng, rước mời vào trong.
Thấy màu ăn mặc nâu sồng,
2040.Giác Duyên sư trưởng lành lòng liền thương.
Gạn gùng ngành ngọn cho tường,
Lạ lùng nàng hãy tìm đường nói quanh:
Tiểu thiền quê ở Bắc Kinh,
Qui sư, qui Phật, tu hành bấy lâu.
2045.Bản sư rồi cũng đến sau,
Dạy đưa pháp bảo sang hầu sư huynh.
Rày vâng diện hiến rành rành,
Chuông vàng khánh bạc bên mình giở ra.
Xem qua sư mới dạy qua:
2050.Phải nơi Hằng Thủy là ta hậu tình.
Chỉ e đường sá một mình,
Ở đây chờ đợi sư huynh ít ngày.
Gửi thân được chốn am mây,
Muối dưa đắp đổi tháng ngày thong dong.
2055.Kệ kinh câu cũ thuộc lòng,
Hương đèn việc cũ, trai phòng quen tay.
Sớm khuya lá bối phướn mây,
Ngọn đèn khêu nguyệt, tiếng chày nện sương.
Thấy nàng thông tuệ khác thường,
2060.Sư càng nể mặt, nàng càng vững chân.
Cửa thuyền vừa tiết cuối xuân,
Bóng hoa đầy đất, vẻ ngân ngang trời.
Gió quang mây tạnh thảnh thơi,
Có người đàn việt lên chơi cửa Già.
2065.Giở đồ chuông khánh xem qua,
Khen rằng: Khéo giống của nhà Hoạn nương!
Giác Duyên thực ý lo lường,
Đêm thanh mới hỏi lại nàng trước sau.
Nghĩ rằng khôn nỗi giấu mầu,
2070.Sự mình nàng mới gót đầu bày ngay:
Bây giờ sự đã dường này,
Phận hèn dù rủi, dù may, tại người.
Giác Duyên nghe nói rụng rời,
Nửa thương, nửa sợ, bồi hồi chẳng xong.
2075.Rỉ tai nàng mới giãi lòng:
Ở đây cửa Phật là không hẹp gì;
E chăng những sự bất kỳ,
Để nàng cho đến thế thì cũng thương!
Lánh xa, trước liệu tìm đường,
2080.Ngồi chờ nước đến, nên đường còn quê!
Có nhà họ Bạc bên kia,
Am mây quen lối đi về dầu hương.
Nhắn sang, dặn hết mọi đường,
Dọn nhà hãy tạm cho nàng trú chân.

2085.Những mừng được chốn an thân,
Vội vàng nào kịp tính gần tính xa.
Nào ngờ cũng tổ bợm già,
Bạc bà học với Tú bà đồng môn!
Thấy nàng mặt phấn tươi son,
2090.Mừng thầm được mối bán buôn có lời.
Hư không đặt để nên lời,
Nàng đà nhớn nhác rụng rời lắm phen.
Mụ càng xua đuổi cho liền,
Lấy lời hung hiểm ép duyên Châu Trần.
2095.Rằng: Nàng muôn dặm một thân,
Lại mang lấy tiếng dữ gần, lành xa.
Khéo oan gia, của phá gia,
Còn ai dám chứa vào nhà nữa đây!
Kíp toan kiếm chốn xe dây,
2100.Không dưng chưa dễ mà bay đường trời!
Nơi gần thì chẳng tiện nơi,
Nơi xa thì chẳng có người nào xa.
Này chàng Bạc Hạnh cháu nhà,
Cùng trong thân thích ruột rà, chẳng ai.
2105.Cửa hàng buôn bán châu Thai,
Thực thà có một, đơn sai chẳng hề.
Thế nào nàng cũng phải nghe,
Thành thân rồi sẽ liệu về châu Thai.
Bấy giờ ai lại biết ai,
2110.Dầu lòng bể rộng sông dài thênh thênh.
Nàng dù quyết chẳng thuận tình,
Trái lời nẻo trước lụy mình đến sau.
Nàng càng mặt ủ mày chau,
Càng nghe mụ nói, càng đau như dần.
2115.Nghĩ mình túng đất, sẩy chân,
Thế cùng nàng mới xa gần thở than:
Thiếp như con én lạc đàn,
Phải cung rày đã sợ làn cây cong!
Cùng đường dù tính chữ tòng,
2120.Biết người, biết mặt, biết lòng làm sao?
Nữa khi muôn một thế nào,
Bán hùm, buôn sói, chắc vào lưng đâu?
Dù ai lòng có sở cầu,
Tâm mình xin quyết với nhau một lời.
2125.Chứng minh có đất, có Trời,
Bấy giờ vượt bể ra khơi quản gì?
Được lời mụ mới ra đi,
Mách tin họ Bạc tức thì sắm sanh.
Một nhà dọn dẹp linh đình,
2130.Quét sân, đặt trác, rửa bình, thắp nhang.
Bạc sinh quì xuống vội vàng,
Quá lời nguyện hết Thành hoàng, Thổ công.
Trước sân lòng đã giãi lòng,
Trong màn làm lễ tơ hồng kết duyên.
2135.Thành thân mới rước xuống thuyền,
Thuận buồm một lá, xuôi miền châu Thai.
Thuyền vừa đỗ bến thảnh thơi,
Bạc sinh lên trước tìm nơi mọi ngày.
Cũng nhà hành viện xưa nay,
2140.Cũng phường bán thịt, cũng tay buôn người.
Xem người định giá vừa rồi,
Mối hàng một, đã ra mười, thì buông.
Mượn người thuê kiệu rước nường,
Bạc đem mặt bạc, kiếm đường cho xa!
2145.Kiệu hoa đặt trước thềm hoa,
Bên trong thấy một mụ ra vội vàng.
Đưa nàng vào lạy gia đường,
Cũng thần mày trắng, cũng phường lầu xanh!
Thoắt trông nàng đã biết tình,
2150.Chim lồng khốn lẽ cất mình bay cao.
Chém cha cái số hoa đào,
Gỡ ra, rồi lại buộc vào như chơi!
Nghĩ đời mà chán cho đời,
Tài tình chi lắm, cho trời đất ghen!
2155.Tiếc thay nước đã đánh phèn,
Mà cho bùn lại vẩn lên mấy lần!
Hồng quân với khách hồng quần,
Đã xoay đến thế, còn vần chửa tha.
Lỡ từ lạc bước bước ra,
2160.Cái thân liệu những từ nhà liệu đi.
Đầu xanh đã tội tình chi?
Má hồng đến quá nửa thì chưa thôi.
Biết thân chạy chẳng khỏi trời,
Cũng liều mặt phấn cho rồi ngày xanh.

2165.Lần thu gió mát trăng thanh,
Bỗng đâu có khách biên đình sang chơi,
Râu hùm, hàm én, mày ngài,
Vai năm tấc rộng, thân mười thước cao.
Đường đường một đấng anh hào,
2170.Côn quyền hơn sức lược thao gồm tài.
Đội trời đạp đất ở đời,
Họ Từ tên Hải, vốn người Việt đông.
Giang hồ quen thú vẫy vùng,
Gươm đàn nửa gánh, non sông một chèo.
2175.Qua chơi nghe tiếng nàng Kiều,
Tấm lòng nhi nữ cùng xiêu anh hùng.
Thiếp danh đưa đến lầu hồng,
Hai bên cùng liếc hai lòng cùng ưa.
Từ rằng: Tâm phúc tương cờ
2180.Phải người trăng gió vật vờ hay sao?
Bấy lâu nghe tiếng má đào,
Mắt xanh chẳng để ai vào có không?
Một đời được mấy anh hùng,
Bõ chi cá chậu, chim lồng mà chơi!
2185.Nàng rằng: Người dạy quá lời,
Thân này còn dám xem ai làm thường!
Chút riêng chọn đá thử vàng,
Biết đâu mà gởi can tràng vào đâu?
Còn như vào trước ra sau,
2190.Ai cho kén chọn vàng thau tại mình.
Từ rằng: Lời nói hữu tình,
Khiến người lại nhớ câu Bình Nguyên Quân.
Lại đây xem lại cho gần,
Phỏng tin được một vài phần hay không?
2195.Thưa rằng: Lượng cả bao dong,
Tấn Dương được thấy mây rồng có phen.
Rộng thương cỏ nội hoa hèn,
Chút thân bèo bọt dám phiền mai sau!
Nghe lời vừa ý gật đầu,
2200.Cười rằng: Tri kỷ trước sau mấy người!
Khen cho con mắt tinh đời,
Anh hùng đoán giữa trần ai mới già!
Một lời đã biết tên ta,
Muôn chung nghìn tứ cũng là có nhau!
2205.Hai bên ý hợp tâm đầu,
Khi thân chẳng lọ là cầu mới thân!
Ngỏ lời nói với băng nhân,
Tiền trăm lại cứ nguyên ngân phát hoàn.
Buồng riêng sửa chốn thanh nhàn,
2210.Đặt giường thất bảo, vây màn bát tiên.
Trai anh hùng, gái thuyền nguyên,
Phỉ nguyền sánh phượng, đẹp duyên cưỡi rồng.
Nửa năm hương lửa đương nồng,
Trượng phu thoắt đã động lòng bốn phương.
2215.Trông vời trời bể mênh mang,
Thanh gươm, yên ngựa lên đàng thẳng rong.
Nàng rằng: Phận gái chữ tòng,
Chàng đi thiếp cũng quyết lòng xin đi!
Từ rằng: Tâm phúc tương tri,
2220.Sao chưa thoát khỏi nữ nhi thường tình?
Bao giờ mười vạn tinh binh,
Tiếng chiêng dậy đất, bóng tinh rợp đường
Làm cho rõ mặt phi thường,
Bấy giờ ta sẽ rước nàng nghi gia,
2225.Bằng nay bốn bể không nhà,
Theo càng thêm bận, biết là đi đâu?
Đành lòng chờ đó ít lâu,
Chầy chăng là một năm sau vội gì?
Quyết lời rứt áo ra đi,
2230.Cánh bằng tiện gió cất lìa dậm khơi.

Nàng thì chiếc bóng song mai,
Đêm thâu đằng đẵng, nhặt cài then mây.
Sân rêu chẳng vẽ dấu giầy,
Cỏ cao hơn thước, liễu gầy vài phân.
2235.Đoái thương muôn dặm tử phần
Hồn quê theo ngọn mây Tần xa xa;
Xót thay huyên cỗi xuân già,
Tấm lòng thương nhớ, biết là có nguôi.
Chốc là mười mấy năm trời,
2240.Còn ra khi đã da mồi tóc sương.
Tiếc thay chút nghĩa cũ càng,
Dẫu lìa ngó ý còn vương tơ lòng!
Duyên em dù nối chỉ hồng,
May ra khi đã tay bồng tay mang.
2245.Tấc lòng cố quốc tha hương,
Đường kia nỗi nọ ngổn ngang bời bời.
Cánh hồng bay bổng tuyệt vời,
Đã mòn con mắt phương trời đăm đăm.
Đêm ngày luống những âm thầm,
2250.Lửa binh đâu đã ầm ầm một phương,
Ngất trời sát khí mơ màng,
Đầy sông kình ngạc, chật đường giáp binh.
Người quen kẻ thuộc chung quanh
Nhủ nàng hãy tạm lánh mình một nơi.
2255.Nàng rằng: Trước đã hẹn lời,
Dẫu trong nguy hiểm dám rời ước xưa.
Còn đương dùng dắng ngẩn ngơ
Mái ngoài đã thấy bóng cờ tiếng loa.
Giáp binh kéo đến quanh nhà,
2260.Đồng thanh cùng gửi: nào là phu nhân?
Hai bên mười vị tướng quân,
Đặt gươm, cởi giáp, trước sân khấu đầu.
Cung nga, thể nữ nối sau,
Rằng: Vâng lệnh chỉ rước chầu vu qui.
2265.Sẵn sàng phượng liễn loan nghi,
Hoa quan phấp phới hà y rỡ ràng.
Dựng cờ, nổi trống lên đàng,
Trúc tơ nổi trước, kiệu vàng theo sau.
Hoả bài tiền lộ ruổi mau,
2270.Nam đình nghe động trống chầu đại doanh.
Kéo cờ lũy, phát súng thành,
Từ công ra ngựa, thân nghênh cửa ngoài.
Rỡ mình, là vẻ cân đai,
Hãy còn hàm én mày ngài như xưa.
2275.Cười rằng: Cá nước duyên ưa,
Nhớ lời nói những bao giờ hay không?
Anh hùng mới biết anh hùng,
Rầy xem phỏng đã cam lòng ấy chưa?
Nàng rằng: Chút phận ngây thơ,
2280.Cũng may dây cát được nhờ bóng cây.
Đến bây giờ mới thấy đây,
Mà lòng đã chắc những ngày một hai.
Cùng nhau trông mặt cả cười,
Dan tay về chốn trướng mai tự tình.
2285.Tiệc bày thưởng tướng khao binh
Om thòm trống trận, rập rình nhạc quân.
Vinh hoa bõ lúc phong trần,
Chữ tình ngày lại thêm xuân một ngày.

Kiều Báo Thù (Câu 2289-2418)
Trong quân có lúc vui vầy,
2290.Thong dong mới kể sự ngày hàn vi:
Khi Vô Tích, khi Lâm Tri,
Nơi thì lừa đảo, nơi thì xót thương.
Tấm thân rày đã nhẹ nhàng,
Chút còn ân oán đôi đàng chưa xong.
2295.Từ Công nghe nói thủy chung,
Bất bình nổi trận đùng đùng sấm vang.
Nghiêm quân tuyển tướng sẵn sàng,
Dưới cờ một lệnh vội vàng ruổi sao.
Ba quân chỉ ngọn cờ đào,
2300.Đạo ra Vô Tích, đạo vào Lâm Tri,
Mấy người phụ bạc xưa kia,
Chiếu danh tầm nã bắt về hỏi tra.
Lại sai lệnh tiễn truyền qua,
Giữ giàng họ Thúc một nhà cho yên.
2305.Mụ quản gia, vãi Giác Duyên,
Cũng sai lệnh tiễn đem tin rước mời.
Thệ sư kể hết mọi lời,
Lòng lòng cũng giận, người người chấp uy!
Đạo trời báo phục chỉn ghê,
2310.Khéo thay! Một mẻ tóm về đầy nơi,
Quân trung gươm lớn áo dài,
Vệ trong thị lập, cơ ngoài song phi.
Sẵn sàng tề chỉnh uy nghi,
Bác đồng chật đất, tinh kỳ rợp sân.
2315.Trướng hùm mở giữa trung quân,
Từ Công sánh với phu nhân cùng ngồi.
Tiên nghiêm trống chửa dứt hồi
Điểm danh trước dẫn chực ngoài cửa viên.
Từ rằng: ân, oán hai bên,
2320.Mặc nàng xử quyết báo đền cho minh
Nàng rằng: Nhờ cậy uy linh,
Hãy xin báo đáp ân tình cho phu.
Báo ân rồi sẽ trả thù.
Từ rằng: Việc ấy phó cho mặc nàng.
2325.Cho gươm mời đến Thúc lang,
Mặt như chàm đổ, mình giường giẽ run.
Nàng rằng: Nghĩa trọng nghìn non,
Lâm Tri người cũ, chàng còn nhớ không?
Sâm Thương chẳng vẹn chữ tòng,
2330.Tại ai, há dám phụ lòng cố nhân?
Gấm trăm cuốn bạc nghìn cân,
Tạ lòng dễ xứng, báo ân gọi là!
Vợ chàng quỷ quái tinh ma,
Phen này kẻ cắp bà già gặp nhau!
2335.Kiến bò miệng chén chưa lâu,
Mưu sâu cũng trả nghĩa sâu cho vừa.
Thúc Sinh trông mặt bấy giờ,
Mồ hôi chàng đã như mưa ướt đầm.
Lòng riêng mừng sợ khôn cầm,
2340.Sợ thay mà lại mừng thầm cho ai.
Mụ già, sư trưởng thứ hai,
Thoắt đưa đến trước vội mời lên trên:
Dắt tay mở mặt cho nhìn:
Hoa Nô kia với Trạc Tuyền cũng tôi.
2345.Nhớ khi lỡ bước xẩy vời,
Non vàng chưa dễ đền bồi tấm thương.
Nghìn vàng gọi chút lễ thường,
Mà lòng phiếu mẫu mấy vàng cho cân?
Hai người, trông mặt tần ngần,
2350.Nửa phần khiếp sợ, nửa phần mừng vui.
Nàng rằng: Xin hãy dốn ngôi,
Xem cho rõ mặt, biết tôi báo thù!

Kíp truyền chư tướng hiến phù,
Lại đem các tích phạm tù hậu tra.
2355.Dưới cờ, gươm tuốt nắp ra,
Chính danh thủ phạm tên là Hoạn Thư.
Thoạt trông nàng đã chào thưa:
Tiểu thư cũng có bây giờ đến đây?
Đàn bà dễ có mấy tay,
2360.Đời xưa mấy mặt đời này mấy gan?
Dễ dàng là thói hồng nhan,
Càng cay nghiệt lắm càng oan trái nhiều!
Hoạn Thư hồn lạc phách xiêu,
Khấu đầu dưới trướng, liệu điều kêu ca.
2365.Rằng: Tôi chút dạ đàn bà,
Ghen tuông thì cũng người ta thường tình,
Nghĩ cho khi gác viết kinh,
Với khi khỏi cửa dứt tình chẳng theo.
Lòng riêng riêng những kính yêu;
2370.Chồng chung, chưa dễ ai chiều cho ai.
Trót lòng gây việc chông gai,
Còn nhờ lượng bể thương bài nào chăng?
Khen cho: Thật đã nên rằng,
Khôn ngoan đến mực nói năng phải lời,
2375.Tha ra thì cũng may đời,
Làm ra thì cũng ra người nhỏ nhen.
Đã lòng tri quá thì nên,
Truyền quân lệnh xuống trường tiền tha ngay.
Tạ lòng lạy trước sân may,
2380.Cửa viên lại dắt một dây dẫn vào,
Nàng rằng: Lồng lộng trời cao,
Hại nhân, nhân hại sự nào tại ta?
Trước là Bạc Hạnh, Bạc Bà,
Bên là Ưng, Khuyển, bên là Sở Khanh.
2385.Tú Bà cùng Mã Giám Sinh,
Các tên tội ấy đáng tình còn sao?
Lệnh quân truyền xuống nội đao,
Thề sao thì lại cứ sao gia hình,
Máu rơi thịt nát tan tành,
2390.Ai ai trông thấy hồn kinh phách rời.
Cho hay muôn sự tại trời,
Phụ người, chẳng bõ khi người phụ ta!
Mấy người bạc ác tinh ma,
Mình làm mình chịu kêu mà ai thương.
2395.Ba quân đông mặt pháp trường,
Thanh thiên, bạch nhật rõ ràng cho coi.
Việc nàng báo phục vừa rồi,
Giác Duyên vội vã gởi lời từ qui.
Nàng rằng: Thiên tải nhất thì,
2400.Cố nhân đã dễ mấy khi bàn hoàn.
Rồi đây bèo hợp mây tan,
Biết đâu hạc nội mây ngàn là đâu!
Sư rằng: Cũng chẳng bao lâu,
Trong năm năm lại gặp nhau đó mà.
2405.Nhớ ngày hành cước phương xa,
Gặp sư Tam Hợp vốn là tiên tri.
Bảo cho hội ngộ chi kỳ,
Năm nay là một nữa thì năm năm.
Mới hay tiền định chẳng lầm,
2410.Đã tin điều trước ắt nhằm việc sau.
Còn nhiều ân ái với nhau,
Cơ duyên nào đã hết đâu vội gì?
Nàng rằng: Tiền định tiên tri,
Lời sư đã dạy ắt thì chẳng sai.
2415.Họa bao giờ có gặp người,
Vì tôi cậy hỏi một lời chung thân.
Giác Duyên vâng dặn ân cần,
Tạ từ thoắt đã dời chân cõi ngoài.
    `
  },
  {
    title: "Truyện Kiều IX - Nguyễn Du",
    category: "Lục bát",
    excerpt: `
  Từ Hải Mắc Lừa Hồ Tôn Hiến, Kiều Tự Vẫn (Câu 2419-2738)
Nàng từ ân oán rạch ròi,
2420.Bể oan dường đã vơi vơi cạnh lòng.
Tạ ân lạy trước Từ công:
Chút thân bồ liễu nào mong có rày!
Trộm nhờ sấm sét ra tay,
Tấc riêng như cất gánh đầy đổ đi!
2425.Chạm xương chép dạ xiết chi,
Dễ đem gan óc đền nghì trời mây!
Từ rằng: Quốc sĩ xưa nay,
Chọn người tri kỷ một ngày được chăng?
Anh hùng tiếng đã gọi rằng,
2430.Giữa đường dẫu thấy bất bằng mà tha!
Huống chi việc cũng việc nhà,
Lọ là thâm tạ mới là tri ân.
Xót nàng còn chút song thân,
Bấy nay kẻ Việt người Tần cách xa.
2435.Sao cho muôn dặm một nhà,
Cho người thấy mặt là ta cam lòng.
Vội truyền sửa tiệc quân trung,
Muôn binh nghìn tướng hội đồng tẩy oan.
Thừa cơ trúc chẻ ngói tan,
2440.Binh uy từ ấy sấm ran trong ngoài.
Triều đình riêng một góc trời,
Gồm hai văn võ rạch đôi sơn hà.
Đòi phen gió quét mưa sa,
Huyện thành đạp đổ năm tòa cõi nam.
2445.Phong trần mài một lưỡi gươm,
Những loài giá áo túi cơm sá gì!
Nghênh ngang một cõi biên thùy,
Thiếu gì cô quả, thiếu gì bá vương!
Trước cờ ai dám tranh cường,
2450.Năm năm hùng cứ một phương hải tần.
Có quan tổng đốc trọng thần,
Là Hồ Tôn Hiến kinh luân gồm tài.
Đẩy xe vâng chỉ đặc sai,
Tiện nghi bát tiểu việc ngoài đổng nhung.
2455.Biết Từ là đấng anh hùng,
Biết nàng cũng dự quân trung luận bàn.
Đóng quân làm chước chiêu an,
Ngọc vàng gấm vóc sai quan thuyết hàng.
Lại riêng một lễ với nàng,
2460.Hai tên thể nữ ngọc vàng nghìn cân.
Tin vào gởi trước trung quân,
Từ công riêng hãy mười phân hồ đồ.
Một tay gây dựng cơ đồ,
Bấy lâu bể Sở sông Ngô tung hoành!
2465.Bó thân về với triều đình,
Hàng thần lơ láo phận mình ra đâu?
Áo xiêm ràng buộc lấy nhau,
Vào luồn ra cúi công hầu mà chi?
Sao bằng riêng một biên thùy,
2470.Sức này đã dễ làm gì được nhau?
Chọc trời khuấy nước mặc dầu,
Dọc ngang nào biết trên đầu có ai?
Nàng thời thật dạ tin người,
Lễ nhiều nói ngọt nghe lời dễ xiêu.
2475.Nghĩ mình mặt nước cánh bèo,
Đã nhiều lưu lạc lại nhiều gian truân.
Bằng nay chịu tiếng vương thần,
Thênh thênh đường cái thanh vân hẹp gì!
Công tư vẹn cả hai bề,
2480.Dần dà rồi sẽ liệu về cố hương.
Cũng ngôi mệnh phụ đường đường,
Nở nang mày mặt rỡ ràng mẹ cha.
Trên vì nước dưới vì nhà,
Một là đắc hiếu hai là đắc trung.
2485.Chẳng hơn chiếc bách giữa dòng,
E dè sóng vỗ hãi hùng cỏ hoa.

Nhân khi bàn bạc gần xa,
Thừa cơ nàng mới bàn ra nói vào.
Rằng: Trong Thánh trạch dồi dào,
2490.Tưới ra đã khắp thấm vào đã sâu.
Bình thành công đức bấy lâu,
Ai ai cũng đội trên đầu xiết bao.
Ngẫm từ gây việc binh đao,
Đống xương Vô định đã cao bằng đầu.
2495.Làm chi để tiếng về sau,
Nghìn năm ai có khen đâu Hoàng Sào!
Sao bằng lộc trọng quyền cao,
Công danh ai dứt lối nào cho qua?
Nghe lời nàng nói mặn mà,
2500.Thế công Từ mới trở ra thế hàng.
Chỉnh nghi tiếp sứ vội vàng,
Hẹn kỳ thúc giáp quyết đường giải binh.
Tin lời thành hạ yêu minh,
Ngọn cờ ngơ ngác trống canh trễ tràng.
2505.Việc binh bỏ chẳng giữ giàng,
Vương sư dòm đã tỏ tường thực hư.
Hồ công quyết kế thừa cơ,
Lễ tiên binh hậu khắc cờ tập công.
Kéo cờ chiêu phủ tiên phong,
2510.Lễ nghi dàn trước bác đồng phục sau.
Từ công hờ hững biết đâu,
Đại quan lễ phục ra đầu cửa viên.
Hồ công ám hiệu trận tiền,
Ba bề phát súng bốn bên kéo cờ.
2515.Đương khi bất ý chẳng ngờ,
Hùm thiêng khi đã sa cơ cũng hèn!
Tử sinh liều giữa trận tiền,
Dạn dầy cho biết gan liền tướng quân!
Khí thiêng khi đã về thần,
2520.Nhơn nhơn còn đứng chôn chân giữa vòng!
Trơ như đá vững như đồng,
Ai lay chẳng chuyển ai rung chẳng dời.
Quan quân truy sát đuổi dài.
Ầm ầm sát khí ngất trời ai đang.
2525.Trong hào ngoài lũy tan hoang,
Loạn quân vừa dắt tay nàng đến nơi.
Trong vòng tên đá bời bời,
Thấy Từ còn đứng giữa trời trơ trơ.
Khóc rằng: Trí dũng có thừa,
2530.Bởi nghe lời thiếp nên cơ hội này!
Mặt nào trông thấy nhau đây?
Thà liều sống thác một ngày với nhau!
Dòng thu như dội cơn sầu,
Dứt lời nàng cũng gieo đầu một bên.
2535.Lạ thay oan khí tương triền!
Nàng vừa phục xuống Từ liền ngã ra.

Quan quân kẻ lại người qua,
Xót nàng sẽ lại vực ra dần dần.
Đem vào đến trước trung quân,
2540.Hồ công thấy mặt ân cần hỏi han.
Rằng: Nàng chút phận hồng nhan,
Gặp cơn binh cách nhiều nàn cũng thương!
Đã hay thành toán miếu đường,
Giúp công cũng có lời nàng mới nên.
2545.Bây giờ sự đã vẹn tuyền,
Mặc lòng nghĩ lấy muốn xin bề nào?
Nàng càng giọt ngọc tuôn dào,
Ngập ngừng mới gửi thấp cao sự lòng.
Rằng: Từ là đấng anh hùng,
2550.Dọc ngang trời rộng vẫy vùng bể khơi!
Tin tôi nên quá nghe lời,
Đem thân bách chiến làm tôi triều đình.
Ngỡ là phu quý phụ vinh,
Ai ngờ một phút tan tành thịt xương!
2555.Năm năm trời bể ngang tàng,
Đem mình đi bỏ chiến trường như không.
Khéo khuyên kể lấy làm công,
Kể bao nhiêu lại đau lòng bấy nhiêu!
Xét mình công ít tội nhiều,
2560.Sống thừa tôi đã nên liều mình tôi!
Xin cho tiện thổ một doi,
Gọi là đắp điếm cho người tử sinh.
Hồ công nghe nói thương tình,
Truyền cho cảo táng di hình bên sông.

2565.Trong quân mở tiệc hạ công,
Xôn xao tơ trúc hội đồng quân quan.
Bắt nàng thị yến dưới màn,
Dở say lại ép cung đàn nhặt tâu.
Một cung gió thảm mưa sầu,
2570.Bốn dây nhỏ máu năm đầu ngón tay!
Ve ngâm vượn hót nào tày,
Lọt tai Hồ cũng nhăn mày rơi châu.
Hỏi rằng: Này khúc ở đâu?
Nghe ra muôn oán nghìn sầu lắm thay!
2575.Thưa rằng: Bạc mệnh khúc này,
Phổ vào đàn ấy những ngày còn thơ.
Cung cầm lựa những ngày xưa,
Mà gương bạc mệnh bây giờ là đây!
Nghe càng đắm ngắm càng say,
2580.Lạ cho mặt sắt cũng ngây vì tình!
Dạy rằng: Hương lửa ba sinh,
Dây loan xin nối cầm lành cho ai.
Thưa rằng: Chút phận lạc loài,
Trong mình nghĩ đã có người thác oan.
2585.Còn chi nữa cánh hoa tàn,
Tơ lòng đã dứt dây đàn Tiểu Lân.
Rộng thương còn mảnh hồng quần,
Hơi tàn được thấy gốc phần là may!
Hạ công chén đã quá say,
2590.Hồ công đến lúc rạng ngày nhớ ra.
Nghĩ mình phương diện quốc gia,
Quan trên nhắm xuống người ta trông vào.
Phải tuồng trăng gió hay sao,
Sự này biết tính thế nào được đây?
2595.Công nha vừa buổi rạng ngày,
Quyết tình Hồ mới đoán ngay một bài.
Lệnh quan ai dám cãi lời,
Ép tình mới gán cho người thổ quan.
Ông tơ thực nhẽ đa đoan!
2600.Xe tơ sao khéo vơ quàng vơ xiên?
Kiệu hoa áp thẳng xuống thuyền,
Lá màn rủ thấp ngọn đèn khêu cao.
Nàng càng ủ liễu phai đào,
Trăm phần nào có phần nào phần tươi?
2605.Đành thân cát lấp sóng vùi,
Cướp công cha mẹ thiệt đời thông minh!
Chân trời mặt bể lênh đênh,
Nắm xương biết gởi tử sinh chốn nào,
Duyên đâu ai dứt tơ đào,
2610.Nợ đâu ai đã dắt vào tận tay!
Thân sao thân đến thế này?
Còn ngày nào cũng dư ngày ấy thôi!
Đã không biết sống là vui,
Tấm thân nào biết thiệt thòi là thương!
2615.Một mình cay đắng trăm đường,
Thôi thì nát ngọc tan vàng thì thôi!
Mảnh trăng đã gác non đoài,
Một mình luống những đứng ngồi chưa xong.
Triều đâu nổi tiếng đùng đùng,
2620.Hỏi ra mới biết rằng sông Tiền đường.
Nhớ lời thần mộng rõ ràng,
Này thôi hết kiếp đoạn trường là đây!
Đạm Tiên nàng nhé có hay!
Hẹn ta thì đợi dưới này rước ta.
2625.Dưới đèn sẵn bức tiên hoa,
Một thiên tuyệt bút gọi là để sau.
Cửa bồng vội mở rèm châu,
Trời cao sông rộng một màu bao la.
Rằng: Từ công hậu đãi ta,
2630.Chút vì việc nước mà ra phụ lòng.
Giết chồng mà lại lấy chồng,
Mặt nào còn đứng ở trong cõi đời?
Thôi thì một thác cho rồi,
Tấm lòng phó mặc trên trời dưới sông!

2635.Trông vời con nước mênh mông,
Đem mình gieo xuống giữa dòng Trường Giang.
Thổ quan theo vớt vội vàng,
Thời đà đắm ngọc chìm hương mất rồi!
Thương thay cũng một kiếp người,
2640.Hại thay mang lấy sắc tài làm chi!
Những là oan khổ lưu ly,
Chờ cho hết kiếp còn gì là thân!
Mười lăm năm bấy nhiêu lần,
Làm gương cho khách hồng quần thử soi!
2645.Đời người đến thế thì thôi,
Trong cơ âm cực dương hồi khốn hay.
Mấy người hiếu nghĩa xưa nay,
Trời làm chi đến lâu ngày càng thương!
Giác Duyên từ tiết giã nàng,
2650.Đeo bầu quảy níp rộng đường vân du.
Gặp bà Tam Hợp đạo cô,
Thong dong hỏi hết nhỏ to sự nàng:
Người sao hiếu nghĩa đủ đường,
Kiếp sao rặt những đoạn trường thế thôi?
2655.Sư rằng: Phúc họa đạo trời,
Cỗi nguồn cũng ở lòng người mà ra.
Có trời mà cũng tại ta,
Tu là cõi phúc tình là dây oan.
Thúy Kiều sắc sảo khôn ngoan,
2660.Vô duyên là phận hồng nhan đã đành,
Lại mang lấy một chữ tình,
Khư khư mình buộc lấy mình vào trong.
Vậy nên những chốn thong dong,
Ở không yên ổn ngồi không vững vàng.
2665.Ma đưa lối quỷ dẫn đường,
Lại tìm những chốn đoạn trường mà đi.
Hết nạn ấy đến nạn kia,
Thanh lâu hai lượt thanh y hai lần.
Trong vòng giáo dựng gươm trần,
2670.Kề răng hùm sói gởi thân tôi đòi.
Giữa dòng nước dẫy sóng dồi,
Trước hàm rồng cá gieo mồi thuỷ tinh.
Oan kia theo mãi với tình,
Một mình mình biết một mình mình hay.
2675.Làm cho sống đọa thác đầy,
Đoạn trường cho hết kiếp này mới thôi!
Giác Duyên nghe nói rụng rời:
Một đời nàng nhé thương ôi còn gì!
Sư rằng: Song chẳng hề chi,
2680.Nghiệp duyên cân lại nhắc đi còn nhiều.
Xét trong tội nghiệp Thúy Kiều,
Mắc điều tình ái khỏi điều tà dâm,
Lấy tình thâm trả nghĩa thâm,
Bán mình đã động hiếu tâm đến trời!
2685.Hại một người cứu muôn người,
Biết đường khinh trọng biết lời phải chăng.
Thửa công đức ấy ai bằng?
Túc khiên đã rửa lâng lâng sạch rồi!
Khi nên trời cũng chiều người,
2690.Nhẹ nhàng nợ trước đền bồi duyên sau.
Giác Duyên dù nhớ nghĩa nhau,
Tiền đường thả một bè lau rước người.
Trước sau cho vẹn một lời,
Duyên ta mà cũng phúc trời chi không!

2695.Giác Duyên nghe nói mừng lòng,
Lân la tìm thú bên sông Tiền đường,
Đánh tranh chụm nóc thảo đường,
Một gian nước biếc mây vàng chia đôi.
Thuê năm ngư phủ hai người,
2700.Đóng thuyền chực bến kết chài giăng sông.
Một lòng chẳng quản mấy công,
Khéo thay gặp gỡ cũng trong chuyển vần!
Kiều từ gieo xuống duềnh ngân,
Nước xuôi bỗng đã trôi dần tận nơi.
2705.Ngư ông kéo lưới vớt người,
Ngẫm lời Tam Hợp rõ mười chẳng ngoa!
Trên mui lướt mướt áo là,
Tuy dầm hơi nước chưa lòa bóng gương.
Giác Duyên nhận thật mặt nàng,
2710.Nàng còn thiêm thiếp giấc vàng chưa phai.
Mơ màng phách quế hồn mai,
Đạm Tiên thoắt đã thấy người ngày xưa.
Rằng: Tôi đã có lòng chờ,
Mất công mười mấy năm thừa ở đây.
2715.Chị sao phận mỏng phúc dày,
Kiếp xưa đã vậy lòng này dễ ai!
Tâm thành đã thấu đến trời,
Bán mình là hiếu cứu người là nhân.
Một niềm vì nước vì dân,
2720.Âm công cất một đồng cân đã già!
Đoạn trường sổ rút tên ra,
Đoạn trường thơ phải đưa mà trả nhau.
Còn nhiều hưởng thụ về lâu,
Duyên xưa tròn trặn phúc sau dồi dào!
2725.Nàng nghe ngơ ngẩn biết sao,
Trạc Tuyền! nghe tiếng gọi vào bên tai.
Giật mình thoắt tỉnh giấc mai,
Bâng khuâng nào đã biết ai mà nhìn.
Trong thuyền nào thấy Đạm Tiên,
2730.Bên mình chỉ thấy Giác Duyên ngồi kề.
Thấy nhau mừng rỡ trăm bề,
Dọn thuyền mới rước nàng về thảo lư.
Một nhà chung chạ sớm trưa,
Gió trăng mát mặt muối dưa chay lòng.
2735.Bốn bề bát ngát mênh mông,
Triều dâng hôm sớm mây lồng trước sau.
Nạn xưa trút sạch lầu lầu,
Duyên xưa chưa dễ biết đâu chốn này.

Kim Trọng Đi Tìm Kiều (Câu 2739-2972)
Nỗi nàng tai nạn đã đầy,
2740.Nỗi chàng Kim Trọng bấy chầy mới thương.
Từ ngày muôn dặm phù tang,
Nửa năm ở đất Liêu dương lại nhà.
Vội sang vườn Thúy dò la,
Nhìn phong cảnh cũ nay đà khác xưa.
2745.Đầy vườn cỏ mọc lau thưa,
Song trăng quạnh quẽ vách mưa rã rời.
Trước sau nào thấy bóng người,
Hoa đào năm ngoái còn cười gió đông.
Xập xè én liệng lầu không,
2750.Cỏ lan mặt đất rêu phong dấu giày.
Cuối tường gai góc mọc đầy,
Đi về này những lối này năm xưa.
Chung quanh lặng ngắt như tờ,
Nỗi niềm tâm sự bây giờ hỏi ai?
2755.Láng giềng có kẻ sang chơi,
Lân la sẽ hỏi một hai sự tình.
Hỏi ông ông mắc tụng đình,
Hỏi nàng nàng đã bán mình chuộc cha.
Hỏi nhà nhà đã dời xa,
2760.Hỏi chàng Vương với cùng là Thúy Vân.
Đều là sa sút khó khăn,
May thuê viết mướn kiếm ăn lần hồi.
Điều đâu sét đánh lưng trời,
Thoắt nghe chàng thoắt rụng rời xiết bao!
2765.Vội han di trú nơi cao,
Đánh đường chàng mới tìm vào tận nơi.
Nhà tranh vách đất tả tơi,
Lau treo rèm nát trúc cài phên thưa.
Một sân đất cỏ dầm mưa,
2770.Càng ngao ngán nỗi càng ngơ ngẩn đường!

Đánh liều lên tiếng ngoài tường,
Chàng Vương nghe tiếng vội vàng chạy ra.
Dắt tay vội rước vào nhà,
Mái sau viên ngoại ông bà ra ngay.
2775.Khóc than kể hết niềm tây:
Chàng ôi biết nỗi nước này cho chưa?
Kiều nhi phận mỏng như tờ,
Một lời đã lỗi tóc tơ với chàng!
Gặp cơn gia biến lạ dường,
2780.Bán mình nó phải tìm đường cứu cha.
Dùng dằng khi bước chân ra,
Cực trăm nghìn nỗi dặn ba bốn lần.
Trót lời hẹn với lang quân,
Mượn con em nó Thúy Vân thay lời.
2785.Gọi là trả chút nghĩa người,
Sầu này dằng dặc muôn đời chưa quên!
Kiếp này duyên đã phụ duyên,
Dạ đài còn biết sẽ đền lai sinh.
Mấy lời ký chú đinh ninh,
2790.Ghi lòng để dạ cất mình ra đi.
Phận sao bạc bấy Kiều nhi!
Chàng Kim về đó con thì đi đâu?
Ông bà càng nói càng đau,
Chàng càng nghe nói càng dàu như dưa.
2795.Vật mình vẫy gió tuôn mưa,
Dầm dề giọt ngọc thẫn thờ hồn mai!
Đau đòi đoạn ngất đòi thôi,
Tỉnh ra lại khóc khóc rồi lại mê.
Thấy chàng đau nỗi biệt ly,
2800.Nhẫn ngừng ông mới vỗ về giải khuyên:
Bây giờ ván đã đóng thuyền,
Đã đành phận bạc khôn đền tình chung!
Quá thương chút nghĩa đèo bòng,
Nghìn vàng thân ấy dễ hòng bỏ sao?
2805.Dỗ dành khuyên giải trăm chiều,
Lửa phiền càng dập càng khêu mối phiền.
Thề xưa giở đến kim hoàn,
Của xưa lại giở đến đàn với hương.
Sinh càng trông thấy càng thương.
2810.Gan càng tức tối ruột càng xót xa.
Rằng: Tôi trót quá chân ra,
Để cho đến nỗi trôi hoa dạt bèo.
Cùng nhau thề thốt đã nhiều,
Những điều vàng đá phải điều nói không!
2815.Chưa chăn gối cũng vợ chồng,
Lòng nào mà nỡ dứt lòng cho đang?
Bao nhiêu của mấy ngày đàng,
Còn tôi tôi một gặp nàng mới thôi!
Nỗi thương nói chẳng hết lời,
2820.Tạ từ sinh mới sụt sùi trở ra.
Vội về sửa chốn vườn hoa,
Rước mời viên ngoại ông bà cùng sang.
Thần hôn chăm chút lễ thường,
Dưỡng thân thay tấm lòng nàng ngày xưa.
2825.Đinh ninh mài lệ chép thơ,
Cắt người tìm tõi đưa tờ nhắn nhe.
Biết bao công mướn của thuê,
Lâm thanh mấy độ đi về dặm khơi.
Người một nơi hỏi một nơi,
2830.Mênh mông nào biết bể trời nơi nao?
Sinh càng thảm thiết khát khao,
Như nung gan sắt như bào lòng son.
Ruột tằm ngày một héo don,
Tuyết sương ngày một hao mòn hình ve.
2835.Thẩn thờ lúc tỉnh lúc mê,
Máu theo nước mắt hồn lìa chiêm bao.
Xuân huyên lo sợ biết bao,
Quá ra khi đến thế nào mà hay!
Vội vàng sắm sửa chọn ngày,
2840.Duyên Vân sớm đã se dây cho chàng.
Người yểu điệu kẻ văn chương,
Trai tài gái sắc xuân đương vừa thì,
Tuy rằng vui chữ vu quy,
Vui nào đã cất sầu kia được nào!
2845.Khi ăn ở lúc ra vào,
Càng âu duyên mới càng dào tình xưa.
Nỗi nàng nhớ đến bao giờ,
Tuôn châu đòi trận vò tơ trăm vòng.
Có khi vắng vẻ thư phòng,
2850.Đốt lò hương giở phím đồng ngày xưa.
Bẻ bai rủ rỉ tiếng tơ,
Trầm bay nhạt khói gió đưa lay rèm.
Dường như bên nóc trước thềm,
Tiếng Kiều đồng vọng bóng xiêm mơ màng,
2855.Bởi lòng tạc đá ghi vàng,
Tưởng nàng nên lại thấy nàng về đây.

Những là phiền muộn đêm ngày,
Xuân thu biết đã đổi thay mấy lần?
Chế khoa gặp hội trường văn.
2860.Vương, Kim cùng chiếm bảng xuân một ngày.
Cửa trời rộng mở đường mây,
Hoa chào ngõ hạnh hương bay dặm phần.
Chàng Vương nhớ đến xa gần,
Sang nhà Chung lão tạ ân chu tuyền.
2865.Tình xưa ân trả nghĩa đền,
Gia thân lại mới kết duyên Châu Trần.
Kim từ nhẹ bước thanh vân,
Nỗi nàng càng nghĩ xa gần càng thương.
Ấy ai dặn ngọc thề vàng,
2870.Bây giờ kim mã ngọc đường với ai?
Ngọn bèo chân sóng lạc loài,
Nghĩ mình vinh hiển thương người lưu ly.
Vâng ra ngoại nhậm Lâm truy,
Quan san nghìn dặm thê nhi một đoàn.
2875.Cầm đường ngày tháng thanh nhàn,
Sớm khuya tiếng hạc tiếng đàn tiêu dao.
Phòng xuân trướng rủ hoa đào,
Nàng Vân nằm bỗng chiêm bao thấy nàng.
Tỉnh ra mới rỉ cùng chàng,
2880.Nghe lời chàng cũng hai đường tin nghi.
Họ Lâm thanh với Lâm truy,
Khác nhau một chữ hoặc khi có lầm.
Trong cơ thanh khí tương tầm,
Ở đây hoặc có giai âm chăng là?
2885.Thăng đường chàng mới hỏi tra,
Họ Đô có kẻ lại già thưa lên:
Sự này đã ngoại mười niên,
Tôi đà biết mặt biết tên rành rành.
Tú bà cùng Mã Giám sinh,
2890.Đi mua người ở Bắc kinh đưa về.
Thúy Kiều tài sắc ai bì,
Có nghề đàn lại đủ nghề văn thơ.
Kiên trinh chẳng phải gan vừa,
Liều mình thế ấy phải lừa thế kia.
2895.Phong trần chịu đã ê chề,
Tơ duyên sau lại xe về Thúc lang.
Phải tay vợ cả phũ phàng,
Bắt về Vô tích toan đường bẻ hoa.
Rứt mình nàng phải trốn ra,
2900.Chẳng may lại gặp một nhà Bạc kia.
Thoắt buôn về thoắt bán đi,
Mây trôi bèo nổi thiếu gì là nơi!
Bỗng đâu lại gặp một người,
Hơn đời trí dũng nghiêng trời uy linh.
2905.Trong tay mười vạn tinh binh,
Kéo về đóng chật một thành Lâm truy.
Tóc tơ các tích mọi khi,
Oán thì trả oán ân thì trả ân.
Đã nên có nghĩa có nhân,
2910.Trước sau trọn vẹn xa gần ngợi khen.
Chưa từng được họ được tên,
Sự này hỏi Thúc sinh viên mới tường.
Nghe lời đô nói rõ ràng,
Tức thì đưa thiếp mời chàng Thúc sinh.
2915.Nỗi nàng hỏi hết phân minh,
Chồng con đâu tá tính danh là gì?
Thúc rằng: Gặp buổi loạn ly,
Trong quân tôi hỏi thiếu gì tóc tơ.
Đại vương tên Hải họ Từ,
2920.Đánh quen trăm trận sức dư muôn người
Gặp nàng khi ở châu Thai,
Lạ gì quốc sắc thiên tài phải duyên.
Vẫy vùng trong bấy nhiêu niên,
Làm nên động địa kinh thiên đùng đùng.
2925.Đại quân đồn đóng cõi đông,
Về sau chẳng biết vân mồng làm sao.

Nghe tường ngành ngọn tiêu hao,
Lòng riêng chàng luống lao đao thẫn thờ.
Xót thay chiếc lá bơ vơ,
2930.Kiếp trần biết giũ bao giờ cho xong?
Hoa trôi nước chảy xuôi dòng,
Xót thân chìm nỗi đau lòng hợp tan!
Lời xưa đã lỗi muôn vàn,
Mảnh hương còn đó phím đàn còn đây,
2935.Đàn cầm khéo ngẩn ngơ dây,
Lửa hương biết có kiếp này nữa thôi?
Bình bồng còn chút xa xôi,
Đỉnh chung sao nỡ ăn ngồi cho an!
Rắp mong treo ấn từ quan,
2940.Mấy sông cũng lội mấy ngàn cũng pha.
Dấn mình trong án can qua,
Vào sinh ra tử họa là thấy nhau.
Nghĩ điều trời thẳm vực sâu,
Bóng chim tăm cá biết đâu mà nhìn!
2945.Những là nấn ná đợi tin,
Nắng mưa biết đã mấy phen đổi dời
Năm mây bỗng thấy chiếu trời,
Khâm ban sắc chỉ đến nơi rành rành.
Kim thì cải nhậm Nam bình,
2950.Chàng Vương cũng cải nhậm thành Châu dương.
Sắm xanh xe ngựa vội vàng,
Hai nhà cùng thuận một đường phó quan.
Xảy nghe thế giặc đã tan,
Sóng êm Phúc kiến lửa tàn Chiếc giang.
2955.Được tin Kim mới rủ Vương,
Tiện đường cùng lại tìm nàng sau xưa.
Hàng Châu đến đó bây giờ,
Thật tin hỏi được tóc tơ rành rành.
Rằng: Ngày hôm nọ giao binh,
2960.Thất cơ Từ đã thu linh trận tiền.
Nàng Kiều công cả chẳng đền,
Lệnh quan lại bắt ép duyên thổ tù.
Nàng đà gieo ngọc trầm châu,
Sông Tiền đường đó ấy mồ hồng nhan!
2965.Thương ôi! không hợp mà tan,
Một nhà vinh hiển riêng oan một nàng!
Chiêu hồn thiết vị lễ thường,
Giải oan lập một đàn tràng bên sông.
Ngọn triều non bạc trùng trùng,
2970.Vời trông còn tưởng cánh hồng lúc gieo.
Tình thâm bể thảm lạ điều,
Nào hồn tinh vệ biết theo chốn nào?
    `
  },
  {
    title: "Truyện Kiều X - Nguyễn Du",
    category: "Lục bát",
    excerpt: `
  Kiều – Kim Trọng Đoàn Tụ (Câu 2973-3254)
Cơ duyên đâu bỗng lạ sao,
Giác Duyên đâu bỗng tìm vào đến nơi.
2975.Trông lên linh vị chữ bài,
Thất kinh mới hỏi: Những người đâu ta?
Với nàng thân thích gần xa,
Người còn sao bỗng làm ma khóc người?
Nghe tin ngơ ngác rụng rời,
2980.Xúm quanh kể lể rộn lời hỏi tra:
Này chồng này mẹ này cha,
Này là em ruột này là em dâu.
Thật tin nghe đã bấy lâu,
Pháp sư dạy thế sự đâu lạ thường!
2985.Sư rằng: Nhân quả với nàng,
Lâm truy buổi trước Tiền đường buổi sau.
Khi nàng gieo ngọc trầm châu,
Đón nhau tôi đã gặp nhau rước về,
Cùng nhau nương cửa bồ đề,
2990.Thảo am đó cũng gần kề chẳng xa.
Phật tiền ngày bạc lân la,
Đăm đăm nàng cũng nhớ nhà khôn khuây.
Nghe tin nở mặt nở mày,
Mừng nào lại quá mừng này nữa chăng?
2995.Từ phen chiếc lá lìa rừng,
Thăm tìm luống những liệu chừng nước mây.
Rõ ràng hoa rụng hương bay,
Kiếp sau họa thấy kiếp này hẳn thôi.
Minh dương đôi ngả chắc rồi,
3000.Cõi trần mà lại thấy người cửu nguyên!
Cùng nhau lạy tạ Giác Duyên,
Bộ hành một lũ theo liền một khi.
Bẻ lau vạch cỏ tìm đi,
Tình thâm luống hãy hồ nghi nửa phần.
3005.Quanh co theo dải giang tân,
Khỏi rừng lau đã tới sân Phật đường.
Giác Duyên lên tiếng gọi nàng,
Buồng trong vội dạo sen vàng bước ra.
Trông xem đủ mặt một nhà:
3010.Xuân già còn khỏe huyên già còn tươi.
Hai em phương trưởng hòa hai,
Nọ chàng Kim đó là người ngày xưa!
Tưởng bây giờ là bao giờ,
Rõ ràng mở mắt còn ngờ chiêm bao!
3015.Giọt châu thánh thót quẹn bào,
Mừng mừng tủi tủi xiết bao là tình!
Huyên già dưới gối gieo mình,
Khóc than mình kể sự tình đầu đuôi:
Từ con lưu lạc quê người,
3020.Bèo trôi sóng vỗ chốc mười lăm năm!
Tính rằng sông nước cát lầm,
Kiếp này ai lại còn cầm gặp đây!
Ông bà trông mặt cầm tay,
Dung quang chẳng khác chi ngày bước ra.
3025.Bấy chầy dãi nguyệt dầu hoa,
Mười phần xuân có gầy ba bốn phần.
Nỗi mừng biết lấy chi cân?
Lời tan hợp chuyện xa gần thiếu đâu!
Hai em hỏi trước han sau,
3030.Đứng trông chàng cũng trở sầu làm tươi.
Quây nhau lạy trước Phật đài,
Tái sinh trần tạ lòng người từ bi.

Kiệu hoa giục giã tức thì,
Vương ông dạy rước cùng về một nơi.
3035.Nàng rằng: Chút phận hoa rơi,
Nửa đời nếm trải mọi mùi đắng cay.
Tính rằng mặt nước chân mây,
Lòng nào còn tưởng có rày nữa không?
Được rày tái thế tương phùng.
3040.Khát khao đã thỏa tấm lòng lâu nay!
Đã đem mình bỏ am mây,
Tuổi này gởi với cỏ cây cũng vừa
Mùi thiền đã bén muối dưa,
Màu thiền ăn mặc đã ưa nâu sồng.
3045.Sự đời đã tắt lửa lòng,
Còn chen vào chốn bụi hồng làm chi!
Dở dang nào có hay gì,
Đã tu tu trót quá thì thì thôi!
Trùng sinh ân nặng bể trời,
3050.Lòng nào nỡ dứt nghĩa người ra đi?
Ông rằng: Bỉ thử nhất thì,
Tu hành thì cũng phải khi tòng quyền.
Phải điều cầu Phật cầu Tiên,
Tình kia hiếu nọ ai đền cho đây?
3055.Độ sinh nhờ đức cao dày,
Lập am rồi sẽ rước thầy ở chung.
Nghe lời nàng cũng chiều lòng,
Giã sư giã cảnh đều cùng bước ra.

Một nhà về đến quan nha,
3060.Đoàn viên vội mở tiệc hoa vui vầy.
Tàng tàng chén cúc dở say,
Đứng lên Vân mới giãi bày một hai.
Rằng: Trong tác hợp cơ trời.
Hai bên gặp gỡ một lời kết giao.
3065.Gặp cơn bình địa ba đào,
Vậy đem duyên chị buộc vào cho em.
Cũng là phận cải duyên kim,
Cũng là máu chảy ruột mềm chớ sao?
Những là rày ước mai ao,
3070.Mười lăm năm ấy biết bao nhiêu tình!
Bây giờ gương vỡ lại lành,
Khuôn thiêng lừa lọc đã dành có nơi.
Còn duyên may lại còn người,
Còn vầng trăng bạc còn lời nguyền xưa.
3075.Quả mai ba bảy đương vừa,
Đào non sớm liệu xe tơ kịp thì.
Dứt lời nàng vội gạt đi:
Sự muôn năm cũ kể chi bây giờ?
Một lời tuy có ước xưa,
3080.Xét mình dãi gió dầu mưa đã nhiều.
Nói càng hổ thẹn trăm chiều,
Thà cho ngọn nước thủy triều chảy xuôi!
Chàng rằng: Nói cũng lạ đời,
Dẫu lòng kia vậy còn lời ấy sao?
3085.Một lời đã trót thâm giao,
Dưới dày có đất trên cao có trời!
Dẫu rằng vật đổi sao dời,
Tử sinh phải giữ lấy lời tử sinh!
Duyên kia có phụ chi tình,
3090.Mà toan sẻ gánh chung tình làm hai?
Nàng rằng: Gia thất duyên hài,
Chút lòng ân ái ai ai cũng lòng.
Nghĩ rằng trong đạo vợ chồng,
Hoa thơm phong nhị trăng vòng tròn gương.
3095.Chữ trinh đáng giá nghìn vàng,
Đuốc hoa chẳng thẹn với chàng mai xưa.
Thiếp từ ngộ biến đến giờ.
Ong qua bướm lại đã thừa xấu xa.
Bấy chầy gió táp mưa sa.
3100.Mấy trăng cũng khuyết mấy hoa cũng tàn.
Còn chi là cái hồng nhan,
Đã xong thân thế còn toan nỗi nào?
Nghĩ mình chẳng hổ mình sao,
Dám đem trần cấu dự vào bố kinh!
3105.Đã hay chàng nặng vì tình,
Trông hoa đèn chẳng thẹn mình lắm ru!
Từ rày khép cửa phòng thu,
Chẳng tu thì cũng như tu mới là!
Chàng dù nghĩ đến tình xa,
3110.Đem tình cầm sắt đổi ra cầm cờ.
Nói chi kết tóc xe tơ,
Đã buồn cả ruột mà dơ cả đời!
Chàng rằng: Khéo nói nên lời,
Mà trong lẽ phải có người có ta!
3115.Xưa nay trong đạo đàn bà,
Chữ trinh kia cũng có ba bảy đường,
Có khi biến có khi thường,
Có quyền nào phải một đường chấp kinh.
Như nàng lấy hiếu làm trinh,
3120.Bụi nào cho đục được mình ấy vay?

Trời còn để có hôm nay,
Tan sương đầu ngõ vén mây giữa trời.
Hoa tàn mà lại thêm tươi,
Trăng tàn mà lại hơn mười rằm xưa.
3125.Có điều chi nữa mà ngờ,
Khách qua đường để hững hờ chàng Tiêu!
Nghe chàng nói đã hết điều,
Hai thân thì cũng quyết theo một bài.
Hết lời khôn lẽ chối lời,
3130.Cúi đầu nàng những vắn dài thở than.
Nhà vừa mở tiệc đoàn viên,
Hoa soi ngọn đuốc hồng chen bức là.
Cùng nhau giao bái một nhà,
Lễ đà đủ lễ đôi đà xứng đôi.
3135.Động phòng dìu dặt chén mồi,
Bâng khuâng duyên mới ngậm ngùi tình xưa.
Những từ sen ngó đào tơ,
Mười lăm năm mới bây giờ là đây!
Tình duyên ấy hợp tan này,
3140.Bi hoan mấy nỗi đêm chầy trăng cao.
Canh khuya bức gấm rủ thao,
Dưới đèn tỏ rạng má đào thêm xuân.
Tình nhân lại gặp tình nhân,
Hoa xưa ong cũ mấy phân chung tình.
3145.Nàng rằng: Phận thiếp đã đành,
Có làm chi nữa cái mình bỏ đi!
Nghĩ chàng nghĩa cũ tình ghi,
Chiều lòng gọi có xướng tùy mảy may.
Riêng lòng đã thẹn lắm thay,
3150.Cũng đà mặt dạn mày dày khó coi!
Những như âu yếm vành ngoài,
Còn toan mở mặt với người cho qua.
Lại như những thói người ta,
Vớt hương dưới đất bẻ hoa cuối mùa.
3155.Khéo là giở nhuốc bày trò,
Còn tình đâu nữa là thù đấy thôi!
Người yêu ta xấu với người,
Yêu nhau thì lại bằng mười phụ nhau!
Cửa nhà dù tính về sau,
3160.Thì còn em đó lọ cầu chị đây.
Chữ trinh còn một chút này,
Chẳng cầm cho vững lại giày cho tan!
Còn nhiều ân ái chan chan,
Hay gì vầy cánh hoa tàn mà chơi?
3165.Chàng rằng: Gắn bó một lời,
Bỗng không cá nước chim trời lỡ nhau.
Xót người lưu lạc bấy lâu,
Tưởng thề thốt nặng nên đau đớn nhiều!
Thương nhau sinh tử đã liều,
3170.Gặp nhau còn chút bấy nhiêu là tình.
Chừng xuân tơ liễu còn xanh,
Nghĩ rằng chưa thoát khỏi vành ái ân.
Gương trong chẳng chút bụi trần,
Một lời quyết hẳn muôn phần kính thêm!
3175.Bấy lâu đáy bể mò kim,
Là nhiều vàng đá phải tìm trăng hoa?
Ai ngờ lại họp một nhà,
Lọ là chăn gối mới ra sắt cầm!
Nghe lời sửa áo cài trâm,
3180.Khấu đầu lạy tạ cao thâm nghìn trùng:
Thân tàn gạn đục khơi trong,
Là nhờ quân tử khác lòng người ta.
Mấy lời tâm phúc ruột rà,
Tương tri dường ấy mới là tương tri!
3185.Chở che đùm bọc thiếu chi,
Trăm năm danh tiết cũng vì đêm nay!
Thoắt thôi tay lại cầm tay,
Càng yêu vì nết càng say vì tình.
Thêm nến giá nối hương bình,
3190.Cùng nhau lại chuốc chén quỳnh giao hoan.

Tình xưa lai láng khôn hàn,
Thong dong lại hỏi ngón đàn ngày xưa.
Nàng rằng: Vì mấy đường tơ,
Lầm người cho đến bây giờ mới thôi!
3195.Ăn năn thì sự đã rồi!
Nể lòng người cũ vâng lời một phen.
Phím đàn dìu dặt tay tiên,
Khói trầm cao thấp tiếng huyền gần xa.
Khúc đâu đầm ấm dương hòa,
3200.Ấy là hồ điệp hay là Trang sinh.
Khúc đâu êm ái xuân tình,
Ấy hồn Thục đế hay mình đỗ quyên?
Trong sao châu nhỏ duềnh quyên,
Ấm sao hạt ngọc Lam điền mới đông!
3205.Lọt tai nghe suốt năm cung,
Tiếng nào là chẳng não nùng xôn xao.
Chàng rằng: Phổ ấy tay nào,
Xưa sao sầu thảm nay sao vui vầy?
Tẻ vui bởi tại lòng này,
3210.Hay là khổ tận đến ngày cam lai?
Nàng rằng: Ví chút nghề chơi,
Đoạn trường tiếng ấy hại người bấy lâu!
Một phen tri kỷ cùng nhau,
Cuốn dây từ đấy về sau cũng chừa.
3215.Chuyện trò chưa cạn tóc tơ,
Gà đà gáy sáng trời vừa rạng đông.
Tình riêng chàng lại nói sòng,
Một nhà ai cũng lạ lùng khen lao.
Cho hay thục nữ chí cao,
3220.Phải người tối mận sớm đào như ai?
Hai tình vẹn vẽ hòa hai,
Chẳng trong chăn gối cũng ngoài cầm thơ.
Khi chén rượu khi cuộc cờ,
Khi xem hoa nở khi chờ trăng lên.
3225.Ba sinh đã phỉ mười nguyền,
Duyên đôi lứa cũng là duyên bạn bầy.
Nhớ lời lập một am mây,
Khiến người thân thích rước thầy Giác Duyên.
Đến nơi đóng cửa cài then,
3230.Rêu trùm kẻ ngạch cỏ len mái nhà,
Sư đà hái thuốc phương xa,
Mây bay hạc lánh biết là tìm đâu?
Nặng vì chút nghĩa bấy lâu,
Trên am cứ giữ hương dầu hôm mai.
3235.Một nhà phúc lộc gồm hai,
Ngàn năm dằng dặc quan giai lần lần.
Thừa gia chẳng hết nàng Vân,
Một cây cù mộc một sân quế hòe.
Phong lưu phú quý ai bì,
3240.Vườn xuân một cửa để bia muôn đời
Ngẫm hay muôn sự tại trời,
Trời kia đã bắt làm người có thân.
Bắt phong trần phải phong trần,
Cho thanh cao mới được phần thanh cao.
3245.Có đâu thiên vị người nào,
Chữ tài chữ mệnh dồi dào cả hai,
Có tài mà cậy chi tài,
Chữ tài liền với chữ tai một vần.
Đã mang lấy nghiệp vào thân,
3250.Cũng đừng trách lẫn trời gần trời xa.
Thiện căn ở tại lòng ta,
Chữ tâm kia mới bằng ba chữ tài.
Lời quê chắp nhặt dông dài,
Mua vui cũng được một vài trống canh.
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  },
  {
    title: "name",
    category: "thể loại",
    excerpt: `
  abcdef
    `
  }
];

const categories = ["Cách mạng", "Trữ tình", "Lục bát"];

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, body } = event;
  const selectedIndex = parseInt(body) - 1;

  if (handleReply.type === "categoryMenu") {
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= categories.length) {
      return api.sendMessage("Vui lòng chọn một số hợp lệ.", threadID, messageID);
    }

    const selectedCategory = categories[selectedIndex];
    const poemsInCategory = poems.filter(poem => poem.category === selectedCategory);
    const menu = poemsInCategory.map((poem, index) => `${index + 1}. ${poem.title}`).join('\n');
    const message = `Chọn một bài thơ để đọc:\n\n${menu}\n\nHãy trả lời với số tương ứng để chọn.`;

    return api.sendMessage(message, threadID, (error, info) => {
      if (error) return console.error(error);
      global.client.handleReply.push({
        type: "poemMenu",
        name: this.config.name,
        author: event.senderID,
        category: selectedCategory,
        messageID: info.messageID
      });
    });
  }

  if (handleReply.type === "poemMenu") {
    const selectedCategory = handleReply.category;
    const poemsInCategory = poems.filter(poem => poem.category === selectedCategory);

    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= poemsInCategory.length) {
      return api.sendMessage("Vui lòng chọn một số hợp lệ.", threadID, messageID);
    }

    const selectedPoem = poemsInCategory[selectedIndex];
    const response = `📜 ${selectedPoem.title}\n\n${selectedPoem.excerpt}`;

    // Remove the menu message
    api.unsendMessage(handleReply.messageID);

    return api.sendMessage(response, threadID);
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;
  const menu = categories.map((category, index) => `${index + 1}. ${category}`).join('\n');
  const message = `Chọn một thể loại thơ:\n\n${menu}\n\nHãy trả lời với số tương ứng để chọn.`;

  api.sendMessage(message, threadID, (error, info) => {
    if (error) return console.error(error);
    global.client.handleReply.push({
      type: "categoryMenu",
      name: this.config.name,
      author: event.senderID,
      messageID: info.messageID
    });
  });
};
