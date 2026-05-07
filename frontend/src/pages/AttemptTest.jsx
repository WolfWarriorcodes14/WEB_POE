import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Clock, AlertCircle, Trash2, Save } from "lucide-react";

function AttemptTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [sections, setSections] = useState([]);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentTimer, setCurrentTimer] = useState(0);
  const [checking, setChecking] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Drawing canvas refs (only used for DRAW_IMAGE)
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasCtx, setCanvasCtx] = useState(null);

  const questionStartRef = useRef(null);
  const questionTimesRef = useRef({});
  const timerIntervalRef = useRef(null);
  const answersRef = useRef(answers);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Check if already attempted
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:8080/api/results/exists", {
        params: { userId: user.id, testId: id },
      })
      .then((res) => {
        if (res.data === true) navigate(`/result/${id}`);
      })
      .finally(() => setChecking(false));
  }, [id, user, navigate]);

  // Start attempt and fetch test
  useEffect(() => {
    if (checking) return;
    axios
      .post(`http://localhost:8080/api/attempts/start?userId=${user.id}&testId=${id}`)
      .then((res) => setAttemptId(res.data.id))
      .catch((err) => console.error("Failed to start attempt", err));

    axios
      .get(`http://localhost:8080/api/tests/${id}`)
      .then((res) => {
        setTest(res.data);
        // Build flat list of sections and questions for navigation
        if (res.data.sections) {
          setSections(res.data.sections);
        } else {
          // Fallback if no sections (old format)
          setSections([{ id: 1, title: "Questions", questions: res.data.questions || [] }]);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading test");
        navigate("/dashboard");
      });
  }, [checking, id, navigate, user.id]);

  // Timer: start for each question
  useEffect(() => {
    if (!sections.length) return;
    const currentSection = sections[currentSectionIdx];
    const currentQuestion = currentSection?.questions[currentQIdx];
    if (!currentQuestion) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    questionStartRef.current = Date.now();
    setCurrentTimer(0);
    timerIntervalRef.current = setInterval(() => {
      if (questionStartRef.current) {
        const elapsed = Math.floor((Date.now() - questionStartRef.current) / 1000);
        setCurrentTimer(elapsed);
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [sections, currentSectionIdx, currentQIdx]);

  // Initialize canvas when DRAW_IMAGE question appears
  useEffect(() => {
    if (!sections.length) return;
    const currentSection = sections[currentSectionIdx];
    const currentQuestion = currentSection?.questions[currentQIdx];
    if (currentQuestion && currentQuestion.type === "DRAW_IMAGE" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 500;
      canvas.height = 400;
      canvas.style.border = "2px solid #cbd5e1";
      canvas.style.borderRadius = "12px";
      canvas.style.backgroundColor = "white";
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setCanvasCtx(ctx);
      // Load existing drawing if any
      const savedDrawing = answers[currentQuestion.id]?.answer;
      if (savedDrawing && savedDrawing.startsWith("/uploads/")) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = savedDrawing;
      }
    }
  }, [sections, currentSectionIdx, currentQIdx, answers]);

  const recordCurrentQuestionTime = () => {
    const currentSection = sections[currentSectionIdx];
    const currentQ = currentSection?.questions[currentQIdx];
    if (!currentQ) return;
    if (questionStartRef.current) {
      const timeSpent = Math.floor((Date.now() - questionStartRef.current) / 1000);
      console.log(`Time for Q${currentQ.id}: ${timeSpent}s`);
      questionTimesRef.current[currentQ.id] = timeSpent;
    }
  };

  // Navigation helpers
  const getTotalQuestions = () => {
    return sections.reduce((sum, sec) => sum + sec.questions.length, 0);
  };

  const getCurrentGlobalIndex = () => {
    let globalIdx = 0;
    for (let i = 0; i < currentSectionIdx; i++) {
      globalIdx += sections[i].questions.length;
    }
    return globalIdx + currentQIdx;
  };

  const handleNext = () => {
    recordCurrentQuestionTime();
    const currentSection = sections[currentSectionIdx];
    if (currentQIdx + 1 < currentSection.questions.length) {
      setCurrentQIdx(prev => prev + 1);
    } else if (currentSectionIdx + 1 < sections.length) {
      setCurrentSectionIdx(prev => prev + 1);
      setCurrentQIdx(0);
    }
  };

  const handleJumpToQuestion = (sectionIdx, qIdx) => {
    if (sectionIdx === currentSectionIdx && qIdx === currentQIdx) return;
    recordCurrentQuestionTime();
    setCurrentSectionIdx(sectionIdx);
    setCurrentQIdx(qIdx);
  };

  // Drawing functions
  const startDrawing = (e) => {
    if (!canvasCtx) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    canvasCtx.beginPath();
    canvasCtx.moveTo(x, y);
    canvasCtx.lineTo(x, y);
    canvasCtx.stroke();
  };

  const draw = (e) => {
    if (!isDrawing || !canvasCtx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    canvasCtx.lineTo(x, y);
    canvasCtx.stroke();
    canvasCtx.beginPath();
    canvasCtx.moveTo(x, y);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (canvasCtx) canvasCtx.beginPath();
  };

  const clearCanvas = () => {
    if (canvasCtx && canvasRef.current) {
      canvasCtx.fillStyle = "white";
      canvasCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const currentSection = sections[currentSectionIdx];
      const currentQ = currentSection?.questions[currentQIdx];
      if (currentQ) {
        setAnswers((prev) => ({
          ...prev,
          [currentQ.id]: { answer: "" },
        }));
      }
    }
  };

  const saveDrawing = async () => {
    if (!canvasRef.current) return;
    setUploading(true);
    canvasRef.current.toBlob(async (blob) => {
      const file = new File([blob], "drawing.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await axios.post("http://localhost:8080/api/upload", formData);
        const url = res.data.url;
        const currentSection = sections[currentSectionIdx];
        const currentQ = currentSection?.questions[currentQIdx];
        if (currentQ) {
          setAnswers((prev) => ({
            ...prev,
            [currentQ.id]: { answer: url },
          }));
          alert("Drawing saved!");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to save drawing");
      } finally {
        setUploading(false);
      }
    }, "image/png");
  };

  const handleSubmit = async () => {
    recordCurrentQuestionTime();

    const finalAnswers = {};
    for (const section of sections) {
      for (const q of section.questions) {
        finalAnswers[q.id] = {
          answer: answersRef.current[q.id]?.answer || "",
          time: questionTimesRef.current[q.id] || 0,
        };
      }
    }

    const totalTime = Object.values(questionTimesRef.current).reduce((sum, t) => sum + t, 0);

    const payload = {
      userId: user.id,
      testId: Number(id),
      attemptId: attemptId,
      totalTime: totalTime,
      answersJson: JSON.stringify(finalAnswers),
    };
    console.log("Sending payload:", payload);

    try {
      await axios.post("http://localhost:8080/api/results/submit", payload);
      navigate(`/result/${id}`, { state: { attemptId: attemptId } });
    } catch (err) {
      console.error(err);
      alert("Submission failed ❌");
    }
  };

  if (checking || !sections.length) {
    return <LoadingSpinner />;
  }

  const currentSection = sections[currentSectionIdx];
  const currentQuestion = currentSection?.questions[currentQIdx];
  const totalQuestions = getTotalQuestions();
  const globalIndex = getCurrentGlobalIndex();
  const progress = ((globalIndex + 1) / totalQuestions) * 100;

  const isAnswered = (questionId) => {
    const ans = answers[questionId]?.answer;
    return ans && ans.trim().length > 0;
  };

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { answer: value },
    }));
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "MCQ":
        const options = JSON.parse(currentQuestion.options || "[]");
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {options.map((opt, idx) => (
              <label key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name={`q${currentQuestion.id}`}
                  value={opt}
                  checked={answers[currentQuestion.id]?.answer === opt}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      case "MCQ_IMAGE":
        const imgOptions = JSON.parse(currentQuestion.options || "[]");
        return (
          <div>
            {currentQuestion.mediaUrl && (
              <div style={{ marginBottom: "16px" }}>
                <img src={currentQuestion.mediaUrl} alt="Reference" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "12px" }} />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {imgOptions.map((opt, idx) => (
                <label key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name={`q${currentQuestion.id}`}
                    value={opt}
                    checked={answers[currentQuestion.id]?.answer === opt}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case "NUMERICAL":
        return (
          <input
            type="number"
            placeholder="Enter a number"
            value={answers[currentQuestion.id]?.answer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            style={styles.input}
          />
        );
      case "FILL_BLANKS":
      case "TEXT":
        return (
          <input
            type="text"
            placeholder="Type your answer here..."
            value={answers[currentQuestion.id]?.answer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            style={styles.input}
          />
        );
      case "DRAW_IMAGE":
        return (
          <div>
            {currentQuestion.mediaUrl && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#111827" }}>Reference image:</p>
                <img src={currentQuestion.mediaUrl} alt="Reference" style={{ maxWidth: "300px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
              </div>
            )}
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#111827" }}>Draw here:</p>
              <canvas
                ref={canvasRef}
                style={{
                  cursor: "crosshair",
                  touchAction: "none",
                  width: "100%",
                  height: "auto",
                  background: "white",
                  border: "2px solid #cbd5e1",
                  borderRadius: "12px",
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
              />
              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button onClick={clearCanvas} style={styles.smallButton}>
                  <Trash2 size={16} /> Clear
                </button>
                <button onClick={saveDrawing} disabled={uploading} style={{ ...styles.smallButton, background: "#10b981" }}>
                  <Save size={16} /> {uploading ? "Saving..." : "Save Drawing"}
                </button>
              </div>
              {answers[currentQuestion.id]?.answer && (
                <p style={{ fontSize: "12px", color: "green", marginTop: "8px" }}>Drawing saved ✓</p>
              )}
            </div>
          </div>
        );
      case "IMAGE_DESCRIPTION":
        return (
          <div>
            {currentQuestion.mediaUrl && (
              <div style={{ marginBottom: "20px" }}>
                <img src={currentQuestion.mediaUrl} alt="Reference" style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
              </div>
            )}
            <textarea
              rows="4"
              placeholder="Describe the image in detail..."
              value={answers[currentQuestion.id]?.answer || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>
        );
      default:
        return (
          <input
            type="text"
            placeholder="Type your answer here..."
            value={answers[currentQuestion.id]?.answer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            style={styles.input}
          />
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainWrapper}>
        {/* Section-wise Question Palette */}
        <div style={styles.palette}>
          <h3 style={styles.paletteTitle}>Questions</h3>
          {sections.map((section, secIdx) => (
            <div key={section.id} style={{ marginBottom: "20px" }}>
              <div style={styles.sectionTitle}>{section.title}</div>
              <div style={styles.paletteGrid}>
                {section.questions.map((q, qIdx) => {
                  let btnStyle = styles.paletteBtn;
                  if (secIdx === currentSectionIdx && qIdx === currentQIdx) {
                    btnStyle = { ...styles.paletteBtn, ...styles.paletteBtnCurrent };
                  } else if (isAnswered(q.id)) {
                    btnStyle = { ...styles.paletteBtn, ...styles.paletteBtnAnswered };
                  } else {
                    btnStyle = { ...styles.paletteBtn, ...styles.paletteBtnUnanswered };
                  }
                  return (
                    <button
                      key={q.id}
                      style={btnStyle}
                      onClick={() => handleJumpToQuestion(secIdx, qIdx)}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={styles.inner}>
          <div style={styles.header}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <button onClick={() => navigate("/dashboard")} style={styles.backButton}>
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", color: "#111827", letterSpacing: "-0.025em" }}>{test.title}</h2>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "15px" }}>
                    {currentSection.title} – Question {currentQIdx + 1} of {currentSection.questions.length}
                  </p>
                </div>
              </div>
              <div style={styles.timer}>
                <Clock size={22} style={{ color: "#2563eb" }} />
                <span style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>{currentTimer}s</span>
                <span style={{ fontSize: "13px", marginLeft: "6px", color: "#6b7280" }}>(Time on this question)</span>
              </div>
            </div>
            <div style={styles.progressBar}>
              <div style={{ width: `${progress}%`, ...styles.progressFill }} />
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.questionNumber}>{globalIndex + 1}</div>
            <h3 style={styles.questionText}>{currentQuestion.questionText}</h3>
            <div>
              <label style={styles.answerLabel}>Your Answer</label>
              {renderQuestion()}
            </div>
            <div style={styles.infoBox}>
              <AlertCircle size={22} style={{ color: "#f59e0b", flexShrink: 0 }} />
              <p style={{ margin: 0, color: "#92400e", fontSize: "14px", fontWeight: "500" }}>
                {currentQuestion.type === "DRAW_IMAGE"
                  ? "Draw the image using your mouse or finger. Click 'Save Drawing' when done."
                  : currentQuestion.type === "IMAGE_DESCRIPTION"
                  ? "Describe the image in as much detail as possible."
                  : "Take your time to answer correctly."}
              </p>
            </div>
          </div>

          <div style={styles.buttonRow}>
            {globalIndex + 1 < totalQuestions ? (
              <button onClick={handleNext} style={styles.nextButton}>Next Question →</button>
            ) : (
              <button onClick={handleSubmit} style={styles.submitButton}>Submit Test</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const LoadingSpinner = () => (
  <div style={loadingStyles.container}>
    <div style={loadingStyles.box}>
      <div style={loadingStyles.spinner}></div>
      <p style={{ color: "#6b7280", marginTop: "16px" }}>Loading test...</p>
    </div>
  </div>
);

const styles = {
  container: { minHeight: "100vh", background: "#f0f6ff", padding: "32px" },
  mainWrapper: { display: "flex", gap: "32px", maxWidth: "1400px", margin: "0 auto" },
  palette: { width: "280px", background: "white", borderRadius: "24px", padding: "24px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)", alignSelf: "flex-start", position: "sticky", top: "32px", maxHeight: "calc(100vh - 64px)", overflowY: "auto" },
  paletteTitle: { fontSize: "18px", fontWeight: "600", margin: "0 0 16px 0", color: "#111827", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px" },
  sectionTitle: { fontSize: "14px", fontWeight: "600", color: "#4b5563", margin: "0 0 8px 0" },
  paletteGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginBottom: "16px" },
  paletteBtn: { width: "100%", aspectRatio: "1", borderRadius: "10px", border: "none", fontSize: "14px", fontWeight: "500", cursor: "pointer", transition: "all 0.2s ease" },
  paletteBtnCurrent: { background: "#2563eb", color: "white", boxShadow: "0 2px 4px rgba(37,99,235,0.3)" },
  paletteBtnAnswered: { background: "#d1fae5", color: "#065f46", border: "1px solid #10b981" },
  paletteBtnUnanswered: { background: "#f3f4f6", color: "#6b7280", border: "1px solid #e5e7eb" },
  inner: { flex: 1, maxWidth: "900px" },
  header: { background: "white", padding: "32px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" },
  backButton: { padding: "14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "14px", cursor: "pointer", transition: "all 0.2s ease" },
  timer: { padding: "14px 24px", background: "#dbeafe", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #93c5fd" },
  progressBar: { marginTop: "24px", background: "#e5e7eb", height: "10px", borderRadius: "12px", overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #2563eb, #1d4ed8)", borderRadius: "12px", transition: "width 0.3s ease" },
  card: { background: "white", padding: "44px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" },
  questionNumber: { width: "56px", height: "56px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "20px", fontWeight: "700", marginBottom: "28px", boxShadow: "0 4px 6px -1px rgba(37,99,235,0.3)" },
  questionText: { fontSize: "24px", fontWeight: "600", marginBottom: "36px", color: "#111827", lineHeight: "1.4" },
  answerLabel: { display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "14px", color: "#111827" },
  input: { width: "100%", padding: "18px 20px", border: "1px solid #d1d5db", borderRadius: "14px", fontSize: "16px", transition: "all 0.2s ease", outline: "none", boxSizing: "border-box" },
  smallButton: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#ef4444", color: "white", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", border: "none", transition: "all 0.2s ease" },
  infoBox: { marginTop: "28px", padding: "18px 20px", background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", borderRadius: "14px", display: "flex", alignItems: "flex-start", gap: "14px", border: "1px solid #fbbf24" },
  buttonRow: { display: "flex", justifyContent: "center", gap: "20px" },
  nextButton: { padding: "18px 48px", background: "#2563eb", color: "white", border: "none", borderRadius: "14px", fontWeight: "600", cursor: "pointer", fontSize: "16px", transition: "all 0.2s ease", boxShadow: "0 4px 6px -1px rgba(37,99,235,0.2)" },
  submitButton: { padding: "18px 48px", background: "#059669", color: "white", border: "none", borderRadius: "14px", fontWeight: "600", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s ease", boxShadow: "0 4px 6px -1px rgba(5,150,105,0.2)" },
};

const loadingStyles = {
  container: { minHeight: "100vh", background: "#f0f6ff", display: "flex", justifyContent: "center", alignItems: "center" },
  box: { background: "white", padding: "48px", borderRadius: "24px", textAlign: "center", border: "1px solid #e5e7eb" },
  spinner: { width: "48px", height: "48px", border: "4px solid #e5e7eb", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" },
};

export default AttemptTest;