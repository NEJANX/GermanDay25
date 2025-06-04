import React, { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor(window.innerWidth / 20); // Adjust density

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5, // Size between 0.5 and 2.5
          speedX: (Math.random() - 0.5) * 0.3, // Speed between -0.15 and 0.15
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1, // Opacity between 0.1 and 0.6
        });
      }
    };

    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(10, 10, 10, 0.1)'); // Dark grey, low opacity
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');    // Black, low opacity
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw each particle
      particles.forEach(particle => {
        const { x, y, size, opacity } = particle;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
        
        // Draw connections between nearby particles
        for (const otherParticle of particles) {
          const distance = Math.hypot(x - otherParticle.x, y - otherParticle.y);
          if (distance < 100) { // Only connect particles that are close enough
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      });
    };

    // Update particle positions
    const updateParticles = () => {
      particles.forEach(particle => {
        // Update position based on speed
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });
    };

    // Animation loop
    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    initParticles();
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }} // Slightly reduced opacity for a more subtle effect on black
    />
  );
}