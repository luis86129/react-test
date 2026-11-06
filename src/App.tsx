import { FiltroLanzamientos } from './components/FiltroLanzamientos';

export default function App() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dashboard Espacial</h1>
      <FiltroLanzamientos />
    </main>
  );
}