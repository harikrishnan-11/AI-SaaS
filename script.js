// Real photos per section id (topic keywords). Swap for your own licensed photos anytime.
const im = { home: ['ai,technology', 'AI technology'], trust: ['business,team', 'Business team meeting'], problem: ['stress,paperwork', 'Overloaded office worker'], platform: ['server,datacenter', 'Data center servers'], builder: ['coding,laptop', 'Developer building workflows'], agents: ['robot,artificial', 'AI robot assistant'], integrations: ['network,cable', 'Connected network'], analytics: ['dashboard,analytics', 'Analytics dashboard'], security: ['cyber,security', 'Cyber security'], how: ['startup,whiteboard', 'Planning on whiteboard'], results: ['growth,success', 'Team celebrating results'], voices: ['customer,smile', 'Happy customer'], faq: ['help,support', 'Customer support'], cta: ['rocket,launch', 'Rocket launch'], news: ['email,inbox', 'Email newsletter'] };
document.querySelectorAll('.art').forEach((el, i) => {
    const d = im[el.closest('section').id]; if (!d) return;
    el.style.setProperty('--g', 'hsl(' + ((i * 47 + 255) % 360) + ' 80% 50% / .3)');
    el.innerHTML = `<img src="https://loremflickr.com/800/800/${d[0]}?lock=${i + 10}" alt="${d[1]}" width="800" height="800" loading="${i ? 'lazy' : 'eager'}" onerror="this.onerror=null;this.src='https://picsum.photos/seed/stackly${i}/800/800'">`
});

// Scroll reveal + counters
const io = new IntersectionObserver(e => e.forEach(x => {
    if (!x.isIntersecting) return; x.target.classList.add('in');
    x.target.querySelectorAll('[data-n]').forEach(c => { const t = +c.dataset.n; let v = 0; const iv = setInterval(() => { v += Math.ceil(t / 40); if (v >= t) { v = t; clearInterval(iv) } c.textContent = v }, 30) }); io.unobserve(x.target)
}), { threshold: .2 });
document.querySelectorAll('.rv').forEach(e => io.observe(e));

// Mobile menu
const nav = document.getElementById('nav');
document.getElementById('mb').onclick = () => nav.classList.toggle('open');
nav.onclick = e => { if (e.target.tagName == 'A') nav.classList.remove('open') };

// Newsletter (demo only: connect to your email provider)
document.getElementById('nf').onsubmit = e => { e.preventDefault(); document.getElementById('nm').textContent = 'Thanks! Check your inbox to confirm.'; e.target.reset() };
// Pricing toggle
document.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { document.querySelectorAll('[data-b]').forEach(x => x.classList.toggle('on', x == b)); document.getElementById('gp').textContent = b.dataset.b == 'y' ? '$39' : '$49' });
