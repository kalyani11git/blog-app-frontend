import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function FullBlog() {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`https://blog-app-backend-2-xd5z.onrender.com/GetBlog/${id}`);
        const data = await response.json();
        setBlog(data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* <button
        onClick={() => navigate("/")}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        ← Back to Home
      </button> */}

      <h1 className="text-3xl font-bold mt-4 text-[#333]">{blog.title}</h1>

      <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover mt-4 rounded-lg shadow-md" />

      <div
        className="mt-6 text-gray-800 text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: blog.description }} // Renders full HTML content
      />
    </div>
  );
}
