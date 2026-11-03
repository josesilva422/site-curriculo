import type { PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "framer-motion";
import { ArrowUpRight, Bot, Code2, Download, Sparkles } from "lucide-react";
import { heroRoles, heroStats, profilePhoto, resumeDownloadUrl, terminalLines } from "../data/profile";
import { Counter, Typewriter } from "./Effects";
import { Terminal } from "./Terminal";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Hero() {
  return (
    <section
      id="topo"
      className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-20 pt-28 sm:px-6 lg:px-8"
    >
      <div className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
          <motion.div variants={fadeUp} className="hero-badge">
            <span className="live-dot" aria-hidden="true" />
            Desenvolvendo sistemas na COMURG · Goiânia, GO
          </motion.div>

          <motion.h1
            variants={fadeUp}
            aria-label="Construo sistemas web, automações, IA aplicada, APIs e dados que resolvem problemas reais."
            className="mt-7 font-display text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-text sm:text-5xl lg:text-[3.6rem]"
          >
            <span aria-hidden="true">Construo</span>
            <span aria-hidden="true" className="block min-h-[1.1em]">
              <Typewriter words={heroRoles} />
            </span>
            <span aria-hidden="true" className="block text-balance">
              que resolvem problemas reais.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-8 text-soft">
            Sou <strong className="font-semibold text-text">José Gabriel</strong>, desenvolvedor full-stack com base em
            infraestrutura, controladoria e service desk. Hoje crio plataformas em produção com Next.js, Python,
            Supabase e IA aplicada, sempre com regra de negócio clara e dado seguro.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <a className="button-primary" href="#projetos">
              Ver projetos
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a className="button-secondary" href={resumeDownloadUrl}>
              Baixar currículo
              <Download className="h-4 w-4" aria-hidden="true" />
            </a>
            <a className="button-ghost" href="#ayra">
              Conversar com a Ayra
              <Bot className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div className="flex flex-col-reverse gap-1 bg-space/80 px-4 py-4 backdrop-blur-xl" key={stat.label}>
                <dt className="text-xs leading-5 text-muted">{stat.label}</dt>
                <dd className="font-display text-3xl font-semibold text-text">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <ProfileVisual />
      </div>

      <a href="#sobre" className="scroll-hint" aria-label="Rolar para a próxima seção">
        <span className="scroll-hint-wheel" />
      </a>
    </section>
  );
}

function ProfileVisual() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), { stiffness: 160, damping: 20 });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), { stiffness: 160, damping: 20 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[440px] lg:mr-0"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="profile-frame"
      >
        <div className="relative overflow-hidden rounded-[1.35rem]">
          <img
            src={profilePhoto}
            alt="Foto de José Gabriel Pereira da Silva"
            className="h-[400px] w-full object-cover object-top sm:h-[460px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space via-space/5 to-transparent" />
          <div className="scan-line" aria-hidden="true" />
        </div>

        <div className="float-chip right-4 top-4" style={{ transform: "translateZ(40px)" }}>
          <Sparkles className="h-3.5 w-3.5 text-ai-soft" aria-hidden="true" />
          Next.js + Python + IA
        </div>
        <div className="float-chip float-chip-side -left-5 top-1/3" style={{ transform: "translateZ(60px)" }}>
          <Code2 className="h-3.5 w-3.5 text-neon" aria-hidden="true" />
          full-stack
        </div>
      </motion.div>

      <Terminal lines={terminalLines} className="relative z-10 mx-3 -mt-24 sm:mx-6" />
    </motion.div>
  );
}
