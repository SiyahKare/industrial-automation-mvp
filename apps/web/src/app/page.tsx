import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Industrial Automation MVP</h1>
      <p style={{ margin: '1rem 0' }}>React Flow Editor ile endüstriyel otomasyon</p>
      <div style={{ marginTop: '2rem' }}>
        <Link 
          href="/editor" 
          style={{ 
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          Editörü Aç
        </Link>
      </div>
    </main>
  );
}
