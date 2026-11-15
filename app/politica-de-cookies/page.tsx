import type { Metadata } from "next";
import Link from "next/link";

import {
  COOKIE_POLICY_UPDATED,
  COOKIE_POLICY_VERSION,
} from "@/lib/cookie-consent";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Saiba quais cookies e tecnologias de armazenamento são utilizados no site da CODE_PH e como alterar suas preferências.",
};

export default function CookiePolicyPage() {
  return (
    <main id="conteudo" className="policy-page" tabIndex={-1}>
      <div className="site-container">
        <header className="policy-page__heading">
          <p className="section-label">
            Privacidade / Versão {COOKIE_POLICY_VERSION}
          </p>
          <h1>Política de Cookies</h1>
          <p>
            Atualizada em {COOKIE_POLICY_UPDATED}. Esta página descreve o que o
            código deste site armazena no navegador e como controlar essa
            escolha.
          </p>
        </header>

        <div className="policy-page__content">
          <section>
            <h2>O que encontramos no site</h2>
            <p>
              A auditoria do código não encontrou Google Analytics, Google Tag
              Manager, Meta Pixel, ferramentas de publicidade, mapas
              incorporados, vídeos de terceiros, chatbots ou SDKs de
              monitoramento. Não há cookies opcionais desses serviços sendo
              carregados.
            </p>
            <p>
              Os vídeos dos projetos são arquivos do próprio site. Links para
              WhatsApp, redes sociais e projetos externos só são acessados
              quando você escolhe abri-los; a partir daí, valem as políticas do
              serviço visitado.
            </p>
          </section>

          <section>
            <h2>Cookie necessário</h2>
            <ul>
              <li>
                <strong>Nome:</strong> <code>code-ph-cookie-consent</code>.
              </li>
              <li>
                <strong>Responsável:</strong> primeira parte, site CODE_PH.
              </li>
              <li>
                <strong>Finalidade:</strong> guardar as categorias escolhidas,
                o horário da escolha e a versão desta política, para respeitar
                sua decisão e não exibir o aviso em toda visita.
              </li>
              <li>
                <strong>Categoria e prazo:</strong> necessário; até 180 dias.
                É definido para o domínio do site, com <code>SameSite=Lax</code>
                e atributo <code>Secure</code> em conexões HTTPS.
              </li>
              <li>
                <strong>Dados:</strong> não contém nome, e-mail ou identificador
                aleatório. A associação a um navegador/dispositivo pode ser
                considerada dado pessoal conforme o contexto.
              </li>
            </ul>
            <p>
              A base legal aplicável ao registro estritamente necessário da
              escolha deve ser confirmada pelo controlador. Cookies opcionais
              não são criados sem uma escolha afirmativa para a categoria
              correspondente.
            </p>
          </section>

          <section>
            <h2>Armazenamento local de tema</h2>
            <p>
              A preferência de tema claro/escuro é salva no{" "}
              <code>localStorage</code> do navegador sob a chave{" "}
              <code>code-ph-theme</code>. Isso não é um cookie e permanece até
              você limpar os dados do site no navegador. Não é usado para
              análise ou publicidade.
            </p>
          </section>

          <section>
            <h2>Categorias opcionais</h2>
            <p>
              O painel oferece controles separados para medição de audiência e
              publicidade/marketing. Ambas começam desativadas. Atualmente não
              há fornecedor ou script dessas categorias configurado no código;
              aceitar uma categoria não carrega um serviço que não existe.
            </p>
          </section>

          <section>
            <h2>Alterar ou revogar</h2>
            <p>
              Use <strong>Preferências de cookies</strong> no rodapé para rever
              ou retirar escolhas. O consentimento é renovado quando a versão
              desta política muda. Revogar impede futuros carregamentos
              opcionais que venham a ser integrados, mas não apaga dados que
              você já tenha enviado a serviços externos.
            </p>
            <p>
              O registro fica no navegador e não é enviado a um sistema central
              de auditoria. Como o navegador é controlado pelo visitante, o
              horário registrado não é uma evidência imutável.
            </p>
            <Link href="/politica-de-privacidade">
              Consulte também a Política de Privacidade.
            </Link>
          </section>

          <section>
            <h2>Escopo e atualização</h2>
            <p>
              Esta descrição reflete os arquivos disponíveis no projeto. O
              controlador deve confirmar o ambiente publicado, os serviços
              efetivamente configurados e a base legal antes de divulgar a
              política. Alterações relevantes devem atualizar a versão{" "}
              {COOKIE_POLICY_VERSION} no código e solicitar nova escolha.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
