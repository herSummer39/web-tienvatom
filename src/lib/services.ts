// Nội dung dịch vụ dùng chung: trang Dịch vụ, footer, chatbot và llms.txt đều đọc từ đây.
export type Service = {
  id: string;
  name: string; // tên kỹ thuật + kết quả
  short: string; // tên ngắn cho footer / menu
  price: string;
  pain: string; // nỗi đau của khách
  points: string[]; // giải pháp, gom theo: thẩm mỹ, hiệu năng, dễ dùng, quyền sở hữu
  href: string;
  cta: string;
};

export const SERVICES: Service[] = [
  {
    id: 'website',
    name: 'Website chuẩn SEO, tự đăng bài bán hàng',
    short: 'Website trọn gói',
    price: 'Báo giá theo nhu cầu',
    pain: 'Web cũ tải chậm, vỡ giao diện trên điện thoại, muốn đăng bài mới lại phải nhờ người khác.',
    points: [
      'Giao diện thiết kế riêng, hiển thị mượt trên điện thoại',
      'Chuẩn SEO, tải nhanh để khách tìm thấy bạn trên Google',
      'Trang quản trị đơn giản: tự đăng bài, sản phẩm, hình ảnh',
      'Gắn thêm Zalo, Chatbot AI, thanh toán khi bạn cần',
      'Bàn giao toàn bộ mã nguồn và tài khoản quản trị',
    ],
    href: '/bao-gia',
    cta: 'Tính báo giá',
  },
  {
    id: 'design',
    name: 'Landing page bán hàng, chạy quảng cáo',
    short: 'Landing page',
    price: 'Báo giá theo nhu cầu',
    pain: 'Chạy quảng cáo mà khách bấm vào lại rơi vào fanpage hay một trang chung chung, không biết đặt hàng ở đâu.',
    points: [
      'Một trang tập trung vào một sản phẩm hoặc chương trình',
      'Nút đặt hàng, nhắn Zalo, form đăng ký luôn dễ thấy',
      'Hiển thị mượt trên mọi thiết bị, tải nhanh',
      'Chỉnh sửa theo góp ý trước khi bàn giao',
    ],
    href: '/bao-gia',
    cta: 'Tính báo giá',
  },
  {
    id: 'software',
    name: 'Phần mềm quản lý làm riêng, thay thế Excel',
    short: 'Phần mềm theo nhu cầu',
    price: 'Liên hệ',
    pain: 'Đơn hàng, kho, lịch hẹn nằm rải rác trong nhiều file Excel, nhân viên nhập tay hay nhầm.',
    points: [
      'Chỉ làm đúng tính năng bạn cần, dễ mở rộng khi doanh nghiệp lớn lên',
      'Quản lý bán hàng, đơn hàng, kho, đặt lịch, khách hàng',
      'Dùng được trên máy tính và điện thoại, phân quyền nhân viên',
      'Xuất báo cáo Excel / Google Sheet khi cần',
      'Bàn giao toàn bộ mã nguồn',
    ],
    href: '/lien-he',
    cta: 'Trao đổi nhu cầu',
  },
  {
    id: 'zalo',
    name: 'Phần mềm Zalo Marketing: chăm sóc nhiều khách hơn, ít tốn thời gian hơn',
    short: 'Phần mềm Zalo Marketing',
    price: 'Liên hệ',
    pain: 'Phải dùng nhiều điện thoại cho nhiều tài khoản Zalo, khách nhắn tới mà trả lời không xuể.',
    points: [
      'Quản lý nhiều tài khoản Zalo trên một màn hình duy nhất',
      'Trả lời tin nhắn tự động, không bỏ sót khách',
      'Tự động đăng bài theo giờ hẹn',
      'Lọc khách hàng tiềm năng trong nhóm',
    ],
    href: '/phan-mem-zalo',
    cta: 'Xem chi tiết',
  },
];

export const PROCESS = [
  { title: 'Tiếp nhận & tư vấn', text: 'Bạn kể nhu cầu, tụi mình hỏi rõ mục tiêu và gửi báo giá trước khi làm.' },
  { title: 'Thiết kế giao diện', text: 'Gửi bản thiết kế để bạn xem và góp ý, duyệt xong mới lập trình.' },
  { title: 'Lập trình & tích hợp', text: 'Hoàn thiện website / phần mềm, gắn Zalo, thanh toán… nếu bạn cần.' },
  { title: 'Kiểm thử & bàn giao', text: 'Kiểm tra trên máy tính và điện thoại, hướng dẫn bạn tự quản lý.' },
  { title: 'Bảo hành', text: 'Website có sự cố là tụi mình sửa miễn phí, bảo hành trọn đời.' },
];

export const FAQS = [
  {
    q: 'Có phát sinh chi phí không?',
    a: 'Giá được chốt trước khi bắt đầu. Chỉ phát sinh khi bạn muốn thêm tính năng mới, và tụi mình luôn báo giá trước để bạn quyết định.',
  },
  {
    q: 'Bao lâu thì xong?',
    a: 'Website thường mất khoảng 5–14 ngày làm việc tùy số trang và tính năng. Phần mềm theo nhu cầu thì tụi mình báo tiến độ sau khi trao đổi.',
  },
  {
    q: 'Sau này muốn sửa thì sao?',
    a: 'Nội dung, bài viết, hình ảnh bạn tự sửa qua trang quản trị. Lỗi kỹ thuật thì tụi mình sửa miễn phí. Muốn thêm tính năng mới thì tụi mình báo giá riêng.',
  },
  {
    q: 'Giá đã gồm tên miền và hosting chưa?',
    a: 'Chưa. Bạn tự đăng ký tên miền và hosting đứng tên mình để chủ động quản lý, tụi mình hỗ trợ cài đặt website lên đó.',
  },
  {
    q: 'Bảo hành trọn đời là bảo hành những gì?',
    a: 'Website tụi mình làm mà gặp sự cố hay ngừng chạy thì tụi mình sửa miễn phí. Không áp dụng khi tên miền, hosting hết hạn hoặc mã nguồn bị bên khác chỉnh sửa.',
  },
];
