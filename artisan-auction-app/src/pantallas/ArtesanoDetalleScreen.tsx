import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { RootStackParamList } from '../navegacion/NavegacionPrincipal';
import { useArtesano } from '../hooks/useArtesano';

type Props = NativeStackScreenProps<RootStackParamList, 'ArtesanoDetalle'>;

export function ArtesanoDetalleScreen({ route }: Props) {
  const { artesanoId } = route.params;
  const { artesano, cargando, error, recargar } = useArtesano(artesanoId);

  if (cargando && !artesano) {
    return (
      <SafeAreaView style={styles.contenedorCentrado}>
        <ActivityIndicator size="large" color="#315f72" />
        <Text style={styles.textoEstado}>Cargando detalle...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.contenedorCentrado}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.boton} onPress={recargar}>
          <Text style={styles.botonTexto}>Reintentar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!artesano) {
    return (
      <SafeAreaView style={styles.contenedorCentrado}>
        <Text style={styles.textoEstado}>No se encontro el artesano.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.panel}>
        <Text style={styles.nombre}>{artesano.nombre}</Text>
        <View style={styles.seccion}>
          <Text style={styles.etiqueta}>Especialidad</Text>
          <Text style={styles.valor}>{artesano.especialidad}</Text>
        </View>
        <View style={styles.seccion}>
          <Text style={styles.etiqueta}>Ubicacion</Text>
          <Text style={styles.valor}>{artesano.ubicacion ?? 'Ubicacion no registrada'}</Text>
        </View>
        <View style={styles.seccion}>
          <Text style={styles.etiqueta}>Descripcion</Text>
          <Text style={styles.descripcion}>
            {artesano.descripcion ?? 'Descripcion no registrada'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f4f1ea',
    padding: 16
  },
  contenedorCentrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f1ea',
    padding: 24,
    gap: 12
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ded8cd',
    padding: 20,
    gap: 18
  },
  nombre: {
    color: '#1f2933',
    fontSize: 28,
    fontWeight: '700'
  },
  seccion: {
    gap: 5
  },
  etiqueta: {
    color: '#7a4f2a',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  valor: {
    color: '#1f2933',
    fontSize: 17
  },
  descripcion: {
    color: '#364954',
    fontSize: 16,
    lineHeight: 24
  },
  textoEstado: {
    color: '#53646f',
    fontSize: 15,
    textAlign: 'center'
  },
  error: {
    color: '#9b2c2c',
    fontSize: 15,
    textAlign: 'center'
  },
  boton: {
    backgroundColor: '#315f72',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700'
  }
});
