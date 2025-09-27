# 🏭 Endüstriyel Otomasyon Platformu (MVP)

**OPC UA / Modbus sensörlerinden** veri toplayıp, **TimescaleDB** üzerinde uzun vadeli saklayan,
**formül motoru** sayesinde maliyet/enerji hesapları çıkaran ve **Next.js tabanlı Web Editor** ile
görselleştiren modern bir otomasyon yazılımı.

---

## ✨ Özellikler

- **Veri Toplama**
  - OPC UA & Modbus protokollerini destekler
  - Sıcaklık, basınç, debi, akım, ağırlık vb. sensörlerden veri toplama
  - 1 Hz hızında 1000+ sinyal destekler

- **Veri Saklama**
  - TimescaleDB üzerinde 5 yıla kadar ham veri saklama
  - Otomatik sıkıştırma ve downsampling (1dk/5dk/1saat özetler)
  - Grafana entegrasyonu ile anlık trend ve geçmiş veri sorgusu

- **Formül Motoru**
  - Görsel canvas üzerinde sensör + sabit + operatör düğümleri
  - Elektrik tüketimi (kW→kWh→TRY), su tüketimi (m³→TRY) gibi hesaplamalar
  - `add`, `mul`, `avg`, `integrator`, `derivative`, `tarife` gibi operatörler
  - Alarm ve eşik değer tanımları

- **Panel (Flutter Web + Mobil)**
  - Sürükle-bırak canvas ile formül oluşturma
  - Sensör özelliklerini düzenleme (tarife, katsayı, birim)
  - Gerçek zamanlı sonuç (OUT) takibi
  - Mobil ve web üzerinden erişim

---

## 📂 Proje Yapısı (Monorepo)

```
industrial-automation-mvp/
├─ api/              # FastAPI servis (formül motoru, WS, REST API)
├─ collector/        # OPC UA/Modbus veri toplayıcı (şu an simülasyon)
├─ db/               # TimescaleDB şema dosyaları
├─ infra/            # Mosquitto (MQTT) ayarları
├─ tools/            # Seeder (NodeId haritasından 1000 sample ekler)
├─ apps/
│  ├─ web/           # Next.js + React Flow Editor (güncel)
│  └─ mobile/        # ⏳ Expo/React Native (gelecek)
├─ packages/
│  ├─ graph/         # Graph/Node/Edge tipleri (zod)
│  └─ sdk/           # Paylaşılan TS API/WS istemcisi
├─ ui/               # Flutter paneli (eski, arşiv)
└─ docker-compose.yml
```

---

## 🚀 Hızlı Başlangıç

### 1. Altyapıyı başlat
```bash
docker compose up -d --build
```

Servisler:

* **TimescaleDB** → `localhost:5433` (user/pass: tsdb/tsdb, db: tsdb)
* **Grafana** → http://localhost:3000 (opsiyonel)
* **FastAPI** → http://localhost:8000
* **Web (Next.js)** → http://localhost:3001

### 2. Sensörleri ve örnek verileri ekle

```bash
docker compose run --rm seeder
```

➡️ `collector/config.yaml` içindeki sensörler `sensors` tablosuna eklenir ve her biri için **1000 sample** üretilir.

### 3. Canlı simülasyon başlat

Collector servisi 1 Hz frekansında sensör değerlerini MQTT üzerinden yayınlar.

### 4. API’yi kontrol et

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/sensors
```

### 5. Web Editor'ü çalıştır

```bash
# Web uygulamasını başlat
cd apps/web
npm install
npm run dev
```

**Web Editor**: http://localhost:3001/editor
- React Flow ile görsel editor: Sensor / Constant / Output node’ları
- Palette’ten sürükle-bırak, TagPicker ile çoklu sensör seçimi
- Sağ panelde dinamik Parametre Paneli (NodeSpec)
- Zaman serisi grafik (ECharts): auto-refresh, threshold, WS overlay
- Toolbar: Delete selected, Clear, Run Pipeline

### 6. Flutter UI (eski, arşiv)

```bash
cd ui
flutter create .
flutter pub add web_socket_channel
flutter run -d chrome
```

Ardından `ws://localhost:8000/ws/stream` adresinden canlı OUT değerini görebilirsiniz.

---

## 🔧 Konfigürasyon

### collector/config.yaml

```yaml
opcua:
  endpoint: opc.tcp://127.0.0.1:4840
  sensors:
    - tag: Area1/Temp_01
      unit: °C
      nodeId: ns=2;s=Device1.Temperature1
      type: temperature
      min: 18.0
      max: 95.0
    - tag: Area1/Press_01
      unit: bar
      nodeId: ns=2;s=Device1.Pressure1
      type: pressure
      min: 0.8
      max: 12.0
```

* **tag** → sensör ismi
* **unit** → ölçüm birimi
* **nodeId** → OPC UA NodeId
* **min/max** → değer aralığı (simülasyon için)

---

## 📊 Demo Kullanım Senaryosu

1. **Elektrik maliyeti**:

   * Sensör: `L1/Power_kW`
   * Operatör: `integrator` (kW → kWh)
   * Sabit: `TRY/kWh = 3.25`
   * Çıktı: `Elektrik_Maliyeti_TRY`

2. **Su maliyeti**:

   * Sensör: `Water/Flow_m3h`
   * Operatör: `integrator` (m³/h → m³)
   * Sabit: `TRY/m³ = 25.0`
   * Çıktı: `Su_Maliyeti_TRY`

3. **Toplam maliyet**:

   * `Elektrik_Maliyeti_TRY + Su_Maliyeti_TRY`

---

## 🛡️ Güvenlik ve Ölçeklenebilirlik

* TLS destekli OPC UA bağlantısı
* JWT tabanlı API güvenliği
* TimescaleDB → sıkıştırma + retention ile 5 yıl veri saklama
* MQTT → kolayca Kafka’ya yükseltilebilir
* Docker Compose → ileride Kubernetes’e taşınabilir

---

## 🧭 Yol Haritası

Detaylı yol haritası için `roadmap.md` dosyasına bakınız.

---

## 📜 Lisans

🄯 2025 — Bu proje Onur Mutlu ve ekibi tarafından geliştirilmiştir.
Ticari kullanım için lisanslama yapılabilir.


# Industrial Automation MVP

Skeleton: Collector → MQTT → TimescaleDB → FastAPI (formula + WS) → Flutter UI.

## Quick start
```bash
docker compose up -d --build
curl http://localhost:8000/health
```

See `ui/README.md` for Flutter notes.
