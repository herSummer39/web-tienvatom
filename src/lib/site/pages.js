// Danh sách các trang của website Tiệm Code.
// Mỗi trang dùng chung khung giao diện (template.html): menu, phần "Liên hệ ngay", footer, khung chat.
//   show:    các khối có sẵn trong thiết kế sẽ hiện ở trang này (mỗi khối chỉ dùng ở 1 trang)
//   content: phần đầu trang (luôn có tiêu đề) + nội dung riêng, nằm trên các khối thiết kế
//   after:   nội dung riêng đặt sau các khối thiết kế, ngay trước phần "Liên hệ ngay"
// Bài blog nằm ở thư mục content/blog (xem src/lib/site/blog.js).
// Sửa chữ ở đây rồi chạy: npm run build (hoặc npm run dev để xem ngay)

const ZALO = 'https://zalo.me/0565567789';
const PHONE = '0565567789';

// ---------- Khối dựng sẵn ----------
const arrow = '<svg viewBox="0 0 16 12" width="16" height="12" aria-hidden="true"><path d="M1 6h13M9.5 1.5 14 6l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// nút thường (link)
const btn = (label, href, variant = '') =>
  `<a class="tcp-btn" href="${href}"${variant ? ` data-variant="${variant}"` : ''}${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}><span>${label}</span>${arrow}</a>`;
// nút mở form đăng ký tư vấn (service: website | design | software | zalo | tuvan)
const lead = (label, service = 'tuvan', variant = '') =>
  `<a class="tcp-btn" href="/lien-he#dang-ky" data-tc-lead="${service}"${variant ? ` data-variant="${variant}"` : ''}><span>${label}</span>${arrow}</a>`;

const header = ({ sticker, title, text, color = 'yellow', actions = '' }) => `
  <header class="tcp-hero">
    <span class="tcp-sticker tcp-bg-${color}">${sticker}</span>
    <h1 class="tcp-title">${title}</h1>
    ${text ? `<p class="tcp-lead">${text}</p>` : ''}
    ${actions ? `<div class="tcp-actions">${actions}</div>` : ''}
  </header>`;

const check = '<svg class="tcp-check" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="m6 10.2 2.6 2.6L14 7.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const list = (items) => `<ul class="tcp-list">${items.map((i) => `<li>${check}<span>${i}</span></li>`).join('')}</ul>`;
const faq = (items) => `<div class="tcp-faq">${items
  .map((f) => `<details><summary><span>${f.q}</span><i aria-hidden="true">+</i></summary><p>${f.a}</p></details>`)
  .join('')}</div>`;
const tilt = (i) => (i % 2 ? '0.8deg' : '-0.8deg');
const secHead = (title, lead) => `<div class="tcp-sec-head"><h2 class="tcp-h2">${title}</h2>${lead ? `<p class="tcp-lead">${lead}</p>` : ''}</div>`;
const stats = (items) => `<div class="tcp-stats">${items
  .map(([b, s, c], i) => `<div class="tcp-stat tcp-bg-${c}" style="--tilt:${tilt(i)}"><b>${b}</b><span>${s}</span></div>`)
  .join('')}</div>`;
const steps = (items) => `<ol class="tcp-steps" style="grid-template-columns:repeat(${items.length},minmax(0,1fr))">${items
  .map(([c, t, d], i) => `<li class="tcp-step tcp-bg-${c}"><span class="tcp-step-num">0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`)
  .join('')}</ol>`;

// icon nét đơn giản cho thẻ tính năng
const ICONS = {
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  chat: '<path d="M12 3.5a8.5 8.5 0 0 1 0 17 8.4 8.4 0 0 1-4.2-1.1L3.5 20.5l1.1-4.3A8.5 8.5 0 0 1 12 3.5Z"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.3 10.8 7.4-3.6M8.3 13.2l7.4 3.6"/>',
};
const icon = (k) => `<span class="tcp-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg></span>`;

// ---------- Form đăng ký tư vấn (dùng cho popup trên mọi trang + form ở trang Liên hệ) ----------
const SERVICE_CHOICES = [
  ['website', 'Website trọn gói'],
  ['design', 'Thiết kế giao diện'],
  ['software', 'Phần mềm theo nhu cầu'],
  ['zalo', 'Phần mềm Zalo Marketing'],
  ['tuvan', 'Chưa rõ, cần tư vấn'],
];
const LEAD_FORM = `
  <form class="tc-form" data-tcp-lead action="/lien-he#dang-ky" onsubmit="return false">
    <fieldset>
      <legend>Bạn đang cần gì?</legend>
      <div class="tc-chips">${SERVICE_CHOICES.map(([v, l]) => `<label class="tc-chip"><input type="radio" name="service" value="${v}"${v === 'tuvan' ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div>
    </fieldset>
    <div class="tc-row">
      <label class="tc-field"><span>Họ tên <i>*</i></span><input name="name" required autocomplete="name" placeholder="Nguyễn Văn A"></label>
      <label class="tc-field"><span>Số điện thoại / Zalo <i>*</i></span><input name="phone" type="tel" inputmode="tel" required autocomplete="tel" pattern="[0-9+().\\s\\-]{8,20}" placeholder="09xx xxx xxx"></label>
    </div>
    <label class="tc-field"><span>Email</span><input name="email" type="email" autocomplete="email" placeholder="Không bắt buộc"></label>
    <label class="tc-field"><span>Bạn muốn làm gì?</span><textarea name="note" rows="3" placeholder="Ví dụ: shop mỹ phẩm, cần website bán hàng có thanh toán online…"></textarea></label>
    <input class="tc-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <p class="tcp-form-msg" role="alert" hidden></p>
    <div class="tc-form-foot">
      <button type="submit" class="tcp-btn"><span>Gửi đăng ký</span>${arrow}</button>
      <p class="tc-form-alt">hoặc <a href="${ZALO}" target="_blank" rel="noopener">nhắn Zalo ${PHONE}</a></p>
    </div>
    <p class="tc-form-note">Thông tin chỉ dùng để tư vấn cho bạn, không gửi cho bên nào khác. Xem <a href="/bao-mat">chính sách bảo mật</a>.</p>
  </form>
  <div class="tc-lead-done" hidden>
    <div class="tc-done-icon"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#252122" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>
    <h3>Đã nhận thông tin!</h3>
    <p>Cảm ơn bạn. Chúng mình sẽ liên hệ lại qua số điện thoại bạn để lại để tư vấn chi tiết.</p>
    <div class="tcp-actions"><a class="tcp-btn" href="#" data-tc-again data-variant="ghost"><span>Gửi thêm yêu cầu</span></a><button type="button" class="tcp-btn" data-close><span>Đóng</span></button></div>
  </div>`;

// ================= TRANG DỊCH VỤ =================
const SERVICES = [
  {
    color: 'orange', id: 'website',
    name: 'Website chuẩn SEO, tự đăng bài bán hàng',
    price: '7.000.000đ · đến 10 trang',
    pain: 'Web cũ tải chậm, vỡ giao diện trên điện thoại, muốn đăng bài mới lại phải nhờ người khác.',
    points: ['Giao diện thiết kế riêng theo thương hiệu', 'Trang quản trị đơn giản: tự đăng bài, sản phẩm, hình ảnh', 'Gắn thêm Zalo, Chatbot AI, thanh toán khi bạn cần', 'Bàn giao toàn bộ mã nguồn và tài khoản quản trị'],
  },
  {
    color: 'yellow', id: 'design',
    name: 'Thiết kế giao diện web dễ dùng, dễ ra đơn',
    price: 'Từ 4.500.000đ',
    pain: 'Đã có người lập trình nhưng giao diện rối mắt, khách vào không biết bấm vào đâu.',
    points: ['Bố cục rõ ràng, nút liên hệ và mua hàng dễ thấy', 'Bản cho cả máy tính và điện thoại', 'Chỉnh theo góp ý trước khi bàn giao', 'Bàn giao file Figma cho đội lập trình'],
  },
  {
    color: 'blue', id: 'software',
    name: 'Phần mềm quản lý làm riêng, thay thế Excel',
    price: 'Báo giá theo nhu cầu',
    pain: 'Đơn hàng, kho, lịch hẹn nằm rải rác trong nhiều file Excel, nhân viên nhập tay hay nhầm.',
    points: ['Quản lý bán hàng, đơn hàng, kho, đặt lịch, khách hàng', 'Phân quyền cho từng nhân viên', 'Xuất báo cáo Excel / Google Sheet khi cần', 'Dễ mở rộng khi doanh nghiệp lớn lên'],
  },
  {
    color: 'green', id: 'zalo',
    name: 'Phần mềm Zalo Marketing',
    price: 'Báo giá theo số tài khoản',
    pain: 'Phải dùng nhiều điện thoại cho nhiều tài khoản Zalo, khách nhắn tới mà trả lời không xuể.',
    points: ['Nhiều tài khoản Zalo trên một màn hình', 'Trả lời tự động, hẹn giờ gửi tin', 'Đăng bài lên nhiều nhóm cùng lúc', 'Lọc khách hàng tiềm năng trong nhóm'],
    more: ['Xem phần mềm', '/phan-mem-zalo'],
  },
];
const FEATURES = [
  ['phone', 'yellow', 'Đẹp trên điện thoại', 'Phần lớn khách vào web bằng điện thoại, nên giao diện được làm cho màn hình nhỏ trước.'],
  ['bolt', 'orange', 'Tải nhanh', 'Ảnh được nén, mã gọn nhẹ để trang mở nhanh, khách không bỏ đi giữa chừng.'],
  ['search', 'blue', 'Sẵn sàng lên Google', 'Có tiêu đề, mô tả, sơ đồ trang (sitemap) và kết nối Google Search Console.'],
  ['lock', 'green', 'Bảo mật HTTPS', 'Có ổ khóa trên trình duyệt, khách yên tâm khi điền thông tin.'],
  ['edit', 'pink', 'Tự sửa nội dung', 'Đổi chữ, thay ảnh, đăng bài mới ngay trên trang quản trị, không cần biết code.'],
  ['chat', 'yellow', 'Khách liên hệ 1 chạm', 'Nút Zalo, gọi điện và form đăng ký luôn trong tầm tay khách.'],
  ['chart', 'blue', 'Biết ai đang ghé', 'Gắn Google Analytics để xem có bao nhiêu khách và họ đến từ đâu.'],
  ['share', 'green', 'Chia sẻ đẹp', 'Gửi link lên Facebook, Zalo hiện đúng ảnh và tiêu đề bạn muốn.'],
];
const TIMELINE = [
  ['yellow', 'Ngày 1', 'Trò chuyện & chốt phạm vi', 'Bạn kể về việc kinh doanh. Chúng mình chốt số trang, tính năng và gửi báo giá.'],
  ['orange', 'Ngày 2 – 4', 'Thiết kế', 'Bản thiết kế trang chủ và các trang chính được gửi để bạn góp ý, sửa tới khi ưng.'],
  ['blue', 'Ngày 5 – 10', 'Lập trình', 'Dựng website thật, trang quản trị, gắn Zalo, form, thanh toán nếu có.'],
  ['pink', 'Ngày 11 – 13', 'Kiểm tra cùng bạn', 'Bạn dùng thử trên điện thoại và máy tính, chỗ nào chưa ổn chúng mình sửa ngay.'],
  ['green', 'Ngày 14', 'Lên sóng', 'Đưa website lên tên miền của bạn, hướng dẫn tự đăng bài và bàn giao mọi tài khoản.'],
];
const TOOLS = ['Figma', 'Next.js', 'React', 'Node.js', 'Supabase', 'Vercel', 'OpenAI', 'Google Search Console', 'Google Analytics', 'Google Sheet'];

const dichVuContent = `
  <section class="tcp-wrap">
    ${header({
      sticker: 'Dịch vụ',
      color: 'green',
      title: 'Chỉ làm đúng<br>thứ bạn cần',
      text: 'Website, giao diện, phần mềm quản lý và phần mềm Zalo Marketing cho shop và doanh nghiệp nhỏ.',
      actions: lead('Đăng ký tư vấn') + btn('Ước tính chi phí', '/bao-gia#uoc-tinh', 'ghost'),
    })}
    <div class="tcp-grid-2">
      ${SERVICES.map((s, i) => `
      <article class="tcp-card tcp-bg-${s.color}" style="--tilt:${tilt(i)}">
        <span class="tcp-price">${s.price}</span>
        <h2 class="tcp-card-title">${s.name}</h2>
        <p class="tcp-pain">${s.pain}</p>
        ${list(s.points)}
        <div class="tcp-card-cta tcp-actions" style="justify-content:flex-start">${lead('Đăng ký tư vấn', s.id, 'dark')}${s.more ? btn(s.more[0], s.more[1], 'ghost') : ''}</div>
      </article>`).join('')}
    </div>
  </section>
  <section class="tcp-wrap">
    <div class="tcp-sec">
      ${secHead('Website nào<br>cũng có sẵn', 'Những thứ cơ bản nhưng hay bị bỏ quên. Ở Tiệm Code, chúng nằm sẵn trong gói.')}
      <div class="tcp-grid-4">${FEATURES.map(([ic, c, t, d], i) => `<article class="tcp-feature tcp-bg-${c}" style="--tilt:${tilt(i)}">${icon(ic)}<h3>${t}</h3><p>${d}</p></article>`).join('')}</div>
    </div>
    <div class="tcp-sec">
      ${secHead('14 ngày<br>của một website', 'Thời gian tham khảo cho website khoảng 10 trang. Bạn luôn biết hôm nay dự án đang ở đâu.')}
      <ol class="tcp-timeline">${TIMELINE.map(([c, d, t, p]) => `<li class="tcp-bg-${c}"><b>${d}</b><div><h3>${t}</h3><p>${p}</p></div></li>`).join('')}</ol>
    </div>
    <div class="tcp-sec" style="margin-bottom:0">
      ${secHead('Công cụ<br>chúng mình dùng', 'Công nghệ phổ biến, nhiều người dùng, dễ tìm người hỗ trợ nếu sau này bạn muốn tự phát triển tiếp.')}
      <div class="tcp-chips">${TOOLS.map((t) => `<span>${t}</span>`).join('')}</div>
    </div>
  </section>`;

// ================= VỀ CHÚNG MÌNH =================
const aboutContent = `
  <section class="tcp-wrap">
    ${header({
      sticker: 'Về chúng mình',
      color: 'yellow',
      title: 'Xin chào,<br>chúng mình là Tiệm Code',
      text: 'Một nhóm sinh viên IT thích làm ra sản phẩm thật. Chúng mình đồng hành cùng shop và doanh nghiệp nhỏ từ ý tưởng đầu tiên tới khi website chạy ổn định.',
      actions: lead('Đăng ký tư vấn') + btn('Xem dịch vụ', '/dich-vu', 'ghost'),
    })}
    <div class="tcp-split" style="margin-top:10px">
      <div>
        <h2 class="tcp-h2">Vì sao có<br>Tiệm Code?</h2>
        <p class="tcp-lead">Chúng mình thấy nhiều shop và doanh nghiệp nhỏ gặp cùng một chuyện: muốn có website thì giá cao, làm xong lại không tự sửa được, có lỗi thì không biết nhờ ai.</p>
        <p class="tcp-lead">Tiệm Code ra đời năm 2026 để làm điều ngược lại: giá rõ ràng, làm đúng thứ bạn cần, bàn giao hết cho bạn và vẫn ở đó khi bạn cần hỗ trợ.</p>
      </div>
      <div class="tcp-card tcp-bg-dark">
        <span class="tcp-price">Điểm khác biệt</span>
        <h3 class="tcp-card-title">Vì sao chọn một nhóm sinh viên?</h3>
        ${list(['Chi phí hợp lý vì không tốn mặt bằng, bộ máy quản lý', 'Luôn cập nhật công nghệ mới: AI, tự động hóa', 'Có thời gian theo sát từng dự án', 'Làm bằng sự nhiệt tình: mỗi website là một sản phẩm để tự hào'])}
      </div>
    </div>
  </section>`;
const VALUES = [
  ['yellow', 'Học nhanh, làm thật', 'Ngành của bạn mới với chúng mình? Chúng mình tìm hiểu kỹ trước khi đề xuất.'],
  ['orange', 'Nói dễ hiểu', 'Không thuật ngữ khó. Bạn hỏi gì, chúng mình giải thích tới khi rõ thì thôi.'],
  ['blue', 'Đúng hẹn', 'Hẹn ngày nào giao ngày đó. Có trễ, chúng mình báo trước kèm lý do.'],
  ['green', 'Có trách nhiệm tới cùng', 'Website đã bàn giao vẫn là việc của chúng mình. Có lỗi là nhắn, có người sửa.'],
];
const aboutAfter = `
  <section class="tcp-wrap">
    <div class="tcp-sec">
      ${secHead('Tiệm Code<br>trong 4 con số', '')}
      ${stats([
        ['2026', 'Năm Tiệm Code ra đời', 'yellow'],
        ['4', 'Dịch vụ chính, làm sâu thay vì làm tràn lan', 'orange'],
        ['Toàn quốc', 'Làm việc online, ở tỉnh nào cũng được', 'blue'],
        ['1', 'Đầu mối duy nhất theo dự án của bạn từ đầu tới cuối', 'green'],
      ])}
    </div>
    <div class="tcp-sec" style="margin-bottom:0">
      ${secHead('Cách chúng mình<br>làm việc', 'Bốn điều cả nhóm tự đặt ra cho mình.')}
      <div class="tcp-grid-4">${VALUES.map(([c, t, d], i) => `<article class="tcp-card tcp-card-sm tcp-bg-${c}" style="--tilt:${tilt(i)}"><h3 class="tcp-card-title">${t}</h3><p>${d}</p></article>`).join('')}</div>
    </div>
  </section>`;

// ================= GỢI Ý THEO NGÀNH (cuối trang Dự án) =================
const INDUSTRIES = [
  ['green', 'Sự kiện, workshop', 'Nhận đăng ký bằng form, tới ngày lại dò tên từng người.', ['Trang sự kiện đẹp, chia sẻ dễ', 'Đặt vé online, vé có mã QR', 'Check-in bằng quét QR, thống kê tiền vé']],
  ['orange', 'Shop online', 'Khách hỏi giá liên tục, đơn nằm rải rác trong tin nhắn.', ['Website có giỏ hàng, giá rõ ràng', 'Báo đơn mới về Zalo ngay lập tức', 'Thanh toán VietQR / MoMo']],
  ['pink', 'Spa & thẩm mỹ', 'Khách muốn xem dịch vụ, bảng giá và đặt lịch nhanh.', ['Trang dịch vụ, bảng giá, hình trước – sau', 'Form đặt lịch hẹn', 'Phần mềm quản lý lịch và khách quen']],
  ['yellow', 'Nhà hàng, quán cà phê', 'Thực đơn hay đổi, khách muốn đặt bàn trước.', ['Thực đơn online tự cập nhật', 'Đặt bàn, gọi món qua Zalo', 'Chatbot trả lời giờ mở cửa, địa chỉ']],
  ['blue', 'Trung tâm, lớp học', 'Phụ huynh, học viên cần thông tin khóa học rõ ràng.', ['Trang khóa học, lịch khai giảng', 'Form đăng ký học thử', 'Quản lý học viên, học phí']],
  ['dark', 'Kinh doanh qua Zalo', 'Nhiều tài khoản, nhiều nhóm, trả lời khách không xuể.', ['Gom tài khoản về một màn hình', 'Tin nhắn chăm sóc theo lịch', 'Danh sách khách tiềm năng từ nhóm']],
];
const industriesHtml = `
    <div class="tcp-sec" style="margin-bottom:20px">
      ${secHead('Chưa thấy<br>ngành của bạn?', 'Vài gợi ý theo từng ngành. Mỗi dự án đều được làm riêng theo cách bạn kinh doanh.')}
      <div class="tcp-grid-3">${INDUSTRIES.map(([c, t, pain, items], i) => `
        <article class="tcp-card tcp-card-sm tcp-bg-${c}" style="--tilt:${tilt(i)}">
          <h3 class="tcp-card-title">${t}</h3>
          <p class="tcp-pain">${pain}</p>
          ${list(items)}
        </article>`).join('')}</div>
      <p class="tcp-note">Ngành khác? <a href="/lien-he#dang-ky" data-tc-lead="tuvan" style="color:inherit;font-weight:700">Kể chúng mình nghe</a>, tư vấn miễn phí.</p>
    </div>`;

// ================= PHẦN MỀM ZALO =================
const ZALO_GROUPS = [
  ['Tiết kiệm thời gian', 'orange', [
    ['Nhiều tài khoản, một màn hình', 'Quản lý nhiều tài khoản Zalo cùng lúc, không cần chuyển qua lại giữa các điện thoại.'],
    ['Hẹn giờ gửi tin', 'Soạn tin trước, hẹn giờ gửi cho từng nhóm khách theo lịch bạn muốn.'],
    ['Đăng bài nhóm', 'Đăng bài lên nhiều nhóm Zalo cùng lúc thay vì đăng tay từng nhóm.'],
  ]],
  ['Không bỏ sót khách', 'yellow', [
    ['Trả lời tự động', 'Cài sẵn câu trả lời theo từ khóa, khách nhắn lúc nào cũng được phản hồi.'],
    ['Chăm sóc hàng loạt', 'Gửi thông báo, ưu đãi tới danh sách khách hàng của bạn nhanh chóng.'],
  ]],
  ['Tìm thêm khách mới', 'blue', [
    ['Kết bạn tự động', 'Gửi lời mời kết bạn tới danh sách số điện thoại khách hàng bạn đã có.'],
    ['Lọc khách trong nhóm', 'Lấy danh sách thành viên các nhóm để tìm khách hàng tiềm năng phù hợp.'],
  ]],
];
const zaloContent = `
  <section class="tcp-wrap">
    ${header({
      sticker: 'Sản phẩm của Tiệm Code',
      color: 'green',
      title: 'Phần mềm<br>Zalo Marketing',
      text: 'Phải dùng nhiều điện thoại cho nhiều tài khoản Zalo, khách nhắn tới mà trả lời không xuể? Phần mềm do chính chúng mình phát triển giúp bạn gom tất cả về một màn hình.',
      actions: lead('Đăng ký nhận demo', 'zalo') + btn('Hỏi nhanh qua Zalo', ZALO, 'ghost'),
    })}
    ${ZALO_GROUPS.map(([title, color, items]) => `
    <div class="tcp-group">
      <h2 class="tcp-h2">${title}</h2>
      <div class="tcp-grid-3">
        ${items.map(([t, d]) => `<article class="tcp-card tcp-card-sm tcp-bg-${color}"><h3 class="tcp-card-title">${t}</h3><p>${d}</p></article>`).join('')}
      </div>
    </div>`).join('')}
    <div class="tcp-split">
      <div>
        <h2 class="tcp-h2">Phù hợp với ai?</h2>
        ${list(['Shop online bán hàng qua Zalo', 'Doanh nghiệp có đội ngũ sale, chăm sóc khách hàng', 'Người làm affiliate, cộng tác viên bán hàng', 'Ai đang phải dùng nhiều tài khoản Zalo mỗi ngày'])}
      </div>
      <div class="tcp-card tcp-bg-dark">
        <span class="tcp-price">Giá theo số tài khoản</span>
        <h3 class="tcp-card-title">Xem demo trước, quyết định sau</h3>
        <p>Để lại thông tin, chúng mình gửi video demo, báo giá và hướng dẫn cài đặt.</p>
        <div class="tcp-card-cta">${lead('Đăng ký nhận demo', 'zalo')}</div>
      </div>
    </div>
    <div class="tcp-group">
      <h2 class="tcp-h2">Bắt đầu thế nào?</h2>
      ${steps([
        ['yellow', 'Đăng ký', 'Cho chúng mình biết bạn dùng bao nhiêu tài khoản và cần tính năng nào.'],
        ['pink', 'Xem demo', 'Nhận video demo và báo giá theo đúng nhu cầu của bạn.'],
        ['blue', 'Cài đặt & hướng dẫn', 'Chúng mình cài đặt và hướng dẫn tới khi bạn dùng quen.'],
      ])}
    </div>
    <div class="tcp-group">
      <h2 class="tcp-h2">Câu hỏi về phần mềm</h2>
      ${faq([
        { q: 'Mình không rành máy tính có dùng được không?', a: 'Được. Chúng mình hỗ trợ cài đặt và hướng dẫn từng bước cho đến khi bạn dùng quen.' },
        { q: 'Dùng phần mềm có bị khóa tài khoản Zalo không?', a: 'Zalo có thể hạn chế tài khoản nếu gửi tin hoặc kết bạn với tần suất quá cao. Chúng mình hướng dẫn cách cài đặt tốc độ gửi hợp lý để dùng an toàn hơn.' },
        { q: 'Có cần để máy tính mở suốt không?', a: 'Các tính năng tự động (trả lời, hẹn giờ) chạy khi phần mềm đang mở. Chúng mình tư vấn cách sắp xếp phù hợp với cách bạn làm việc.' },
      ])}
    </div>
    <p class="tcp-note">Lưu ý: người dùng tự chịu trách nhiệm sử dụng phần mềm đúng chính sách của Zalo và quy định pháp luật về tin nhắn quảng cáo, dữ liệu cá nhân.</p>
  </section>`;

// ================= BÁO GIÁ =================
const baoGiaHead = `
  <section class="tcp-wrap" style="padding-bottom:10px">
    ${header({
      sticker: 'Báo giá',
      color: 'orange',
      title: 'Giá rõ ràng<br>trước khi làm',
      text: 'Website trọn gói có giá cố định. Phần mềm làm riêng được báo giá miễn phí sau khi trao đổi nhu cầu.',
      actions: btn('Ước tính trong 30 giây', '#uoc-tinh') + lead('Đăng ký nhận báo giá', 'tuvan', 'ghost'),
    })}
  </section>`;
const ADDONS = [
  ['orange', 'Chatbot AI tư vấn khách', '+3.000.000đ', 'Trả lời khách theo đúng bảng giá, tài liệu của bạn, cả lúc nửa đêm. Phí API OpenAI hằng tháng do bạn trả theo mức dùng thực tế.'],
  ['yellow', 'Báo khách mới tự động', '+2.000.000đ', 'Khách điền form trên web là thông tin báo ngay về Zalo / Telegram / Google Sheet của bạn.'],
  ['blue', 'Thanh toán trực tuyến', '+2.500.000đ', 'Khách thanh toán bằng VietQR, MoMo hoặc VNPay ngay trên website.'],
  ['green', 'Báo cáo Excel / Google Sheet', '+1.000.000đ', 'Xuất đơn hàng, khách hàng ra Excel hoặc đồng bộ Google Sheet để bạn theo dõi.'],
];
const vnd = (n) => n.toLocaleString('vi-VN') + 'đ';

// ---------- Công cụ "Ước tính chi phí" (trang Báo giá, id="uoc-tinh") ----------
// Sửa giá / thời gian ở đây. price: null = chưa có giá cố định -> hiện "báo giá sau khi trao đổi".
// from: true = hiện chữ "Từ" trước giá.  service: mục chọn sẵn trong form đăng ký.
const EST_KINDS = [
  { v: 'website', label: 'Website giới thiệu', hint: 'Cửa hàng, công ty, cá nhân', price: 7000000, days: 'khoảng 14 ngày', service: 'website', group: 'web' },
  { v: 'shop', label: 'Website bán hàng', hint: 'Tự đăng sản phẩm, nhận đơn', price: 7000000, days: 'khoảng 14 ngày', service: 'website', group: 'web' },
  { v: 'design', label: 'Chỉ thiết kế giao diện', hint: 'Đã có người lập trình', price: 4500000, from: true, days: '', service: 'design', group: 'design' },
  { v: 'software', label: 'Phần mềm nhỏ', hint: 'Bán vé, đặt lịch, quản lý đơn…', price: null, days: '', service: 'software', group: 'software' },
];
const EST_BIZ = ['Shop, bán lẻ', 'Quán ăn, cafe', 'Spa, làm đẹp', 'Lớp học, giáo dục', 'Sự kiện, workshop', 'Công ty dịch vụ', 'Khác'];
// câu 3 đổi theo loại đã chọn ở câu 1
const EST_EXTRAS = {
  web: { q: 'Cần gắn thêm gì?', multi: true, items: ADDONS.map(([, t, p]) => [t, Number(p.replace(/\D/g, ''))]) },
  design: { q: 'Cần thiết kế khoảng bao nhiêu trang?', multi: false, items: [['1 – 5 trang'], ['6 – 10 trang'], ['Trên 10 trang']] },
  software: { q: 'Phần mềm cần làm được gì?', multi: true, items: [['Đặt vé / đặt lịch online'], ['Vé hoặc mã QR, check-in'], ['Quản lý đơn hàng, kho'], ['Phân quyền nhân viên'], ['Thống kê doanh thu, báo cáo']] },
};
const estChip = (name, value, label, type = 'radio', extra = '') =>
  `<label class="tc-chip"><input type="${type}" name="${name}" value="${esc(value)}"${extra}><span>${label}</span></label>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const estimator = () => `
  <section class="tcp-wrap tcp-est-wrap" id="uoc-tinh">
    <div class="tcp-est" data-est>
      <div class="tcp-est-head">
        <span class="tcp-sticker tcp-bg-blue">Ước tính chi phí</span>
        <h2 class="tcp-est-title">5 câu hỏi, 30 giây.<br>Biết ngay khoảng giá.</h2>
        <div class="tcp-est-bar" aria-hidden="true"><i></i></div>
        <p class="tcp-est-count" aria-live="polite">Câu <b>1</b>/5</p>
      </div>

      <div class="tcp-est-step" data-step="1">
        <h3>Bạn cần làm gì?</h3>
        <div class="tc-chips tcp-est-big">${EST_KINDS.map((k) => `<label class="tc-chip"><input type="radio" name="kind" value="${k.v}"><span><b>${k.label}</b><small>${k.hint}</small></span></label>`).join('')}</div>
      </div>
      <div class="tcp-est-step" data-step="2" hidden>
        <h3>Bạn kinh doanh gì?</h3>
        <div class="tc-chips">${EST_BIZ.map((b) => estChip('biz', b, b)).join('')}</div>
      </div>
      ${Object.entries(EST_EXTRAS).map(([g, x]) => `
      <div class="tcp-est-step" data-step="3" data-group="${g}" hidden>
        <h3>${x.q}</h3>
        ${x.multi ? '<p class="tcp-est-hint">Chọn bao nhiêu cũng được, hoặc bỏ qua.</p>' : ''}
        <div class="tc-chips">${x.items.map(([t, p]) => estChip('extra-' + g, t, p ? `${t} <em>+${(p / 1e6).toLocaleString('vi-VN')} tr</em>` : t, x.multi ? 'checkbox' : 'radio', p ? ` data-price="${p}"` : '')).join('')}</div>
      </div>`).join('')}
      <div class="tcp-est-step" data-step="4" hidden>
        <h3>Bạn có tên miền chưa?</h3>
        <p class="tcp-est-hint">Tên miền là địa chỉ web, ví dụ tenshop.vn.</p>
        <div class="tc-chips">${estChip('domain', 'Đã có tên miền', 'Có rồi')}${estChip('domain', 'Chưa có tên miền', 'Chưa có')}${estChip('domain', 'Chưa rõ tên miền là gì', 'Chưa rõ là gì')}</div>
      </div>
      <div class="tcp-est-step" data-step="5" hidden>
        <h3>Bạn cần gấp không?</h3>
        <div class="tc-chips">${estChip('when', 'Không gấp', 'Không gấp')}${estChip('when', 'Cần trong tháng này', 'Trong tháng này')}${estChip('when', 'Rất gấp', 'Rất gấp')}</div>
      </div>

      <div class="tcp-est-step tcp-est-result" data-step="done" hidden>
        <p class="tcp-est-label">Chi phí ước tính</p>
        <p class="tcp-est-price" data-est-price></p>
        <p class="tcp-est-days" data-est-days></p>
        <ul class="tcp-est-lines" data-est-lines></ul>
        <p class="tcp-est-note" data-est-note></p>
        <div class="tcp-actions">
          <a class="tcp-btn" href="/lien-he#dang-ky" data-tc-lead="tuvan" data-est-lead><span>Nhận báo giá chi tiết</span>${arrow}</a>
          <button type="button" class="tcp-btn" data-variant="ghost" data-est-reset><span>Làm lại</span></button>
        </div>
        <p class="tcp-est-small">Con số chỉ để tham khảo. Giá chính thức được chốt sau khi trao đổi.</p>
      </div>

      <div class="tcp-est-nav">
        <button type="button" class="tcp-est-back" data-est-back hidden>← Quay lại</button>
        <button type="button" class="tcp-btn" data-est-next hidden><span>Tiếp</span>${arrow}</button>
      </div>
      <script type="application/json" data-est-config>${JSON.stringify(EST_KINDS).replace(/</g, '\\u003c')}</script>
    </div>
  </section>`;
const baoGiaContent = baoGiaHead + estimator();
const EXAMPLES = [
  ['yellow', 'Shop mỹ phẩm online', [['Website trọn gói (10 trang)', 7000000], ['Thanh toán trực tuyến', 2500000], ['Báo khách mới tự động', 2000000]]],
  ['pink', 'Spa & thẩm mỹ', [['Website trọn gói (8 trang)', 7000000], ['Chatbot AI tư vấn khách', 3000000]], 'Cộng phí API OpenAI hằng tháng theo mức dùng.'],
  ['blue', 'Công ty dịch vụ', [['Website trọn gói (6 trang)', 7000000], ['Báo cáo Google Sheet', 1000000]]],
];
const baoGiaAfter = `
  <section class="tcp-wrap">
    <div class="tcp-sec">
      ${secHead('Tính năng<br>gắn thêm', 'Website nào cũng gắn thêm được, lúc làm hoặc sau này. Giá cộng thẳng vào gói.')}
      <div class="tcp-grid-4">${ADDONS.map(([c, t, p, d], i) => `
        <article class="tcp-card tcp-card-sm tcp-bg-${c}" style="--tilt:${tilt(i)}">
          <span class="tcp-price">${p}</span>
          <h3 class="tcp-card-title">${t}</h3>
          <p>${d}</p>
        </article>`).join('')}</div>
    </div>
    <div class="tcp-sec" style="margin-bottom:20px">
      ${secHead('Ví dụ<br>chi phí thực tế', 'Cách tính cho vài trường hợp hay gặp, để bạn hình dung trước ngân sách.')}
      <div class="tcp-grid-3">${EXAMPLES.map(([c, t, rows, note], i) => `
        <article class="tcp-card tcp-card-sm tcp-example tcp-bg-${c}" style="--tilt:${tilt(i)}">
          <h3 class="tcp-card-title">${t}</h3>
          <table><tbody>${rows.map(([n, v]) => `<tr><td>${n}</td><td>${vnd(v)}</td></tr>`).join('')}
            <tr class="tcp-total"><td>Tổng</td><td>${vnd(rows.reduce((s, r) => s + r[1], 0))}</td></tr></tbody></table>
          ${note ? `<p>${note}</p>` : ''}
        </article>`).join('')}</div>
      <p class="tcp-note">Ví dụ chỉ để tham khảo, chưa gồm tên miền và hosting. Giá chính thức được chốt sau khi trao đổi.</p>
    </div>
  </section>`;

// ================= HỎI ĐÁP =================
const hoiDapContent = `
  <section class="tcp-wrap" style="padding-bottom:10px">
    ${header({
      sticker: 'Hỏi đáp',
      color: 'blue',
      title: 'Hỏi gì<br>đáp nấy',
      text: 'Những câu khách hay hỏi trước khi làm website, phần mềm. Không thấy câu của bạn thì hỏi trợ lý ở góc phải màn hình nhé.',
      actions: lead('Đăng ký tư vấn') + btn('Hỏi qua Zalo', ZALO, 'ghost'),
    })}
  </section>`;
const TERMS = [
  ['Tên miền', 'Domain', 'Địa chỉ website của bạn, ví dụ tenshop.vn. Gia hạn mỗi năm, nên đứng tên chính bạn.'],
  ['Hosting', 'Máy chủ', 'Nơi đặt website để mọi người truy cập được 24/7. Giống như thuê mặt bằng cho cửa hàng online.'],
  ['HTTPS / SSL', 'Ổ khóa bảo mật', 'Mã hóa dữ liệu giữa khách và website. Không có HTTPS, trình duyệt sẽ cảnh báo "không an toàn".'],
  ['SEO', 'Tối ưu tìm kiếm', 'Những việc giúp website hiện lên khi khách tìm trên Google, mà không cần trả tiền quảng cáo.'],
  ['Trang quản trị', 'Admin / CMS', 'Khu vực riêng để bạn tự đăng bài, sửa giá, thay ảnh mà không cần biết lập trình.'],
  ['Responsive', 'Tự co giãn', 'Giao diện tự sắp xếp lại cho vừa điện thoại, máy tính bảng và máy tính.'],
  ['Landing page', 'Trang đích', 'Một trang duy nhất tập trung vào một sản phẩm hoặc chương trình, thường dùng khi chạy quảng cáo.'],
  ['Mã nguồn', 'Source code', 'Toàn bộ "bản vẽ" của website. Có mã nguồn, bạn có thể nhờ bất kỳ ai phát triển tiếp.'],
  ['API', 'Cổng kết nối', 'Cách để website nói chuyện với dịch vụ khác, ví dụ gửi đơn về Zalo hay dùng ChatGPT.'],
];
const hoiDapAfter = `
  <section class="tcp-wrap">
    <div class="tcp-sec" style="margin-bottom:20px">
      ${secHead('Từ điển<br>cho người mới', 'Gặp những chữ này khi làm website? Đây là nghĩa của chúng, nói theo cách dễ hiểu nhất.')}
      <dl class="tcp-glossary">${TERMS.map(([t, s, d]) => `<div class="tcp-term"><dt>${t}<small>${s}</small></dt><dd>${d}</dd></div>`).join('')}</dl>
    </div>
  </section>`;

// ================= LIÊN HỆ =================
const contactContent = `
  <section class="tcp-wrap">
    ${header({
      sticker: 'Liên hệ',
      color: 'blue',
      title: 'Kể chúng mình nghe<br>bạn cần gì',
      text: 'Tư vấn miễn phí, báo giá rõ ràng trước khi làm. Chọn cách nào tiện cho bạn nhất.',
    })}
    <div class="tcp-grid-3">
      <a class="tcp-card tcp-contact tcp-bg-yellow" href="#dang-ky" data-tc-lead="tuvan">
        <span class="tcp-price">Đầy đủ nhất</span>
        <h2 class="tcp-card-title">Đăng ký tư vấn</h2>
        <p>Điền form bên dưới, chúng mình gọi lại cho bạn.</p>
      </a>
      <a class="tcp-card tcp-contact tcp-bg-green" href="${ZALO}" target="_blank" rel="noopener">
        <span class="tcp-price">Nhanh nhất</span>
        <h2 class="tcp-card-title">Nhắn Zalo</h2>
        <p>${PHONE}</p>
      </a>
      <a class="tcp-card tcp-contact tcp-bg-orange" href="tel:${PHONE}">
        <span class="tcp-price">Gọi điện</span>
        <h2 class="tcp-card-title">${PHONE}</h2>
        <p>Làm việc online với khách ở mọi tỉnh thành.</p>
      </a>
    </div>
    <div class="tcp-split" style="align-items:center">
      <div>
        <h2 class="tcp-h2">Để lại<br>thông tin</h2>
        <p class="tcp-lead">Chỉ cần tên và số điện thoại. Chưa rõ mình cần gì cũng không sao, cứ để chúng mình hỏi giúp bạn.</p>
        ${list(['Tư vấn miễn phí, không ràng buộc', 'Báo giá rõ ràng trước khi làm', 'Thông tin của bạn được giữ kín'])}
      </div>
      <div class="tc-lead-inline" id="dang-ky">${LEAD_FORM}</div>
    </div>
    <div class="tcp-sec" style="margin-top:100px">
      ${secHead('Sau khi bạn<br>liên hệ', 'Bạn chỉ quyết định làm khi đã thấy rõ giá và cách làm.')}
      ${steps([
        ['yellow', 'Trò chuyện', 'Chúng mình hỏi bạn đang bán gì, khách là ai và đang vướng ở đâu.'],
        ['orange', 'Đề xuất & báo giá', 'Gửi bạn hướng làm phù hợp và báo giá rõ ràng, miễn phí.'],
        ['blue', 'Bắt đầu làm', 'Bạn đồng ý thì chúng mình bắt đầu thiết kế, gửi bạn duyệt từng bước.'],
      ])}
    </div>
    <div class="tcp-split" style="margin-top:0">
      <div>
        <h2 class="tcp-h2">Chuẩn bị gì<br>trước khi nhắn?</h2>
        <p class="tcp-lead">Không bắt buộc, nhưng có sẵn những thứ này thì tư vấn nhanh hơn nhiều.</p>
      </div>
      <div class="tcp-card tcp-bg-dark">
        ${list(['Bạn đang kinh doanh gì, bán qua kênh nào', 'Website hoặc phần mềm bạn muốn làm giống (nếu có)', 'Logo, hình ảnh sản phẩm', 'Ngân sách dự kiến và thời gian mong muốn'])}
      </div>
    </div>
  </section>`;

// ================= CHÍNH SÁCH =================
const prose = (sticker, title, body) => `
  <section class="tcp-wrap">
    ${header({ sticker, color: 'yellow', title })}
    <div class="tcp-prose">${body}<p class="tcp-updated">Cập nhật lần cuối: 26/11/2026.</p></div>
  </section>`;

const privacyHtml = prose('Bảo mật', 'Chính sách<br>bảo mật', `
  <p>Chính sách này giải thích Tiệm Code ("chúng mình") thu thập những thông tin gì khi bạn dùng website, sử dụng chúng vào việc gì và bạn có những quyền gì đối với dữ liệu của mình, theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.</p>
  <h2>1. Thông tin chúng mình thu thập</h2>
  <ul><li>Thông tin bạn tự điền vào form đăng ký tư vấn hoặc khung chat: họ tên, số điện thoại / Zalo, email, nhu cầu của bạn.</li><li>Thông tin kỹ thuật khi bạn truy cập: loại trình duyệt, thiết bị, trang đã xem, nhằm thống kê và cải thiện website.</li><li>Cách bạn sử dụng trang (cuộn, bấm chuột) được ghi nhận ẩn danh bằng công cụ Microsoft Clarity để chúng mình biết phần nào khó hiểu, khó dùng. Chữ bạn gõ vào form được che đi, không bị ghi lại.</li></ul>
  <h2>2. Mục đích sử dụng</h2>
  <ul><li>Liên hệ tư vấn, gửi báo giá và thực hiện dịch vụ bạn yêu cầu.</li><li>Chăm sóc khách hàng và hỗ trợ trong thời gian bảo hành.</li><li>Cải thiện nội dung và trải nghiệm của website.</li></ul>
  <p>Chúng mình không bán hay cho thuê thông tin cá nhân của bạn.</p>
  <h2>3. Chia sẻ thông tin</h2>
  <p>Thông tin chỉ được chia sẻ với các dịch vụ giúp vận hành website (lưu trữ dữ liệu, gửi thông báo) ở mức cần thiết, hoặc khi cơ quan nhà nước có thẩm quyền yêu cầu theo quy định pháp luật.</p>
  <h2>4. Trợ lý chat</h2>
  <p>Nội dung bạn nhắn trong khung chat được dùng để trả lời câu hỏi của bạn. Bạn không nên gửi thông tin nhạy cảm như mật khẩu hay số tài khoản ngân hàng qua khung chat.</p>
  <h2>5. Lưu trữ và bảo vệ</h2>
  <p>Thông tin được lưu trong thời gian cần thiết để phục vụ bạn và được bảo vệ bằng các biện pháp kỹ thuật hợp lý. Không có hệ thống nào an toàn tuyệt đối, nhưng chúng mình luôn cố gắng hạn chế rủi ro.</p>
  <h2>6. Quyền của bạn</h2>
  <p>Bạn có quyền yêu cầu xem, sửa hoặc xoá thông tin cá nhân của mình, hoặc rút lại sự đồng ý. Chỉ cần nhắn Zalo <a href="${ZALO}" target="_blank" rel="noopener">${PHONE}</a>, chúng mình sẽ xử lý sớm nhất.</p>
  <h2>7. Thay đổi chính sách</h2>
  <p>Chính sách có thể được cập nhật khi cần. Phiên bản mới nhất luôn được đăng tại trang này.</p>`);

const termsHtml = prose('Điều khoản', 'Điều khoản<br>sử dụng', `
  <p>Khi truy cập website của Tiệm Code, bạn đồng ý với các điều khoản dưới đây.</p>
  <h2>1. Nội dung website</h2>
  <p>Website giới thiệu dịch vụ làm website, thiết kế giao diện, phần mềm theo nhu cầu và phần mềm Zalo marketing của Tiệm Code. Thông tin mang tính tham khảo và có thể được cập nhật mà không cần báo trước.</p>
  <h2>2. Báo giá</h2>
  <p>Giá trên trang Báo giá là giá tham khảo. Giá chính thức được thống nhất sau khi trao đổi chi tiết nhu cầu. Gửi form hoặc nhắn tin không tự động tạo thành hợp đồng giữa bạn và Tiệm Code.</p>
  <ul><li>Giá chưa bao gồm tên miền và hosting.</li><li>Với tính năng Chatbot AI, phí sử dụng API OpenAI hằng tháng do khách hàng chi trả.</li></ul>
  <h2>3. Bảo hành</h2>
  <p>Website do Tiệm Code làm được bảo hành trọn đời: nếu website gặp sự cố hoặc ngừng hoạt động, chúng mình sửa miễn phí. Bảo hành không áp dụng khi tên miền hoặc hosting hết hạn, hoặc khi mã nguồn bị bên khác chỉnh sửa.</p>
  <h2>4. Phần mềm Zalo Marketing</h2>
  <p>Người dùng tự chịu trách nhiệm sử dụng phần mềm đúng chính sách của Zalo và quy định pháp luật về quảng cáo, tin nhắn và dữ liệu cá nhân. Tiệm Code không chịu trách nhiệm khi tài khoản bị Zalo hạn chế do cách sử dụng của người dùng.</p>
  <h2>5. Sử dụng website</h2>
  <p>Bạn không được dùng website vào mục đích vi phạm pháp luật, phát tán mã độc, hay truy cập trái phép vào hệ thống.</p>
  <h2>6. Bản quyền</h2>
  <p>Nội dung và mã nguồn trên website thuộc về Tiệm Code hoặc được sử dụng có phép. Vui lòng không sao chép khi chưa được đồng ý.</p>
  <h2>7. Liên hệ</h2>
  <p>Mọi thắc mắc về điều khoản, bạn nhắn Zalo <a href="${ZALO}" target="_blank" rel="noopener">${PHONE}</a>.</p>`);

// ---------- Định nghĩa trang ----------
// Khối có sẵn trong thiết kế (mỗi khối chỉ dùng ở 1 trang):
//   hero, expert, ideas, methods  -> Trang chủ
//   why -> Về chúng mình · proof -> Giải pháp · pricing -> Báo giá · faq -> Hỏi đáp
//   (phần "Liên hệ ngay" + footer luôn có ở mọi trang)
const pages = [
  {
    slug: 'home',
    title: 'Tiệm Code - Làm website trọn gói & phần mềm cho doanh nghiệp',
    description: 'Tiệm Code là nhóm sinh viên IT làm website chuẩn SEO tự đăng bài, thiết kế giao diện, phần mềm quản lý làm riêng và phần mềm Zalo Marketing. Website đến 10 trang 7 triệu, bảo hành trọn đời.',
    show: ['hero', 'expert', 'ideas', 'methods'],
  },
  {
    slug: 'about',
    title: 'Về chúng mình | Tiệm Code',
    description: 'Tiệm Code là nhóm sinh viên IT cùng nhau làm website và phần mềm cho shop, doanh nghiệp nhỏ trên toàn quốc.',
    show: ['why'],
    content: aboutContent,
    after: aboutAfter,
  },
  {
    slug: 'dich-vu',
    title: 'Dịch vụ | Tiệm Code',
    description: 'Website chuẩn SEO tự đăng bài, thiết kế giao diện, phần mềm quản lý làm riêng thay thế Excel và phần mềm Zalo Marketing.',
    show: [],
    content: dichVuContent,
  },
  {
    slug: 'phan-mem-zalo',
    title: 'Phần mềm Zalo Marketing | Tiệm Code',
    description: 'Quản lý nhiều tài khoản Zalo trên một màn hình, trả lời tự động, hẹn giờ gửi tin, đăng bài nhóm và lọc khách hàng trong nhóm.',
    show: [],
    content: zaloContent,
  },
  {
    slug: 'bao-gia',
    title: 'Báo giá | Tiệm Code',
    description: 'Website đến 10 trang 7 triệu, thiết kế giao diện từ 4,5 triệu, tính năng gắn thêm từ 1 triệu. Phần mềm theo nhu cầu và phần mềm Zalo Marketing báo giá miễn phí.',
    show: ['pricing'],
    content: baoGiaContent,
    after: baoGiaAfter,
  },
  {
    slug: 'hoi-dap',
    title: 'Hỏi đáp | Tiệm Code',
    description: 'Giải đáp về chi phí, thời gian làm, bảo hành, tên miền, hosting và giải thích thuật ngữ website dễ hiểu cho người mới.',
    show: ['faq'],
    content: hoiDapContent,
    after: hoiDapAfter,
  },
  {
    slug: 'lien-he',
    title: 'Liên hệ | Tiệm Code',
    description: 'Đăng ký tư vấn miễn phí hoặc nhắn Zalo 0565567789 để được tư vấn về website và phần mềm.',
    show: [],
    content: contactContent,
  },
  {
    slug: 'bao-mat',
    title: 'Chính sách bảo mật | Tiệm Code',
    description: 'Cách Tiệm Code thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.',
    show: [],
    content: privacyHtml,
  },
  {
    slug: 'dieu-khoan',
    title: 'Điều khoản sử dụng | Tiệm Code',
    description: 'Điều khoản sử dụng website và dịch vụ của Tiệm Code.',
    show: [],
    content: termsHtml,
  },
];

export { pages, LEAD_FORM };
export const helpers = { header, btn, lead, list, secHead, tilt, arrow, industriesHtml, ZALO, PHONE };
