import type { Metadata } from "next";
import Link from "next/link";

import { getMailtoUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Entenda quais dados são tratados pelo site da CODE_PH, para quais finalidades e como exercer seus direitos.",
};

export default function PrivacyPolicyPage() {
  const privacyEmail = getMailtoUrl("Privacidade e dados pessoais");

  return (
    <main id="conteudo" className="policy-page" tabIndex={-1}>
      <div className="site-container">
        <header className="policy-page__heading">
          <p className="section-label">Privacidade</p>
          <h1>Política de Privacidade</h1>
          <p>
            Este texto descreve os tratamentos identificados no código
            disponível do site. A identidade legal do controlador, os serviços
            configurados no ambiente publicado e os prazos dos fornecedores
            precisam ser confirmados antes da publicação definitiva.
          </p>
        </header>

        <div className="policy-page__content">
          <section>
            <h2>Quem trata os dados</h2>
            <p>
              O site se identifica como {siteConfig.name} —{" "}
              {siteConfig.legalName}. O código não informa a razão social ou o
              nome civil do controlador, CPF/CNPJ, endereço para
              correspondência nem encarregado. Esses dados devem ser
              completados e confirmados pelo responsável pelo site.
            </p>
            <p>
              {privacyEmail ? (
                <>
                  O contato público atualmente configurado é{" "}
                  <a href={privacyEmail}>{siteConfig.contact.email}</a>.
                </>
              ) : (
                <>
                  Não há e-mail público configurado no código. O controlador
                  deve informar um canal específico para solicitações de
                  privacidade, além dos canais comerciais do{" "}
                  <Link href="/#contato">formulário de contato</Link>.
                </>
              )}
            </p>
          </section>

          <section>
            <h2>Dados e finalidades identificados</h2>
            <ul>
              <li>
                <strong>Formulário de contato:</strong> nome, WhatsApp,
                descrição do projeto e, opcionalmente, empresa e solução
                desejada. São usados para receber e responder à solicitação.
              </li>
              <li>
                <strong>Proteção do formulário:</strong> o servidor lê o
                endereço IP encaminhado pela infraestrutura para limitar
                tentativas em uma janela de dez minutos. Esse dado pode
                identificar ou tornar identificável uma pessoa.
              </li>
              <li>
                <strong>Preferências:</strong> o tema visual fica no
                armazenamento local do navegador; a escolha de cookies fica em
                um cookie próprio, com categorias, data/hora e versão da
                política.
              </li>
            </ul>
            <p>
              Não identificamos ferramentas de métricas, publicidade,
              rastreamento, mapas, chat ou vídeos incorporados no código
              analisado.
            </p>
          </section>

          <section>
            <h2>Bases legais a validar</h2>
            <p>
              Responder a um pedido de orçamento pode se enquadrar em
              procedimentos preliminares relacionados a contrato, a pedido do
              titular (art. 7º, V, da LGPD). O uso do IP para limitar abuso pode
              depender de legítimo interesse, após avaliação de necessidade e
              balanceamento pelo controlador (art. 7º, IX). Cookies opcionais,
              se adicionados, só devem ser ativados depois de consentimento
              específico. A escolha do cookie necessário e o armazenamento do
              tema precisam de base e transparência confirmadas pelo
              controlador.
            </p>
            <p>
              Essas são hipóteses para revisão, não uma conclusão jurídica
              sobre a operação da organização.
            </p>
          </section>

          <section>
            <h2>Compartilhamento e serviços externos</h2>
            <p>
              O código pode encaminhar os dados do formulário ao Resend quando
              as variáveis de servidor correspondentes estiverem configuradas;
              se não estiverem, pode usar o endpoint informado em{" "}
              <code>CONTACT_WEBHOOK_URL</code>. O código não revela qual
              fornecedor, localização, retenção ou contrato de tratamento está
              configurado nesse ambiente. O controlador deve identificar e
              validar esses destinatários antes de publicar esta política.
            </p>
            <p>
              A hospedagem e os registros técnicos da plataforma também
              dependem do ambiente de deploy, que não é definido pelo código.
              Links externos, como WhatsApp, redes sociais e sites de projetos,
              só são acessados mediante clique e passam a seguir as regras do
              respectivo serviço.
            </p>
          </section>

          <section>
            <h2>Retenção e segurança</h2>
            <p>
              O código da aplicação não grava os dados do formulário em um
              banco próprio. O encaminhamento externo, quando configurado, pode
              gerar retenção pelo provedor, cujos prazos precisam ser
              consultados pelo controlador. O IP usado pelo limitador fica em
              memória no processo do servidor; os registros de hospedagem
              dependem da plataforma utilizada.
            </p>
            <p>
              O site não registra as escolhas de cookies em um banco central.
              O cookie necessário expira após 180 dias. O tema salvo em
              <code>localStorage</code> permanece até ser removido pelo
              visitante.
            </p>
          </section>

          <section>
            <h2>Seus direitos</h2>
            <p>
              Nos termos da LGPD, você pode solicitar informações e exercer os
              direitos aplicáveis ao tratamento dos seus dados, inclusive
              confirmação, acesso, correção, anonimização, bloqueio, eliminação
              ou revogação do consentimento quando essa for a base legal.
              Solicitações dependem de um canal de atendimento do controlador,
              que deve ser confirmado e divulgado.
            </p>
            <p>
              Para alterar cookies, use o controle{" "}
              <strong>Preferências de cookies</strong> no rodapé ou leia a{" "}
              <Link href="/politica-de-cookies">Política de Cookies</Link>.
            </p>
          </section>

          <section>
            <h2>Atualizações</h2>
            <p>
              Esta política deve ser atualizada quando mudarem os tratamentos,
              fornecedores, finalidades ou bases legais. A adequação final
              depende de validação do controlador e de revisão jurídica das
              operações efetivamente realizadas.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
