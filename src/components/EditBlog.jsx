import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill"; // Import ReactQuill for rich text editor
import "react-quill/dist/quill.snow.css"; // Import Quill styles

export default function EditBlog() {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Initialize description as an empty string
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // Image preview
  const [error, setError] = useState(""); // Error message for validation

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/GetBlogs`);
        const data = await response.json();
        const blog = data.blogs.find((blog) => blog._id === id);

        if (blog) {
          setTitle(blog.title);
          setDescription(blog.description || "");
          setPreview(blog.image);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  // Handle image validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload JPG, PNG, GIF, or WEBP.");
        setImage(null);
        setPreview(null);
        return;
      }

      if (file.size > maxSize) {
        setError("File size exceeds 5MB. Please upload a smaller image.");
        setImage(null);
        setPreview(null);
        return;
      }

      setError(""); // Clear error if valid
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show new image preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description); // Send description as HTML
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`http://localhost:5000/UpdateBlog/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Blog updated successfully!");
        navigate("/"); // Redirect to home after updating
      } else {
        alert("Error updating blog.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F1EEE4]">
      <div className="max-w-lg w-full p-6 bg-[#D4CFC1] rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-[#5C7285] mb-4 text-center">Edit Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-[#A7B49E] rounded focus:outline-none focus:ring-2 focus:ring-[#818C78]"
            required
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-md mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border border-[#A7B49E] rounded focus:outline-none focus:ring-2 focus:ring-[#818C78]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <ReactQuill
            placeholder="Description"
            value={description} // Controlled component
            onChange={setDescription} // Directly update description state
            className="w-full p-3 border border-[#A7B49E] rounded focus:outline-none focus:ring-2 focus:ring-[#818C78] min-h-[120px] resize-none mb-4" // Ensure a min height
            required
          />

          {/* Update button below */}
          <button
            type="submit"
            className="w-full bg-[#5C7285] text-white p-3 rounded hover:bg-[#818C78] transition font-semibold mt-4"
          >
            Update Blog
          </button>
        </form>
      </div>
    </div>
  );
}
