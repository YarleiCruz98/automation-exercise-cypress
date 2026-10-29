# Automation Exercise — Trabalho final Cypress

Projeto individual de Yarlei Silva Santos Alves Cruz. Implementa exatamente os casos 1, 2, 3, 4, 5, 8, 9, 10, 15 e 16 da página oficial: https://automationexercise.com/test_cases.

## Executar localmente

Instale Node.js 22 e Google Chrome. Dentro da pasta do projeto:

```bash
npm ci
npm run check
npm run test:chrome
```

Para usar o navegador Electron incluído no Cypress: `npm test`.
Para acompanhar pela interface: `npm run cy:open`.
Linux precisa das dependências de sistema indicadas em https://docs.cypress.io/app/get-started/install-cypress.

## Cobertura

| Caso | Cenário | Arquivo |
| --- | --- | --- |
| 1 | Cadastro completo, login automático e exclusão | accounts.cy.js |
| 2 | Login válido e exclusão | accounts.cy.js |
| 3 | Login inválido | accounts.cy.js |
| 4 | Logout | accounts.cy.js |
| 5 | Cadastro com e-mail existente | accounts.cy.js |
| 8 | Catálogo e detalhes do primeiro produto | products.cy.js |
| 9 | Pesquisa de produtos | products.cy.js |
| 10 | Assinatura na página inicial | products.cy.js |
| 15 | Cadastro antes do checkout e compra | checkout.cy.js |
| 16 | Login antes do checkout e compra | checkout.cy.js |

As specs estão em `cypress/e2e`. A modularização usa comandos em `cypress/support/commands.js`; os dados fictícios ficam em `cypress/support/data.js`.

## Decisões de implementação

- Seletores `data-qa` priorizados; IDs e links semânticos quando a aplicação não oferece `data-qa`.
- Cada teste executa isoladamente e gera e-mail exclusivo a cada tentativa.
- Casos que exigem conta previamente existente usam a API oficial apenas como pré-condição. Login, cadastro avaliado, checkout e exclusão exigida pelo cenário acontecem pela interface.
- `afterEach` limpa contas de teste pela API, inclusive após falhas. A limpeza aceita conta já removida pelo cenário. Interrupção abrupta do processo pode deixar dados residuais.
- Sem esperas fixas, cliques forçados ou desativação global de erros JavaScript.
- Apenas requisições de anúncios externos são interceptadas; respostas funcionais do site são reais.
- Checkout verifica endereço de entrega, faturamento, produto, mensagem de envio e confirmação final. O site mostra a mensagem no evento `submit` e redireciona imediatamente; o teste observa esse evento sem impedir a navegação.
- Uma nova tentativa automática no modo headless para falhas transitórias. Consultar tentativas no relatório para identificar instabilidade.
- Versões diretas fixadas e lockfile incluído. A aplicação pública e seus dados podem mudar e exigir manutenção.

## GitHub Actions e relatórios

O workflow `.github/workflows/e2e.yml` executa em push, pull request e manualmente, com Node.js 22, `npm ci` e Chrome. Não requer Cypress Cloud, chave de gravação ou credenciais pessoais.

O `cypress-mochawesome-reporter` gera `cypress/reports/index.html` ao fim da execução. Abra esse arquivo no navegador. Vídeos ficam em `cypress/videos`; screenshots de falha em `cypress/screenshots`.

No GitHub: **Actions → Cypress E2E → execução → Artifacts → cypress-report-N**. Baixe e extraia o artefato para abrir o HTML. O upload de evidências executa também quando testes falham e não transforma falha em sucesso. Retenção de 14 dias: baixe o relatório antes de expirar.

## Publicar e entregar

1. Crie um repositório GitHub vazio e acessível ao avaliador.
2. Extraia o ZIP e abra o terminal dentro da pasta `automation-exercise`.
3. Publique o conteúdo, preservando a pasta `.github`:

```bash
git init
git add .
git commit -m "Implementa dez cenarios Cypress do trabalho final"
git branch -M main
git remote add origin https://github.com/YarleiCruz98/automation-exercise-cypress.git
git push -u origin main
```

4. Aguarde o workflow terminar. Confira os dez testes e baixe o relatório. Corrija qualquer falha antes da entrega.
5. Envie o ZIP e a URL real do repositório na plataforma até **31/10/2026 às 23:59:59**, conforme o enunciado. O ZIP fornecido já exclui `node_modules`.

## Validação e evidências

O projeto está publicado em https://github.com/YarleiCruz98/automation-exercise-cypress.

- Sintaxe JavaScript e instalação das dependências do lockfile verificadas.
- Testes E2E executados no Chrome pelo GitHub Actions.
- Consulte o status e os relatórios da execução correspondente ao commit que será entregue: https://github.com/YarleiCruz98/automation-exercise-cypress/actions.
- O artefato de cada execução contém o relatório Mochawesome e os vídeos; falhas também produzem screenshots. Não confunda relatórios de tentativas anteriores com o resultado do código mais recente.
- No ambiente usado para preparar o projeto, o download local do Cypress retornou “Site Unavailable”; por isso, a validação em navegador foi transferida para o GitHub Actions.

## Referências

- Casos: https://automationexercise.com/test_cases
- API de preparação e limpeza: https://automationexercise.com/api_list
- Cypress: https://docs.cypress.io/app/get-started/install-cypress
- Reporter: https://github.com/LironEr/cypress-mochawesome-reporter
