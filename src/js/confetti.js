export function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ['#6D5B97', '#FF8A65', '#FF4081', '#4FC3F7', '#81C784', '#FFD54F'];
  const confettiCount = 150;
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height - height;
      this.r = Math.random() * 6 + 4;
      this.d = Math.random() * confettiCount;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.tilt = Math.random() * 10 - 5;
      this.tiltAngleIncremental = Math.random() * 0.07 + 0.02;
      this.tiltAngle = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.lineWidth = this.r / 2;
      ctx.strokeStyle = this.color;
      ctx.moveTo(this.x + this.tilt + this.r / 2, this.y);
      ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 2);
      ctx.stroke();
    }

    update() {
      this.tiltAngle += this.tiltAngleIncremental;
      this.y += (Math.cos(this.d) + 3 + this.r / 2) / 2;
      this.x += Math.sin(this.tiltAngle);
      this.tilt = Math.sin(this.tiltAngle - this.r / 2) * 5;
      return this.y < height;
    }
  }

  for (let i = 0; i < confettiCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    let remaining = 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p) {
        p.draw();
        const active = p.update();
        if (active) {
          remaining++;
        } else {
          particles[i] = null;
        }
      }
    }

    if (remaining > 0) {
      requestAnimationFrame(animate);
    } else {
      if (canvas.parentNode) {
        document.body.removeChild(canvas);
      }
    }
  }

  animate();
}
