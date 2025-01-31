import React, { useState } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill for rich text editor
import "react-quill/dist/quill.snow.css"; // Import Quill styles

export default function BlogForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload JPG, PNG, GIF, or WEBP.");
        setImage(null);
        return;
      }

      if (file.size > maxSize) {
        setError("File size exceeds 5MB. Please upload a smaller image.");
        setImage(null);
        return;
      }

      setError("");
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select a valid image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("description", description);

    try {
      const response = await fetch("https://blog-app-backend-2-xd5z.onrender.com/AddBlog", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newBlog = {
          title,
          image: URL.createObjectURL(image),
          description,
        };
        onSubmit(newBlog);
        setTitle("");
        setImage(null);
        setDescription("");
      } else {
        alert("Error submitting form.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F1EEE4]">
      <div className="max-w-lg w-full p-6 bg-[#D4CFC1] rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-[#5C7285] mb-4 text-center">
          Add New Blog
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-[#A7B49E] rounded focus:outline-none focus:ring-2 focus:ring-[#818C78]"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border border-[#A7B49E] rounded focus:outline-none focus:ring-2 focus:ring-[#818C78]"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <ReactQuill
            value={description}
            onChange={setDescription}
            className="w-full p-3 border border-[#A7B49E] rounded focus:outline-none focus:ring-2 focus:ring-[#818C78]"
            placeholder="Write your description here..."
            required
          />
          <button
            type="submit"
            className="w-full bg-[#5C7285] text-white p-3 rounded hover:bg-[#818C78] transition font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
