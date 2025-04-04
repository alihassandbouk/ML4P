from flask import Flask, request, jsonify
import numpy as np
import cv2
import mlflow
import os
from werkzeug.utils import secure_filename
import mlflow

import os
#os.environ["DAGSHUB_TOKEN"] = "ffa6c3377e5daa8d590ce434ab95c3d1153c296f"


logged_model = 'runs:/75945d4bb6cc4036b152f03294e32e4f/svm_poly_model'

# Load model as a PyFuncModel.
model = mlflow.pyfunc.load_model(logged_model)
IMG_SIZE = 128


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
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

if __name__ == '__main__':
    app.run(debug=True, port=5555)
