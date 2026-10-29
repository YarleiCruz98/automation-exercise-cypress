import { createUser } from '../support/data';

describe('Finalização de pedido', () => {
  let user;
  beforeEach(() => { user = createUser(); });
  afterEach(() => { cy.cleanupUser(user); });

  it('TC15 — cadastrar antes do checkout e concluir pedido', () => {
    cy.home();
    cy.openLogin();
    cy.registerUser(user);
    cy.addFirstProduct();
    cy.completeCheckout(user);
    cy.deleteCurrentAccount();
  });

  it('TC16 — fazer login antes do checkout e concluir pedido', () => {
    cy.seedUser(user);
    cy.home();
    cy.openLogin();
    cy.loginAs(user);
    cy.addFirstProduct();
    cy.completeCheckout(user);
    cy.deleteCurrentAccount();
  });
});
