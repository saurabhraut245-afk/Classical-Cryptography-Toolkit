// ================================================================
// CLASSICAL CRYPTOGRAPHY TOOLKIT - Cipher Implementations
// ================================================================

const Ciphers = {

  // ======================== CAESAR CIPHER ========================
  caesar: {
    encrypt(text, key) {
      const k = ((parseInt(key) % 26) + 26) % 26;
      return text.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode(((c.charCodeAt(0) - 65 + k) % 26) + 65));
    },
    decrypt(text, key) {
      const k = ((parseInt(key) % 26) + 26) % 26;
      return text.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode(((c.charCodeAt(0) - 65 - k + 26) % 26) + 65));
    },
    getShiftWheel(key) {
      const k = ((parseInt(key) % 26) + 26) % 26;
      const plain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const shifted = plain.map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + k) % 26) + 65));
      return { plain, shifted };
    },
    breakdown(text, key) {
      const k = ((parseInt(key) % 26) + 26) % 26;
      return text.toUpperCase().split('').filter(c => /[A-Z]/.test(c)).slice(0,6).map(c => {
        const pos = c.charCodeAt(0) - 65;
        const newPos = (pos + k) % 26;
        return `${c}(${pos}) + ${k} = ${newPos} -> ${String.fromCharCode(newPos + 65)}`;
      });
    }
  },

  // =================== MONOALPHABETIC CIPHER ====================
  monoalphabetic: {
    generateKey(seed) {
      // Generate substitution from keyword
      const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const keyword = (seed || 'SECURITY').toUpperCase().replace(/[^A-Z]/g,'');
      let keyAlpha = '';
      for (const c of keyword + alpha) {
        if (!keyAlpha.includes(c)) keyAlpha += c;
      }
      return keyAlpha;
    },
    encrypt(text, key) {
      const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const subKey = this.generateKey(key);
      return text.toUpperCase().replace(/[A-Z]/g, c => subKey[alpha.indexOf(c)]);
    },
    decrypt(text, key) {
      const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const subKey = this.generateKey(key);
      return text.toUpperCase().replace(/[A-Z]/g, c => {
        const idx = subKey.indexOf(c);
        return idx >= 0 ? alpha[idx] : c;
      });
    },
    getTable(key) {
      const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return { plain: alpha.split(''), cipher: this.generateKey(key).split('') };
    }
  },

  // ===================== PLAYFAIR CIPHER ========================
  playfair: {
    buildMatrix(key) {
      const alpha = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // no J
      const k = (key || 'KEY').toUpperCase().replace(/J/g,'I').replace(/[^A-Z]/g,'');
      let used = '';
      for (const c of k + alpha) {
        if (!used.includes(c)) used += c;
      }
      const matrix = [];
      for (let i = 0; i < 5; i++) matrix.push(used.slice(i*5, i*5+5).split(''));
      return matrix;
    },
    findPos(matrix, c) {
      for (let r = 0; r < 5; r++)
        for (let col = 0; col < 5; col++)
          if (matrix[r][col] === c) return [r, col];
      return [-1,-1];
    },
    prepareText(text) {
      let t = text.toUpperCase().replace(/J/g,'I').replace(/[^A-Z]/g,'');
      let result = '';
      let i = 0;
      while (i < t.length) {
        result += t[i];
        if (i+1 < t.length) {
          if (t[i] === t[i+1]) { result += 'X'; }
          else { result += t[i+1]; i++; }
        }
        i++;
      }
      if (result.length % 2 !== 0) result += 'X';
      return result;
    },
    process(text, key, mode) {
      const matrix = this.buildMatrix(key);
      const prepared = this.prepareText(text);
      let result = '';
      for (let i = 0; i < prepared.length; i += 2) {
        const a = prepared[i], b = prepared[i+1];
        const [r1,c1] = this.findPos(matrix, a);
        const [r2,c2] = this.findPos(matrix, b);
        const d = mode === 'encrypt' ? 1 : -1;
        if (r1 === r2) {
          result += matrix[r1][(c1+d+5)%5] + matrix[r2][(c2+d+5)%5];
        } else if (c1 === c2) {
          result += matrix[(r1+d+5)%5][c1] + matrix[(r2+d+5)%5][c2];
        } else {
          result += matrix[r1][c2] + matrix[r2][c1];
        }
      }
      return result;
    },
    encrypt(text, key) { return this.process(text, key, 'encrypt'); },
    decrypt(text, key) { return this.process(text, key, 'decrypt'); },
    buildMatrixPublic(key) { return this.buildMatrix(key); }
  },

  // ======================= HILL CIPHER =========================
  hill: {
    mod26(n) { return ((n % 26) + 26) % 26; },
    det2(m) { return this.mod26(m[0][0]*m[1][1] - m[0][1]*m[1][0]); },
    modInverse(a, m) {
      a = ((a % m) + m) % m;
      for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
      return -1;
    },
    inverse2x2(m) {
      const det = (m[0][0]*m[1][1] - m[0][1]*m[1][0]);
      const detMod = ((det % 26) + 26) % 26;
      const detInv = this.modInverse(detMod, 26);
      if (detInv === -1) throw new Error('Matrix not invertible mod 26');
      return [
        [this.mod26(detInv * m[1][1]), this.mod26(-detInv * m[0][1])],
        [this.mod26(-detInv * m[1][0]), this.mod26(detInv * m[0][0])]
      ];
    },
    parseKey(key) {
      const nums = key.trim().split(/[\s,]+/).map(Number);
      if (nums.length < 4 || nums.some(isNaN)) return [[3,3],[2,5]]; // default
      return [[nums[0],nums[1]],[nums[2],nums[3]]];
    },
    process(text, key, mode) {
      const t = text.toUpperCase().replace(/[^A-Z]/g,'');
      const padded = t.length % 2 === 0 ? t : t + 'X';
      const keyMat = this.parseKey(key);
      const mat = mode === 'encrypt' ? keyMat : this.inverse2x2(keyMat);
      let result = '';
      for (let i = 0; i < padded.length; i += 2) {
        const v0 = padded.charCodeAt(i) - 65;
        const v1 = padded.charCodeAt(i+1) - 65;
        const r0 = this.mod26(mat[0][0]*v0 + mat[0][1]*v1);
        const r1 = this.mod26(mat[1][0]*v0 + mat[1][1]*v1);
        result += String.fromCharCode(r0+65) + String.fromCharCode(r1+65);
      }
      return result;
    },
    encrypt(text, key) { return this.process(text, key, 'encrypt'); },
    decrypt(text, key) { return this.process(text, key, 'decrypt'); }
  },

  // ===================== VIGENERE CIPHER =======================
  vigenere: {
    process(text, key, mode) {
      const k = (key || 'KEY').toUpperCase().replace(/[^A-Z]/g,'') || 'KEY';
      const t = text.toUpperCase();
      let result = ''; let ki = 0;
      for (const c of t) {
        if (/[A-Z]/.test(c)) {
          const shift = k.charCodeAt(ki % k.length) - 65;
          const pos = c.charCodeAt(0) - 65;
          const newPos = mode === 'encrypt' ? (pos + shift) % 26 : ((pos - shift + 26) % 26);
          result += String.fromCharCode(newPos + 65);
          ki++;
        } else {
          result += c;
        }
      }
      return result;
    },
    encrypt(text, key) { return this.process(text, key, 'encrypt'); },
    decrypt(text, key) { return this.process(text, key, 'decrypt'); },
    getTable(key) {
      const k = (key || 'KEY').toUpperCase().replace(/[^A-Z]/g,'') || 'KEY';
      const plainChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      return plainChars.map((c,i) => ({
        plain: c,
        key: k[i % k.length],
        shift: k.charCodeAt(i % k.length) - 65,
        cipher: String.fromCharCode((c.charCodeAt(0)-65 + (k.charCodeAt(i % k.length)-65)) % 26 + 65)
      })).slice(0, k.length);
    }
  },

  // =================== ONE-TIME PAD (VERNAM) ===================
  otp: {
    generateKey(length) {
      return Array.from({length}, () => String.fromCharCode(65 + Math.floor(Math.random()*26))).join('');
    },
    process(text, key, mode) {
      const t = text.toUpperCase().replace(/[^A-Z]/g,'');
      const k = (key||'').toUpperCase().replace(/[^A-Z]/g,'');
      if (k.length < t.length) throw new Error(`Key too short! Need ${t.length} chars, got ${k.length}.`);
      let result = '';
      for (let i = 0; i < t.length; i++) {
        const tp = t.charCodeAt(i)-65, kp = k.charCodeAt(i)-65;
        const np = mode === 'encrypt' ? (tp+kp)%26 : ((tp-kp+26)%26);
        result += String.fromCharCode(np+65);
      }
      return result;
    },
    encrypt(text, key) { return this.process(text, key, 'encrypt'); },
    decrypt(text, key) { return this.process(text, key, 'decrypt'); }
  },

  // ==================== RAIL FENCE CIPHER ======================
  railfence: {
    encrypt(text, rails) {
      const r = Math.max(2, parseInt(rails) || 3);
      const t = text.toUpperCase().replace(/[^A-Z]/g,'');
      if (t.length === 0) return '';
      const fence = Array.from({length:r}, () => []);
      let rail = 0, dir = 1;
      for (const c of t) {
        fence[rail].push(c);
        if (rail === 0) dir = 1;
        else if (rail === r-1) dir = -1;
        rail += dir;
      }
      return fence.flat().join('');
    },
    decrypt(text, rails) {
      const r = Math.max(2, parseInt(rails) || 3);
      const t = text.toUpperCase().replace(/[^A-Z]/g,'');
      if (t.length === 0) return '';
      const pattern = Array(t.length);
      let rail = 0, dir = 1;
      for (let i = 0; i < t.length; i++) {
        pattern[i] = rail;
        if (rail === 0) dir = 1;
        else if (rail === r-1) dir = -1;
        rail += dir;
      }
      const railCounts = Array(r).fill(0);
      pattern.forEach(r => railCounts[r]++);
      const rails2 = [];
      let idx = 0;
      for (let i = 0; i < r; i++) {
        rails2.push(t.slice(idx, idx+railCounts[i]).split(''));
        idx += railCounts[i];
      }
      const railIdx = Array(r).fill(0);
      let result = '';
      for (const rn of pattern) {
        result += rails2[rn][railIdx[rn]++];
      }
      return result;
    },
    visualize(text, rails) {
      const r = Math.max(2, Math.min(parseInt(rails)||3, 5));
      const t = text.toUpperCase().replace(/[^A-Z ]/g,'');
      const grid = Array.from({length:r}, () => Array(t.length).fill(' '));
      let rail = 0, dir = 1;
      for (let i = 0; i < t.length; i++) {
        grid[rail][i] = t[i];
        if (rail === 0) dir = 1;
        else if (rail === r-1) dir = -1;
        rail += dir;
      }
      return grid;
    }
  },

  // ================ COLUMNAR TRANSPOSITION ======================
  columnar: {
    encrypt(text, key) {
      const t = text.toUpperCase().replace(/[^A-Z]/g,'');
      const k = (key||'KEY').toUpperCase().replace(/[^A-Z]/g,'') || 'KEY';
      const cols = k.length;
      const rows = Math.ceil(t.length / cols);
      const padded = t.padEnd(rows * cols, 'X');
      const order = k.split('').map((c,i) => [c,i]).sort((a,b) => a[0].localeCompare(b[0])).map(x=>x[1]);
      let result = '';
      for (const col of order) {
        for (let row = 0; row < rows; row++) result += padded[row*cols+col];
      }
      return result;
    },
    decrypt(text, key) {
      const t = text.toUpperCase().replace(/[^A-Z]/g,'');
      const k = (key||'KEY').toUpperCase().replace(/[^A-Z]/g,'') || 'KEY';
      const cols = k.length;
      const rows = Math.ceil(t.length / cols);
      const order = k.split('').map((c,i) => [c,i]).sort((a,b) => a[0].localeCompare(b[0])).map(x=>x[1]);
      const grid = Array.from({length:rows}, () => Array(cols).fill(''));
      let idx = 0;
      for (const col of order) {
        for (let row = 0; row < rows; row++) { grid[row][col] = t[idx++] || 'X'; }
      }
      return grid.map(r => r.join('')).join('');
    },
    getGrid(text, key) {
      const t = text.toUpperCase().replace(/[^A-Z]/g,'');
      const k = (key||'KEY').toUpperCase().replace(/[^A-Z]/g,'') || 'KEY';
      const cols = k.length;
      const rows = Math.ceil(t.length / cols);
      const padded = t.padEnd(rows*cols,'X');
      const grid = [];
      for (let r = 0; r < rows; r++) {
        grid.push(padded.slice(r*cols, (r+1)*cols).split(''));
      }
      return { grid, key: k.split(''), order: k.split('').map((c,i) => [c,i]).sort((a,b)=>a[0].localeCompare(b[0])).map(x=>x[1]) };
    }
  }
};

// Frequency analysis helper
function getFrequency(text) {
  const counts = {};
  const t = text.toUpperCase().replace(/[^A-Z]/g,'');
  for (const c of t) counts[c] = (counts[c]||0)+1;
  const total = t.length || 1;
  const result = {};
  for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') result[c] = (counts[c]||0)/total;
  return result;
}

// Execution time helper
function measureTime(fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, time: (end - start).toFixed(2) };
}
