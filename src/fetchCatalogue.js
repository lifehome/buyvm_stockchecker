import { request } from 'undici'
import * as cheerio from 'cheerio'

// Function to fetch latest product catalogue
const fetchCatalog = async whmcs => {
  // Define how we get the response
  const { body } = await request(
    whmcs.BASE_URL + whmcs.PATH_CART_ALL_PAGE
  )

  // Obtain raw HTTP response body from WHMCS
  const rawResponse = await body.text()

  // Use Cheerio to parse response body into usable DOM element
  const $ = cheerio.load(rawResponse, {
    _useHtmlParser2: true,
    xmlMode: false
  })

  // Instantiate a new array element for the catalogue
  const catalogue = []

  // Push all categories into the array
  $(whmcs.CATEGORY_SELECTOR).find(whmcs.CATEGORY_NODES_SELECTOR)
    .each((_, el) => {
      // Pop the config out of the closet
      const {
        defaultCategory,
        separator,
        keyIndex,
        valueIndex,
        specialNodeCategory,
        specialNodeExclusions
      } = whmcs.CATEGORY_IDENT_CONFIG

      // Item node definitions
      let name = $(el).attr(whmcs.CATEGORY_NODE_NAME_ATTR)
      let category = defaultCategory
      const gid = ($(el).attr('href')).match(whmcs.CATEGORY_GID_REGEX)[1]

      // Identify product category and name if needed
      if (whmcs.REQUIRE_CATEGORY_IDENTIFICATION) {
        // Split the key value pair
        const rawItemName = $(el)
          .attr(whmcs.CATEGORY_NODE_NAME_ATTR)
          .split(separator)

        // Categorize the node
        category = rawItemName[keyIndex]
          ? specialNodeExclusions.includes(
              rawItemName[keyIndex]
            )
              ? specialNodeCategory
              : rawItemName[keyIndex]
          : specialNodeCategory

        // Set the name of the node
        name = rawItemName[valueIndex]
      }

      catalogue.push({ category, gid, name })
    })

  // Return consolidated array of product categories
  return Object.values(
    catalogue.reduce((acc, { category, gid, name }) => {
      acc[category] ??= { category, nodes: [] }
      acc[category].nodes.push({ gid, name })
      acc[category].nodes.sort((a, b) => (a.gid > b.gid && 1) || -1)
      return acc
    }, {})
  )
}

export default fetchCatalog
