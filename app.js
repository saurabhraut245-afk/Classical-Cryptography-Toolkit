// ================================================================
// CLASSICAL CRYPTOGRAPHY TOOLKIT - Main App
// ================================================================

const App = {
  currentCipher: 'caesar',
  executionTime: '0.00',

  init() {
    this.setupNav();
    this.renderCaesar();
    document.getElementById('globalSampleBtn').addEventListener('click', () => this.fillSample());
  },

  setupNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        this.currentCipher = item.dataset.cipher;
        this.renderPanel(this.currentCipher);
      });
    });
  },

  renderPanel(cipher) {
    const panel = document.getElementById('cipher-panel');
    panel.innerHTML = '';
    panel.style.animation = 'none';
    setTimeout(() => { panel.style.animation = 'fadeIn 0.3s ease'; }, 10);
    const name = cipher.charAt(0).toUpperCase() + cipher.slice(1).replace(/-([a-z])/g, (_,c) => c.toUpperCase());
    const fn = 'render' + name;
    if (typeof this[fn] === 'function') this[fn]();
    else this.renderComingSoon(cipher);
  },

  fillSample() {
    const s = ['NETWORK SECURITY','CLASSICAL CRYPTOGRAPHY','HELLO WORLD','ATTACK AT DAWN'];
    const ta = document.querySelector('.plaintext-input');
    if (ta) { ta.value = s[Math.floor(Math.random()*s.length)]; }
  },

  showToast(msg, type) {
    type = type || 'success';
    const t = document.getElementById('toast');
    t.textContent = msg; t.className = 'toast show ' + type;
    setTimeout(() => { t.className = 'toast'; }, 2800);
  },

  copyText(text) {
    if (!text || text.trim() === '') { this.showToast('Nothing to copy', 'error'); return; }
    navigator.clipboard.writeText(text).then(() => this.showToast('Copied!')).catch(() => {
      const el = document.createElement('textarea');
      el.value = text; document.body.appendChild(el); el.select();
      document.execCommand('copy'); document.body.removeChild(el);
      this.showToast('Copied!');
    });
  },

  updateSliderBg(slider) {
    if (!slider) return;
    const pct = ((+slider.value - +slider.min) / (+slider.max - +slider.min)) * 100;
    slider.style.background = 'linear-gradient(to right, var(--accent-cyan) '+pct+'%, var(--bg-input) '+pct+'%)';
  },

  setSample(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  },

  buildPageHeader(title, icon, color, desc, keyspace, era) {
    const stats = [];
    if (keyspace) stats.push('<div class="stat-chip"><strong>'+keyspace+'</strong> Key Space</div>');
    if (era) stats.push('<div class="stat-chip">Era: <strong style="color:var(--accent-purple)">'+era+'</strong></div>');
    stats.push('<div class="stat-chip"><span class="dot"></span> <strong>'+(this.executionTime||'0.00')+' ms</strong> Exec Time</div>');
    return '<div class="page-header"><div class="page-header-top"><div class="page-title-group"><div class="page-icon '+color+'">'+icon+'</div><div><div class="page-title">'+title+'</div>'+(desc?'<div class="page-desc">'+desc+'</div>':'')+'</div></div></div><div class="stats-row">'+stats.join('')+'</div></div>';
  },

  buildOutputSection(enc, dec, extra) {
    const ev = enc || '<span class="empty">Encrypted text will appear here...</span>';
    const dv = dec || '<span class="empty">Decrypted text will appear here...</span>';
    return '<div class="output-card"><div class="output-header"><span class="output-dot"></span><span class="output-title">Cryptographic Output</span></div>'
      +'<div style="padding:16px 20px;border-bottom:1px solid var(--border)"><div class="form-label" style="margin-bottom:6px">Encrypted Text (Ciphertext)</div>'
      +'<div style="display:flex;align-items:flex-start;gap:8px"><div class="output-value" id="enc-output">'+ev+'</div>'
      +'<button class="copy-btn" onclick="App.copyText(document.getElementById(\'enc-output\').textContent)">&#128203; Copy</button></div></div>'
      +'<div style="padding:16px 20px"><div class="form-label" style="margin-bottom:6px">Decrypted Text (Roundtrip Verification)</div>'
      +'<div style="display:flex;align-items:flex-start;gap:8px"><div class="output-value green" id="dec-output">'+dv+'</div>'
      +'<button class="copy-btn" onclick="App.copyText(document.getElementById(\'dec-output\').textContent)">&#128203; Copy</button></div></div></div>'
      +(extra||'');
  },

  buildVizTabs(tabs) {
    const h = tabs.map((t,i) => '<button class="viz-tab '+(i===0?'active':'')+'" onclick="App.switchVizTab(this,\'viz-'+t.id+'\')">'+t.icon+' '+t.label+'</button>').join('');
    const b = tabs.map((t,i) => '<div class="viz-content '+(i===0?'active':'')+'" id="viz-'+t.id+'">'+t.content+'</div>').join('');
    return '<div class="card" style="padding:0;overflow:hidden"><div class="viz-tabs">'+h+'</div>'+b+'</div>';
  },

  switchVizTab(btn, id) {
    btn.closest('.card').querySelectorAll('.viz-tab').forEach(b => b.classList.remove('active'));
    btn.closest('.card').querySelectorAll('.viz-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(id).classList.add('active');
  },

  buildFreqViz(text) {
    const counts = {}; const t = (text||'').toUpperCase().replace(/[^A-Z]/g,'');
    for (const c of t) counts[c] = (counts[c]||0)+1;
    const total = t.length||1;
    const maxV = Math.max(...Object.values(counts), 1);
    let bars = '';
    for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      const h = Math.round(((counts[c]||0)/maxV)*60);
      bars += '<div class="freq-bar-wrap"><div class="freq-bar" style="height:'+h+'px" title="'+c+': '+((counts[c]||0)/total*100).toFixed(1)+'%"></div><div class="freq-bar-label">'+c+'</div></div>';
    }
    return '<div style="margin-bottom:8px;font-size:11px;color:var(--text-dim)">Character frequency distribution</div><div class="freq-chart">'+bars+'</div>';
  }
};

// =================== CAESAR ===================
App.renderCaesar = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Caesar Cipher','&#128257;','cyan','Monoalphabetic shift cipher — each letter shifted by fixed key k.','25 keys','c.100 BC')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#9881;</span><span class="card-title">Configuration &amp; Input</span></div>'
    + '<div class="form-row cols-1"><div><label class="form-label">Plaintext / Input Text</label>'
    + '<textarea class="form-textarea plaintext-input" id="c-plain" rows="3">Hello</textarea></div></div>'
    + '<div class="samples-row"><span class="samples-label">Samples:</span>'
    + '<span class="sample-chip" onclick="App.setSample(\'c-plain\',\'NETWORK SECURITY\')">NETWORK SECURITY</span>'
    + '<span class="sample-chip" onclick="App.setSample(\'c-plain\',\'ATTACK AT DAWN\')">ATTACK AT DAWN</span>'
    + '<span class="sample-chip" onclick="App.setSample(\'c-plain\',\'CLASSICAL CRYPTO\')">CLASSICAL CRYPTO</span></div>'
    + '<div class="form-row cols-1"><div><label class="form-label">Caesar Shift Key (0–25)</label>'
    + '<div class="slider-row"><input type="range" min="0" max="25" value="3" id="c-key" oninput="document.getElementById(\'c-disp\').textContent=this.value;App.updateSliderBg(this)">'
    + '<span class="slider-label" id="c-disp">3</span></div></div></div>'
    + '<div class="btn-row" style="margin-top:16px">'
    + '<button class="btn btn-encrypt" onclick="App.doCaesar()">&#128274; Encrypt Text</button>'
    + '<button class="btn btn-decrypt" onclick="App.doCaesarDec()">&#128275; Decrypt Text</button></div></div>'
    + '<div id="caesar-out">' + this.buildOutputSection('','','') + '</div>';
  this.updateSliderBg(document.getElementById('c-key'));
  this.doCaesar();
};

App.doCaesar = function() {
  const plain = (document.getElementById('c-plain')||{}).value||'Hello';
  const key = (document.getElementById('c-key')||{}).value||3;
  const {result:enc, time} = measureTime(() => Ciphers.caesar.encrypt(plain, key));
  this.executionTime = time;
  const dec = Ciphers.caesar.decrypt(enc, key);
  this._updateOutput('caesar-out', enc, dec, plain, key, 'caesar');
};

App.doCaesarDec = function() {
  const plain = (document.getElementById('c-plain')||{}).value||'Hello';
  const key = (document.getElementById('c-key')||{}).value||3;
  const dec = Ciphers.caesar.decrypt(plain, key);
  const enc = Ciphers.caesar.encrypt(dec, key);
  this._updateOutput('caesar-out', enc, dec, plain, key, 'caesar');
};

App._updateOutput = function(areaId, enc, dec, plain, key, type) {
  const area = document.getElementById(areaId);
  if (!area) return;
  let vizHtml = '';
  if (type === 'caesar') {
    const {plain:p, shifted:s} = Ciphers.caesar.getShiftWheel(key);
    const w = '<div style="margin-bottom:8px;font-size:11px;color:var(--text-dim)">Shift Wheel (k='+key+')</div>'
      + '<div class="shift-wheel"><table><tr><th>PLAIN</th>'
      + p.map(c=>'<td style="color:var(--text-secondary)">'+c+'</td>').join('')
      + '</tr><tr><th>SHIFT</th>'+s.map(c=>'<td>'+c+'</td>').join('')+'</tr></table></div>';
    const bk = Ciphers.caesar.breakdown(plain, key);
    const steps = '<div class="step-list">' + bk.map((st,i) => '<div class="step-item"><span class="step-num">'+(i+1)+'</span><span class="step-text">'+st+'</span></div>').join('') + '</div>';
    vizHtml = this.buildVizTabs([
      {id:'cv1', label:'Visualize', icon:'&#128064;', content: w},
      {id:'cv2', label:'Step Breakdown', icon:'&#128203;', content: steps},
      {id:'cv3', label:'Frequency', icon:'&#128202;', content: this.buildFreqViz(plain)}
    ]);
  } else if (type === 'vigenere') {
    const tbl = Ciphers.vigenere.getTable(plain, key);
    const th = '<table style="border-collapse:collapse;font-family:var(--font-mono);font-size:12px">'
      + '<tr style="background:rgba(56,189,248,0.08)"><th style="padding:6px 10px;border:1px solid var(--border);color:var(--text-dim)">PLAIN</th><th style="padding:6px 10px;border:1px solid var(--border);color:var(--text-dim)">KEY</th><th style="padding:6px 10px;border:1px solid var(--border);color:var(--text-dim)">SHIFT</th><th style="padding:6px 10px;border:1px solid var(--border);color:var(--text-dim)">CIPHER</th></tr>'
      + tbl.map(r=>'<tr><td style="padding:5px 10px;border:1px solid var(--border)">'+r.plain+'</td><td style="padding:5px 10px;border:1px solid var(--border);color:var(--accent-purple)">'+r.key+'</td><td style="padding:5px 10px;border:1px solid var(--border);color:var(--accent-orange)">'+r.shift+'</td><td style="padding:5px 10px;border:1px solid var(--border);color:var(--accent-cyan);font-weight:700">'+r.cipher+'</td></tr>').join('')
      + '</table>';
    vizHtml = this.buildVizTabs([
      {id:'vv1', label:'Key Table', icon:'&#128203;', content: '<div style="overflow-x:auto">'+th+'</div>'},
      {id:'vv2', label:'Frequency', icon:'&#128202;', content: this.buildFreqViz(plain)}
    ]);
  }
  area.innerHTML = this.buildOutputSection(enc, dec, vizHtml);
  document.getElementById('enc-output').textContent = enc;
  document.getElementById('dec-output').textContent = dec;
};

// =================== MONOALPHABETIC ===================
App.renderMonoalphabetic = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Monoalphabetic Cipher','&#128290;','purple','Each letter mapped to a unique substitute via keyword-derived alphabet.','26! keys','Ancient')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#9881;</span><span class="card-title">Configuration &amp; Input</span></div>'
    + '<div class="form-row cols-2"><div><label class="form-label">Plaintext</label>'
    + '<textarea class="form-textarea plaintext-input" id="m-plain" rows="3">NETWORK SECURITY</textarea></div>'
    + '<div><label class="form-label">Keyword (substitution alphabet)</label>'
    + '<input class="form-input" id="m-key" value="SECURITY" /></div></div>'
    + '<div class="btn-row"><button class="btn btn-encrypt" onclick="App.doMono(\'enc\')">&#128274; Encrypt</button>'
    + '<button class="btn btn-decrypt" onclick="App.doMono(\'dec\')">&#128275; Decrypt</button>'
    + '<button class="btn btn-secondary" onclick="App.randMonoKey()">&#127922; Random Key</button></div></div>'
    + '<div id="mono-out">' + this.buildOutputSection('','','') + '</div>';
  this.doMono('enc');
};

App.doMono = function(mode) {
  const plain = (document.getElementById('m-plain')||{}).value||'NETWORK SECURITY';
  const key = (document.getElementById('m-key')||{}).value||'SECURITY';
  let enc, dec;
  if (mode === 'dec') {
    dec = Ciphers.monoalphabetic.decrypt(plain, key);
    enc = Ciphers.monoalphabetic.encrypt(dec, key);
  } else {
    enc = Ciphers.monoalphabetic.encrypt(plain, key);
    dec = Ciphers.monoalphabetic.decrypt(enc, key);
  }
  const tbl = Ciphers.monoalphabetic.getTable(key);
  const th = '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-family:var(--font-mono);font-size:12px">'
    + '<tr style="color:var(--text-dim)">'+tbl.plain.map(c=>'<th style="padding:4px 8px;border:1px solid var(--border)">'+c+'</th>').join('')+'</tr>'
    + '<tr>'+tbl.cipher.map(c=>'<td style="padding:4px 8px;border:1px solid var(--border);color:var(--accent-cyan);font-weight:700">'+c+'</td>').join('')+'</tr></table></div>';
  const area = document.getElementById('mono-out');
  const vizHtml = this.buildVizTabs([
    {id:'mv1', label:'Substitution Table', icon:'&#128203;', content: th},
    {id:'mv2', label:'Frequency', icon:'&#128202;', content: this.buildFreqViz(plain)}
  ]);
  area.innerHTML = this.buildOutputSection(enc, dec, vizHtml);
  document.getElementById('enc-output').textContent = enc;
  document.getElementById('dec-output').textContent = dec;
};

App.randMonoKey = function() {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').sort(()=>Math.random()-0.5).join('');
  const el = document.getElementById('m-key');
  if (el) { el.value = alpha.slice(0,8); this.doMono('enc'); }
};

// =================== PLAYFAIR ===================
App.renderPlayfair = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Playfair Cipher','&#128306;','cyan','Digraph substitution using a 5x5 key matrix. J treated as I.','25! keys','1854')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#9881;</span><span class="card-title">Configuration &amp; Input</span></div>'
    + '<div class="form-row cols-2"><div><label class="form-label">Plaintext</label>'
    + '<textarea class="form-textarea plaintext-input" id="pf-plain" rows="3">NETWORK SECURITY</textarea></div>'
    + '<div><label class="form-label">Keyword</label><input class="form-input" id="pf-key" value="PLAYFAIR" /></div></div>'
    + '<div class="btn-row"><button class="btn btn-encrypt" onclick="App.doPlayfair(\'enc\')">&#128274; Encrypt</button>'
    + '<button class="btn btn-decrypt" onclick="App.doPlayfair(\'dec\')">&#128275; Decrypt</button></div></div>'
    + '<div id="pf-out">' + this.buildOutputSection('','','') + '</div>';
  this.doPlayfair('enc');
};

App.doPlayfair = function(mode) {
  const plain = (document.getElementById('pf-plain')||{}).value||'NETWORK SECURITY';
  const key = (document.getElementById('pf-key')||{}).value||'PLAYFAIR';
  let enc, dec;
  try {
    if (mode === 'dec') { dec = Ciphers.playfair.decrypt(plain, key); enc = Ciphers.playfair.encrypt(dec, key); }
    else { enc = Ciphers.playfair.encrypt(plain, key); dec = Ciphers.playfair.decrypt(enc, key); }
  } catch(er) { this.showToast(er.message,'error'); return; }
  const mat = Ciphers.playfair.buildMatrixPublic(key);
  const mh = '<div style="display:flex;justify-content:center"><div style="display:flex;flex-direction:column;gap:3px">'
    + mat.map(row=>'<div style="display:flex;gap:3px">'+row.map(c=>'<div class="matrix-cell">'+c+'</div>').join('')+'</div>').join('')
    + '</div></div>';
  const vizHtml = this.buildVizTabs([
    {id:'pfv1', label:'5x5 Key Matrix', icon:'&#128200;', content: mh},
    {id:'pfv2', label:'Frequency', icon:'&#128202;', content: this.buildFreqViz(plain)}
  ]);
  const area = document.getElementById('pf-out');
  area.innerHTML = this.buildOutputSection(enc, dec, vizHtml);
  document.getElementById('enc-output').textContent = enc;
  document.getElementById('dec-output').textContent = dec;
};

// =================== HILL ===================
App.renderHill = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Hill Cipher (Matrix)','&#128290;','orange','Polygraphic cipher using linear algebra matrix multiplication mod 26.','Matrix keys','1929')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#9881;</span><span class="card-title">Configuration &amp; Input</span></div>'
    + '<div class="form-row cols-2"><div><label class="form-label">Plaintext</label>'
    + '<textarea class="form-textarea plaintext-input" id="h-plain" rows="3">NETWORK</textarea></div>'
    + '<div><label class="form-label">2x2 Key Matrix (a b c d)</label>'
    + '<input class="form-input" id="h-key" value="3 3 2 5" placeholder="e.g. 3 3 2 5" />'
    + '<div style="margin-top:6px;font-size:11px;color:var(--text-dim)">Default: 3 3 2 5 (invertible mod 26)</div></div></div>'
    + '<div class="btn-row"><button class="btn btn-encrypt" onclick="App.doHill(\'enc\')">&#128274; Encrypt</button>'
    + '<button class="btn btn-decrypt" onclick="App.doHill(\'dec\')">&#128275; Decrypt</button></div></div>'
    + '<div id="h-out">' + this.buildOutputSection('','','') + '</div>';
  this.doHill('enc');
};

App.doHill = function(mode) {
  const plain = (document.getElementById('h-plain')||{}).value||'NETWORK';
  const key = (document.getElementById('h-key')||{}).value||'3 3 2 5';
  let enc, dec;
  try {
    if (mode === 'dec') { dec = Ciphers.hill.decrypt(plain, key); enc = Ciphers.hill.encrypt(dec, key); }
    else { enc = Ciphers.hill.encrypt(plain, key); dec = Ciphers.hill.decrypt(enc, key); }
  } catch(er) { this.showToast('Error: ' + er.message, 'error'); return; }
  const mat = Ciphers.hill.parseKey(key);
  const mh = '<div style="display:flex;justify-content:center"><div style="display:flex;flex-direction:column;gap:3px">'
    + mat.map(row=>'<div style="display:flex;gap:3px">'+row.map(v=>'<div class="matrix-cell highlighted">'+v+'</div>').join('')+'</div>').join('')
    + '</div></div>';
  const vizHtml = this.buildVizTabs([
    {id:'hv1', label:'Key Matrix', icon:'&#128200;', content: mh},
    {id:'hv2', label:'Frequency', icon:'&#128202;', content: this.buildFreqViz(plain)}
  ]);
  const area = document.getElementById('h-out');
  area.innerHTML = this.buildOutputSection(enc, dec, vizHtml);
  document.getElementById('enc-output').textContent = enc;
  document.getElementById('dec-output').textContent = dec;
};

// =================== VIGENERE ===================
App.renderVigenere = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Vigenere Cipher','&#128065;','purple','Polyalphabetic cipher using a repeating keyword to shift characters.','26^n keys','1553')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#9881;</span><span class="card-title">Configuration &amp; Input</span></div>'
    + '<div class="form-row cols-2"><div><label class="form-label">Plaintext</label>'
    + '<textarea class="form-textarea plaintext-input" id="v-plain" rows="3">NETWORK SECURITY</textarea></div>'
    + '<div><label class="form-label">Keyword</label>'
    + '<input class="form-input" id="v-key" value="KEY" />'
    + '<div class="samples-row" style="margin-top:8px"><span class="samples-label">Quick:</span>'
    + '<span class="sample-chip" onclick="document.getElementById(\'v-key\').value=\'KEY\';App.doVigenere(\'enc\')">KEY</span>'
    + '<span class="sample-chip" onclick="document.getElementById(\'v-key\').value=\'SECRET\';App.doVigenere(\'enc\')">SECRET</span>'
    + '<span class="sample-chip" onclick="document.getElementById(\'v-key\').value=\'CRYPTO\';App.doVigenere(\'enc\')">CRYPTO</span>'
    + '</div></div></div>'
    + '<div class="btn-row"><button class="btn btn-encrypt" onclick="App.doVigenere(\'enc\')">&#128274; Encrypt</button>'
    + '<button class="btn btn-decrypt" onclick="App.doVigenere(\'dec\')">&#128275; Decrypt</button></div></div>'
    + '<div id="v-out">' + this.buildOutputSection('','','') + '</div>';
  this.doVigenere('enc');
};

App.doVigenere = function(mode) {
  const plain = (document.getElementById('v-plain')||{}).value||'NETWORK SECURITY';
  const key = (document.getElementById('v-key')||{}).value||'KEY';
  let enc, dec;
  if (mode === 'dec') { dec = Ciphers.vigenere.decrypt(plain,key); enc = Ciphers.vigenere.encrypt(dec,key); }
  else { enc = Ciphers.vigenere.encrypt(plain,key); dec = Ciphers.vigenere.decrypt(enc,key); }
  this._updateOutput('v-out', enc, dec, plain, key, 'vigenere');
};

// =================== OTP ===================
App.renderOtp = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('One-Time Pad (Vernam)','&#128273;','green','Theoretically unbreakable — key must be random, same length as plaintext.','&#8734; keys','1917')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#9881;</span><span class="card-title">Configuration &amp; Input</span></div>'
    + '<div class="form-row cols-1"><div><label class="form-label">Plaintext</label>'
    + '<textarea class="form-textarea plaintext-input" id="o-plain" rows="2">NETWORK SECURITY</textarea></div></div>'
    + '<div class="form-row cols-1"><div><label class="form-label">One-Time Key (length &ge; plaintext)</label>'
    + '<div style="display:flex;gap:8px"><input class="form-input" id="o-key" placeholder="Generate or enter key..." />'
    + '<button class="btn btn-action" style="flex:0;min-width:130px" onclick="App.genOtpKey()">&#127922; Generate Key</button></div>'
    + '<div id="o-hint" style="margin-top:6px;font-size:11px;color:var(--text-dim)">Generate a random key matching plaintext length.</div></div></div>'
    + '<div class="btn-row"><button class="btn btn-encrypt" onclick="App.doOtp(\'enc\')">&#128274; Encrypt</button>'
    + '<button class="btn btn-decrypt" onclick="App.doOtp(\'dec\')">&#128275; Decrypt</button></div></div>'
    + '<div id="o-out">' + this.buildOutputSection('','','') + '</div>';
};

App.genOtpKey = function() {
  const t = (document.getElementById('o-plain')||{}).value||'';
  const len = t.toUpperCase().replace(/[^A-Z]/g,'').length || 16;
  const k = Ciphers.otp.generateKey(len);
  const el = document.getElementById('o-key');
  if (el) el.value = k;
  const hint = document.getElementById('o-hint');
  if (hint) { hint.textContent = 'Generated ' + len + '-char key: ' + k; hint.style.color = 'var(--accent-green)'; }
};

App.doOtp = function(mode) {
  const plain = (document.getElementById('o-plain')||{}).value||'';
  const key = (document.getElementById('o-key')||{}).value||'';
  let enc='', dec='';
  try {
    if (mode === 'dec') { dec = Ciphers.otp.decrypt(plain,key); enc = Ciphers.otp.encrypt(dec,key); }
    else { enc = Ciphers.otp.encrypt(plain,key); dec = Ciphers.otp.decrypt(enc,key); }
  } catch(er) { this.showToast(er.message,'error'); return; }
  const area = document.getElementById('o-out');
  area.innerHTML = this.buildOutputSection(enc, dec, '');
  document.getElementById('enc-output').textContent = enc;
  document.getElementById('dec-output').textContent = dec;
};

// =================== RAIL FENCE ===================
App.renderRailfence = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Rail Fence Cipher','&#127993;','cyan','Transposition cipher writing text in a zigzag pattern across N rails.','n-1 keys','Civil War')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#9881;</span><span class="card-title">Configuration &amp; Input</span></div>'
    + '<div class="form-row cols-2"><div><label class="form-label">Plaintext</label>'
    + '<textarea class="form-textarea plaintext-input" id="rf-plain" rows="3">NETWORK SECURITY</textarea></div>'
    + '<div><label class="form-label">Number of Rails (2-5)</label>'
    + '<div class="slider-row"><input type="range" min="2" max="5" value="3" id="rf-rails"'
    + ' oninput="document.getElementById(\'rf-disp\').textContent=this.value;App.updateSliderBg(this);App.doRailFence(\'enc\')">'
    + '<span class="slider-label" id="rf-disp">3</span></div>'
    + '<div style="margin-top:8px;font-size:11px;color:var(--text-dim)">More rails = more complex pattern</div></div></div>'
    + '<div class="btn-row"><button class="btn btn-encrypt" onclick="App.doRailFence(\'enc\')">&#128274; Encrypt</button>'
    + '<button class="btn btn-decrypt" onclick="App.doRailFence(\'dec\')">&#128275; Decrypt</button></div></div>'
    + '<div id="rf-out">' + this.buildOutputSection('','','') + '</div>';
  this.updateSliderBg(document.getElementById('rf-rails'));
  this.doRailFence('enc');
};

App.doRailFence = function(mode) {
  const plain = (document.getElementById('rf-plain')||{}).value||'NETWORK SECURITY';
  const rails = (document.getElementById('rf-rails')||{}).value||3;
  let enc, dec;
  if (mode === 'dec') { dec = Ciphers.railfence.decrypt(plain,rails); enc = Ciphers.railfence.encrypt(dec,rails); }
  else { enc = Ciphers.railfence.encrypt(plain,rails); dec = Ciphers.railfence.decrypt(enc,rails); }
  const grid = Ciphers.railfence.visualize(plain,rails);
  const colors = ['filled','filled-2','filled-3'];
  const gh = '<div class="rail-grid">'+grid.map((row,ri)=>'<div class="rail-row">'+row.map(c=>'<div class="rail-cell '+(c!==' '?colors[ri%3]:'')+'">'+(c===' '?'&middot;':c)+'</div>').join('')+'</div>').join('')+'</div>';
  const vizHtml = this.buildVizTabs([
    {id:'rfv1', label:'Rail Pattern', icon:'&#127993;', content: gh},
    {id:'rfv2', label:'Frequency', icon:'&#128202;', content: this.buildFreqViz(plain)}
  ]);
  const area = document.getElementById('rf-out');
  area.innerHTML = this.buildOutputSection(enc, dec, vizHtml);
  document.getElementById('enc-output').textContent = enc;
  document.getElementById('dec-output').textContent = dec;
};

// =================== COLUMNAR ===================
App.renderColumnar = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Columnar Transposition','&#9638;','orange','Rearranges characters by writing rows and reading columns in key-sorted order.','n! keys','WWI')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#9881;</span><span class="card-title">Configuration &amp; Input</span></div>'
    + '<div class="form-row cols-2"><div><label class="form-label">Plaintext</label>'
    + '<textarea class="form-textarea plaintext-input" id="col-plain" rows="3">NETWORK SECURITY</textarea></div>'
    + '<div><label class="form-label">Column Key (word)</label>'
    + '<input class="form-input" id="col-key" value="CIPHER" />'
    + '<div style="margin-top:6px;font-size:11px;color:var(--text-dim)">Columns read in alphabetical order of key letters</div></div></div>'
    + '<div class="btn-row"><button class="btn btn-encrypt" onclick="App.doColumnar(\'enc\')">&#128274; Encrypt</button>'
    + '<button class="btn btn-decrypt" onclick="App.doColumnar(\'dec\')">&#128275; Decrypt</button></div></div>'
    + '<div id="col-out">' + this.buildOutputSection('','','') + '</div>';
  this.doColumnar('enc');
};

App.doColumnar = function(mode) {
  const plain = (document.getElementById('col-plain')||{}).value||'NETWORK SECURITY';
  const key = (document.getElementById('col-key')||{}).value||'CIPHER';
  let enc, dec;
  if (mode === 'dec') { dec = Ciphers.columnar.decrypt(plain,key); enc = Ciphers.columnar.encrypt(dec,key); }
  else { enc = Ciphers.columnar.encrypt(plain,key); dec = Ciphers.columnar.decrypt(enc,key); }
  const {grid, key:keyArr} = Ciphers.columnar.getGrid(plain,key);
  const sorted = keyArr.map((c,i)=>[c,i]).sort((a,b)=>a[0].localeCompare(b[0])).map(x=>x[1]);
  const gh = '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-family:var(--font-mono);font-size:13px">'
    + '<tr>'+keyArr.map((c,i)=>'<th style="padding:8px 14px;border:1px solid var(--border);background:rgba(56,189,248,0.1);color:var(--accent-cyan)">'+c+'<br><span style="font-size:9px;color:var(--text-dim)">#'+(sorted.indexOf(i)+1)+'</span></th>').join('')+'</tr>'
    + grid.map(row=>'<tr>'+row.map(c=>'<td style="padding:6px 14px;border:1px solid var(--border);text-align:center;color:var(--text-secondary)">'+c+'</td>').join('')+'</tr>').join('')
    + '</table></div>';
  const vizHtml = this.buildVizTabs([
    {id:'colv1', label:'Column Grid', icon:'&#128200;', content: gh},
    {id:'colv2', label:'Frequency', icon:'&#128202;', content: this.buildFreqViz(plain)}
  ]);
  const area = document.getElementById('col-out');
  area.innerHTML = this.buildOutputSection(enc, dec, vizHtml);
  document.getElementById('enc-output').textContent = enc;
  document.getElementById('dec-output').textContent = dec;
};

// =================== COMPARE ===================
App.renderCompare = function() {
  const txt = 'NETWORKSECURITY';
  const ciphers = [
    {name:'Caesar Cipher', type:'Substitution', ks:'25 keys', sec:'low', yr:'c.100 BC', enc:()=>Ciphers.caesar.encrypt(txt,3)},
    {name:'Monoalphabetic', type:'Substitution', ks:'26! keys', sec:'medium', yr:'Ancient', enc:()=>Ciphers.monoalphabetic.encrypt(txt,'KEY')},
    {name:'Playfair Cipher', type:'Digraph Subst.', ks:'25! keys', sec:'medium', yr:'1854', enc:()=>Ciphers.playfair.encrypt(txt,'KEY')},
    {name:'Hill Cipher', type:'Polygraph Subst.', ks:'Matrix', sec:'medium', yr:'1929', enc:()=>Ciphers.hill.encrypt(txt,'3 3 2 5')},
    {name:'Vigenere Cipher', type:'Poly Subst.', ks:'26^n keys', sec:'high', yr:'1553', enc:()=>Ciphers.vigenere.encrypt(txt,'KEY')},
    {name:'One-Time Pad', type:'Substitution', ks:'&#8734;', sec:'very-high', yr:'1917', enc:()=>{try{const k=Ciphers.otp.generateKey(txt.length);return Ciphers.otp.encrypt(txt,k);}catch(e){return 'N/A';}}},
    {name:'Rail Fence', type:'Transposition', ks:'n-1 keys', sec:'low', yr:'Civil War', enc:()=>Ciphers.railfence.encrypt(txt,3)},
    {name:'Columnar Trans.', type:'Transposition', ks:'n! keys', sec:'medium', yr:'WWI', enc:()=>Ciphers.columnar.encrypt(txt,'KEY')}
  ];
  const sl = {low:'Low',medium:'Medium',high:'High','very-high':'Very High'};
  const rows = ciphers.map(c=>{
    let e='',t='';
    try{const r=measureTime(()=>c.enc());e=r.result;t=r.time+'ms';}catch(err){e='Error';t='N/A';}
    return '<tr><td>'+c.name+'</td><td style="color:var(--text-dim)">'+c.type+'</td><td style="font-family:var(--font-mono);font-size:11px">'+c.ks+'</td>'
      +'<td><span class="security-badge '+c.sec+'">'+sl[c.sec]+'</span></td>'
      +'<td style="font-family:var(--font-mono);font-size:11px">'+e.slice(0,12)+(e.length>12?'...':'')+'</td>'
      +'<td style="font-family:var(--font-mono);color:var(--accent-green)">'+t+'</td>'
      +'<td style="color:var(--text-dim)">'+c.yr+'</td></tr>';
  }).join('');
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Compare Algorithms','&#128200;','green','Side-by-side comparison of all classical cipher algorithms.','','All eras')
    + '<div class="card" style="padding:0;overflow:hidden">'
    + '<div style="padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px">'
    + '<span style="color:var(--accent-cyan)">&#128200;</span><span style="font-size:12px;font-weight:600">Algorithm Comparison Table</span>'
    + '<span style="margin-left:auto;font-size:11px;color:var(--text-dim)">Input: "'+txt+'"</span></div>'
    + '<div style="overflow-x:auto"><table class="compare-table"><thead><tr>'
    + '<th>Algorithm</th><th>Type</th><th>Key Space</th><th>Security</th><th>Sample Output</th><th>Exec Time</th><th>Origin</th>'
    + '</tr></thead><tbody>'+rows+'</tbody></table></div></div>';
};

// =================== ENCRYPT FILE ===================
App.renderEncryptFile = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Encrypt Text File','&#128196;','cyan','Load a .txt file and encrypt its contents using any cipher.','','')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#128196;</span><span class="card-title">File Encryption</span></div>'
    + '<div class="file-drop-zone" ondragover="event.preventDefault();this.classList.add(\'dragover\')" ondragleave="this.classList.remove(\'dragover\')">'
    + '<input type="file" accept=".txt" onchange="App.loadFile(event,\'enc\')">'
    + '<div class="file-drop-icon">&#128194;</div>'
    + '<div class="file-drop-text">Drop a .txt file here or click to browse</div>'
    + '<div class="file-drop-hint">Accepted: .txt files only</div></div>'
    + '<div id="ef-name" style="margin-top:8px;font-size:12px;color:var(--text-dim)"></div>'
    + '<div class="form-row cols-2" style="margin-top:14px">'
    + '<div><label class="form-label">Select Cipher</label>'
    + '<select class="form-select" id="ef-cipher"><option value="caesar">Caesar Cipher</option><option value="monoalphabetic">Monoalphabetic</option><option value="vigenere">Vigenere</option><option value="railfence">Rail Fence</option><option value="columnar">Columnar</option></select></div>'
    + '<div><label class="form-label">Key</label><input class="form-input" id="ef-key" value="3" /></div></div>'
    + '<div class="btn-row"><button class="btn btn-encrypt" onclick="App.doFileOp(\'enc\')">&#128274; Encrypt File</button></div></div>'
    + '<div id="ef-out" style="display:none"><div class="output-card">'
    + '<div class="output-header"><span class="output-dot"></span><span class="output-title">Encrypted Output</span>'
    + '<button class="copy-btn" onclick="App.copyText(document.getElementById(\'ef-res\').textContent)">&#128203; Copy</button>'
    + '<button class="copy-btn" onclick="App.download(\'ef-res\',\'encrypted.txt\')" style="margin-left:4px">&#8681; Download</button></div>'
    + '<div class="output-body"><div class="output-value" id="ef-res" style="font-size:13px;word-break:break-all"></div></div></div></div>';
};

App.loadFile = function(event, tag) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    window['_file_'+tag] = e.target.result;
    const el = document.getElementById(tag === 'enc' ? 'ef-name' : 'df-name');
    if (el) { el.textContent = file.name + ' (' + file.size + ' bytes)'; el.style.color = 'var(--accent-green)'; }
  };
  reader.readAsText(file);
};

App.doFileOp = function(mode) {
  const text = window['_file_'+mode] || '';
  if (!text) { this.showToast('Please select a file first','error'); return; }
  const cipherKey = mode === 'enc' ? 'ef-cipher' : 'df-cipher';
  const keyKey = mode === 'enc' ? 'ef-key' : 'df-key';
  const cipher = document.getElementById(cipherKey).value;
  const key = document.getElementById(keyKey).value || '3';
  let result = '';
  try {
    const map = {caesar: mode === 'enc' ? Ciphers.caesar.encrypt : Ciphers.caesar.decrypt,
      monoalphabetic: mode === 'enc' ? Ciphers.monoalphabetic.encrypt : Ciphers.monoalphabetic.decrypt,
      vigenere: mode === 'enc' ? Ciphers.vigenere.encrypt : Ciphers.vigenere.decrypt,
      railfence: mode === 'enc' ? Ciphers.railfence.encrypt : Ciphers.railfence.decrypt,
      columnar: mode === 'enc' ? Ciphers.columnar.encrypt : Ciphers.columnar.decrypt};
    result = map[cipher].call(Ciphers[cipher], text, key);
  } catch(er) { this.showToast(er.message,'error'); return; }
  const outId = mode === 'enc' ? 'ef' : 'df';
  document.getElementById(outId+'-res').textContent = result;
  document.getElementById(outId+'-out').style.display = 'block';
  this.showToast('File ' + (mode === 'enc' ? 'encrypted' : 'decrypted') + ' successfully!');
};

App.download = function(elemId, filename) {
  const text = document.getElementById(elemId).textContent;
  const blob = new Blob([text], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  URL.revokeObjectURL(a.href);
  this.showToast('Downloaded!');
};

// =================== DECRYPT FILE ===================
App.renderDecryptFile = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Decrypt Text File','&#128275;','green','Load an encrypted .txt file and decrypt using the correct cipher and key.','','')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#128196;</span><span class="card-title">File Decryption</span></div>'
    + '<div class="file-drop-zone" ondragover="event.preventDefault();this.classList.add(\'dragover\')" ondragleave="this.classList.remove(\'dragover\')">'
    + '<input type="file" accept=".txt" onchange="App.loadFile(event,\'dec\')">'
    + '<div class="file-drop-icon">&#128274;</div>'
    + '<div class="file-drop-text">Drop encrypted .txt file here or click</div>'
    + '<div class="file-drop-hint">Accepted: .txt files only</div></div>'
    + '<div id="df-name" style="margin-top:8px;font-size:12px;color:var(--text-dim)"></div>'
    + '<div class="form-row cols-2" style="margin-top:14px">'
    + '<div><label class="form-label">Cipher Used</label>'
    + '<select class="form-select" id="df-cipher"><option value="caesar">Caesar</option><option value="monoalphabetic">Monoalphabetic</option><option value="vigenere">Vigenere</option><option value="railfence">Rail Fence</option><option value="columnar">Columnar</option></select></div>'
    + '<div><label class="form-label">Key</label><input class="form-input" id="df-key" value="3" /></div></div>'
    + '<div class="btn-row"><button class="btn btn-decrypt" onclick="App.doFileOp(\'dec\')">&#128275; Decrypt File</button></div></div>'
    + '<div id="df-out" style="display:none"><div class="output-card">'
    + '<div class="output-header"><span class="output-dot"></span><span class="output-title">Decrypted Output</span>'
    + '<button class="copy-btn" onclick="App.copyText(document.getElementById(\'df-res\').textContent)">&#128203; Copy</button>'
    + '<button class="copy-btn" onclick="App.download(\'df-res\',\'decrypted.txt\')" style="margin-left:4px">&#8681; Download</button></div>'
    + '<div class="output-body"><div class="output-value green" id="df-res" style="font-size:13px;word-break:break-all"></div></div></div></div>';
};

// =================== HELP ===================
App.renderHelp = function() {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Help & Project Report','&#10067;','purple','Classical Cryptography Toolkit — Mini Project Documentation.','','')
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#128196;</span><span class="card-title">Project Information</span></div>'
    + '<div class="info-grid">'
    + '<div class="info-card"><div class="info-card-title">&#127919; Objective</div><div class="info-card-body">Design and develop a menu-driven software application that implements classical encryption algorithms for secure text encryption and decryption.</div></div>'
    + '<div class="info-card"><div class="info-card-title">&#127760; Problem Statement</div><div class="info-card-body">Develop a Cryptography Toolkit allowing users to encrypt/decrypt text using different classical algorithms with an interactive interface.</div></div>'
    + '<div class="info-card"><div class="info-card-title">&#128187; Course Details</div><div class="info-card-body"><strong>Course:</strong> Network Security<br><strong>Class:</strong> Final Year (ECM) 2026-27<br><strong>Project:</strong> Mini Project 1</div></div>'
    + '<div class="info-card"><div class="info-card-title">&#128295; Tech Stack</div><div class="info-card-body"><strong>Frontend:</strong> HTML5, CSS3, JavaScript (ES6+)<br><strong>Fonts:</strong> Inter, JetBrains Mono<br><strong>Backend:</strong> None — Pure Frontend</div></div>'
    + '</div></div>'
    + '<div class="card"><div class="card-header"><span class="card-icon-sm">&#128214;</span><span class="card-title">Cipher Quick Reference</span></div>'
    + '<table class="compare-table"><thead><tr><th>#</th><th>Cipher</th><th>Type</th><th>Key Format</th><th>Security</th></tr></thead><tbody>'
    + '<tr><td>01</td><td>Caesar</td><td>Substitution</td><td>Number 0-25</td><td><span class="security-badge low">Low</span></td></tr>'
    + '<tr><td>02</td><td>Monoalphabetic</td><td>Substitution</td><td>Keyword string</td><td><span class="security-badge medium">Medium</span></td></tr>'
    + '<tr><td>03</td><td>Playfair</td><td>Digraph Subst.</td><td>Keyword string</td><td><span class="security-badge medium">Medium</span></td></tr>'
    + '<tr><td>04</td><td>Hill Cipher</td><td>Polygraph Subst.</td><td>4 numbers (a b c d)</td><td><span class="security-badge medium">Medium</span></td></tr>'
    + '<tr><td>05</td><td>Vigenere</td><td>Polyalphabetic</td><td>Keyword string</td><td><span class="security-badge high">High</span></td></tr>'
    + '<tr><td>06</td><td>One-Time Pad</td><td>Substitution</td><td>Random key (same length)</td><td><span class="security-badge very-high">Very High</span></td></tr>'
    + '<tr><td>07</td><td>Rail Fence</td><td>Transposition</td><td>Number of rails (2-5)</td><td><span class="security-badge low">Low</span></td></tr>'
    + '<tr><td>08</td><td>Columnar Trans.</td><td>Transposition</td><td>Keyword string</td><td><span class="security-badge medium">Medium</span></td></tr>'
    + '</tbody></table></div>';
};

// =================== EXIT ===================
App.renderExit = function() {
  window._file_enc = ''; window._file_dec = '';
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader('Lock Toolkit','&#128274;','cyan','Secure session management — all data cleared.','','')
    + '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;text-align:center;gap:16px">'
    + '<div style="font-size:64px">&#128274;</div>'
    + '<div style="font-family:Rajdhani,sans-serif;font-size:28px;font-weight:700;color:var(--accent-cyan)">Session Locked</div>'
    + '<div style="font-size:14px;color:var(--text-secondary);max-width:400px;line-height:1.6">Your toolkit session has been locked. All sensitive data has been cleared from memory.</div>'
    + '<button class="btn btn-action" style="width:200px" onclick="App.unlock()">&#128275; Unlock Session</button></div>';
  this.showToast('Session locked. Data cleared.');
};

App.unlock = function() {
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelector('[data-cipher="caesar"]').classList.add('active');
  this.renderCaesar();
  this.showToast('Session unlocked!');
};

App.renderComingSoon = function(name) {
  document.getElementById('cipher-panel').innerHTML =
    this.buildPageHeader(name,'&#9881;','purple','','','')
    + '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;text-align:center;gap:16px">'
    + '<div style="font-size:56px">&#9881;</div>'
    + '<div style="font-family:Rajdhani,sans-serif;font-size:24px;color:var(--accent-purple)">Coming Soon</div>'
    + '<div style="font-size:13px;color:var(--text-secondary)">This module is under development.</div></div>';
};

// =================== BOOT ===================
document.addEventListener('DOMContentLoaded', () => App.init());

// =================== PATCH: expose parseKey for Hill ===================
Ciphers.hill.parseKey = Ciphers.hill.parseKey || function(key) {
  const nums = (key||'3 3 2 5').trim().split(/[\s,]+/).map(Number);
  if (nums.length < 4 || nums.some(isNaN)) return [[3,3],[2,5]];
  return [[nums[0],nums[1]],[nums[2],nums[3]]];
};

// =================== measureTime helper ===================
if (typeof measureTime === "undefined") {
  window.measureTime = function(fn) {
    const s = performance.now();
    const result = fn();
    return { result, time: (performance.now()-s).toFixed(2) };
  };
}
