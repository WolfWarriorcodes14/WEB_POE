import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { Award, Clock, TrendingUp, ArrowLeft, Trophy, Star } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

function ResultPage() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [result, setResult] = useState(state?.result || null);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Feedback states
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const attemptId = state?.attemptId;

  const user = JSON.parse(localStorage.getItem("user"));

  // Main data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        let resultData = result;
        if (!resultData && user && id) {
          const resultRes = await axios.get("https://web-poe-u1c9.onrender.com/api/results/get", {
            params: { userId: user.id, testId: id },
          });
          resultData = resultRes.data;
          setResult(resultData);
        }
        if (!resultData) throw new Error("No result data found");
        const testRes = await axios.get(`https://web-poe-u1c9.onrender.com/api/tests/${resultData.testId}`);
        setTest(testRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(t("failed_to_load_results"));
        setLoading(false);
      }
    };
    loadData();
  }, [id, user, result, t]);

  // Check for existing feedback (ignore 404)
  useEffect(() => {
    if (attemptId) {
      axios
        .get(`https://web-poe-u1c9.onrender.com/api/feedback/attempt/${attemptId}`)
        .then((res) => setExistingFeedback(res.data))
        .catch((err) => {
          if (err.response?.status !== 404) {
            console.error("Error fetching feedback:", err);
          }
        });
    }
  }, [attemptId]);

  const handleFeedbackSubmit = async () => {
    if (feedbackRating === 0) {
      alert(t("please_select_rating"));
      return;
    }
    if (!feedbackMessage.trim()) {
      alert(t("please_enter_feedback"));
      return;
    }
    try {
      await axios.post("https://web-poe-u1c9.onrender.com/api/feedback/submit", {
        userId: user.id,
        attemptId: attemptId,
        testId: Number(id),
        userName: user.fullName || user.email,
        userEmail: user.email,
        testTitle: test?.title || "Test",
        rating: feedbackRating,
        message: feedbackMessage,
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(t("failed_submit_feedback"));
    }
  };

  if (loading) return <LoadingSpinner t={t} />;
  if (error) return <ErrorDisplay message={error} navigate={navigate} t={t} />;
  if (!result || !test) return <ErrorDisplay message={t("no_result_data")} navigate={navigate} t={t} />;

  const answers = JSON.parse(result.answersJson || "{}");
  const score = result.memoryScore || 0;

  // Build sectionsData
  let sectionsData = [];
  if (test.sections) {
    sectionsData = test.sections.map(section => {
      let sectionEarned = 0;
      let sectionPossible = 0;
      const sectionQuestions = section.questions.map(q => {
        const answerData = answers[q.id.toString()];
        const pointsEarned = answerData?.pointsEarned || 0;
        const pointsPossible = q.points || 1;
        const timeSpent = answerData?.time || 0;
        sectionEarned += pointsEarned;
        sectionPossible += pointsPossible;
        return {
          ...q,
          answer: answerData?.answer || "(no answer)",
          pointsEarned,
          pointsPossible,
          timeSpent,
        };
      });
      return {
        id: section.id,
        title: section.title,
        earned: sectionEarned,
        possible: sectionPossible,
        questions: sectionQuestions,
      };
    });
  } else if (test.questions) {
    let flatQuestions = test.questions.map(q => {
      const answerData = answers[q.id.toString()];
      const pointsEarned = answerData?.pointsEarned || 0;
      const pointsPossible = q.points || 1;
      const timeSpent = answerData?.time || 0;
      return {
        ...q,
        answer: answerData?.answer || "(no answer)",
        pointsEarned,
        pointsPossible,
        timeSpent,
      };
    });
    sectionsData = [{
      id: 1,
      title: t("questions"),
      earned: flatQuestions.reduce((sum, q) => sum + q.pointsEarned, 0),
      possible: flatQuestions.reduce((sum, q) => sum + q.pointsPossible, 0),
      questions: flatQuestions,
    }];
  }

  const totalEarnedPoints = sectionsData.reduce((sum, s) => sum + s.earned, 0);
  const totalPossiblePoints = sectionsData.reduce((sum, s) => sum + s.possible, 0);
  const isGraded = totalEarnedPoints > 0 || score > 0;

  if (!isGraded) {
    return (
      <div style={styles.pageContainer}>
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "8px 12px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
          <LanguageSwitcher />
        </div>
        <div style={styles.innerContainer}>
          <div style={styles.celebrationHeader}>
            <div style={styles.iconCircle}>
              <Trophy size={40} style={{ color: "white" }} />
            </div>
            <h1 style={styles.title}>{t("test_submitted_successfully")}</h1>
            <p style={styles.subtitle}>{t("test_being_evaluated")}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => navigate("/dashboard")} style={styles.backButton}>
              <ArrowLeft size={20} /> {t("back_to_dashboard")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const remaining = 100 - score;
  const pieData = [
    { name: t("score"), value: score },
    { name: t("remaining"), value: remaining },
  ];
  const COLORS = ["#10b981", "#e5e7eb"];
  const barData = sectionsData.map(s => ({
    section: s.title.substring(0, 20) + (s.title.length > 20 ? "..." : ""),
    fullTitle: s.title,
    score: (s.earned / s.possible) * 100,
    earned: s.earned,
    possible: s.possible,
  }));

  return (
    <div style={styles.pageContainer}>
      {/* Language Switcher - fixed at top right */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "8px 12px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
        <LanguageSwitcher />
      </div>

      <div style={styles.innerContainer}>
        {/* Celebration Header */}
        <div style={styles.celebrationHeader}>
          <div style={styles.iconCircle}>
            <Trophy size={40} style={{ color: "white" }} />
          </div>
          <h1 style={styles.title}>{t("test_completed_successfully")}</h1>
          <p style={styles.subtitle}>{t("great_job_analysis")}</p>
        </div>

        {/* Score Cards */}
        <div style={styles.scoreCards}>
          <ScoreCard icon={<Award size={28} />} label={t("your_score")} value={`${score.toFixed(1)}%`} bgColor="#d1fae5" iconColor="#10b981" />
          <ScoreCard icon={<Award size={28} />} label={t("total_marks")} value={`${totalEarnedPoints} / ${totalPossiblePoints}`} bgColor="#dbeafe" iconColor="#3b82f6" />
          <ScoreCard icon={<Clock size={28} />} label={t("time_taken")} value={`${result.totalTime}s`} bgColor="#fef3c7" iconColor="#f59e0b" />
        </div>

        {/* Charts */}
        <div style={styles.chartsRow}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>{t("score_distribution")}</h3>
            <div style={{ height: 300, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%" aspect={3}>
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
          {barData.length > 0 && (
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>{t("section_wise_performance")}</h3>
              <div style={{ height: 300, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%" aspect={3}>
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
                              <p style={{ margin: "0 0 8px 0", fontWeight: "700", color: "#1e293b" }}>{data.fullTitle}</p>
                              <p style={{ margin: "0 0 4px 0", color: "#64748b" }}>{t("marks")}: {data.earned} / {data.possible}</p>
                              <p style={{ margin: 0, color: "#64748b" }}>{t("percentage")}: {data.score.toFixed(0)}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="score" fill="#3b82f6" radius={[8,8,0,0]} name={t("score_percent")} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Question Details Table */}
        <div style={styles.tableContainer}>
          <h3 style={styles.tableTitle}>{t("question_wise_details")}</h3>
          {sectionsData.map((section, idx) => (
            <div key={section.id} style={{ marginBottom: "32px" }}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>{section.title}</span>
                <span style={styles.sectionMarks}>{t("marks")}: {section.earned} / {section.possible}</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>{t("question")}</th>
                      <th style={styles.th}>{t("your_answer")}</th>
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
                              <img src={q.answer} alt={t("user_drawing")} style={{ maxWidth: "150px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                            ) : (
                              <span style={styles.answerBadge}>{q.answer || t("no_answer")}</span>
                            )}
                          </td>
                          <td style={styles.td}>
                            <span style={{ color: "#64748b" }}>{q.timeSpent} s</span>
                          </td>
                          <td style={styles.td}>
                            <span style={{ fontWeight: "700", color: q.pointsEarned === q.pointsPossible ? "#10b981" : "#f59e0b" }}>
                              {q.pointsEarned} / {q.pointsPossible}
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
          <div style={styles.totalFooter}>{t("total")}: {totalEarnedPoints} / {totalPossiblePoints}</div>
        </div>

        {/* Feedback Section (at the bottom) */}
        {!existingFeedback && !feedbackSubmitted && attemptId && (
          <div style={styles.feedbackSection}>
            <h3 style={styles.feedbackTitle}>{t("share_feedback")}</h3>
            <p style={styles.feedbackSubtitle}>{t("feedback_question")}</p>
            <div style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  fill={feedbackRating >= star ? "#fbbf24" : "none"}
                  stroke="#fbbf24"
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                  onClick={() => setFeedbackRating(star)}
                />
              ))}
            </div>
            <textarea
              rows="4"
              placeholder={t("feedback_placeholder")}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              style={styles.feedbackTextarea}
            />
            <button onClick={handleFeedbackSubmit} style={styles.submitFeedbackBtn}>
              {t("submit_feedback")}
            </button>
          </div>
        )}
        {feedbackSubmitted && (
          <div style={styles.thankYou}>
            <p>{t("thank_you_feedback")}</p>
          </div>
        )}
        {existingFeedback && (
          <div style={styles.existingFeedback}>
            <p>{t("already_feedback")}</p>
            <p>{t("rating")}: {"★".repeat(existingFeedback.rating)}{"☆".repeat(5 - existingFeedback.rating)}</p>
            <p>{t("comment")}: "{existingFeedback.message}"</p>
          </div>
        )}

        {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <button onClick={() => navigate("/dashboard")} style={styles.backButton}>
            <ArrowLeft size={20} /> {t("back_to_dashboard")}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper components (with translation support)
const ScoreCard = ({ icon, label, value, bgColor, iconColor }) => (
  <div style={styles.scoreCard}>
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: "56px", height: "56px", background: bgColor, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {React.cloneElement(icon, { style: { color: iconColor } })}
      </div>
      <div>
        <div style={styles.infoLabel}>{label}</div>
        <div style={styles.infoValue}>{value}</div>
      </div>
    </div>
  </div>
);

const LoadingSpinner = ({ t }) => (
  <div style={styles.spinnerContainer}>
    <div style={styles.spinnerBox}>
      <div style={styles.spinner}></div>
      <p style={{ color: "#64748b", marginTop: "16px" }}>{t("loading_result")}</p>
    </div>
  </div>
);

const ErrorDisplay = ({ message, navigate, t }) => (
  <div style={styles.spinnerContainer}>
    <div style={styles.spinnerBox}>
      <p style={{ color: "red", marginBottom: "16px" }}>{message}</p>
      <button onClick={() => navigate("/dashboard")} style={styles.backButton}>{t("go_to_dashboard")}</button>
    </div>
  </div>
);

// Styles (keep original, no changes needed)
const styles = {
  pageContainer: { minHeight: "100vh", background: "#e6f0ff", padding: "28px" },
  innerContainer: { maxWidth: "1200px", margin: "0 auto" },
  celebrationHeader: { background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", padding: "40px", borderRadius: "24px", marginBottom: "28px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center", position: "relative", overflow: "hidden" },
  iconCircle: { width: "80px", height: "80px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 12px 32px rgba(16, 185, 129, 0.3)" },
  title: { fontSize: "36px", fontWeight: "800", background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: "0 0 12px 0", letterSpacing: "-0.5px" },
  subtitle: { fontSize: "16px", color: "#64748b", margin: 0, fontWeight: "500" },
  scoreCards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "28px" },
  scoreCard: { background: "white", padding: "28px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "all 0.3s" },
  chartsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "28px", marginBottom: "28px" },
  chartCard: { background: "white", padding: "32px", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: "100%" },
  tooltip: { background: "white", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  tableContainer: { background: "white", borderRadius: "20px", padding: "32px", marginBottom: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  tableTitle: { fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "24px", paddingBottom: "16px", borderBottom: "2px solid #f1f5f9" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", marginTop: "24px", paddingBottom: "8px", borderBottom: "1px solid #e2e8f0" },
  sectionTitle: { fontSize: "18px", fontWeight: "700", color: "#3b82f6" },
  sectionMarks: { fontSize: "14px", fontWeight: "600", color: "#64748b" },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" },
  th: { padding: "16px 20px", textAlign: "left", fontSize: "13px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", background: "transparent" },
  td: { padding: "20px", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" },
  tr: { background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", transition: "all 0.3s" },
  numberBadge: { width: "32px", height: "32px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "13px", fontWeight: "700", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" },
  answerBadge: { padding: "8px 14px", background: "#ede9fe", borderRadius: "8px", fontWeight: "600", color: "#6d28d9", fontSize: "14px" },
  totalFooter: { textAlign: "right", marginTop: "16px", paddingTop: "16px", borderTop: "2px solid #e2e8f0", fontSize: "18px", fontWeight: "800" },
  backButton: { padding: "16px 40px", background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", color: "white", border: "none", borderRadius: "14px", cursor: "pointer", fontSize: "16px", fontWeight: "700", transition: "all 0.3s", boxShadow: "0 8px 24px rgba(30, 41, 59, 0.3)", display: "inline-flex", alignItems: "center", gap: "10px" },
  spinnerContainer: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#e6f0ff" },
  spinnerBox: { background: "white", padding: "48px", borderRadius: "20px", textAlign: "center" },
  spinner: { width: "48px", height: "48px", border: "4px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" },
  feedbackSection: { background: "white", padding: "24px", borderRadius: "20px", marginBottom: "28px", border: "1px solid #e2e8f0" },
  stars: { display: "flex", gap: "8px", marginBottom: "16px" },
  feedbackTextarea: { width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "16px", fontSize: "14px", fontFamily: "inherit" },
  submitFeedbackBtn: { background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", padding: "12px 24px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  thankYou: { background: "#d1fae5", padding: "16px", borderRadius: "12px", textAlign: "center", marginBottom: "28px" },
  existingFeedback: { background: "#fef3c7", padding: "16px", borderRadius: "12px", marginBottom: "28px" },
  feedbackTitle: { fontSize: "22px", fontWeight: "700", color: "#1e293b", marginTop: 0, marginBottom: "8px" },
  feedbackSubtitle: { fontSize: "15px", color: "#64748b", marginTop: 0, marginBottom: "20px" },
  infoLabel: { fontSize: "13px", fontWeight: "600", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.3px" },
  infoValue: { fontSize: "28px", fontWeight: "800", color: "#1e293b" },
};

export default ResultPage;