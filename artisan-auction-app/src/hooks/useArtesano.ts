import { useCallback, useEffect, useRef, useState } from 'react';
import { Artesano } from '../tipos/Artesano';
import { ArtesanoRepositorio } from '../repositorios/ArtesanoRepositorio';

export function useArtesano(id: number) {
  const [artesano, setArtesano] = useState<Artesano | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const montadoRef = useRef(true);

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const datos = await ArtesanoRepositorio.obtenerArtesanoPorId(id);

      if (montadoRef.current) {
        setArtesano(datos);
      }
    } catch (err) {
      if (montadoRef.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar el artesano');
      }
    } finally {
      if (montadoRef.current) {
        setCargando(false);
      }
    }
  }, [id]);

  useEffect(() => {
    montadoRef.current = true;

    cargar();

    return () => {
      montadoRef.current = false;
    };
  }, [cargar]);

  const recargar = useCallback(() => cargar(), [cargar]);

  return {
    artesano,
    cargando,
    error,
    recargar
  };
}
