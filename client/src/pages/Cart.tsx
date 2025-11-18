import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to view your cart</p>
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/products/${item.product_id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.brand} • {item.storage} • {item.color}
                  </p>
                  <p className="text-lg font-bold text-blue-600">${item.price}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 mb-2"
                  >
                    Remove
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

