// Sound effects (generated with Web Audio, no files).
/* ---------- audio ---------- */
let AC;
function tone(f,d=.12,type='sine',v=.25,delay=0){
  if(!cfg.sfx)return;
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  AC.state==='suspended'&&AC.resume();const t=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v*cfg.vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02)}catch(e){}
}
const sfx={
  click:()=>tone(520,.07,'triangle'),
  add:()=>{tone(660,.08,'triangle');tone(880,.1,'triangle',.25,.07)},
  del:()=>tone(240,.12,'sawtooth',.15),
  deal:()=>[400,500,600,800].forEach((f,i)=>tone(f,.12,'square',.12,i*.07)),
  flip:()=>tone(700,.09,'triangle'),
  tick:()=>tone(1000,.05,'square',.12),
  alarm:()=>[0,.25,.5].forEach(d=>{tone(880,.2,'sawtooth',.25,d);tone(660,.2,'sawtooth',.2,d+.1)}),
  vote:()=>tone(440+Math.random()*80,.06,'triangle'),
  good:()=>[523,659,784,1046].forEach((f,i)=>tone(f,.22,'triangle',.25,i*.1)),
  bad:()=>[300,240,180].forEach((f,i)=>tone(f,.25,'sawtooth',.2,i*.14))
};
