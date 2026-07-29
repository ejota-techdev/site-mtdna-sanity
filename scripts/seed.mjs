/**
 * Popula o Sanity com o conteudo inicial dos wireframes.
 *
 *   node scripts/seed.mjs                  cria o que falta, NAO toca no resto
 *   node scripts/seed.mjs --sobrescrever   substitui tudo (DESTRUTIVO)
 *
 * O modo padrao e seguro: documento que ja existe e deixado como esta, entao
 * edicoes feitas no painel sobrevivem. Use `--sobrescrever` apenas quando a
 * intencao for mesmo descartar o conteudo atual e voltar ao original.
 *
 * As imagens sao enviadas uma unica vez — o Sanity deduplica assets pelo
 * hash do arquivo.
 */
import { createClient } from "@sanity/client";
import { createReadStream, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WIREFRAMES = join(ROOT, "wireframes");
const EXTRACTED = join(ROOT, "scripts", "assets");

// ---------- Ambiente ----------
const env = Object.fromEntries(
  readFileSync(join(ROOT, ".env.local"), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const at = line.indexOf("=");
      return [line.slice(0, at), line.slice(at + 1)];
    }),
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// ---------- Upload de imagens ----------
const uploaded = new Map();

async function upload(file, base = WIREFRAMES) {
  if (uploaded.has(file)) return uploaded.get(file);

  const path = join(base, file);
  if (!existsSync(path)) {
    console.warn(`  ! arquivo nao encontrado, ignorando: ${file}`);
    return null;
  }

  const asset = await client.assets.upload("image", createReadStream(path), {
    filename: file,
  });
  console.log(`  + ${file} -> ${asset._id}`);
  uploaded.set(file, asset._id);
  return asset._id;
}

/** Monta o campo de imagem no formato que os schemas esperam. */
function img(assetId, alt) {
  if (!assetId) return undefined;
  return {
    _type: "figureImage",
    alt,
    asset: { _type: "reference", _ref: assetId },
  };
}

const key = (() => {
  let n = 0;
  return () => `k${(n += 1)}`;
})();

/**
 * Por padrao o script NAO toca em documento que ja existe.
 *
 * A versao anterior usava `createOrReplace` sempre, o que apagava qualquer
 * edicao feita no painel a cada execucao. Agora sobrescrever exige a flag
 * explicita `--sobrescrever`.
 */
const SOBRESCREVER = process.argv.includes("--sobrescrever");

let criados = 0;
let preservados = 0;

async function gravar(doc, rotulo) {
  const existente = await client.getDocument(doc._id);

  if (existente && !SOBRESCREVER) {
    preservados += 1;
    console.log(`  = ${rotulo} — ja existe, mantido como está`);
    return;
  }

  if (existente) {
    await client.createOrReplace(doc);
    console.log(`  ~ ${rotulo} — SOBRESCRITO`);
  } else {
    await client.create(doc);
    console.log(`  + ${rotulo} — criado`);
  }
  criados += 1;
}

async function main() {
  console.log("Enviando imagens...");

  const A = {
    logoHeader: await upload("logo-mtdna-header.png", EXTRACTED),
    logoRodape: await upload("logo-mtdna-rodape.png", EXTRACTED),

    // Versoes escuras — recortadas da faixa de logos do wireframe, para uso
    // sobre fundo branco.
    europcarLogo: await upload("logo-europcar-escuro.png", EXTRACTED),
    goldcarLogo: await upload("logo-goldcar-escuro.png", EXTRACTED),
    unlockLogo: await upload("logo-unlock-escuro.png", EXTRACTED),

    // Versoes claras (glifo branco, fundo transparente) — para os cards
    // petroleo e o carrossel do topo. Sobre fundo branco ficam invisiveis.
    europcarLogoClaro: await upload("image 25.png"),
    goldcarLogoClaro: await upload("goldcar logo 1.png"),
    unlockLogoClaro: await upload("unlock logo 1.png"),

    europcarHero: await upload("Group 20.png"),
    goldcarHero: await upload("Group 22.png"),
    unlockHero: await upload("Group 23.png"),

    europcarFeature: await upload("Formato de Arquivo de Imagem AV1 1.png"),
    goldcarFeature: await upload("Formato de Arquivo de Imagem AV1 2.png"),
    unlockFeature: await upload("katarzyna-urbanek-_4qQsmE4VdA-unsplash 1.png"),

    // Imagens definitivas da secao de destaques. As dos cards vem coloridas —
    // o efeito P&B e aplicado por CSS, e removido no hover.
    cinqueTerre: await upload("img_1_sem_cor_linh-nguyen-DNE9iZ1Kqzk-unsplash 1.png"),
    destaqueAgentes: await upload("img_1_com_cor_luca-bravo-VowIFDxogG4-unsplash 1.png"),
    destaquePremium: await upload("img_2_com_cor_wu-jianxiong-UniC8xhlzaE-unsplash 1.png"),

    lagoMontanhas: await upload("Group 17.png"),
    predioPortugues: await upload("Group 24.png"),

    maos: await upload("Group 19.png"),
    casalContato: await upload("Rectangle 77.png"),

    espreguicadeiras: await upload("siravitplug-MhPJdWYWbWI-unsplash 1.png"),
    piscina: await upload("image 35.png"),
    hotelPiscina: await upload("image 36.png"),
    varandaPorto: await upload("image 37.png"),

    iconMarca: await upload("target_5343415 1.svg"),
    iconMarketing: await upload("analysis_11744916 1.svg"),
    iconEventos: await upload("event_12822816 1.svg"),
    iconRP: await upload("referral_2329131 1.svg"),
    iconOperacoes: await upload("Frame.svg"),
  };

  console.log("\nCriando documentos...");

  // ---------- Configuracoes do site ----------
  await gravar({
    _id: "siteSettings",
    _type: "siteSettings",
    logo: img(A.logoHeader, "My Travel DNA"),
    logoFooter: img(A.logoRodape, "My Travel DNA"),
    phone: "4020 9728",
    email: "sac@mtdna.com.br",
    instagram: "mtdna.travel",
    instagramUrl: "https://instagram.com/mtdna.travel",
    linkedin: "linkedin.com/company/mtdna/",
    linkedinUrl: "https://linkedin.com/company/mtdna/",
    whatsappUrl: "https://wa.me/5540209728",
    footerCredit: "Desenvolvido por\nEmpresa Júnior PUC-Rio",
  }, "siteSettings");

  // ---------- Marcas ----------
  const brands = [
    {
      _id: "brand-europcar",
      name: "Europcar",
      slug: "europcar",
      order: 1,
      logo: img(A.europcarLogo, "Europcar"),
      logoLight: img(A.europcarLogoClaro, "Europcar"),
      heroImage: img(A.europcarHero, "Veículo Europcar em estrada à beira de um lago"),
      tagline: "Locação de veículos com confiança e alcance global",
      introTitle:
        "Soluções de mobilidade pensadas para quem valoriza conforto em cada etapa da viagem.",
      introText:
        "A Europcar é referência mundial em locação de veículos, combinando frota completa e moderna, experiência de uso simples e presença em mais de 140 países. Presente na MTDNA desde 2008 e reconhecida como uma das maiores operadoras de turismo do mundo.",
      featureTitle:
        "Líder europeia em aluguel de veículos, com posicionamento premium.",
      featureText:
        "A Europcar oferece uma gama ampla de veículos, desde modelos compactos para deslocamentos urbanos até opções executivas para viagens profissionais. Cada etapa do processo é desenhada para reduzir atritos, agilizar retiradas e garantir total tranquilidade na estrada.\n\nA qualidade do serviço, aliada à padronização internacional, faz da Europcar uma escolha sólida tanto para turistas quanto para clientes corporativos.",
      featureImage: img(A.europcarFeature, "Veículo Europcar vermelho em estrada arborizada"),
      featureCta: { _type: "cta", label: "Reserve com a Europcar", href: "https://br.europcarpro.com" },
      highlights: [
        "Presente na MTDNA desde 2008",
        "Tarifas básicas e completas",
        "Pré-pagamento",
        "Frota completa, desde veículos simples até categoria luxo",
        "Estações nas principais localidades mundiais",
        "Líder global em locação de veículos elétricos",
      ],
      website: "br.europcarpro.com",
      websiteUrl: "https://br.europcarpro.com",
      phone: "4020 9728",
      email: "europcar@mtdna.com.br",
      homeCardImage: img(A.europcarHero, "Veículo Europcar"),
      homeCardText:
        "Rede europeia de locação de veículos reconhecida globalmente, com frota robusta e posicionamento premium. Presente em mais de 140 países, referência para o viajante que busca conforto, segurança e confiança.",
    },
    {
      _id: "brand-goldcar",
      name: "Goldcar",
      slug: "goldcar",
      order: 2,
      logo: img(A.goldcarLogo, "Goldcar"),
      logoLight: img(A.goldcarLogoClaro, "Goldcar"),
      heroImage: img(A.goldcarHero, "Veículo Goldcar em estrada arborizada"),
      tagline: "O melhor custo-benefício em locação de carros",
      introTitle: "Mobilidade com custo-benefício como prioridade",
      introText:
        "Parte do Europcar Mobility Group, a Goldcar é reconhecida pelo seu modelo acessível de locação, com foco em agilidade e preços competitivos. Com a MTDNA, a Goldcar está presente em 4 países da Europa: Espanha, França, Itália e Portugal.",
      featureTitle: "Eficiência e praticidade em cada viagem",
      featureText:
        "O portfólio da Goldcar é composto por veículos com alto custo benefício e alta competitividade. Ideal para o cliente que quer se deslocar gastando menos.\n\nCom presença consolidada em diversos destinos, a Goldcar se tornou opção favorita de viajantes que valorizam eficiência e praticidade.",
      featureImage: img(A.goldcarFeature, "Veículo Goldcar azul em rodovia"),
      featureCta: { _type: "cta", label: "Reserve com a Goldcar", href: "https://goldcarpro.com" },
      highlights: [
        "Parte do Europcar Mobility Group",
        "Melhor custo-benefício da Europa",
        "Tarifas básicas (com franquia) e completas (sem franquia e sem caução)",
      ],
      website: "goldcarpro.com",
      websiteUrl: "https://goldcarpro.com",
      phone: "4020 9728",
      email: "goldcar@mtdna.com.br",
      homeCardImage: img(A.goldcarHero, "Veículo Goldcar"),
      homeCardText:
        "Parte do Grupo Europcar Mobility, a Goldcar se posiciona como uma locadora de baixo custo na Europa, oferecendo cobertura completa e tarifa sem franquia, assistência premium 24h e excelente relação custo-benefício.",
    },
    {
      _id: "brand-unlock",
      name: "Unlock",
      slug: "unlock",
      order: 3,
      logo: img(A.unlockLogo, "Unlock Boutique Hotels"),
      logoLight: img(A.unlockLogoClaro, "Unlock Boutique Hotels"),
      heroImage: img(A.unlockHero, "Hotel boutique português visto do alto"),
      tagline: "Autenticidade e elegância em hotéis boutique portugueses",
      introTitle: "Seu conceito e seus hotéis",
      introText:
        "Unlock Boutique Hotels oferece uma coleção de 22 hotéis em 18 destinos portugueses sendo uma referência em hospitalidade autêntica em Portugal. Seu conceito de hospedagem se diferencia por oferecer não apenas hotéis, mas experiências completas de vivenciar cada destino de maneira única, mergulhando naquilo que cada lugar tem de especial e de mais característico.",
      featureTitle: "Unlock your dreams",
      featureText:
        "O portfólio da Unlock é composto por hotéis independentes que compartilham a mesma filosofia: proporcionar conforto, personalidade e uma relação próxima com a cultura local. Localizados em destinos estratégicos de Portugal, os hotéis se destacam pela arquitetura, pelo atendimento personalizado e pela atenção aos detalhes que tornam cada estadia única.\n\nA Unlock atua como um elo entre viajantes e experiências genuínas, reunindo propriedades que preservam sua identidade própria, ao mesmo tempo em que entrega padrões de qualidade e experiência boutique.",
      featureImage: img(A.unlockFeature, "Espreguiçadeiras e guarda-sóis em hotel boutique"),
      featureCta: { _type: "cta", label: "Conheça a Unlock Hotels", href: "https://unlockhotels.com" },
      featureNote:
        "*O comissionamento é válido apenas para reservas efetuadas pelos canais oficiais da MTDNA (e-mail, telefone e WhatsApp).",
      showLocationMap: true,
      locationsIntro:
        "A Unlock Boutique Hotels reúne 22 hotéis boutique cuidadosamente selecionados em 18 localidades em Portugal, com foco em experiências autênticas, design singular e forte conexão com o destino. Cada propriedade valoriza o contexto local, oferecendo estadias que vão além da hospedagem tradicional.",
      locations: [
        "Viana do Castelo", "Amarante", "Douro", "Porto", "Oliveira de Azeméis",
        "Marialva", "Figueira da Foz", "Batalha", "Caldas da Rainha", "Óbidos",
        "Avis", "Sintra", "Lisboa", "Cascais", "Sousel", "Setúbal", "Évora",
        "Grândola", "Monchique", "Ilha do Pico",
      ],
      website: "unlockhotels.com",
      websiteUrl: "https://unlockhotels.com",
      phone: "4020 9728",
      email: "unlock@mtdna.com.br",
      homeCardImage: img(A.predioPortugues, "Hotel boutique em Portugal"),
      homeCardText:
        "A Unlock Boutique Hotels é uma coleção de hotéis boutique em Portugal que proporciona uma experiência portuguesa genuína. Presente em 18 localidades espalhadas por todo o país, mantendo um padrão consistente de excelência e conforto.",
    },
  ];

  const BENEFITS = [
    "Comissionamento rápido",
    "Parcelamento sem juros, em reais",
    "Pagamento em reais e sem IOF",
    "Atendimento e suporte especializado no Brasil",
  ];

  for (const brand of brands) {
    await gravar({
      _type: "brand",
      ...brand,
      slug: { _type: "slug", current: brand.slug },
      benefitsTitle: "Benefícios para você e seu cliente",
      benefits: BENEFITS,
      showInHeroCarousel: true,
    }, `marca: ${brand.name}`);
  }

  // ---------- Publicacoes ----------
  const posts = [
    {
      _id: "post-tendencias",
      title: "Tendências que estão redesenhando o turismo internacional",
      slug: "tendencias-turismo-internacional",
      featured: true,
      cover: img(A.espreguicadeiras, "Espreguiçadeiras à beira-mar"),
      excerpt:
        "O setor de viagens segue em transformação, impulsionado por novas tecnologias, mudanças de comportamento e a busca por experiências mais personalizadas. Nesta publicação, exploramos alguns desses movimentos e o impacto que eles trazem para marcas e operadores do mercado brasileiro.",
      paragraphs: [
        "O mercado global de viagens vive um momento de transformação acelerada. As escolhas dos viajantes, antes guiadas principalmente pelo destino em si, hoje passam por uma combinação de tecnologia, personalização e busca por experiências mais autênticas. Essa mudança de comportamento é nítida tanto no perfil do viajante corporativo quanto do turista que pretende simplesmente explorar o mundo em seu próprio ritmo.",
        "Nos últimos anos, o interesse por viagens personalizadas cresceu de forma significativa. Consumidores passaram a valorizar roteiros alinhados aos seus próprios estilos de vida — seja uma temporada de descanso em meio à natureza, uma imersão cultural, uma viagem gastronômica ou uma jornada de bem-estar. Esse movimento exige que marcas e operadores adaptem suas estratégias, oferecendo soluções mais flexíveis, consultorias mais qualificadas e produtos que conversem com nichos específicos.",
      ],
      midImage: img(A.piscina, "Resort com piscina em meio à vegetação"),
      paragraphs2: [
        "A tecnologia se tornou a grande aliada desse processo. Ferramentas digitais influenciam praticamente todas as etapas da jornada: desde a pesquisa inicial até o pós-viagem, passando por reservas, mobilidade, concierge e atendimento 24 horas. A análise de dados e o uso de inteligência artificial tornam a experiência ainda mais eficiente, antecipando necessidades, personalizando ofertas e guiando decisões estratégicas para empresas que desejam crescer em competitividade.",
        "Ao mesmo tempo, o mapa do turismo mundial também se amplia. Destinos emergentes passaram a ocupar espaço no radar de viajantes que buscam novidades, autenticidade e melhor relação custo-benefício. Essa diversificação fortalece o mercado e abre novas possibilidades para marcas internacionais que desejam expandir presença, testando produtos, construindo relacionamento e consolidando parcerias locais.",
        "A sustentabilidade, por sua vez, deixou de ser uma tendência e se tornou pauta essencial. Viajantes estão cada vez mais atentos ao impacto que deixam nos lugares que visitam. Hospedagens responsáveis, transportes de menor impacto e experiências conectadas à conservação local ganham relevância e influenciam diretamente as escolhas de consumo, gerando um efeito cascata em toda a cadeia do turismo.",
      ],
      endImage: img(A.varandaPorto, "Pátio interno de hotel boutique"),
      closing:
        "O futuro do turismo se constrói nesse movimento contínuo. Marcas que compreendem a importância da personalização, da tecnologia e da responsabilidade ambiental seguem à frente na disputa pela atenção dos viajantes. E, à medida que novos destinos surgem e o comportamento do consumidor se transforma, o setor se reinventa para acompanhar um mundo que nunca para de se mover.",
    },
    {
      _id: "post-hoteis-boutique",
      title: "Hotéis boutique e o charme das pequenas experiências",
      slug: "hoteis-boutique-pequenas-experiencias",
      cover: img(A.hotelPiscina, "Hotel boutique com piscina"),
      excerpt:
        "Da arquitetura ao atendimento, cada detalhe contribui para criar memórias únicas, especialmente em cidades que valorizam cultura, gastronomia e história.",
      paragraphs: [
        "Os hotéis boutique conquistaram espaço ao oferecer o oposto da padronização: espaços com identidade própria, número reduzido de quartos e um atendimento que reconhece o hóspede pelo nome. Essa proximidade cria uma relação diferente com o destino.",
        "Em cidades históricas, esse modelo encontra terreno fértil. Prédios restaurados, mobiliário local e parcerias com produtores da região transformam a hospedagem em uma extensão da própria viagem.",
      ],
      midImage: img(A.varandaPorto, "Vista de varanda sobre a cidade"),
      paragraphs2: [
        "Para agências e operadores, o segmento representa uma oportunidade de diferenciação. São produtos com margem mais saudável, público disposto a pagar por exclusividade e alta taxa de recomendação espontânea.",
      ],
      closing:
        "O charme das pequenas experiências está justamente na escala: menos quartos, mais atenção, e uma lembrança que dificilmente se repete em outro lugar.",
    },
    {
      _id: "post-descanso",
      title: "Como os viajantes estão reinventando a ideia de descanso",
      slug: "viajantes-reinventando-descanso",
      cover: img(A.piscina, "Piscina cercada por vegetação"),
      excerpt:
        "A procura por destinos tranquilos e experiências mais imersivas vem crescendo entre turistas de todas as idades.",
      paragraphs: [
        "Descansar deixou de significar apenas parar. Para uma parcela crescente de viajantes, a pausa ideal envolve movimento com propósito: caminhadas, banhos de floresta, culinária local e desconexão digital deliberada.",
        "Esse novo desenho do descanso favorece destinos fora dos grandes centros e estadias mais longas, com impacto direto na receita média por hóspede.",
      ],
      midImage: img(A.hotelPiscina, "Área de lazer de hotel"),
      paragraphs2: [
        "Operadores que souberem montar roteiros com ritmo mais lento — e comunicar isso com clareza — encontram um público fiel e menos sensível a preço.",
      ],
      closing:
        "O descanso virou um produto em si, e não mais o intervalo entre dois passeios.",
    },
    {
      _id: "post-gastronomico",
      title: "O crescimento do turismo gastronômico ao redor do mundo",
      slug: "turismo-gastronomico",
      cover: img(A.varandaPorto, "Mesa posta com vista para a cidade"),
      excerpt:
        "Viajar para comer já deixou de ser tendência e se tornou um hábito consolidado. Confira o que atrai viajantes que buscam entender a cultura dos destinos por meio da culinária.",
      paragraphs: [
        "A cozinha virou porta de entrada para a cultura de um lugar. Mercados municipais, produtores rurais e restaurantes de bairro entraram no roteiro com o mesmo peso que monumentos históricos.",
        "Esse movimento redistribui receita: parte do gasto do turista migra dos grandes atrativos para o comércio local, fortalecendo a economia das regiões visitadas.",
      ],
      midImage: img(A.piscina, "Ambiente de restaurante à beira da piscina"),
      paragraphs2: [
        "Para o trade, a gastronomia funciona como argumento de venda em baixa temporada, quando o clima deixa de ser o principal atrativo.",
      ],
      closing:
        "Entender um destino pelo que se come nele é, hoje, uma das formas mais diretas de viajar.",
    },
    {
      _id: "post-retiros",
      title: "A nova busca por retiros paradisíacos",
      slug: "retiros-paradisiacos",
      cover: img(A.espreguicadeiras, "Espreguiçadeiras à beira da piscina"),
      excerpt:
        "Viajantes do mundo todo têm priorizado destinos que combinam natureza exuberante, hospedagens exclusivas e experiências de bem-estar. Esse movimento impulsiona resorts e hotéis a criarem ambientes mais imersivos, onde descanso, privacidade e conexão com o entorno se tornam protagonistas da viagem.",
      paragraphs: [
        "Retiros que antes atendiam a um público restrito passaram a atrair viajantes que buscam simplesmente sair do ruído. Localização isolada, baixa densidade de hóspedes e programação opcional são os denominadores comuns.",
        "A hotelaria respondeu com projetos que se integram à paisagem em vez de competir com ela: materiais locais, pegada reduzida e arquitetura que emoldura a vista.",
      ],
      midImage: img(A.hotelPiscina, "Hospedagem integrada à natureza"),
      paragraphs2: [
        "O resultado é uma estadia mais longa e um índice de retorno acima da média do setor.",
      ],
      closing:
        "Privacidade e natureza deixaram de ser luxo periférico e viraram o centro da proposta.",
    },
  ];

  const now = Date.now();
  for (const [index, post] of posts.entries()) {
    const body = [];
    const para = (text) => ({
      _type: "block",
      _key: key(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key(), text, marks: [] }],
    });
    const image = (value) =>
      value ? { ...value, _type: "image", _key: key() } : null;

    for (const text of post.paragraphs ?? []) body.push(para(text));
    if (post.midImage) body.push(image(post.midImage));
    for (const text of post.paragraphs2 ?? []) body.push(para(text));
    if (post.endImage) body.push(image(post.endImage));
    if (post.closing) body.push(para(post.closing));

    await gravar({
      _id: post._id,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      publishedAt: new Date(now - index * 86400000 * 7).toISOString(),
      coverImage: post.cover,
      excerpt: post.excerpt,
      featured: post.featured ?? false,
      body: body.filter(Boolean),
    }, `publicação: ${post.title}`);
  }

  // ---------- Home ----------
  await gravar({
    _id: "homePage",
    _type: "homePage",
    heroSlides: [
      {
        _type: "heroSlide",
        _key: key(),
        image: img(A.europcarHero, "Veículo Europcar em estrada à beira de um lago"),
        brand: { _type: "reference", _ref: "brand-europcar" },
        tagline: "Locação de veículos com confiança e alcance global",
      },
      {
        _type: "heroSlide",
        _key: key(),
        image: img(A.goldcarHero, "Veículo Goldcar em estrada arborizada"),
        brand: { _type: "reference", _ref: "brand-goldcar" },
        tagline: "O melhor custo-benefício em locação de carros",
      },
      {
        _type: "heroSlide",
        _key: key(),
        image: img(A.unlockHero, "Hotel boutique português visto do alto"),
        brand: { _type: "reference", _ref: "brand-unlock" },
        tagline: "Autenticidade e elegância em hotéis boutique portugueses",
      },
    ],
    aboutText: [
      "A My Travel DNA é uma consultoria de marketing B2B para grandes marcas do setor de turismo, desenvolvendo estratégias personalizadas para fortalecer e impulsionar resultados.",
      "Trabalhamos com soluções integradas para impulsionar a performance dos nossos parceiros e contribuir para a evolução do mercado de viagens, trazendo conhecimento estratégico e visão atualizada das tendências do setor.",
    ],
    aboutCta: { _type: "cta", label: "Sobre nós", href: "/sobre" },
    highlightImage: img(A.cinqueTerre, "Vila colorida à beira-mar"),
    highlightCards: [
      {
        _type: "highlightCard",
        _key: key(),
        title: "Exclusivo para agentes de viagens",
        image: img(A.destaqueAgentes, "Barcos ancorados em lago cercado por montanhas"),
        body: "Voltada para profissionais do turismo, a My Travel DNA conecta marcas, agências de viagens a soluções completas de vendas, marketing e comunicação.\n\nOperamos plataformas próprias e exclusivas para agentes de viagens, oferecendo suporte nas vendas, parcerias nas vendas e acesso simplificado.\n\n- Comissionamento rápido;\n- Parcelamento sem juros, em reais;\n- Atendimento e suporte em português.",
      },
      {
        _type: "highlightCard",
        _key: key(),
        title: "Marcas Premium",
        image: img(A.destaquePremium, "Viajante no alto de um penhasco à beira-mar"),
        body: "Representamos marcas internacionais reconhecidas por qualidade, consistência e posicionamento premium. Cada parceria é construída com foco em resultado e em relacionamento de longo prazo com o trade brasileiro.",
      },
    ],
    brandsTitle: "Marcas",
    postsTitle: "Publicações",
    postsLimit: 4,
    newsletterTitle: "Assine as nossas newsletters",
    newsletterPlaceholder: "seu endereço de email...",
    newsletterButtonLabel: "ASSINAR",
    contactTitle: "Contato",
    contactFormTitle: "Decole seu negócio com a gente!",
  }, "homePage");

  // ---------- Sobre Nos (3 idiomas) ----------
  const services = [
    { icon: A.iconMarca, title: "Conhecimento e Presença de Marca" },
    { icon: A.iconMarketing, title: "Marketing e Vendas" },
    { icon: A.iconEventos, title: "Comunicações e Eventos" },
    { icon: A.iconRP, title: "Relações Públicas" },
    { icon: A.iconOperacoes, title: "Operações e Administração" },
  ];

  const servicesEs = [
    "Conocimiento y Presencia de Marca", "Marketing y Ventas",
    "Comunicaciones y Eventos", "Relaciones Públicas", "Operaciones y Administración",
  ];
  const servicesEn = [
    "Brand Knowledge and Presence", "Marketing and Sales",
    "Communications and Events", "Public Relations", "Operations and Administration",
  ];

  const abouts = [
    {
      _id: "about-pt",
      language: "pt",
      menuLabel: "Sobre Nós (PT)",
      title: "Sobre Nós",
      introTitle: "Quem somos",
      introText:
        "A My Travel DNA é uma consultoria de marketing B2B especializada no setor de turismo, criada para conectar marcas, operadores e agências a soluções inteligentes de posicionamento, distribuição e comunicação. Atuamos no mercado brasileiro e internacional apoiando empresas que desejam crescer de forma estruturada, ampliar presença no trade e fortalecer sua relevância em um ambiente competitivo e em constante transformação.",
      accordion: [
        {
          title: "O que fazemos",
          body: "Representamos e apoiamos marcas internacionais no mercado brasileiro, conectando-as ao trade de viagens por meio de estratégias comerciais, ações de marketing, comunicação e relacionamento com agências e operadores.",
        },
        {
          title: "Nossas especialidades",
          body: "Atuamos no desenvolvimento e execução de estratégias comerciais, de comunicação e posicionamento. Isso inclui relações com o trade, ações promocionais, campanhas direcionadas, suporte de marketing, programas de treinamento e presença ativa junto a operadores, agências e demais players do setor.",
        },
        {
          title: "O que proporcionamos",
          body: "Nossos parceiros contam com suporte comercial e operacional dedicado, materiais de apoio, treinamento, inteligência de mercado e um canal direto de comunicação com o público brasileiro.",
        },
      ],
      servicesTitle: "Nossos Serviços",
      services: services.map((s) => s.title),
      ctaTitle: "Conecte-se à MTDNA!",
      ctaLabel: "Contato",
    },
    {
      _id: "about-es",
      language: "es",
      menuLabel: "Sobre Nosotros (ES)",
      title: "Sobre Nosotros",
      introTitle: "Quiénes somos",
      introText:
        "My Travel DNA es una consultoría de marketing B2B especializada en el sector turístico, creada para conectar marcas, operadores y agencias con soluciones inteligentes de posicionamiento, distribución y comunicación. Actuamos en el mercado brasileño e internacional apoyando a empresas que desean crecer de forma estructurada, ampliar su presencia en el trade y fortalecer su relevancia en un entorno competitivo y en constante transformación.",
      accordion: [
        {
          title: "Lo que hacemos",
          body: "Representamos y apoyamos marcas internacionales en el mercado brasileño, conectándolas con el trade de viajes mediante estrategias comerciales, acciones de marketing, comunicación y relación con agencias y operadores.",
        },
        {
          title: "Nuestras especialidades",
          body: "Trabajamos en el desarrollo y la ejecución de estrategias comerciales, de comunicación y posicionamiento. Esto incluye relaciones con el trade, acciones promocionales, campañas dirigidas, soporte de marketing, programas de formación y presencia activa junto a operadores, agencias y otros actores clave del sector.",
        },
        {
          title: "Lo que ofrecemos",
          body: "Nuestros socios cuentan con soporte comercial y operativo dedicado, materiales de apoyo, formación, inteligencia de mercado y un canal directo de comunicación con el público brasileño.",
        },
      ],
      servicesTitle: "Nuestros Servicios",
      services: servicesEs,
      ctaTitle: "¡Conéctate con MTDNA!",
      ctaLabel: "Contacto",
    },
    {
      _id: "about-en",
      language: "en",
      menuLabel: "About Us (EN)",
      title: "About Us",
      introTitle: "Who we are",
      introText:
        "My Travel DNA is a B2B marketing consultancy specialized in the tourism sector, created to connect brands, operators and agencies to intelligent positioning, distribution and communication solutions. We operate in the Brazilian and international markets, supporting companies that want to grow in a structured way, expand their presence in the trade and strengthen their relevance in a competitive and constantly changing environment.",
      accordion: [
        {
          title: "What we do",
          body: "We represent and serve international brands across the Brazilian market, connecting them to the travel trade through commercial strategies, marketing activities, communication and relationships with agencies and operators.",
        },
        {
          title: "Our specialties",
          body: "We work on the development and execution of commercial, communication, and positioning strategies. This includes trade relationships, promotional activities, targeted campaigns, marketing support, training programs, and active presence with tour operators, agencies, and other key players in the sector.",
        },
        {
          title: "What we provide",
          body: "Our partners rely on dedicated commercial and operational support, sales materials, training, market intelligence and a direct communication channel with the Brazilian audience.",
        },
      ],
      servicesTitle: "Our Services",
      services: servicesEn,
      ctaTitle: "Connect with MTDNA!",
      ctaLabel: "Contact",
    },
  ];

  for (const about of abouts) {
    await gravar({
      _id: about._id,
      _type: "aboutPage",
      language: about.language,
      menuLabel: about.menuLabel,
      title: about.title,
      heroImage: img(A.lagoMontanhas, "Lago cercado por montanhas"),
      introTitle: about.introTitle,
      introText: about.introText,
      accordion: about.accordion.map((item) => ({
        _type: "accordionItem",
        _key: key(),
        ...item,
      })),
      servicesTitle: about.servicesTitle,
      services: about.services.map((title, i) => ({
        _type: "service",
        _key: key(),
        title,
        icon: img(services[i].icon, title),
      })),
      ctaImage: img(A.maos, "Mãos sobre mapas de viagem"),
      ctaTitle: about.ctaTitle,
      ctaButton: { _type: "cta", label: about.ctaLabel, href: "/contato" },
    }, `sobre: ${about.menuLabel}`);
  }

  // ---------- Contato ----------
  await gravar({
    _id: "contactPage",
    _type: "contactPage",
    heroImage: img(A.casalContato, "Casal de viajantes apontando para o horizonte"),
    title: "Contato",
    subtitle: "Conecte-se à MTDNA!",
    formTitle: "Decole seu negócio com a gente!",
    infoTitle: "Informações de contato",
    whatsappTitle: "Nosso WhatsApp",
    whatsappButtonLabel: "Entre em contato",
    successMessage: "Recebemos sua mensagem. Em breve entraremos em contato!",
  }, "contactPage");

  console.log(
    `\nConcluído. ${criados} documento(s) gravado(s), ${preservados} preservado(s).`,
  );

  if (preservados > 0 && !SOBRESCREVER) {
    console.log(
      "Os preservados ja existiam e nao foram tocados — suas edicoes no painel estao intactas.",
    );
  }
}

main().catch((error) => {
  console.error("\nFalhou:", error.message);
  process.exit(1);
});
