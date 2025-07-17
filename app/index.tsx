import { syncProductsIfNeeded } from '@/utils/productSync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const handleLogin = async (userData: any) => {
  
  if(!userData.name || !userData.password){
    Alert.alert('Error', 'Porfavor complete todos los campos');
    return;
  }

  try {
    const user = {
      name: userData.name,
      password: userData.password
    }

    const token = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, user)
    return token.data.access_token
  } catch (error) {
    console.log(error);
    
  }
}

export default function HomeScreen() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();
  return(
  <View style = {styles.main}>
    <Text style={styles.mainText}>INICIA SESION</Text>
    <View style={styles.formView}>
      <View>
        <Text style={styles.inputText}>Usuario</Text>
        <TextInput style ={styles.input}
          placeholder='Usuario'
          placeholderTextColor={'#828282'}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View>
        <Text style={styles.inputText}>Contraseña</Text>
        <TextInput style={styles.input}
          placeholder='Contraseña'
          placeholderTextColor={'#828282'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>
    </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}
        onPress={async () => {
          const user = {
            name: name,
            password: password
          }

          const res:any = await handleLogin(user)

          await AsyncStorage.setItem('token', res)
          await syncProductsIfNeeded(res)
          router.replace('/ventas')
          
        }}
        >INICIAR SESION</Text>
      </TouchableOpacity>
  </View>
  )
}


const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFF',
    flex: 1,
    justifyContent: 'flex-start'
  },
  mainText:{
    fontSize: 28,
    alignItems: 'center',
    textAlign: 'center'
  },
  formView:{
    paddingTop: '40%',
    marginLeft: '8%',
  },
  inputText: {
    fontSize: 18
  },
  input: {
    width: '90%',
    height: 45,
    marginTop: 3,
    marginBottom: 20,
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 20,
    paddingLeft: 3,
    borderRadius: 5
  },
  button: {
    marginTop: '20%',
    marginLeft: '6%',
    width: 340,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#4462FB'
  },
  buttonText: {
    fontSize: 20
  }
})