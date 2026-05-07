import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ArrowLeft, Award, Clock, TrendingUp, User, Star, Save } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

function AdminResultDetails() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [result, setResult] = useState(null);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [gradedAnswers, setGradedAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let attemptData = state;
        if (!attemptData && id) {
          const resultRes = await axios.get(`http://localhost:8080/api/results/${id}`);
          attemptData = resultRes.data;
        }
        if (!attemptData) {
          setLoading(false);
          return;
        }
        setResult(attemptData);

        const testRes = await axios.get(`http://localhost:8080/api/tests/${attemptData.testId}`);
        setTest(testRes.data);

        if (attemptData.attemptId) {
          try {
            const fbRes = await axios.get(`http://localhost:8080/api/feedback/attempt/${attemptData.attemptId}`);
            setFeedback(fbRes.data);
          } catch (err) {
            if (err.response?.status !== 404) {
              console.error("Error fetching feedback:", err);
            }
          }
        }
      } catch (err) {
        console.error(err);
        alert(t("error_loading_result_details"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [state, id, t]);

  const handlePointsChange = (questionId, points) => {
    setGradedAnswers(prev => ({ ...prev, [questionId]: parseFloat(points) || 0 }));
  };

  const handleSaveGrades = async () => {
    if (Object.keys(gradedAnswers).length === 0) {
      alert(t("no_changes_made"));
      return;
    }
    setSaving(true);
    try {
      await axios.put(`http://localhost:8080/api/results/grade/${result.id}`, gradedAnswers);
      alert(t("grades_saved_successfully"));
      const updatedResult = await axios.get(`http://localhost:8080/api/results/${result.id}`);
      setResult(updatedResult.data);
      setGradedAnswers({});
      const testRes = await axios.get(`http://localhost:8080/api/tests/${result.testId}`);
      setTest(testRes.data);
    } catch (err) {
      console.error(err);
      alert(t("failed_to_save_grades"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner t={t} />;
  if (!result || !test) return <NoDataError navigate={navigate} t={t} />;

  const answers = JSON.parse(result.answersJson);
  const score = result.memoryScore || 0;
  const remaining = 100 - score;
  const pieData = [{ name: t("score"), value: score }, { name: t("remaining"), value: remaining }];
  const COLORS = ["#10b981", "#e5e7eb"];

  let sectionsData = [];
  if (test.sections) {
    sectionsData = test.sections.map(section => {
      let sectionEarned = 0;
      let sectionPossible = 0;
      const sectionQuestions = section.questions.map(q => {
        const answerData = answers[q.id.toString()];
        const pointsEarned = answerData?.pointsEarned || 0;
        const pointsPossible = q.points || 1;
        sectionEarned += pointsEarned;
        sectionPossible += pointsPossible;
        return {
          ...q,
          answer: answerData?.answer || "(no answer)",
          pointsEarned,
          pointsPossible,
          timeSpent: answerData?.time || 0
        };
      });
      return {
        id: section.id,
        title: section.title,
        earned: sectionEarned,
        possible: sectionPossible,
        questions: sectionQuestions
      };
    });
  } else if (test.questions) {
    let flatQuestions = test.questions.map(q => {
      const answerData = answers[q.id.toString()];
      const pointsEarned = answerData?.pointsEarned || 0;
      const pointsPossible = q.points || 1;
      return {
        ...q,
        answer: answerData?.answer || "(no answer)",
        pointsEarned,
        pointsPossible,
        timeSpent: answerData?.time || 0
      };
    });
    sectionsData = [{
      id: 1,
      title: t("questions"),
      earned: flatQuestions.reduce((sum, q) => sum + q.pointsEarned, 0),
      possible: flatQuestions.reduce((sum, q) => sum + q.pointsPossible, 0),
      questions: flatQuestions
    }];
  }

  const totalEarnedPoints = sectionsData.reduce((sum, s) => sum + s.earned, 0);
  const totalPossiblePoints = sectionsData.reduce((sum, s) => sum + s.possible, 0);
  const barData = sectionsData.map(s => ({
    section: s.title.substring(0, 20) + (s.title.length > 20 ? "..." : ""),
    fullTitle: s.title,
    score: (s.earned / s.possible) * 100,
    earned: s.earned,
    possible: s.possible
  }));

  return (
    <div style={styles.pageContainer}>
      {/* Language Switcher - fixed at top right */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "8px 12px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
        <LanguageSwitcher />
      </div>

      <div style={styles.innerContainer}>
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButtonSmall}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={styles.pageTitle}>{t("student_performance_details")}</h2>
            <p style={styles.pageSubtitle}>{t("comprehensive_analysis")}</p>
          </div>
          <button onClick={handleSaveGrades} disabled={saving} style={styles.saveButton}>
            <Save size={18} /> {saving ? t("saving") : t("save_grades")}
          </button>
        </div>

        <div style={styles.cardGrid}>
          <InfoCard icon={<User size={24} />} label={t("student_id")} value={result.userId} bgColor="#dbeafe" iconColor="#2563eb" />
          <InfoCard icon={<Award size={24} />} label={t("score")} value={`${score.toFixed(1)}%`} bgColor="#d1fae5" iconColor="#10b981" />
          <InfoCard icon={<Award size={24} />} label={t("total_marks")} value={`${totalEarnedPoints} / ${totalPossiblePoints}`} bgColor="#fce7f3" iconColor="#db2777" />
          <InfoCard icon={<Clock size={24} />} label={t("total_time")} value={`${result.totalTime}s`} bgColor="#fef3c7" iconColor="#f59e0b" />
        </div>

        <div style={styles.emailBox}>
          <span style={{ color: "#64748b" }}>{t("email")}: </span>
          <strong style={{ color: "#1e293b" }}>{result.userEmail || "N/A"}</strong>
        </div>

        <div style={styles.chartsRow}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>{t("score_distribution")}</h3>
            <div style={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>{t("section_wise_performance")}</h3>
            <div style={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="section"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b" }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div style={styles.tooltip}>
                            <p style={{ margin: "0 0 8px 0", fontWeight: "700", color: "#1e293b" }}>
                              {data.fullTitle}
                            </p>
                            <p style={{ margin: "0 0 4px 0", color: "#64748b" }}>
                              {t("marks")}: {data.earned} / {data.possible}
                            </p>
                            <p style={{ margin: 0, color: "#64748b" }}>
                              {t("percentage")}: {data.score.toFixed(0)}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" fill="#2563eb" radius={[8,8,0,0]} name={t("score_percent")} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <h3 style={styles.tableTitle}>{t("detailed_question_analysis")}</h3>
          {sectionsData.map((section, idx) => (
            <div key={section.id} style={{ marginBottom: "40px" }}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>{section.title}</span>
                <span style={styles.sectionMarks}>
                  {t("marks")}: {section.earned} / {section.possible}
                </span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>{t("question")}</th>
                      <th style={styles.th}>{t("answer")}</th>
                      <th style={styles.th}>{t("time_seconds")}</th>
                      <th style={styles.th}>{t("marks")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.questions.map((q, qIdx) => {
                      const isDrawing = q.type === "DRAW_IMAGE";
                      const isImageDesc = q.type === "IMAGE_DESCRIPTION";
                      return (
                        <tr key={q.id} style={styles.tr}>
                          <td style={styles.td}>
                            <div style={styles.numberBadge}>{qIdx + 1}</div>
                          </td>
                          <td style={styles.td}>
                            <span style={{ fontWeight: "500", color: "#1e293b" }}>{q.questionText}</span>
                            {isImageDesc && q.mediaUrl && (
                              <div style={{ marginTop: "8px" }}>
                                <img
                                  src={q.mediaUrl}
                                  alt={t("reference_image")}
                                  style={{ maxWidth: "120px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                                />
                              </div>
                            )}
                          </td>
                          <td style={styles.td}>
                            {isDrawing && q.answer && q.answer.startsWith("/uploads/") ? (
                              <img src={q.answer} alt={t("user_drawing")} style={{ maxWidth: "150px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                            ) : (
                              <span style={styles.answerBadge}>{q.answer || t("no_answer")}</span>
                            )}
                          </td>
                          <td style={styles.td}>
                            <span style={{ color: "#64748b" }}>{q.timeSpent} s</span>
                          </td>
                          <td style={styles.td}>
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              max={q.pointsPossible}
                              value={gradedAnswers[q.id] !== undefined ? gradedAnswers[q.id] : q.pointsEarned}
                              onChange={(e) => handlePointsChange(q.id, e.target.value)}
                              style={styles.gradeInput}
                            />
                            <span style={{ marginLeft: "8px", color: "#64748b", fontWeight: "600" }}>
                              / {q.pointsPossible}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <div style={styles.totalFooter}>
            {t("total")}: {totalEarnedPoints} / {totalPossiblePoints}
          </div>
        </div>

        {feedback && (
          <div style={styles.feedbackSection}>
            <h3 style={styles.feedbackTitle}>{t("user_feedback")}</h3>
            <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={24}
                  fill={s <= feedback.rating ? "#fbbf24" : "none"}
                  stroke="#fbbf24"
                  strokeWidth={2}
                />
              ))}
            </div>
            <p style={{ margin: "0 0 12px 0", color: "#1e293b", fontSize: "15px" }}>
              <strong>{t("comment")}:</strong> {feedback.message}
            </p>
            <small style={{ color: "#64748b", fontSize: "13px" }}>
              {t("submitted")}: {new Date(feedback.submittedAt).toLocaleString()}
            </small>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button onClick={() => navigate(-1)} style={styles.backButtonLarge}>
            <ArrowLeft size={20} /> {t("back_to_results")}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper components (unchanged)
const InfoCard = ({ icon, label, value, bgColor, iconColor }) => (
  <div style={styles.infoCard}>
    <div style={{ ...styles.infoIcon, background: bgColor }}>
      {React.cloneElement(icon, { style: { color: iconColor } })}
    </div>
    <div>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  </div>
);

const LoadingSpinner = ({ t }) => (
  <div style={styles.spinnerContainer}>
    <div style={styles.spinnerBox}>
      <div style={styles.spinner}></div>
      <p style={{ color: "#64748b", marginTop: "16px" }}>{t("loading_result_details")}</p>
    </div>
  </div>
);

const NoDataError = ({ navigate, t }) => (
  <div style={styles.errorContainer}>
    <div style={styles.errorBox}>
      <h2 style={{ color: "#1e293b", marginTop: 0 }}>{t("no_result_data")}</h2>
      <button onClick={() => navigate(-1)} style={styles.backButton}>{t("go_back")}</button>
    </div>
  </div>
);

// Styles (unchanged, keep your existing styles object)
const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#e6f0ff",
    padding: "32px"
  },
  innerContainer: {
    maxWidth: "1200px",
    margin: "0 auto"
  },
  errorContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e6f0ff",
    padding: "20px"
  },
  errorBox: {
    background: "white",
    padding: "48px",
    borderRadius: "24px",
    textAlign: "center",
    maxWidth: "500px",
    border: "1px solid #fee2e2",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
  },
  backButton: {
    padding: "14px 28px",
    background: "#1e293b",
    color: "white",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    marginTop: "16px",
    fontWeight: "700",
    boxShadow: "0 4px 12px rgba(30, 41, 59, 0.3)",
    transition: "all 0.3s"
  },
  header: {
    background: "white",
    padding: "32px 36px",
    borderRadius: "24px",
    marginBottom: "32px",
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
  },
  backButtonSmall: {
    padding: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  saveButton: {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s",
    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
    fontSize: "15px"
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 8px 0",
    color: "#1e293b",
    letterSpacing: "-0.5px"
  },
  pageSubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "500"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    marginBottom: "32px"
  },
  infoCard: {
    background: "white",
    padding: "28px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s"
  },
  infoIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  infoLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.3px"
  },
  infoValue: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: "-0.5px"
  },
  emailBox: {
    background: "white",
    padding: "24px 28px",
    borderRadius: "20px",
    marginBottom: "32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    fontSize: "15px"
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "32px",
    marginBottom: "32px"
  },
  chartCard: {
    background: "white",
    padding: "36px",
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    minHeight: "420px"
  },
  chartTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "24px",
    marginTop: 0
  },
  chartWrapper: {
    width: "100%",
    height: "300px",
    minHeight: "300px"
  },
  tooltip: {
    background: "white",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    fontSize: "13px"
  },
  tableContainer: {
    background: "white",
    borderRadius: "24px",
    padding: "36px",
    marginBottom: "32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
  },
  tableTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "28px",
    marginTop: 0,
    paddingBottom: "20px",
    borderBottom: "2px solid #f1f5f9"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    marginTop: "28px",
    paddingBottom: "12px",
    borderBottom: "1px solid #e2e8f0"
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#3b82f6"
  },
  sectionMarks: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b"
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 14px"
  },
  th: {
    padding: "16px 20px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    background: "transparent"
  },
  td: {
    padding: "22px 20px",
    borderTop: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0"
  },
  tr: {
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    transition: "all 0.3s"
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
    boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)"
  },
  answerBadge: {
    padding: "10px 16px",
    background: "#ede9fe",
    borderRadius: "10px",
    fontWeight: "600",
    color: "#6d28d9",
    fontSize: "14px",
    display: "inline-block"
  },
  gradeInput: {
    width: "80px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s"
  },
  totalFooter: {
    textAlign: "right",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "2px solid #e2e8f0",
    fontSize: "20px",
    fontWeight: "800",
    color: "#1e293b"
  },
  backButtonLarge: {
    padding: "16px 36px",
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    color: "white",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 8px 24px rgba(30, 41, 59, 0.3)",
    transition: "all 0.3s"
  },
  spinnerContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e6f0ff"
  },
  spinnerBox: {
    background: "white",
    padding: "48px",
    borderRadius: "24px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #e2e8f0",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 16px"
  },
  feedbackSection: {
    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    borderRadius: "24px",
    padding: "32px",
    marginBottom: "32px",
    border: "1px solid #f59e0b",
    boxShadow: "0 4px 20px rgba(245, 158, 11, 0.15)"
  },
  feedbackTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 0,
    marginBottom: "16px"
  }
};

export default AdminResultDetails;