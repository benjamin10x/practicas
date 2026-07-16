import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArtesanosScreen } from '../pantallas/ArtesanosScreen';
import { ArtesanoDetalleScreen } from '../pantallas/ArtesanoDetalleScreen';

export type RootStackParamList = {
  Artesanos: undefined;
  ArtesanoDetalle: {
    artesanoId: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function NavegacionPrincipal() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Artesanos"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff'
          },
          headerTitleStyle: {
            color: '#1f2933'
          },
          headerTintColor: '#1f2933',
          contentStyle: {
            backgroundColor: '#f4f1ea'
          }
        }}
      >
        <Stack.Screen
          name="Artesanos"
          component={ArtesanosScreen}
          options={{ title: 'Artesanos' }}
        />
        <Stack.Screen
          name="ArtesanoDetalle"
          component={ArtesanoDetalleScreen}
          options={{ title: 'Detalle del artesano' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
