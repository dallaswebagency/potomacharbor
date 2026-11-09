// Mobile menu
const header=document.querySelector('.site-header');
document.querySelector('.menu-btn')?.addEventListener('click',()=>{
  const open=header.classList.toggle('menu-open');
  document.querySelector('.menu-btn').setAttribute('aria-expanded',open);
});

// Scroll reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Inquiry forms: open the visitor's mail app addressed to the team
document.querySelectorAll('form.form').forEach(f=>{
  f.addEventListener('submit',e=>{
    e.preventDefault();
    const d=new FormData(f);
    const name=`${d.get('first')||''} ${d.get('last')||''}`.trim();
    const body=`Name: ${name}\nTitle: ${d.get('title')||''}\nEmail: ${d.get('email')||''}\n\n${d.get('message')||''}`;
    window.location.href=`mailto:Info@potomacharbor.com?subject=${encodeURIComponent('Inquiry from '+name)}&body=${encodeURIComponent(body)}`;
    f.classList.add('sent');
  });
});

// Events: sort into upcoming and past by date
const list=document.querySelector('[data-events]');
if(list){
  const today=new Date();today.setHours(0,0,0,0);
  const up=document.querySelector('[data-upcoming]'),past=document.querySelector('[data-past]');
  const items=[...list.querySelectorAll('.event')];
  items.sort((a,b)=>new Date(a.dataset.date)-new Date(b.dataset.date));
  items.forEach(ev=>{
    const isPast=new Date(ev.dataset.date+'T23:59:59')<today;
    (isPast?past:up).querySelector('.ev-list').appendChild(ev);
  });
  const pastList=[...past.querySelectorAll('.event')].reverse();
  pastList.forEach(ev=>past.querySelector('.ev-list').appendChild(ev));
  if(!past.querySelector('.event'))past.remove();
  const n=up.querySelectorAll('.event').length;
  const c=document.querySelector('[data-count]');if(c)c.textContent=String(n).padStart(2,'0');
  list.remove();
}

// ===================== Motion & effects =====================
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

// Split headline words for staggered rise
document.querySelectorAll('.split-words').forEach(h=>{
  let i=0;const base=parseInt(h.dataset.delay||150);
  [...h.childNodes].forEach(n=>{
    const make=(content,isEl)=>{const w=document.createElement('span');w.className='w';const s=document.createElement('span');s.style.setProperty('--d',(base+i++*90)+'ms');isEl?s.appendChild(content):s.textContent=content;w.appendChild(s);return w};
    if(n.nodeType===3){
      const frag=document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))frag.appendChild(document.createTextNode(' '));else frag.appendChild(make(t,false))});
      n.replaceWith(frag);
    }else if(n.nodeType===1){n.replaceWith(make(n.cloneNode(true),true))}
  });
});

// Auto-stagger grouped reveals that have no delay set
document.querySelectorAll('.offer-grid,.team-grid,.findings,.fourS,.post-grid,.board-grid,.resources,.hub-cards,.ev-list').forEach(g=>{
  [...g.querySelectorAll(':scope>.reveal')].forEach((el,i)=>{if(!el.style.getPropertyValue('--d'))el.style.setProperty('--d',(i*110)+'ms')});
});
document.querySelectorAll('.fourS').forEach(f=>io.observe(f));
document.querySelectorAll('.img-wipe').forEach(el=>io.observe(el));

// Count-up numbers
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,end=+el.dataset.count;if(reduce){el.textContent=end;return}
  const t0=performance.now(),dur=1600;
  const tick=t=>{const p=Math.min((t-t0)/dur,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)};
  el.textContent='0';requestAnimationFrame(tick);
}),{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

// Header shrink + scroll progress + parallax
const bar=document.createElement('div');bar.className='progress';document.body.appendChild(bar);
const px=[...document.querySelectorAll('.parallax')];
let ticking=false;
const onScroll=()=>{
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  header.classList.toggle('scrolled',y>20);
  bar.style.transform=`scaleX(${h>0?y/h:0})`;
  if(!reduce)px.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;el.style.transform=`translate3d(0,${(r.top)*-(+el.dataset.speed||.1)}px,0) scale(1.08)`});
  ticking=false;
};
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true}},{passive:true});
onScroll();

// Cursor glow inside dark sections
document.querySelectorAll('.glow').forEach(g=>{
  const host=g.parentElement;
  host.addEventListener('mousemove',e=>{const r=host.getBoundingClientRect();g.style.setProperty('--mx',(e.clientX-r.left)+'px');g.style.setProperty('--my',(e.clientY-r.top)+'px')});
});

// Subtle 3D tilt on cards
if(!reduce&&matchMedia('(hover:hover)').matches){
  document.querySelectorAll('.member-card,.post-card,.finding,.hev,.callout').forEach(c=>{
    c.classList.add('tilt');
    c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-4px)`});
    c.addEventListener('mouseleave',()=>{c.style.transform=''});
  });
}

// Home: show the next two upcoming events (falls back to most recent)
const he=document.querySelector('[data-home-events]');
if(he){
  const today=new Date();today.setHours(0,0,0,0);
  const all=[...he.querySelectorAll('.hev')];
  const up=all.filter(e=>new Date(e.dataset.date+'T23:59:59')>=today).sort((a,b)=>new Date(a.dataset.date)-new Date(b.dataset.date));
  const past=all.filter(e=>!up.includes(e)).sort((a,b)=>new Date(b.dataset.date)-new Date(a.dataset.date));
  const show=[...up,...past].slice(0,2);
  all.forEach(e=>{if(!show.includes(e))e.remove()});
  show.forEach((e,i)=>{he.appendChild(e);e.style.setProperty('--d',(i*140)+'ms')});
}
