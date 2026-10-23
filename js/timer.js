// Discussion timer and screen wake lock.
let wl=null;async function wake(on){try{if(on&&navigator.wakeLock)wl=await navigator.wakeLock.request('screen');else if(wl){wl.release();wl=null}}catch(e){}}
/* ---------- timer ---------- */
function stopTimer(){clearInterval(timerId);timerId=null;G.run=false;wake(false)}
function startTimer(){
  if(G.run||G.left<=0)return;G.run=true;sfx.click();endAt=Date.now()+G.left*1000;wake(true);
  timerId=setInterval(()=>{
    const nl=Math.max(0,Math.ceil((endAt-Date.now())/1000));if(nl===G.left)return;G.left=nl;saveG();
    if(G.left<=10&&G.left>0){sfx.tick();shake();mood('panic')}
    if(G.left<=0){G.left=0;stopTimer();sfx.alarm();shake();burst('lose');toast('Time’s up! Time to vote.')}
    drawTimer();
  },250);
  drawTimer();
}
function drawTimer(){
  const r=$('#ring');if(!r)return;
  const total=Math.max(G.total||cfg.time,1),C=2*Math.PI*90;
  r.className='ring'+(G.run?' run':'')+(G.left<=10&&G.left>0?' low':'');
  $('#tt').textContent=fmt(G.left);
  $('#fg').style.strokeDashoffset=C*(1-G.left/total);
  $('#tStart').textContent=G.run?'Pause':(G.left<=0?'Done':'Start');
  $('#tStart').disabled=G.left<=0;
}
