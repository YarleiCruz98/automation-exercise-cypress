// Dados fictícios; cada teste e cada tentativa recebem um e-mail exclusivo.
export function createUser() {
  const id = `${Date.now()}-${Cypress._.random(100000, 999999)}`;
  return {
    name: 'Aluno Automacao', email: `qa-${id}@example.com`,
    password: 'Teste@123456', firstname: 'Aluno', lastname: 'Automacao',
    company: 'Estudos QA', address1: 'Rua de Teste, 123', address2: 'Apto 10',
    country: 'Canada', state: 'Ontario', city: 'Toronto', zipcode: 'M5V123',
    mobile_number: '11999999999', title: 'Mr',
    birth_date: '15', birth_month: '6', birth_year: '1995',
  };
}
