// Small shared helpers and game flow (go, deal).
/* ---------- helpers ---------- */
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const alive=()=>G.players.filter(p=>p.alive);
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function go(n){
  if(n===1&&!G.dealt){
    if(G.players.length<3)return toast('Add at least 3 players first.');
    if(G.spies>=Math.ceil(G.players.length/2))return toast('Too many spies for this group.');
    if(!G.civ.trim()||!G.spy.trim())return toast('Fill in both questions first.');
    deal();
  }
  if(n>1&&!G.dealt)return toast('Deal the roles first.');
  
  G.step=n;if(n!==2)stopTimer();sfx.click();render();
}
function deal(){
  const ps=shuffle(G.players.slice());
  G.players.forEach(p=>{p.role='civ';p.alive=true;p.votes=0});
  ps.slice(0,G.spies).forEach(p=>p.role='spy');
  G.dealt=true;G.round=1;G.left=cfg.time;G.elim=null;G.over=null;G.revealed=null;G.picked=null;sfx.deal();
}
