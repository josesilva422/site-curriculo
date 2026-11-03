import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import { ayraEndpoint, ayraHealthEndpoint, ayraSuggestions } from "../data/profile";
import { answerOffline } from "./ayraOffline";

type Message = {
  role: "user" | "assistant";
  content: string;
  offline?: boolean;
};

type Status = "checking" | "online" | "offline";

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Olá, eu sou a Ayra. Posso contar sobre os projetos do José Gabriel, as tecnologias que ele usa e a trajetória dele. Por onde quer começar?",
  },
];

const statusLabel: Record<Status, string> = {
  checking: "Conectando",
  online: "Online",
  offline: "Modo offline",
};

const statusClass: Record<Status, string> = {
  checking: "border-white/15 bg-white/5 text-muted",
  online: "border-data/30 bg-data/10 text-data-soft",
  offline: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

export function AyraChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>("checking");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        const response = await fetch(ayraHealthEndpoint, { headers: { Accept: "application/json" } });
        const data: unknown = await response.json();
        const ok = typeof data === "object" && data !== null && (data as { ok?: unknown }).ok === true;
        if (!cancelled) setStatus(response.ok && ok ? "online" : "offline");
      } catch {
        if (!cancelled) setStatus("offline");
      }
    }

    checkHealth();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  async function ask(prompt: string) {
    if (!prompt || isLoading) {
      return;
    }

    const nextMessages: Message[] = [...messages, { role: "user", content: prompt }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      if (status === "offline") {
        throw new Error("Ayra offline");
      }

      const response = await fetch(ayraEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Ayra indisponível");
      }

      const data: unknown = await response.json();
      const answer =
        typeof data === "object" && data !== null && "reply" in data
          ? String((data as { reply: unknown }).reply)
          : null;

      if (!answer) {
        throw new Error("Resposta vazia");
      }

      setStatus("online");
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
    } catch {
      setStatus("offline");
      // Simula um pequeno tempo de resposta para a conversa não parecer instantânea demais.
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      setMessages((current) => [...current, { role: "assistant", content: answerOffline(prompt), offline: true }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input.trim());
    inputRef.current?.focus();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"
    >
      <div className="glass-panel relative overflow-hidden p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.22),transparent_38%),radial-gradient(circle_at_70%_70%,rgba(124,58,237,0.2),transparent_35%)]" />
        <div className="relative flex min-h-[340px] flex-col items-center justify-center text-center">
          <div className="avatar-core relative grid h-36 w-36 place-items-center rounded-full border border-neon/40 bg-space/80 shadow-glow">
            <Bot className="h-16 w-16 text-neon" aria-hidden="true" />
            <span
              className={`absolute right-6 top-7 h-4 w-4 rounded-full ${
                status === "online"
                  ? "bg-data shadow-[0_0_18px_rgba(16,185,129,0.9)]"
                  : status === "offline"
                    ? "bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.8)]"
                    : "bg-slate-500"
              }`}
            />
          </div>
          <h3 className="mt-8 font-display text-3xl font-semibold text-text">Ayra</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-soft">
            Assistente de IA que conhece o meu portfólio: projetos, tecnologias, trajetória e contato.
          </p>
          <div className={`mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${statusClass[status]}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {statusLabel[status]}
          </div>
          {status === "offline" ? (
            <p className="mt-3 max-w-xs text-xs leading-5 text-muted">
              O servidor de IA não está respondendo. Enquanto isso, respondo com base nas informações do site.
            </p>
          ) : null}
        </div>
      </div>

      <div className="glass-panel flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-neon/10 text-neon">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-text">Chat com a Ayra</h3>
              <p className="text-xs text-muted">Pergunte sobre o portfólio</p>
            </div>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs ${statusClass[status]}`}>{statusLabel[status]}</span>
        </div>

        <div className="flex h-[440px] flex-col">
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                key={`${message.role}-${index}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-gradient-to-br from-primary to-indigo-500 text-white"
                      : "rounded-bl-md border border-white/10 bg-white/[0.06] text-slate-100"
                  }`}
                >
                  {message.content}
                  {message.offline ? (
                    <span className="mt-2 block font-mono text-[0.68rem] text-muted">resposta automática · modo offline</span>
                  ) : null}
                </div>
              </div>
            ))}
            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3">
                  <span className="typing-dots" aria-label="Ayra está digitando">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {messages.length <= 2 ? (
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              {ayraSuggestions.map((suggestion) => (
                <button
                  type="button"
                  className="ayra-suggestion"
                  key={suggestion}
                  disabled={isLoading}
                  onClick={() => ask(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}

          <form className="flex gap-3 border-t border-white/10 p-4" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-space/70 px-4 py-3 text-sm text-text outline-none transition focus:border-neon/70 focus:ring-2 focus:ring-neon/20"
              placeholder="Pergunte para a Ayra..."
              aria-label="Mensagem para a Ayra"
              maxLength={600}
            />
            <button
              type="submit"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-neon text-space transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-neon/60 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading || input.trim() === ""}
              aria-label="Enviar mensagem"
            >
              <Send className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
