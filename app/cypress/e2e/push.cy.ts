describe('push', () => {
  it('landing', () => {
    cy.visit('/').then(() => {
      console.log('landed')
      cy.get('.q-header').should('exist')
    })
  })

  it('register push subscription', () => {
    cy.dataCy('registerPushBtn').click()
    cy.get('.q-notification', { timeout: 60000 })
      .should('contain.text', 'Successfully subscribed')
  })

  it('trigger push', () => {
    cy.dataCy('triggerPushBtn').click()
    cy.get('.q-notification', { timeout: 60000 })
      .should('contain.text', 'Successfully triggered notification')
  })
})