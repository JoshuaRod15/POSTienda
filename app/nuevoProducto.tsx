import TipoVentaSelector from '@/components/ui/Picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface nuevoProducto {
  image: string | null,
  name: string,
  SKU: number | null,
  saleType: string[],
  price: number,
  inventory: number | null
}

const NuevoProducto = () => {
  const [name, setName] = useState('');
  const [SKU, setSKU] = useState('');
  const [saleType, setSaleType] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [inventario, setInventario] = useState('');
  const [loading, setLoading] = useState(false);
  const { scannData } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (scannData) {
      setSKU(scannData.toString());
    }
  }, [scannData]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert("Permiso denegado", "Cambia la configuracion para poder acceder a la camara");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || saleType.length === 0) {
      Alert.alert("Completa todos los campos obligatorios");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Usuario no autenticado');
        return;
      }
      const newProduct: nuevoProducto = {
        image: image || null,
        name: name.toUpperCase(),
        SKU: SKU ? Number(SKU) : null,
        saleType,
        price: Number(price),
        inventory: inventario ? Number(inventario) : null
      };

      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/product`, newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setImage(null);
      setName('');
      setSKU('');
      setPrice('');
      setSaleType([]);
      setInventario('');

      Alert.alert(`Producto creado con éxito: ${res.data.name}`);
    } catch (error:any) {
      console.log(error);
      Alert.alert(`Error al crear el producto ${error.response}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={{ flex: 1 }}>

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.main}>
          <TouchableOpacity onPress={takePhoto} style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text>Tocar para tomar foto</Text>
            )}
          </TouchableOpacity>

          <View style={styles.pickerButton}>
            <Button color={'black'} title="Galería" onPress={pickImage} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor={'#828282'}
            value={name}
            onChangeText={setName}
          />

          <View style={styles.SKUView}>
            <TextInput
              style={styles.SKUinput}
              placeholder="SKU"
              placeholderTextColor={'#828282'}
              value={SKU}
              onChangeText={setSKU}
              keyboardType='numeric'
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => router.replace({ pathname: "/escaner", params: { returnTo: '/nuevoProducto' } })}>
              <Image source={require('../assets/icons/cameraIcon.webp')} style={styles.cameraImage} />
            </TouchableOpacity>
          </View>

          <TipoVentaSelector value={saleType} onChange={setSaleType} />

          <TextInput
            style={styles.input}
            placeholder="Precio"
            placeholderTextColor={'#828282'}
            keyboardType='numeric'
            value={price}
            onChangeText={setPrice}
          />

          <TextInput
            style={styles.input}
            placeholder="Inventario"
            placeholderTextColor={'#828282'}
            keyboardType='numeric'
            value={inventario}
            onChangeText={setInventario}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.suggestionsText}>Guardar producto</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NuevoProducto;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: 10
  },
  input: {
    height: 50,
    width: 349,
    marginBottom: 40,
    backgroundColor: '#ECECEC',
    color: 'black',
    fontSize: 16,
    fontFamily: 'Koulen',
    padding: 15
  },
  SKUinput: {
    height: 50,
    width: 290,
    backgroundColor: '#ECECEC',
    color: 'black',
    fontSize: 16,
    fontFamily: 'Koulen',
    padding: 15
  },
  SKUView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    width: '88%'
  },
  cameraButton: {
    width: 36,
    height: 30,
    marginEnd: 5
  },
  cameraImage: {
    width: "100%",
    height: "100%",
  },
  imagePicker: {
    width: 180,
    height: 150,
    borderRadius: 10,
    borderColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: '#ECECEC'
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  pickerButton: {
    backgroundColor: '#4462FB',
    width: 110,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60
  },
  addButton: {
    width: 358,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#4462FB'
  },
  suggestionsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },
});
