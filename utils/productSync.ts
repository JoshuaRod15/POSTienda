
import { useProductsStore } from '@/store/productStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format } from 'date-fns';

const STORAGE_KEY = 'last_product_sync';

export async function syncProductsIfNeeded(token:string){   
  const {getState} = useProductsStore;
  const products = getState().products;
  const setProducts = getState().setProducts;
  const today = format(new Date(), 'yyyy-MM-dd')
  if (!token) {
    console.log('No hay token guardado.')
    return
  }

  const lastSync = await AsyncStorage.getItem(STORAGE_KEY)
  
  if(lastSync === today && products.length > 0) {
        console.log('productos ya sincronizados hoy');
        return
    }

    try {
        const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/product`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setProducts(res.data)
        await AsyncStorage.setItem(STORAGE_KEY, today)
    } catch (error) {
        console.log('Error al sincronizar productos', error);
        
    }
}
