import { useTicketStore } from '@/store/ticketStore';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function Ticket() {
    const { ticket, increaseQty, decreaseQty, removeProduct } = useTicketStore();
    return (
      <View style={styles.main}>
        <FlatList
            style = {styles.ticketsList}
            data={ticket.products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
                <View style={styles.productMain}>
                    <View style={styles.productInfo}>
                        <Text style={styles.productQty}>
                            {`x${item.qty}`}
                        </Text>
                        <Text style={styles.productName}>
                            {item.name}
                        </Text>
                        <Text style={styles.productTotal}>
                            {`$${item.qty * item.price}`}
                        </Text>
                    </View>
                    <View style={styles.productButtons}>
                        <TouchableOpacity style={styles.quantityButtons} onPress={() => decreaseQty(item.id)}>
                            <Image style={styles.images} source={require('../assets/icons/iconoMenos.png')} resizeMode='cover'/>
                        </TouchableOpacity>
                        <Text>{item.qty}</Text>
                        <TouchableOpacity style={styles.quantityButtons} onPress={() => increaseQty(item.id)}>
                            <Image style={styles.images} source={require('../assets/icons/IconoMas.webp')} resizeMode='cover'/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.trashButton} onPress={() => removeProduct(item.id)}>
                            <Image style={styles.images} source={require('../assets/icons/trash.png')} resizeMode='cover'/>
                        </TouchableOpacity>
                    </View>
                </View>
    )}
        />
        

        <View>
            <TouchableOpacity >
                <Text>Guardar Ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Eliminar ticket</Text>
            </TouchableOpacity>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    main: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingTop: 100
    },
    ticketsList: {
        width: '100%',
        height: '70%',
    },
    productMain: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15
    },
    productInfo: {
        width: '60%',
        height: 47,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#828282',
        borderWidth: 2,
    },
    productQty: {
        width: 20
    },
    productName: {
        textAlign: 'left',
        width: 150
    }, 
    productTotal: {
        width: 40
    },
    productButtons: {
        width: '40%',
        height: 47,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    quantityButtons:{
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',

    },
    trashButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
   
    },
    images: {
        width: "80%",
        height: '100%'
    },

})