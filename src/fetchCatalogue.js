import { request } from 'undici'
import * as cheerio from 'cheerio'

// Function to fetch latest product catalogue
const fetchCatalog = async whmcs => {
  // Define how we get the response
  const { body } = await request(
    whmcs.BASE_URL + whmcs.PATH_CART_ALL_PAGE
  )

  // Obtain raw HTTP response body from WHMCS
  const raw_response = await body.text()

  // Use Cheerio to parse response body into usable DOM element
  const $ = cheerio.load(raw_response, {
    '_useHtmlParser2': true,
    'xmlMode': false
  })

  // Instantiate a new array element for the catalogue
  let catalogue = []

  // Push all categories into the array
  $(whmcs.CATEGORY_SELECTOR).find(whmcs.CATEGORY_NODES_SELECTOR)
    .map((_, el) => {
      // Pop the config out of the closet
      let {
        default_category,
        separator,
        key_index,
        value_index,
        special_node_category,
        special_node_exclusions
      } = whmcs.CATEGORY_IDENT_CONFIG

      // Item node definitions
      let name     = $(el).attr(whmcs.CATEGORY_NODE_NAME_ATTR)
      let category = default_category
      let gid      = ($(el).attr('href')).match(whmcs.CATEGORY_GID_REGEX)[1]

      // Identify product category and name if needed
      if (whmcs.REQUIRE_CATEGORY_IDENTIFICATION) {
        // Split the key value pair
        let raw_item_name = $(el)
                              .attr(whmcs.CATEGORY_NODE_NAME_ATTR)
                              .split(separator)

        // Categorize the node
        category  = raw_item_name[key_index]
                      ? special_node_exclusions.includes(
                          raw_item_name[key_index]
                        )
                          ? special_node_category
                          : raw_item_name[key_index]
                      : special_node_category
        
        // Set the name of the node
        name      = raw_item_name[value_index]
      }
      
      catalogue.push({ category, gid, name })
    })

  // Return consolidated array of product categories
  return Object.values(
    catalogue.reduce((acc, {category, gid, name}) => {
      acc[category] ??= {category, nodes: []}
      acc[category].nodes.push({gid, name})
      acc[category].nodes.sort((a, b) => a.gid > b.gid && 1 || -1)
      return acc
    }, {})
  )
}

export default fetchCatalog