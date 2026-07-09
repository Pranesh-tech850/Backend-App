import { useAuth } from "../contexts/AuthContext";
import {
  Trash2,
  ShoppingCart,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";

const CartPage = () => {


  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    removeProducts
  } = useAuth();



  
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <ShoppingCart
            size={40}
            className="text-indigo-600"
          />
          <h1 className="text-4xl font-bold text-slate-800">
            Shopping Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-700">
              Your Cart is Empty 🛒
            </h2>

            <p className="text-gray-500 mt-3">
              Add some products and start shopping.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5"
                >
                  <div className="flex flex-col md:flex-row items-center gap-5">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-800">
                        {item.name}
                      </h2>

                      <p className="text-indigo-600 text-lg font-semibold mt-2">
                        ₹{item.price}
                      </p>

                      <p className="text-gray-500 mt-1">
                        Category: {item.category}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          decreaseQuantity(item._id)
                        }
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                      >
                        <Minus size={18} />
                      </button>

                      <span className="text-xl font-bold w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item._id)
                        }
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                      >
                        <Plus size={18} />
                      </button>

                    </div>

                    {/* Remove */}
                    <button
                      onClick={() =>
                        removeFromCart(item._id)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={24} />
                    </button>

                  </div>
                </div>
              ))}

            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6">

                <h2 className="text-2xl font-bold mb-6">
                  Order Summary
                </h2>

                <div className="flex justify-between mb-4">
                  <span>Total Items</span>
                  <span>{cartItems.length}</span>
                </div>

                <div className="flex justify-between mb-4">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between mb-4">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    Free
                  </span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>

                <button
                  className="w-full mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 flex justify-center items-center gap-2"
                  onClick={() => {
                    alert("Proceeding to checkout...");
                    removeProducts();
                  }}>
                  Proceed To Checkout
                  <ArrowRight size={20} />
                </button>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;