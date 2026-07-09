import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  PlusCircle,
  Truck,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
      ]);

      const products = productsRes.data;
      const ordersData = ordersRes.data;

      const revenue = ordersData.reduce(
        (total, order) => total + (order.totalPrice || order.price || 0),
        0,
      );

      setStats({
        products: products.length,
        orders: ordersData.length,
        revenue,
      });

      setOrders(ordersData);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });

      fetchDashboardData();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (!user.isAdmin) return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-extrabold">Admin Dashboard 🚀</h1>

          <p className="mt-2 text-lg text-purple-100">
            Welcome back, {user.name}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-12">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-sm">Products</p>
                <h2 className="text-4xl font-bold">{stats.products}</h2>
              </div>

              <Package size={40} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-sm">Orders</p>
                <h2 className="text-4xl font-bold">{stats.orders}</h2>
              </div>

              <ShoppingCart size={40} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-sm">Revenue</p>
                <h2 className="text-4xl font-bold">₹{stats.revenue}</h2>
              </div>

              <IndianRupee size={40} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/admin/products/new")}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg"
          >
            <PlusCircle size={20} />
            Add Product
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            <Truck size={20} />
            Manage Orders
          </button>
        </div>

        {/* Recent Orders */}
        <div className="mt-10 bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-b hover:bg-slate-50">
                    <td className="p-4">{order._id.slice(-8)}</td>

                    <td className="p-4 font-semibold">
                      ₹{order.totalPrice || order.price}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                           ${
                             order.status === "Delivered"
                               ? "bg-green-100 text-green-700"
                               : order.status === "Shipped"
                                 ? "bg-blue-100 text-blue-700"
                                 : order.status === "Processing"
                                   ? "bg-purple-100 text-purple-700"
                                   : "bg-yellow-100 text-yellow-700"
                           }
    `}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className="border px-3 py-2 rounded-lg"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
