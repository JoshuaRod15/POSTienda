
import React from "react"
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
interface ProductoProps {
    img?: string
    name: string
    price: number
    onPress: ()=>void
}

  const Productos = React.memo(function Productos({ img, name, price, onPress }: ProductoProps) {
      return (
          <TouchableOpacity style={styles.main} onPress={onPress}>
              {img ? (
                  <ImageBackground
                      source={{ uri: img }}
                      resizeMode="cover"
                      imageStyle={{ borderRadius: 10 }}
                      style={styles.imageBackground}
                  >
                      <Text style={styles.name}>{name}</Text>
                      <Text style={styles.price}>{`$${price}`}</Text>
                  </ImageBackground>
              ) : (
                  <View style= {styles.noImageView}>
                      <Text style={styles.name}>{name}</Text>
                      <Text style={styles.price}>{`$${price}`}</Text>
                  </View>
              )}
          </TouchableOpacity>
      );
  });
  
export default Productos

const styles = StyleSheet.create({
    main: {
        width: '30.8%',
        height: 104,
        borderRadius: 10,
        backgroundColor: '#C9C9C9',
        justifyContent: 'center',
        margin: 5,
        overflow: 'hidden'
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      name: {
        color: 'white',
        fontWeight: '900',
        fontSize: 15,
        textAlign: 'center'
      },
      price: {
        color: 'white',
        fontWeight: '900',
        fontSize: 18,
        textAlign: 'center'
      },
      noImageView: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 10,
      }
})