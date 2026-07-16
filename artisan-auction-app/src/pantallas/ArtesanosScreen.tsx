import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { RootStackParamList } from '../navegacion/NavegacionPrincipal';
import { useArtesanos } from '../hooks/useArtesanos';
import { Artesano } from '../tipos/Artesano';

type Props = NativeStackScreenProps<RootStackParamList, 'Artesanos'>;

export function ArtesanosScreen({ navigation }: Props) {
  const { artesanos, cargando, error, recargar } = useArtesanos();

  function renderizarArtesano({ item }: { item: Artesano }) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.tarjeta,
          pressed && styles.tarjetaPresionada
        ]}
        onPress={() => navigation.navigate('ArtesanoDetalle', { artesanoId: item.id })}
      >
        <View style={styles.contenidoTarjeta}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.especialidad}>{item.especialidad}</Text>
          <Text style={styles.ubicacion}>{item.ubicacion ?? 'Ubicacion no registrada'}</Text>
        </View>
        <Text style={styles.accion}>Ver detalle</Text>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Artisan Auction</Text>
        <Text style={styles.subtitulo}>Artesanos obtenidos desde PostgreSQL</Text>
      </View>

      {cargando && artesanos.length === 0 ? (
        <View style={styles.estadoCentro}>
          <ActivityIndicator size="large" color="#315f72" />
          <Text style={styles.textoEstado}>Cargando artesanos...</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.estadoCentro}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.boton} onPress={recargar}>
            <Text style={styles.botonTexto}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}

      {!error ? (
        <FlatList
          data={artesanos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderizarArtesano}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={cargando} onRefresh={recargar} tintColor="#315f72" />
          }
          ListEmptyComponent={
            !cargando ? <Text style={styles.textoEstado}>No hay artesanos registrados.</Text> : null
          }
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f4f1ea'
  },
  encabezado: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12
  },
  titulo: {
    color: '#1f2933',
    fontSize: 30,
    fontWeight: '700'
  },
  subtitulo: {
    color: '#53646f',
    fontSize: 15,
    marginTop: 6
  },
  lista: {
    padding: 16,
    paddingBottom: 28,
    gap: 12
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ded8cd',
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2
  },
  tarjetaPresionada: {
    opacity: 0.78
  },
  contenidoTarjeta: {
    gap: 4
  },
  nombre: {
    color: '#1f2933',
    fontSize: 18,
    fontWeight: '700'
  },
  especialidad: {
    color: '#315f72',
    fontSize: 15,
    fontWeight: '600'
  },
  ubicacion: {
    color: '#53646f',
    fontSize: 14
  },
  accion: {
    color: '#7a4f2a',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12
  },
  estadoCentro: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12
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
