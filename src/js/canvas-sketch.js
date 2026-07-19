export function initCanvasSketch() {
  const canvas = document.getElementById('sketch-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.offsetWidth || 500;
  let height = canvas.height = canvas.offsetHeight || 500;

  // Handle resizing
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      width = canvas.width = entry.contentRect.width || 500;
      height = canvas.height = entry.contentRect.height || 500;
      draw(currentScrollProgress);
    }
  });
  resizeObserver.observe(canvas);

  let currentScrollProgress = 0;

  // Define components of the sketch
  // 1. Line art (easel, canvas, brushes)
  // 2. Color splashes ( watercolor blobs)

  // Splashes configuration
  const splashes = [
    { x: 0.5, y: 0.4, r: 80, color: 'rgba(109, 91, 151, 0.4)', start: 0.1, end: 0.5 }, // Primary Purple
    { x: 0.35, y: 0.3, r: 60, color: 'rgba(255, 138, 101, 0.4)', start: 0.3, end: 0.7 }, // Soft Orange
    { x: 0.65, y: 0.35, r: 70, color: 'rgba(79, 195, 247, 0.4)', start: 0.4, end: 0.8 }, // Sky Blue
    { x: 0.45, y: 0.5, r: 90, color: 'rgba(255, 64, 129, 0.35)', start: 0.2, end: 0.6 }, // Coral Pink
    { x: 0.55, y: 0.25, r: 50, color: 'rgba(129, 199, 132, 0.4)', start: 0.5, end: 0.9 }  // Mint Green
  ];

  function draw(progress) {
    ctx.clearRect(0, 0, width, height);

    // Draw background organic color blobs (Watercolor effect)
    splashes.forEach(splash => {
      if (progress > splash.start) {
        const splashProgress = Math.min(1, (progress - splash.start) / (splash.end - splash.start));
        
        ctx.save();
        ctx.beginPath();
        // Create an organic watercolor shape using multiple control points
        const cx = splash.x * width;
        const cy = splash.y * height;
        const r = splash.r * splashProgress * (width / 500); // Scale with width
        
        ctx.translate(cx, cy);
        ctx.moveTo(r, 0);
        for (let angle = 0; angle < Math.PI * 2; angle += 0.4) {
          // Add organic wobble to splash edge
          const wobble = Math.sin(angle * 5) * 8 * splashProgress + Math.cos(angle * 3) * 4;
          const currentR = r + wobble;
          const x = Math.cos(angle) * currentR;
          const y = Math.sin(angle) * currentR;
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = splash.color;
        ctx.fill();
        ctx.restore();
      }
    });

    // Draw the easel (Line Art - Charcoal)
    ctx.save();
    ctx.strokeStyle = '#2D2A2E';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = width / 2;
    const cy = height / 2;
    const scale = width / 500;

    // Draw lines progressively based on progress
    // Draw easel legs
    if (progress > 0) {
      const legProgress = Math.min(1, progress / 0.3);
      // Left leg
      ctx.beginPath();
      ctx.moveTo(cx, cy - 120 * scale);
      ctx.lineTo(cx - 100 * scale * legProgress, cy + 180 * scale * legProgress);
      ctx.stroke();

      // Right leg
      ctx.beginPath();
      ctx.moveTo(cx, cy - 120 * scale);
      ctx.lineTo(cx + 100 * scale * legProgress, cy + 180 * scale * legProgress);
      ctx.stroke();

      // Middle leg support
      ctx.beginPath();
      ctx.moveTo(cx, cy - 90 * scale);
      ctx.lineTo(cx + 15 * scale * legProgress, cy + 200 * scale * legProgress);
      ctx.stroke();
    }

    // Draw Canvas board
    if (progress > 0.2) {
      const canvasProgress = Math.min(1, (progress - 0.2) / 0.3);
      ctx.beginPath();
      // Draw canvas board container rectangular path outline
      const cw = 220 * scale;
      const ch = 160 * scale;
      const x = cx - cw / 2;
      const y = cy - 80 * scale;

      // Draw canvas border progressively
      const perimeter = (cw + ch) * 2;
      const drawLength = perimeter * canvasProgress;
      
      ctx.rect(x, y, cw, ch);
      ctx.stroke();

      // Sub-artwork inside canvas (sun, waves, flowers)
      if (progress > 0.4) {
        const artProgress = Math.min(1, (progress - 0.4) / 0.4);
        ctx.beginPath();
        // Sun
        ctx.arc(cx - 50 * scale, cy - 20 * scale, 20 * scale, 0, Math.PI * 2 * artProgress);
        ctx.stroke();

        // Rays
        if (artProgress > 0.5) {
          ctx.beginPath();
          ctx.moveTo(cx - 50 * scale, cy - 50 * scale);
          ctx.lineTo(cx - 50 * scale, cy - 45 * scale);
          ctx.moveTo(cx - 80 * scale, cy - 20 * scale);
          ctx.lineTo(cx - 75 * scale, cy - 20 * scale);
          ctx.moveTo(cx - 70 * scale, cy - 40 * scale);
          ctx.lineTo(cx - 66 * scale, cy - 36 * scale);
          ctx.stroke();
        }

        // Mountain/Wave line
        ctx.beginPath();
        ctx.moveTo(x + 10 * scale, y + ch - 15 * scale);
        ctx.quadraticCurveTo(cx - 20 * scale, cy + 20 * scale, cx + 40 * scale, cy + 40 * scale);
        ctx.quadraticCurveTo(cx + 80 * scale, cy + 50 * scale, x + cw - 10 * scale, y + ch - 30 * scale);
        ctx.stroke();
      }
    }

    // Draw Easel bottom support bar & shelf
    if (progress > 0.15) {
      const shelfProgress = Math.min(1, (progress - 0.15) / 0.2);
      ctx.beginPath();
      ctx.moveTo(cx - 120 * scale * shelfProgress, cy + 85 * scale);
      ctx.lineTo(cx + 120 * scale * shelfProgress, cy + 85 * scale);
      ctx.stroke();
    }

    // Draw Paint palette and brushes resting
    if (progress > 0.5) {
      const detailsProgress = Math.min(1, (progress - 0.5) / 0.3);
      // Palette (organic shape)
      ctx.beginPath();
      const px = cx + 80 * scale;
      const py = cy + 110 * scale;
      ctx.arc(px, py, 25 * scale * detailsProgress, 0, Math.PI * 1.7);
      ctx.stroke();

      // Brush leaning
      ctx.beginPath();
      ctx.moveTo(cx - 60 * scale, cy + 140 * scale);
      ctx.lineTo(cx - 20 * scale * detailsProgress, cy + 50 * scale * detailsProgress);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Update on scroll
  const section = document.getElementById('section-what-is');
  if (section) {
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the section is scrolled into viewport
      // Starts being visible when rect.top = windowHeight
      // Ends being fully scrolled when rect.bottom = 0
      const totalDist = windowHeight + rect.height;
      const currentDist = windowHeight - rect.top;
      
      let progress = currentDist / totalDist;
      progress = Math.max(0, Math.min(1, progress));

      // Map progress to standard active drawing zone (e.g. while section is fully in focus)
      // This makes the transition feel more responsive to the center of the viewport
      const offsetTop = rect.top;
      const height = rect.height;
      let focalProgress = (windowHeight / 2 - offsetTop) / (height / 2);
      focalProgress = Math.max(0, Math.min(1, focalProgress));
      
      currentScrollProgress = focalProgress;
      draw(focalProgress);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial draw
    handleScroll();
  }
}
