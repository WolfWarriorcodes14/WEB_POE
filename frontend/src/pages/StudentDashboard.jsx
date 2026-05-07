import React from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../components/DashboardLayout";
import { LayoutDashboard, BookOpen, LogOut, FileText, TrendingUp, Award } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

function StudentDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [stats, setStats] = useState({
    testsAvailable: 0,
    completedTests: 0,
    averageScore: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const testsRes = await axios.get("https://web-poe-u1c9.onrender.com/api/tests");
        const tests = testsRes.data || [];

        const resultsRes = await axios.get(
          `https://web-poe-u1c9.onrender.com/api/results/student/${user.id}`
        );
        const results = resultsRes.data || [];

        let avg = 0;
        if (results.length > 0) {
          const total = results.reduce(
            (sum, r) => sum + (r.memoryScore || 0),
            0
          );
          avg = total / results.length;
        }

        setStats({
          testsAvailable: tests.length,
          completedTests: results.length,
          averageScore: avg.toFixed(1),
        });

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user) return null;

  const menuItems = [
    {
      label: t("dashboard"),
      icon: <LayoutDashboard size={18} />,
      onClick: () => {},
    },
    {
      label: t("available_tests"),
      icon: <BookOpen size={18} />,
      onClick: () => navigate("/student/tests"),
    },
    {
      label: t("logout"),
      icon: <LogOut size={18} />,
      onClick: () => {
        localStorage.removeItem("user");
        navigate("/");
      },
      variant: "danger"
    },
  ];

  const chartData = [
    { name: t("available"), value: stats.testsAvailable },
    { name: t("completed"), value: stats.completedTests },
    { name: t("avg_score"), value: parseFloat(stats.averageScore) },
  ];

  return (
    <>
      {/* Language Switcher - fixed at top right */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "8px 12px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
        <LanguageSwitcher />
      </div>

      <DashboardLayout menuItems={menuItems} title={t("participant_portal")}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

          {/* Enhanced Welcome Header */}
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            padding: "40px",
            borderRadius: "24px",
            marginBottom: "36px",
            border: "2px solid #e2e8f0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              borderRadius: "50%",
              opacity: "0.4"
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{
                fontSize: "36px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: "0 0 12px 0",
                letterSpacing: "-0.6px"
              }}>
                {t("welcome_back")}, {user.fullName || user.email}!
              </h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: "16px", fontWeight: "500" }}>
                {t("ready_to_take_test")}
              </p>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "28px",
            marginBottom: "36px"
          }}>
            <StatCard
              title={t("tests_available")}
              value={stats.testsAvailable}
              icon={<FileText size={36} />}
              color="#3b82f6"
              bgGradient="linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
            />
            <StatCard
              title={t("completed_tests")}
              value={stats.completedTests}
              icon={<Award size={36} />}
              color="#10b981"
              bgGradient="linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
            />
            <StatCard
              title={t("average_score")}
              value={`${stats.averageScore}%`}
              icon={<TrendingUp size={36} />}
              color="#f59e0b"
              bgGradient="linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
            />
          </div>

          {/* Enhanced Performance Overview Chart */}
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "24px",
            border: "2px solid #e2e8f0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            marginBottom: "36px"
          }}>
            <div style={{
              marginBottom: "28px",
              paddingBottom: "24px",
              borderBottom: "3px solid #f1f5f9"
            }}>
              <h3 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}>
                <TrendingUp size={26} style={{ color: "#3b82f6" }} />
                {t("performance_overview")}
              </h3>
            </div>

            <div style={{ height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 15, fontWeight: 600 }}
                    stroke="#64748b"
                  />
                  <YAxis
                    tick={{ fontSize: 15, fontWeight: 600 }}
                    stroke="#64748b"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "2px solid #e2e8f0",
                      borderRadius: "14px",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      padding: "14px 18px"
                    }}
                    cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                    formatter={(value) => [`${value} ${t(t(value) === "Average Score" ? "" : "")}`]}
                  />
                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[14, 14, 0, 0]}
                    maxBarSize={120}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "24px",
            border: "2px solid #e2e8f0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1e293b",
              margin: "0 0 28px 0"
            }}>
              {t("quick_actions")}
            </h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px"
            }}>
              <ActionCard
                icon={<BookOpen size={26} />}
                title={t("browse_tests")}
                description={t("browse_tests_desc")}
                onClick={() => navigate("/student/tests")}
                color="#3b82f6"
                bgColor="#dbeafe"
              />
              <ActionCard
                icon={<Award size={26} />}
                title={t("view_results")}
                description={t("view_results_desc")}
                onClick={() => navigate("/student/tests")}
                color="#10b981"
                bgColor="#d1fae5"
              />
            </div>
          </div>

        </div>

        <style>
          {`
            @media (max-width: 768px) {
              div[style*="gridTemplateColumns"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>
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
        border: "2px solid #e2e8f0",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 24px 56px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{
        position: "absolute",
        top: "-50px",
        right: "-50px",
        width: "140px",
        height: "140px",
        background: bgGradient,
        borderRadius: "50%",
        opacity: "0.35"
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
            fontSize: "14px",
            fontWeight: "700",
            color: "#64748b",
            margin: "0 0 14px 0",
            textTransform: "uppercase",
            letterSpacing: "0.6px"
          }}>
            {title}
          </h4>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "800",
            color: "#1e293b",
            margin: 0,
            letterSpacing: "-1.2px"
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
          boxShadow: `0 10px 28px ${color}40`
        }}>
          {React.cloneElement(icon, { style: { color: color } })}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, description, onClick, color, bgColor }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "28px",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        borderRadius: "20px",
        border: "2px solid #e2e8f0",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.15)";
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div style={{
        width: "56px",
        height: "56px",
        background: bgColor,
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "18px"
      }}>
        {React.cloneElement(icon, { style: { color: color } })}
      </div>
      <h4 style={{
        fontSize: "18px",
        fontWeight: "700",
        color: "#1e293b",
        margin: "0 0 8px 0"
      }}>
        {title}
      </h4>
      <p style={{
        fontSize: "15px",
        color: "#64748b",
        margin: 0,
        fontWeight: "500"
      }}>
        {description}
      </p>
    </div>
  );
}

export default StudentDashboard;