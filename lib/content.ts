export type NavItem = {
  label: string;
  href: string;
  sectionId: string;
};

export type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
  items: string[];
  icon: ServiceIcon;
};

export type ServiceIcon =
  | "monitor"
  | "shopping-bag"
  | "cpu"
  | "store"
  | "calendar"
  | "whatsapp"
  | "workflow"
  | "wrench";

export type ProjectMedia = {
  poster: string;
  width: number;
  height: number;
  src?: string;
  duration?: string;
};

export type Project = {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  solution: string;
  code: string;
  media: ProjectMedia;
  href?: string;
};

export const navItems: NavItem[] = [
  { label: "Início", href: "/#inicio", sectionId: "inicio" },
  { label: "Projetos", href: "/#projetos", sectionId: "projetos" },
  { label: "Soluções", href: "/#solucoes", sectionId: "solucoes" },
  { label: "Sobre", href: "/#sobre", sectionId: "sobre" },
  { label: "Contato", href: "/#contato", sectionId: "contato" },
];

export const aboutCapabilities = [
  {
    title: "Desenvolvimento web",
    description: "Sites rápidos, responsivos e construídos para durar.",
  },
  {
    title: "Sistemas personalizados",
    description: "Ferramentas desenhadas para o jeito da sua operação.",
  },
  {
    title: "Automação de processos",
    description: "Menos tarefas repetitivas, mais tempo para o que importa.",
  },
  {
    title: "Experiências digitais",
    description: "Interfaces claras, coerentes e agradáveis de usar.",
  },
  {
    title: "Suporte e soluções tecnológicas",
    description: "Acompanhamento para a tecnologia continuar funcionando.",
  },
];

export const projects: Project[] = [
  {
    id: "sistema-gestao-pdv",
    index: "01",
    title: "Sistema de Gestão & PDV",
    category: "Sistema sob medida",
    description:
      "Vendas, estoque, caixa e indicadores em uma única base, com uma rotina simples para a equipe.",
    tags: ["Vendas", "Estoque", "Caixa"],
    solution: "sistemas-de-gestao-e-pdv",
    code: "SYS / 01",
    media: {
      src: "/image/PDV.mp4",
      poster: "/image/posters/pdv1.jpg",
      width: 1324,
      height: 597,
      duration: "00:54",
    },
    href: "https://pdv-vendas-balcao.vercel.app/",
  },
  {
    id: "catalogo-digital",
    index: "02",
    title: "Catálogo Digital",
    category: "Vitrine digital",
    description:
      "Produtos e serviços organizados em um catálogo leve, fácil de atualizar e de compartilhar pelo WhatsApp.",
    tags: ["Catálogo", "WhatsApp", "Vitrine"],
    solution: "lojas-virtuais-e-catalogos",
    code: "CAT / 02",
    media: {
      src: "/image/WELL_.mp4",
      poster: "/image/posters/wellfashion.png",
      width: 1323,
      height: 612,
      duration: "00:39",
    },
    href: "https://catalago-whatsapp.vercel.app/",
  },
  {
    id: "plataforma-agendamento",
    index: "03",
    title: "Plataforma de Agendamento",
    category: "Fluxo digital",
    description:
      "Horários, confirmações e organização da agenda em um fluxo simples para clientes e equipe.",
    tags: ["Agenda", "Confirmação", "Atendimento"],
    solution: "plataformas-de-agendamento",
    code: "BOOK / 03",
    media: {
      src: "/image/Saas.mp4",
      poster: "/image/posters/agendamento.jpg",
      width: 1359,
      height: 598,
      duration: "00:39",
    },
  },
  {
    id: "site-institucional",
    index: "04",
    title: "Site Institucional",
    category: "Presença digital",
    description:
      "Conteúdo, identidade e posicionamento em uma presença digital que comunica autoridade.",
    tags: ["Institucional", "Conteúdo", "SEO"],
    solution: "sites-institucionais",
    code: "WEB / 04",
    media: {
      src: "/image/CODE_PH.mp4",
      poster: "/image/posters/code-ph.png",
      width: 1600,
      height: 714,
      duration: "00:47",
    },
    href: "https://asssistenciaph.vercel.app/#projetos",
  },
  {
    id: "buffets-eventos",
    index: "05",
    title: "Buffets & Eventos",
    category: "Projeto sob medida",
    description:
      "Apresentação, orçamentos e informações de evento em uma solução digital pensada para a operação.",
    tags: ["Eventos", "Orçamento", "Apresentação"],
    solution: "sistemas-personalizados",
    code: "EVT / 05",
    media: {
      src: "/image/BUFFET.mp4",
      poster: "/image/posters/buffet.jpg",
      width: 1600,
      height: 713,
      duration: "00:31",
    },
    href: "https://www.sresrtagourmet.com.br/",
  },
];

export const services: Service[] = [
  {
    id: "sites-institucionais",
    index: "01",
    title: "Sites institucionais",
    description:
      "Uma presença digital clara, bem estruturada e alinhada ao posicionamento da sua empresa.",
    items: ["Arquitetura de conteúdo", "Design responsivo", "SEO técnico"],
    icon: "monitor",
  },
  {
    id: "lojas-virtuais-e-catalogos",
    index: "02",
    title: "Lojas virtuais e catálogos",
    description:
      "Vitrines digitais com navegação objetiva, apresentação de produtos e caminhos curtos até o contato ou a compra.",
    items: ["Catálogo", "E-commerce", "Integração com WhatsApp"],
    icon: "shopping-bag",
  },
  {
    id: "sistemas-personalizados",
    index: "03",
    title: "Sistemas personalizados",
    description:
      "Ferramentas construídas a partir do processo real da empresa, sem excesso de telas e funcionalidades.",
    items: ["Levantamento de processo", "Painéis", "Controle de acesso"],
    icon: "cpu",
  },
  {
    id: "sistemas-de-gestao-e-pdv",
    index: "04",
    title: "Sistemas de gestão e PDV",
    description:
      "Centralize vendas, estoque, caixa e rotinas comerciais em uma operação mais organizada.",
    items: ["Ponto de venda", "Estoque", "Relatórios"],
    icon: "store",
  },
  {
    id: "plataformas-de-agendamento",
    index: "05",
    title: "Plataformas de agendamento",
    description:
      "Agenda, horários e confirmações organizados para reduzir atrito entre cliente e equipe.",
    items: ["Agenda online", "Confirmações", "Gestão de horários"],
    icon: "calendar",
  },
  {
    id: "integracoes-com-whatsapp",
    index: "06",
    title: "Integrações com WhatsApp",
    description:
      "Conecte formulários, pedidos e atendimentos ao canal que sua operação já utiliza.",
    items: ["Links inteligentes", "Notificações", "Fluxos de atendimento"],
    icon: "whatsapp",
  },
  {
    id: "automacao-de-processos",
    index: "07",
    title: "Automação de processos",
    description:
      "Reduza tarefas manuais e conecte etapas que hoje dependem de planilhas, mensagens e retrabalho.",
    items: ["Integrações", "Rotinas automáticas", "Centralização de dados"],
    icon: "workflow",
  },
  {
    id: "assistencia-tecnica",
    index: "08",
    title: "Assistência técnica",
    description:
      "Suporte e manutenção para manter equipamentos, acessos e soluções digitais em funcionamento.",
    items: ["Manutenção", "Configuração", "Suporte"],
    icon: "wrench",
  },
];

export const processSteps = [
  {
    index: "01",
    title: "Entendimento da necessidade",
    description:
      "Ouvimos a operação, mapeamos gargalos e definimos com clareza o problema que precisa ser resolvido.",
  },
  {
    index: "02",
    title: "Planejamento da solução",
    description:
      "Escopo, arquitetura, prioridades e critérios de sucesso são organizados antes da primeira linha de código.",
  },
  {
    index: "03",
    title: "Desenvolvimento e validação",
    description:
      "Construímos em ciclos curtos, com entregas visíveis e validação junto a quem realmente vai usar.",
  },
  {
    index: "04",
    title: "Entrega e suporte",
    description:
      "Publicação, orientação de uso e acompanhamento para a solução continuar funcionando depois da entrega.",
  },
];

export const differentialPrinciples = [
  {
    title: "Clareza antes de código",
    description: "Entender o problema é parte do projeto, não uma etapa opcional.",
  },
  {
    title: "Tecnologia no tamanho da operação",
    description: "A ferramenta certa resolve. A ferramenta demais só cria novas camadas.",
  },
  {
    title: "Continuidade depois da entrega",
    description: "Publicar é o começo do uso real — e o suporte faz parte da solução.",
  },
];

export const solutionOptions = [
  ...services.map((service) => ({ value: service.id, label: service.title })),
  { value: "outro", label: "Outro tipo de solução" },
];
