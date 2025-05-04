FROM python:3.11-alpine

WORKDIR /app

# Install system build dependencies (needed for pandas, sklearn, etc.)
RUN apk add --no-cache gcc musl-dev libffi-dev gfortran \
    lapack-dev blas-dev python3-dev py3-pip

# Copy files
COPY . .

# Install Python dependencies globally (no venv)
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

CMD ["python", "server.py"]