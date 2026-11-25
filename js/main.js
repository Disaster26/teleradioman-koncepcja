// menu mobilne
(function(){
  var b=document.querySelector('.burger'),m=document.getElementById('menu');
  if(!b||!m)return;
  b.addEventListener('click',function(){
    var o=m.classList.toggle('otwarte');
    b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
    document.body.style.overflow=o?'hidden':'';
  });
  m.addEventListener('click',function(e){if(e.target.closest('a')){m.classList.remove('otwarte');b.setAttribute('aria-expanded','false');document.body.style.overflow='';}});
})();

// skala strojenia: wskazowka idzie do kategorii
document.querySelectorAll('.skala').forEach(function(s){
  var tor=s.querySelector('.skala__tor'),igla=s.querySelector('.skala__igla'),linki=s.querySelectorAll('[data-skala]');
  var akt=s.querySelector('[aria-current]')||linki[0];
  function ustaw(a){var x=a.offsetLeft+a.offsetWidth/2-1;igla.style.setProperty('--x',x+'px');}
  linki.forEach(function(a){
    a.addEventListener('mouseenter',function(){ustaw(a)});
    a.addEventListener('focus',function(){ustaw(a)});
  });
  s.addEventListener('mouseleave',function(){ustaw(akt)});
  ustaw(akt);
  if(akt.getAttribute('aria-current'))tor.scrollLeft=Math.max(0,akt.offsetLeft-40);
  window.addEventListener('resize',function(){ustaw(akt)});
  if(document.fonts)document.fonts.ready.then(function(){ustaw(akt)});
});

// toast
function pokazToast(t){
  var el=document.getElementById('toast');if(!el)return;
  el.textContent=t;el.classList.add('widoczny');
  clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('widoczny')},2600);
}

// koszyk (podglad)
(function(){
  var n=0,l=document.querySelectorAll('[data-licznik]');
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-koszyk]');if(!b)return;
    n++;l.forEach(function(x){x.textContent=n});
    var nazwa=b.closest('.produkt').querySelector('.produkt__nazwa').textContent;
    pokazToast('Dodano do koszyka: '+nazwa);
  });
})();

// karuzela: palec, mysz, strzalki
document.querySelectorAll('[data-karuzela]').forEach(function(k){
  var tor=k.querySelector('.karuzela__tor');
  function krok(){var c=tor.children[0];return c?c.getBoundingClientRect().width+14:300}
  k.querySelector('[data-prev]').addEventListener('click',function(){tor.scrollBy({left:-krok(),behavior:'smooth'})});
  k.querySelector('[data-next]').addEventListener('click',function(){tor.scrollBy({left:krok(),behavior:'smooth'})});
  var down=false,sx=0,sl=0,ruch=false;
  tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.target.closest('button'))return;down=true;ruch=false;sx=e.clientX;sl=tor.scrollLeft;tor.classList.add('ciagnie')});
  window.addEventListener('pointermove',function(e){if(!down)return;var d=e.clientX-sx;if(Math.abs(d)>4)ruch=true;tor.scrollLeft=sl-d});
  window.addEventListener('pointerup',function(){if(!down)return;down=false;tor.classList.remove('ciagnie');
    var w=krok();tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'})});
  tor.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false}},true);
  tor.addEventListener('dragstart',function(e){e.preventDefault()});
});

// filtr i sortowanie w kategorii
(function(){
  var siatka=document.querySelector('[data-siatka]');if(!siatka)return;
  var filtry=document.querySelectorAll('[data-filtr]'),sel=document.querySelector('[data-sortuj]'),ile=document.querySelector('[data-ile]');
  var wybrany='';
  function odswiez(){
    var el=[].slice.call(siatka.children),v=sel.value;
    el.sort(function(a,b){
      if(v==='asc')return a.dataset.cena-b.dataset.cena;
      if(v==='desc')return b.dataset.cena-a.dataset.cena;
      return a.dataset.kolejnosc-b.dataset.kolejnosc;
    }).forEach(function(x){siatka.appendChild(x)});
    var n=0;el.forEach(function(x){var ok=!wybrany||x.dataset.producent===wybrany;x.hidden=!ok;if(ok)n++});
    ile.textContent=n;
  }
  filtry.forEach(function(f){f.addEventListener('click',function(){
    wybrany=f.dataset.filtr;filtry.forEach(function(x){x.setAttribute('aria-pressed',x===f)});odswiez();
  })});
  sel.addEventListener('change',odswiez);
})();

// mapa po kliknieciu
document.querySelectorAll('[data-mapa]').forEach(function(m){
  function wstaw(){if(m.dataset.ok)return;m.dataset.ok=1;m.innerHTML='<iframe src="'+m.dataset.mapa+'" title="Mapa dojazdu TELE-RADIOman" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';}
  m.querySelector('button').addEventListener('click',wstaw);
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){wstaw();io.disconnect()}},{rootMargin:'300px'});io.observe(m)}
});

// cookies
document.querySelectorAll('[data-cookies]').forEach(function(b){b.addEventListener('click',function(){
  try{localStorage.setItem('trm-cookies',b.dataset.cookies)}catch(e){}
  document.getElementById('cookies').hidden=true;
})});
