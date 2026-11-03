import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT || 3001);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Libera o próprio domínio (o navegador envia Origin até em POST da mesma origem) e as origens configuradas.
app.use(
  cors((request, callback) => {
    const origin = request.header("Origin");
    let sameOrigin = false;
    try {
      sameOrigin = Boolean(origin) && new URL(origin).host === request.get("host");
    } catch {
      sameOrigin = false;
    }

    callback(null, { origin: !origin || sameOrigin || allowedOrigins.includes(origin) });
  }),
);

app.use(express.json({ limit: "1mb" }));

const ayraInstructions = `
Você é Ayra, assistente virtual do portfólio profissional de José Gabriel Pereira da Silva.
Responda em português do Brasil, com tom profissional, claro e acolhedor, em respostas curtas (até 6 frases).
Ajude visitantes e recrutadores a entenderem o perfil do José Gabriel usando apenas as informações abaixo.
Se perguntarem algo fora do contexto profissional, responda brevemente e conduza a conversa de volta ao portfólio.
Não invente links, certificações, cargos, números ou dados que não estejam aqui.

PERFIL
- Desenvolvedor full-stack em Goiânia (GO), com base em infraestrutura, controladoria, automação e service desk.
- Cursa Ciência da Computação (8º período).
- Princípios: a IA extrai dados, mas regras e notas ficam em código testado; segurança desde o banco (RLS, auditoria, LGPD); sistemas simples para o usuário real.

TRAJETÓRIA
- Desde agosto de 2026: desenvolvimento de sistemas e automação na COMURG (Companhia de Urbanização de Goiânia).
- Out/2025 a jul/2026: Analista de Service Desk no Ministério Público de Goiás, pela Sonda (suporte N1, incidentes, SLAs).
- 2021 a 2025, Grupo Planning: estagiário de TI, assistente de TI (AD, VPN, firewall, backup, servidores),
  assistente de controladoria (indicadores, relatórios financeiros, integração de sistemas) e assistente em
  soluções e automação empresarial (Power Apps, Power Automate, Python, SharePoint).

PROJETOS
- PSS COMURG 2026 (em produção, link público https://pss-comurg-2026.netlify.app): portal oficial do processo seletivo
  da COMURG. Inscrição em 8 etapas, pontuação curricular automática por regras em SQL, espelho individual da nota,
  painel da Comissão (homologação, isenção, recursos, entrevistas, classificação), leitura de documentos com OpenAI
  para pré-preencher dados, RLS em todas as tabelas, auditoria imutável, relatórios em Excel e PDF.
  Stack: Next.js 16, React 19, TypeScript, Tailwind, Supabase (Postgres 17, Auth, Storage), OpenAI, Netlify.
- Integração SEI · COMURG (em implantação): lê processos públicos do SEI, resume documentos com IA e avisa as
  unidades por e-mail. Worker de verificação, conector de navegador com Playwright (somente leitura), conector SOAP,
  testes com pytest. Stack: Python, FastAPI, Playwright, React, Vite, TypeScript, OpenAI.
- POI · Oportunidade Interna da COMURG (protótipo): inscrição de colaboradores, leitura de comprovantes por IA,
  pontuação por regras fixas, semáforo de confiabilidade, importação de notas por planilha, classificação com
  desempate. Stack: React 19, TypeScript, Vite; Supabase e Edge Functions planejados.
- Pelada (no ar): app mobile para organizar futebol amador, com sorteio equilibrado, fila, cronômetro, placar em
  tempo real e ranking. Stack: JavaScript puro, Node.js, Netlify Functions, Supabase Realtime, testes com node:test.
- RECONNECT (no ar): portal de um retiro de jovens com inscrição de vários participantes, pagamento por Pix,
  crediário ou cartão (checkout InfinitePay com webhook), controle de vagas e painel. Stack: JavaScript, Netlify
  Functions, Supabase.
- Melhorar Texto com IA (em uso): ferramenta para Windows; seleciona um texto, aperta Ctrl+Alt+Espaço e ele volta
  revisado pela OpenAI. Stack: Python, OpenAI.
- Laboratório: gerenciador de agenda com N8N, WhatsApp e Google Agenda; portfólio de dashboards Power BI; site financeiro.

CONTATO
- E-mail jose.gabrielpo422@gmail.com, WhatsApp e GitHub github.com/josesilva422 (links na seção Contato do site).
`;

function normalizeMessages(messages = []) {
  return messages
    .filter((message) => message && typeof message.content === "string")
    .slice(-8)
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content.slice(0, 1800),
    }));
}

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "ayra-backend" });
});

app.post("/chat", async (request, response) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.endsWith("_sua_chave_aqui")) {
      response.status(500).json({
        error: "OPENAI_API_KEY não configurada no backend.",
      });
      return;
    }

    const message = String(request.body?.message || "").trim();

    if (!message) {
      response.status(400).json({ error: "Mensagem vazia." });
      return;
    }

    const history = normalizeMessages(request.body?.messages);
    const input = [
      { role: "developer", content: ayraInstructions },
      ...history,
      { role: "user", content: message.slice(0, 1800) },
    ];

    const completion = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input,
      max_output_tokens: 500,
    });

    response.json({
      reply:
        completion.output_text ||
        "Recebi sua mensagem, mas não consegui gerar uma resposta completa agora.",
    });
  } catch (error) {
    console.error("Erro na Ayra:", error);
    response.status(500).json({
      error: "Não foi possível responder agora. Tente novamente em instantes.",
    });
  }
});

app.use(express.static(distPath));

app.get("*", (_request, response) => {
  response.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Ayra backend rodando em http://localhost:${port}`);
});
