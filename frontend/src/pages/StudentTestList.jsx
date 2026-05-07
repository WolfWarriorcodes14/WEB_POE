import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, FileQuestion, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

function StudentTestList() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tests, setTests] = useState([]);
  const [attempted, setAttempted] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const getQuestionCount = (test) => {
    if (test.questions && test.questions.length) return test.questions.length;
    if (test.sections) {
      return test.sections.reduce((sum, section) => sum + (section.questions?.length || 0), 0);
    }
    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testsRes = await axios.get("http://localhost:8080/api/tests");
        setTests(Array.isArray(testsRes.data) ? testsRes.data : []);

        const resultsRes = await axios.get(
          `http://localhost:8080/api/results/student/${user.id}`
        );

        const attemptedIds = resultsRes.data.map(r => r.testId);
        setAttempted(attemptedIds);

      } catch {
        alert(t("error_loading_tests"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, t]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#e6f0ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
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
            {t("loading_tests")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#e6f0ff", padding: "28px" }}>
      {/* Language Switcher - fixed at top right */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "8px 12px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
        <LanguageSwitcher />
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          padding: "28px 32px",
          borderRadius: "20px",
          marginBottom: "28px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/dashboard")} style={backButtonStyle}>
              <ArrowLeft size={20} />
            </button>

            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: "28px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: "0 0 6px 0"
              }}>
                {t("available_tests")}
              </h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
                {tests.length} {t("tests_available_desc")}
              </p>
            </div>

            <div style={{
              padding: "12px 20px",
              background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: "1px solid #86efac"
            }}>
              <CheckCircle size={20} style={{ color: "#059669" }} />
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#065f46" }}>
                {attempted.length} {t("completed")}
              </span>
            </div>
          </div>
        </div>

        {/* Test List */}
        {tests.length === 0 ? (
          <div style={{
            background: "white",
            padding: "64px 24px",
            borderRadius: "20px",
            textAlign: "center",
            border: "2px dashed #cbd5e1",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <FileQuestion size={64} style={{ color: "#cbd5e1", marginBottom: "20px" }} />
            <h3 style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1e293b",
              margin: "0 0 8px 0"
            }}>
              {t("no_tests_available")}
            </h3>
            <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>
              {t("check_back_later")}
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px"
          }}>
            {tests.map((test) => {
              const isAttempted = attempted.includes(test.id);
              const questionCount = getQuestionCount(test);
              return (
                <div
                  key={test.id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "28px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.15)";
                    e.currentTarget.style.borderColor = isAttempted ? "#10b981" : "#3b82f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  {isAttempted && (
                    <div style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      padding: "6px 12px",
                      background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      border: "1px solid #86efac"
                    }}>
                      <CheckCircle size={14} style={{ color: "#059669" }} />
                      <span style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#065f46",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        {t("completed")}
                      </span>
                    </div>
                  )}

                  <div style={{
                    width: "56px",
                    height: "56px",
                    background: isAttempted
                      ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
                      : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    boxShadow: isAttempted
                      ? "0 8px 24px rgba(16, 185, 129, 0.3)"
                      : "0 8px 24px rgba(59, 130, 246, 0.3)"
                  }}>
                    <FileQuestion size={28} style={{ color: isAttempted ? "#10b981" : "#3b82f6" }} />
                  </div>

                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: "0 0 12px 0",
                    lineHeight: "1.4"
                  }}>
                    {test.title}
                  </h3>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "24px",
                    paddingBottom: "20px",
                    borderBottom: "1px solid #f1f5f9"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <FileQuestion size={16} style={{ color: "#64748b" }} />
                      <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>
                        {questionCount} {t("questions")}
                      </span>
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <Clock size={16} style={{ color: "#64748b" }} />
                      <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>
                        ~{questionCount * 2} {t("min")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/test/${test.id}`)}
                    style={{
                      width: "100%",
                      padding: "14px 20px",
                      background: isAttempted
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "700",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: isAttempted
                        ? "0 4px 12px rgba(16, 185, 129, 0.3)"
                        : "0 4px 12px rgba(59, 130, 246, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = isAttempted
                        ? "0 8px 20px rgba(16, 185, 129, 0.4)"
                        : "0 8px 20px rgba(59, 130, 246, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isAttempted
                        ? "0 4px 12px rgba(16, 185, 129, 0.3)"
                        : "0 4px 12px rgba(59, 130, 246, 0.3)";
                    }}
                  >
                    <PlayCircle size={18} />
                    {isAttempted ? t("view_results") : t("start_test")}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            div[style*="gridTemplateColumns"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

const backButtonStyle = {
  padding: "12px",
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
};

export default StudentTestList;