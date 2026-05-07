import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, User, Phone, Calendar, Lock, CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    contactNumber: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.fullName || !form.password || !form.confirmPassword) {
      alert(t("fill_required_fields"));
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert(t("passwords_do_not_match"));
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/register", form);
      alert(t("account_created_successfully"));
      navigate("/");
    } catch {
      alert(t("registration_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      {/* Language Switcher - fixed at top right */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "8px 12px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
        <LanguageSwitcher />
      </div>

      <div style={{ width: "100%", maxWidth: "700px", padding: "0 20px" }}>

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
            {t("create_account")}
          </h2>

          <p style={{
            fontSize: "15px",
            color: "#64748b",
            margin: "0 0 24px 0",
            fontWeight: "500"
          }}>
            {t("join_today")}
          </p>

          <div style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderRadius: "10px",
            border: "1px solid #e2e8f0"
          }}>
            <span style={{ fontSize: "14px", color: "#64748b" }}>{t("already_account")} </span>
            <span onClick={() => navigate("/")} style={link}>
              {t("sign_in_here")} →
            </span>
          </div>
        </div>

        {/* Registration Card */}
        <div style={card}>

          {/* Basic Information Section */}
          <div style={sectionContainer}>
            <div style={sectionHeader}>
              <User size={20} style={{ color: "#3b82f6" }} />
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>
                {t("basic_information")}
              </h3>
            </div>

            <div style={fieldGrid}>
              <div style={fieldContainer}>
                <label style={label}>
                  <Mail size={16} style={{ marginRight: "8px" }} />
                  {t("email_address")} *
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  style={input}
                />
              </div>

              <div style={fieldContainer}>
                <label style={label}>
                  <User size={16} style={{ marginRight: "8px" }} />
                  {t("full_name")} *
                </label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  onChange={handleChange}
                  style={input}
                />
              </div>

              <div style={fieldContainer}>
                <label style={label}>
                  <Phone size={16} style={{ marginRight: "8px" }} />
                  {t("contact_number")}
                </label>
                <input
                  name="contactNumber"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  onChange={handleChange}
                  style={input}
                />
              </div>

              <div style={fieldContainer}>
                <label style={label}>
                  <Calendar size={16} style={{ marginRight: "8px" }} />
                  {t("age")}
                </label>
                <input
                  name="age"
                  type="number"
                  placeholder="25"
                  onChange={handleChange}
                  style={input}
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div style={sectionContainer}>
            <div style={sectionHeader}>
              <Lock size={20} style={{ color: "#10b981" }} />
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>
                {t("security")}
              </h3>
            </div>

            <div style={fieldGrid}>
              <div style={fieldContainer}>
                <label style={label}>
                  <Lock size={16} style={{ marginRight: "8px" }} />
                  {t("password")} *
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  onChange={handleChange}
                  style={input}
                />
              </div>

              <div style={fieldContainer}>
                <label style={label}>
                  <Lock size={16} style={{ marginRight: "8px" }} />
                  {t("confirm_password")} *
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••••••"
                  onChange={handleChange}
                  style={input}
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div style={{
              marginTop: "16px",
              padding: "16px",
              background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
              borderRadius: "12px",
              border: "1px solid #86efac"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <CheckCircle size={16} style={{ color: "#10b981" }} />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#065f46" }}>
                  {t("password_requirements")}
                </span>
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: "24px",
                fontSize: "13px",
                color: "#047857",
                fontWeight: "500"
              }}>
                <li>{t("password_length")}</li>
                <li>{t("password_case")}</li>
                <li>{t("password_characters")}</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
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
            {loading ? t("creating_account") : t("create_account")}
          </button>
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
  padding: "40px 0",
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
  padding: "40px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.12)"
};

const sectionContainer = {
  marginBottom: "32px",
  paddingBottom: "32px",
  borderBottom: "2px solid #f1f5f9"
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "24px",
  padding: "16px 20px",
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  borderRadius: "12px",
  border: "1px solid #e2e8f0"
};

const fieldGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px"
};

const fieldContainer = {
  display: "flex",
  flexDirection: "column"
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
  padding: "18px",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.25)",
  letterSpacing: "0.3px",
  marginTop: "8px"
};

export default Register;