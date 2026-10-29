import { createUser } from '../support/data';

describe('Catálogo e assinatura', () => {
  beforeEach(() => { cy.home(); });

  function openProducts() {
    cy.get('header a[href="/products"]').click();
    cy.location('pathname').should('eq', '/products');
    cy.contains('h2', 'All Products', { matchCase: false }).should('be.visible');
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0);
  }

  it('TC08 — listar produtos e validar detalhes do primeiro', () => {
    openProducts();
    cy.get('.features_items .product-image-wrapper').first().within(() => {
      cy.get('.productinfo p').invoke('text').as('name');
      cy.get('.productinfo h2').invoke('text').as('price');
      cy.contains('a', 'View Product').click();
    });
    cy.location('pathname').should('match', /^\/product_details\/\d+$/);
    cy.get('.product-information').should('be.visible').within(() => {
      cy.get('@name').then((name) => cy.get('h2').should('have.text', name));
      cy.get('@price').then((price) => cy.contains('span', price).should('be.visible'));
      cy.contains('p', /^Category:\s*\S/).should('be.visible');
      ['Availability:', 'Condition:', 'Brand:'].forEach((label) => {
        cy.contains('p', label).should('be.visible').invoke('text').then((text) => {
          expect(text.replace(label, '').trim(), label).not.to.be.empty;
        });
      });
    });
  });

  it('TC09 — pesquisar produto e verificar todos os resultados', () => {
    openProducts();
    const term = 'Top';
    cy.get('#search_product').type(term);
    cy.get('#submit_search').click();
    cy.contains('h2', 'Searched Products', { matchCase: false }).should('be.visible');
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)
      .each(($card) => {
        cy.wrap($card).find('.productinfo').should('be.visible')
          .find('p').invoke('text').should('match', /top/i);
      });
  });

  it('TC10 — assinar novidades na página inicial', () => {
    cy.get('footer').scrollIntoView();
    cy.contains('footer h2', 'Subscription', { matchCase: false }).should('be.visible');
    cy.get('#susbscribe_email').type(createUser().email);
    cy.get('#subscribe').click();
    cy.contains('#success-subscribe', 'You have been successfully subscribed!').should('be.visible');
  });
});
