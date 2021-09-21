const WHMCSconfig = {
  BASE_URL: 'https://my.frantech.ca',
  PATH_CART_ALL_PAGE: '/cart.php',
  PATH_CATEGORY_GID_PREFIX: '/cart.php?gid=',

  CATEGORY_SELECTOR: '[menuitemname="Categories"]',
  CATEGORY_NODES_SELECTOR: 'a.list-group-item',
  CATEGORY_NODE_NAME_ATTR: 'menuitemname',
  CATEGORY_GID_REGEX: /\/cart\.php\?gid=(\d+)/,
  REQUIRE_CATEGORY_IDENTIFICATION: true,
  CATEGORY_IDENT_CONFIG: {
    separator: ' - ',
    keyIndex: 1,
    valueIndex: 0,
    defaultCategory: 'KVM Slices',
    specialNodeCategory: 'Miscellaneous',
    specialNodeExclusions: []
  },

  PRODUCTS_LIST_SELECTOR: '#products',
  PRODUCT_NODES_SELECTOR: '.package',

  CATALOGUE_PRODUCTS_INJECTOR: ($, el, products) => {
    // Item node definitions
    const name = $(el)
      .find('.package-name')
      .text().trim().replace(/\s+/g, ' ')
      .replace(/.*(\d+[MTG]B)/, '$1')
    const price = $(el)
      .find('.package-price').find('.price')
      .contents().filter(
        function () {
          return this.nodeType === 3
        }
      )
      .text().trim().replace(/\s+/g, ' ')
    const billingCycle = $(el)
      .find('.price-cycle')
      .text().trim()
      .replace(/^\//g, '')
      .replace(/\s+/g, ' ')
    const stockQty = $(el)
      .find('.package-qty')
      .text()
      .replace('Available', '').trim()
    const isInStock = (stockQty >= 1 || stockQty === '')

    products.push({ name, price, billingCycle, stockQty, isInStock })
  }
}

export default WHMCSconfig
