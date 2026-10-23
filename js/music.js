// Background music engine: moods that change with the game.
/* ---------- music (generated live, no audio files) ---------- */
const MU={mood:'lobby',on:false,step:0,timer:0,bus:null};
const MOODS={lobby:{bpm:84,root:57,arp:[0,3,7,10,7,3],bass:[0,0,-5,-2],ch:[0,3,7],lead:'triangle',g:.5},
tense:{bpm:110,root:52,arp:[0,1,7,8,7,1],bass:[0,0,0,-2],ch:[0,3,6],lead:'sawtooth',g:.4},
panic:{bpm:150,root:52,arp:[0,1,7,8,12,8,7,1],bass:[0,0,1,0],ch:[0,1,7],lead:'square',g:.35},
win:{bpm:122,root:60,arp:[0,4,7,12,7,4],bass:[0,0,5,7],ch:[0,4,7],lead:'triangle',g:.5},
lose:{bpm:68,root:50,arp:[0,3,6,3],bass:[0,0,-2,-4],ch:[0,3,6],lead:'sine',g:.5}};
const mf=m=>440*Math.pow(2,(m-69)/12);
function mnote(f,d,type,v,t){const o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=(type==='sawtooth'||type==='square')?1200:3000;o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(lp);lp.connect(g);g.connect(MU.bus);o.start(t);o.stop(t+d+.05)}
function mtick(){const m=MOODS[MU.mood],b=60/m.bpm/2,t=AC.currentTime+.05,s=MU.step++;
 mnote(mf(m.root+12+m.arp[s%m.arp.length]),b*1.6,m.lead,.45*m.g,t);
 if(s%4===0)mnote(mf(m.root-12+m.bass[(s>>2)%m.bass.length]),b*3.6,'sine',.8,t);
 if(s%8===0)m.ch.forEach(i=>mnote(mf(m.root+i),b*7.5,'triangle',.14,t));
 if((MU.mood==='tense'||MU.mood==='panic')&&s%2===0)mnote(90,.07,'sine',.6,t)}
function mstart(){if(!cfg.mus||MU.on)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume();if(!MU.bus){MU.bus=AC.createGain();MU.bus.connect(AC.destination)}mvol();MU.on=true;(function run(){if(!MU.on)return;mtick();MU.timer=setTimeout(run,60/MOODS[MU.mood].bpm/2*1000)})()}catch(e){}}
function mstop(){MU.on=false;clearTimeout(MU.timer)}
function mood(m){if(MU.mood!==m){MU.mood=m;MU.step=0}}
function mvol(){if(MU.bus)MU.bus.gain.value=cfg.mus?cfg.mvol*.45:0}
function syncMus(){$('#musBtn').textContent='Music: '+(cfg.mus?'on':'off');$('#musBtn').setAttribute('aria-pressed',cfg.mus);if(cfg.mus)mstart();else mstop();mvol()}
