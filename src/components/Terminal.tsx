import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type TerminalLine = {
  command: string;
  output: string;
};

function Prompt({ command, cursor = false }: { command: string; cursor?: boolean }) {
  return (
    <p>
      <span className="text-data-soft">➜</span> <span className="text-neon">~</span>{" "}
      <span className="text-text">{command}</span>
      {cursor ? <span className="terminal-cursor" /> : null}
    </p>
  );
}

export function Terminal({ lines, className = "" }: { lines: TerminalLine[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (reduceMotion) {
      setLineIndex(lines.length);
      return;
    }

    if (lineIndex >= lines.length) {
      return;
    }

    const command = lines[lineIndex].command;
    let timeout: number;

    if (typed < command.length) {
      timeout = window.setTimeout(() => setTyped(typed + 1), 55);
    } else if (!showOutput) {
      timeout = window.setTimeout(() => setShowOutput(true), 260);
    } else {
      timeout = window.setTimeout(() => {
        setLineIndex(lineIndex + 1);
        setTyped(0);
        setShowOutput(false);
      }, 700);
    }

    return () => window.clearTimeout(timeout);
  }, [inView, lineIndex, lines, reduceMotion, showOutput, typed]);

  const finished = lineIndex >= lines.length;

  return (
    <div ref={ref} className={`terminal ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-muted">~/jose-gabriel</span>
      </div>

      {/* A cópia invisível reserva a altura final e é a versão lida por leitores de tela. */}
      <div className="grid px-4 py-4 font-mono text-[0.8rem] leading-6">
        <div className="col-start-1 row-start-1 space-y-2 opacity-0">
          {lines.map((line) => (
            <div key={line.command}>
              <Prompt command={line.command} />
              <p>{line.output}</p>
            </div>
          ))}
          <Prompt command="" />
        </div>

        <div className="col-start-1 row-start-1 space-y-2" aria-hidden="true">
          {lines.slice(0, lineIndex).map((line) => (
            <div key={line.command}>
              <Prompt command={line.command} />
              <p className="text-soft">{line.output}</p>
            </div>
          ))}
          {finished ? (
            <Prompt command="" cursor />
          ) : (
            <div>
              <Prompt command={lines[lineIndex].command.slice(0, typed)} cursor={!showOutput} />
              {showOutput ? <p className="text-soft">{lines[lineIndex].output}</p> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
