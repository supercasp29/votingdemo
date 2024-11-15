# Use official Python image as the base image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app code to the container
COPY app.py .

# Expose the Flask app's port
EXPOSE 5000

# Command to run the Flask app
CMD ["python", "app.py"]
