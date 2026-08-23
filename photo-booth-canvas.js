    const video = document.getElementById('video');
    const placeholder = document.getElementById('placeholder');
    const deviceSelect = document.getElementById('deviceSelect');
    const startBtn = document.getElementById('startBtn');
    const captureBtn = document.getElementById('captureBtn');
    const status = document.getElementById('status');
    const flash = document.getElementById('flash');
    const countdownEl = document.getElementById('countdown');
    const canvas = document.getElementById('canvas');
    const stripWrap = document.getElementById('stripWrap');
    const strip = document.getElementById('strip');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const framePicker = document.getElementById('framePicker');
    const stickerGrid = document.getElementById('stickerGrid');
    const filterPicker = document.getElementById('filterPicker');
    const strapPicker = document.getElementById('strapPicker');
    const shapePicker = document.getElementById('shapePicker');
    const screen = document.getElementById('screen');

    const SHAPES = {
      potrait:   { ratio: 3/4, heart:false },
      landscape: { ratio: 4/3, heart:false },
      love:      { ratio: 1,   heart:true  }
    };
    let currentShape = 'potrait';

    function applyScreenShape(){
      const s = SHAPES[currentShape];
      screen.style.aspectRatio = String(s.ratio);
      screen.classList.toggle('heart-mask', s.heart);
    }
    applyScreenShape();

    shapePicker.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if(!btn) return;
      currentShape = btn.dataset.shape;
      shapePicker.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyScreenShape();
    });

    let currentStream = null;
    let currentCaption = '✿ cutie ✿';
    const SHOT_COUNT = 4;
    const STICKERS = ['🎀','✿','⭐️','💗','☁︎','✨','🍓','🧸','🦋','🌷','💌','🍒','🐰','🌈','😽','🍥'];
    let selectedSticker = null;
    let placedStickers = [];

    const FILTERS = [
      { name:'polos', css:'none', grad:'linear-gradient(135deg,#eee,#fafafa)' },
      { name:'y2k flash', css:'contrast(1.2) saturate(1.6) brightness(1.08)', grad:'linear-gradient(135deg,#FF9AD5,#8AD7FF)' },
      { name:'film vintage', css:'sepia(.3) contrast(1.05) saturate(1.15) brightness(1.05)', grad:'linear-gradient(135deg,#E8C58A,#B98A5B)' },
      { name:'soft dreamy', css:'brightness(1.1) contrast(.92) saturate(.85)', grad:'linear-gradient(135deg,#FBD5E0,#E3D9F5)' },
      { name:'vhs retro', css:'contrast(1.25) saturate(1.5) hue-rotate(-8deg)', grad:'linear-gradient(135deg,#FF6FA5,#5EE0E0)' },
      { name:'pink wash', css:'saturate(1.35) sepia(.18) hue-rotate(-12deg) brightness(1.06)', grad:'linear-gradient(135deg,#FFC1E0,#FFE29A)' },
      { name:'b&w film', css:'grayscale(1) contrast(1.1) brightness(1.03)', grad:'linear-gradient(135deg,#cfcfcf,#5a5a5a)' },
      { name:'chrome cool', css:'saturate(1.2) contrast(1.1) hue-rotate(15deg) brightness(1.05)', grad:'linear-gradient(135deg,#B9E3FF,#D8C7FF)' }
    ];
    let currentFilterIndex = 0;

    filterPicker.innerHTML = FILTERS.map((f, i) => `
      <button type="button" data-index="${i}" class="${i===0 ? 'active':''}">
        <span class="swatch" style="background-image:${f.grad}; filter:${f.css};"></span>
        <span class="flabel">${f.name}</span>
      </button>
    `).join('');

    filterPicker.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if(!btn) return;
      currentFilterIndex = parseInt(btn.dataset.index, 10);
      filterPicker.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      video.style.filter = FILTERS[currentFilterIndex].css;
    });

    const STRAPS = [
      {
        name:'chrome holo',
        css:'linear-gradient(135deg,#B9E3FF 0%,#E3D9F5 25%,#FFD6EE 50%,#FFF3CF 75%,#D3F3E4 100%)',
        text:'#5B4A8A', caption:'#8467C9',
        draw(ctx,x,y,w,h){
          const g = ctx.createLinearGradient(x,y,x+w,y+h);
          g.addColorStop(0,'#B9E3FF'); g.addColorStop(.25,'#E3D9F5');
          g.addColorStop(.5,'#FFD6EE'); g.addColorStop(.75,'#FFF3CF'); g.addColorStop(1,'#D3F3E4');
          ctx.fillStyle = g; ctx.fillRect(x,y,w,h);
        }
      },
      {
        name:'cyber stripes',
        css:'repeating-linear-gradient(45deg,#FF9AD5 0 14px,#8AD7FF 14px 28px)',
        text:'#5B2249', caption:'#7A2757',
        draw(ctx,x,y,w,h){
          ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
          ctx.fillStyle = '#8AD7FF'; ctx.fillRect(x,y,w,h);
          ctx.fillStyle = '#FF9AD5';
          const step = 20;
          for(let d = -h; d < w + h; d += step * 2){
            ctx.save();
            ctx.translate(x + d, y);
            ctx.rotate(Math.PI/4);
            ctx.fillRect(0, -h, step, h*3);
            ctx.restore();
          }
          ctx.restore();
        }
      },
      {
        name:'polka cream',
        css:'radial-gradient(circle,#F4A6C2 3px,transparent 4px) 0 0/22px 22px, #FFF9F2',
        text:'#8A6B1E', caption:'#C99A2E',
        draw(ctx,x,y,w,h){
          ctx.fillStyle = '#FFF9F2'; ctx.fillRect(x,y,w,h);
          ctx.fillStyle = '#F4A6C2';
          const gap = 24;
          for(let py = y + 12; py < y + h; py += gap){
            for(let px = x + 12; px < x + w; px += gap){
              ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
            }
          }
        }
      },
      {
        name:'gingham plaid',
        css:'repeating-linear-gradient(0deg,rgba(244,166,194,.55) 0 10px,transparent 10px 20px),repeating-linear-gradient(90deg,rgba(244,166,194,.55) 0 10px,transparent 10px 20px), #FFFDF8',
        text:'#7A3B54', caption:'#B9457B',
        draw(ctx,x,y,w,h){
          ctx.fillStyle = '#FFFDF8'; ctx.fillRect(x,y,w,h);
          ctx.fillStyle = 'rgba(244,166,194,.55)';
          const step = 20;
          for(let py = y; py < y + h; py += step*2) ctx.fillRect(x, py, w, step);
          for(let px = x; px < x + w; px += step*2) ctx.fillRect(px, y, step, h);
        }
      },
      {
        name:'star sparkle',
        css:'radial-gradient(circle at 20% 30%, #fff 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, #fff 0 2px, transparent 3px), radial-gradient(circle at 45% 85%, #fff 0 2px, transparent 3px), #C9B6F2',
        text:'#3B2A6B', caption:'#6A4FC9',
        draw(ctx,x,y,w,h){
          ctx.fillStyle = '#C9B6F2'; ctx.fillRect(x,y,w,h);
          ctx.fillStyle = '#ffffff';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          const seedPts = [[.15,.2],[.8,.15],[.5,.4],[.25,.7],[.7,.75],[.9,.5],[.1,.9],[.4,.85]];
          seedPts.forEach(([fx,fy]) => ctx.fillText('✦', x + fx*w, y + fy*h));
        }
      },
      {
        name:'flame y2k',
        css:'linear-gradient(135deg,#FF6F5E 0%,#FFA45E 35%,#FFD35E 70%,#FF6F5E 100%)',
        text:'#7A2E10', caption:'#B34618',
        draw(ctx,x,y,w,h){
          const g = ctx.createLinearGradient(x,y,x+w,y+h);
          g.addColorStop(0,'#FF6F5E'); g.addColorStop(.35,'#FFA45E');
          g.addColorStop(.7,'#FFD35E'); g.addColorStop(1,'#FF6F5E');
          ctx.fillStyle = g; ctx.fillRect(x,y,w,h);
        }
      },
      {
        name:'y2k chrome',
        css:'linear-gradient(160deg,#DCE7EF 0%,#F4F8FB 30%,#B9CBDA 55%,#F4F8FB 80%,#DCE7EF 100%)',
        text:'#3B5266', caption:'#5E85A3',
        draw(ctx,x,y,w,h){
          const g = ctx.createLinearGradient(x,y,x+w,y+h);
          g.addColorStop(0,'#DCE7EF'); g.addColorStop(.3,'#F4F8FB');
          g.addColorStop(.55,'#B9CBDA'); g.addColorStop(.8,'#F4F8FB'); g.addColorStop(1,'#DCE7EF');
          ctx.fillStyle = g; ctx.fillRect(x,y,w,h);
        }
      },
      {
        name:'hitam',
        css:'#2B2230',
        text:'#FBD5E0', caption:'#FF9AD5',
        draw(ctx,x,y,w,h){ ctx.fillStyle = '#2B2230'; ctx.fillRect(x,y,w,h); }
      }
    ];
    let currentStrapIndex = 0;

    strapPicker.innerHTML = STRAPS.map((s, i) => `
      <button type="button" data-index="${i}" class="${i===0 ? 'active':''}" style="background:${s.css};" title="${s.name}"></button>
    `).join('');

    strapPicker.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if(!btn) return;
      currentStrapIndex = parseInt(btn.dataset.index, 10);
      strapPicker.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyStrapStyle();
    });

    function applyStrapStyle(){
      const s = STRAPS[currentStrapIndex];
      strip.style.background = s.css;
      const captionEl = strip.querySelector('.caption');
      if(captionEl) captionEl.style.color = s.caption;
    }

    stickerGrid.innerHTML = STICKERS.map(s => `<button type="button" data-sticker="${s}">${s}</button>`).join('');

    stickerGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if(!btn) return;
      const s = btn.dataset.sticker;
      if(selectedSticker === s){
        selectedSticker = null;
        btn.classList.remove('picked');
      }else{
        stickerGrid.querySelectorAll('button').forEach(b => b.classList.remove('picked'));
        selectedSticker = s;
        btn.classList.add('picked');
      }
    });

    framePicker.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if(!btn) return;
      framePicker.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCaption = btn.dataset.caption;
    });

    async function listCameras(){
      try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(d => d.kind === 'videoinput');
        deviceSelect.innerHTML = '';
        if(cams.length === 0){
          const opt = document.createElement('option');
          opt.textContent = 'kamera belum kedeteksi';
          deviceSelect.appendChild(opt);
          return;
        }
        cams.forEach((cam, i) => {
          const opt = document.createElement('option');
          opt.value = cam.deviceId;
          opt.textContent = cam.label || `kamera ${i + 1}`;
          deviceSelect.appendChild(opt);
        });
      }catch(err){
        status.textContent = 'gagal baca daftar kamera :(';
      }
    }

    async function startCamera(deviceId){
      if(currentStream){
        currentStream.getTracks().forEach(t => t.stop());
      }
      status.textContent = 'lagi minta izin kamera...';
      try{
        const constraints = {
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
          audio: false
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = stream;
        video.srcObject = stream;
        video.style.display = 'block';
        placeholder.style.display = 'none';
        captureBtn.disabled = false;
        status.textContent = 'kamera nyala, siap jepret! ✨';
        await listCameras();
      }catch(err){
        status.textContent = 'gagal akses kamera: ' + err.message;
      }
    }

    startBtn.addEventListener('click', async () => {
      await startCamera(deviceSelect.value || undefined);
    });

    deviceSelect.addEventListener('change', () => {
      if(currentStream) startCamera(deviceSelect.value);
    });

    navigator.mediaDevices?.addEventListener?.('devicechange', listCameras);
    listCameras();

    function countdownThen(n, cb){
      countdownEl.textContent = n === 0 ? '📸' : n;
      countdownEl.classList.add('show');
      if(n === 0){
        setTimeout(() => {
          countdownEl.classList.remove('show');
          cb();
        }, 250);
        return;
      }
      setTimeout(() => countdownThen(n - 1, cb), 700);
    }

    function takeSnapshot(){
      const w = video.videoWidth, h = video.videoHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.filter = FILTERS[currentFilterIndex].css;
      ctx.drawImage(video, 0, 0, w, h);
      ctx.filter = 'none';
      flash.classList.remove('on');
      void flash.offsetWidth;
      flash.classList.add('on');
      return canvas.toDataURL('image/jpeg', 0.92);
    }

    captureBtn.addEventListener('click', () => {
      captureBtn.disabled = true;
      strip.innerHTML = '';
      stripWrap.style.display = 'none';
      const shots = [];

      function nextShot(i){
        if(i >= SHOT_COUNT){
          buildStrip(shots);
          captureBtn.disabled = false;
          return;
        }
        status.textContent = `jepretan ${i + 1} dari ${SHOT_COUNT}...`;
        countdownThen(3, () => {
          shots.push(takeSnapshot());
          setTimeout(() => nextShot(i + 1), 500);
        });
      }
      nextShot(0);
    });

    let builtShape = 'potrait';

    function buildStrip(shots){
      strip.innerHTML = '';
      placedStickers = shots.map(() => []);
      builtShape = currentShape;

      shots.forEach((dataUrl, frameIndex) => {
        const frame = document.createElement('div');
        frame.className = 'frame';
        frame.dataset.frameIndex = frameIndex;
        const shapeInfo = SHAPES[currentShape];
        frame.style.aspectRatio = String(shapeInfo.ratio);
        frame.classList.toggle('heart-mask', shapeInfo.heart);
        const img = document.createElement('img');
        img.src = dataUrl;
        frame.appendChild(img);

        frame.addEventListener('click', (e) => {
          if(e.target.classList.contains('sticker')) return;
          if(!selectedSticker) return;
          const rect = frame.getBoundingClientRect();
          const left = ((e.clientX - rect.left) / rect.width) * 100;
          const top = ((e.clientY - rect.top) / rect.height) * 100;
          addSticker(frame, frameIndex, selectedSticker, top, left);
        });

        strip.appendChild(frame);
      });

      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.textContent = currentCaption;
      strip.appendChild(caption);
      applyStrapStyle();
      stripWrap.style.display = 'flex';
      status.textContent = 'strip foto kamu siap, yuk tempel stiker! 🤍';
      stripWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function addSticker(frame, frameIndex, emoji, top, left){
      const sticker = document.createElement('span');
      sticker.className = 'sticker';
      sticker.textContent = emoji;
      sticker.style.top = top + '%';
      sticker.style.left = left + '%';
      sticker.title = 'tap buat hapus';
      sticker.addEventListener('click', (e) => {
        e.stopPropagation();
        sticker.remove();
        placedStickers[frameIndex] = placedStickers[frameIndex].filter(s => s.el !== sticker);
      });
      frame.appendChild(sticker);
      placedStickers[frameIndex].push({ el: sticker, emoji, top, left });
    }

    downloadBtn.addEventListener('click', () => {
      const frameEls = Array.from(strip.querySelectorAll('.frame'));
      if(frameEls.length === 0) return;

      const padding = 20;
      const gap = 14;
      const shapeInfo = SHAPES[builtShape];
      const frameW = 420;
      const frameH = Math.round(frameW / shapeInfo.ratio);
      const captionH = 60;
      const outW = frameW + padding * 2;
      const outH = padding + (frameH + gap) * frameEls.length + captionH;

      const outCanvas = document.createElement('canvas');
      outCanvas.width = outW;
      outCanvas.height = outH;
      const ctx = outCanvas.getContext('2d');
      const strap = STRAPS[currentStrapIndex];
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);
      strap.draw(ctx, 0, 0, outW, outH);

      function drawFrameImage(img, x, y, w, h){
        ctx.save();
        if(shapeInfo.heart){
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(w / 100, h / 100);
          ctx.beginPath();
          ctx.moveTo(50, 88);
          ctx.bezierCurveTo(10, 60, -6, 24, 20, 12);
          ctx.bezierCurveTo(38, 4, 50, 16, 50, 24);
          ctx.bezierCurveTo(50, 16, 62, 4, 80, 12);
          ctx.bezierCurveTo(106, 24, 90, 60, 50, 88);
          ctx.closePath();
          ctx.clip();
          ctx.restore();
        }else{
          const r = 16;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r);
          ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r);
          ctx.closePath();
          ctx.clip();
        }
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const boxRatio = w / h;
        let sx, sy, sw, sh;
        if(imgRatio > boxRatio){
          sh = img.naturalHeight;
          sw = sh * boxRatio;
          sx = (img.naturalWidth - sw) / 2;
          sy = 0;
        }else{
          sw = img.naturalWidth;
          sh = sw / boxRatio;
          sx = 0;
          sy = (img.naturalHeight - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
        ctx.restore();
      }

      let loaded = 0;
      const images = new Array(frameEls.length);

      frameEls.forEach((frameEl, i) => {
        const imgEl = frameEl.querySelector('img');
        const im = new Image();
        im.onload = () => {
          images[i] = im;
          loaded++;
          if(loaded === frameEls.length){
            images.forEach((image, idx) => {
              const y = padding + idx * (frameH + gap);
              drawFrameImage(image, padding, y, frameW, frameH);
              const stickers = placedStickers[idx] || [];
              ctx.font = '38px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              stickers.forEach(sd => {
                const sx = padding + (sd.left / 100) * frameW;
                const sy = y + (sd.top / 100) * frameH;
                ctx.fillText(sd.emoji, sx, sy);
              });
            });
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = strap.caption;
            ctx.font = '600 30px Quicksand, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(currentCaption, outW / 2, outH - 20);

            const link = document.createElement('a');
            link.download = 'bestie-booth-strip.jpg';
            link.href = outCanvas.toDataURL('image/jpeg', 0.95);
            link.click();
          }
        };
        im.src = imgEl.src;
      });
    });

    resetBtn.addEventListener('click', () => {
      strip.innerHTML = '';
      stripWrap.style.display = 'none';
      placedStickers = [];
      selectedSticker = null;
      stickerGrid.querySelectorAll('button').forEach(b => b.classList.remove('picked'));
      status.textContent = 'siap jepret lagi~';
    });
