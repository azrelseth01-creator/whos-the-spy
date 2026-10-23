// Shared state: settings (cfg), the current game (G), saving and loading.
const $=s=>document.querySelector(s), main=$('#main');
const STEPS=['Setup','Roles','Timer','Vote','Result'];
let cfg={time:120,sfx:true,vol:.6,mus:true,mvol:.5,vfx:true,theme:'auto',pin:''};
try{Object.assign(cfg,JSON.parse(localStorage.getItem('wts-cfg')||'{}'))}catch(e){}
const saveCfg=()=>{try{localStorage.setItem('wts-cfg',JSON.stringify(cfg))}catch(e){}};
let G;
const newGame=()=>G={players:[],civ:'',spy:'',spies:1,step:0,dealt:false,round:1,left:cfg.time,run:false,elim:null,over:null,revealed:null,picked:null};
newGame();
let timerId=null,endAt=0;
const saveG=()=>{try{localStorage.setItem('wts-g',JSON.stringify(G))}catch(e){}};
try{const s=JSON.parse(localStorage.getItem('wts-g')||'null');if(s&&s.players){Object.assign(G,s);G.run=false}}catch(e){}
