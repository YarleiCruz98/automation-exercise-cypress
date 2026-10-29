import { createUser } from '../support/data';

describe('Cadastro e autenticação', () => {
  let user;
  beforeEach(() => { user = createUser(); });
  afterEach(() => { cy.cleanupUser(user); });

  it('TC01 — cadastrar usuário e excluir conta', () => {
    cy.home();
    cy.openLogin();
    cy.registerUser(user);
    cy.deleteCurrentAccount();
  });

  it('TC02 — login com e-mail e senha corretos e excluir conta', () => {
    cy.seedUser(user);
    cy.home();
    cy.openLogin();
    cy.loginAs(user);
    cy.deleteCurrentAccount();
  });

  it('TC03 — rejeitar login com e-mail e senha incorretos', () => {
    cy.home();
    cy.openLogin();
    cy.byQa('login-email').type(user.email);
    cy.byQa('login-password').type('SenhaIncorreta', { log: false });
    cy.byQa('login-button').click();
    cy.contains('.login-form', 'Your email or password is incorrect!').should('be.visible');
    cy.location('pathname').should('eq', '/login');
    cy.get('header a[href="/logout"]').should('not.exist');
  });

  it('TC04 — logout retorna à página de login', () => {
    cy.seedUser(user);
    cy.home();
    cy.openLogin();
    cy.loginAs(user);
    cy.get('header a[href="/logout"]').click();
    cy.location('pathname').should('eq', '/login');
    cy.contains('.login-form h2', 'Login to your account').should('be.visible');
    cy.get('header a[href="/logout"]').should('not.exist');
  });

  it('TC05 — rejeitar cadastro com e-mail existente', () => {
    cy.seedUser(user);
    cy.home();
    cy.openLogin();
    cy.byQa('signup-name').type(user.name);
    cy.byQa('signup-email').type(user.email);
    cy.byQa('signup-button').click();
    cy.contains('.signup-form', 'Email Address already exist!').should('be.visible');
  });
});
