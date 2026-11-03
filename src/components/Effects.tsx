import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-neon via-ai-soft to-data-soft"
    />
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Typewriter({ words }: { words: string[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const word = words[index];
    let timeout: number | undefined;

    if (!deleting && text === word) {
      timeout = window.setTimeout(() => setDeleting(true), 1900);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((current) => (current + 1) % words.length);
    } else {
      timeout = window.setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? 40 : 85,
      );
    }

    return () => window.clearTimeout(timeout);
  }, [deleting, index, reduceMotion, text, words]);

  return (
    <span className="text-gradient">
      {reduceMotion ? words[0] : text}
      <span className="type-caret" />
    </span>
  );
}

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const controls = animate(0, value, {
      duration: reduceMotion ? 0 : 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setCurrent(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref}>
      {current}
      {suffix}
    </span>
  );
}

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

type MarqueeProps = {
  items: string[];
  label: string;
  // Velocidade base em % da faixa por segundo; o sinal define o sentido.
  baseVelocity: number;
  variant?: "mono" | "outline";
};

// Faixa que acelera e inverte o sentido conforme a rolagem da página.
// Continua em movimento mesmo com "reduzir movimento" ligado, só que mais devagar e sem inclinar.
export function Marquee({ items, label, baseVelocity, variant = "mono" }: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2500, 0, 2500], reduceMotion ? [0, 0, 0] : [7, 0, -7]);
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);
  const direction = useRef(1);
  const hovered = useRef(false);

  useAnimationFrame((_time, delta) => {
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    let moveBy = direction.current * baseVelocity * (delta / 1000) * (reduceMotion ? 0.5 : 1);
    moveBy += moveBy * Math.min(Math.abs(factor), 6);
    if (hovered.current) moveBy *= 0.15;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className={`marquee ${variant === "outline" ? "marquee-outline" : ""}`}
      aria-label={label}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <motion.div className="marquee-track" style={{ x, skewX }}>
        {[...items, ...items].map((item, index) => (
          <span className="marquee-item" key={`${item}-${index}`} aria-hidden={index >= items.length}>
            {variant === "outline" ? <span className="marquee-slash">/</span> : <span className="marquee-dot" />}
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
