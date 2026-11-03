import { type ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, ExternalLink, FlaskConical, Sparkles } from "lucide-react";
import { labProjects, projectFilters, projects, type Project, type ProjectCategory } from "../data/profile";
import { Reveal } from "./Effects";

export function StatusPill({ tone, children }: { tone: Project["statusTone"]; children: ReactNode }) {
  return (
    <span className={`status-pill status-${tone}`}>
      <span className="status-dot" aria-hidden="true" />
      {children}
    </span>
  );
}

type ProjectsSectionProps = {
  onOpenProject: (project: Project) => void;
  onOpenPowerBi: () => void;
};

export function ProjectsSection({ onOpenProject, onOpenPowerBi }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<"todos" | ProjectCategory>("todos");
  const visible = filter === "todos" ? projects : projects.filter((project) => project.categories.includes(filter));

  return (
    <>
      <Reveal className="mb-8 flex flex-wrap justify-center gap-2" delay={0.05}>
        <div className="filter-bar" role="group" aria-label="Filtrar projetos">
          {projectFilters.map((item) => {
            const count =
              item.id === "todos" ? projects.length : projects.filter((project) => project.categories.includes(item.id as ProjectCategory)).length;
            const active = filter === item.id;
            return (
              <button
                type="button"
                key={item.id}
                className={`filter-button ${active ? "is-active" : ""}`}
                aria-pressed={active}
                onClick={() => setFilter(item.id)}
              >
                {active ? (
                  <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                ) : null}
                <span className="relative">{item.label}</span>
                <span className="relative font-mono text-[0.7rem] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={() => onOpenProject(project)} />
          ))}
        </AnimatePresence>
      </motion.div>

      <Reveal className="mt-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-ai-soft/30 bg-ai/15 text-ai-soft">
            <FlaskConical className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-xl font-semibold">Laboratório</h3>
            <p className="text-sm text-muted">Outros projetos e estudos em andamento</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {labProjects.map((project) => {
            const Icon = project.icon;
            return (
              <article className="spotlight glass-panel flex flex-col p-5" key={project.title}>
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.07] text-ai-soft">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <StatusPill tone="proto">{project.status}</StatusPill>
                </div>
                <h4 className="mt-4 font-display text-lg font-semibold">{project.title}</h4>
                <p className="mt-2 text-sm leading-6 text-soft">{project.detail}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tool) => (
                    <span className="tech-chip" key={tool}>
                      {tool}
                    </span>
                  ))}
                </div>
                {project.type === "power-bi" ? (
                  <button type="button" className="button-project mt-5 self-start" onClick={onOpenPowerBi}>
                    Explorar dashboards
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </article>
            );
          })}
        </div>
      </Reveal>
    </>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const Icon = project.icon;
  const chipLimit = project.featured ? 8 : 4;
  const hiddenChips = project.stack.length - chipLimit;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`spotlight glass-panel project-card flex flex-col p-6 ${
        project.featured ? "featured-card md:col-span-2 lg:row-span-2 sm:p-8" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-xl border border-neon/25 bg-neon/10 text-neon">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex flex-wrap justify-end gap-2">
          {project.featured ? (
            <span className="featured-tag">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Destaque
            </span>
          ) : null}
          <StatusPill tone={project.statusTone}>{project.status}</StatusPill>
        </div>
      </div>

      {project.org ? (
        <span className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-neon">{project.org}</span>
      ) : (
        <span className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-muted">Projeto próprio</span>
      )}
      <h3 className={`mt-2 font-display font-semibold ${project.featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
        {project.title}
      </h3>
      <p className={`mt-3 leading-7 text-soft ${project.featured ? "max-w-2xl text-base sm:text-lg sm:leading-8" : "text-[0.95rem]"}`}>
        {project.summary}
      </p>

      {project.featured && project.numbers ? (
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {project.numbers.map((number) => (
            <div className="rounded-xl border border-white/10 bg-space/50 p-4" key={number.label}>
              <strong className="block font-display text-2xl text-neon sm:text-3xl">{number.value}</strong>
              <span className="text-xs text-muted">{number.label}</span>
            </div>
          ))}
        </div>
      ) : null}

      {project.featured ? (
        <ul className="mt-7 space-y-3">
          {project.highlights.slice(0, 3).map((highlight) => (
            <li className="flex gap-3 text-[0.95rem] leading-7 text-soft" key={highlight}>
              <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-data-soft" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      {project.featured ? (
        <ol className="mt-7 flex flex-wrap items-center gap-2" aria-label="Arquitetura">
          {project.architecture.map((layer, index) => (
            <li className="flex items-center gap-2" key={layer}>
              <span className="arch-node">{layer}</span>
              {index < project.architecture.length - 1 ? <span className="arch-arrow" aria-hidden="true" /> : null}
            </li>
          ))}
        </ol>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, chipLimit).map((tool) => (
          <span className="tech-chip" key={tool}>
            {tool}
          </span>
        ))}
        {hiddenChips > 0 ? <span className="tech-chip tech-chip-more">+{hiddenChips}</span> : null}
      </div>

      <div className="mt-auto flex items-center gap-3 pt-6">
        <button type="button" className="project-link" onClick={onOpen}>
          Ver detalhes técnicos
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
        {project.link ? (
          <a
            className="icon-link"
            href={project.link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.link.label}: ${project.title}`}
            title={project.link.label}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}
