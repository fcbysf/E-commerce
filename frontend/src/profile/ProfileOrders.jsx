import { Calendar, ChevronRight, Package} from "lucide-react";

export default function ProfileOrders({user}){
    return(
        <div className="space-y-6 animate-fadeIn">
      {/* Header with filters */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Order History
            </h2>
            <p className="text-gray-500">Track and manage your orders</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
              <option>All Orders</option>
              <option>Delivered</option>
              <option>In Transit</option>
              <option>Processing</option>
            </select>
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
              <option>All time</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-indigo-50 rounded-xl">
            <p className="text-sm text-indigo-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-indigo-700">
              {user?.orders.length}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-sm text-green-600 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-700">
              {user?.orders.filter((order) => order.status === "done").length}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <p className="text-sm text-orange-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-orange-700">
              {user?.orders.filter((order) => order.status === "pending").length}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-sm text-red-600 mb-1">Canceled</p>
            <p className="text-2xl font-bold text-red-700">
              {
                user?.orders.filter((order) => order.status === "canceled")
                  .length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {user?.orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">#{order.id}</h3>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-lg ${
                        order.status === "done"
                          ? "bg-green-50 text-green-700"
                          : order.status === "pending"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${order.total_price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  {order.status === "done" && (
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      Buy Again
                    </button>
                  )}
                  {order.status === "pending" && (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    )
}