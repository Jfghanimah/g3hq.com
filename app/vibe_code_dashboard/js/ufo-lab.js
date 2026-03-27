// ══════════════════════════════════════════════
// SURVEILLANCE CAM — fake night-vision canvas
// ══════════════════════════════════════════════

(function() {
  const canvas = document.getElementById('ufo-cam');
  const ctx = canvas.getContext('2d');

  const W = () => canvas.width;
  const H = () => canvas.height;

  function resize() {
    canvas.width  = canvas.offsetWidth  || 320;
    canvas.height = canvas.offsetHeight || 180;
  }
  resize();
  window.addEventListener('resize', resize);

  // Targets — slow-moving blobs with crosshairs
  const TARGETS = [
    { x: 0.28, y: 0.55, vx: 0.00012, vy: 0.00005, label: 'TGT-01', threat: 'HIGH' },
    { x: 0.62, y: 0.38, vx:-0.00008, vy: 0.00011, label: 'TGT-02', threat: 'MED'  },
    { x: 0.80, y: 0.70, vx:-0.00006, vy:-0.00009, label: 'UNKN',   threat: '???'  },
  ];

  let frame = 0;
  let staticFrames = 0;
  let signalLost = false;
  let signalLostTimer = 0;

  // Trigger static/signal-lost occasionally
  function maybeGlitch() {
    if (Math.random() < 0.0008) {
      staticFrames = randi(4, 14);
    }
    if (Math.random() < 0.0003) {
      signalLost = true;
      signalLostTimer = randi(60, 140);
    }
  }

  function drawNoise(alpha) {
    const imgData = ctx.createImageData(W(), H());
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255 | 0;
      d[i]   = 0;
      d[i+1] = v;
      d[i+2] = 0;
      d[i+3] = (alpha * 255) | 0;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function drawGrain() {
    const imgData = ctx.createImageData(W(), H());
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 40) | 0;
      d[i]   = 0;
      d[i+1] = v;
      d[i+2] = 0;
      d[i+3] = 60;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function drawScanlines() {
    ctx.save();
    for (let y = 0; y < H(); y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, y, W(), 1);
    }
    ctx.restore();
  }

  function drawVignette() {
    const g = ctx.createRadialGradient(W()/2, H()/2, H()*0.2, W()/2, H()/2, H()*0.85);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.72)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W(), H());
  }

  function drawBackdrop() {
    const horizonY = H() * 0.62;

    const sky = ctx.createLinearGradient(0, 0, 0, H());
    sky.addColorStop(0, '#021806');
    sky.addColorStop(0.58, '#04240b');
    sky.addColorStop(1, '#010603');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W(), H());

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#00ff41';
    for(let i = 0; i < 6; i++) {
      const y = horizonY - i * 14;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W(), y + Math.sin((frame * 0.01) + i) * 4);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#010402';
    ctx.beginPath();
    ctx.moveTo(0, H());
    ctx.lineTo(0, horizonY + 10);
    for(let x = 0; x <= W(); x += 24) {
      const ridge = horizonY + Math.sin((x * 0.018) + frame * 0.005) * 8 + Math.cos((x * 0.042) - frame * 0.004) * 5;
      ctx.lineTo(x, ridge);
    }
    ctx.lineTo(W(), H());
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(0,255,65,0.09)';
    ctx.lineWidth = 1;
    for(let x = 0; x <= W(); x += Math.max(18, W() / 18)) {
      ctx.beginPath();
      ctx.moveTo(x, horizonY + 18);
      ctx.lineTo(W() / 2, H());
      ctx.stroke();
    }
    for(let y = horizonY + 18; y < H(); y += Math.max(16, H() / 12)) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W(), y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCrosshair(x, y, size, label, threat, blink) {
    if (blink && frame % 30 < 15) return;
    const glow = threat === 'HIGH' ? '#ff4400' : threat === 'MED' ? '#ffaa00' : '#00ff41';
    ctx.save();
    ctx.strokeStyle = glow;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.85;
    // Corner brackets
    const b = size * 0.5, s = size * 0.22;
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy]) => {
      ctx.beginPath();
      ctx.moveTo(x + sx*b, y + sy*(b - s));
      ctx.lineTo(x + sx*b, y + sy*b);
      ctx.lineTo(x + (sx*(b - s)), y + sy*b);
      ctx.stroke();
    });
    // Center dot
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI*2);
    ctx.fillStyle = glow;
    ctx.fill();
    // Label
    ctx.font = `bold ${Math.max(9, W()*0.025)}px monospace`;
    ctx.fillStyle = glow;
    ctx.globalAlpha = 0.9;
    ctx.fillText(label, x + b + 4, y - b + 10);
    ctx.font = `${Math.max(8, W()*0.02)}px monospace`;
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.fillText(threat, x + b + 4, y - b + 22);
    ctx.restore();
  }

  function drawHUD() {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}Z`;
    const lat = (38.9 + Math.sin(frame * 0.0003) * 0.004).toFixed(4);
    const lon = (-77.0 + Math.cos(frame * 0.0002) * 0.003).toFixed(4);
    const alt = (1240 + Math.sin(frame * 0.001) * 18).toFixed(0);
    const fs  = Math.max(9, W() * 0.028);

    ctx.save();
    ctx.font = `${fs}px monospace`;
    ctx.globalAlpha = 0.85;

    // Top-left: cam ID + timestamp
    ctx.fillStyle = '#00ff41';
    ctx.fillText('CAM-7 :: SECTOR 7 SURVEILLANCE', 10, fs + 6);
    ctx.fillStyle = '#aaffaa';
    ctx.fillText(ts, 10, fs * 2 + 8);

    // Top-right: REC blink
    if (frame % 60 < 40) {
      ctx.fillStyle = '#ff2200';
      ctx.fillText('● REC', W() - 60, fs + 6);
    }

    // Bottom-left: coords
    ctx.fillStyle = '#00ff41';
    ctx.globalAlpha = 0.7;
    ctx.fillText(`LAT ${lat}  LON ${lon}  ALT ${alt}m`, 10, H() - 10);

    // Bottom-right: classification
    ctx.fillStyle = '#ff4400';
    ctx.globalAlpha = 0.8;
    ctx.textAlign = 'right';
    ctx.fillText('// CLASSIFIED //', W() - 10, H() - 10);

    // Targets count
    ctx.fillStyle = '#ffaa00';
    ctx.textAlign = 'left';
    ctx.fillText(`CONTACTS: ${TARGETS.length}`, W() - 120, fs * 2 + 8);

    ctx.restore();
  }

  function drawSignalLost() {
    // Full static burst
    drawNoise(0.9);
    ctx.save();
    ctx.fillStyle = '#00ff41';
    ctx.font = `bold ${W() * 0.07}px monospace`;
    ctx.textAlign = 'center';
    ctx.globalAlpha = frame % 10 < 5 ? 0.95 : 0.3;
    ctx.fillText('SIGNAL LOST', W()/2, H()/2);
    ctx.font = `${W() * 0.035}px monospace`;
    ctx.globalAlpha = 0.6;
    ctx.fillText('ATTEMPTING RECONNECT...', W()/2, H()/2 + W()*0.05);
    ctx.restore();
  }

  function tick() {
    frame++;
    maybeGlitch();

    // Signal-lost mode
    if (signalLost) {
      signalLostTimer--;
      if (signalLostTimer <= 0) signalLost = false;
      drawSignalLost();
      requestAnimationFrame(tick);
      return;
    }

    // Static burst
    if (staticFrames > 0) {
      staticFrames--;
      drawNoise(1.0);
      requestAnimationFrame(tick);
      return;
    }

    drawBackdrop();

    // Film grain
    drawGrain();

    // Move + draw targets
    TARGETS.forEach(t => {
      t.x += t.vx;
      t.y += t.vy;
      if (t.x < 0.05 || t.x > 0.92) t.vx *= -1;
      if (t.y < 0.08 || t.y > 0.88) t.vy *= -1;
      const sz = Math.max(24, W() * 0.08);
      drawCrosshair(t.x * W(), t.y * H(), sz, t.label, t.threat, t.threat === 'HIGH');
    });

    drawScanlines();
    drawVignette();
    drawHUD();

    requestAnimationFrame(tick);
  }

  tick();
})();
