describe('User Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/')

    cy.get('input[name=email]').type('aooif@unsw.edu.au') 

    cy.get('button[type=submit]').click()

    cy.url().should('include', '/dashboard')
  })
})