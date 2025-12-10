import InventoryPage from "../../pages/inventoryPage";

describe("Inventory sorting", () => {
  beforeEach(() => {
    cy.loginStandard();
  });

  function collectNames() {
    return InventoryPage.itemNames().then(($els) => {
      const names = [];
      $els.each((index, el) => {
        names.push(el.innerText.trim());
      });
      return names;
    });
  }

  function collectPrices() {
    return InventoryPage.itemPrices().then(($els) => {
      const prices = [];
      $els.each((index, el) => {
        const text = el.innerText.replace("$", "").trim();
        prices.push(parseFloat(text));
      });
      return prices;
    });
  }

  it("SD_INV_02 - sorting by Name (A to Z) orders items ascending", () => {
    InventoryPage.sortSelect().select("Name (A to Z)");

    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Name (A to Z)");

    collectNames().then((names) => {
      const sorted = names.slice().sort((a, b) => a.localeCompare(b));
      expect(names).to.deep.equal(sorted);
    });
  });

  it("SD_INV_03 - sorting by Name (Z to A) orders items descending", () => {
    InventoryPage.sortSelect().select("Name (Z to A)");

    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Name (Z to A)");

    collectNames().then((names) => {
      const sorted = names
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .reverse();
      expect(names).to.deep.equal(sorted);
    });
  });

  it("SD_INV_04 - sorting by Price (low to high) uses numeric ascending order", () => {
    InventoryPage.sortSelect().select("Price (low to high)");

    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Price (low to high)");

    collectPrices().then((prices) => {
      const sorted = prices.slice().sort((a, b) => a - b);
      expect(prices).to.deep.equal(sorted);
    });
  });

  it("SD_INV_05 - sorting by Price (high to low) uses numeric descending order", () => {
    InventoryPage.sortSelect().select("Price (high to low)");

    InventoryPage.sortSelect()
      .find("option:selected")
      .should("contain.text", "Price (high to low)");

    collectPrices().then((prices) => {
      const sorted = prices.slice().sort((a, b) => b - a);
      expect(prices).to.deep.equal(sorted);
    });
  });
});
