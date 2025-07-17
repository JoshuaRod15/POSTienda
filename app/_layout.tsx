
import { syncProductsIfNeeded } from '@/utils/productSync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack, router } from "expo-router";
import { useEffect } from 'react';
export default function Layout() {


  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');

      if(token){
        await syncProductsIfNeeded(token)
        router.replace('/ventas')
      }else{
        router.replace('/')
      }
    }
    checkToken();
  },[])

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerBackVisible: false, // Oculta botón de "atrás"
        }}
      />
      <Stack.Screen
        name="escaner"
        options={{
          title: "Escanear producto",
        }}
      />
      <Stack.Screen
        name="nuevoProducto"
        options={{
          title: "Nuevo producto",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="ventas"
        options={{
          title: "Ventas",
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="payTicket"
        options={{
          title: "Pago",
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
