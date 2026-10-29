import 'cypress-mochawesome-reporter/register';
import './commands';

beforeEach(() => {
  // Somente anúncios externos: nenhuma resposta funcional da aplicação é simulada.
  ['**/*.doubleclick.net/**', '**/*.googlesyndication.com/**',
    '**/*.googleadservices.com/**'].forEach((url) => {
    cy.intercept(url, { statusCode: 204, body: '' });
  });
});
// Erros JavaScript da aplicação continuam falhando o teste normalmente.
