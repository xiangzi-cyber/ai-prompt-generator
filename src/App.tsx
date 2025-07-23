import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import Home from "@/pages/Home";
import Generate from "./pages/Generate";
import Models from "./pages/Models";
import Prompts from "./pages/Prompts";
import Workspace from "./pages/Workspace";
import ApiTest from "./pages/ApiTest";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/models" element={<Models />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/api-test" element={<ApiTest />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
