import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { apiFetch, setAuthToken } from "../services/api";

const AuthModal = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    fetchUser,
    showToast
  } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotRegistered(false);
    setPasswordError("");
    setLoading(true);

    if (authMode === "register") {
      try {
        const res = await apiFetch("/customers/register", {
          method: "POST",
          body: JSON.stringify({
            fullName,
            email,
            password,
            phone: phone || "9876543210"
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast("Account created successfully! Please log in.");
          setAuthMode("login");
        } else {
          showToast(data.message || "Registration failed", "error");
        }
      } catch (err) {
        showToast("Network error", "error");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await apiFetch("/customers/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.token) {
            setAuthToken(data.token);
          }
          showToast("Logged in successfully!");
          await fetchUser();
          setShowAuthModal(false);
        } else {
          if (res.status === 404) setNotRegistered(true);
          else if (res.status === 401) setPasswordError(data.message || "Incorrect password!");
          showToast(data.message || "Invalid credentials", "error");
        }
      } catch (err) {
        showToast("Network error", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-[360px] sm:max-w-[400px] p-7 space-y-5 shadow-2xl relative animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[#262626]">
            {authMode === "register" ? "Sign Up" : "Login"}
          </h2>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-slate-400 hover:text-slate-800 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Account Not Registered Prompt */}
        {notRegistered && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold flex items-center justify-between">
            <span>Account not found. Please sign up!</span>
            <button
              type="button"
              onClick={() => {
                setNotRegistered(false);
                setAuthMode("register");
              }}
              className="bg-[#ff4c24] text-white px-2.5 py-1 rounded-md text-[11px] font-bold hover:bg-[#e53e1b]"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "register" && (
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#c5c5c5] rounded-md text-sm focus:outline-[#ff4c24]"
                required
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#c5c5c5] rounded-md text-sm focus:outline-[#ff4c24]"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3.5 py-2.5 border rounded-md text-sm focus:outline-[#ff4c24] ${
                passwordError ? "border-rose-500" : "border-[#c5c5c5]"
              }`}
              required
            />
            {passwordError && (
              <p className="text-rose-500 text-xs mt-1 font-semibold">{passwordError}</p>
            )}
          </div>

          {authMode === "register" && (
            <div>
              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#c5c5c5] rounded-md text-sm focus:outline-[#ff4c24]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="tomato-btn w-full py-3 rounded-md font-medium text-sm shadow-md disabled:opacity-50"
          >
            {loading ? "Please wait..." : authMode === "register" ? "Create account" : "Login"}
          </button>

          <div className="flex items-start space-x-2 text-xs text-slate-500 pt-1">
            <input type="checkbox" className="mt-0.5 accent-[#ff4c24]" required defaultChecked />
            <span>By continuing, I agree to the terms of use & privacy policy.</span>
          </div>
        </form>

        {/* Toggle Mode */}
        <p className="text-xs text-slate-500 text-center">
          {authMode === "register" ? (
            <span>
              Already have an account?{" "}
              <button
                onClick={() => setAuthMode("login")}
                className="text-[#ff4c24] font-bold hover:underline"
              >
                Login here
              </button>
            </span>
          ) : (
            <span>
              Create a new account?{" "}
              <button
                onClick={() => setAuthMode("register")}
                className="text-[#ff4c24] font-bold hover:underline"
              >
                Click here
              </button>
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
