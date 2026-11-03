import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

const colors = ["56, 189, 248", "167, 139, 250", "52, 211, 153"];
const linkDistance = 130;
const mouseDistance = 190;

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * ratio;
      canvas!.height = height * ratio;
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(95, Math.floor((width * height) / 15000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.4 + 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    }

    function draw() {
      context!.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 90 && distance > 0) {
          particle.x += (dx / distance) * 0.8;
          particle.y += (dy / distance) * 0.8;
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < linkDistance) {
            context!.strokeStyle = `rgba(${a.color}, ${(1 - distance / linkDistance) * 0.28})`;
            context!.lineWidth = 0.7;
            context!.beginPath();
            context!.moveTo(a.x, a.y);
            context!.lineTo(b.x, b.y);
            context!.stroke();
          }
        }

        const toMouse = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (toMouse < mouseDistance) {
          context!.strokeStyle = `rgba(56, 189, 248, ${(1 - toMouse / mouseDistance) * 0.55})`;
          context!.lineWidth = 0.9;
          context!.beginPath();
          context!.moveTo(a.x, a.y);
          context!.lineTo(mouse.x, mouse.y);
          context!.stroke();
        }
      }

      for (const particle of particles) {
        context!.fillStyle = `rgba(${particle.color}, 0.85)`;
        context!.beginPath();
        context!.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context!.fill();
      }
    }

    function loop() {
      draw();
      frame = window.requestAnimationFrame(loop);
    }

    function handlePointerMove(event: PointerEvent) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }

    function handlePointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function handleVisibility() {
      window.cancelAnimationFrame(frame);
      if (!document.hidden && !reduceMotion) {
        loop();
      }
    }

    resize();
    if (reduceMotion) {
      draw();
    } else {
      loop();
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-space">
      <div className="absolute inset-0 bg-grid-tech bg-[length:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />
      <div className="aurora aurora-blue absolute left-1/2 top-[-10rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full blur-3xl" />
      <div className="aurora aurora-violet absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full blur-3xl" />
      <div className="aurora aurora-green absolute bottom-[-8rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full blur-3xl" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,15,31,0.75)_100%)]" />
    </div>
  );
}
