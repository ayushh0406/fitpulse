import React, { useState } from "react";

const PostureCheck: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [tips, setTips] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/analyze-posture", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setFeedback(data.result);
      setTips(data.tips);
    } catch (err) {
      setFeedback("Error analyzing posture.");
      setTips("");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Exercise Posture Check</h2>
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? "Analyzing..." : "Upload & Check"}
      </button>
      {feedback && (
        <div className="mt-6">
          <p className="font-semibold">Result: {feedback}</p>
          <p className="text-gray-700">Tips: {tips}</p>
        </div>
      )}
    </div>
  );
};

export default PostureCheck;
