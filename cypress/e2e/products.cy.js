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
      cy.get('.productinfo p').invoke('text').as('name', { type: 'static' });
      cy.get('.productinfo h2').invoke('text').as('price', { type: 'static' });
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
    // A busca também considera categoria, além do nome. A API real fornece
    // o conjunto esperado; validar a lista inteira detecta faltas e itens extras.
    cy.request({ method: 'POST', url: '/api/searchProduct', form: true,
      body: { search_product: term } }).then(({ body }) => {
      const result = typeof body === 'string' ? JSON.parse(body) : body;
      expect(result.responseCode).to.eq(200);
      expect(result.products).to.have.length.greaterThan(0);
      result.products.forEach((product) => {
        expect(`${product.name} ${product.category.category}`.toLowerCase())
          .to.include(term.toLowerCase());
      });
      cy.wrap(result.products.map((product) => product.name).sort())
        .as('expectedNames', { type: 'static' });
    });
    cy.get('#search_product').type(term);
    cy.get('#submit_search').click();
    cy.contains('h2', 'Searched Products', { matchCase: false }).should('be.visible');
    cy.get('@expectedNames').then((expectedNames) => {
      cy.get('.features_items .product-image-wrapper')
        .should('have.length', expectedNames.length).each(($card) => {
          cy.wrap($card).find('.productinfo').should('be.visible');
        });
      cy.get('.features_items .productinfo p').should(($names) => {
        const actualNames = $names.toArray().map((element) => element.textContent.trim()).sort();
        expect(actualNames).to.deep.eq(expectedNames);
      });
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
