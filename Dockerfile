FROM python:3.10-slim

WORKDIR /app

# Install system-level dependencies for OpenCV
RUN apt-get update && \
    apt-get install -y libgl1 libglib2.0-0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5555

CMD ["python", "app.py"]
