/* ===== NEXUSFLOW — MAIN JAVASCRIPT ===== */

// ── Network Canvas Background ──────────────────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let nodes = [];
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildNodes(); });

  function buildNodes() {
    nodes = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        color: Math.random() > 0.8 ? '#00ff88' : Math.random() > 0.5 ? '#00d4ff' : '#ffffff'
      });
    }
  }
  buildNodes();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,255,136,${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    // draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color.replace(')', `,0.6)`).replace('rgb', 'rgba').replace('##', 'rgba(');
      if (n.color.startsWith('#')) {
        ctx.fillStyle = hexToRgba(n.color, 0.6);
      }
      ctx.fill();
    });
    // move
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();

  function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
})();


// ── Animated Counter ───────────────────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = isDecimal
        ? (eased * target).toFixed(1)
        : Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// Trigger on scroll into view
const heroObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { animateCounters(); heroObs.disconnect(); }
}, { threshold: 0.3 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObs.observe(heroStats);


// ── Live Disruption Alerts Feed ────────────────────────────────────────────
const ALERTS = [
  { type: 'critical', icon: '🔴', title: 'Port Congestion — Dubai (Jebel Ali)', detail: 'SHP-00431 · ETA shift +14hr · Reroute recommended', time: 'just now' },
  { type: 'warning', icon: '🟡', title: 'Typhoon Track — South China Sea', detail: '23 shipments at risk · SHP-01872, SHP-01873...', time: '2m ago' },
  { type: 'warning', icon: '🟡', title: 'Port Strike — Mumbai JNPT', detail: 'SHP-02249, SHP-02301 affected · Alternate routing active', time: '8m ago' },
  { type: 'info', icon: '🔵', title: 'Carrier Capacity Alert — DHL Air', detail: 'SHP-00891 rerouted via FedEx successfully', time: '14m ago' },
  { type: 'critical', icon: '🔴', title: 'Rail Outage — Frankfurt Hub', detail: 'Ground segment delayed +6hr · 8 shipments affected', time: '21m ago' },
  { type: 'warning', icon: '🟡', title: 'Customs Hold — Singapore', detail: 'SHP-01655 documentation review required', time: '29m ago' },
  { type: 'info', icon: '🔵', title: 'Route Optimization Complete', detail: 'SHP-00189 rerouted — saved 5.2 hours via Cape Town', time: '35m ago' },
  { type: 'info', icon: '🔵', title: 'Weather Clear — Pacific Corridor', detail: '12 shipments returned to original route', time: '42m ago' },
];

const NEW_ALERTS = [
  { type: 'critical', icon: '🔴', title: 'Vessel Delay — MSC Marseille', detail: '18 containers delayed · ETA recalculating', time: 'just now' },
  { type: 'warning', icon: '🟡', title: 'Fog Alert — Rotterdam Port', detail: 'Berth delays expected +2hr window', time: 'just now' },
  { type: 'info', icon: '🔵', title: 'SHP-00431 Reroute Accepted', detail: 'New route: Dubai → Colombo (Air) → Frankfurt', time: 'just now' },
];

function renderAlerts(alerts, prepend = false) {
  const feed = document.getElementById('alertsFeed');
  if (!feed) return;
  alerts.forEach(a => {
    const div = document.createElement('div');
    div.className = `alert-item ${a.type}`;
    div.innerHTML = `
      <div class="alert-title">${a.icon} ${a.title}</div>
      <div class="alert-meta">${a.detail} · ${a.time}</div>
    `;
    if (prepend) feed.prepend(div);
    else feed.appendChild(div);
  });
}
renderAlerts(ALERTS);

// Simulate new alerts
let alertIdx = 0;
setInterval(() => {
  if (alertIdx < NEW_ALERTS.length) {
    renderAlerts([NEW_ALERTS[alertIdx]], true);
    alertIdx++;
    // Update critical count
    const crit = document.getElementById('critCount');
    if (crit) crit.textContent = parseInt(crit.textContent) + 1;
  }
}, 7000);

// Pulse risk count
setInterval(() => {
  const risk = document.getElementById('riskCount');
  if (!risk) return;
  const current = parseInt(risk.textContent.replace(',', ''));
  const delta = Math.floor(Math.random() * 5) - 2;
  risk.textContent = (current + delta).toLocaleString();
}, 4000);


// ── Route Accept Button ────────────────────────────────────────────────────
window.acceptRoute = function(btn) {
  const card = btn.closest('.route-card');
  const badge = card.querySelector('.badge');
  badge.className = 'badge badge-green';
  badge.textContent = 'REROUTED';
  btn.textContent = '✓ Accepted';
  btn.style.opacity = '0.5';
  btn.style.pointerEvents = 'none';
  card.style.borderColor = 'rgba(0,255,136,0.3)';
};

window.triggerOptimization = function() {
  const btn = document.querySelector('.btn-optimize');
  btn.textContent = '⏳ Analyzing...';
  btn.style.opacity = '0.6';
  setTimeout(() => {
    btn.textContent = '✓ 3 Routes Optimized';
    btn.style.background = 'rgba(0,255,136,0.2)';
    btn.style.opacity = '1';
    setTimeout(() => {
      btn.textContent = '⚡ Run Optimization';
      btn.style.background = '';
    }, 3000);
  }, 2000);
};


// ── Risk Chart (Canvas) ────────────────────────────────────────────────────
(function drawRiskChart() {
  const canvas = document.getElementById('riskChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  canvas.width = W;
  canvas.height = H;

  const data = [
    32, 28, 35, 40, 38, 45, 42, 55, 70, 65,
    58, 52, 48, 60, 75, 80, 72, 65, 60, 55,
    50, 45, 48, 52, 68, 90, 85, 78, 70, 64
  ];

  const maxVal = 100;
  const pad = { top: 10, right: 10, bottom: 30, left: 30 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;
  const stepX = cW / (data.length - 1);

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (cH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cW, y);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '9px Space Mono';
    ctx.fillText(100 - i * 25, 2, y + 3);
  }

  // Gradient fill
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + cH);
  grad.addColorStop(0, 'rgba(255,59,59,0.4)');
  grad.addColorStop(0.5, 'rgba(255,170,0,0.2)');
  grad.addColorStop(1, 'rgba(0,255,136,0.05)');

  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad.left + i * stepX;
    const y = pad.top + cH - (v / maxVal) * cH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + (data.length - 1) * stepX, pad.top + cH);
  ctx.lineTo(pad.left, pad.top + cH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad.left + i * stepX;
    const y = pad.top + cH - (v / maxVal) * cH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#ff6b35';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Highlight spike
  const spikeIdx = 25;
  const spikeX = pad.left + spikeIdx * stepX;
  const spikeY = pad.top + cH - (data[spikeIdx] / maxVal) * cH;
  ctx.beginPath();
  ctx.arc(spikeX, spikeY, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ff4444';
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '9px Space Mono';
  ctx.fillText('Dubai spike', spikeX - 30, spikeY - 12);

  // X-axis labels
  const labels = ['Apr 1', '', '', '', 'Apr 5', '', '', '', 'Apr 10', '', '', '', 'Apr 15', '', '', '', 'Apr 20', '', '', '', 'Apr 25', '', '', '', 'Apr 27'];
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '8px Space Mono';
  labels.forEach((l, i) => {
    if (!l) return;
    const x = pad.left + i * stepX;
    ctx.fillText(l, x - 12, H - 6);
  });
})();


// ── Donut / Bar Chart for Sources ──────────────────────────────────────────
(function drawSourceChart() {
  const canvas = document.getElementById('sourceChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = canvas.offsetHeight;

  const sources = [
    { label: 'Weather Events', pct: 34, color: '#00d4ff' },
    { label: 'Port Congestion', pct: 28, color: '#ffaa00' },
    { label: 'Carrier Issues', pct: 18, color: '#ff6b35' },
    { label: 'Customs Delays', pct: 12, color: '#ff4444' },
    { label: 'Infrastructure', pct: 8, color: '#a78bfa' },
  ];

  const barH = 22;
  const gap = 14;
  const padL = 10;
  const padT = 20;
  const maxBarW = W - padL - 90;

  sources.forEach((s, i) => {
    const y = padT + i * (barH + gap);
    // bg
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.beginPath();
    ctx.roundRect(padL, y, maxBarW, barH, 4);
    ctx.fill();
    // bar
    const bW = (s.pct / 100) * maxBarW;
    const grad = ctx.createLinearGradient(padL, 0, padL + bW, 0);
    grad.addColorStop(0, s.color);
    grad.addColorStop(1, s.color + '88');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(padL, y, bW, barH, 4);
    ctx.fill();
    // label
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '10px DM Sans';
    ctx.fillText(s.label, padL + bW + 8, y + 14);
    // pct
    ctx.fillStyle = s.color;
    ctx.font = 'bold 10px Space Mono';
    ctx.fillText(s.pct + '%', padL + bW - 28, y + 14);
  });
})();


// ── AI Insights ────────────────────────────────────────────────────────────
const INSIGHTS = [
  { icon: '⚠️', text: '<strong>Dubai Port congestion</strong> has 94% probability of persisting 48+ hrs. Rerouting via Colombo air saves ≈9hrs for 3 shipments.' },
  { icon: '🌀', text: '<strong>Typhoon Mawar</strong> track shifts 120km south — 23 Pacific shipments risk ≈6hr delay. Monitoring active.' },
  { icon: '📈', text: '<strong>Mumbai JNPT</strong> strike impact widening. 12 additional shipments flagged at-risk in next 6hrs.' },
  { icon: '✅', text: '<strong>Trans-Atlantic corridor</strong> operating at 98% efficiency. No intervention needed for 1,204 active shipments.' },
];

const insightsList = document.getElementById('insightsList');
if (insightsList) {
  INSIGHTS.forEach(ins => {
    const div = document.createElement('div');
    div.className = 'insight-item';
    div.innerHTML = `<span class="insight-icon">${ins.icon}</span><span class="insight-text">${ins.text}</span>`;
    insightsList.appendChild(div);
  });
}


// ── Nav scroll effect ──────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (!nav) return;
  if (window.scrollY > 40) {
    nav.style.background = 'rgba(8,12,16,0.97)';
  } else {
    nav.style.background = 'rgba(8,12,16,0.85)';
  }
});


// ── Intersection Observer for section animations ───────────────────────────
const fadeEls = document.querySelectorAll('.how-card, .kpi-card, .route-card, .chart-card, .insight-item');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animation = 'fadeUp 0.6s ease both';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});
