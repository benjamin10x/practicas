import { Artesano } from '../tipos/Artesano';

const IP_COMPUTADORA = '10.16.72.132';
const URL_BASE = `http://${IP_COMPUTADORA}:3000`;
const TIEMPO_LIMITE_MS = 8000;

async function consultarApi<T>(ruta: string): Promise<T> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS);

  try {
    const respuesta = await fetch(`${URL_BASE}${ruta}`, {
      signal: controlador.signal
    });

    if (!respuesta.ok) {
      throw new Error(`La API respondio con estado ${respuesta.status}`);
    }

    return (await respuesta.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La solicitud tardo demasiado. Verifica la conexion con la API.');
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('No fue posible comunicarse con la API.');
  } finally {
    clearTimeout(temporizador);
  }
}

export const ArtesanoRepositorio = {
  obtenerArtesanos(): Promise<Artesano[]> {
    return consultarApi<Artesano[]>('/artesanos');
  },

  obtenerArtesanoPorId(id: number): Promise<Artesano> {
    return consultarApi<Artesano>(`/artesanos/${id}`);
  }
};
