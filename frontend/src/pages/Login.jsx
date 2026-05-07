import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext"; // ← add this

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage(); // ← get translation function
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
      const res = await axios.post("https://web-poe-u1c9.onrender.com/api/login", { email, password });

      if (res.data) {
        alert(t("login_successful"));
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/dashboard");
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

      <div style={{ width: "100%", maxWidth: "440px", padding: "0 20px" }}>

        {/* Logo & Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={logoBox}>स</div>

          <h2 style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#1e293b",
            margin: "0 0 8px 0",
            letterSpacing: "-0.5px"
          }}>
            {t("welcome_back")}
          </h2>

          <p style={{
            fontSize: "15px",
            color: "#64748b",
            margin: "0 0 24px 0",
            fontWeight: "500"
          }}>
            {t("signin_participant")}
          </p>

          <div style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderRadius: "10px",
            border: "1px solid #e2e8f0"
          }}>
            <span style={{ fontSize: "14px", color: "#64748b" }}>{t("new_here")} </span>
            <span onClick={() => navigate("/register")} style={link}>
              {t("create_account")}
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div style={card}>
          <div style={{
            marginBottom: "28px",
            paddingBottom: "20px",
            borderBottom: "2px solid #f1f5f9"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0
            }}>
              {t("login_to_account")}
            </h3>
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={label}>
              <Mail size={16} style={{ marginRight: "8px" }} />
              {t("email_address")}
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
          <div style={{ marginBottom: "28px" }}>
            <label style={label}>
              <Lock size={16} style={{ marginRight: "8px" }} />
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
                e.currentTarget.style.background = "linear-gradient(135deg, #334155 0%, #475569 100%)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(15, 23, 42, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.25)";
              }
            }}
          >
            {loading ? t("signing_in") : t("sign_in")}
          </button>

          {/* Admin Link */}
          <div style={{
            marginTop: "24px",
            textAlign: "center",
            padding: "16px",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
              {t("are_you_admin")}{" "}
            </span>
            <span
              onClick={() => navigate("/admin")}
              style={{
                color: "#4f46e5",
                cursor: "pointer",
                fontWeight: "700",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.color = "#3730a3"}
              onMouseLeave={(e) => e.target.style.color = "#4f46e5"}
            >
              {t("admin_login")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "13px",
          color: "#94a3b8",
          fontWeight: "500"
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
  width: "60px",
  height: "60px",
  background: "#4f46e5",
  margin: "0 auto 24px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontSize: "32px",
  fontWeight: "600",
  borderRadius: "4px"
};

const link = {
  color: "#4f46e5",
  cursor: "pointer",
  fontWeight: "600",
  textDecoration: "none",
  transition: "color 0.2s"
};

const card = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "24px",
  padding: "36px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.12)"
};

const label = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#1e293b",
  letterSpacing: "0.2px"
};

const input = {
  width: "100%",
  padding: "14px 16px",
  border: "2px solid #e2e8f0",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#1e293b",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  outline: "none",
  boxSizing: "border-box",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"
};

const btn = {
  width: "100%",
  padding: "16px",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.25)",
  letterSpacing: "0.3px"
};

export default Login;