// pages/api/products.js
import { getProductsFromDatabase } from '../../lib/database'; // Replace with your database logic

export default async function handler(req, res) {
  const { id, category, search, sortBy, order, limit = 20, skip = 0 } = req.query;

  try {
    // Get products from your database or source
    let products = await getProductsFromDatabase(); // Fetch all products initially

    // Apply filters based on query parameters
    if (id) {
      products = products.filter(product => product.id === parseInt(id));
    }
    if (category) {
      products = products.filter(product => product.category === category);
    }
    if (search) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sorting
    if (sortBy) {
      products.sort((a, b) => {
        if (order === 'asc') {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });
    }

    // Pagination
    const paginatedProducts = products.slice(skip, skip + limit);

    // Respond with filtered and sorted products
    res.status(200).json(paginatedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
