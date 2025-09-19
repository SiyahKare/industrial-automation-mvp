
FROM python:3.11-slim
WORKDIR /app
COPY tools/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY tools/seed_nodeids.py ./seed_nodeids.py
COPY collector/config.yaml ./collector_config.yaml
ENV DATABASE_URL=postgresql://tsdb:tsdb@tsdb:5432/tsdb
CMD ["python", "seed_nodeids.py"]
