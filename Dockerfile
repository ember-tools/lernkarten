FROM node:24-alpine AS frontend-deps
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

FROM frontend-deps AS frontend-build
ARG COMMIT=dev
ARG BUILD_TIME
ENV COMMIT=$COMMIT
ENV BUILD_TIME=$BUILD_TIME
COPY frontend/ ./
RUN npm run build

FROM python:3.14-slim AS runtime
WORKDIR /app
RUN pip install --no-cache-dir pipenv
COPY backend/Pipfile backend/Pipfile.lock ./
RUN pipenv sync --system && pip uninstall -y pipenv

FROM runtime AS production
LABEL org.opencontainers.image.title="Lernkarten" \
      org.opencontainers.image.description="Learning cards for tactical signs and dangerous goods markings" \
      org.opencontainers.image.source="https://github.com/ember-tools/lernkarten" \
      org.opencontainers.image.licenses="AGPL-3.0-or-later"
WORKDIR /app

COPY backend/src/ ./src/
COPY --from=frontend-build /app/dist ./static/

ENV LOG_FORMAT=json \
    FORWARDED_ALLOW_IPS="*"
RUN useradd --system --uid 10001 lernkarten \
 && chown -R lernkarten:lernkarten /app
USER lernkarten

EXPOSE 8000
CMD ["uvicorn", "--app-dir", "src", "main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--no-access-log"]

HEALTHCHECK --start-period=10s --interval=30s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')" || exit 1
