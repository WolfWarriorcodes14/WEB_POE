import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, FileQuestion, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

function TestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://web-poe-u1c9.onrender.com/api/tests/${id}`)
      .then((res) => {
        setTest(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading test details:", err);
        setError(t("failed_load_test_details"));
        setLoading(false);
      });
  }, [id, t]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#e6f0ff", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{
          background: "white",
          padding: "48px 64px",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          textAlign: "center"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e2e8f0",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }} />
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: 0 }}>
            {t("loading_test_details")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div style={{ minHeight: "100vh", background: "#e6f0ff", padding: "24px" }}>
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "8px 12px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
          <LanguageSwitcher />
        </div>
        <div style={{ maxWidth: "600px", margin: "0 auto", marginTop: "80px" }}>
          <div style={{
            background: "white",
            padding: "48px 40px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            border: "2px solid #fee2e2"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <AlertCircle size={32} style={{ color: "#dc2626" }} />
            </div>
            <p style={{ color: "#dc2626", fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>
              {error || t("test_not_found")}
            </p>
            <button
              onClick={() => navigate("/student/tests")}
              style={{
                padding: "14px 28px",
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 12px rgba(30, 41, 59, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #334155 0%, #475569 100%)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 41, 59, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #1e293b 0%, #334155 100%)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(30, 41, 59, 0.3)";
              }}
            >
              {t("back_to_tests")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#e6f0ff", padding: "24px" }}>
      {/* Language Switcher - fixed at top right */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "8px 12px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
        <LanguageSwitcher />
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Enhanced Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            padding: "28px 32px",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => navigate("/student/tests")}
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)";
                e.currentTarget.style.transform = "translateX(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <ArrowLeft size={22} strokeWidth={2.5} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                  {test.title}
                </h2>
                <span style={{
                  background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  color: "#1e40af",
                  padding: "6px 14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  border: "1px solid #93c5fd",
                }}>
                  {t("preview")}
                </span>
              </div>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                {test.questions.length} {t("questions_count")}
              </p>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              padding: "12px 20px",
              borderRadius: "12px",
              border: "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <FileQuestion size={20} style={{ color: "#3b82f6" }} />
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#1e40af" }}>
                {t("admin_view")}
              </span>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
          {test.questions.map((q, index) => (
            <div
              key={q.id}
              style={{
                background: "white",
                padding: "32px",
                borderRadius: "20px",
                border: "2px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Question Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      color: "white",
                      width: "38px",
                      height: "38px",
                      borderRadius: "12px",
                      fontSize: "15px",
                      fontWeight: "700",
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    {index + 1}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      background: "#f8fafc",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    {q.type === "MCQ" ? t("multiple_choice") : t("fill_blanks")}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "24px",
                lineHeight: "1.6"
              }}>
                {q.questionText}
              </h3>

              {/* Options (for MCQ) */}
              {q.type === "MCQ" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                  {[
                    { label: "A", value: q.optionA },
                    { label: "B", value: q.optionB }
                  ].map((option) => (
                    <div
                      key={option.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "16px 20px",
                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#475569",
                        fontWeight: "700",
                        fontSize: "14px",
                        flexShrink: 0,
                      }}>
                        {option.label}
                      </div>
                      <span style={{ fontSize: "15px", color: "#1e293b", fontWeight: "500" }}>
                        {option.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: "16px 20px",
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "20px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontWeight: "600", color: "#64748b", fontSize: "14px" }}>{t("answer_type")}:</span>
                    <span style={{ color: "#1e293b", fontSize: "14px" }}>{t("text_input")}</span>
                  </div>
                </div>
              )}

              {/* Correct Answer Badge */}
              <div style={{
                padding: "18px 20px",
                background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                borderRadius: "12px",
                border: "2px solid #86efac",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
              }}>
                <CheckCircle size={24} style={{ color: "#10b981", flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: "700", color: "#059669", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "4px" }}>
                    {t("correct_answer")}
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "600", color: "#065f46" }}>
                    {q.correctAnswer}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/student/tests")}
            style={{
              padding: "16px 32px",
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "700",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 8px 24px rgba(30, 41, 59, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #334155 0%, #475569 100%)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(30, 41, 59, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #1e293b 0%, #334155 100%)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(30, 41, 59, 0.3)";
            }}
          >
            <ArrowLeft size={20} />
            {t("back_to_tests")}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default TestDetails;