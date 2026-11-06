import { useState, useEffect } from 'react';
import type { Lanzamiento, RespuestaAPI } from '../types/api.ts';

export function ListaLanzamientos() {
  // Tipamos explícitamente los estados
  const [lanzamientos, setLanzamientos] = useState<Lanzamiento[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Controller para cancelar la petición si el componente se desmontea
    const controller = new AbortController();

    const obtenerDatos = async () => {
      try {
        setCargando(true);
        setError(null);

        const respuesta = await fetch(
          'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=5',
          { signal: controller.signal }
        );

        if (!respuesta.ok) {
          throw new Error(`Error en la petición: ${respuesta.status} ${respuesta.statusText}`);
        }

        // Tipamos la conversión de JSON
        const data: RespuestaAPI = await respuesta.json();
        setLanzamientos(data.results);
      } catch (err: unknown) {
        // Ignoramos el error si fue causado por la cancelación explícita (AbortController)
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();

    // 2. Función de limpieza (Clean-up function)
    return () => {
        controller.abort();
        };
    }, []); // [] asegura que solo se ejecute una vez al montar el componente

    // Renderizado condicional según el estado actual
    if (cargando) {
        return <p style={{ color: '#007acc' }}>Cargando datos de lanzamientos...</p>;
    }

    if (error) {
        return (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
            <p><strong>Ocurrió un error:</strong> {error}</p>
        </div>
        );
    }

    return (
        <div>
        <h2>Próximos Lanzamientos Espaciales</h2>
        <ul>
            {lanzamientos.map((item) => (
            <li key={item.id} style={{ marginBottom: '12px' }}>
                <strong>{item.name}</strong>
                <br />
                <small>Fecha: {new Date(item.net).toLocaleString()}</small>
                <br />
                <span>Estado: {item.status.name}</span>
            </li>
            ))}
        </ul>
        </div>
    );
}