import { request } from 'undici'
import * as cheerio from 'cheerio'

const fetch_products_from_category = async (whmcs, catalogue) => {
  for (let c of catalogue) {
    for (let el of c.nodes) {
      // Define how we get the response
      const { body } = await request(
        whmcs.BASE_URL + whmcs.PATH_CATEGORY_GID_PREFIX + el.gid
      )

      // Obtain raw HTTP response body from WHMCS
      const raw_response = await body.text()

      // Use Cheerio to parse response body into usable DOM element
      const $ = cheerio.load(raw_response, {
        '_useHtmlParser2': true,
        'xmlMode': false
      })

      // Instantiate a new array element for the products
      let products = []

      // Push all products into the array
      $(whmcs.PRODUCTS_LIST_SELECTOR).find(whmcs.PRODUCT_NODES_SELECTOR)
        .map(((_, el) => whmcs.CATALOGUE_PRODUCTS_INJECTOR($, el, products)))

      el.products = products
    }
  }

  return catalogue
}