// Settings panel and host PIN lock.
/* ---------- settings & lock ---------- */
function applyTheme(){document.documentElement.setAttribute('data-theme',cfg.theme==='auto'?'':cfg.theme);document.body.classList.toggle('fx-on',cfg.vfx)}
function openSettings(){$('#sTime').value=cfg.time;$('#sSfx').checked=cfg.sfx;$('#sVol').value=cfg.vol;$('#sVfx').checked=cfg.vfx;$('#sMus').checked=cfg.mus;$('#sMVol').value=cfg.mvol;$('#sTheme').value=cfg.theme;$('#sPin').value=cfg.pin;$('#settings').classList.add('on')}
$('#setBtn').onclick=()=>{sfx.click();openSettings()};
$('#sClose').onclick=()=>{
  cfg.time=Math.max(10,+$('#sTime').value||120);cfg.sfx=$('#sSfx').checked;cfg.mus=$('#sMus').checked;cfg.mvol=+$('#sMVol').value;cfg.vol=+$('#sVol').value;cfg.vfx=$('#sVfx').checked;cfg.theme=$('#sTheme').value;cfg.pin=$('#sPin').value.trim();
  saveCfg();applyTheme();syncMus();$('#settings').classList.remove('on');
  if(G.step===2&&!G.run){G.left=cfg.time;G.total=cfg.time;drawTimer()}sfx.click();
};
$('#sVol').oninput=()=>{cfg.vol=+$('#sVol').value;sfx.click()};
$('#sMVol').oninput=()=>{cfg.mvol=+$('#sMVol').value;mvol()};
$('#musBtn').onclick=()=>{cfg.mus=!cfg.mus;saveCfg();syncMus()};
$('#sReset').onclick=()=>{if(!confirm('Start a new game? Players and questions will be cleared.'))return;stopTimer();newGame();$('#settings').classList.remove('on');render()};
$('#lockBtn').onclick=()=>{if(!cfg.pin)return toast('Set a host PIN in Settings first.');$('#pinIn').value='';$('#lock').classList.add('on');$('#pinIn').focus()};
$('#pinGo').onclick=()=>{if($('#pinIn').value===cfg.pin){$('#lock').classList.remove('on');sfx.good()}else{sfx.bad();shake();toast('Wrong PIN.')}};
$('#pinIn').onkeydown=e=>{if(e.key==='Enter')$('#pinGo').click()};
