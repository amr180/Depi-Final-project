// Particles
const colors = ['#185FA5','#1D9E75','#378ADD','#0F6E56'];
const container = document.getElementById('particles');

for (let i = 0; i < 18; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 2;
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random() * 100}%;
    bottom:0;
    background:${colors[Math.floor(Math.random() * colors.length)]};
    animation-duration:${3 + Math.random() * 4}s;
    animation-delay:${Math.random() * 3}s;
  `;
  container.appendChild(p);
}

// Progress bar simulation
const fill = document.getElementById('progressFill');
let progress = 0;

const interval = setInterval(() => {
  progress = Math.min(progress + Math.random() * 15, 90);
  fill.style.width = progress + '%';
}, 200);

// لما كل حاجة تتحمل، استدعي هذه الدالة
export function finishLoading(redirectUrl = 'index.html') {
  clearInterval(interval);
  fill.style.width = '100%';

  setTimeout(() => {
    document.getElementById('loaderWrapper').style.opacity = '0';
    document.getElementById('loaderWrapper').style.transition = 'opacity 0.5s ease';
    setTimeout(() => window.location.href = redirectUrl, 500);
  }, 400);
}