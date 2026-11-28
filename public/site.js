// Tiệm Code – script chạy trên mọi trang (thay cho JS của Framer + script cũ). Không cần thư viện.
// Gồm: hiệu ứng (chữ chạy, xoay, hiện dần, thẻ trượt ngang, chữ chân trang trồi lên), menu, hỏi đáp,
// form đăng ký, khung chat, công cụ ước tính chi phí, bộ lọc blog/dự án.
(function () {
  'use strict';
  var ZALO = 'https://zalo.me/0565567789';
  var PHONE = '0565567789';
  var main = document.getElementById('main');
  var PAGE = (main && main.getAttribute('data-page')) || 'home';
  var root = document.documentElement;
  root.classList.add('tc-js');
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function visible(el) { return !!(el && el.getClientRects().length); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- 1. chuyển động lặp: chỉ chạy khi đang thấy trên màn hình ----------
  var loops = $$('[data-tc-loop]');
  if ('IntersectionObserver' in window) {
    var loopIO = new IntersectionObserver(function (list) {
      list.forEach(function (en) { en.target.classList.toggle('tc-off', !en.isIntersecting); });
    }, { rootMargin: '100px' });
    loops.forEach(function (el) { el.classList.add('tc-off'); loopIO.observe(el); });
  }

  // 1b. dải chữ chạy: đo đúng chiều dài 1 vòng chữ (từ mục đầu tới lần lặp lại kế tiếp) để chạy liền mạch
  var LOOP_SPEED = 35; // px mỗi giây, bằng tốc độ bản gốc
  function offsetIn(el, anc) { var x = 0; while (el && el !== anc) { x += el.offsetLeft; el = el.offsetParent; } return x; }
  function fitLoops() {
    $$('[data-tc-loop="green"], [data-tc-loop="blue"]').forEach(function (track) {
      var items = $$('[data-framer-component-type="RichTextContainer"]', track);
      if (items.length < 2) return;
      var first = items[0].textContent.trim();
      var x0 = null, period = 0;
      for (var i = 0; i < items.length; i++) {
        if (items[i].textContent.trim() !== first) continue;
        var x = offsetIn(items[i], track);
        if (x0 === null) x0 = x; else { period = x - x0; break; }
      }
      if (period <= 0) return;
      track.style.setProperty('--tc-dist', period + 'px');
      track.style.animationDuration = (period / LOOP_SPEED).toFixed(1) + 's';
    });
  }
  fitLoops();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLoops);

  // ---------- 2. hiện dần khi cuộn tới ----------
  var wipeJob = null; // kiểm tra nhãn dán đã vào màn hình chưa, chạy cùng các hiệu ứng cuộn ở mục 3
  // mọi nhãn dán (nhãn trên tiêu đề các trang, nhãn trong các khối của trang chủ) trải ra như miếng dán
  $$('.tcp-sticker, [data-framer-name="FAQ Sticker"], [data-framer-name="Why Branding Sticker"]').forEach(function (el) {
    if (!el.hasAttribute('data-tc-reveal')) el.setAttribute('data-tc-reveal', 'wipe');
  });
  var reveals = $$('[data-tc-reveal]');
  if (reduce || !('IntersectionObserver' in window)) reveals.forEach(function (el) { el.classList.add('tc-in'); });
  else {
    // nhãn dán: chạy khi nhãn vào màn hình (nhãn ở đầu trang thì chạy ngay khi vừa vào web).
    // Không dùng IntersectionObserver vì lúc chưa dán, nhãn bị cắt (clip-path) về 0 nên luôn bị coi là "không thấy".
    // Đoạn kiểm tra chạy ở mục 3 (scrollJobs), sau khi khai báo.
    var pendingWipes = reveals.filter(function (el) { return el.getAttribute('data-tc-reveal') === 'wipe'; });
    wipeJob = function () {
      if (!pendingWipes.length) return;
      var h = window.innerHeight;
      pendingWipes = pendingWipes.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (!r.width && !r.height) return true; // đang ẩn (vd. menu điện thoại), để sau
        if (r.top < h * 0.92 && r.bottom > 0) { el.classList.add('tc-in'); return false; }
        return true;
      });
    };
    // bong bóng: khi khung bong bóng hiện 30%
    var popIO = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$('[data-tc-reveal="pop"]', en.target).forEach(function (b) { b.classList.add('tc-in'); });
        popIO.unobserve(en.target);
      });
    }, { threshold: 0.3 });
    $$('[data-framer-name="Help Bubbles"]').forEach(function (box) { popIO.observe(box); });
  }

  // ---------- 3. các hiệu ứng theo vị trí cuộn (gộp chung 1 lần mỗi khung hình) ----------
  var scrollJobs = [];
  var ticking = false;
  function runScroll() { ticking = false; for (var i = 0; i < scrollJobs.length; i++) scrollJobs[i](); }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (wipeJob) scrollJobs.push(wipeJob);
  var resizeJobs = [];
  var rT = null;
  window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { resizeJobs.forEach(function (f) { f(); }); onScroll(); }, 150); });
  resizeJobs.push(fitLoops);

  // 3a. menu máy tính: cuộn xuống thì ẩn các mục (chỉ còn logo + nút); cuộn lên hoặc về đầu trang
  //     thì các mục lần lượt trượt vào từ bên phải (mục ngoài cùng bên phải vào trước)
  var deskNav = $('nav[data-tc-nav="desktop"]');
  if (deskNav) {
    var navItems = $$('[data-framer-name="Links"] > *', deskNav);
    navItems.forEach(function (el, i) { el.style.setProperty('--tc-i', String(navItems.length - 1 - i)); });
    var collapsed = false;
    var lastY = window.scrollY;
    scrollJobs.push(function () {
      var y = window.scrollY;
      var dy = y - lastY;
      if (y > 10 && Math.abs(dy) < 6) return; // bỏ qua rung nhẹ của bàn di chuột
      lastY = y;
      var c = y > 10 && dy > 0;
      if (c === collapsed) return;
      collapsed = c;
      deskNav.classList.toggle('tc-collapsed', c);
    });
  }

  // 3b. 5 thẻ "phương pháp": ghim lại và trượt ngang khi cuộn (máy tính, rộng từ 1000px)
  $$('[data-tc-cards]').forEach(function (area) {
    var pin = $('[data-framer-name="Cards Pin"]', area);
    var track = $('[data-framer-name="Cards Track"]', area);
    if (!pin || !track) return;
    var st = null;
    function setup() {
      area.style.cssText = area.style.cssText.replace(/(?:^|;)\s*(height|width|max-width|overflow)\s*:[^;]*/g, '');
      pin.style.position = ''; pin.style.top = '';
      track.style.transform = '';
      st = null;
      if (!visible(area) || window.innerWidth < 1000) return;
      var cards = track.children;
      var last = cards[cards.length - 1];
      if (!last) return;
      var tr = track.getBoundingClientRect();
      var lr = last.getBoundingClientRect();
      var max = Math.max(0, lr.left - tr.left + lr.width / 2 - window.innerWidth / 2);
      var pinH = pin.offsetHeight;
      area.style.overflow = 'clip visible';
      area.style.width = '100vw';
      area.style.maxWidth = 'none';
      area.style.height = (max + pinH) + 'px';
      var top = Math.round((window.innerHeight - pinH) / 2 + 40);
      pin.style.position = 'sticky';
      pin.style.top = top + 'px';
      track.style.willChange = 'transform';
      st = { max: max, top: top, last: -1 };
    }
    scrollJobs.push(function () {
      if (!st) return;
      var r = area.getBoundingClientRect();
      var x = Math.min(st.max, Math.max(0, st.top - r.top));
      if (Math.abs(x - st.last) < 0.5) return;
      st.last = x;
      track.style.transform = 'translate3d(' + (-x).toFixed(1) + 'px, 0px, 0px)';
    });
    resizeJobs.push(setup);
    setup();
  });

  // 3c. chữ "Liên hệ ngay" ở chân trang trồi lên khi gần cuối trang
  $$('[data-tc-rise]').forEach(function (el) {
    var H = el.offsetHeight, D = root.scrollHeight, cur = -1, target = 0, raf = 0;
    if ('ResizeObserver' in window) new ResizeObserver(function () { H = el.offsetHeight; D = root.scrollHeight; onScroll(); }).observe(document.body);
    function step() {
      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.3) cur = target;
      el.style.transform = 'translate3d(0px, ' + cur.toFixed(1) + 'px, 0px)';
      raf = cur === target ? 0 : requestAnimationFrame(step);
    }
    scrollJobs.push(function () {
      var left = D - (window.scrollY + window.innerHeight);
      target = Math.min(1, Math.max(0, left / 600)) * H;
      if (reduce) { cur = target; el.style.transform = 'translate3d(0px, ' + target + 'px, 0px)'; return; }
      if (cur < 0) cur = target;
      if (!raf) raf = requestAnimationFrame(step);
    });
  });

  // 3d. bảng giá (trang Báo giá): ghim lại, các bảng trượt ngang khi cuộn
  $$('[data-tc-pricing]').forEach(function (wrap) {
    var st = null;
    function cardsOf() { return $$(':scope > [data-framer-name="Pricing Card"]', wrap); }
    function layout() {
      var inner = wrap.parentElement, section = inner && inner.parentElement;
      if (!section) return;
      var cards = cardsOf();
      var spacer = $(':scope > .tc-scroll-spacer', section);
      st = null;
      cards.forEach(function (c) { c.style.translate = ''; });
      if (!visible(wrap) || getComputedStyle(wrap).flexDirection !== 'row' || window.innerWidth < 810) {
        cards.forEach(function (c) { c.style.flexShrink = ''; c.style.width = ''; });
        if (spacer) spacer.remove();
        inner.style.position = ''; inner.style.top = '';
        ['flex', 'width', 'min-width', 'max-width', 'flex-wrap', 'overflow'].forEach(function (p) { wrap.style.removeProperty(p); });
        return;
      }
      if (!wrap.dataset.tcCardW) {
        var z0 = parseFloat(getComputedStyle(cards[0]).zoom) || 1;
        wrap.dataset.tcCardW = Math.round(cards[0].getBoundingClientRect().width / z0);
      }
      var avail = Math.round(inner.getBoundingClientRect().right - wrap.getBoundingClientRect().left);
      wrap.style.flex = '0 0 ' + avail + 'px';
      wrap.style.width = avail + 'px';
      wrap.style.minWidth = '0';
      wrap.style.maxWidth = avail + 'px';
      var zoom = parseFloat(getComputedStyle(cards[0]).zoom) || 1;
      var cardW = Number(wrap.dataset.tcCardW) || 443;
      cards.forEach(function (c) { c.style.flexShrink = '0'; c.style.width = cardW + 'px'; });
      wrap.style.flexWrap = 'nowrap';
      wrap.style.overflow = 'hidden';
      var distance = Math.max(0, Math.round(cards[cards.length - 1].getBoundingClientRect().right - wrap.getBoundingClientRect().right));
      if (!spacer) { spacer = document.createElement('div'); spacer.className = 'tc-scroll-spacer'; spacer.setAttribute('aria-hidden', 'true'); section.appendChild(spacer); }
      spacer.style.height = distance + 'px';
      spacer.style.flexShrink = '0';
      var h = inner.getBoundingClientRect().height;
      var top = Math.min(96, window.innerHeight - h - 24);
      inner.style.position = 'relative';
      inner.style.top = '0px';
      var offset = inner.getBoundingClientRect().top - section.getBoundingClientRect().top;
      var padBottom = parseFloat(getComputedStyle(section).paddingBottom) || 0;
      inner.style.position = 'sticky';
      inner.style.top = top + 'px';
      inner.style.zIndex = '1';
      st = { section: section, cards: cards, distance: distance, offset: offset, padBottom: padBottom, h: h, top: top, zoom: zoom, lastX: null };
    }
    scrollJobs.push(function () {
      if (!st || !st.distance) return;
      var r = st.section.getBoundingClientRect();
      var secTop = r.top + window.scrollY;
      var pinStart = secTop + st.offset - st.top;
      var pinEnd = secTop + r.height - st.padBottom - st.h - st.top;
      var p = Math.min(1, Math.max(0, (window.scrollY - pinStart) / Math.max(1, pinEnd - pinStart)));
      var x = (-p * st.distance / st.zoom).toFixed(1);
      if (x === st.lastX) return;
      st.lastX = x;
      for (var i = 0; i < st.cards.length; i++) st.cards[i].style.translate = x + 'px 0';
    });
    resizeJobs.push(layout);
    if (document.readyState === 'complete') layout(); else window.addEventListener('load', function () { layout(); onScroll(); });
    layout();
  });

  // ---------- 4. menu điện thoại ----------
  var mobileOpenTpl = $('#tc-menu-open');
  var navBox = $('.framer-19o4lkr-container');
  function mobileNavWrap() { var n = $('nav[data-tc-nav="mobile"]', navBox); return n ? n.parentElement : null; }
  var savedMobile = null;
  function openMenu() {
    var w = mobileNavWrap();
    if (!w || !mobileOpenTpl) return;
    savedMobile = w.innerHTML;
    var t = document.createElement('div');
    t.innerHTML = mobileOpenTpl.innerHTML;
    var openNav = $('nav', t);
    if (!openNav) return;
    openNav.setAttribute('data-tc-nav', 'mobile-open');
    w.innerHTML = '';
    w.appendChild(openNav);
    root.classList.add('tc-menu-open');
  }
  function closeMenu() {
    var w = $('nav[data-tc-nav="mobile-open"]');
    if (!w || savedMobile == null) return;
    w.parentElement.innerHTML = savedMobile;
    savedMobile = null;
    root.classList.remove('tc-menu-open');
  }

  // ---------- 5. hỏi đáp: bấm để mở / đóng ----------
  function toggleFaq(item) {
    var ans = $(':scope > [data-tc-answer]', item);
    var open = !item.classList.contains('tc-open');
    item.classList.toggle('tc-open', open);
    item.setAttribute('data-framer-name', open ? 'Open' : 'Closed');
    item.classList.toggle('framer-v-1yyrqfu', open);
    item.classList.toggle('framer-v-162yv8n', !open);
    item.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!ans) return;
    if (open) {
      ans.hidden = false;
      var h = ans.scrollHeight;
      ans.style.height = '0px'; ans.style.opacity = '0';
      requestAnimationFrame(function () { ans.style.height = h + 'px'; ans.style.opacity = '1'; });
      setTimeout(function () { ans.style.height = ''; }, 420);
    } else {
      ans.style.height = ans.scrollHeight + 'px';
      requestAnimationFrame(function () { ans.style.height = '0px'; ans.style.opacity = '0'; });
      setTimeout(function () { if (!item.classList.contains('tc-open')) { ans.hidden = true; ans.style.height = ''; } }, 400);
    }
  }
  $$('[data-tc-faq]').forEach(function (it) { it.setAttribute('role', 'button'); it.setAttribute('aria-expanded', 'false'); });

  // ---------- 6. giờ Việt Nam ở chân trang ----------
  var clockEls = $$('[data-framer-name="Footer"] span.framer-text').filter(function (s) { return /^VN \d{1,2}:\d{2}$/.test(s.textContent.trim()); });
  function tick() {
    var t;
    try { t = 'VN ' + new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()); } catch (e) { t = 'Việt Nam'; }
    clockEls.forEach(function (s) { if (s.textContent !== t) s.textContent = t; });
  }
  if (clockEls.length) { tick(); setInterval(tick, 30000); }

  // ---------- 7. form đăng ký tư vấn (popup + form trên trang Liên hệ) ----------
  var modal = null, lastFocus = null;
  function buildModal() {
    var tpl = $('#tc-lead-tpl');
    if (!tpl) return null;
    var wrap = document.createElement('div');
    wrap.className = 'tc-lead';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'tc-lead-title');
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="tc-lead-backdrop" data-close></div>' +
      '<div class="tc-lead-box">' +
      '<button type="button" class="tc-lead-close" data-close aria-label="Đóng">×</button>' +
      '<span class="tcp-sticker tcp-bg-green">Miễn phí · Không ràng buộc</span>' +
      '<h2 id="tc-lead-title" class="tc-lead-title">Đăng ký tư vấn</h2>' +
      '<p class="tc-lead-sub">Để lại tên và số điện thoại, chúng mình sẽ gọi lại tư vấn và gửi báo giá cho bạn.</p>' +
      tpl.innerHTML +
      '</div>';
    document.body.appendChild(wrap);
    return wrap;
  }
  function resetForm(form) {
    if (!form) return;
    var box = form.closest('.tc-lead-box, .tc-lead-inline');
    form.hidden = false;
    var done = box && $('.tc-lead-done', box);
    if (done) done.hidden = true;
    var msg = $('.tcp-form-msg', form);
    if (msg) { msg.hidden = true; msg.textContent = ''; }
  }
  function openModal(service, note) {
    modal = modal || buildModal();
    if (!modal) { window.location.href = '/lien-he#dang-ky'; return; }
    var form = $('form', modal);
    resetForm(form);
    var radio = $('input[name="service"][value="' + (service || 'tuvan') + '"]', form);
    if (radio) radio.checked = true;
    var ta = $('textarea[name="note"]', form);
    if (ta && note) ta.value = note;
    lastFocus = document.activeElement;
    modal.hidden = false;
    root.classList.add('tc-lead-open');
    // nhãn "Miễn phí" trong popup: dán lại mỗi lần mở popup
    var sticker = $('.tcp-sticker', modal);
    if (sticker && !reduce) {
      sticker.setAttribute('data-tc-reveal', 'wipe');
      sticker.style.setProperty('--tc-delay', '0.15s');
      sticker.classList.remove('tc-in');
      void sticker.offsetWidth;
    }
    requestAnimationFrame(function () {
      if (sticker) sticker.classList.add('tc-in');
      modal.classList.add('is-open');
      var f = $('input[name="name"]', form);
      if (f && window.matchMedia('(min-width: 811px)').matches) f.focus({ preventScroll: true });
    });
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    root.classList.remove('tc-lead-open');
    setTimeout(function () { modal.hidden = true; }, 200);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeMenu(); document.body.classList.remove('tc-chat-open'); }
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.matches && e.target.matches('[data-tc-faq]')) { e.preventDefault(); toggleFaq(e.target); }
  });

  var SERVICE_LABEL = { website: 'Website trọn gói', design: 'Thiết kế giao diện', software: 'Phần mềm theo nhu cầu', zalo: 'Phần mềm Zalo Marketing', tuvan: 'Chưa rõ, cần tư vấn' };
  window.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches || !form.matches('form[data-tcp-lead]')) return;
    e.preventDefault();
    var btn = $('button[type="submit"]', form);
    var btnText = $('span', btn) || btn;
    var msg = $('.tcp-form-msg', form);
    var d = new FormData(form);
    var service = String(d.get('service') || 'tuvan');
    var data = {
      name: d.get('name'), contact: d.get('phone'), email: d.get('email'),
      service_type: SERVICE_LABEL[service] || service, notes: d.get('note'),
      website: d.get('website'), source: PAGE,
    };
    var label = btnText.textContent;
    btn.disabled = true;
    btnText.textContent = 'Đang gửi…';
    msg.hidden = true;
    fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.j.error || 'Chưa gửi được, bạn thử lại nhé.');
        form.reset();
        form.hidden = true;
        var box = form.closest('.tc-lead-box, .tc-lead-inline');
        var done = box && $('.tc-lead-done', box);
        if (done) done.hidden = false;
      })
      .catch(function (err) {
        msg.hidden = false;
        var m = err && err.message && !/fetch|network|load failed/i.test(err.message) ? err.message : 'Chưa gửi được, bạn kiểm tra mạng rồi thử lại nhé.';
        msg.innerHTML = m + ' Hoặc <a href="' + ZALO + '" target="_blank" rel="noopener">nhắn Zalo ' + PHONE + '</a>.';
      })
      .then(function () { btn.disabled = false; btnText.textContent = label; });
  }, true);

  // ---------- 8. khung chat "Hỏi Tiệm Code" ----------
  var chatPanel = $('.tc-chat-panel');
  var launcher = $('.tc-chat-launcher');
  function setChat(open) {
    document.body.classList.toggle('tc-chat-open', open);
    if (launcher) launcher.setAttribute('aria-label', open ? 'Đóng khung chat' : 'Mở khung chat hỏi Tiệm Code');
    if (open && chatPanel) { var input = $('input', chatPanel); if (input && window.matchMedia('(min-width: 811px)').matches) setTimeout(function () { input.focus(); }, 250); }
  }
  var chatLog = chatPanel ? $('[aria-live]', chatPanel) : null;
  var chatBusy = false;
  function chatEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function chatFormat(text) {
    // văn bản trả lời -> đoạn + danh sách gạch đầu dòng, link /trang và số Zalo bấm được
    var lines = String(text).replace(/\r/g, '').split('\n');
    var html = [], list = [];
    function flush() { if (list.length) { html.push('<ul style="margin:0;padding-left:20px">' + list.join('') + '</ul>'); list = []; } }
    lines.forEach(function (l) {
      var t = l.trim();
      if (!t) { flush(); return; }
      var link = function (s) {
        return chatEsc(s)
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/(^|\s)(\/[a-z0-9-]+(?:\/[a-z0-9-]+)*)/g, '$1<a href="$2">$2</a>')
          .replace(/(0\d{9})/g, '<a href="' + ZALO + '" target="_blank" rel="noopener">$1</a>');
      };
      if (/^[-•*]\s+/.test(t)) list.push('<li>' + link(t.replace(/^[-•*]\s+/, '')) + '</li>');
      else { flush(); html.push('<p style="margin:0">' + link(t) + '</p>'); }
    });
    flush();
    return html.join('');
  }
  function addMsg(who, html) {
    if (!chatLog) return null;
    var d = document.createElement('div');
    if (who === 'me') {
      d.setAttribute('style', 'align-self:flex-end;max-width:85%;background:rgb(58,54,55);border-radius:16px 16px 4px;padding:10px 16px;white-space:pre-wrap');
      d.textContent = html;
    } else {
      d.setAttribute('style', 'align-self:flex-start;max-width:92%;display:flex;flex-direction:column;gap:10px');
      d.innerHTML = '<div style="align-self:flex-start;background:rgb(51,47,48);border-radius:16px 16px 16px 4px;padding:12px 16px;display:flex;flex-direction:column;gap:10px;color:rgb(250,250,250)">' + html + '</div>';
    }
    chatLog.appendChild(d);
    chatLog.scrollTop = chatLog.scrollHeight;
    return d;
  }
  function ask(q) {
    q = String(q || '').trim();
    if (!q || chatBusy) return;
    chatBusy = true;
    addMsg('me', q);
    var wait = addMsg('bot', '<span class="tc-chat-typing" aria-label="Đang trả lời"><span></span><span></span><span></span></span>');
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: q }) })
      .then(function (r) { return r.json(); })
      .then(function (j) { return j.reply || 'Bạn nhắn Zalo ' + PHONE + ' để được tư vấn nhé!'; })
      .catch(function () { return 'Có lỗi kết nối, bạn thử lại hoặc nhắn Zalo ' + PHONE + ' nhé!'; })
      .then(function (text) {
        if (wait) wait.remove();
        addMsg('bot', chatFormat(text));
        chatBusy = false;
      });
  }
  if (chatPanel) {
    var chatForm = $('form', chatPanel);
    var chatInput = chatForm && $('input', chatForm);
    // bỏ nút nhập bằng giọng nói (không dùng), Enter để gửi
    $$('button[aria-label="Hỏi bằng giọng nói"]', chatPanel).forEach(function (b) { b.remove(); });
    if (chatForm) chatForm.addEventListener('submit', function (e) { e.preventDefault(); var v = chatInput.value; chatInput.value = ''; ask(v); });
  }

  // ---------- 9. bấm chuột: gom một chỗ ----------
  window.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var t = e.target;
    if (!t || !t.closest) return;
    // menu điện thoại
    if (t.closest('nav[data-tc-nav="mobile"] [data-framer-name="Menu Button"]')) { e.preventDefault(); openMenu(); return; }
    if (t.closest('nav[data-tc-nav="mobile-open"] [data-framer-name="Close Menu"]')) { e.preventDefault(); closeMenu(); return; }
    if (t.closest('nav[data-tc-nav="mobile-open"] a')) closeMenu();
    // khung chat
    if (t.closest('.tc-chat-launcher')) { setChat(!document.body.classList.contains('tc-chat-open')); return; }
    var askLink = t.closest('a[href$="#ask-jamie"]');
    if (askLink) { e.preventDefault(); setChat(true); return; }
    if (chatPanel && chatPanel.contains(t)) {
      var sug = t.closest('button[type="button"]');
      if (sug && !sug.hasAttribute('aria-label') && !sug.hasAttribute('aria-pressed')) { e.preventDefault(); ask(sug.textContent); }
      return;
    }
    // hỏi đáp
    var faq = t.closest('[data-tc-faq]');
    if (faq && !t.closest('a')) { e.preventDefault(); toggleFaq(faq); return; }
    // form đăng ký
    if (t.closest('.tc-lead [data-close]')) { e.preventDefault(); closeModal(); return; }
    var again = t.closest('[data-tc-again]');
    if (again) { e.preventDefault(); resetForm($('form', again.closest('.tc-lead-box, .tc-lead-inline'))); return; }
    var lead = t.closest('[data-tc-lead]');
    if (lead) {
      e.preventDefault();
      var inline = $('#dang-ky');
      if (inline) {
        var r = $('input[name="service"][value="' + lead.getAttribute('data-tc-lead') + '"]', inline);
        if (r) r.checked = true;
        var nt = $('textarea[name="note"]', inline);
        if (nt && lead.getAttribute('data-tc-note')) nt.value = lead.getAttribute('data-tc-note');
        inline.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      openModal(lead.getAttribute('data-tc-lead'), lead.getAttribute('data-tc-note'));
      return;
    }
    // bộ lọc blog / dự án
    var cat = t.closest('.tcp-cats button');
    if (cat) {
      var w = cat.closest('.tcp-cats');
      $$('button', w).forEach(function (x) { x.setAttribute('aria-pressed', x === cat ? 'true' : 'false'); });
      var c = cat.getAttribute('data-cat');
      if (cat.hasAttribute('data-k')) {
        var k = cat.getAttribute('data-k'), v = cat.getAttribute('data-v');
        $$('.tcp-posts .tcp-project-card').forEach(function (p) { p.hidden = !!v && p.getAttribute('data-' + k) !== v; });
      } else {
        $$('.tcp-posts .tcp-post-card').forEach(function (p) { p.hidden = !!c && p.getAttribute('data-cat') !== c; });
      }
      return;
    }
    // link #uoc-tinh trong trang: cuộn mượt
    var hash = t.closest('a[href^="#"]');
    if (hash && hash.getAttribute('href').length > 1) {
      var target = document.getElementById(hash.getAttribute('href').slice(1));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  }, true);

  // ---------- 10. công cụ ước tính chi phí (trang Báo giá) ----------
  (function estimator() {
    var box = $('[data-est]');
    if (!box) return;
    var kinds = [];
    try { kinds = JSON.parse($('[data-est-config]', box).textContent); } catch (err) { return; }
    var TOTAL = 5, step = 1;
    var tr = function (n) { return (n / 1e6).toLocaleString('vi-VN') + ' triệu'; };
    var val = function (name) { var i = $('input[name="' + name + '"]:checked', box); return i ? i.value : ''; };
    var kind = function () { var v = val('kind'); for (var i = 0; i < kinds.length; i++) if (kinds[i].v === v) return kinds[i]; return null; };
    var stepEl = function (n) {
      if (n !== 3) return $('.tcp-est-step[data-step="' + n + '"]', box);
      var k = kind();
      return $('.tcp-est-step[data-step="3"][data-group="' + (k ? k.group : 'web') + '"]', box);
    };
    function show(n) {
      step = n;
      $$('.tcp-est-step', box).forEach(function (s) { s.hidden = true; });
      var el = n === 'done' ? $('.tcp-est-result', box) : stepEl(n);
      if (el) el.hidden = false;
      var num = n === 'done' ? TOTAL : n;
      $('.tcp-est-bar i', box).style.width = (n === 'done' ? 100 : ((num - 1) / TOTAL) * 100) + '%';
      $('.tcp-est-count', box).innerHTML = n === 'done' ? 'Xong! Đây là kết quả' : 'Câu <b>' + num + '</b>/' + TOTAL;
      $('[data-est-back]', box).hidden = n === 1;
      // câu chọn nhiều thì cần nút "Tiếp"; câu chọn 1 thì tự sang câu sau
      var multi = el && $('input[type="checkbox"]', el);
      var next = $('[data-est-next]', box);
      next.hidden = !(n !== 'done' && multi);
      $('span', next).textContent = multi && !$('input:checked', el) ? 'Bỏ qua' : 'Tiếp';
      if (n === 'done') result();
    }
    function result() {
      var k = kind() || kinds[0];
      var lines = [], total = k.price || 0;
      if (k.price) lines.push([k.label, k.price]);
      var extras = [];
      $$('.tcp-est-step[data-group="' + k.group + '"] input:checked', box).forEach(function (i) {
        extras.push(i.value);
        var p = Number(i.getAttribute('data-price') || 0);
        if (p) { lines.push([i.value, p]); total += p; }
      });
      var price = $('[data-est-price]', box), days = $('[data-est-days]', box), note = $('[data-est-note]', box);
      if (k.price) price.textContent = (k.from ? 'Từ ' : 'Khoảng ') + tr(total);
      else price.textContent = 'Báo giá theo tính năng';
      var d = k.days ? 'Thời gian: ' + k.days : '';
      if (k.group === 'web' && lines.length > 2) d += ', thêm vài ngày cho các tính năng gắn thêm';
      days.textContent = d;
      days.hidden = !d;
      $('[data-est-lines]', box).innerHTML = lines.length > 1 ? lines.map(function (l) {
        return '<li><span>' + l[0] + '</span><b>' + l[1].toLocaleString('vi-VN') + 'đ</b></li>';
      }).join('') : '';
      var notes = [];
      if (!k.price) notes.push('Phần mềm nhỏ được làm riêng nên giá tùy vào số tính năng. Để lại số điện thoại, chúng mình hỏi thêm vài câu rồi báo giá miễn phí.');
      if (k.group === 'design') notes.push('Giá thiết kế tùy số trang và độ phức tạp.');
      if (k.group !== 'design') {
        var dm = val('domain');
        if (dm && dm !== 'Đã có tên miền') notes.push('Chưa gồm tên miền và hosting. Chúng mình hướng dẫn bạn mua tên miền đứng tên chính bạn.');
        else notes.push('Chưa gồm hosting.');
      }
      if (val('when') === 'Rất gấp') notes.push('Cần gấp: ghi ngày bạn cần có web khi gửi đăng ký, chúng mình báo ngay có kịp không.');
      note.textContent = notes.join(' ');
      // gửi kèm các câu trả lời vào form đăng ký
      var summary = ['Ước tính: ' + k.label, val('biz'), extras.join(', '), val('domain'), val('when'), price.textContent]
        .filter(Boolean).join(' · ');
      var a = $('[data-est-lead]', box);
      a.setAttribute('data-tc-lead', k.service);
      a.setAttribute('data-tc-note', summary);
    }
    function reset() {
      $$('input', box).forEach(function (i) { i.checked = false; });
      show(1);
    }
    window.addEventListener('change', function (e) {
      var i = e.target;
      if (!i || !i.closest || !box.contains(i)) return;
      if (i.type === 'radio') setTimeout(function () { show(step === TOTAL ? 'done' : step + 1); }, 220);
      else show(step); // cập nhật chữ "Bỏ qua" / "Tiếp"
    }, true);
    window.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      // link "#uoc-tinh" trong nội dung trang: cuộn mượt tới công cụ
      var hash = t.closest('.tcp-page a[href="#uoc-tinh"]');
      if (hash) { e.preventDefault(); e.stopImmediatePropagation(); box.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      if (!box.contains(t)) return;
      if (t.closest('[data-est-next]')) { e.preventDefault(); show(step === TOTAL ? 'done' : step + 1); }
      else if (t.closest('[data-est-back]')) { e.preventDefault(); show(step === 'done' ? TOTAL : Math.max(1, step - 1)); }
      else if (t.closest('[data-est-reset]')) { e.preventDefault(); reset(); }
    }, true);
    show(1);
  })();

  // ---------- chạy lần đầu ----------
  runScroll();
  window.addEventListener('load', function () { resizeJobs.forEach(function (f) { f(); }); runScroll(); });
})();
