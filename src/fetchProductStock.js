import { request } from 'undici'
import * as cheerio from 'cheerio'

const fetchProductStock = async (whmcs, catalogue) => {
  for (const c of catalogue) {
    for (const el of c.nodes) {
      // Define how we get the response
      const { body } = await request(
        whmcs.BASE_URL + whmcs.PATH_CATEGORY_GID_PREFIX + el.gid
      )

      // Obtain raw HTTP response body from WHMCS
      const rawResponse = await body.text()

      // Use Cheerio to parse response body into usable DOM element
      const $ = cheerio.load(rawResponse, {
        _useHtmlParser2: true,
        xmlMode: false
      })

      // Instantiate a new array element for the products
      const products = []

      // Push all products into the array
      $(whmcs.PRODUCTS_LIST_SELECTOR).find(whmcs.PRODUCT_NODES_SELECTOR)
        .map((_, el) => whmcs.CATALOGUE_PRODUCTS_INJECTOR($, el, products))

      el.products = products
    }
  }

  return catalogue
}

export default fetchProductStock
