import { useContext, useState } from "react";
import { Eye, EyeOff, Mail, Phone } from "lucide-react";
import { Context } from "../context/context";
import toast from "react-hot-toast";

export default function Security() {
  const [showPassword, setShowPassword] = useState({});
  const { api, token, userId } = useContext(Context);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    newPassword_comfirmation: "",
  });
  const changePassword = (e) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.target);
    formData.append("_method", "PUT");
    const data = Object.fromEntries(formData);
    fetch(api + "user/" + userId, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("password updated successfully");
          setErrors({});
          e.target.reset();
          return res.json();
        } else if (res.status == 422 || res.status == 400) {

          return res.json();
        } else {
          e.target.currentPassword.value = "";

          throw new Error("something went wrong");
        }
      })
      .then((data) => {
        if (data.errors) {
          setErrors(data.errors);
        } else if(data !=="password updated") {
          toast.error(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Password Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Change Password
        </h3>
        <form className="space-y-4" onSubmit={changePassword}>
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                placeholder="Enter current password"
                name="currentPassword"
                className="w-4/5 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    current: !showPassword.current,
                  })
                }
                className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors?.currentPassword && (
              <small className="text-red-500 ms-3">
                {errors?.currentPassword}
              </small>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                placeholder="Enter new password"
                name="newPassword"
                className="w-4/5 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({ ...showPassword, new: !showPassword.new })
                }
                className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors?.newPassword && (
              <small className="text-red-500 ms-3">{errors?.newPassword}</small>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="newPassword_confirmation"
                placeholder="Confirm new password"
                className="w-4/5  px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    confirm: !showPassword.confirm,
                  })
                }
                className="absolute right-20  top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors?.newPassword_comfirmation && (
              <small className="text-red-500 ms-3">
                {errors?.newPassword_comfirmation}
              </small>
            )}
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
            >
              Update Password
            </button>
          </div>
        </form>
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
    </div>
  );
}
