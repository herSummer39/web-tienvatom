export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  contact: string;
  source: string;
  service_type?: string;
  pages_count?: string;
  addons?: string[];
  estimated_total?: number;
  notes?: string;
  status: string;
  created_at: string;
}

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'ai-va-bao-mat-website',
    title: 'AI đang thay đổi an ninh mạng: Website của bạn đã sẵn sàng chưa?',
    excerpt:
      'Làn sóng trí tuệ nhân tạo đang đặt ra tiêu chuẩn mới về bảo mật hệ thống. Doanh nghiệp cần chuẩn bị gì để bảo vệ website và dữ liệu khách hàng.',
    content: `Trong năm 2026, website không còn chỉ là bộ mặt thương hiệu mà là điểm chạm dữ liệu quan trọng nhất của doanh nghiệp.\n\n1. Tách biệt Frontend và Database: Sử dụng kiến trúc hiện đại (Next.js + Supabase RLS) giúp giảm thiểu tối đa rủi ro SQL Injection so với các mã nguồn mở cũ kỹ.\n\n2. Kiểm soát Chatbot AI bằng RAG: Khi gắn AI lên web, tuyệt đối không để bot tự suy diễn giá bán hay chính sách. Dữ liệu phải được ràng buộc chặt từ tài liệu nội bộ.\n\n3. Theo dõi & Sao lưu tự động: Mọi form thu lead và lịch sử trò chuyện cần được lưu trữ có phân quyền rõ ràng.`,
    category: 'AI & Bảo mật',
    cover_image: '/wp-content/uploads/2026/08/ambar-ultramar-1024x576.webp',
    meta_title: 'AI và Bảo mật Website Doanh nghiệp 2026 | Studio Web & AI',
    meta_description:
      'Cách bảo vệ website doanh nghiệp và dữ liệu khách hàng khi tích hợp Chatbot AI và Automation.',
    created_at: '2026-11-10T09:00:00Z',
  },
  {
    id: '2',
    slug: 'xuat-ban-noi-dung-da-kenh-posse',
    title: 'Xuất bản trên website riêng và phân phối đa kênh (POSSE)',
    excerpt:
      'Tìm hiểu phương pháp POSSE: đăng nội dung gốc trên website của bạn trước rồi mới phân phối sang mạng xã hội để làm chủ dữ liệu và tối ưu SEO.',
    content: `Rất nhiều doanh nghiệp mắc sai lầm khi đổ toàn bộ công sức viết bài lên Facebook hay TikTok mà bỏ quên website.\n\nKhi bạn đăng bài chuẩn SEO trên website trước (Publish on your Own Site, Syndicate Elsewhere):\n- Google và các công cụ AI Search (ChatGPT, Gemini, Perplexity) ghi nhận bạn là nguồn gốc chính thức.\n- Bạn sở hữu 100% traffic, gắn được Pixel/GA4 và Chatbot AI giữ khách 24/7.\n- Mỗi bài viết trên /blog là một tài sản tăng trưởng bền vững không phụ thuộc thuật toán mạng xã hội.`,
    category: 'SEO & Tăng trưởng',
    cover_image: '/wp-content/uploads/2026/07/posse-web-onlines-1024x576.webp',
    meta_title: 'Phương pháp POSSE: Làm chủ SEO và phân phối đa kênh',
    meta_description:
      'Chiến lược đăng bài chuẩn SEO trên website riêng trước khi chia sẻ lên Zalo, Fanpage và TikTok.',
    created_at: '2026-11-05T09:00:00Z',
  },
  {
    id: '3',
    slug: 'thiet-ke-web-lay-nguoi-dung-lam-trung-tam',
    title: 'Thiết kế web lấy người dùng làm trung tâm và các nguyên tắc cốt lõi',
    excerpt:
      'Đi thẳng vào trọng tâm: User-Centered Design (UCD) là phương pháp đặt trải nghiệm người dùng thật làm kim chỉ nam cho mọi quyết định giao diện.',
    content: `Một website đẹp nhưng khách vào không biết bấm nút nào để hỏi giá thì vẫn là một website thất bại.\n\n3 nguyên tắc chúng tôi luôn áp dụng khi thiết kế:\n1. Tốc độ tải trang dưới 1.5 giây trên 4G di động.\n2. Minh bạch thông tin và có công cụ ước tính chi phí hoặc CTA rõ ràng ngay màn hình đầu tiên.\n3. Tích hợp luồng hỗ trợ tức thì (Chatbot AI + Zalo) để không bỏ lỡ khách hàng ngoài giờ hành chính.`,
    category: 'UI/UX Design',
    cover_image: '/wp-content/uploads/2024/05/diseno-centrado-usuario-1024x576.webp',
    meta_title: 'Thiết kế Web lấy người dùng làm trung tâm (UCD)',
    meta_description:
      'Nguyên tắc thiết kế UI/UX giúp website doanh nghiệp tải nhanh, dễ dùng và tăng tỷ lệ chuyển đổi.',
    created_at: '2026-10-28T09:00:00Z',
  },
];

export const PROJECTS_SHOWCASE = [
  {
    slug: 'du-an-thuc-te-01',
    badge: 'DỰ ÁN THỰC TẾ',
    title: 'Website Thương hiệu & Giới thiệu Dịch vụ Doanh nghiệp',
    industry: 'Dịch vụ B2B',
    summary:
      'Thiết kế giao diện độc quyền, tối ưu cấu trúc SEO Google và tốc độ tải trang đạt 96+ điểm PageSpeed trên di động.',
    image: '/wp-content/uploads/2026/06/Tarjeta-2.webp',
    metrics: ['96+ PageSpeed', '< 1.2s Load', '100% Responsive'],
  },
  {
    slug: 'du-an-thuc-te-02',
    badge: 'DỰ ÁN THỰC TẾ',
    title: 'Hệ thống Landing Page Chuyển đổi & Thu Lead Tự động',
    industry: 'Thương mại / Bán lẻ',
    summary:
      'Xây dựng phễu bán hàng rõ ràng, gắn Pixel/GA4 đo lường chuyển đổi và tự động đẩy thông tin khách hàng về Zalo/Sheet.',
    image: '/wp-content/uploads/2026/06/Tarjeta-4-e1782838173165.webp',
    metrics: ['Tăng 2.4x Lead', 'Tracking GA4/Pixel', 'Đồng bộ Sheet'],
  },
  {
    slug: 'demo-nha-khoa-ai',
    badge: 'GIẢI PHÁP MẪU (LIVE DEMO)',
    title: 'Website Nha khoa / Spa tích hợp Chatbot AI Đặt lịch 24/7',
    industry: 'Y tế & Làm đẹp',
    summary:
      'Khách hàng hỏi bảng giá dịch vụ lúc 11h đêm, Chatbot AI đọc đúng dữ liệu phòng khám, tư vấn và đẩy lịch hẹn về Zalo OA.',
    image: '/wp-content/uploads/2026/06/Tarjeta-5-e1782838269241.webp',
    metrics: ['Chatbot AI RAG', 'Đặt lịch tự động', 'Báo tin Zalo/Telegram'],
  },
  {
    slug: 'demo-webapp-quan-ly',
    badge: 'GIẢI PHÁP MẪU (LIVE DEMO)',
    title: 'Web App Quản lý Đơn hàng & Kho nội bộ thay thế Excel',
    industry: 'Vận hành SME',
    summary:
      'Quản lý khách hàng, trạng thái đơn, xuất báo cáo và phân quyền nhân viên trực tiếp trên trình duyệt — mượt mà trên cả điện thoại.',
    image: '/wp-content/themes/onlines-web-2026/blocks/home-contacto/home-contacto-images/tarjeta-metricas.webp',
    metrics: ['Next.js + Supabase', 'Phân quyền Auth', 'Realtime Sync'],
  },
];

// In-memory runtime store for local demo when Supabase keys are not yet set
export const runtimeStore: {
  posts: BlogPost[];
  leads: LeadRecord[];
} = {
  posts: [...INITIAL_POSTS],
  leads: [
    {
      id: 'demo-lead-1',
      name: 'Anh Minh (Mẫu)',
      contact: '0909.xxx.xxx',
      source: 'bao-gia',
      service_type: 'Thiết kế + Lập trình Website',
      pages_count: '5 trang',
      addons: ['Chatbot AI đọc bảng giá riêng', 'Automation đẩy Lead về Zalo/Telegram'],
      estimated_total: 14500000,
      notes: 'Cần làm web giới thiệu phòng khám nha khoa kèm bot đặt lịch.',
      status: 'Mới',
      created_at: new Date().toISOString(),
    },
  ],
};
