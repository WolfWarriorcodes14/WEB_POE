import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, FileText, Users, Trash2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

function TestList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getQuestionCount = (test) => {
    if (test.questions && test.questions.length) return test.questions.length;
    if (test.sections) {
      return test.sections.reduce((sum, section) => sum + (section.questions?.length || 0), 0);
    }
    return 0;
  };

  const loadTests = () => {
    setLoading(true);
    axios.get("https://web-poe-u1c9.onrender.com/api/tests")
      .then(res => setTests(Array.isArray(res.data) ? res.data : []))
      .catch(() => alert(t("error_loading_tests")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTests();
  }, [t]);

  const handleDelete = async (testId, testTitle) => {
    if (window.confirm(t("confirm_delete_test", { title: testTitle }))) {
      try {
        await axios.delete(`https://web-poe-u1c9.onrender.com/api/admin/tests/${testId}`);
        alert(t("test_deleted_successfully"));
        loadTests();
      } catch (err) {
        console.error(err);
        alert(t("failed_delete_test"));
      }
    }
  };

  if (loading) {
    return <LoadingSpinner t={t} />;
  }

  return (
    <div style={styles.pageContainer}>
      {/* Language Switcher - fixed at top right */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "8px 12px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
        <LanguageSwitcher />
      </div>

      <div style={styles.innerContainer}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate("/admin/dashboard")} style={styles.backButton}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={styles.pageTitle}>{t("all_tests")}</h2>
            <p style={styles.pageSubtitle}>{tests.length} {tests.length !== 1 ? t("tests_created_plural") : t("tests_created_singular")}</p>
          </div>
          <div style={styles.countBadge}>
            <FileText size={20} />
            <span>{tests.length} {t("total")}</span>
          </div>
        </div>

        {tests.length === 0 ? (
          <EmptyState navigate={navigate} t={t} />
        ) : (
          <div style={styles.grid}>
            {tests.map(test => (
              <div key={test.id} style={styles.card}>
                <div style={styles.iconBox}>
                  <FileText size={28} style={{ color: "#3b82f6" }} />
                </div>
                <h3 style={styles.cardTitle}>{test.title}</h3>
                <div style={styles.cardMeta}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <FileText size={16} />
                    <span>{getQuestionCount(test)} {t("questions")}</span>
                  </div>
                </div>
                <div style={styles.buttonRow}>
                  <button onClick={() => navigate(`/admin/results/${test.id}`)} style={styles.viewButton}>
                    <Eye size={18} /> {t("view_attempts")}
                  </button>
                  <button onClick={() => handleDelete(test.id, test.title)} style={styles.deleteButton}>
                    <Trash2 size={18} /> {t("delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const LoadingSpinner = ({ t }) => (
  <div style={styles.spinnerContainer}>
    <div style={styles.spinnerBox}>
      <div style={styles.spinner}></div>
      <p>{t("loading_tests")}</p>
    </div>
  </div>
);

const EmptyState = ({ navigate, t }) => (
  <div style={styles.emptyState}>
    <FileText size={64} style={{ color: "#cbd5e1", marginBottom: "20px" }} />
    <h3>{t("no_tests_created")}</h3>
    <p>{t("create_first_test")}</p>
    <button onClick={() => navigate("/admin/create-test")} style={styles.createButton}>
      {t("create_test")}
    </button>
  </div>
);

const styles = {
  pageContainer: { minHeight: "100vh", background: "#e6f0ff", padding: "28px" },
  innerContainer: { maxWidth: "1200px", margin: "0 auto" },
  header: { background: "white", padding: "28px 32px", borderRadius: "20px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  backButton: { padding: "12px", background: "#f1f5f9", border: "none", borderRadius: "12px", cursor: "pointer" },
  pageTitle: { fontSize: "28px", fontWeight: "800", background: "linear-gradient(135deg, #1e293b, #475569)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 6px 0" },
  pageSubtitle: { margin: 0, color: "#64748b", fontSize: "14px" },
  countBadge: { padding: "12px 20px", background: "#dbeafe", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid #93c5fd" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" },
  card: { background: "white", borderRadius: "20px", padding: "28px", border: "1px solid #e2e8f0", transition: "all 0.3s", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" },
  iconBox: { width: "56px", height: "56px", background: "#dbeafe", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", boxShadow: "0 8px 24px rgba(59,130,246,0.3)" },
  cardTitle: { fontSize: "20px", fontWeight: "700", margin: "0 0 12px 0" },
  cardMeta: { marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #f1f5f9" },
  buttonRow: { display: "flex", gap: "12px" },
  viewButton: { flex: 1, padding: "12px", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  deleteButton: { flex: 1, padding: "12px", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  emptyState: { background: "white", padding: "64px", borderRadius: "20px", textAlign: "center", border: "2px dashed #cbd5e1" },
  createButton: { padding: "14px 28px", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600", marginTop: "16px" },
  spinnerContainer: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#e6f0ff" },
  spinnerBox: { background: "white", padding: "48px", borderRadius: "20px", textAlign: "center" },
  spinner: { width: "48px", height: "48px", border: "4px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }
};

export default TestList;