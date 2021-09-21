const whmcs_config = {
  "BASE_URL": 'https://my.frantech.ca',
  "PATH_CART_ALL_PAGE": '/cart.php',
  "PATH_CATEGORY_GID_PREFIX": '/cart.php?gid=',

  "CATEGORY_SELECTOR": '[menuitemname="Categories"]',
  "CATEGORY_NODES_SELECTOR": 'a.list-group-item',
  "CATEGORY_NODE_NAME_ATTR": 'menuitemname',
  "CATEGORY_GID_REGEX": /\/cart\.php\?gid\=(\d+)/,
  "REQUIRE_CATEGORY_IDENTIFICATION": true,
  "CATEGORY_IDENT_CONFIG": {
    "separator": ' - ',
    "key_index": 1,
    "value_index": 0,
    "default_category": 'KVM Slices',
    "special_node_category": 'Miscellaneous',
    "special_node_exclusions": []
  },

  "PRODUCTS_LIST_SELECTOR": '#products',
  "PRODUCT_NODES_SELECTOR": '.package',

  "CATALOGUE_PRODUCTS_INJECTOR": ($, el, products) => {
    // Item node definitions
    let name          = $(el)
                          .find('.package-name')
                          .text().trim().replace(/\s+/g, ' ')
                          .replace(/.*(\d+[MTG]B)/, '$1')
    let price         = $(el)
                          .find('.package-price').find('.price')
                          .contents().filter(
                            function () {
                              return this.nodeType === 3
                            }
                          )
                          .text().trim().replace(/\s+/g, ' ')
    let billing_cycle = $(el)
                          .find('.price-cycle')
                          .text().trim()
                          .replace(/^\//g, '')
                          .replace(/\s+/g, ' ')
    let stock_qty     = $(el)
                          .find('.package-qty')
                          .text()
                          .replace('Available', '').trim()
    let is_in_stock   = (
                          stock_qty >= 1
                            || stock_qty === ''
                        )

    products.push({name, price, billing_cycle, stock_qty, is_in_stock})
  }
}

export default whmcs_config