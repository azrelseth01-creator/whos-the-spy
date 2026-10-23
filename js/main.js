// Startup: shortcuts, first-tap music start, first render.
addEventListener('keydown',e=>{if(e.key==='Escape')$('#settings').classList.remove('on');if(G.step===2&&e.code==='Space'&&!/INPUT|TEXTAREA|BUTTON/.test(document.activeElement.tagName)){e.preventDefault();const b=$('#tStart');b&&b.click()}});
addEventListener('pointerdown',()=>mstart(),{once:true});
syncMus();applyTheme();render();
if(cfg.pin){$('#lock').classList.add('on')}
