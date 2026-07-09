import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const HomePage = () => {
  const { addToCart } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (product) => {
    // Add to cart
    addToCart(product);

    // Update stock in UI
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p._id === product._id
          ? { ...p, stock: p.stock - 1 }
          : p
      )
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Our Products
      </h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-500">
          No products available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src="https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-max-witb-cosmicorange-202509_FMT_WHH?wid=560&hei=744&fmt=jpeg&qlt=90"
                alt={product.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {product.name}
                </h2>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price}
                  </span>

                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>

                <button
                  onClick={() => handleAddProduct(product)}
                  className={`w-full py-2 rounded transition ${
                    product.stock > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0
                    ? "Add to Cart 🛒"
                    : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;