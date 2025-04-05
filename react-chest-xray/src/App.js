import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS styles

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select an image.");
      return;
    }

    if (selectedFile.type !== "image/jpeg") {
      alert("Only .jpeg images are supported.");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setLoading(true);
      setResult('');

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/predict`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setResult(response.data.diagnosis);
    } catch (error) {
      console.error(error);
      setResult('An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="form-card">
        <h1>
          <img
            src="https://img.icons8.com/ios-filled/50/hospital-room--v1.png"
            alt="hospital icon"
            style={{ width: 40, height: 40 }}
          />
          Chest X-Ray Classifier
        </h1>

        <p>Upload your .jpeg X-ray image for analysis.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/jpeg"
            onChange={handleFileChange}
          />
          <button type="submit">
            <img
              src="https://img.icons8.com/ios-filled/24/x-ray.png"
              alt="x-ray icon"
              style={{
                marginRight: '0.5rem',
                verticalAlign: 'middle',
                width: 20,
                height: 20,
              }}
            />
            Analyze X-ray
          </button>
        </form>

        {loading && <p className="loading">🔍 Analyzing...</p>}

        {result && !loading && (
          <div className={`result ${result.includes("PNEUMONIA") ? "pneumonia" : "normal"}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
