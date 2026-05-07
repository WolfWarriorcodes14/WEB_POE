import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext"; // ← add this
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTest from "./pages/CreateTest";
import StudentDashboard from "./pages/StudentDashboard";
import AttemptTest from "./pages/AttemptTest";
import TestList from "./pages/TestList";
import TestDetails from "./pages/TestDetails";
import StudentTestList from "./pages/StudentTestList";
import ResultPage from "./pages/ResultPage";
import AdminTestResults from "./pages/AdminTestResults";
import AdminResultDetails from "./pages/AdminResultDetails";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-test" element={<CreateTest />} />
          <Route path="/admin/tests" element={<TestList />} />

          {/* Admin routes for results */}
          <Route path="/admin/results/:id" element={<AdminTestResults />} />
          <Route path="/admin/result/:id" element={<AdminResultDetails />} />

          {/* Student */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/student/tests" element={<StudentTestList />} />
          <Route path="/test/:id" element={<AttemptTest />} />

          {/* Result */}
          <Route path="/result/:id" element={<ResultPage />} />

          {/* Optional */}
          <Route path="/test/:id/details" element={<TestDetails />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;