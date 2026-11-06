// Definimos el contrato de las props que recibirá el componente
interface TarjetaProps {
  titulo: string;
  descripcion: string;
  destacado?: boolean; // Prop opcional
}

export function TarjetaInfo({ titulo, descripcion, destacado = false }: TarjetaProps) {
  return (
    <div style={{
      border: destacado ? '2px solid #007acc' : '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      margin: '10px 0',
      backgroundColor: destacado ? '#f0f8ff' : '#ffffff'
    }}>
      <h3 style={{ margin: '0 0 8px 0', color: destacado ? '#007acc' : '#333' }}>{titulo}</h3>
      <p style={{ margin: 0, color: '#555' }}>{descripcion}</p>
    </div>
  );
}