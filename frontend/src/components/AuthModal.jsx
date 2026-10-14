import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { apiFetch, setAuthToken } from "../services/api";

const AuthModal = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    setUser,
    fetchUser,
    showToast
  } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotRegistered(false);
    setPasswordError("");
    setErrorMessage("");
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
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          if (data.token) {
            setAuthToken(data.token);
          }
          if (data.customer) {
            setUser(data.customer);
            localStorage.setItem("shopkart_user", JSON.stringify(data.customer));
          }
          showToast("Account created & logged in! 🎉");
          await fetchUser();
          setShowAuthModal(false);
        } else {
          setErrorMessage(data.message || "Registration failed. Please check your details.");
        }
      } catch (err) {
        console.error("Register error:", err);
        setErrorMessage("Network error: Could not reach backend server. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await apiFetch("/customers/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          if (data.token) {
            setAuthToken(data.token);
          }
          if (data.customer) {
            setUser(data.customer);
            localStorage.setItem("shopkart_user", JSON.stringify(data.customer));
          }
          showToast("Logged in successfully!");
          await fetchUser();
          setShowAuthModal(false);
        } else {
          if (res.status === 404) {
            setNotRegistered(true);
            setErrorMessage("Account not registered. Please sign up first!");
          } else if (res.status === 401) {
            const msg = data.message || "Incorrect password. Please try again!";
            setPasswordError(msg);
            setErrorMessage(msg);
          } else {
            setErrorMessage(data.message || "Invalid credentials. Please try again.");
          }
        }
      } catch (err) {
        console.error("Login error:", err);
        setErrorMessage("Network error: Could not connect to API. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModeSwitch = (newMode) => {
    setAuthMode(newMode);
    setNotRegistered(false);
    setPasswordError("");
    setErrorMessage("");
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowAuthModal(false);
      }}
      className="fixed inset-0 w-full h-full z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      <div className="bg-white text-[#262626] rounded-3xl w-full max-w-[390px] p-6 sm:p-7 space-y-4 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto animate-pop-in border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[#262626]">
            {authMode === "register" ? "Sign Up" : "Login"}
          </h2>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-slate-400 hover:text-slate-800 text-xl font-bold p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* IN-WINDOW RED ERROR ALERT BANNER */}
        {notRegistered ? (
          <div className="bg-red-50 border-2 border-red-500/80 text-red-800 p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm animate-pop-in">
            <div className="flex items-center space-x-2">
              <span className="text-base shrink-0">⚠️</span>
              <span>Account not registered. Please sign up!</span>
            </div>
            <button
              type="button"
              onClick={() => handleModeSwitch("register")}
              className="bg-[#ff4c24] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#e53e1b] transition-all shrink-0 ml-2 shadow-xs"
            >
              Sign Up
            </button>
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 border-2 border-red-500/80 text-red-800 p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm animate-pop-in">
            <div className="flex items-center space-x-2">
              <span className="text-base shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="text-red-400 hover:text-red-700 font-bold ml-2 text-sm p-1"
            >
              ✕
            </button>
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "register" && (
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full px-3.5 py-2.5 bg-white text-[#262626] border border-[#c5c5c5] rounded-xl text-sm focus:outline-none focus:border-[#ff4c24]"
                required
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setNotRegistered(false);
                setErrorMessage("");
              }}
              className="w-full px-3.5 py-2.5 bg-white text-[#262626] border border-[#c5c5c5] rounded-xl text-sm focus:outline-none focus:border-[#ff4c24]"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
                setErrorMessage("");
              }}
              className={`w-full px-3.5 py-2.5 bg-white text-[#262626] border rounded-xl text-sm focus:outline-none transition-all ${
                passwordError
                  ? "border-red-500 ring-2 ring-red-400/30 bg-red-50/20"
                  : "border-[#c5c5c5] focus:border-[#ff4c24]"
              }`}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1.5 font-semibold flex items-center gap-1 animate-fade-in">
                <span>⚠️</span> {passwordError}
              </p>
            )}
          </div>

          {authMode === "register" && (
            <div>
              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full px-3.5 py-2.5 bg-white text-[#262626] border border-[#c5c5c5] rounded-xl text-sm focus:outline-none focus:border-[#ff4c24]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="tomato-btn w-full py-3 rounded-xl font-medium text-sm shadow-md disabled:opacity-50 transition-transform active:scale-98"
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
                onClick={() => handleModeSwitch("login")}
                className="text-[#ff4c24] font-bold hover:underline"
              >
                Login here
              </button>
            </span>
          ) : (
            <span>
              Create a new account?{" "}
              <button
                onClick={() => handleModeSwitch("register")}
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
