# Roadmap

Bu belge, Industrial Automation MVP için planlanan ana başlıkları ve aşamaları özetler.

## 1) Veri Toplama ve Saklama
- [x] TimescaleDB şeması, ölçüm tabloları, aggregation fonksiyonları
- [x] Seeder ile örnek veri üretimi (5k+ örnek/sensör)
- [ ] Collector: OPC UA / Modbus canlı bağlantı (asyncua, pymodbus)
- [ ] MQTT → API/Worker tüketimi, dayanıklı kuyruk (opsiyonel: Kafka)

## 2) API Katmanı (FastAPI)
- [x] /api/sensors (list, upsert, bulk)
- [x] /api/series (time_bucket ile agregasyon)
- [x] /api/pipelines (create, get, activate)
- [x] /api/executions (start, steps, finish, run background)
- [x] /api/measurements (ham veri ve istatistik)
- [ ] AuthN/AuthZ (JWT + RBAC)
- [ ] Rate limiting ve audit log

## 3) Web Uygulaması (Next.js)
- [x] React Flow canvas, custom node’lar (sensor/constant/output)
- [x] Drag&drop palet, TagPicker (arama/filtre/çoklu)
- [x] ParamPanel (NodeSpec ile dinamik)
- [x] TimeSeriesChart (ECharts), threshold, dataZoom, WS overlay
- [x] Execution: Run + Logs + Summary (Outputs dahil)
- [ ] Template kütüphanesi (ör. enerji/su maliyeti şablonları)
- [ ] Credentials yönetimi (UI + şifreli saklama)
- [ ] Shadcn/ui ile komponent birleştirme ve temalandırma

## 4) Formül/Çalıştırma Motoru
- [x] Basit simülasyon (node’lar üzerinden log ve output üretimi)
- [ ] DAG planlayıcı, topolojik sıralama
- [ ] Operatör kütüphanesi: add, mul, avg, integrator, derivative, unit convert, tariff
- [ ] Statefull operatörler ve pencereleme (tumbling/sliding)
- [ ] Hata toleransı, yeniden başlatma, idempotent adımlar

## 5) Observability ve Güvenlik
- [ ] Structured logging ve trace (OpenTelemetry)
- [ ] Health/metrics endpoint’leri (Prometheus)
- [ ] Kullanıcı/rol yönetimi, API anahtarları

## 6) Dağıtım ve DevOps
- [x] Docker Compose (multi-arch uyumlu)
- [ ] CI/CD (build/test/lint)
- [ ] Kubernetes’e taşınma (Helm chart)

## 7) UX İyileştirmeleri
- [x] Modern ve renkli tema, gradient tasarım
- [x] Canvas arka plan ve kontrol bileşenleri
- [x] Scroll ve layout düzeltmeleri
- [ ] Erişilebilirlik (klavye, kontrast, odak göstergeleri)

Not: Bu roadmap yaşayan bir dokümandır; yeni ihtiyaçlara göre güncellenir.


