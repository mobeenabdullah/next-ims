describe("renders the login page", () => {
  it("rendered correctly", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email");
  });
});
