import type { StructureResolver } from "sanity/structure";

/**
 * Estrutura do painel.
 *
 * Paginas unicas (Home, Contato, Configuracoes) aparecem como um item so,
 * abrindo direto no documento. Sem isso o Sanity mostraria uma lista com
 * botao de "criar novo", e o cliente poderia acabar com duas Homes.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Conteudo")
    .items([
      S.listItem()
        .title("Home")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),

      S.divider(),

      S.documentTypeListItem("brand").title("Marcas"),
      S.documentTypeListItem("post").title("Publicacoes"),
      S.documentTypeListItem("aboutPage").title("Sobre Nos (idiomas)"),

      S.listItem()
        .title("Pagina de Contato")
        .id("contactPage")
        .child(S.document().schemaType("contactPage").documentId("contactPage")),

      S.divider(),

      S.documentTypeListItem("contactSubmission").title("Mensagens recebidas"),

      S.divider(),

      S.listItem()
        .title("Configuracoes do site")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
    ]);
