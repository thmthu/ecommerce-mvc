require("dotenv").config();
const { algoliasearch } = require("algoliasearch");

async function searchInAlgolia(query, options) {
  const { filters, sortBy, sortOrder = 'desc', skip = 0, limit = 10 } = options;

  try {
    // Initialize Algolia client
    const client = algoliasearch(process.env.APPLICATION_ID, process.env.SEARCH_API_KEY);

    // Initialize the index
    const result = await client.searchSingleIndex({
      indexName: process.env.INDEX_NAME,
      searchParams: {
        query,
      },
    }
    );

    console.log(result);

    // 1. Apply filters
    const filteredResults = result.hits.filter((hit) => {
      return Object.entries(options.filters).every(([key, value]) => {
        if (key === 'product_price' && value) {
          const priceRanges = Array.isArray(value) ? value : [value];
          return priceRanges.some((range) => {
            const [min, max] = range.split("-").map(Number);
            return hit.product_price >= min && hit.product_price <= max;
          });
        }
        if (value === "") {
          // Skip empty filters
          return true;
        }
        if (key === 'product_attributes') {
          if (value.brand === "") {
            return true;
          }
          if (Array.isArray(value.brand)) {
            return value.brand.includes(hit[key].brand);
          }
          return hit[key].brand === value.brand;
        }
        if (Array.isArray(value)) {
          // Handle array filters (e.g., category: ['books', 'ebooks'])
          return value.includes(hit[key]);
        }
        // Handle single-value filters
        return hit[key] === value;
      });
    });

    // 2. Apply sorting
    const sortedResults = filteredResults.sort((a, b) => {
      if (options.sortOrder === 'asc') {
        return a[options.sortBy] > b[options.sortBy] ? 1 : -1;
      } else if (options.sortOrder === 'desc') {
        return a[options.sortBy] < b[options.sortBy] ? 1 : -1;
      }
      return 0;
    });

    // 3. Apply skip and limit
    const paginatedResults = sortedResults.slice(options.skip, options.skip + options.limit);
    return {
      products: paginatedResults, // Paginated results after skip/limit
      totalPages: Math.max(Math.ceil(filteredResults.length / options.limit), 1), // Length of filtered results
    };
  } catch (error) {
    console.error('Error during search:', error);
  }
}

module.exports = { searchInAlgolia };