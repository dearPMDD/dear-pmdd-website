// Checkout destination for every "get the tracker" button. Paste the checkout URL
// here once it exists (Stan Store, Gumroad, Shopify, Stripe link, etc.). Until then
// the buttons scroll to the purchase section rather than linking to a dead page.
// Fulfilment file delivered after payment: downloads/Dear PMDD Tracker.xlsx
const CHECKOUT_URL = '';
document.querySelectorAll('[data-checkout-link]').forEach(a => {
  if (CHECKOUT_URL) { a.href = CHECKOUT_URL; a.target = '_blank'; a.rel = 'noopener'; }
  else { a.addEventListener('click', e => e.preventDefault()); }
});

    // Hero preview: renders the Tracker sheet exactly as it ships in the .xlsx —
    // CYCLE DAY / STAGE header rows, then one block per month (Cycle Start, Mood, Notes).
    // Stage spans and mood fills use the workbook's own conditional-format palette.
    const STAGES = [['period',5],['foll',7],['ov',3],['mid',8],['late',5]];
    const MONTHS = [
      { m:'Jan', len:28, start:'1 Jan',
        mood:['okay','okay','good','okay','good','good','good','good','good','good','good','okay','good','good','okay','okay','good','okay','okay','okay','okay','okay','low','low','low','okay','low','low'] },
      { m:'Feb', len:28, start:'29 Jan',
        mood:['okay','low','okay','okay','good','good','good','good','good','okay','good','good','okay','good','good','okay','okay','okay','okay','low','okay','okay','low','low','okay','low','low','low'] },
      { m:'Mar', len:28, start:'26 Feb',
        mood:['low','okay','okay','good','good','good','good','good','good','okay','good','okay','good','okay','okay','okay','okay','okay','low','okay','okay','low','low','low','low','low',null,null] }
    ];
    const host = document.getElementById('xl-sheet');
    const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
    const row = (label, cells) => { const r = el('div','xr'); r.appendChild(el('div','rh',label)); cells.forEach(c => r.appendChild(c)); return r; };

    // CYCLE DAY
    host.appendChild(row('Cycle Day', Array.from({length:28}, (_,i) => el('div','day', String(i+1)))));
    // STAGE
    const stageCells = [];
    STAGES.forEach(([k,n]) => { for (let i=0;i<n;i++) stageCells.push(el('div','st '+k)); });
    host.appendChild(row('Stage', stageCells));

    MONTHS.forEach(({m,start,mood}) => {
      const head = el('div','xl-month');
      head.appendChild(el('b',null,'Month'));
      const mv = el('div','mv');
      mv.appendChild(el('i',null,m));
      mv.appendChild(el('s',null,'Length 28 · Period 5'));
      head.appendChild(mv);
      host.appendChild(head);
      host.appendChild(row('Mood', mood.map(v => el('div','md' + (v ? ' '+v : '')))));
    });

    const key = el('div','xl-stagekey');
    [['Period','#FF7D59'],['Follicular','#FFDE94'],['Ovulation','#FFBDE8'],['Mid Luteal','#99B0ED'],['Late Luteal','#CDDBF9']].forEach(([n,c]) => {
      const s = el('span'); const i = el('i'); i.style.background = c; s.appendChild(i); s.appendChild(document.createTextNode(n)); key.appendChild(s);
    });
    host.appendChild(key);

    // Scroll reveal
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    } else {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }

    // Topbar border on scroll
    const topbar = document.getElementById('topbar');
    const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });