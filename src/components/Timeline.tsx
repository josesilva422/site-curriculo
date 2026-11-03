import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { experiences } from "../data/profile";

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl space-y-6 pl-10 sm:pl-14">
      <span aria-hidden="true" className="absolute bottom-2 left-[0.6rem] top-2 w-px bg-white/10 sm:left-[1.1rem]" />
      <motion.span
        aria-hidden="true"
        style={{ scaleY }}
        className="absolute bottom-2 left-[0.6rem] top-2 w-px origin-top bg-gradient-to-b from-neon via-ai-soft to-data-soft shadow-[0_0_12px_rgba(56,189,248,0.8)] sm:left-[1.1rem]"
      />

      {experiences.map((experience, index) => (
        <motion.li
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.5, delay: index === 0 ? 0 : 0.05 }}
          className="relative"
          key={`${experience.role}-${experience.period}`}
        >
          <span
            aria-hidden="true"
            className={`absolute left-[-1.9rem] top-7 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border sm:left-[-2.4rem] ${
              experience.current ? "border-data-soft bg-data/20" : "border-neon/50 bg-space"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${experience.current ? "live-dot-core" : "bg-neon"}`} />
          </span>

          <article className={`spotlight glass-panel p-6 ${experience.current ? "current-role" : ""}`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm text-neon">{experience.period}</span>
              {experience.current ? (
                <span className="status-pill status-live">
                  <span className="status-dot" aria-hidden="true" />
                  Atual
                </span>
              ) : null}
            </div>
            <h3 className="mt-2 font-display text-xl font-semibold sm:text-2xl">{experience.role}</h3>
            <p className="mt-1 text-sm text-muted">{experience.scope}</p>
            <p className="mt-4 text-[0.95rem] leading-7 text-soft">{experience.impact}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {experience.items.map((item) => (
                <span className="tech-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </article>
        </motion.li>
      ))}
    </ol>
  );
}
