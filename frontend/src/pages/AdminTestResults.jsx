import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Users, TrendingUp, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

function AdminTestResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [results, setResults] = useState([]);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultsRes = await axios.get(`http://localhost:8080/api/results/test/${id}`);
        setResults(resultsRes.data);
        const testRes = await axios.get(`http://localhost:8080/api/tests/${id}`);
        setTest(testRes.data);
      } catch {
        alert(t("error_loading_results"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, t]);

  if (loading) return <LoadingSpinner t={t} />;

  const avgScore =
    results.length > 0
      ? (results.reduce((sum, r) => sum + (r.memoryScore || 0), 0) / results.length).toFixed(1)
      : 0;

  const avgTime =
    results.length > 0
      ? (results.reduce((sum, r) => sum + (r.totalTime || 0), 0) / results.length).toFixed(1)
      : 0;

  return (
    <div style={styles.pageContainer}>
      {/* Language Switcher - fixed at top right */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background: "white",
          padding: "8px 12px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
        }}
      >
        <LanguageSwitcher />
      </div>

      <div style={styles.innerContainer}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <ArrowLeft size={20} style={{ color: "#1e293b" }} />
          </button>
          <div>
            <h2 style={styles.pageTitle}>{t("test_results")}</h2>
            <p style={styles.pageSubtitle}>{test?.title || t("loading_test")}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <StatCard
            icon={<Users size={24} />}
            label={t("total_attempts")}
            value={results.length}
            bgColor="#dbeafe"
            iconColor="#2563eb"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            label={t("average_score")}
            value={`${avgScore}%`}
            bgColor="#d1fae5"
            iconColor="#10b981"
          />
          <StatCard
            icon={<Clock size={24} />}
            label={t("average_time")}
            value={`${avgTime}s`}
            bgColor="#fef3c7"
            iconColor="#f59e0b"
          />
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          <h3 style={styles.tableTitle}>{t("student_submissions")}</h3>
          {results.length === 0 ? (
            <div style={styles.emptyState}>
              <Users size={56} style={{ color: "#d1d5db" }} />
              <p style={{ fontSize: "16px", color: "#6b7280", marginTop: "16px" }}>
                {t("no_submissions")}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>{t("user_id")}</th>
                    <th style={styles.th}>{t("email")}</th>
                    <th style={styles.th}>{t("score")}</th>
                    <th style={styles.th}>{t("time")}</th>
                    <th style={styles.th}>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => (
                    <tr key={r.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.numberBadge}>{idx + 1}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontWeight: "500", color: "#1e293b" }}>{r.userId}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: "#64748b" }}>{r.userEmail || "N/A"}</span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "10px 18px",
                            background:
                              r.memoryScore >= 70
                                ? "#d1fae5"
                                : r.memoryScore >= 40
                                ? "#fef3c7"
                                : "#fee2e2",
                            color:
                              r.memoryScore >= 70
                                ? "#047857"
                                : r.memoryScore >= 40
                                ? "#d97706"
                                : "#dc2626",
                            borderRadius: "12px",
                            fontWeight: "700",
                            fontSize: "14px",
                            display: "inline-block",
                          }}
                        >
                          {r.memoryScore}%
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Clock size={18} style={{ color: "#f59e0b" }} />
                          <span style={{ color: "#1e293b", fontWeight: "600" }}>
                            {r.totalTime}s
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() =>
                            navigate(`/admin/result/${r.id}`, {
                              state: { ...r, questions: test?.questions || [] },
                            })
                          }
                          style={styles.viewButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 16px -4px rgba(37,99,235,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px -2px rgba(37,99,235,0.3)";
                          }}
                        >
                          <Eye size={16} /> {t("view_details")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper components
const StatCard = ({ icon, label, value, bgColor, iconColor }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIcon, background: bgColor }}>
      {React.cloneElement(icon, { style: { color: iconColor } })}
    </div>
    <div>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  </div>
);

const LoadingSpinner = ({ t }) => (
  <div style={styles.spinnerContainer}>
    <div style={styles.spinnerBox}>
      <div style={styles.spinner}></div>
      <p style={{ color: "#64748b", marginTop: "16px", fontWeight: "500" }}>
        {t("loading_results")}
      </p>
    </div>
  </div>
);

// Styles (unchanged)
const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#e6f0ff",
    padding: "32px",
  },
  innerContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    background: "white",
    padding: "32px 36px",
    borderRadius: "24px",
    marginBottom: "32px",
    display: "flex",
    alignItems: "center",
    gap: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  backButton: {
    padding: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 8px 0",
    color: "#1e293b",
    letterSpacing: "-0.5px",
  },
  pageSubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "500",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  statCard: {
    background: "white",
    padding: "28px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s",
  },
  statIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: "-0.5px",
  },
  tableContainer: {
    background: "white",
    borderRadius: "24px",
    padding: "36px",
    marginBottom: "32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  tableTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "28px",
    marginTop: 0,
    paddingBottom: "20px",
    borderBottom: "2px solid #f1f5f9",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 24px",
    background: "#f8fafc",
    borderRadius: "20px",
    border: "2px dashed #cbd5e1",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 14px",
  },
  th: {
    padding: "16px 20px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    background: "transparent",
  },
  td: {
    padding: "22px 20px",
    borderTop: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0",
  },
  tr: {
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    transition: "all 0.3s",
  },
  numberBadge: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
  },
  viewButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px -2px rgba(37,99,235,0.3)",
  },
  spinnerContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e6f0ff",
  },
  spinnerBox: {
    background: "white",
    padding: "48px",
    borderRadius: "24px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #e2e8f0",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 16px",
  },
};

export default AdminTestResults;