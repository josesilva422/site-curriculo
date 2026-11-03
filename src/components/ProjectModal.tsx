import { useRef, useState } from "react";
import { BarChart3, CheckCircle2, ChevronRight, ExternalLink, Lightbulb, Target } from "lucide-react";
import { powerBiProjects, type Project } from "../data/profile";
import { Modal, ModalCloseButton } from "./Modal";
import { StatusPill } from "./Projects";

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  // Guarda o último projeto para o conteúdo não sumir durante a animação de saída.
  const lastProject = useRef(project);
  if (project) {
    lastProject.current = project;
  }
  const shown = lastProject.current;

  return (
    <Modal open={project !== null} onClose={onClose} labelledBy="project-modal-title" className="max-w-4xl">
      {shown ? <ProjectDetails project={shown} onClose={onClose} /> : null}
    </Modal>
  );
}

function ProjectDetails({ project, onClose }: { project: Project; onClose: () => void }) {
  const Icon = project.icon;

  return (
    <>
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-panel/95 px-5 py-5 backdrop-blur-xl sm:px-8">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-neon/30 bg-neon/10 text-neon">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={project.statusTone}>{project.status}</StatusPill>
              {project.org ? <span className="font-mono text-xs text-muted">{project.org}</span> : null}
            </div>
            <h2 id="project-modal-title" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              {project.title}
            </h2>
          </div>
        </div>
        <ModalCloseButton onClose={onClose} label="Fechar detalhes do projeto" />
      </header>

      <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-base leading-8 text-soft">{project.summary}</p>

        {project.numbers ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {project.numbers.map((number) => (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4" key={number.label}>
                <strong className="block font-display text-2xl text-neon">{number.value}</strong>
                <span className="text-xs text-muted">{number.label}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">
              <Target className="h-4 w-4" aria-hidden="true" />
              O problema
            </h3>
            <p className="mt-3 text-sm leading-7 text-soft">{project.problem}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-data-soft">
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              A solução
            </h3>
            <p className="mt-3 text-sm leading-7 text-soft">{project.solution}</p>
          </div>
        </div>

        <div>
          <h3 className="modal-label">Arquitetura</h3>
          <ol className="mt-3 flex flex-wrap items-center gap-2">
            {project.architecture.map((layer, index) => (
              <li className="flex items-center gap-2" key={layer}>
                <span className="arch-node">{layer}</span>
                {index < project.architecture.length - 1 ? (
                  <ChevronRight className="h-4 w-4 text-neon/70" aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="modal-label">Destaques técnicos</h3>
          <ul className="mt-3 space-y-3">
            {project.highlights.map((highlight) => (
              <li className="flex gap-3 text-sm leading-7 text-soft" key={highlight}>
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-data-soft" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="modal-label">Stack</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tool) => (
                <span className="tech-chip" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
          {project.link ? (
            <a className="button-primary shrink-0" href={project.link.href} target="_blank" rel="noreferrer">
              {project.link.label}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}

export function PowerBiModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState(powerBiProjects[0]);

  return (
    <Modal open={open} onClose={onClose} labelledBy="power-bi-modal-title" className="max-w-3xl">
      <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-5">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-data-soft">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Projetos Power BI
          </span>
          <h2 id="power-bi-modal-title" className="mt-2 font-display text-2xl font-semibold">
            Selecione um dashboard
          </h2>
        </div>
        <ModalCloseButton onClose={onClose} label="Fechar projetos Power BI" />
      </div>

      <div className="grid min-h-[19rem] md:grid-cols-[0.8fr_1.2fr]">
        <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
          {powerBiProjects.map((project) => (
            <button
              type="button"
              key={project.title}
              className={`power-bi-option ${selected.title === project.title ? "is-active" : ""}`}
              onClick={() => setSelected(project)}
            >
              <strong>{project.title}</strong>
              <span>{project.status}</span>
            </button>
          ))}
        </div>
        <div className="p-6">
          <StatusPill tone="build">{selected.status}</StatusPill>
          <h3 className="mt-5 font-display text-2xl font-semibold">{selected.title}</h3>
          <p className="mt-4 text-sm leading-7 text-soft">{selected.description}</p>
          {selected.dashboardUrl ? (
            <a className="button-project mt-7" href={selected.dashboardUrl} target="_blank" rel="noreferrer">
              Visualizar dashboard
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <p className="mt-7 text-sm text-muted">Link do dashboard será incluído em breve.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
