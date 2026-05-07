// // import { useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";
// // import { Plus, Trash2, Save, ArrowLeft, FileQuestion, AlertTriangle, Image, List, Type, FileText, Upload, MoveUp, MoveDown } from "lucide-react";
// // import { useLanguage } from "../context/LanguageContext";
// // import LanguageSwitcher from "../components/LanguageSwitcher";
// //
// // function CreateTest() {
// //   const navigate = useNavigate();
// //   const { t } = useLanguage();
// //   const [title, setTitle] = useState("");
// //   const [sections, setSections] = useState([
// //     { id: Date.now(), title: "Section 1", order: 1, questions: [] }
// //   ]);
// //   const [loading, setLoading] = useState(false);
// //
// //   // Section management
// //   const addSection = () => {
// //     const newOrder = sections.length + 1;
// //     setSections([...sections, {
// //       id: Date.now(),
// //       title: `${t("section")} ${newOrder}`,
// //       order: newOrder,
// //       questions: []
// //     }]);
// //   };
// //
// //   const updateSectionTitle = (sectionId, newTitle) => {
// //     setSections(sections.map(s => s.id === sectionId ? { ...s, title: newTitle } : s));
// //   };
// //
// //   const removeSection = (sectionId) => {
// //     if (sections.length === 1) {
// //       alert(t("need_at_least_one_section"));
// //       return;
// //     }
// //     setSections(sections.filter(s => s.id !== sectionId));
// //   };
// //
// //   const moveSectionUp = (index) => {
// //     if (index === 0) return;
// //     const newSections = [...sections];
// //     [newSections[index-1], newSections[index]] = [newSections[index], newSections[index-1]];
// //     newSections.forEach((s, i) => s.order = i+1);
// //     setSections(newSections);
// //   };
// //
// //   const moveSectionDown = (index) => {
// //     if (index === sections.length-1) return;
// //     const newSections = [...sections];
// //     [newSections[index+1], newSections[index]] = [newSections[index], newSections[index+1]];
// //     newSections.forEach((s, i) => s.order = i+1);
// //     setSections(newSections);
// //   };
// //
// //   // Question management
// //   const addQuestion = (sectionId) => {
// //     setSections(sections.map(s => {
// //       if (s.id !== sectionId) return s;
// //       return {
// //         ...s,
// //         questions: [...s.questions, {
// //           id: Date.now(),
// //           questionText: "",
// //           type: "TEXT",
// //           options: "",
// //           points: 1.0,
// //           mediaUrl: "",
// //           mediaFile: null
// //         }]
// //       };
// //     }));
// //   };
// //
// //   const updateQuestion = (sectionId, qId, field, value) => {
// //     setSections(sections.map(s => {
// //       if (s.id !== sectionId) return s;
// //       return {
// //         ...s,
// //         questions: s.questions.map(q => q.id === qId ? { ...q, [field]: value } : q)
// //       };
// //     }));
// //   };
// //
// //   const removeQuestion = (sectionId, qId) => {
// //     setSections(sections.map(s => {
// //       if (s.id !== sectionId) return s;
// //       return { ...s, questions: s.questions.filter(q => q.id !== qId) };
// //     }));
// //   };
// //
// //   const moveQuestionUp = (sectionId, qIndex) => {
// //     if (qIndex === 0) return;
// //     setSections(sections.map(s => {
// //       if (s.id !== sectionId) return s;
// //       const newQuestions = [...s.questions];
// //       [newQuestions[qIndex-1], newQuestions[qIndex]] = [newQuestions[qIndex], newQuestions[qIndex-1]];
// //       return { ...s, questions: newQuestions };
// //     }));
// //   };
// //
// //   const moveQuestionDown = (sectionId, qIndex, total) => {
// //     if (qIndex === total-1) return;
// //     setSections(sections.map(s => {
// //       if (s.id !== sectionId) return s;
// //       const newQuestions = [...s.questions];
// //       [newQuestions[qIndex+1], newQuestions[qIndex]] = [newQuestions[qIndex], newQuestions[qIndex+1]];
// //       return { ...s, questions: newQuestions };
// //     }));
// //   };
// //
// //   const handleImageUpload = async (sectionId, qId, file) => {
// //     if (!file) return;
// //     const formData = new FormData();
// //     formData.append("file", file);
// //     try {
// //       const res = await axios.post("http://localhost:8080/api/upload", formData);
// //       updateQuestion(sectionId, qId, "mediaUrl", res.data.url);
// //       alert(t("image_uploaded_successfully"));
// //     } catch (err) {
// //       console.error(err);
// //       alert(t("image_upload_failed"));
// //     }
// //   };
// //
// //   const submit = async () => {
// //     if (!title.trim()) return alert(t("enter_test_title"));
// //     if (sections.length === 0) return alert(t("add_at_least_one_section"));
// //     for (const sec of sections) {
// //       if (!sec.title.trim()) return alert(t("all_sections_need_title"));
// //       if (sec.questions.length === 0) return alert(t("section_has_no_questions", { title: sec.title }));
// //       for (let i = 0; i < sec.questions.length; i++) {
// //         const q = sec.questions[i];
// //         if (!q.questionText.trim()) return alert(t("question_no_text", { section: sec.title, num: i+1 }));
// //         if ((q.type === "MCQ" || q.type === "MCQ_IMAGE") && !q.options.trim()) {
// //           return alert(t("mcq_needs_options", { section: sec.title, num: i+1 }));
// //         }
// //         if (q.points <= 0) return alert(t("positive_marks", { section: sec.title, num: i+1 }));
// //       }
// //     }
// //
// //     try {
// //       setLoading(true);
// //       const payload = {
// //         title: title.trim(),
// //         sections: sections.map((sec) => ({
// //           title: sec.title.trim(),
// //           questions: sec.questions.map(q => ({
// //             questionText: q.questionText.trim(),
// //             type: q.type,
// //             options: q.type.startsWith("MCQ") ? JSON.stringify(q.options.split(",").map(s => s.trim())) : null,
// //             points: q.points,
// //             mediaUrl: q.mediaUrl || null
// //           }))
// //         }))
// //       };
// //       await axios.post("http://localhost:8080/api/tests/create", payload);
// //       alert(t("test_created_successfully"));
// //       navigate("/admin/dashboard");
// //     } catch (err) {
// //       console.error(err);
// //       alert(t("error_creating_test"));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //
// //   const questionTypeOptions = [
// //     { value: "TEXT", label: t("text_answer"), icon: <Type size={16} /> },
// //     { value: "MCQ", label: t("multiple_choice"), icon: <List size={16} /> },
// //     { value: "MCQ_IMAGE", label: t("mcq_with_image"), icon: <Image size={16} /> },
// //     { value: "FILL_BLANKS", label: t("fill_blanks"), icon: <FileText size={16} /> },
// //     { value: "DRAW_IMAGE", label: t("draw_image"), icon: <Image size={16} /> },
// //     { value: "IMAGE_DESCRIPTION", label: t("describe_image"), icon: <Image size={16} /> }
// //   ];
// //
// //   return (
// //     <div style={{ minHeight: "100vh", background: "#f0f6ff", padding: "32px" }}>
// //       {/* Language Switcher - fixed at top right */}
// //       <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: "white", padding: "8px 12px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
// //         <LanguageSwitcher />
// //       </div>
// //
// //       <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
// //         {/* Header */}
// //         <div style={headerStyle}>
// //           <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
// //             <button onClick={() => navigate("/admin/dashboard")} style={backButtonStyle}>
// //               <ArrowLeft size={20} />
// //             </button>
// //             <div>
// //               <h2 style={pageTitle}>{t("create_new_test")}</h2>
// //               <p style={pageSubtitle}>{t("create_test_subtitle")}</p>
// //             </div>
// //             <div style={questionCountBadge}>
// //               <FileQuestion size={22} />
// //               <span style={{ fontWeight: "600", fontSize: "15px" }}>{sections.reduce((acc, s) => acc + s.questions.length, 0)} {t("questions")}</span>
// //             </div>
// //           </div>
// //         </div>
// //
// //         {/* Test Title */}
// //         <div style={cardStyle}>
// //           <label style={labelStyle}>{t("test_title")}</label>
// //           <input type="text" placeholder={t("enter_test_title_placeholder")} value={title} onChange={e => setTitle(e.target.value)} style={inputLargeStyle} />
// //         </div>
// //
// //         {/* Sections */}
// //         {sections.map((section, secIdx) => (
// //           <div key={section.id} style={sectionCardStyle}>
// //             <div style={sectionHeader}>
// //               <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
// //                 <span style={sectionNumber}>{secIdx + 1}</span>
// //                 <input
// //                   type="text"
// //                   value={section.title}
// //                   onChange={e => updateSectionTitle(section.id, e.target.value)}
// //                   placeholder={t("section_title_placeholder")}
// //                   style={sectionTitleInput}
// //                 />
// //               </div>
// //               <div style={{ display: "flex", gap: "10px" }}>
// //                 <button onClick={() => moveSectionUp(secIdx)} style={iconButton} title={t("move_up")}><MoveUp size={18} /></button>
// //                 <button onClick={() => moveSectionDown(secIdx)} style={iconButton} title={t("move_down")}><MoveDown size={18} /></button>
// //                 <button onClick={() => removeSection(section.id)} style={iconButtonDanger} title={t("remove_section")}><Trash2 size={18} /></button>
// //               </div>
// //             </div>
// //
// //             {/* Questions inside section */}
// //             <div style={{ marginTop: "24px" }}>
// //               <div style={sectionSubHeader}>
// //                 <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#111827" }}>{t("questions")}</h4>
// //                 <button onClick={() => addQuestion(section.id)} style={addButtonSmall}>
// //                   <Plus size={16} /> {t("add_question")}
// //                 </button>
// //               </div>
// //               {section.questions.length === 0 ? (
// //                 <div style={emptyStateSmall}>
// //                   <FileQuestion size={40} style={{ color: "#d1d5db" }} />
// //                   <p style={{ margin: "12px 0 0 0", color: "#6b7280", fontSize: "15px" }}>{t("no_questions_in_section")}</p>
// //                 </div>
// //               ) : (
// //                 <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
// //                   {section.questions.map((q, qIdx) => (
// //                     <div key={q.id} style={questionCard}>
// //                       <div style={questionNumber}>{qIdx + 1}</div>
// //                       <div style={{ flex: 1 }}>
// //                         <textarea placeholder={t("question_text_placeholder")} value={q.questionText} onChange={e => updateQuestion(section.id, q.id, "questionText", e.target.value)} rows={2} style={textAreaStyle} />
// //                         <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "14px" }}>
// //                           <select value={q.type} onChange={e => updateQuestion(section.id, q.id, "type", e.target.value)} style={selectStyle}>
// //                             {questionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
// //                           </select>
// //                           <input type="number" step="0.5" placeholder={t("marks")} value={q.points} onChange={e => updateQuestion(section.id, q.id, "points", parseFloat(e.target.value))} style={smallInputStyle} />
// //                         </div>
// //                         {(q.type === "MCQ" || q.type === "MCQ_IMAGE") && (
// //                           <input type="text" placeholder={t("options_comma_separated")} value={q.options} onChange={e => updateQuestion(section.id, q.id, "options", e.target.value)} style={inputStyle} />
// //                         )}
// //                         {(q.type === "MCQ_IMAGE" || q.type === "DRAW_IMAGE" || q.type === "IMAGE_DESCRIPTION") && (
// //                           <div style={{ marginTop: "10px" }}>
// //                             <label style={uploadButtonSmall}>
// //                               <Upload size={16} /> {q.mediaUrl ? t("change_image") : t("upload_reference_image")}
// //                               <input type="file" accept="image/*" onChange={e => handleImageUpload(section.id, q.id, e.target.files[0])} style={{ display: "none" }} />
// //                             </label>
// //                             {q.mediaUrl && <img src={q.mediaUrl} alt="preview" style={{ width: "80px", marginLeft: "14px", borderRadius: "10px", border: "1px solid #d1d5db" }} />}
// //                           </div>
// //                         )}
// //                         {q.type === "DRAW_IMAGE" && <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px", margin: 0 }}>{t("draw_image_info")}</p>}
// //                         {q.type === "IMAGE_DESCRIPTION" && <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px", margin: 0 }}>{t("image_description_info")}</p>}
// //                       </div>
// //                       <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
// //                         <button onClick={() => moveQuestionUp(section.id, qIdx)} style={iconButtonSmall}><MoveUp size={16} /></button>
// //                         <button onClick={() => moveQuestionDown(section.id, qIdx, section.questions.length)} style={iconButtonSmall}><MoveDown size={16} /></button>
// //                         <button onClick={() => removeQuestion(section.id, q.id)} style={iconButtonDangerSmall}><Trash2 size={16} /></button>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //
// //         {/* Add Section Button */}
// //         <div style={{ textAlign: "center", marginBottom: "32px" }}>
// //           <button onClick={addSection} style={addSectionButton}>
// //             <Plus size={20} /> {t("add_section")}
// //           </button>
// //         </div>
// //
// //         {/* Action Buttons */}
// //         <div style={actionButtons}>
// //           <button onClick={() => navigate("/admin/dashboard")} style={cancelButton}>{t("cancel")}</button>
// //           <button onClick={submit} disabled={loading} style={submitButton(loading)}>
// //             <Save size={20} /> {loading ? t("creating") : t("create_test")}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// //
// // // Styles (unchanged)
// // const headerStyle = { background: "white", padding: "32px 36px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" };
// // const backButtonStyle = { padding: "14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "14px", cursor: "pointer", transition: "all 0.2s ease" };
// // const pageTitle = { fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0", color: "#111827", letterSpacing: "-0.025em" };
// // const pageSubtitle = { margin: 0, color: "#6b7280", fontSize: "15px" };
// // const questionCountBadge = { padding: "14px 24px", background: "#dbeafe", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #93c5fd" };
// // const cardStyle = { background: "white", padding: "36px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" };
// // const labelStyle = { display: "block", fontWeight: "600", marginBottom: "14px", color: "#111827", fontSize: "14px" };
// // const inputLargeStyle = { width: "100%", padding: "18px 20px", border: "1px solid #d1d5db", borderRadius: "14px", fontSize: "16px", transition: "all 0.2s ease", outline: "none", boxSizing: "border-box" };
// // const sectionCardStyle = { background: "white", padding: "28px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" };
// // const sectionHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" };
// // const sectionNumber = { width: "40px", height: "40px", background: "#2563eb", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "600", fontSize: "16px" };
// // const sectionTitleInput = { flex: 1, padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "16px", fontWeight: "500", transition: "all 0.2s ease", outline: "none" };
// // const sectionSubHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" };
// // const addButtonSmall = { padding: "10px 20px", background: "#059669", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", transition: "all 0.2s ease" };
// // const emptyStateSmall = { textAlign: "center", padding: "48px 24px", background: "#f9fafb", borderRadius: "16px", border: "2px dashed #d1d5db" };
// // const questionCard = { padding: "24px", background: "#f9fafb", borderRadius: "18px", border: "1px solid #e5e7eb", display: "flex", gap: "20px", alignItems: "flex-start" };
// // const questionNumber = { width: "44px", height: "44px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", flexShrink: 0, fontSize: "16px", boxShadow: "0 4px 6px -1px rgba(37,99,235,0.3)" };
// // const textAreaStyle = { width: "100%", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: "10px", marginBottom: "14px", fontSize: "14px", transition: "all 0.2s ease", outline: "none", fontFamily: "inherit", resize: "vertical" };
// // const selectStyle = { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", transition: "all 0.2s ease", outline: "none" };
// // const smallInputStyle = { width: "90px", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", transition: "all 0.2s ease", outline: "none" };
// // const inputStyle = { width: "100%", padding: "10px 14px", marginBottom: "10px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", transition: "all 0.2s ease", outline: "none", boxSizing: "border-box" };
// // const uploadButtonSmall = { display: "inline-flex", alignItems: "center", gap: "8px", background: "#e5e7eb", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", border: "1px solid #d1d5db", transition: "all 0.2s ease" };
// // const iconButton = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", cursor: "pointer", padding: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" };
// // const iconButtonDanger = { background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", padding: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#dc2626", transition: "all 0.2s ease" };
// // const iconButtonSmall = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" };
// // const iconButtonDangerSmall = { background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#dc2626", transition: "all 0.2s ease" };
// // const addSectionButton = { padding: "14px 32px", background: "#2563eb", color: "white", border: "none", borderRadius: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", fontWeight: "600", fontSize: "15px", transition: "all 0.2s ease", boxShadow: "0 4px 6px -1px rgba(37,99,235,0.2)" };
// // const actionButtons = { display: "flex", gap: "20px", justifyContent: "center" };
// // const cancelButton = { padding: "18px 40px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "14px", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "all 0.2s ease" };
// // const submitButton = (loading) => ({ padding: "18px 48px", background: loading ? "#9ca3af" : "#2563eb", color: "white", border: "none", borderRadius: "14px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s ease", boxShadow: loading ? "none" : "0 4px 6px -1px rgba(37,99,235,0.2)" });
// //
// // export default CreateTest;
//
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Plus, Trash2, Save, ArrowLeft, FileQuestion, AlertTriangle, Image, List, Type, FileText, Upload, MoveUp, MoveDown } from "lucide-react";
//
// function CreateTest() {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [sections, setSections] = useState([
//     { id: Date.now(), title: "Section 1", order: 1, questions: [] }
//   ]);
//   const [loading, setLoading] = useState(false);
//
//   // Section management
//   const addSection = () => {
//     const newOrder = sections.length + 1;
//     setSections([...sections, {
//       id: Date.now(),
//       title: `Section ${newOrder}`,
//       order: newOrder,
//       questions: []
//     }]);
//   };
//
//   const updateSectionTitle = (sectionId, newTitle) => {
//     setSections(sections.map(s => s.id === sectionId ? { ...s, title: newTitle } : s));
//   };
//
//   const removeSection = (sectionId) => {
//     if (sections.length === 1) {
//       alert("You need at least one section");
//       return;
//     }
//     setSections(sections.filter(s => s.id !== sectionId));
//   };
//
//   const moveSectionUp = (index) => {
//     if (index === 0) return;
//     const newSections = [...sections];
//     [newSections[index-1], newSections[index]] = [newSections[index], newSections[index-1]];
//     newSections.forEach((s, i) => s.order = i+1);
//     setSections(newSections);
//   };
//
//   const moveSectionDown = (index) => {
//     if (index === sections.length-1) return;
//     const newSections = [...sections];
//     [newSections[index+1], newSections[index]] = [newSections[index], newSections[index+1]];
//     newSections.forEach((s, i) => s.order = i+1);
//     setSections(newSections);
//   };
//
//   // Question management
//   const addQuestion = (sectionId) => {
//     setSections(sections.map(s => {
//       if (s.id !== sectionId) return s;
//       return {
//         ...s,
//         questions: [...s.questions, {
//           id: Date.now(),
//           questionText: "",
//           type: "TEXT",
//           options: "",
//           correctAnswer: "",  // ← NEW: added correctAnswer field
//           points: 1.0,
//           mediaUrl: "",
//           mediaFile: null
//         }]
//       };
//     }));
//   };
//
//   const updateQuestion = (sectionId, qId, field, value) => {
//     setSections(sections.map(s => {
//       if (s.id !== sectionId) return s;
//       return {
//         ...s,
//         questions: s.questions.map(q => q.id === qId ? { ...q, [field]: value } : q)
//       };
//     }));
//   };
//
//   const removeQuestion = (sectionId, qId) => {
//     setSections(sections.map(s => {
//       if (s.id !== sectionId) return s;
//       return { ...s, questions: s.questions.filter(q => q.id !== qId) };
//     }));
//   };
//
//   const moveQuestionUp = (sectionId, qIndex) => {
//     if (qIndex === 0) return;
//     setSections(sections.map(s => {
//       if (s.id !== sectionId) return s;
//       const newQuestions = [...s.questions];
//       [newQuestions[qIndex-1], newQuestions[qIndex]] = [newQuestions[qIndex], newQuestions[qIndex-1]];
//       return { ...s, questions: newQuestions };
//     }));
//   };
//
//   const moveQuestionDown = (sectionId, qIndex, total) => {
//     if (qIndex === total-1) return;
//     setSections(sections.map(s => {
//       if (s.id !== sectionId) return s;
//       const newQuestions = [...s.questions];
//       [newQuestions[qIndex+1], newQuestions[qIndex]] = [newQuestions[qIndex], newQuestions[qIndex+1]];
//       return { ...s, questions: newQuestions };
//     }));
//   };
//
//   const handleImageUpload = async (sectionId, qId, file) => {
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const res = await axios.post("http://localhost:8080/api/upload", formData);
//       updateQuestion(sectionId, qId, "mediaUrl", res.data.url);
//       alert("Image uploaded successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Image upload failed");
//     }
//   };
//
//   const submit = async () => {
//     if (!title.trim()) return alert("Please enter a test title");
//     if (sections.length === 0) return alert("Please add at least one section");
//     for (const sec of sections) {
//       if (!sec.title.trim()) return alert("All sections must have a title");
//       if (sec.questions.length === 0) return alert(`Section "${sec.title}" has no questions`);
//       for (let i = 0; i < sec.questions.length; i++) {
//         const q = sec.questions[i];
//         if (!q.questionText.trim()) return alert(`Question ${i+1} in section "${sec.title}" has no text`);
//         if ((q.type === "MCQ" || q.type === "MCQ_IMAGE") && !q.options.trim()) {
//           return alert(`Question ${i+1} in section "${sec.title}" needs options`);
//         }
//         // Validate correctAnswer for auto‑gradable question types
//         if (q.type !== "DRAW_IMAGE" && q.type !== "IMAGE_DESCRIPTION") {
//           if (!q.correctAnswer.trim()) {
//             return alert(`Question ${i+1} in section "${sec.title}" requires a correct answer for auto‑grading`);
//           }
//         }
//         if (q.points <= 0) return alert(`Question ${i+1} in section "${sec.title}" must have positive marks`);
//       }
//     }
//
//     try {
//       setLoading(true);
//       const payload = {
//         title: title.trim(),
//         sections: sections.map((sec) => ({
//           title: sec.title.trim(),
//           questions: sec.questions.map(q => ({
//             questionText: q.questionText.trim(),
//             type: q.type,
//             options: q.type.startsWith("MCQ") ? JSON.stringify(q.options.split(",").map(s => s.trim())) : null,
//             correctAnswer: q.correctAnswer.trim(),  // ← NEW: send correctAnswer
//             points: q.points,
//             mediaUrl: q.mediaUrl || null
//           }))
//         }))
//       };
//       await axios.post("http://localhost:8080/api/tests/create", payload);
//       alert("Test Created Successfully ✅");
//       navigate("/admin/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert("Error creating test");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const questionTypeOptions = [
//     { value: "TEXT", label: "Text Answer", icon: <Type size={16} /> },
//     { value: "MCQ", label: "Multiple Choice", icon: <List size={16} /> },
//     { value: "MCQ_IMAGE", label: "MCQ with Image", icon: <Image size={16} /> },
//     { value: "FILL_BLANKS", label: "Fill in the Blanks", icon: <FileText size={16} /> },
//     { value: "DRAW_IMAGE", label: "Draw the Image", icon: <Image size={16} /> },
//     { value: "IMAGE_DESCRIPTION", label: "Describe the Image", icon: <Image size={16} /> }
//   ];
//
//   return (
//     <div style={{ minHeight: "100vh", background: "#f0f6ff", padding: "32px" }}>
//       <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//         {/* Header */}
//         <div style={headerStyle}>
//           <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
//             <button onClick={() => navigate("/admin/dashboard")} style={backButtonStyle}>
//               <ArrowLeft size={20} />
//             </button>
//             <div>
//               <h2 style={pageTitle}>Create New Test</h2>
//               <p style={pageSubtitle}>Add sections, questions, marks, and correct answers for auto‑grading</p>
//             </div>
//             <div style={questionCountBadge}>
//               <FileQuestion size={22} />
//               <span style={{ fontWeight: "600", fontSize: "15px" }}>{sections.reduce((acc, s) => acc + s.questions.length, 0)} Questions</span>
//             </div>
//           </div>
//         </div>
//
//         {/* Test Title */}
//         <div style={cardStyle}>
//           <label style={labelStyle}>Test Title</label>
//           <input type="text" placeholder="Enter test title" value={title} onChange={e => setTitle(e.target.value)} style={inputLargeStyle} />
//         </div>
//
//         {/* Sections */}
//         {sections.map((section, secIdx) => (
//           <div key={section.id} style={sectionCardStyle}>
//             <div style={sectionHeader}>
//               <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
//                 <span style={sectionNumber}>{secIdx + 1}</span>
//                 <input
//                   type="text"
//                   value={section.title}
//                   onChange={e => updateSectionTitle(section.id, e.target.value)}
//                   placeholder="Section Title"
//                   style={sectionTitleInput}
//                 />
//               </div>
//               <div style={{ display: "flex", gap: "10px" }}>
//                 <button onClick={() => moveSectionUp(secIdx)} style={iconButton} title="Move up"><MoveUp size={18} /></button>
//                 <button onClick={() => moveSectionDown(secIdx)} style={iconButton} title="Move down"><MoveDown size={18} /></button>
//                 <button onClick={() => removeSection(section.id)} style={iconButtonDanger} title="Remove section"><Trash2 size={18} /></button>
//               </div>
//             </div>
//
//             {/* Questions inside section */}
//             <div style={{ marginTop: "24px" }}>
//               <div style={sectionSubHeader}>
//                 <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#111827" }}>Questions</h4>
//                 <button onClick={() => addQuestion(section.id)} style={addButtonSmall}>
//                   <Plus size={16} /> Add Question
//                 </button>
//               </div>
//               {section.questions.length === 0 ? (
//                 <div style={emptyStateSmall}>
//                   <FileQuestion size={40} style={{ color: "#d1d5db" }} />
//                   <p style={{ margin: "12px 0 0 0", color: "#6b7280", fontSize: "15px" }}>No questions in this section</p>
//                 </div>
//               ) : (
//                 <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//                   {section.questions.map((q, qIdx) => (
//                     <div key={q.id} style={questionCard}>
//                       <div style={questionNumber}>{qIdx + 1}</div>
//                       <div style={{ flex: 1 }}>
//                         <textarea placeholder="Question text" value={q.questionText} onChange={e => updateQuestion(section.id, q.id, "questionText", e.target.value)} rows={2} style={textAreaStyle} />
//
//                         <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "14px" }}>
//                           <select value={q.type} onChange={e => updateQuestion(section.id, q.id, "type", e.target.value)} style={selectStyle}>
//                             {questionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//                           </select>
//                           <input type="number" step="0.5" placeholder="Marks" value={q.points} onChange={e => updateQuestion(section.id, q.id, "points", parseFloat(e.target.value))} style={smallInputStyle} />
//                         </div>
//
//                         {/* Options for MCQ types */}
//                         {(q.type === "MCQ" || q.type === "MCQ_IMAGE") && (
//                           <input type="text" placeholder="Options (comma separated)" value={q.options} onChange={e => updateQuestion(section.id, q.id, "options", e.target.value)} style={inputStyle} />
//                         )}
//
//                         {/* 🔥 CORRECT ANSWER FIELD - for all auto‑gradable types */}
//                         {q.type !== "DRAW_IMAGE" && q.type !== "IMAGE_DESCRIPTION" && (
//                           <input
//                             type="text"
//                             placeholder="Correct Answer (for auto‑grading)"
//                             value={q.correctAnswer}
//                             onChange={e => updateQuestion(section.id, q.id, "correctAnswer", e.target.value)}
//                             style={inputStyle}
//                           />
//                         )}
//
//                         {/* Image upload for MCQ_IMAGE, DRAW_IMAGE, IMAGE_DESCRIPTION */}
//                         {(q.type === "MCQ_IMAGE" || q.type === "DRAW_IMAGE" || q.type === "IMAGE_DESCRIPTION") && (
//                           <div style={{ marginTop: "10px" }}>
//                             <label style={uploadButtonSmall}>
//                               <Upload size={16} /> {q.mediaUrl ? "Change Image" : "Upload Reference Image"}
//                               <input type="file" accept="image/*" onChange={e => handleImageUpload(section.id, q.id, e.target.files[0])} style={{ display: "none" }} />
//                             </label>
//                             {q.mediaUrl && <img src={q.mediaUrl} alt="preview" style={{ width: "80px", marginLeft: "14px", borderRadius: "10px", border: "1px solid #d1d5db" }} />}
//                           </div>
//                         )}
//
//                         {/* Info messages */}
//                         {q.type === "DRAW_IMAGE" && <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px", margin: 0 }}>User will upload a drawing. No auto‑grading. (Admin will grade)</p>}
//                         {q.type === "IMAGE_DESCRIPTION" && <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px", margin: 0 }}>Student will describe the image in text. No auto‑grading. (Admin will grade)</p>}
//                         {(q.type === "TEXT" || q.type === "NUMERICAL" || q.type === "FILL_BLANKS") && (
//                           <p style={{ fontSize: "12px", color: "#10b981", marginTop: "4px", margin: 0 }}>✓ This question will be auto‑graded using the correct answer above</p>
//                         )}
//                       </div>
//                       <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//                         <button onClick={() => moveQuestionUp(section.id, qIdx)} style={iconButtonSmall}><MoveUp size={16} /></button>
//                         <button onClick={() => moveQuestionDown(section.id, qIdx, section.questions.length)} style={iconButtonSmall}><MoveDown size={16} /></button>
//                         <button onClick={() => removeQuestion(section.id, q.id)} style={iconButtonDangerSmall}><Trash2 size={16} /></button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//
//         {/* Add Section Button */}
//         <div style={{ textAlign: "center", marginBottom: "32px" }}>
//           <button onClick={addSection} style={addSectionButton}>
//             <Plus size={20} /> Add Section
//           </button>
//         </div>
//
//         {/* Action Buttons */}
//         <div style={actionButtons}>
//           <button onClick={() => navigate("/admin/dashboard")} style={cancelButton}>Cancel</button>
//           <button onClick={submit} disabled={loading} style={submitButton(loading)}>
//             <Save size={20} /> {loading ? "Creating..." : "Create Test"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// // Styles (unchanged)
// const headerStyle = { background: "white", padding: "32px 36px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" };
// const backButtonStyle = { padding: "14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "14px", cursor: "pointer", transition: "all 0.2s ease" };
// const pageTitle = { fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0", color: "#111827", letterSpacing: "-0.025em" };
// const pageSubtitle = { margin: 0, color: "#6b7280", fontSize: "15px" };
// const questionCountBadge = { padding: "14px 24px", background: "#dbeafe", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #93c5fd" };
// const cardStyle = { background: "white", padding: "36px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" };
// const labelStyle = { display: "block", fontWeight: "600", marginBottom: "14px", color: "#111827", fontSize: "14px" };
// const inputLargeStyle = { width: "100%", padding: "18px 20px", border: "1px solid #d1d5db", borderRadius: "14px", fontSize: "16px", transition: "all 0.2s ease", outline: "none", boxSizing: "border-box" };
// const sectionCardStyle = { background: "white", padding: "28px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" };
// const sectionHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" };
// const sectionNumber = { width: "40px", height: "40px", background: "#2563eb", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "600", fontSize: "16px" };
// const sectionTitleInput = { flex: 1, padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "16px", fontWeight: "500", transition: "all 0.2s ease", outline: "none" };
// const sectionSubHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" };
// const addButtonSmall = { padding: "10px 20px", background: "#059669", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", transition: "all 0.2s ease" };
// const emptyStateSmall = { textAlign: "center", padding: "48px 24px", background: "#f9fafb", borderRadius: "16px", border: "2px dashed #d1d5db" };
// const questionCard = { padding: "24px", background: "#f9fafb", borderRadius: "18px", border: "1px solid #e5e7eb", display: "flex", gap: "20px", alignItems: "flex-start" };
// const questionNumber = { width: "44px", height: "44px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", flexShrink: 0, fontSize: "16px", boxShadow: "0 4px 6px -1px rgba(37,99,235,0.3)" };
// const textAreaStyle = { width: "100%", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: "10px", marginBottom: "14px", fontSize: "14px", transition: "all 0.2s ease", outline: "none", fontFamily: "inherit", resize: "vertical" };
// const selectStyle = { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", transition: "all 0.2s ease", outline: "none" };
// const smallInputStyle = { width: "90px", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", transition: "all 0.2s ease", outline: "none" };
// const inputStyle = { width: "100%", padding: "10px 14px", marginBottom: "10px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", transition: "all 0.2s ease", outline: "none", boxSizing: "border-box" };
// const uploadButtonSmall = { display: "inline-flex", alignItems: "center", gap: "8px", background: "#e5e7eb", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", border: "1px solid #d1d5db", transition: "all 0.2s ease" };
// const iconButton = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", cursor: "pointer", padding: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" };
// const iconButtonDanger = { background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", padding: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#dc2626", transition: "all 0.2s ease" };
// const iconButtonSmall = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" };
// const iconButtonDangerSmall = { background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#dc2626", transition: "all 0.2s ease" };
// const addSectionButton = { padding: "14px 32px", background: "#2563eb", color: "white", border: "none", borderRadius: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", fontWeight: "600", fontSize: "15px", transition: "all 0.2s ease", boxShadow: "0 4px 6px -1px rgba(37,99,235,0.2)" };
// const actionButtons = { display: "flex", gap: "20px", justifyContent: "center" };
// const cancelButton = { padding: "18px 40px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "14px", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "all 0.2s ease" };
// const submitButton = (loading) => ({ padding: "18px 48px", background: loading ? "#9ca3af" : "#2563eb", color: "white", border: "none", borderRadius: "14px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s ease", boxShadow: loading ? "none" : "0 4px 6px -1px rgba(37,99,235,0.2)" });
//
// export default CreateTest;
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, ArrowLeft, FileQuestion, AlertTriangle, Image, List, Type, FileText, Upload, MoveUp, MoveDown } from "lucide-react";

function CreateTest() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([
    { id: Date.now(), title: "Section 1", order: 1, questions: [] }
  ]);
  const [loading, setLoading] = useState(false);

  // Section management
  const addSection = () => {
    const newOrder = sections.length + 1;
    setSections([...sections, {
      id: Date.now(),
      title: `Section ${newOrder}`,
      order: newOrder,
      questions: []
    }]);
  };

  const updateSectionTitle = (sectionId, newTitle) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, title: newTitle } : s));
  };

  const removeSection = (sectionId) => {
    if (sections.length === 1) {
      alert("You need at least one section");
      return;
    }
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index-1], newSections[index]] = [newSections[index], newSections[index-1]];
    newSections.forEach((s, i) => s.order = i+1);
    setSections(newSections);
  };

  const moveSectionDown = (index) => {
    if (index === sections.length-1) return;
    const newSections = [...sections];
    [newSections[index+1], newSections[index]] = [newSections[index], newSections[index+1]];
    newSections.forEach((s, i) => s.order = i+1);
    setSections(newSections);
  };

  // Question management
  const addQuestion = (sectionId) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        questions: [...s.questions, {
          id: Date.now(),
          questionText: "",
          type: "TEXT",
          options: "",
          correctAnswer: "",  // Optional – can be empty for manual grading
          points: 1.0,
          mediaUrl: "",
          mediaFile: null
        }]
      };
    }));
  };

  const updateQuestion = (sectionId, qId, field, value) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        questions: s.questions.map(q => q.id === qId ? { ...q, [field]: value } : q)
      };
    }));
  };

  const removeQuestion = (sectionId, qId) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, questions: s.questions.filter(q => q.id !== qId) };
    }));
  };

  const moveQuestionUp = (sectionId, qIndex) => {
    if (qIndex === 0) return;
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      const newQuestions = [...s.questions];
      [newQuestions[qIndex-1], newQuestions[qIndex]] = [newQuestions[qIndex], newQuestions[qIndex-1]];
      return { ...s, questions: newQuestions };
    }));
  };

  const moveQuestionDown = (sectionId, qIndex, total) => {
    if (qIndex === total-1) return;
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      const newQuestions = [...s.questions];
      [newQuestions[qIndex+1], newQuestions[qIndex]] = [newQuestions[qIndex], newQuestions[qIndex+1]];
      return { ...s, questions: newQuestions };
    }));
  };

  const handleImageUpload = async (sectionId, qId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:8080/api/upload", formData);
      updateQuestion(sectionId, qId, "mediaUrl", res.data.url);
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  const submit = async () => {
    if (!title.trim()) return alert("Please enter a test title");
    if (sections.length === 0) return alert("Please add at least one section");
    for (const sec of sections) {
      if (!sec.title.trim()) return alert("All sections must have a title");
      if (sec.questions.length === 0) return alert(`Section "${sec.title}" has no questions`);
      for (let i = 0; i < sec.questions.length; i++) {
        const q = sec.questions[i];
        if (!q.questionText.trim()) return alert(`Question ${i+1} in section "${sec.title}" has no text`);
        if ((q.type === "MCQ" || q.type === "MCQ_IMAGE") && !q.options.trim()) {
          return alert(`Question ${i+1} in section "${sec.title}" needs options`);
        }
        // ⚠️ REMOVED: No longer require correctAnswer – it's optional now
        if (q.points <= 0) return alert(`Question ${i+1} in section "${sec.title}" must have positive marks`);
      }
    }

    try {
      setLoading(true);
      const payload = {
        title: title.trim(),
        sections: sections.map((sec) => ({
          title: sec.title.trim(),
          questions: sec.questions.map(q => ({
            questionText: q.questionText.trim(),
            type: q.type,
            options: q.type.startsWith("MCQ") ? JSON.stringify(q.options.split(",").map(s => s.trim())) : null,
            correctAnswer: q.correctAnswer?.trim() || null,  // Send null if empty (manual grading)
            points: q.points,
            mediaUrl: q.mediaUrl || null
          }))
        }))
      };
      await axios.post("http://localhost:8080/api/tests/create", payload);
      alert("Test Created Successfully ✅");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error creating test");
    } finally {
      setLoading(false);
    }
  };

  const questionTypeOptions = [
    { value: "TEXT", label: "Text Answer", icon: <Type size={16} /> },
    { value: "MCQ", label: "Multiple Choice", icon: <List size={16} /> },
    { value: "MCQ_IMAGE", label: "MCQ with Image", icon: <Image size={16} /> },
    { value: "FILL_BLANKS", label: "Fill in the Blanks", icon: <FileText size={16} /> },
    { value: "DRAW_IMAGE", label: "Draw the Image", icon: <Image size={16} /> },
    { value: "IMAGE_DESCRIPTION", label: "Describe the Image", icon: <Image size={16} /> }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f6ff", padding: "32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/admin/dashboard")} style={backButtonStyle}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 style={pageTitle}>Create New Test</h2>
              <p style={pageSubtitle}>Add sections, questions, marks – correct answers are optional</p>
            </div>
            <div style={questionCountBadge}>
              <FileQuestion size={22} />
              <span style={{ fontWeight: "600", fontSize: "15px" }}>{sections.reduce((acc, s) => acc + s.questions.length, 0)} Questions</span>
            </div>
          </div>
        </div>

        {/* Test Title */}
        <div style={cardStyle}>
          <label style={labelStyle}>Test Title</label>
          <input type="text" placeholder="Enter test title" value={title} onChange={e => setTitle(e.target.value)} style={inputLargeStyle} />
        </div>

        {/* Sections */}
        {sections.map((section, secIdx) => (
          <div key={section.id} style={sectionCardStyle}>
            <div style={sectionHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                <span style={sectionNumber}>{secIdx + 1}</span>
                <input
                  type="text"
                  value={section.title}
                  onChange={e => updateSectionTitle(section.id, e.target.value)}
                  placeholder="Section Title"
                  style={sectionTitleInput}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => moveSectionUp(secIdx)} style={iconButton} title="Move up"><MoveUp size={18} /></button>
                <button onClick={() => moveSectionDown(secIdx)} style={iconButton} title="Move down"><MoveDown size={18} /></button>
                <button onClick={() => removeSection(section.id)} style={iconButtonDanger} title="Remove section"><Trash2 size={18} /></button>
              </div>
            </div>

            {/* Questions inside section */}
            <div style={{ marginTop: "24px" }}>
              <div style={sectionSubHeader}>
                <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#111827" }}>Questions</h4>
                <button onClick={() => addQuestion(section.id)} style={addButtonSmall}>
                  <Plus size={16} /> Add Question
                </button>
              </div>
              {section.questions.length === 0 ? (
                <div style={emptyStateSmall}>
                  <FileQuestion size={40} style={{ color: "#d1d5db" }} />
                  <p style={{ margin: "12px 0 0 0", color: "#6b7280", fontSize: "15px" }}>No questions in this section</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {section.questions.map((q, qIdx) => (
                    <div key={q.id} style={questionCard}>
                      <div style={questionNumber}>{qIdx + 1}</div>
                      <div style={{ flex: 1 }}>
                        <textarea placeholder="Question text" value={q.questionText} onChange={e => updateQuestion(section.id, q.id, "questionText", e.target.value)} rows={2} style={textAreaStyle} />

                        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "14px" }}>
                          <select value={q.type} onChange={e => updateQuestion(section.id, q.id, "type", e.target.value)} style={selectStyle}>
                            {questionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                          <input type="number" step="0.5" placeholder="Marks" value={q.points} onChange={e => updateQuestion(section.id, q.id, "points", parseFloat(e.target.value))} style={smallInputStyle} />
                        </div>

                        {/* Options for MCQ types */}
                        {(q.type === "MCQ" || q.type === "MCQ_IMAGE") && (
                          <input type="text" placeholder="Options (comma separated)" value={q.options} onChange={e => updateQuestion(section.id, q.id, "options", e.target.value)} style={inputStyle} />
                        )}

                        {/* 🔥 CORRECT ANSWER FIELD - Optional (can be left empty for manual grading) */}
                        {q.type !== "DRAW_IMAGE" && q.type !== "IMAGE_DESCRIPTION" && (
                          <div>
                            <input
                              type="text"
                              placeholder="Correct Answer (optional – leave empty for manual grading)"
                              value={q.correctAnswer}
                              onChange={e => updateQuestion(section.id, q.id, "correctAnswer", e.target.value)}
                              style={inputStyle}
                            />
                            <p style={{ fontSize: "11px", color: "#f59e0b", marginTop: "-8px", marginBottom: "8px" }}>
                              💡 If provided, this question will be auto‑graded. Leave empty to grade manually.
                            </p>
                          </div>
                        )}

                        {/* Image upload for MCQ_IMAGE, DRAW_IMAGE, IMAGE_DESCRIPTION */}
                        {(q.type === "MCQ_IMAGE" || q.type === "DRAW_IMAGE" || q.type === "IMAGE_DESCRIPTION") && (
                          <div style={{ marginTop: "10px" }}>
                            <label style={uploadButtonSmall}>
                              <Upload size={16} /> {q.mediaUrl ? "Change Image" : "Upload Reference Image"}
                              <input type="file" accept="image/*" onChange={e => handleImageUpload(section.id, q.id, e.target.files[0])} style={{ display: "none" }} />
                            </label>
                            {q.mediaUrl && <img src={q.mediaUrl} alt="preview" style={{ width: "80px", marginLeft: "14px", borderRadius: "10px", border: "1px solid #d1d5db" }} />}
                          </div>
                        )}

                        {/* Info messages */}
                        {q.type === "DRAW_IMAGE" && <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px", margin: 0 }}>User will upload a drawing. (Manual grading)</p>}
                        {q.type === "IMAGE_DESCRIPTION" && <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px", margin: 0 }}>Student will describe the image. (Manual grading)</p>}
                        {q.correctAnswer && q.correctAnswer.trim() !== "" && (q.type === "TEXT" || q.type === "NUMERICAL" || q.type === "FILL_BLANKS") && (
                          <p style={{ fontSize: "12px", color: "#10b981", marginTop: "4px", margin: 0 }}>✓ Auto‑graded using provided answer</p>
                        )}
                        {(!q.correctAnswer || q.correctAnswer.trim() === "") && (q.type === "TEXT" || q.type === "NUMERICAL" || q.type === "FILL_BLANKS") && (
                          <p style={{ fontSize: "12px", color: "#f59e0b", marginTop: "4px", margin: 0 }}>⚠️ Manual grading required (no correct answer provided)</p>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <button onClick={() => moveQuestionUp(section.id, qIdx)} style={iconButtonSmall}><MoveUp size={16} /></button>
                        <button onClick={() => moveQuestionDown(section.id, qIdx, section.questions.length)} style={iconButtonSmall}><MoveDown size={16} /></button>
                        <button onClick={() => removeQuestion(section.id, q.id)} style={iconButtonDangerSmall}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Section Button */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <button onClick={addSection} style={addSectionButton}>
            <Plus size={20} /> Add Section
          </button>
        </div>

        {/* Action Buttons */}
        <div style={actionButtons}>
          <button onClick={() => navigate("/admin/dashboard")} style={cancelButton}>Cancel</button>
          <button onClick={submit} disabled={loading} style={submitButton(loading)}>
            <Save size={20} /> {loading ? "Creating..." : "Create Test"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles (unchanged)
const headerStyle = { background: "white", padding: "32px 36px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" };
const backButtonStyle = { padding: "14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "14px", cursor: "pointer", transition: "all 0.2s ease" };
const pageTitle = { fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0", color: "#111827", letterSpacing: "-0.025em" };
const pageSubtitle = { margin: 0, color: "#6b7280", fontSize: "15px" };
const questionCountBadge = { padding: "14px 24px", background: "#dbeafe", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #93c5fd" };
const cardStyle = { background: "white", padding: "36px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" };
const labelStyle = { display: "block", fontWeight: "600", marginBottom: "14px", color: "#111827", fontSize: "14px" };
const inputLargeStyle = { width: "100%", padding: "18px 20px", border: "1px solid #d1d5db", borderRadius: "14px", fontSize: "16px", transition: "all 0.2s ease", outline: "none", boxSizing: "border-box" };
const sectionCardStyle = { background: "white", padding: "28px", borderRadius: "24px", marginBottom: "32px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" };
const sectionHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" };
const sectionNumber = { width: "40px", height: "40px", background: "#2563eb", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "600", fontSize: "16px" };
const sectionTitleInput = { flex: 1, padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "16px", fontWeight: "500", transition: "all 0.2s ease", outline: "none" };
const sectionSubHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" };
const addButtonSmall = { padding: "10px 20px", background: "#059669", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", transition: "all 0.2s ease" };
const emptyStateSmall = { textAlign: "center", padding: "48px 24px", background: "#f9fafb", borderRadius: "16px", border: "2px dashed #d1d5db" };
const questionCard = { padding: "24px", background: "#f9fafb", borderRadius: "18px", border: "1px solid #e5e7eb", display: "flex", gap: "20px", alignItems: "flex-start" };
const questionNumber = { width: "44px", height: "44px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", flexShrink: 0, fontSize: "16px", boxShadow: "0 4px 6px -1px rgba(37,99,235,0.3)" };
const textAreaStyle = { width: "100%", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: "10px", marginBottom: "14px", fontSize: "14px", transition: "all 0.2s ease", outline: "none", fontFamily: "inherit", resize: "vertical" };
const selectStyle = { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", transition: "all 0.2s ease", outline: "none" };
const smallInputStyle = { width: "90px", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", transition: "all 0.2s ease", outline: "none" };
const inputStyle = { width: "100%", padding: "10px 14px", marginBottom: "10px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", transition: "all 0.2s ease", outline: "none", boxSizing: "border-box" };
const uploadButtonSmall = { display: "inline-flex", alignItems: "center", gap: "8px", background: "#e5e7eb", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", border: "1px solid #d1d5db", transition: "all 0.2s ease" };
const iconButton = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", cursor: "pointer", padding: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" };
const iconButtonDanger = { background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", padding: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#dc2626", transition: "all 0.2s ease" };
const iconButtonSmall = { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" };
const iconButtonDangerSmall = { background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#dc2626", transition: "all 0.2s ease" };
const addSectionButton = { padding: "14px 32px", background: "#2563eb", color: "white", border: "none", borderRadius: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", fontWeight: "600", fontSize: "15px", transition: "all 0.2s ease", boxShadow: "0 4px 6px -1px rgba(37,99,235,0.2)" };
const actionButtons = { display: "flex", gap: "20px", justifyContent: "center" };
const cancelButton = { padding: "18px 40px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "14px", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "all 0.2s ease" };
const submitButton = (loading) => ({ padding: "18px 48px", background: loading ? "#9ca3af" : "#2563eb", color: "white", border: "none", borderRadius: "14px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s ease", boxShadow: loading ? "none" : "0 4px 6px -1px rgba(37,99,235,0.2)" });

export default CreateTest;