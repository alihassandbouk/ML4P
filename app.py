from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import mlflow
import os
from werkzeug.utils import secure_filename

# Load the ML model from MLflow
logged_model = 'runs:/75945d4bb6cc4036b152f03294e32e4f/svm_poly_model'
model = mlflow.pyfunc.load_model(logged_model)
IMG_SIZE = 128

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configurations
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # Max upload: 10MB
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def preprocess_image(file_path):
    img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    flat = img.flatten().reshape(1, -1)
    return flat

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        image_data = preprocess_image(filepath)
        prediction = model.predict(image_data)[0]
        label = 'PNEUMONIA' if prediction == 1 else 'NORMAL'
        return jsonify({'diagnosis': label})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Cleanup uploaded file after processing
        if os.path.exists(filepath):
            os.remove(filepath)

if __name__ == '__main__':
    app.run(debug=True, port=5555)
