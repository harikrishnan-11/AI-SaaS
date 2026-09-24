/* =====================================================================
   Stackly inner pages — shared behaviour (no dependencies)
   Features: mobile menu, scroll progress, reveal + counters, tabs,
   blog filter/search, form validation, password toggle + strength
   meter, 404 page search.
   ===================================================================== */
(() => {
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- header, menu, active link ---------- */
const page = document.body.dataset.page;
$$('nav [data-p]').forEach(a => {
  if (a.dataset.p === page) { a.classList.add('act'); a.setAttribute('aria-current', 'page'); }
});
const nav = $('#nav'), mb = $('#mb');
const menu = open => {
  nav.classList.toggle('open', open);
  mb.setAttribute('aria-expanded', open);
  mb.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
};
mb.addEventListener('click', () => menu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.closest('a')) menu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') menu(false); });
matchMedia('(min-width:861px)').addEventListener('change', () => menu(false));

/* ---------- scroll progress, sticky header, back-to-top ---------- */
const pg = $('#pg'), hd = $('header'), tp = $('#top');
const onScroll = () => {
  const y = scrollY, m = document.documentElement.scrollHeight - innerHeight;
  if (pg) pg.style.width = (m > 0 ? y / m * 100 : 0) + '%';
  hd.classList.toggle('sc', y > 40);
  if (tp) tp.classList.toggle('on', y > 600);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- scroll reveal + animated counters ---------- */
const count = el => {
  const target = +el.dataset.n, suffix = el.dataset.s || '';
  if (reduce) { el.textContent = target + suffix; return; }
  const t0 = performance.now(), dur = 1400;
  const step = now => {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
$$('[data-n]').forEach(el => { if (!reduce) el.textContent = '0' + (el.dataset.s || ''); });
$$('.rv').forEach(s => $$('.sh,.rw,.grid>*', s).forEach((e, i) => e.style.setProperty('--d', Math.min(i, 8) * .08 + 's')));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(x => {
    if (!x.isIntersecting) return;
    x.target.classList.add('in');
    $$('[data-n]', x.target).forEach(count);
    io.unobserve(x.target);
  }), { threshold: .15 });
  $$('.rv').forEach(e => io.observe(e));
} else {
  $$('.rv').forEach(e => { e.classList.add('in'); $$('[data-n]', e).forEach(count); });
}

/* ---------- card spotlight follows the pointer ---------- */
document.addEventListener('pointermove', e => {
  const c = e.target.closest && e.target.closest('.gc,.card');
  if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', e.clientX - r.left + 'px');
  c.style.setProperty('--my', e.clientY - r.top + 'px');
}, { passive: true });

$$('[data-y]').forEach(e => e.textContent = new Date().getFullYear());

/* ---------- tabs (service page) ---------- */
$$('[role=tablist]').forEach(list => {
  const tabs = $$('[role=tab]', list);
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  const select = tab => tabs.forEach((t, i) => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    panels[i].hidden = !on;
  });
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const n = e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length]
              : e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
      if (n) { e.preventDefault(); n.focus(); select(n); }
    });
  });
});

/* ---------- blog: filter, search, load more ---------- */
const grid = $('#posts');
if (grid) {
  // Swap this array for your CMS / API data. `img` = path to the post image.
  const posts = [
    { t: 'How to automate lead follow-up in 20 minutes', c: 'Sales', m: 5, d: 'A step-by-step template that gets every new lead a reply within a minute.', img: 'image3/image-1-compressed (1).webp' },
    { t: 'AI agents vs. rules: which should you use?', c: 'AI', m: 7, d: 'A simple test to choose the right approach for each task.', img: 'image3/image-1-compressed.webp' },
    { t: 'The hidden cost of manual work', c: 'Strategy', m: 6, d: 'How to calculate what repetitive tasks really cost your team.', img: 'image3/image3-compressed.webp' },
    { t: 'New in the builder: loops, delays and approvals', c: 'Product', m: 4, d: 'Three blocks that turn a simple flow into a real business process.', img: 'image3/image5-compressed.webp' },
    { t: 'How a 12-person finance team closed the month in two days', c: 'Customers', m: 8, d: 'The five workflows that took month-end from five days to two.', img: 'images/images4/image9-compressed.webp' },
    { t: 'Writing instructions your agents can actually follow', c: 'AI', m: 6, d: 'Clear examples beat long rules. Here is how to write both.', img: 'images/image5-compressed.webp' },
    { t: 'Five workflows every revenue team should switch on first', c: 'Sales', m: 5, d: 'Start with the flows that pay back in the first week.', img: 'images/images4/image6-compressed.webp' },
    { t: 'A simple way to decide what to automate next', c: 'Strategy', m: 4, d: 'Score each task on effort, frequency and risk, then pick the winner.', img: 'images/images4/image7-compressed.webp' },
    { t: 'Version history and one-click rollback, explained', c: 'Product', m: 3, d: 'Edit live workflows without fear. Every change can be undone.', img: 'images/images4/image8-compressed.webp' },
    { t: 'Support at scale: how one team automated 60% of tickets', c: 'Customers', m: 7, d: 'What they automated first, and what they kept for people.', img: 'images2/image4-compressed.webp' },
    { t: 'Confidence scores: when should an agent ask for help?', c: 'AI', m: 6, d: 'Set thresholds that keep quality high without slowing the team.', img: 'images/images4/image9-compressed.webp' },
    { t: 'Where your data lives: a plain guide to regional hosting', c: 'Security', m: 5, d: 'Choose the US, EU or India and know exactly what stays there.', img: 'images/images4/image4-compressed.webp' }
  ];
  const size = 6;
  let cat = 'All', q = '', n = size;
  const cats = ['All', ...new Set(posts.map(p => p.c))];
  const chipBox = $('#cats');
  chipBox.innerHTML = cats.map(c => `<button type="button" class="chip" aria-pressed="${c === 'All'}" data-c="${c}">${c}</button>`).join('');

  const match = () => posts.filter(p => (cat === 'All' || p.c === cat) && `${p.t} ${p.d} ${p.c}`.toLowerCase().includes(q));
  const card = (p, i) => `<article class="gc bc" style="--d:${(i % 3) * .08}s"><div class="bi"><img src="${p.img}" alt="" width="600" height="400" loading="lazy"></div><div class="bb"><small>${p.c} · ${p.m} min read</small><h3>${p.t}</h3><p>${p.d}</p><a href="./404.html">Read more</a></div></article>`;

  function draw(append) {
    const r = match();
    const from = append ? grid.children.length : 0;
    if (!append) grid.innerHTML = '';
    grid.insertAdjacentHTML('beforeend', r.slice(from, n).map((p, i) => card(p, i)).join(''));
    $('#cnt').textContent = r.length ? `Showing ${Math.min(n, r.length)} of ${r.length} articles` : '';
    $('#empty').hidden = !!r.length;
    $('#more').hidden = n >= r.length;
  }
  chipBox.addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    cat = b.dataset.c; n = size;
    $$('.chip', chipBox).forEach(x => x.setAttribute('aria-pressed', x === b));
    draw();
  });
  $('#q').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); n = size; draw(); });
  $('#more').addEventListener('click', () => { n += 3; draw(true); });
  $('#clear').addEventListener('click', () => {
    cat = 'All'; q = ''; n = size; $('#q').value = '';
    $$('.chip', chipBox).forEach(x => x.setAttribute('aria-pressed', x.dataset.c === 'All'));
    draw();
  });
  draw();
}

/* ---------- forms: validation, password toggle, strength meter ---------- */
const EMAIL = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]{2,}$/;   // allows co.uk style two-part TLDs
const NAME = /^\p{L}[\p{L}\s.'’-]{1,59}$/u;
function check(f) {
  const v = f.value;
  if (f.type === 'checkbox') return f.required && !f.checked ? (f.dataset.msg || 'Please tick this box to continue.') : '';
  for (const r of (f.dataset.v || '').split(' ').filter(Boolean)) {
    let e = '';
    if (r === 'required') e = v.trim() ? '' : 'Please fill this in.';
    else if (r === 'name') e = NAME.test(v.trim()) ? '' : 'Enter your name using letters only.';
    else if (r === 'email') e = EMAIL.test(v.trim()) ? '' : 'Enter a valid email, like you@company.com.';
    else if (r === 'pass') e = v.length >= 8 ? '' : 'Use at least 8 characters.';
    else if (r === 'min') e = v.trim().length >= +f.dataset.min ? '' : `Write at least ${f.dataset.min} characters.`;
    if (e) return e;
  }
  return '';
}
function show(f, msg) {
  const box = f.closest('.fld') || f.closest('.ck-row') || f.parentElement;
  const out = document.getElementById(f.id + '-e');
  box.classList.toggle('bad', !!msg);
  f.setAttribute('aria-invalid', !!msg);
  if (out) { out.textContent = msg; f.setAttribute('aria-describedby', out.id); }
}
$$('[data-pw]').forEach(b => b.addEventListener('click', () => {
  const i = document.getElementById(b.dataset.pw), s = i.type === 'password';
  i.type = s ? 'text' : 'password';
  b.innerHTML = `<i class="fa-solid ${s ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
  b.setAttribute('aria-label', s ? 'Hide password' : 'Show password');
  b.setAttribute('aria-pressed', s);
}));
$$('[data-meter]').forEach(i => {
  const bar = $('#' + i.dataset.meter + ' i'), txt = $('#' + i.dataset.meter + '-t');
  const words = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];
  i.addEventListener('input', () => {
    const v = i.value;
    let s = 0;
    if (v.length >= 8) s++;
    if (v.length >= 12) s++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
    if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) s++;
    if (v.length < 8) s = Math.min(s, 0);
    bar.style.width = (v ? Math.max(s, .5) / 4 * 100 : 0) + '%';
    txt.textContent = v ? words[s] : 'Use 8 or more characters';
  });
});
$$('[data-count]').forEach(t => {
  const out = document.getElementById(t.dataset.count);
  t.addEventListener('input', () => out.textContent = `${t.value.length} / ${t.maxLength}`);
});
$$('form[data-form]').forEach(form => {
  form.noValidate = true;
  const fields = $$('input,select,textarea', form).filter(f => f.dataset.v || f.required);
  fields.forEach(f => {
    f.addEventListener('blur', () => { if (f.value || f.type === 'checkbox') show(f, check(f)); });
    ['input', 'change'].forEach(ev => f.addEventListener(ev, () => {
      const box = f.closest('.fld') || f.closest('.ck-row') || f.parentElement;
      if (box.classList.contains('bad')) show(f, check(f));
    }));
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let first = null;
    fields.forEach(f => { const m = check(f); show(f, m); if (m && !first) first = f; });
    if (first) {
      first.focus();
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      return;
    }
    const btn = $('[type=submit]', form), label = btn.textContent;
    btn.classList.add('ld'); btn.disabled = true; btn.textContent = form.dataset.busy || 'Sending…';
    // TODO: replace this timeout with your real request, e.g.
    // fetch('/api/…', { method: 'POST', body: new FormData(form) }).then(...)
    setTimeout(() => {
      $$('[data-echo]').forEach(x => x.textContent = (form.elements[x.dataset.echo] || {}).value || '');
      btn.classList.remove('ld'); btn.disabled = false; btn.textContent = label;
      const panel = form.dataset.done && $(form.dataset.done);
      if (panel) { form.hidden = true; panel.hidden = false; panel.focus(); }
      else { const m = $('.fmsg', form.parentElement); if (m) m.textContent = form.dataset.msg || 'Done.'; }
      form.reset();
      $$('.meter i', form).forEach(i => i.style.width = 0);
    }, 900);
  });
});

/* ---------- 404: show the missing path + search the site ---------- */
const sq = $('#sq');
if (sq) {
  const p = decodeURIComponent(location.pathname);
  const pth = $('#pth');
  if (pth && p !== '/' && !/404\.html$/.test(p)) pth.textContent = p.length > 48 ? '…' + p.slice(-47) : p;
  const pages = [
    ['Home', './index.html', 'Overview and how it works'],
    ['Pricing', './index.html#pricing', 'Plans and free trial'],
    ['About', './about.html', 'Our story and team'],
    ['Service', './service.html', 'Automation, AI agents and more'],
    ['Blog', './blog.html', 'Guides and playbooks'],
    ['Contact', './contact.html', 'Talk to a real person'],
    ['Log in', './login.html', 'Access your workspace'],
    ['Sign up', './signup.html', 'Create a free account']
  ];
  const out = $('#sr');
  const list = () => {
    const q = sq.value.trim().toLowerCase();
    const r = pages.filter(x => !q || `${x[0]} ${x[2]}`.toLowerCase().includes(q)).slice(0, 5);
    out.innerHTML = r.length
      ? r.map(x => `<li><a href="${x[1]}"><b>${x[0]}</b><small>${x[2]}</small></a></li>`).join('')
      : '<li class="none">No page matches. Try the homepage.</li>';
  };
  sq.addEventListener('input', list);
  $('#sf').addEventListener('submit', e => { e.preventDefault(); const a = $('a', out); if (a) location.href = a.getAttribute('href'); });
  list();
}
})();