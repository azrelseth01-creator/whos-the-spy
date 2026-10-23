// The five screens: Setup, Roles, Timer, Vote, Result.
/* ---------- views ---------- */
function render(){saveG();if(!(G.step===4&&G.elim))mood(['lobby','lobby','tense','tense','tense'][G.step]);
  $('#nav').innerHTML=STEPS.map((s,i)=>`<button class="${i===G.step?'on':i<G.step?'done':''}" data-s="${i}">${s}</button>`).join('');
  $('#nav').querySelectorAll('button').forEach(b=>b.onclick=()=>go(+b.dataset.s));
  [vSetup,vRoles,vTimer,vVote,vResult][G.step]();
}
function vSetup(){
  main.innerHTML=`<div class="panel"><h2>Players</h2><p class="sub">Type each name and press Enter. Everyone who plays goes here.</p>
  <div class="row"><input type="text" id="nm" placeholder="Player name" maxlength="20" style="flex:1"><button class="btn pri" id="add">Add</button></div>
  <div class="chips" id="chips"></div></div><div class="gap"></div>
  <div class="panel"><div class="row" style="justify-content:space-between"><h2>Questions</h2><button class="btn" id="rnd">Random pair</button></div><p class="sub">Only you see these. Players hear their own question from you.</p>
  <div class="grid2"><div><label for="cq">Normal question (civilians)</label><textarea id="cq" placeholder="e.g. What do you like to eat for breakfast?"></textarea></div>
  <div><label for="sq">Spy’s question</label><textarea id="sq" placeholder="e.g. What do you like to eat for dinner?"></textarea></div></div>
  <div class="gap"></div><div class="row"><label for="ns" style="margin:0">Number of spies</label><input type="number" id="ns" min="1" max="5" style="width:80px"><button class="btn pri" id="next" style="margin-left:auto">Deal roles</button></div></div>`;
  const chips=()=>{$('#chips').innerHTML=G.players.length?G.players.map((p,i)=>`<span class="chip">${esc(p.name)}<button data-i="${i}" aria-label="Remove ${esc(p.name)}">×</button></span>`).join(''):'<span style="color:var(--mute)">No players yet. Add at least 3.</span>';
    $('#chips').querySelectorAll('button').forEach(b=>b.onclick=()=>{G.players.splice(+b.dataset.i,1);G.dealt=false;sfx.del();chips()})};
  const add=()=>{const v=$('#nm').value.trim();if(!v)return;
    if(G.players.some(p=>p.name.toLowerCase()===v.toLowerCase()))return toast('That name is already in the list.');
    G.players.push({name:v,role:'civ',alive:true,votes:0});G.dealt=false;$('#nm').value='';sfx.add();chips();$('#nm').focus()};
  $('#add').onclick=add;$('#nm').onkeydown=e=>{if(e.key==='Enter')add()};
  $('#cq').value=G.civ;$('#sq').value=G.spy;$('#ns').value=G.spies;
  $('#rnd').onclick=()=>{const w=WORDS[Math.random()*WORDS.length|0];G.civ=w[0];G.spy=w[1];$('#cq').value=w[0];$('#sq').value=w[1];sfx.add()};
  $('#cq').oninput=e=>{G.civ=e.target.value};$('#sq').oninput=e=>{G.spy=e.target.value};
  $('#ns').onchange=e=>{G.spies=Math.max(1,+e.target.value||1);G.dealt=false};
  $('#next').onclick=()=>go(1);chips();
}
function vRoles(){
  main.innerHTML=`<div class="panel"><h2>Roles dealt</h2><p class="sub">Tap a card to reveal that player’s question, then read it to them quietly. Tap again to hide.</p>
  <div class="cards" id="cards"></div>
  <div class="row"><button class="btn" id="hide">Hide all</button><button class="btn" id="redeal">Re-deal</button><button class="btn pri" id="go" style="margin-left:auto">Start timer</button></div></div>`;
  const draw=()=>{$('#cards').innerHTML=G.players.map((p,i)=>`<button class="card ${p.role} ${p.open?'open':''}" data-i="${i}"><b>${esc(p.name)}</b>${p.open?`<span class="tag">${p.role==='spy'?'SPY':'Civilian'}</span><span class="q">${esc(p.role==='spy'?G.spy:G.civ)}</span>`:'<span class="hint">Tap to reveal</span>'}</button>`).join('');
    $('#cards').querySelectorAll('.card').forEach(c=>c.onclick=()=>{const p=G.players[+c.dataset.i];p.open=!p.open;sfx.flip();draw()})};
  draw();
  $('#hide').onclick=()=>{G.players.forEach(p=>p.open=false);sfx.click();draw()};
  $('#redeal').onclick=()=>{G.players.forEach(p=>p.open=false);deal();draw();toast('Roles shuffled.')};
  $('#go').onclick=()=>{G.players.forEach(p=>p.open=false);G.left=cfg.time;G.total=cfg.time;go(2)};
}
function vTimer(){
  if(!G.total||(!G.run&&G.left===cfg.time))G.total=cfg.time;
  const C=2*Math.PI*90;
  main.innerHTML=`<div class="panel"><h2>Round ${G.round}: discuss</h2><p class="sub">Everyone asks and answers. Then call time and collect votes.</p>
  <div class="stage"><div class="ring" id="ring"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="none" stroke="var(--sf2)" stroke-width="12"/>
  <circle class="fg" id="fg" cx="100" cy="100" r="90" fill="none" stroke="var(--acc)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0" style="transition:stroke-dashoffset 1s linear"/></svg><div class="t" id="tt">00:00</div></div></div>
  <div class="row" style="justify-content:center"><button class="btn pri" id="tStart" style="min-width:120px">Start</button><button class="btn" id="tAdd">+30s</button><button class="btn" id="tReset">Reset</button></div>
  <div class="gap"></div><div class="row"><span style="color:var(--mute)">Still in: ${alive().map(p=>esc(p.name)).join(', ')}</span><button class="btn pri" id="tVote" style="margin-left:auto">Go to voting</button></div></div>`;
  $('#tStart').onclick=()=>{G.run?(stopTimer(),sfx.click(),drawTimer()):startTimer()};
  $('#tAdd').onclick=()=>{G.left+=30;if(G.run)endAt+=30000;G.total=Math.max(G.total,G.left);sfx.click();drawTimer()};
  $('#tReset').onclick=()=>{stopTimer();G.left=cfg.time;G.total=cfg.time;sfx.click();drawTimer()};
  $('#tVote').onclick=()=>go(3);drawTimer();
}
function vVote(){
  main.innerHTML=`<div class="panel"><h2>Votes</h2><p class="sub">Each player says who they suspect. Tap + for every vote that person gets.</p><div id="vl"></div>
  <div class="gap"></div><div class="row"><span id="tot" style="color:var(--mute)"></span><button class="btn pri" id="rev" style="margin-left:auto">Reveal result</button></div></div>`;
  const draw=()=>{const a=alive(),max=Math.max(1,...a.map(p=>p.votes));
    $('#vl').innerHTML=a.map(p=>`<div class="vote" style="flex-wrap:wrap"><span class="nm">${esc(p.name)}</span><button class="btn" data-m="${G.players.indexOf(p)}" aria-label="Remove a vote from ${esc(p.name)}">−</button><span class="n">${p.votes}</span><button class="btn" data-p="${G.players.indexOf(p)}" aria-label="Add a vote to ${esc(p.name)}">+</button><div class="bar" style="width:${p.votes/max*100}%;flex-basis:auto"></div></div>`).join('');
    $('#vl').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{G.players[+b.dataset.p].votes++;sfx.vote();draw()});
    $('#vl').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const p=G.players[+b.dataset.m];p.votes=Math.max(0,p.votes-1);sfx.click();draw()});
    $('#tot').textContent=`${a.reduce((s,p)=>s+p.votes,0)} of ${a.length} votes counted`};
  draw();
  $('#rev').onclick=()=>{if(!alive().some(p=>p.votes>0))return toast('Enter at least one vote first.');G.picked=null;G.revealed=false;go(4)};
}
function vResult(){
  const a=alive(),max=Math.max(...a.map(p=>p.votes)),top=a.filter(p=>p.votes===max);
  if(G.elim){
    const p=G.elim,spy=p.role==='spy';
    const over=G.over;
    main.innerHTML=`<div class="panel"><div class="reveal"><div>Voted out</div><div class="big">${esc(p.name)}</div><span class="pill ${p.role}">${spy?'Was a spy':'Was a civilian'}</span>
    ${over?`<h2 style="margin-top:22px">${over==='civ'?'Civilians win!':'Spies win!'}</h2>`:'<p class="sub" style="margin-top:18px">The game goes on.</p>'}</div>
    ${over?`<div class="chips" style="justify-content:center">${G.players.map(q=>`<span class="chip ${q.alive?'':'out'}" style="padding:6px 14px">${esc(q.name)} <span class="pill ${q.role}">${q.role==='spy'?'Spy':'Civ'}</span></span>`).join('')}</div>
    <div class="gap"></div><div class="row" style="justify-content:center"><button class="btn pri" id="again">Play again</button></div>`:
    `<div class="row" style="justify-content:center"><button class="btn pri" id="next">Next round</button></div>`}</div>`;
    if(over)$('#again').onclick=()=>{const ps=G.players.map(q=>({name:q.name,role:'civ',alive:true,votes:0}));const k=[G.civ,G.spy,G.spies];newGame();G.players=ps;[G.civ,G.spy,G.spies]=k;go(0)};
    else $('#next').onclick=()=>{G.round++;G.elim=null;G.players.forEach(q=>q.votes=0);G.left=cfg.time;G.total=cfg.time;go(2)};
    return;
  }
  const tie=top.length>1;
  main.innerHTML=`<div class="panel"><h2>${tie?'It’s a tie':'Most votes'}</h2><p class="sub">${tie?'Choose who goes out. A re-vote is also fine.':'Confirm to reveal their role.'}</p>
  <div class="cards">${top.map(p=>`<button class="card" data-i="${G.players.indexOf(p)}" style="${G.picked===G.players.indexOf(p)||!tie?'border-color:var(--acc)':''}"><b>${esc(p.name)}</b><span class="hint">${p.votes} votes</span></button>`).join('')}</div>
  <div class="row"><button class="btn" id="back">Back to votes</button><button class="btn bad" id="ok" style="margin-left:auto" ${tie?'disabled':''}>Reveal role</button></div></div>`;
  if(!tie)G.picked=G.players.indexOf(top[0]);
  $('#cards,.cards').querySelectorAll('.card').forEach(c=>c.onclick=()=>{if(!tie)return;G.picked=+c.dataset.i;sfx.click();vResult();$('#ok').disabled=false});
  if(tie&&G.picked!=null)$('#ok').disabled=false;
  $('#back').onclick=()=>go(3);
  $('#ok').onclick=()=>{const p=G.players[G.picked];p.alive=false;G.elim=p;
    const sp=alive().filter(q=>q.role==='spy').length,cv=alive().length-sp;
    G.over=sp===0?'civ':(sp>=cv?'spy':null);
    if(p.role==='spy'){sfx.good();burst('win');mood('win')}else{sfx.bad();shake();burst('lose');mood('lose');flash()}
    if(G.over==='civ'||G.over==='spy'){setTimeout(()=>{sfx.good();burst('win');mood('win')},700)}
    vResult()};
}
