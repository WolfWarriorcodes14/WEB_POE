import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { FileText, LogOut, LayoutDashboard, Users, CheckCircle, FileQuestion } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();  // ← get translation function

  const [stats, setStats] = useState({
    totalTests: 0,
    activeStudents: 0,
    completedTests: 0,
  });

  const [students, setStudents] = useState([]);

  const admin = localStorage.getItem("admin");

  useEffect(() => {
    if (!admin) {
      navigate("/admin");
      return;
    }

    const fetchData = async () => {
      try {
        const dashboardRes = await axios.get("http://localhost:8080/api/admin/dashboard");
        const studentsRes = await axios.get("http://localhost:8080/api/results/admin/active-students");

        setStats({
          totalTests: dashboardRes.data.tests,
          activeStudents: studentsRes.data.length,
          completedTests: dashboardRes.data.attempts,
        });
        setStudents(studentsRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [admin, navigate]);

  const menuItems = [
    { label: t("dashboard"), icon: <LayoutDashboard size={20} /> },
    { label: t("create_test"), icon: <FileText size={20} />, onClick: () => navigate("/admin/create-test") },
    { label: t("view_all_tests"), icon: <FileText size={20} />, onClick: () => navigate("/admin/tests") },
    { label: t("logout"), icon: <LogOut size={20} />, onClick: () => { localStorage.removeItem("admin"); navigate("/admin"); }, variant: "danger" },
  ];

  return (
    <>
      {/* Language Switcher - fixed at top right */}
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        background: "white",
        padding: "8px 12px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0"
      }}>
        <LanguageSwitcher />
      </div>

      <DashboardLayout menuItems={menuItems} title={t("admin_dashboard")}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

          {/* Welcome Header */}
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            padding: "40px",
            borderRadius: "24px",
            marginBottom: "32px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)"
          }}>
            <h2 style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 8px 0",
              letterSpacing: "-0.025em"
            }}>
              {t("admin_dashboard")}
            </h2>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "16px", fontWeight: "400" }}>
              {t("manage_tests_monitor")}
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "32px"
          }}>
            <StatCard
              title={t("total_tests")}
              value={stats.totalTests}
              icon={<FileQuestion size={28} />}
              color="#2563eb"
              bgGradient="linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
            />
            <StatCard
              title={t("active_students")}
              value={stats.activeStudents}
              icon={<Users size={28} />}
              color="#7c3aed"
              bgGradient="linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)"
            />
            <StatCard
              title={t("completed_tests")}
              value={stats.completedTests}
              icon={<CheckCircle size={28} />}
              color="#059669"
              bgGradient="linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
            />
          </div>

          {/* Active Students Section */}
          <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "40px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "28px",
              paddingBottom: "24px",
              borderBottom: "1px solid #e5e7eb"
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Users size={28} style={{ color: "#7c3aed" }} />
              </div>
              <div>
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: 0
                }}>
                  {t("active_students")}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                  {students.length} {t("students_active")}
                </p>
              </div>
            </div>

            {students.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "64px 24px",
                background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                borderRadius: "20px",
                border: "2px dashed #d1d5db"
              }}>
                <Users size={56} style={{ color: "#d1d5db", marginBottom: "16px" }} />
                <p style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  fontWeight: "500",
                  margin: 0
                }}>
                  {t("no_active_students")}
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px"
              }}>
                {students.map((s, index) => (
                  <div
                    key={s.id}
                    style={{
                      padding: "24px",
                      background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                      borderRadius: "16px",
                      border: "1px solid #e5e7eb",
                      transition: "all 0.2s ease",
                      cursor: "default",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.1)";
                      e.currentTarget.style.borderColor = "#2563eb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      width: "36px",
                      height: "36px",
                      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "600",
                      boxShadow: "0 4px 6px -1px rgba(37,99,235,0.3)"
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "600", color: "#111827", marginBottom: "8px", paddingRight: "40px" }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "400" }}>
                      {s.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

function StatCard({ title, value, icon, color, bgGradient }) {
  return (
    <div
      style={{
        background: "white",
        padding: "32px",
        borderRadius: "24px",
        border: "1px solid #e5e7eb",
        transition: "all 0.2s ease",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0,0,0,0.05)";
      }}
    >
      <div style={{
        position: "absolute",
        top: "-40px",
        right: "-40px",
        width: "120px",
        height: "120px",
        background: bgGradient,
        borderRadius: "50%",
        opacity: "0.4"
      }} />

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        position: "relative",
        zIndex: 1
      }}>
        <div>
          <h4 style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#6b7280",
            margin: "0 0 16px 0",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            {title}
          </h4>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.025em"
          }}>
            {value}
          </h2>
        </div>

        <div style={{
          width: "64px",
          height: "64px",
          background: bgGradient,
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 16px -4px ${color}40`
        }}>
          {React.cloneElement(icon, { style: { color: color } })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;