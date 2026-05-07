import { useState } from "react";
import { X, Menu } from "lucide-react";

export function DashboardLayout({ children, menuItems, title }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#e6f0ff", display: "flex" }}>
      {/* Enhanced Sidebar */}
      <div
        style={{
          width: isOpen ? "300px" : "0",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          borderRight: isOpen ? "1px solid #e2e8f0" : "none",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          boxShadow: isOpen ? "20px 0 60px rgba(0,0,0,0.15)" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 1000,
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          padding: "32px 24px",
          borderBottom: "2px solid #f1f5f9",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          position: "relative"
        }}>
          {/* Decorative Element */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
          }} />

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px"
          }}>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: "26px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
                margin: "0 0 8px 0",
                lineHeight: "1.2"
              }}>
                {title}
              </h2>
              <p style={{
                fontSize: "13px",
                color: "#64748b",
                margin: 0,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Navigation
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                border: "2px solid #e2e8f0",
                cursor: "pointer",
                padding: "10px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                flexShrink: 0,
                width: "40px",
                height: "40px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)";
                e.currentTarget.style.borderColor = "#f87171";
                e.currentTarget.style.transform = "rotate(90deg) scale(1.1)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(220, 38, 38, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "rotate(0deg) scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
              }}
            >
              <X size={20} strokeWidth={2.5} style={{ color: "#64748b" }} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{
          padding: "24px 20px",
          overflowY: "auto",
          maxHeight: "calc(100vh - 140px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f1f5f9"
        }}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                }
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                padding: "18px 20px",
                marginBottom: "12px",
                background: item.variant === "danger"
                  ? "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                color: item.variant === "danger" ? "#dc2626" : "#1e293b",
                border: "2px solid",
                borderColor: item.variant === "danger" ? "#fca5a5" : "#e2e8f0",
                borderRadius: "16px",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "15px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                if (item.variant === "danger") {
                  e.currentTarget.style.background = "linear-gradient(135deg, #fca5a5 0%, #f87171 100%)";
                  e.currentTarget.style.borderColor = "#ef4444";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(220, 38, 38, 0.3)";
                  e.currentTarget.style.color = "white";
                } else {
                  e.currentTarget.style.background = "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)";
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.2)";
                  e.currentTarget.style.color = "#1e40af";
                }
                e.currentTarget.style.transform = "translateX(8px) scale(1.02)";
              }}
              onMouseLeave={(e) => {
                if (item.variant === "danger") {
                  e.currentTarget.style.background = "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)";
                  e.currentTarget.style.borderColor = "#fca5a5";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                  e.currentTarget.style.color = "#dc2626";
                } else {
                  e.currentTarget.style.background = "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                  e.currentTarget.style.color = "#1e293b";
                }
                e.currentTarget.style.transform = "translateX(0) scale(1)";
              }}
            >
              {/* Icon Container */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: item.variant === "danger"
                  ? "rgba(220, 38, 38, 0.15)"
                  : "rgba(59, 130, 246, 0.15)",
                color: item.variant === "danger" ? "#dc2626" : "#3b82f6",
                flexShrink: 0,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: item.variant === "danger"
                  ? "0 4px 12px rgba(220, 38, 38, 0.15)"
                  : "0 4px 12px rgba(59, 130, 246, 0.15)"
              }}>
                {item.icon}
              </div>

              {/* Label */}
              <span style={{
                letterSpacing: "0.3px",
                flex: 1,
                fontWeight: "700"
              }}>
                {item.label}
              </span>

              {/* Arrow Indicator */}
              <div style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: item.variant === "danger" ? "#dc2626" : "#3b82f6",
                opacity: 0.6,
                transition: "all 0.3s"
              }} />
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px 24px",
          background: "linear-gradient(180deg, transparent 0%, rgba(241, 245, 249, 0.8) 100%)",
          borderTop: "1px solid #f1f5f9"
        }}>
          <div style={{
            padding: "12px 16px",
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            borderRadius: "12px",
            border: "1px solid #bfdbfe",
            textAlign: "center"
          }}>
            <p style={{
              margin: 0,
              fontSize: "12px",
              color: "#1e40af",
              fontWeight: "600",
              letterSpacing: "0.3px"
            }}>
              {menuItems.length} Menu Items
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          marginLeft: isOpen ? "300px" : "0",
          transition: "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          width: "100%",
        }}
      >
        {/* Enhanced Header */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 999,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            gap: "24px"
          }}
        >
          {/* Professional Hamburger Menu - Always 3 Lines */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: isOpen
                ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
                : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              border: isOpen ? "2px solid #3b82f6" : "2px solid #e2e8f0",
              borderRadius: "14px",
              padding: "12px 14px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isOpen
                ? "0 6px 20px rgba(59, 130, 246, 0.2)"
                : "0 2px 8px rgba(0,0,0,0.04)",
              width: "50px",
              height: "50px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)";
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isOpen
                ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
                : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)";
              e.currentTarget.style.borderColor = isOpen ? "#3b82f6" : "#e2e8f0";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = isOpen
                ? "0 6px 20px rgba(59, 130, 246, 0.2)"
                : "0 2px 8px rgba(0,0,0,0.04)";
            }}
          >
            {/* Always 3 Lines - No Animation to X */}
            <span style={{
              width: "24px",
              height: "3px",
              background: isOpen
                ? "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)"
                : "linear-gradient(90deg, #475569 0%, #64748b 100%)",
              borderRadius: "3px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isOpen
                ? "0 2px 8px rgba(59, 130, 246, 0.3)"
                : "0 1px 3px rgba(0,0,0,0.1)"
            }} />
            <span style={{
              width: "24px",
              height: "3px",
              background: isOpen
                ? "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)"
                : "linear-gradient(90deg, #475569 0%, #64748b 100%)",
              borderRadius: "3px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isOpen
                ? "0 2px 8px rgba(59, 130, 246, 0.3)"
                : "0 1px 3px rgba(0,0,0,0.1)"
            }} />
            <span style={{
              width: "24px",
              height: "3px",
              background: isOpen
                ? "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)"
                : "linear-gradient(90deg, #475569 0%, #64748b 100%)",
              borderRadius: "3px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isOpen
                ? "0 2px 8px rgba(59, 130, 246, 0.3)"
                : "0 1px 3px rgba(0,0,0,0.1)"
            }} />
          </button>

          {/* Title without Badge */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: "26px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              letterSpacing: "-0.5px"
            }}>
              {title}
            </h1>
          </div>

          {/* Status Indicator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
            borderRadius: "12px",
            border: "1px solid #86efac"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              background: "#10b981",
              borderRadius: "50%",
              boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            }} />
            <span style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#065f46",
              letterSpacing: "0.3px"
            }}>
              Active
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: "32px" }}>{children}</div>
      </div>

      {/* Enhanced Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            animation: "fadeIn 0.3s ease-out",
          }}
        />
      )}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          /* Custom Scrollbar */
          div::-webkit-scrollbar {
            width: 8px;
          }

          div::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }

          div::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
            border-radius: 10px;
            border: 2px solid #f1f5f9;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
          }

          @media (max-width: 768px) {
            h1 {
              font-size: 20px !important;
            }
          }
        `}
      </style>
    </div>
  );
}