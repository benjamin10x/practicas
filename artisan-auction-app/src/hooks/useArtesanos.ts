import { useCallback, useEffect, useRef, useState } from 'react';
import { Artesano } from '../tipos/Artesano';
import { ArtesanoRepositorio } from '../repositorios/ArtesanoRepositorio';

export function useArtesanos() {
  const [artesanos, setArtesanos] = useState<Artesano[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const montadoRef = useRef(true);

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const datos = await ArtesanoRepositorio.obtenerArtesanos();

      if (montadoRef.current) {
        setArtesanos(datos);
      }
    } catch (err) {
      if (montadoRef.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar artesanos');
      }
    } finally {
      if (montadoRef.current) {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    montadoRef.current = true;

    cargar();

    return () => {
      montadoRef.current = false;
    };
  }, [cargar]);

  const recargar = useCallback(() => cargar(), [cargar]);

  return {
    artesanos,
    cargando,
    error,
    recargar
  };
}
