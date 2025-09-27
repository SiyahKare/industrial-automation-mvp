# Changelog

## 2025-09-27
- DB: pipelines/credentials/executions tabloları; execution_steps; sensor_upsert fonksiyonu.
- API: /api/pipelines, /api/series, /api/sensors, /api/measurements, /api/executions (+run, +steps, +get).
- API: bucket (timedelta) düzeltmesi; JSONB normalize.
- Web: Next.js proxy /api/proxy/*; Editor (React Flow) + TagPicker + ParamPanel + ECharts; toolbar (Delete/Clear/Run).
- Web: Palette/scroll/tema iyileştirmeleri; canvas/bağlantı görünürlüğü düzeltmeleri.
- Web: Execution Logs & Summary; Outputs JSON’un summary ve son step’e yazılması.
- Tools: seed_nodeids.py → 5000 örnek/sensör.
- Docker/Web: npm install, ESLint build dışı, multi-arch compose.
