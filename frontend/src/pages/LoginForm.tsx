import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/api/login", { email, password });

      if (res.data) {
        alert("Login Successful ✅");
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/dashboard");
      } else {
        alert("Invalid Credentials ❌");
      }
    } catch {
      alert("Server Error ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={container}>
      <div style={{ width: "100%", maxWidth: "460px", padding: "0 20px" }}>

        {/* Logo & Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={logoBox}>स</div>

          <h2 style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 12px 0",
            letterSpacing: "-0.025em"
          }}>
            Welcome Back
          </h2>

          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            margin: "0 0 28px 0",
            fontWeight: "400"
          }}>
            Sign in to your participant account
          </p>

          <div style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#f9fafb",
            borderRadius: "12px",
            border: "1px solid #e5e7eb"
          }}>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>New here? </span>
            <span onClick={() => navigate("/register")} style={link}>
              Create an account →
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div style={card}>
          <div style={{
            marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
              margin: 0
            }}>
              Login to your account
            </h3>
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: "24px" }}>
            <label style={label}>
              <Mail size={18} style={{ marginRight: "10px" }} />
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                style={input}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "32px" }}>
            <label style={label}>
              <Lock size={18} style={{ marginRight: "10px" }} />
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={input}
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              ...btn,
              opacity: loading ? "0.7" : "1",
              cursor: loading ? "not-allowed" : "pointer"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "#1d4ed8";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 16px -4px rgba(37,99,235,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "#2563eb";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(37,99,235,0.2)";
              }
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Admin Link */}
          <div style={{
            marginTop: "24px",
            textAlign: "center",
            padding: "16px 20px",
            background: "#f9fafb",
            borderRadius: "14px",
            border: "1px solid #e5e7eb"
          }}>
            <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "400" }}>
              Are you an admin?{" "}
            </span>
            <span
              onClick={() => navigate("/admin")}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "600",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.color = "#1d4ed8"}
              onMouseLeave={(e) => e.target.style.color = "#2563eb"}
            >
              Admin Login →
            </span>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          marginTop: "28px",
          fontSize: "13px",
          color: "#9ca3af",
          fontWeight: "400"
        }}>
          © 2024 Test Portal. All rights reserved.
        </p>
      </div>

      <style>
        {`
          @media (max-width: 640px) {
            h2 {
              font-size: 28px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  background: "#f0f6ff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px 0"
};

const logoBox = {
  width: "72px",
  height: "72px",
  background: "#2563eb",
  margin: "0 auto 28px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontSize: "36px",
  fontWeight: "600",
  borderRadius: "18px",
  boxShadow: "0 8px 16px -4px rgba(37,99,235,0.4)"
};

const link = {
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: "600",
  textDecoration: "none",
  transition: "color 0.2s"
};

const card = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "40px",
  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
};

const label = {
  display: "flex",
  alignItems: "center",
  marginBottom: "12px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#111827",
  letterSpacing: "0"
};

const input = {
  width: "100%",
  padding: "16px 18px",
  border: "1px solid #d1d5db",
  borderRadius: "14px",
  fontSize: "15px",
  fontWeight: "400",
  color: "#111827",
  transition: "all 0.2s ease",
  outline: "none",
  boxSizing: "border-box",
  background: "#ffffff"
};

const btn = {
  width: "100%",
  padding: "16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 6px -1px rgba(37,99,235,0.2)",
  letterSpacing: "0"
};

export default Login;
