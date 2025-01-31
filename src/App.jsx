import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import BlogForm from "./components/BlogForm";
import EditBlog from "./components/EditBlog";
import FullBlog from "./components/FullBlog"; // Import FullBlog component

function App() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F1EEE4] min-h-screen">
      <Navbar onAddBlog={() => navigate("/add-blog")} /> {/* Navigate to Add Blog page */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-blog" element={<BlogForm />} /> {/* Dedicated Add Blog Route */}
        <Route path="/edit/:id" element={<EditBlog />} />
        <Route path="/blog/:id" element={<FullBlog />} />
      </Routes>
    </div>
  );
}

// Wrap App with Router
export default function Main() {
  return (
    <Router>
      <App />
    </Router>
  );
}
