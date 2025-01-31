import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaHome } from "react-icons/fa"; // Import icons

export default function Navbar({ onAddBlog }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    // Fetch all blogs when the component mounts
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

  useEffect(() => {
    // Filter blogs based on the search input
    if (searchTerm.trim() === "") {
      setFilteredBlogs([]);
    } else {
      const matches = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(matches);
    }
  }, [searchTerm, blogs]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectBlog = (id) => {
    navigate(`/blog/${id}`);
    setSearchTerm(""); // Clear search input after selection
    setFilteredBlogs([]); // Hide dropdown
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter" && filteredBlogs.length > 0) {
      handleSelectBlog(filteredBlogs[0]._id);
    }
  };

  return (
    <nav className="bg-[#5C7285] text-white shadow-md sticky top-0 p-4 z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
        
        {/* Blog App Title (Centered) */}
        <h1 className="text-xl font-bold">Blog App</h1>

        {/* Search Bar with Icon */}
        <div className="relative w-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blog..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleEnterPress}
              className="w-full p-2 pl-10 rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          {filteredBlogs.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white text-black shadow-md rounded mt-1 z-20 max-h-60 overflow-y-auto">
              {filteredBlogs.map((blog) => (
                <li
                  key={blog._id}
                  onClick={() => handleSelectBlog(blog._id)}
                  className="p-2 cursor-pointer hover:bg-gray-200 transition"
                >
                  {blog.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Home
        </button>

        {/* Add Blog Button */}
        <button
          onClick={onAddBlog}
          className="bg-[#D4CFC1] px-4 py-2 rounded hover:bg-[#818C78] transition text-gray-900"
        >
          Add Blog
        </button>
      </div>
    </nav>
  );
}
