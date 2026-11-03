import { useEffect, useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy, GraduationCap } from "lucide-react";
import { AyraChat } from "./components/AyraChat";
import { Marquee, Reveal, ScrollProgress } from "./components/Effects";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NeuralBackground } from "./components/NeuralBackground";
import { PowerBiModal, ProjectModal } from "./components/ProjectModal";
import { ProjectsSection } from "./components/Projects";
import { SectionHeading } from "./components/SectionHeading";
import { Timeline } from "./components/Timeline";
import {
  contactEmail,
  contactLinks,
  courseGroups,
  education,
  journeySteps,
  marqueeConcepts,
  marqueeTools,
  principles,
  stackGroups,
  type Project,
} from "./data/profile";

const toneClasses = {
  neon: "border-neon/25 bg-neon/10 text-neon",
  primary: "border-primary/30 bg-primary/15 text-blue-400",
  data: "border-data/25 bg-data/10 text-data-soft",
  ai: "border-ai-soft/25 bg-ai/15 text-ai-soft",
};

function useSpotlight() {
  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const card = (event.target as Element | null)?.closest?.(".spotlight") as HTMLElement | null;
      if (!card) {
        return;
      }
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);
}

function App() {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [isPowerBiOpen, setIsPowerBiOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  useSpotlight();

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${contactEmail}`;
    }
  }

  return (
    <div className="min-h-screen overflow-x-clip text-text">
      <ScrollProgress />
      <NeuralBackground />
      <Header />

      <main>
        <Hero />

        <div className="tech-band">
          <Marquee items={marqueeTools} label="Tecnologias que uso" baseVelocity={-2.2} />
          <Marquee items={marqueeConcepts} label="Conceitos que aplico" baseVelocity={1.6} variant="outline" />
        </div>

        <section id="sobre" className="section-shell">
          <SectionHeading
            index="01"
            eyebrow="Sobre mim"
            title="Do cabo de rede ao banco de dados"
            description="Comecei na infraestrutura, passei por controladoria, automação e service desk. Hoje junto tudo isso para construir sistemas completos."
          />

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal className="spotlight glass-panel p-7 sm:p-9">
              <p className="text-lg leading-8 text-soft">
                Cada etapa da minha carreira me deu uma peça diferente. Na infraestrutura aprendi como os sistemas
                ficam de pé; na controladoria, como os números orientam decisões; na automação, como tirar o trabalho
                repetitivo das pessoas; e no service desk, como o usuário realmente usa a tecnologia.
              </p>
              <p className="mt-5 text-lg leading-8 text-soft">
                Hoje eu uno essas peças para entregar{" "}
                <strong className="font-semibold text-text">sistemas completos</strong>: do banco de dados com regras e
                segurança até uma interface que qualquer pessoa consegue usar, com IA onde ela de fato ajuda.
              </p>
              <div className="mt-8 flex gap-4 rounded-xl border border-data/25 bg-data/10 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-data/15 text-data-soft">
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <strong className="block font-display text-lg">
                    {education.course} · {education.status}
                  </strong>
                  <p className="mt-1 text-sm leading-6 text-soft">{education.detail}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="glass-panel p-7 sm:p-9">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Trajetória em camadas</h3>
              <ol className="journey mt-6">
                {journeySteps.map((step, index) => {
                  const isNow = index === journeySteps.length - 1;
                  return (
                    <li className={`journey-step ${isNow ? "is-now" : ""}`} key={step.label}>
                      <span className="journey-index">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <strong className="flex items-center gap-2 font-display text-lg">
                          {step.label}
                          {isNow ? <span className="now-tag">hoje</span> : null}
                        </strong>
                        <span className="text-sm text-muted">{step.detail}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <Reveal delay={index * 0.08} className="spotlight glass-panel p-6" key={principle.title}>
                  <span className="grid h-11 w-11 place-items-center rounded-lg border border-neon/25 bg-neon/10 text-neon">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">{principle.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-soft">{principle.text}</p>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="projetos" className="section-shell pt-4">
          <SectionHeading
            index="02"
            eyebrow="Projetos"
            title="Sistemas reais, rodando de verdade"
            description="Do portal oficial de um processo seletivo público ao app que organiza a pelada do fim de semana. Abra um projeto para ver arquitetura, decisões técnicas e stack."
          />
          <ProjectsSection onOpenProject={setOpenProject} onOpenPowerBi={() => setIsPowerBiOpen(true)} />
        </section>

        <section id="stack" className="section-shell pt-4">
          <SectionHeading
            index="03"
            eyebrow="Stack"
            title="Ferramentas que uso para construir"
            description="Escolho a ferramenta pelo problema: do Postgres com regras de segurança ao script em Python que roda em segundo plano."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {stackGroups.map((group, index) => {
              const Icon = group.icon;
              return (
                <Reveal delay={index * 0.05} className="spotlight glass-panel p-6" key={group.title}>
                  <div className="flex items-center gap-3">
                    <span className={`grid h-11 w-11 place-items-center rounded-lg border ${toneClasses[group.tone]}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-xl font-semibold">{group.title}</h3>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.tools.map((tool) => (
                      <li className="tech-chip tech-chip-lg" key={tool}>
                        {tool}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="trajetoria" className="section-shell pt-4">
          <SectionHeading
            index="04"
            eyebrow="Trajetória"
            title="Linha do tempo profissional"
            description="Mais de cinco anos em tecnologia, evoluindo de suporte e infraestrutura para o desenvolvimento de sistemas."
          />
          <Timeline />
        </section>

        <section id="cursos" className="section-shell pt-4">
          <SectionHeading
            index="05"
            eyebrow="Formação"
            title="Aprendizado contínuo, orientado à prática"
            description="Cursos organizados por área, que sustentam os projetos, as automações e as soluções que entrego."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {courseGroups.map((group, index) => {
              const Icon = group.icon;
              return (
                <Reveal delay={index * 0.05} className="spotlight glass-panel p-6" key={group.category}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg border border-neon/25 bg-neon/10 text-neon">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-xl font-semibold">{group.category}</h3>
                  </div>
                  <ul className="mt-5 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                    {group.courses.map((course) => (
                      <li
                        className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                        key={`${course.name}-${course.provider}`}
                      >
                        <span className="text-sm font-medium text-text">{course.name}</span>
                        <span className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-neon">
                          {course.provider}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="ayra" className="section-shell pt-4">
          <SectionHeading
            index="06"
            eyebrow="Ayra"
            title="Pergunte à minha assistente de IA"
            description="A Ayra conhece meus projetos, minha stack e minha trajetória. Faça uma pergunta ou escolha uma sugestão."
          />
          <AyraChat />
        </section>

        <section id="contato" className="section-shell pb-24 pt-4">
          <Reveal className="contact-panel">
            <div className="relative grid gap-10 p-7 sm:p-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <span className="section-eyebrow">
                  <span className="text-muted">07</span>
                  <span className="text-muted">//</span> Contato
                </span>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  Vamos construir algo <span className="text-gradient">juntos?</span>
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-soft">
                  Canais para conversas profissionais, oportunidades e desenvolvimento de soluções com dados,
                  automação e IA.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <code className="email-code">{contactEmail}</code>
                  <button type="button" className="button-secondary" onClick={copyEmail}>
                    {copied ? (
                      <>
                        Copiado
                        <Check className="h-4 w-4 text-data-soft" aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        Copiar e-mail
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                  <span className="sr-only" aria-live="polite">
                    {copied ? "E-mail copiado" : ""}
                  </span>
                </div>
              </div>

              <div className="grid gap-3">
                {contactLinks.map((link) => {
                  const Icon = link.icon;
                  const external = link.href.startsWith("http");
                  return (
                    <a
                      href={link.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="contact-link group"
                      key={link.label}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-neon/10 text-neon transition group-hover:bg-neon group-hover:text-space">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong className="block font-display text-base">{link.label}</strong>
                        <span className="block truncate text-sm text-muted">{link.value}</span>
                      </span>
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neon"
                        aria-hidden="true"
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-space/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} José Gabriel Pereira da Silva ·{" "}
            <span className="font-mono text-xs">React · TypeScript · Tailwind · framer-motion</span>
          </p>
          <a href="#topo" className="inline-flex items-center gap-2 transition hover:text-neon">
            Voltar ao topo
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </footer>

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      <PowerBiModal open={isPowerBiOpen} onClose={() => setIsPowerBiOpen(false)} />
    </div>
  );
}

export default App;
