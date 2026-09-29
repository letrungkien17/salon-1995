import React, { useEffect, useRef, useState } from 'react';

export const RoyalScissorsParticles = () => {
  const canvasRef = useRef(null);
  const [clickRipples, setClickRipples] = useState([]);
  const mousePos = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mousePos.current.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle class for luxury champagne gold & sage herbal dust on light background
    class Particle {
      constructor(isMouseSparkle = false, initX, initY) {
        this.reset(isMouseSparkle, initX, initY);
      }

      reset(isMouseSparkle = false, initX, initY) {
        this.isMouseSparkle = isMouseSparkle;
        this.x = initX !== undefined ? initX : Math.random() * width;
        this.y = initY !== undefined ? initY : Math.random() * height;
        this.size = isMouseSparkle ? Math.random() * 2.8 + 1.2 : Math.random() * 2 + 0.6;
        this.speedX = (Math.random() - 0.5) * (isMouseSparkle ? 2 : 0.4);
        this.speedY = isMouseSparkle ? (Math.random() - 0.5) * 2 : -Math.random() * 0.5 - 0.15;
        this.alpha = isMouseSparkle ? 0.85 : Math.random() * 0.4 + 0.15;
        this.decay = isMouseSparkle ? Math.random() * 0.025 + 0.015 : 0;
        this.colorType = Math.random();
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotSpeed;

        if (mousePos.current.active && !this.isMouseSparkle) {
          const dx = mousePos.current.x - this.x;
          const dy = mousePos.current.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const force = (130 - dist) / 130;
            this.x += (dx / dist) * force * 0.9;
            this.y += (dy / dist) * force * 0.9;
          }
        }

        if (this.isMouseSparkle) {
          this.alpha -= this.decay;
        } else {
          if (this.y < -10) this.y = height + 10;
          if (this.x < -10) this.x = width + 10;
          if (this.x > width + 10) this.x = -10;
        }
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        let fillCol = '#c5a059'; // Champagne Gold
        if (this.colorType > 0.7) {
          fillCol = '#3d7a63'; // Herbal Sage Jade
        } else if (this.colorType > 0.35) {
          fillCol = '#dfbe7a'; // Soft Golden Amber
        } else {
          fillCol = '#9e7d3b'; // Warm Bronze
        }

        const r = this.size;
        ctx.fillStyle = fillCol;
        ctx.shadowBlur = this.isMouseSparkle ? 8 : 4;
        ctx.shadowColor = 'rgba(197, 160, 89, 0.4)';

        ctx.beginPath();
        ctx.moveTo(0, -r * 2);
        ctx.lineTo(r * 0.6, -r * 0.6);
        ctx.lineTo(r * 2, 0);
        ctx.lineTo(r * 0.6, r * 0.6);
        ctx.lineTo(0, r * 2);
        ctx.lineTo(-r * 0.6, r * 0.6);
        ctx.lineTo(-r * 2, 0);
        ctx.lineTo(-r * 0.6, -r * 0.6);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    const particleCount = Math.min(40, Math.floor(width / 35));
    const particles = Array.from({ length: particleCount }, () => new Particle(false));
    const dynamicSparkles = [];

    let lastSpawn = 0;
    const animate = (time) => {
      ctx.clearRect(0, 0, width, height);

      if (mousePos.current.active && time - lastSpawn > 50) {
        lastSpawn = time;
        if (dynamicSparkles.length < 30) {
          dynamicSparkles.push(new Particle(true, mousePos.current.x, mousePos.current.y));
        }
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      for (let i = dynamicSparkles.length - 1; i >= 0; i--) {
        const s = dynamicSparkles[i];
        s.update();
        s.draw();
        if (s.alpha <= 0) {
          dynamicSparkles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Clean ripple effect on click without cluttered icons
  const handleGlobalClick = (e) => {
    const burstId = Date.now() + Math.random();
    setClickRipples((prev) => [...prev.slice(-3), { id: burstId, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setClickRipples((prev) => prev.filter((b) => b.id !== burstId));
    }, 800);
  };

  useEffect(() => {
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.75
        }}
      />

      {clickRipples.map((b) => (
        <div
          key={b.id}
          className="royal-click-ripple"
          style={{
            left: `${b.x}px`,
            top: `${b.y}px`
          }}
          aria-hidden="true"
        >
          <div className="ripple-champagne-ring" />
          <div className="ripple-champagne-ring-outer" />
        </div>
      ))}
    </>
  );
};
