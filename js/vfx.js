// Visual effects: ambient spotlight, confetti, shake, flash.
/* ---------- ambience ---------- */
const flash=()=>{if(!cfg.vfx)return;const f=$('#flash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on')};
const bg=$('#bg'),bx=bg.getContext('2d');let dust=[];
function bgSize(){bg.width=innerWidth;bg.height=innerHeight;dust=Array.from({length:50},()=>({x:Math.random()*bg.width,y:Math.random()*bg.height,r:Math.random()*2+.5,s:Math.random()*.4+.1}))}bgSize();addEventListener('resize',bgSize);
(function bgLoop(){bx.clearRect(0,0,bg.width,bg.height);if(cfg.vfx&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const l=bx.createRadialGradient(bg.width*.5,-50,0,bg.width*.5,-50,bg.height*.9);l.addColorStop(0,'rgba(255,200,87,.16)');l.addColorStop(1,'rgba(255,200,87,0)');bx.fillStyle=l;bx.fillRect(0,0,bg.width,bg.height);bx.fillStyle='rgba(255,200,87,.45)';dust.forEach(d=>{d.y+=d.s;d.x+=Math.sin(d.y/40)*.3;if(d.y>bg.height)d.y=0;bx.beginPath();bx.arc(d.x,d.y,d.r,0,6.3);bx.fill()})}requestAnimationFrame(bgLoop)})();
/* ---------- vfx ---------- */
const cv=$('#fx'),cx=cv.getContext('2d');let parts=[],raf=0;
function size(){cv.width=innerWidth;cv.height=innerHeight}size();addEventListener('resize',size);
function burst(kind='win'){
  if(!cfg.vfx)return;
  const cols=kind==='win'?['#ffc857','#4de1c1','#7c5cff','#ff4d8d','#fff']:['#ff4d8d','#a79fc9','#6b2bd9'];
  for(let i=0;i<(kind==='win'?150:70);i++)parts.push({x:innerWidth/2,y:innerHeight*.4,vx:(Math.random()-.5)*14,vy:Math.random()*-13-2,g:.28,r:3+Math.random()*5,c:cols[i%cols.length],l:90+Math.random()*60,rot:Math.random()*6});
  if(!raf)loop();
}
function loop(){
  cx.clearRect(0,0,cv.width,cv.height);
  parts=parts.filter(p=>p.l>0);
  parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.l--;p.rot+=.2;cx.globalAlpha=Math.min(1,p.l/30);cx.fillStyle=p.c;cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.fillRect(-p.r,-p.r/2,p.r*2,p.r);cx.restore()});
  raf=parts.length?requestAnimationFrame(loop):0;if(!raf)cx.clearRect(0,0,cv.width,cv.height);
}
function shake(){if(!cfg.vfx)return;document.body.classList.add('shake');setTimeout(()=>document.body.classList.remove('shake'),400)}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2000)}
