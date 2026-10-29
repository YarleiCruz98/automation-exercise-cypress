Cypress.Commands.add('byQa', (value) => cy.get(`[data-qa="${value}"]`));

Cypress.Commands.add('home', () => {
  cy.visit('/');
  cy.get('header .logo img').should('be.visible');
  cy.get('#slider').should('be.visible');
});

Cypress.Commands.add('openLogin', () => {
  cy.get('header a[href="/login"]').click();
  cy.location('pathname').should('eq', '/login');
  cy.contains('.login-form h2', 'Login to your account').should('be.visible');
  cy.contains('.signup-form h2', 'New User Signup!').should('be.visible');
});

Cypress.Commands.add('loginAs', (user) => {
  cy.byQa('login-email').type(user.email);
  cy.byQa('login-password').type(user.password, { log: false });
  cy.byQa('login-button').click();
  cy.assertLoggedIn(user);
});

Cypress.Commands.add('assertLoggedIn', (user) => {
  cy.contains('header a', 'Logged in as').should('be.visible')
    .and('contain.text', user.name);
});

Cypress.Commands.add('registerUser', (user) => {
  cy.byQa('signup-name').type(user.name);
  cy.byQa('signup-email').type(user.email);
  cy.byQa('signup-button').click();
  cy.contains('h2', 'Enter Account Information', { matchCase: false }).should('be.visible');
  cy.get('#id_gender1').check();
  cy.byQa('name').should('have.value', user.name);
  cy.byQa('email').should('have.value', user.email);
  cy.byQa('password').type(user.password, { log: false });
  cy.byQa('days').select(user.birth_date);
  cy.byQa('months').select(user.birth_month);
  cy.byQa('years').select(user.birth_year);
  cy.get('#newsletter').check().should('be.checked');
  cy.get('#optin').check().should('be.checked');
  const fields = { first_name: 'firstname', last_name: 'lastname', company: 'company',
    address: 'address1', address2: 'address2', state: 'state', city: 'city',
    zipcode: 'zipcode', mobile_number: 'mobile_number' };
  Object.entries(fields).forEach(([qa, key]) => cy.byQa(qa).type(user[key]));
  cy.byQa('country').select(user.country);
  cy.byQa('create-account').click();
  cy.byQa('account-created').should('be.visible').and('contain.text', 'Account Created!');
  cy.byQa('continue-button').click();
  cy.assertLoggedIn(user);
});

Cypress.Commands.add('deleteCurrentAccount', () => {
  cy.get('header a[href="/delete_account"]').click();
  cy.byQa('account-deleted').should('be.visible').and('contain.text', 'Account Deleted!');
  cy.byQa('continue-button').click();
  cy.location('pathname').should('eq', '/');
});

// API usada apenas para preparar e limpar pré-condições; fluxos avaliados usam UI.
Cypress.Commands.add('seedUser', (user) => {
  cy.request({ method: 'POST', url: '/api/createAccount', form: true, body: user })
    .then(({ body }) => {
      const result = typeof body === 'string' ? JSON.parse(body) : body;
      expect(result.responseCode, 'criação da pré-condição').to.eq(201);
    });
});

Cypress.Commands.add('cleanupUser', (user) => {
  cy.request({ method: 'DELETE', url: '/api/deleteAccount', form: true,
    body: { email: user.email, password: user.password } }).then(({ body }) => {
    const result = typeof body === 'string' ? JSON.parse(body) : body;
    // 404 significa conta já removida pelo próprio cenário.
    expect([200, 404], 'limpeza idempotente').to.include(result.responseCode);
  });
});

Cypress.Commands.add('addFirstProduct', () => {
  cy.get('.features_items .product-image-wrapper').first().within(() => {
    cy.get('.productinfo p').invoke('text').as('productName');
    cy.get('.productinfo a.add-to-cart').click();
  });
  cy.get('#cartModal').should('be.visible');
  cy.contains('#cartModal button', 'Continue Shopping').click();
  cy.get('#cartModal').should('not.be.visible');
  cy.get('header a[href="/view_cart"]').click();
  cy.location('pathname').should('eq', '/view_cart');
  cy.get('@productName').then((name) => {
    cy.get('#cart_info_table tbody tr').should('have.length', 1)
      .and('contain.text', name);
  });
});

Cypress.Commands.add('completeCheckout', (user) => {
  cy.contains('a', 'Proceed To Checkout').click();
  cy.location('pathname').should('eq', '/checkout');
  cy.contains('h2', 'Address Details').should('be.visible');
  ['#address_delivery', '#address_invoice'].forEach((selector) => {
    cy.get(selector).should('contain.text', `${user.firstname} ${user.lastname}`)
      .and('contain.text', user.address1).and('contain.text', user.address2)
      .and('contain.text', user.city).and('contain.text', user.state)
      .and('contain.text', user.zipcode).and('contain.text', user.country)
      .and('contain.text', user.mobile_number);
  });
  cy.contains('h2', 'Review Your Order').should('be.visible');
  cy.get('@productName').then((name) => cy.get('#cart_info').should('contain.text', name));
  cy.get('textarea[name="message"]').type('Pedido ficticio para teste automatizado.');
  cy.contains('a', 'Place Order').click();
  cy.location('pathname').should('eq', '/payment');
  cy.byQa('name-on-card').type(user.name);
  cy.byQa('card-number').type('4111111111111111', { log: false });
  cy.byQa('cvc').type('123', { log: false });
  cy.byQa('expiry-month').type('12');
  cy.byQa('expiry-year').type('2030');
  // O site exibe a mensagem no submit e imediatamente redireciona.
  // Observar o evento real permite validar esse estado sem atrasar a aplicação.
  let confirmationShown = false;
  cy.get('#payment-form').then(($form) => {
    $form[0].addEventListener('submit', () => {
      const message = $form[0].querySelector('#success_message');
      confirmationShown = Boolean(message && Cypress.dom.isVisible(message)
        && message.textContent.includes('Your order has been placed successfully!'));
    });
  });
  cy.byQa('pay-button').click();
  cy.then(() => expect(confirmationShown, 'mensagem de sucesso no envio').to.eq(true));
  cy.location('pathname').should('match', /^\/payment_done\/\d+$/);
  cy.byQa('order-placed').should('be.visible').and('contain.text', 'Order Placed!');
  cy.contains('Congratulations! Your order has been confirmed!').should('be.visible');
});
