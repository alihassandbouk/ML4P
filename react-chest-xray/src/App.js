import React, { useState } from 'react';
import axios from 'axios';

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

      const response = await axios.post('http://127.0.0.1:5555/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.diagnosis);

    } catch (error) {
      console.error(error);
      setResult('An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  const mainContainerStyle = {
    width: '100%',
    minHeight: '100vh',
    backgroundImage: `url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1189&q=80")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem'
  };

  const formContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
  };

  const headingStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  };

  const iconStyle = {
    width: '40px',
    height: '40px'
  };

  return (
    <div style={mainContainerStyle}>
      <div style={formContainerStyle}>
        <h1 style={headingStyle}>
          <img 
            src="https://img.icons8.com/ios-filled/50/hospital-room--v1.png" 
            alt="hospital icon" 
            style={iconStyle} 
          />
          Chest X-Ray Classifier
        </h1>

        <p style={{ marginBottom: '1rem' }}>
          Upload your .jpeg X-ray image for analysis.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/jpeg"
            onChange={handleFileChange}
            style={{ margin: '1rem 0' }}
          />
          <br />
          <button 
            type="submit" 
            style={{
              padding: '0.6rem 1.2rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#276ef1',
              color: '#fff',
              fontSize: '1rem'
            }}
          >
            <img 
              src="https://img.icons8.com/ios-filled/24/x-ray.png" 
              alt="x-ray icon" 
              style={{ marginRight: '0.5rem', width: '20px', height: '20px', verticalAlign: 'middle' }}
            />
            Analyze X-ray
          </button>
        </form>

        {loading && (
          <div style={{ margin: '1rem 0' }}>
            <p style={{ color: '#666' }}>
              <img 
                src="https://img.icons8.com/ios-filled/24/stethoscope.png" 
                alt="stethoscope icon" 
                style={{ marginRight: '0.5rem', width: '20px', height: '20px', verticalAlign: 'middle' }}
              />
              Analyzing...
            </p>
          </div>
        )}

        {result && !loading && (
          <div style={{ margin: '1rem 0' }}>
            <h3>Result:</h3>
            <p style={{ fontSize: '1.2rem', color: result.includes("PNEUMONIA") ? 'red' : 'green' }}>
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
