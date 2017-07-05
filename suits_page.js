
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const entries = urlParams.entries();

  const filters = {
    color: [],
    pattern: [],
    occasion: [],
    season: [],
  };

  for(const pair of entries) {
    filters[pair[0]] = [pair[1]];
  }

  new Suits(filters);
});

class Suits {
  constructor (filters) {
    this.filters = filters;
    this.currentSuits = [];
    this.totalSuits = this.getSuits().then(() => this.createProductList());
    this.filterSuits = this.filterSuits.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.createProductList = this.createProductList.bind(this);
    this.filterByCategory = this.filterByCategory.bind(this);
    this.createCurrentFilters = this.createCurrentFilters.bind(this);

    this.createFilterTab();
  }

  getSuits () {
    const that = this;
    return (
      $.ajax({
        type: "GET",
        url: "suit_resolver.php",
        success: function (data) {
          that.totalSuits = JSON.parse(data);
        },
      })
    );
  }

  createProductList() {
    $('.product-list').empty();
    this.currentSuits = [];

    this.filterSuits();

    this.currentSuits.forEach((suit) => {
      const $li =
      $(`<li><img src='http://via.placeholder.com/150x250' alt='suit'>
      <p>${suit[0]['name']}</p>
      <p>\$${suit[0]['price']}</p>

      </li>`);
      $('.product-list').append($li);
    });

    this.createCurrentFilters();
  }

  filterSuits() {
    this.currentSuits = this.totalSuits.slice(0);
    Object.keys(this.filters).forEach(category => {
      this.currentSuits = this.filterByCategory(this.currentSuits, category);
    });
  }

  filterByCategory(currentSuits, category) {
    const suits = currentSuits.filter(suit => {
      const suitDetails = {};
      let rightSuit = false;

      suit[4].forEach(filter => {
        suitDetails[filter] = true;
      });

      if(this.filters[category].length === 0) {
        return true;
      }

      for (let i = 0; i < this.filters[category].length; i++) {
        const filter = this.filters[category][i].toLowerCase();

        if(suitDetails[filter]) {
          rightSuit = true;
          break;
        }
      }
      return rightSuit;
    });
    return suits;
  }

  createFilterTab() {
    const color = ["Blue", "White", "Black", "Khaki", "Brown", "Gray"];
    const occasion = ["Business/Casual", "Business/Formal", "Formal", "Wedding", "Play"];
    const pattern = ["Check", "Solid", "Subtle/Pattern", "Stripe"];
    const season = ["Fall/Winter", "Spring/Summer"];

    const tabs = [{color}, {occasion}, {pattern}, {season}];

    tabs.forEach((tab) => {
      this.createFilters(tab);
    });
  }

  createFilters(filters) {
    const tab = Object.keys(filters)[0];
    const $li = $(`.${tab}`);

    const types = Object.values(filters)[0];

    types.forEach((type) => {
      const $p = $(`<p>${type}</p>`);
      $p.click(() => this.toggleFilter(tab, type.replace('/', '-')));

      $li.append($p);
    });
  }

  createCurrentFilters() {
    const tabs = Object.keys(this.filters);
    $('.current-total-products').empty();
    $('.current-filters').empty();

    tabs.forEach((tab) => {
      this.filters[tab].forEach((type) => {
        const $p = $(`<p>${type.replace('-', '/')}</p>`);
        $p.click(() => this.toggleFilter(tab, type));

        $('.current-filters').append($p);
      });
    });

    $('.current-total-products').append(`<p>${this.currentSuits.length}/${this.totalSuits.length} Products</p>`);

  }

  toggleFilter(tab, filter) {
    if (this.filters[tab].indexOf(filter.toLowerCase()) === -1) {
      this.filters[tab].push(filter.toLowerCase());
    } else {
      this.filters[tab] = this.filters[tab].filter((type) => {
        return type !== filter.toLowerCase();
      });
    }

    this.createProductList();
  }
}
