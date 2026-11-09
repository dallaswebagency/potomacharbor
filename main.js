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
