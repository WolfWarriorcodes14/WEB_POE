import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Shield } from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert(t("please_fill_fields"));
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/api/admin/login", { email, password });

      if (res.data) {
        alert(t("login_successful"));
        localStorage.setItem("admin", JSON.stringify(res.data));
        navigate("/admin/dashboard");
      } else {
        alert(t("invalid_credentials"));
      }
    } catch {
      alert(t("server_error"));
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
      {/* Language Switcher - top right */}
      <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

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
            {t("admin_portal")}
          </h2>

          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            margin: "0 0 28px 0",
            fontWeight: "400"
          }}>
            {t("secure_admin_access")}
          </p>

          <div style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#f9fafb",
            borderRadius: "12px",
            border: "1px solid #e5e7eb"
          }}>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>{t("not_admin")} </span>
            <span onClick={() => navigate("/")} style={link}>
              {t("participant_login")} →
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
              {t("sign_in_continue")}
            </h3>
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: "24px" }}>
            <label style={label}>
              <Mail size={18} style={{ marginRight: "10px" }} />
              {t("email_address")}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                placeholder="admin@example.com"
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
              {t("password")}
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
            {loading ? t("signing_in") : t("sign_in_admin")}
          </button>

          {/* Security Notice */}
          <div style={{
            marginTop: "24px",
            padding: "16px 20px",
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            borderRadius: "14px",
            border: "1px solid #fbbf24",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px"
          }}>
            <Shield size={22} style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }} />
            <p style={{
              margin: 0,
              fontSize: "13px",
              color: "#92400e",
              fontWeight: "500",
              lineHeight: "1.6"
            }}>
              {t("secure_admin_area")}
            </p>
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
          {t("copyright")}
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
  padding: "20px 0",
  position: "relative"
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

export default AdminLogin;