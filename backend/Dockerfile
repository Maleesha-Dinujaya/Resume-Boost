FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./requirements.txt

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential gcc \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

COPY . /app/backend

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
