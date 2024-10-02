// Cache object to store fetched products and categories
const cache = {
    products: {},
    categories: null,
  };

  /**
 * Fetch products from API with caching.
 *
 * @param {Object} params - Parameters for fetching products.
 * @param {string} params.selectedCategory - The category to filter products by.
 * @param {string} params.searchTerm - The search term to filter products by.
 * @param {string} params.sortOrder - The field to sort the products by.
 * @param {string} params.sortDirection - The direction of the sort (asc/desc).
 * @param {number} params.page - The current page for pagination.
 * @param {number} params.limit - The number of products per page.
 * @param {Function} setLoading - Function to set loading state.
 * @param {Function} setError - Function to set error state.
 * @param {Function} setProducts - Function to set fetched products.
 * @param {Function} setAllSearchResults - Function to set all search results.
 */
  
  // Helper function to fetch products from API with caching
  export async function fetchProducts({ selectedCategory, searchTerm, sortOrder, sortDirection, page, limit, setLoading, setError, setProducts, setAllSearchResults }) {
    setLoading(true);
    setError(null);
    try {
      const cacheKey = JSON.stringify({ selectedCategory, searchTerm, sortOrder, sortDirection, page, limit });
      
      // Return cached products if available
      if (cache.products[cacheKey]) {
        setProducts(cache.products[cacheKey]);
        setLoading(false);
        return;
      }
  
      let apiUrl = 'https://next-ecommerce-api.vercel.app/products?';
      const params = new URLSearchParams();
  
      if (searchTerm) {
        params.append('search', searchTerm);
        params.append('limit', '3000'); // Fetch all for search
      } else {
        params.append('limit', limit);
        params.append('skip', (page - 1) * limit); // Pagination
      }
  
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
  
      if (sortOrder) {
        params.append('sortBy', sortOrder);
        if (sortDirection) {
          params.append('order', sortDirection);
        }
      }
  
      apiUrl += params.toString();
  
      const res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await res.json();
  
      if (searchTerm) {
        const sortedData = data.sort((a, b) => {
          if (sortOrder === 'price') {
            return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
          }
          if (sortOrder === 'rating') {
            return sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating;
          }
          return 0;
        });
  
        const start = (page - 1) * limit;
        const end = start + limit;
        setProducts(sortedData.slice(start, end));
        setAllSearchResults(sortedData);
        // Cache the fetched products
        cache.products[cacheKey] = sortedData.slice(start, end);
      } else {
        setProducts(data);
        setAllSearchResults([]);
        // Cache the fetched products
        cache.products[cacheKey] = data;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  // Helper function to fetch categories with caching
  export async function fetchCategories() {
    // Return cached categories if available
    if (cache.categories) {
      return cache.categories; 
    }
  
    const res = await fetch('https://next-ecommerce-api.vercel.app/categories');
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await res.json();
    console.log('Categories Data:', data); // Log to see the fetched data
  
    // Ensure data is an array
    if (!Array.isArray(data)) {
      throw new Error('Categories data is not an array');
    }
  
    // Store fetched categories in cache
    cache.categories = data;
  
    return data;
  }
  
  // Helper function to build query string for URL
  export function buildQueryString({ category, search, sortBy, order, page }) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);
    if (page) params.append('page', page);
    return params.toString();
  }
  