import { useState } from "react";
import { Eye, EyeOff, Mail, Phone, Globe } from "lucide-react";


export default function Security(){
      const [showPassword, setShowPassword] = useState({});
    
    return(
        <div className="space-y-6 animate-fadeIn">
      {/* Password Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
              />
              <button
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    current: !showPassword.current,
                  })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
              />
              <button
                onClick={() =>
                  setShowPassword({ ...showPassword, new: !showPassword.new })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
              />
              <button
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    confirm: !showPassword.confirm,
                  })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div className="pt-2">
            <button className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium">
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
            Disabled
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Email Authentication
                </p>
                <p className="text-sm text-gray-500">Receive codes via email</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">SMS Authentication</p>
                <p className="text-sm text-gray-500">Receive codes via SMS</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Active Sessions
        </h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Chrome on Windows</p>
                <p className="text-sm text-gray-500">
                  New York, USA • Current session
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Last active: Just now
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-lg">
              Active
            </span>
          </div>
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Safari on iPhone</p>
                <p className="text-sm text-gray-500">Los Angeles, USA</p>
                <p className="text-xs text-gray-400 mt-1">
                  Last active: 2 hours ago
                </p>
              </div>
            </div>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              Revoke
            </button>
          </div>
        </div>
      </div>

      {/* Login History */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Recent Login History
        </h3>
        <div className="space-y-3">
          {[
            {
              date: "2024-01-11 14:32",
              location: "New York, USA",
              device: "Chrome on Windows",
              status: "success",
            },
            {
              date: "2024-01-11 08:15",
              location: "New York, USA",
              device: "Chrome on Windows",
              status: "success",
            },
            {
              date: "2024-01-10 19:45",
              location: "Los Angeles, USA",
              device: "Safari on iPhone",
              status: "success",
            },
            {
              date: "2024-01-10 12:20",
              location: "Unknown",
              device: "Chrome on Windows",
              status: "failed",
            },
          ].map((login, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    login.status === "success" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {login.device}
                  </p>
                  <p className="text-xs text-gray-500">
                    {login.location} • {login.date}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  login.status === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {login.status === "success" ? "Success" : "Failed"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    )
}