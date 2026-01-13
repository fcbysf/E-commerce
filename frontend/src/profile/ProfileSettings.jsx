import { CreditCard, ChevronRight } from "lucide-react";

export default function ProfileSettings() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Notifications */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            {
              title: "Order Updates",
              desc: "Get notified about your order status",
              enabled: true,
            },
            {
              title: "Promotions & Offers",
              desc: "Receive special offers and discounts",
              enabled: true,
            },
            {
              title: "Product Recommendations",
              desc: "Get personalized product suggestions",
              enabled: false,
            },
            {
              title: "Newsletter",
              desc: "Weekly newsletter with latest products",
              enabled: true,
            },
            {
              title: "Security Alerts",
              desc: "Important security notifications",
              enabled: true,
            },
          ].map((notif, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="font-medium text-gray-900">{notif.title}</p>
                <p className="text-sm text-gray-500">{notif.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={notif.enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Privacy Settings
        </h3>
        <div className="space-y-4">
          {[
            {
              title: "Profile Visibility",
              desc: "Make your profile visible to other users",
              enabled: true,
            },
            {
              title: "Activity Status",
              desc: "Show when you're active",
              enabled: false,
            },
            {
              title: "Purchase History",
              desc: "Allow others to see your purchase history",
              enabled: false,
            },
          ].map((privacy, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="font-medium text-gray-900">{privacy.title}</p>
                <p className="text-sm text-gray-500">{privacy.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={privacy.enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Language & Region
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-500 mb-2">Language</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Time Zone
            </label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>EST (UTC-5)</option>
              <option>PST (UTC-8)</option>
              <option>CST (UTC-6)</option>
              <option>MST (UTC-7)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">Currency</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Date Format
            </label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Payment Methods</h3>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium text-sm">
            Add Payment Method
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded">
                Default
              </span>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl p-8 border border-red-200 shadow-sm">
        <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group">
            <div className="text-left">
              <p className="font-medium text-red-700">Deactivate Account</p>
              <p className="text-sm text-red-600">
                Temporarily disable your account
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-red-600" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group">
            <div className="text-left">
              <p className="font-medium text-red-700">Delete Account</p>
              <p className="text-sm text-red-600">
                Permanently delete your account and data
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
