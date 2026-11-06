import { useState, useEffect } from 'react';

interface Lanzamiento {
  id: string;
  name: string;
  status: {
    name: string;
  };
}

interface RespuestaAPI {
  results: Lanzamiento[];
}

export function FiltroLanzamientos() {
  // Estados para los campos del formulario
  const [inputBusqueda, setInputBusqueda] = useState<string>('');
  const [limite, setLimite] = useState<number>(5);

  // Estados que realmente disparan la petición HTTP
  const [queryConfirmada, setQueryConfirmada] = useState<string>('');
  const [limiteConfirmado, setLimiteConfirmado] = useState<number>(5);

  // Estados de carga y datos
  const [lanzamientos, setLanzamientos] = useState<Lanzamiento[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Manejador del envío del formulario (Clic en botón o presionar Enter)
  const manejarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita que la página se recargue por completo
    setQueryConfirmada(inputBusqueda);
    setLimiteConfirmado(limite);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchConFiltros = async () => {
      try {
        setCargando(true);
        setError(null);

        const params = new URLSearchParams({
          limit: limiteConfirmado.toString(),
        });

        if (queryConfirmada.trim() !== '') {
          params.append('search', queryConfirmada.trim());
        }

        const url = `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?${params.toString()}`;

        const res = await fetch(url, { signal: controller.signal });

        if (res.status === 429) {
          throw new Error('Límite de peticiones alcanzado (429). Por favor espera unos segundos.');
        }

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data: RespuestaAPI = await res.json();
        setLanzamientos(data.results);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setCargando(false);
      }
    };

    fetchConFiltros();

    return () => {
      controller.abort();
    };
    // Se ejecuta al montar el componente y SOLO cuando se confirme el formulario
  }, [queryConfirmada, limiteConfirmado]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Búsqueda de Lanzamientos</h2>

      {/* El formulario captura automáticamente el Enter y el Clic en el botón type="submit" */}
      <form onSubmit={manejarSubmit} style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Texto a buscar:</label>
          <input
            type="text"
            value={inputBusqueda}
            onChange={(e) => setInputBusqueda(e.target.value)}
            placeholder="Ej: Starship, Falcon..."
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Límite:</label>
          <select value={limite} onChange={(e) => setLimite(Number(e.target.value))}>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        <button type="submit" disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* Renderizado de estado */}
      {cargando && <p>Cargando resultados de la consulta...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!cargando && !error && (
        <ul>
          {lanzamientos.length > 0 ? (
            lanzamientos.map((item) => (
              <li key={item.id} style={{ marginBottom: '8px' }}>
                <strong>{item.name}</strong> — {item.status.name}
              </li>
            ))
          ) : (
            <p>No se encontraron lanzamientos que coincidan con la búsqueda.</p>
          )}
        </ul>
      )}
    </div>
  );
}