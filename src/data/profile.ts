import {
  Bot,
  BrainCircuit,
  ChartNoAxesCombined,
  ClipboardCheck,
  Code2,
  Database,
  FileSearch,
  Github,
  Keyboard,
  Landmark,
  LockKeyhole,
  Mail,
  Phone,
  ServerCog,
  ShieldCheck,
  Tent,
  Trophy,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Stack", href: "#stack" },
  { label: "Trajetória", href: "#trajetoria" },
  { label: "Cursos", href: "#cursos" },
  { label: "Ayra", href: "#ayra" },
  { label: "Contato", href: "#contato" },
];

export const profilePhoto =
  "https://i.ibb.co/bgDtkJvb/a1bf6a05-fffc-4823-8dfd-a3caff407637.jpg";

export const heroRoles = ["sistemas web", "automações", "IA aplicada", "APIs e dados"];

export const heroStats = [
  { value: 5, suffix: "+", label: "anos em tecnologia" },
  { value: 9, suffix: "", label: "projetos no portfólio" },
  { value: 3, suffix: "", label: "sistemas web no ar" },
  { value: 8, suffix: "º", label: "período de Ciência da Computação" },
];

export const terminalLines = [
  { command: "whoami", output: "josé gabriel · full-stack · dados · automação · IA" },
  { command: "cat foco.txt", output: "sistemas que resolvem problemas reais, com regra clara e dado seguro" },
  { command: "ls projetos/ --em-producao", output: "pss-comurg-2026  pelada  reconnect" },
];

export const principles = [
  {
    title: "A IA extrai, o código decide",
    text: "Uso IA para ler documentos e acelerar tarefas, mas notas, regras e decisões ficam em código testado e auditável.",
    icon: BrainCircuit,
  },
  {
    title: "Segurança desde o banco",
    text: "Row Level Security, auditoria imutável, segredos só no servidor e LGPD pensada desde o primeiro rascunho.",
    icon: LockKeyhole,
  },
  {
    title: "Feito para quem usa",
    text: "Mobile first, mensagens claras e fluxo simples. Minha base em suporte me ensinou a enxergar o usuário real.",
    icon: Users,
  },
];

export const journeySteps = [
  { label: "Infraestrutura", detail: "redes, servidores, AD, backup" },
  { label: "Controladoria", detail: "indicadores e dados financeiros" },
  { label: "Automação", detail: "Power Platform, Python, N8N" },
  { label: "Service Desk", detail: "usuário, SLA e incidentes" },
  { label: "Desenvolvimento", detail: "sistemas full-stack com IA" },
];

export type ProjectCategory = "web" | "ia" | "automacao" | "dados";

export type Project = {
  id: string;
  title: string;
  org?: string;
  status: string;
  statusTone: "live" | "build" | "proto";
  icon: LucideIcon;
  categories: ProjectCategory[];
  summary: string;
  problem: string;
  solution: string;
  highlights: string[];
  architecture: string[];
  stack: string[];
  numbers?: Array<{ value: string; label: string }>;
  link?: { label: string; href: string };
  featured?: boolean;
};

export const projectFilters: Array<{ id: "todos" | ProjectCategory; label: string }> = [
  { id: "todos", label: "Todos" },
  { id: "web", label: "Web full-stack" },
  { id: "ia", label: "IA aplicada" },
  { id: "automacao", label: "Automação" },
  { id: "dados", label: "Dados e regras" },
];

export const projects: Project[] = [
  {
    id: "pss-comurg",
    title: "PSS COMURG 2026",
    org: "COMURG",
    status: "Em produção",
    statusTone: "live",
    icon: Landmark,
    categories: ["web", "ia", "dados"],
    featured: true,
    summary:
      "Plataforma oficial do processo seletivo da COMURG: inscrição online em 8 etapas, pontuação curricular automática e um painel completo para a Comissão conduzir todo o processo.",
    problem:
      "Conduzir um processo seletivo público com regras rígidas de edital, prazos legais, recursos e dados sensíveis, de forma auditável e com resultado reproduzível.",
    solution:
      "Portal do candidato e painel da Comissão no mesmo app Next.js. As regras de negócio vivem dentro do Postgres, e a IA só sugere dados para conferência humana.",
    highlights: [
      "Motor de pontuação determinístico em SQL, versionado, com espelho individual da nota para cada candidato",
      "Row Level Security em todas as tabelas, auditoria imutável e trava de prazo no servidor",
      "Leitura de currículos e documentos com OpenAI para pré-preencher o formulário: a IA extrai, o código pontua",
      "Login do candidato por código no e-mail e acesso da Comissão por convite com verificação em duas etapas",
      "Relatórios em Excel e PDF, migrações com reversão e testes SQL que rodam em transação desfeita",
    ],
    architecture: ["Next.js 16 · App Router", "Supabase Auth + Storage", "Postgres 17 · RLS · funções SQL", "OpenAI (extração)", "Netlify"],
    stack: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "OpenAI", "Netlify"],
    numbers: [
      { value: "115", label: "funções SQL" },
      { value: "~80", label: "migrações" },
      { value: "30", label: "suítes de teste" },
      { value: "8", label: "etapas de inscrição" },
    ],
    link: { label: "Abrir o portal", href: "https://pss-comurg-2026.netlify.app" },
  },
  {
    id: "sei-comurg",
    title: "Integração SEI",
    org: "COMURG",
    status: "Em implantação",
    statusTone: "build",
    icon: FileSearch,
    categories: ["ia", "automacao", "web"],
    summary:
      "Acompanha os processos públicos do SEI, resume cada documento com IA e avisa por e-mail as unidades da COMURG assim que um processo chega.",
    problem:
      "As unidades descobriam processos tarde e precisavam abrir documento por documento para entender do que se tratava.",
    solution:
      "Um worker verifica o SEI periodicamente, lê os documentos (texto, digitalizado, planilha), gera um resumo e dispara o aviso para os destinatários certos.",
    highlights: [
      "Conector de navegador com Playwright que lê o SEI em modo somente leitura, sem alterar nada no sistema",
      "Conectores intercambiáveis: navegador, Web Service SOAP ou um SEI simulado para testes e demonstração",
      "Resumos com OpenAI e plano B automático: sem chave, usa as primeiras frases do documento",
      "Administração com perfis, unidades e importação de usuários por planilha",
      "Testes com pytest que rodam sem internet, sem OpenAI e sem SEI; instalação como serviço do Windows",
    ],
    architecture: ["React + Vite", "API FastAPI", "Worker de verificação", "Conectores SEI (Playwright · SOAP)", "OpenAI + SMTP"],
    stack: ["Python", "FastAPI", "Playwright", "React", "TypeScript", "Vite", "OpenAI", "pytest"],
  },
  {
    id: "poi-comurg",
    title: "POI · Oportunidade Interna",
    org: "COMURG",
    status: "Protótipo",
    statusTone: "proto",
    icon: ClipboardCheck,
    categories: ["web", "ia", "dados"],
    summary:
      "Sistema para os processos de oportunidade interna: o colaborador se inscreve, a IA lê os comprovantes e regras fixas calculam a pontuação, com classificação e desempate automáticos.",
    problem:
      "Conferir manualmente a formação de cada colaborador, lançar notas da prova e montar a classificação levava tempo e abria espaço para erro.",
    solution:
      "Fluxo guiado para o candidato e painel para o RH, com a pontuação feita por regras testadas e a comissão intervindo só quando há erro.",
    highlights: [
      "Protótipo navegável do candidato e do RH em React 19 com TypeScript em modo estrito",
      "Semáforo de confiabilidade por documento (verde, amarelo, vermelho) com alertas para a comissão",
      "Importação de conceitos por planilha .xlsx, com relatório das linhas rejeitadas e CPF validado",
      "Classificação final com nota mínima e desempate por tempo de serviço e idade",
      "Desenhado para a LGPD: CPF guardado só como hash e mascarado nas telas",
    ],
    architecture: ["React 19 + Vite 8", "Regras em TypeScript puro", "Supabase + Edge Functions", "OpenAI (só extração)"],
    stack: ["React", "TypeScript", "Vite", "Excel (.xlsx)", "Supabase", "OpenAI"],
  },
  {
    id: "pelada",
    title: "Pelada · Gestão de futebol",
    status: "No ar",
    statusTone: "live",
    icon: Trophy,
    categories: ["web", "dados"],
    summary:
      "App mobile first para organizar a pelada: chegada dos jogadores, sorteio equilibrado, fila, cronômetro, placar em tempo real e ranking da temporada.",
    problem:
      "Sorteio injusto, fila confusa e placar anotado no papel. Ninguém sabia quem era o próximo nem quem estava artilheiro.",
    solution:
      "O administrador controla tudo pelo celular e os jogadores acompanham ao vivo com um código de 5 caracteres.",
    highlights: [
      "Sorteio que testa 2.000 combinações e escolhe a de menor desequilíbrio de nível entre os times",
      "Placar e cronômetro sincronizados em todos os celulares via Supabase Realtime (SSE no modo local)",
      "Controle otimista de concorrência com versão e novas tentativas automáticas",
      "Zero dependências npm: regras de negócio em funções puras, testadas com node:test",
      "Perfis de administrador (token HMAC) e espectador com acesso somente leitura",
    ],
    architecture: ["SPA em JavaScript puro", "Netlify Functions", "Supabase (jsonb + RLS)", "Realtime broadcast"],
    stack: ["JavaScript", "Node.js", "Netlify Functions", "Supabase", "Realtime", "node:test"],
  },
  {
    id: "reconnect",
    title: "RECONNECT · Retiro de Jovens",
    status: "No ar",
    statusTone: "live",
    icon: Tent,
    categories: ["web", "automacao"],
    summary:
      "Portal do retiro: site do evento, inscrição de vários participantes, pagamento por Pix, crediário ou cartão, consulta pública e painel administrativo.",
    problem:
      "Inscrições e pagamentos espalhados em conversas e planilhas, sem controle de vagas nem visão clara de quem já pagou.",
    solution:
      "Um portal único com cálculo de preço, link de pagamento, confirmação automática pelo cartão e painel para os responsáveis de cada distrito.",
    highlights: [
      "Regra de preço compartilhada entre navegador e servidor: o valor exibido é o mesmo validado e gravado",
      "Checkout da InfinitePay com webhook conferido na API antes de confirmar qualquer pagamento",
      "Controle de vagas com aviso de últimas vagas e bloqueio no servidor quando esgota",
      "Painel com Supabase Auth, renovação de sessão, exportação CSV e gestão de usuários",
      "Dados de saúde e de emergência nunca aparecem na consulta pública",
    ],
    architecture: ["HTML, CSS e JS", "Netlify Functions", "Supabase (Postgres + Auth)", "InfinitePay (checkout + webhook)"],
    stack: ["JavaScript", "Node.js", "Netlify Functions", "Supabase", "InfinitePay", "Webhooks"],
  },
  {
    id: "melhorar-texto",
    title: "Melhorar Texto com IA",
    status: "Em uso",
    statusTone: "live",
    icon: Keyboard,
    categories: ["ia", "automacao"],
    summary:
      "Selecione um texto em qualquer programa do Windows, aperte Ctrl+Alt+Espaço e ele volta revisado pela IA no mesmo lugar.",
    problem:
      "Revisar e-mails e documentos exigia copiar, abrir outra ferramenta, colar e voltar. Muitos passos para algo que se faz o dia todo.",
    solution:
      "Um atalho global que captura a seleção, envia para a OpenAI e cola a versão melhorada, sem sair do app em que você está.",
    highlights: [
      "Atalho global que funciona no navegador, no Word, no bloco de notas e em qualquer outro app",
      "Ícone na bandeja do sistema que muda de cor enquanto processa",
      "Roda em segundo plano, sem janela, e pode iniciar junto com o Windows",
      "Modelo e atalho configuráveis por variável de ambiente",
    ],
    architecture: ["Atalho global", "Área de transferência", "OpenAI API", "Texto revisado colado"],
    stack: ["Python", "OpenAI API", "Windows"],
  },
];

export const labProjects = [
  {
    title: "Gerenciador de Agenda com N8N",
    status: "Em desenvolvimento",
    icon: Bot,
    detail:
      "Automação que conecta WhatsApp, ChatGPT, N8N e Google Agenda para organizar e agendar reuniões por conversa.",
    stack: ["N8N", "Google Agenda", "ChatGPT", "WhatsApp"],
  },
  {
    title: "Portfólio de Projetos Power BI",
    status: "Em atualização",
    icon: ChartNoAxesCombined,
    detail:
      "Dashboards em Power BI com contexto, tratamentos realizados e acesso à visualização de cada projeto.",
    stack: ["Power BI", "Power Query", "DAX", "Modelagem de Dados"],
    type: "power-bi",
  },
  {
    title: "Site Financeiro",
    status: "Em evolução",
    icon: Database,
    detail: "Aplicação web para controle financeiro, visões gerenciais e organização de rotinas financeiras.",
    stack: ["React", "TypeScript", "Node.js"],
  },
];

export const powerBiProjects: Array<{
  title: string;
  status: string;
  description: string;
  dashboardUrl?: string;
}> = [
  {
    title: "Dashboard de Indicadores Financeiros",
    status: "Em atualização",
    description:
      "Dashboard voltado ao acompanhamento de indicadores financeiros. Os detalhes dos tratamentos, modelagem e métricas serão publicados nesta área conforme o projeto evoluir.",
    dashboardUrl: undefined,
  },
];

export const stackGroups = [
  {
    title: "Front-end",
    icon: Code2,
    tone: "neon",
    tools: ["React", "TypeScript", "Next.js", "Vite", "Tailwind CSS", "HTML, CSS e JS", "framer-motion"],
  },
  {
    title: "Back-end e APIs",
    icon: ServerCog,
    tone: "primary",
    tools: ["Node.js", "Python", "FastAPI", "Express", "Netlify Functions", "Webhooks", "SSE e Realtime"],
  },
  {
    title: "Banco e dados",
    icon: Database,
    tone: "data",
    tools: ["PostgreSQL", "Supabase", "Row Level Security", "SQL", "Power BI", "Excel avançado"],
  },
  {
    title: "IA aplicada",
    icon: BrainCircuit,
    tone: "ai",
    tools: ["OpenAI API", "Extração de documentos", "Resumos automáticos", "Engenharia de prompt", "Agentes com N8N"],
  },
  {
    title: "Automação",
    icon: Workflow,
    tone: "neon",
    tools: ["Playwright", "Power Automate", "Power Apps", "N8N", "SharePoint", "Scripts Python"],
  },
  {
    title: "Infra, segurança e qualidade",
    icon: ShieldCheck,
    tone: "data",
    tools: ["Netlify", "Supabase Auth", "LGPD", "Git e GitHub", "pytest e node:test", "Microsoft 365", "Active Directory"],
  },
] as const;

export const marqueeTools = [
  "Next.js",
  "React",
  "TypeScript",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Supabase",
  "OpenAI",
  "Playwright",
  "Node.js",
  "Tailwind CSS",
  "Netlify",
  "Power BI",
  "Power Automate",
  "N8N",
  "Git",
];

export const marqueeConcepts = [
  "Row Level Security",
  "Webhooks",
  "Tempo real",
  "LGPD",
  "Testes automatizados",
  "Serverless",
  "Extração com IA",
  "Auditoria",
  "APIs REST",
  "Engenharia de prompt",
];

export const experiences = [
  {
    role: "Desenvolvimento de Sistemas e Automação",
    period: "Ago. 2026 - Atual",
    scope: "COMURG · Companhia de Urbanização de Goiânia",
    current: true,
    items: ["Next.js", "Supabase", "PostgreSQL", "Python", "FastAPI", "OpenAI"],
    impact:
      "Desenvolvo sistemas internos e portais públicos: o portal oficial do PSS 2026, a integração com o SEI e o sistema de Oportunidade Interna, unindo regras de negócio, dados, segurança e IA aplicada.",
  },
  {
    role: "Analista de Service Desk",
    period: "Out. 2025 - Jul. 2026",
    scope: "Ministério Público de Goiás · Sonda",
    items: ["Suporte N1", "Atendimento a chamados", "Triagem de incidentes", "SLAs"],
    impact:
      "Primeiro ponto de contato dos usuários, com suporte de nível 1, resolução de problemas, escalonamento de incidentes e acompanhamento de SLAs.",
  },
  {
    role: "Assistente em Soluções e Automação Empresarial",
    period: "2024 - 2025",
    scope: "Grupo Planning",
    items: ["Power Apps", "Power Automate", "Python", "SharePoint", "Transformação digital"],
    impact:
      "Digitalizei processos, criei automações e entreguei ferramentas que reduziram retrabalho operacional.",
  },
  {
    role: "Assistente de Controladoria",
    period: "2023 - 2024",
    scope: "Grupo Planning",
    items: ["Relatórios financeiros", "Integração de sistemas", "Indicadores", "Análise de dados"],
    impact:
      "Aproximei tecnologia e negócio trabalhando com indicadores, rotinas financeiras e integração de informações.",
  },
  {
    role: "Assistente de TI",
    period: "2021 - 2023",
    scope: "Grupo Planning",
    items: ["Active Directory", "VPN e firewall", "Backup", "SharePoint", "Servidores"],
    impact: "Sustentação do ambiente corporativo, com foco em segurança, disponibilidade e atendimento interno.",
  },
  {
    role: "Estagiário de TI",
    period: "2021",
    scope: "Grupo Planning",
    items: ["E-mails corporativos", "DNS", "Office 365", "Hardware e software"],
    impact: "Primeiro contato com a operação de TI corporativa e com o suporte ao usuário.",
  },
];

export const education = {
  course: "Ciência da Computação",
  status: "8º período",
  detail: "Foco em desenvolvimento, dados, arquitetura de soluções e inteligência artificial.",
};

export const courseGroups = [
  {
    category: "IA e automação",
    icon: BrainCircuit,
    courses: [
      { name: "Agentes de IA com N8N", provider: "Hashtag" },
      { name: "APIs de Inteligência Artificial", provider: "Hashtag" },
      { name: "Power Automate Impressionador", provider: "Hashtag" },
      { name: "Power Apps: Aplicações Práticas", provider: "Hashtag" },
    ],
  },
  {
    category: "Dados, produtividade e design",
    icon: ChartNoAxesCombined,
    courses: [
      { name: "Excel para Contadores", provider: "CEFIS" },
      { name: "Figma", provider: "Hashtag" },
      { name: "Técnicas de Aprendizagem e Produtividade", provider: "Hashtag" },
      { name: "Comunicação Eficaz", provider: "Hashtag" },
    ],
  },
  {
    category: "Desenvolvimento e colaboração",
    icon: Code2,
    courses: [
      { name: "Git e GitHub", provider: "Hashtag" },
      { name: "SharePoint", provider: "Fundação Bradesco" },
    ],
  },
  {
    category: "Infraestrutura, segurança e LGPD",
    icon: ShieldCheck,
    courses: [
      { name: "Segurança em Tecnologia da Informação", provider: "Fundação Bradesco" },
      { name: "DPO & LGPD na Prática", provider: "KA Solution" },
      { name: "LGPD na Prática", provider: "Udemy" },
      { name: "Introdução a Redes de Computadores", provider: "Fundação Bradesco" },
      { name: "Fundamentos de TI (Hardware e Software)", provider: "Fundação Bradesco" },
    ],
  },
];

export const resumeDownloadUrl =
  "https://drive.google.com/uc?export=download&id=1IIcOzw0rAcTNCBEDBNfbJW_TzbtfPSQ_";

export const contactEmail = "jose.gabrielpo422@gmail.com";

export const contactLinks = [
  { label: "E-mail", value: contactEmail, href: `mailto:${contactEmail}`, icon: Mail },
  { label: "WhatsApp", value: "Conversar agora", href: "https://wa.me/5562998521394", icon: Phone },
  { label: "GitHub", value: "github.com/josesilva422", href: "https://github.com/josesilva422", icon: Github },
];

export const ayraEndpoint = "/chat";
export const ayraHealthEndpoint = "/health";

export const ayraSuggestions = [
  "Quais projetos o José já colocou em produção?",
  "Como funciona o PSS COMURG?",
  "Quais tecnologias ele domina?",
  "Como falar com ele?",
];
