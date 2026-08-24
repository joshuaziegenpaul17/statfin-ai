'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrency } from '@/lib/context/CurrencyContext';

interface Star {
  x: number;
  y: number;
  size: number;
  layer: number; // 0 = distant, 1 = mid, 2 = foreground
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface DataParticle {
  x: number;
  y: number;
  label: string;
  speedX: number;
  speedY: number;
  opacity: number;
  pulse: number;
}

interface HazeBlob {
  x: number;
  y: number;
  r: number;
  color: string;
  speedX: number;
  speedY: number;
  pulse: number;
}

interface Streak {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  width: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const { currencySymbol } = useCurrency();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let dataParticles: DataParticle[] = [];
    let hazeBlobs: HazeBlob[] = [];
    let streaks: Streak[] = [];
    
    let scrollY = 0;
    let scrollSpeed = 0;
    let lastScrollY = 0;
    let scrollTimeout: NodeJS.Timeout;
    let width = 0;
    let height = 0;
    let orbitAngle = 0;

    // Track scroll velocity
    const handleScroll = () => {
      scrollY = window.scrollY;
      const speed = Math.abs(scrollY - lastScrollY);
      scrollSpeed = Math.min(speed * 0.15, 8); // cap speed multiplier
      lastScrollY = scrollY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollSpeed = 0;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize environment elements
    const initEnvironment = (w: number, h: number) => {
      stars = [];
      let count = 110; // Desktop default
      if (w < 640) count = 45; // Mobile
      else if (w < 1024) count = 75; // Tablet

      const starColors = ['#FFFFFF', '#DDE5E5', '#B9C8C8'];

      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        let layer = 0;
        let size = 1;
        let speedY = 0.04 + Math.random() * 0.06;
        let opacity = 0.15 + Math.random() * 0.2;

        if (rand > 0.9) {
          layer = 2; // Foreground
          size = 2.0 + Math.random() * 0.8;
          speedY = 0.7 + Math.random() * 0.5;
          opacity = 0.7 + Math.random() * 0.2;
        } else if (rand > 0.6) {
          layer = 1; // Mid
          size = 1.2 + Math.random() * 0.5;
          speedY = 0.2 + Math.random() * 0.2;
          opacity = 0.4 + Math.random() * 0.2;
        }

        const color = starColors[i % starColors.length];

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          layer,
          speedY,
          speedX: -0.1 + Math.random() * 0.2, // subtle drift
          opacity,
          color,
          trail: [],
        });
      }

      // Initialize faint atmospheric haze blobs (slowly drifting)
      hazeBlobs = [
        {
          x: w * 0.25,
          y: h * 0.3,
          r: w < 640 ? 120 : 250,
          color: 'rgba(11, 26, 28, 0.12)', // dark teal
          speedX: 0.05,
          speedY: 0.03,
          pulse: 0,
        },
        {
          x: w * 0.75,
          y: h * 0.6,
          r: w < 640 ? 140 : 300,
          color: 'rgba(7, 17, 22, 0.1)', // very dark blue/teal
          speedX: -0.04,
          speedY: 0.02,
          pulse: Math.PI,
        },
      ];

      // Drift financial labels (2 on mobile, 4 on desktop)
      dataParticles = [];
      const particleCount = w < 640 ? 2 : 4;
      const labels = ['INCOME', 'SAVINGS', 'RISK 61', 'FORECAST', 'TRENDS', 'OUTLIERS'];
      
      for (let i = 0; i < particleCount; i++) {
        dataParticles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          label: labels[i % labels.length],
          speedX: -0.08 + Math.random() * 0.16,
          speedY: 0.08 + Math.random() * 0.12,
          opacity: 0.15 + Math.random() * 0.15,
          pulse: Math.random() * Math.PI,
        });
      }

      streaks = [];
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initEnvironment(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Main animation loop
    const animateLoop = () => {
      if (document.visibilityState === 'hidden') {
        animationId = requestAnimationFrame(animateLoop);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // --- 1. Environmental Gradient Background Fill ---
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      if (pathname === '/') {
        // Dynamic blending based on scroll positions to darken the canvas as we scroll down
        const heroFactor = Math.max(0, 1 - scrollY / 700);
        const midFactor = Math.max(0, 1 - scrollY / 1400);

        const c1 = `rgb(${Math.round(2 * heroFactor)}, ${Math.round(4 * heroFactor)}, ${Math.round(6 * heroFactor)})`; // #020406
        const c2 = `rgb(${Math.round(7 * midFactor)}, ${Math.round(17 * midFactor)}, ${Math.round(22 * midFactor)})`; // #071116
        const c3 = `rgb(${Math.round(11 * midFactor)}, ${Math.round(26 * midFactor)}, ${Math.round(28 * midFactor)})`; // #0B1A1C
        const c4 = `rgb(${Math.round(5 * heroFactor)}, ${Math.round(7 * heroFactor)}, ${Math.round(8 * heroFactor)})`; // #050708

        grad.addColorStop(0, c1);
        grad.addColorStop(0.25, c2);
        grad.addColorStop(0.5, c3);
        grad.addColorStop(0.75, c4);
        grad.addColorStop(1, '#000000');
      } else if (pathname === '/assessment' || pathname === '/historical') {
        // Dark + focused
        grad.addColorStop(0, '#020304');
        grad.addColorStop(1, '#000000');
      } else if (pathname === '/report') {
        // Dark and clean report page
        grad.addColorStop(0, '#030507');
        grad.addColorStop(0.5, '#010203');
        grad.addColorStop(1, '#000000');
      } else {
        // Minimal/methodology
        grad.addColorStop(0, '#000000');
        grad.addColorStop(1, '#000000');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // --- 2. Atmospheric Haze (Radial Blobs) ---
      if (!reducedMotion && pathname === '/') {
        for (let i = 0; i < hazeBlobs.length; i++) {
          const blob = hazeBlobs[i];
          
          // Slowly drift blobs
          blob.x += blob.speedX;
          blob.y += blob.speedY;
          blob.pulse += 0.001;

          // Wrap boundaries
          if (blob.x - blob.r > width) blob.x = -blob.r;
          if (blob.x + blob.r < 0) blob.x = width + blob.r;
          if (blob.y - blob.r > height) blob.y = -blob.r;
          if (blob.y + blob.r < 0) blob.y = height + blob.r;

          const currentOpacity = 0.12 * (0.85 + Math.sin(blob.pulse) * 0.15) * Math.max(0, 1 - scrollY / 800);

          if (currentOpacity > 0.01) {
            const radGrad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
            radGrad.addColorStop(0, blob.color.replace('0.1', String(currentOpacity)));
            radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(blob.x, blob.y, blob.r, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }

      // --- 3. Distant Stars Field ---
      // Distant stars fade as we scroll down to reduce background density
      const starFadeFactor = Math.max(0.15, 1 - scrollY / 1500);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (reducedMotion) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.5})`;
          ctx.fill();
          continue;
        }

        let currentSpeedY = star.speedY;
        let currentSpeedX = star.speedX;

        // Parallax updates:
        if (star.layer === 2) {
          currentSpeedY += scrollSpeed * 0.8;
          star.y += scrollSpeed * 0.25;
        } else if (star.layer === 1) {
          currentSpeedY += scrollSpeed * 0.35;
          star.y += scrollSpeed * 0.12;
        } else {
          currentSpeedY += scrollSpeed * 0.05;
        }

        star.y += currentSpeedY;
        star.x += currentSpeedX;

        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
          star.trail = [];
        }
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;

        if (star.layer === 2 && scrollSpeed > 1) {
          star.trail.push({ x: star.x, y: star.y });
          if (star.trail.length > 4) star.trail.shift();
        } else {
          star.trail = [];
        }

        if (star.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(star.trail[0].x, star.trail[0].y);
          for (let j = 1; j < star.trail.length; j++) {
            ctx.lineTo(star.trail[j].x, star.trail[j].y);
          }
          ctx.strokeStyle = `rgba(185, 200, 200, ${star.opacity * 0.35 * starFadeFactor})`;
          ctx.lineWidth = star.size * 0.4;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        
        // Add color mapping
        let r, g, b;
        if (star.color === '#FFFFFF') { r = 255; g = 255; b = 255; }
        else if (star.color === '#DDE5E5') { r = 221; g = 229; b = 229; }
        else { r = 185; g = 200; b = 200; }

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${star.opacity * starFadeFactor})`;
        
        if (star.layer === 2 && star.size >= 2) {
          ctx.shadowBlur = 3;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // --- 4. Occasions Star Streaks ---
      if (!reducedMotion && pathname === '/' && scrollY < 800) {
        // Randomly spawn a streak: very low probability
        if (Math.random() < 0.0015 && streaks.length < 2) {
          streaks.push({
            x: Math.random() * width,
            y: 0,
            length: 40 + Math.random() * 50,
            speed: 6 + Math.random() * 5,
            angle: Math.PI / 4 + Math.random() * 0.08, // diagonal fall
            opacity: 0.3 + Math.random() * 0.3,
            width: 1 + Math.random() * 0.8,
          });
        }

        // Draw and update streaks
        for (let i = streaks.length - 1; i >= 0; i--) {
          const streak = streaks[i];
          
          streak.x += Math.cos(streak.angle) * streak.speed;
          streak.y += Math.sin(streak.angle) * streak.speed;
          streak.opacity -= 0.005; // slowly fade

          if (streak.y > height || streak.x > width || streak.opacity <= 0) {
            streaks.splice(i, 1);
            continue;
          }

          const tailX = streak.x - Math.cos(streak.angle) * streak.length;
          const tailY = streak.y - Math.sin(streak.angle) * streak.length;

          const streakGrad = ctx.createLinearGradient(streak.x, streak.y, tailX, tailY);
          streakGrad.addColorStop(0, `rgba(185, 200, 200, ${streak.opacity})`);
          streakGrad.addColorStop(1, 'rgba(185, 200, 200, 0)');

          ctx.beginPath();
          ctx.moveTo(streak.x, streak.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = streak.width;
          ctx.stroke();
        }
      }

      // --- 5. Rotating Faint Orbital Paths (Behind hero data) ---
      orbitAngle += 0.0003;
      if (!reducedMotion && pathname === '/' && scrollY < 1200) {
        // Hero orbits
        const orbitFade = Math.max(0, 1 - scrollY / 900);
        if (orbitFade > 0.01) {
          ctx.beginPath();
          ctx.ellipse(width / 2, height / 2.3, width * 0.35, 120, orbitAngle, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.015 * orbitFade})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(width / 2, height / 2.3, width * 0.45, 180, -orbitAngle * 1.5, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.01 * orbitFade})`;
          ctx.stroke();
        }
      }

      // Return orbits for Risk section (Dramatic returning effect)
      if (!reducedMotion && pathname === '/' && scrollY > 1500 && scrollY < 2600) {
        const riskFactor = Math.sin(((scrollY - 1500) / 1100) * Math.PI); // pulses in mid-scroll
        if (riskFactor > 0.01) {
          ctx.beginPath();
          ctx.ellipse(width / 2, height / 2, 280, 280, orbitAngle * 2, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.018 * riskFactor})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // --- 6. Abstract Financial Terrain (3 layers with parallax) ---
      if (pathname === '/' && scrollY < 750) {
        const fadeOpacity = Math.max(0, 1 - scrollY / 550);

        if (fadeOpacity > 0.01) {
          // Speeds configured differently to yield the parallax feel
          const bgOffset = scrollY * 0.15;
          const midOffset = scrollY * 0.32;
          const fgOffset = scrollY * 0.5;

          // Layer 1 — Background curves (very dark teal)
          ctx.beginPath();
          ctx.moveTo(0, height);
          ctx.bezierCurveTo(
            width * 0.25, height - 190 - bgOffset,
            width * 0.75, height - 280 - bgOffset,
            width, height - 110 - bgOffset
          );
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.fillStyle = `rgba(11, 24, 26, ${0.22 * fadeOpacity})`; // #0B181A
          ctx.fill();

          // Layer 2 — Middle curves (muted bronze/brown)
          ctx.beginPath();
          ctx.moveTo(0, height);
          ctx.bezierCurveTo(
            width * 0.3, height - 120 - midOffset,
            width * 0.65, height - 210 - midOffset,
            width, height - 140 - midOffset
          );
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.fillStyle = `rgba(37, 35, 28, ${0.3 * fadeOpacity})`; // #25231C
          ctx.fill();

          // Layer 3 — Foreground curves (almost-black silhouette)
          ctx.beginPath();
          ctx.moveTo(0, height);
          ctx.bezierCurveTo(
            width * 0.22, height - 60 - fgOffset,
            width * 0.72, height - 110 - fgOffset,
            width, height - 80 - fgOffset
          );
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.fillStyle = `rgba(17, 21, 20, ${0.82 * fadeOpacity})`; // #111514
          ctx.fill();
        }
      }

      // --- 7. Floating Data Particles ---
      if (!reducedMotion && pathname === '/' && scrollY < 1200) {
        const dataFade = Math.max(0, 1 - scrollY / 700);
        if (dataFade > 0.01) {
          for (let i = 0; i < dataParticles.length; i++) {
            const dp = dataParticles[i];
            
            dp.y += dp.speedY + scrollSpeed * 0.15;
            dp.x += dp.speedX;
            dp.pulse += 0.02;

            if (dp.y > height) {
              dp.y = 0;
              dp.x = Math.random() * width;
            }
            if (dp.x < 0) dp.x = width;
            if (dp.x > width) dp.x = 0;

            const currentOpacity = dp.opacity * (0.65 + Math.sin(dp.pulse) * 0.35) * dataFade;

            // Draw core node
            ctx.beginPath();
            ctx.arc(dp.x, dp.y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 1.5})`;
            ctx.fill();

            // Link line
            ctx.beginPath();
            ctx.moveTo(dp.x, dp.y);
            ctx.lineTo(dp.x + 16, dp.y - 12);
            ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.35})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Text Label
            ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.8})`;
            ctx.font = '8px monospace';
            
            let displayLabel = dp.label;
            if (dp.label === 'INCOME') displayLabel = `INCOME ${currencySymbol}30K`;
            if (dp.label === 'SAVINGS') displayLabel = `SAVINGS ${currencySymbol}7K`;

            ctx.fillText(displayLabel, dp.x + 19, dp.y - 9);
          }
        }
      }

      animationId = requestAnimationFrame(animateLoop);
    };

    animateLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion, currencySymbol, pathname]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
