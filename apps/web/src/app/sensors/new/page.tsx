"use client";
import { useState } from "react";

export default function NewSensor() {
  const [tag, setTag] = useState("");
  const [unit, setUnit] = useState("kW");
  const [type, setType] = useState<"opcua" | "modbus" | "sim">("opcua");
  const [nodeId, setNodeId] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setBusy(true);
    try {
      const source = type === "opcua" ? { type, nodeId } : type === "modbus" ? { type, address } : { type };
      const r = await fetch("/api/proxy/sensors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tag, unit, source }),
      });
      alert(r.ok ? "Sensor kaydedildi" : "Hata");
      if (r.ok) {
        setTag("");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="p-4 max-w-lg space-y-3">
      <h1 className="text-xl font-semibold">Yeni Sensör</h1>
      <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Plant/Area/Equip/Signal"
             className="border p-2 w-full" required />
      <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kW, m3/h, bar..."
             className="border p-2 w-full" required />
      <select value={type} onChange={(e) => setType(e.target.value as any)} className="border p-2 w-full">
        <option value="opcua">OPC UA</option>
        <option value="modbus">Modbus</option>
        <option value="sim">Sim</option>
      </select>
      {type === "opcua" && (
        <input value={nodeId} onChange={(e) => setNodeId(e.target.value)} placeholder="ns=2;s=Device.Tag"
               className="border p-2 w-full" />
      )}
      {type === "modbus" && (
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="tcp://host:port:unit:reg"
               className="border p-2 w-full" />
      )}
      <button disabled={busy} className="bg-black text-white px-4 py-2 rounded">{busy ? "Kaydediliyor..." : "Kaydet"}</button>
    </form>
  );
}




