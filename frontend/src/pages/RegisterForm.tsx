import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, User, Phone, Calendar, Lock, CheckCircle } from "lucide-react";

function Register() {
  const navigate = useNavigate();

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
      alert("Please fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/register", form);
      alert("Account Created Successfully ✅");
      navigate("/");
    } catch {
      alert("Registration Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={{ width: "100%", maxWidth: "700px", padding: "0 20px" }}>

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
            Create Your Account
          </h2>

          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            margin: "0 0 28px 0",
            fontWeight: "400"
          }}>
            Join us and start taking tests today
          </p>

          <div style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#f9fafb",
            borderRadius: "12px",
            border: "1px solid #e5e7eb"
          }}>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>Already have an account? </span>
            <span onClick={() => navigate("/")} style={link}>
              Sign in here →
            </span>
          </div>
        </div>

        {/* Registration Card */}
        <div style={card}>

          {/* Basic Information Section */}
          <div style={sectionContainer}>
            <div style={sectionHeader}>
              <User size={22} style={{ color: "#2563eb" }} />
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#111827" }}>
                Basic Information
              </h3>
            </div>

            <div style={fieldGrid}>
              <div style={fieldContainer}>
                <label style={label}>
                  <Mail size={18} style={{ marginRight: "10px" }} />
                  Email Address *
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
                  <User size={18} style={{ marginRight: "10px" }} />
                  Full Name *
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
                  <Phone size={18} style={{ marginRight: "10px" }} />
                  Contact Number
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
                  <Calendar size={18} style={{ marginRight: "10px" }} />
                  Age
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
              <Lock size={22} style={{ color: "#059669" }} />
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#111827" }}>
                Security
              </h3>
            </div>

            <div style={fieldGrid}>
              <div style={fieldContainer}>
                <label style={label}>
                  <Lock size={18} style={{ marginRight: "10px" }} />
                  Password *
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
                  <Lock size={18} style={{ marginRight: "10px" }} />
                  Confirm Password *
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
              marginTop: "20px",
              padding: "18px 20px",
              background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
              borderRadius: "14px",
              border: "1px solid #86efac"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <CheckCircle size={20} style={{ color: "#059669" }} />
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#065f46" }}>
                  Password Requirements:
                </span>
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: "30px",
                fontSize: "13px",
                color: "#047857",
                fontWeight: "400",
                lineHeight: "1.8"
              }}>
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Include numbers and special characters</li>
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
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
  padding: "40px 0"
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

const sectionContainer = {
  marginBottom: "36px",
  paddingBottom: "36px",
  borderBottom: "1px solid #e5e7eb"
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "28px",
  padding: "18px 24px",
  background: "#f9fafb",
  borderRadius: "14px",
  border: "1px solid #e5e7eb"
};

const fieldGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "24px"
};

const fieldContainer = {
  display: "flex",
  flexDirection: "column"
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
  padding: "18px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 6px -1px rgba(37,99,235,0.2)",
  letterSpacing: "0",
  marginTop: "8px"
};

export default Register;
