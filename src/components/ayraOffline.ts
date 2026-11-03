import { contactEmail, education, experiences, projects, stackGroups } from "../data/profile";

// Respostas montadas a partir do próprio portfólio, usadas quando o backend da Ayra não responde.

const projectKeywords: Record<string, string[]> = {
  "pss-comurg": ["pss", "processo seletivo", "inscricao", "curricular", "edital"],
  "sei-comurg": ["sei"],
  "poi-comurg": ["poi", "oportunidade interna"],
  pelada: ["pelada", "futebol", "sorteio"],
  reconnect: ["reconnect", "retiro"],
  "melhorar-texto": ["melhorar texto", "atalho", "ctrl", "revisar texto"],
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Compara pelo início da palavra, para "curso" não casar com "recurso".
function hasAny(text: string, words: string[]) {
  return words.some((word) => new RegExp(`(^|[^a-z])${word}`).test(text));
}

export function answerOffline(question: string) {
  const text = normalize(question);

  const project = projects.find((item) => hasAny(text, projectKeywords[item.id] ?? []));
  if (project) {
    const org = project.org ? ` (${project.org})` : "";
    return `${project.title}${org}, ${project.status.toLowerCase()}: ${project.summary} Stack principal: ${project.stack.join(", ")}. Clique em "Ver detalhes técnicos" no card do projeto para ver arquitetura e destaques.`;
  }

  if (hasAny(text, ["projeto", "producao", "portfolio", "sistema", "fez", "construiu"])) {
    const live = projects.filter((item) => item.statusTone === "live").map((item) => item.title);
    const others = projects
      .filter((item) => item.statusTone !== "live")
      .map((item) => `${item.title} (${item.status.toLowerCase()})`);
    return `Em produção ou em uso: ${live.join(", ")}. Em andamento: ${others.join(", ")}. O destaque é o PSS COMURG 2026, portal oficial de um processo seletivo público com pontuação automática e painel da Comissão.`;
  }

  if (hasAny(text, ["tecnolog", "stack", "domina", "ferramenta", "linguag", "framework", "sabe"])) {
    return stackGroups.map((group) => `${group.title}: ${group.tools.slice(0, 5).join(", ")}`).join(". ") + ".";
  }

  if (hasAny(text, ["experienc", "trabalh", "carreira", "cargo", "empresa", "comurg", "trajetoria"])) {
    const [current, ...previous] = experiences;
    return `Hoje: ${current.role} na ${current.scope} (${current.period}). ${current.impact} Antes disso: ${previous
      .slice(0, 3)
      .map((item) => `${item.role} (${item.scope.split(" · ")[0]})`)
      .join(", ")}, entre outras funções em TI desde 2021.`;
  }

  if (hasAny(text, ["contato", "email", "e-mail", "whatsapp", "falar", "contratar", "linkedin", "github"])) {
    return `Você pode falar com o José pelo e-mail ${contactEmail}, pelo WhatsApp ou pelo GitHub (github.com/josesilva422). Os links estão na seção Contato, no fim da página.`;
  }

  if (hasAny(text, ["formac", "faculdade", "estud", "curso", "graduac"])) {
    return `${education.course}, ${education.status}. ${education.detail} Ele também tem cursos de IA com N8N, APIs de IA, Power Platform, Git, segurança da informação e LGPD.`;
  }

  return "Posso contar sobre os projetos (PSS COMURG, Integração SEI, POI, Pelada, RECONNECT), as tecnologias que o José usa, a trajetória dele ou como entrar em contato. O que você quer saber?";
}
