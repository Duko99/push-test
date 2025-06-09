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
    cy.dataCy('latestMsg')
      .should('contain.text', 'Push subscription acknowledgement')
  })

  it('trigger push', () => {
    cy.dataCy('triggerPushBtn').click()
    cy.get('.q-notification', { timeout: 60000 })
      .should('contain.text', 'Successfully triggered notification')
    cy.dataCy('latestMsg')
      .should('contain.text', 'This is a test push message')
  })
})