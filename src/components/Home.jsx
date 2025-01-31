import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10; // Show 10 blogs per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/GetBlogs");
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Function to strip HTML tags from description
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Pagination Logic
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const paginatedBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBlogs.map((blog) => {
          const plainText = stripHtmlTags(blog.description);
          const words = plainText.split(" ");
          const shortDescription = words.slice(0, 30).join(" ") + (words.length > 30 ? "..." : "");

          return (
            <div key={blog._id} className="bg-[#D4CFC1] p-4 rounded-lg shadow-md relative min-h-[350px] flex flex-col pb-12">
              <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover rounded-md" />
              <h3 className="text-lg font-semibold mt-3 text-black">{blog.title}</h3>

              {/* Blog Description with "Read More" */}
              <div className="text-sm text-gray-800 mt-2 flex-grow overflow-hidden">
                {shortDescription}{" "}
                {words.length > 30 && (
                  <button
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    className="text-blue-500 hover:underline"
                  >
                    Read More →
                  </button>
                )}
              </div>

              {/* Edit & Delete Buttons */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
                <button
                  onClick={() => navigate(`/edit/${blog._id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 rounded ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
        >
          Previous
        </button>

        {/* <span className="px-4 py-2 text-lg font-semibold">{currentPage} / {totalPages}</span> */}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-2 rounded ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
