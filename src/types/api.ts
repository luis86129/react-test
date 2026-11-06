export interface Lanzamiento {
  id: string;
  name: string;
  net: string; // Fecha de lanzamiento en formato ISO/string
  status: {
    name: string;
    description: string;
  };
}

export interface RespuestaAPI {
  count: number;
  results: Lanzamiento[];
}