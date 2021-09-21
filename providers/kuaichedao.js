const WHMCSconfig = {
  BASE_URL: 'https://kuaichedao.co/store',
  PATH_CART_ALL_PAGE: '/cn2-china',

  CATEGORY_SELECTOR: '[menuitemname="Categories"]',
  CATEGORY_NODES_SELECTOR: 'a.list-group-item',
  CATEGORY_NODE_NAME_ATTR: 'menuitemname',
  CATEGORY_GID_REGEX: /\/store\/(\S+)/,
  REQUIRE_CATEGORY_IDENTIFICATION: true,
  CATEGORY_IDENT_CONFIG: {
    separator: ' - ',
    key_index: 0,
    value_index: 1,
    default_category: 'Products',
    special_node_category: 'Miscellaneous',
    special_node_exclusions: ['Email Delivery']
  },

  // WIP: Not yet investigated on this provider yet.

  PRODUCTS_LIST_SELECTOR: '',
  PRODUCT_NODES_SELECTOR: '',

  CATALOGUE_PRODUCTS_INJECTOR: ($, el, products) => {
    // Item node definitions
    const name = undefined
    const price = undefined
    const billingCycle = undefined
    const stockQty = undefined
    const isInStock = (stockQty >= 1 || stockQty === '')

    products.push({ name, price, billingCycle, stockQty, isInStock })
  }
}

export default WHMCSconfig
