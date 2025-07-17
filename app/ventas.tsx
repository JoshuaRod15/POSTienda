
import SearchBar from "@/components/ui/Searchbar";
import Productos from "@/components/ui/productos";
import { useProductsStore } from "@/store/productStore";
import { useTicketStore } from "@/store/ticketStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
interface Producto {
    id: number
    image?: string
    name: string
    SKU: number
    saleType: string
    price: number
    inventory?: number
    userId?: number
}

function searchBar(value: string, lista:Producto[]){
    if(!value) return lista
    const products = lista.filter((producto) => producto.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
    return products
}



export default function Ventas() {
    const products = useProductsStore(state => state.products)
    const [search, setSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const router = useRouter();
    const {ticket, addProduct} = useTicketStore();
    const {scannData} = useLocalSearchParams()
    const [modalVisible, setModalVisible] = useState(false);
    const isSuelto = (product: Producto) => product.saleType.includes("LOOSE");
    const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
    const [amountInput, setAmountInput] = useState('');
    const [showAmountModal, setShowAmountModal] = useState(false);


    useEffect(() => {
        if(scannData){
            const producto = products.filter((item) => item.SKU && item.SKU.toString() === scannData.toString());
            if(producto.length<1){
                Alert.alert('Producto no encontrado')
                return
            }
            addProduct(producto[0])
        }
    },[scannData, addProduct, products])
    const handleSearch = (text: string) => {
        setSearch(text)
        const filtered = searchBar(text, products);
        setFilteredProducts(filtered);
    }
    return(
        <>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={() => setModalVisible(true)} style={{ 
                alignItems: 'flex-start', 
                justifyContent: 'center', 
                backgroundColor: '#4462FB', 
                borderRadius: 8, 
                width: 30,
                height: 30, }}>
                <Text style={{ 
                    fontSize: 24, 
                    width: '100%',
                    textAlign: 'center'
                    }}>☰</Text>
              </TouchableOpacity>
            ),
          }}
        />
    <View style = {styles.main}>
        <TouchableOpacity style = {styles.payButton} onPress={() => {
            if(ticket.total === 0) return
            router.push('/payTicket')}}>
            <Text style = {styles.totalText}>{`Cobrar: $${ticket.total}`}</Text>
        </TouchableOpacity>

        <View style ={styles.productsView}>
            <View style={styles.searchBarView}>
                <Text style={styles.productListTitle}>
                    TODOS LOS ARTICULOS
                </Text>
                <SearchBar value={search} onChangeText={handleSearch} />
            </View>
            <FlatList 
                style = {styles.productsList}
                numColumns={3}
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Productos
                      {...item}
                      onPress={() => {
                        if (isSuelto(item)) {
                          setSelectedProduct(item);
                          setShowAmountModal(true);
                        } else {
                          addProduct(item);
                        }
                      }}
                    />
                  )}
                  
                removeClippedSubviews = {true}
                initialNumToRender={15}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>

        <View style = {styles.footerView}>

            <TouchableOpacity style = {ticket.products.length > 0 ? styles.ticketButton : styles.noTicketButton} onPress={() => router.push('/ticket')}>
                <Image source={require('../assets/icons/ticket.png')} style={styles.ticketImage} resizeMode="cover"/>
            </TouchableOpacity>

            <TouchableOpacity style={ticket.products.length > 0 ? styles.scannerViewLittle :styles.scannerView}
                onPress={()=>router.replace({
                    pathname: '/escaner',
                    params: {returnTo: '/ventas'}
                })}
            >
                <Text style={ ticket.products.length > 0 ? styles.scannerTextLittle : styles.scannerText}>Escanear Producto</Text>
                <View style = { ticket.products.length > 0 ? styles.cameraViewLittle : styles.cameraView}>
                    <Image source={require('../assets/icons/cameraIcon.webp')} style = {styles.cameraImage} resizeMode="cover"/>
                </View> 
            </TouchableOpacity>

            
        </View>
        
    </View>

    <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
        >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.overlay}>
            <TouchableWithoutFeedback>
                <View style={styles.modalWrapper}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Menú</Text>

                    <TouchableOpacity onPress={() => {
                        setModalVisible(false)
                        router.push('/nuevoProducto')}}>
                    <Text style={styles.modalItem}>Agregar producto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Text style={styles.modalItem}>Ver tickets</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalItem}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
        </Modal>
        
        {showAmountModal && selectedProduct && (
        <Modal transparent visible={showAmountModal} animationType="slide">
            <TouchableWithoutFeedback onPress={() => setShowAmountModal(false)}>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback>
                <View style={styles.amountModal}>
                    <Text style={styles.modalTitle}>
                    ¿Cuánto en pesos de {selectedProduct.name}?
                    </Text>
                    <Text style={{ marginBottom: 5 }}>Precio por kilo: ${selectedProduct.price}</Text>
                    <TextInput
                    placeholder="Ej: 20"
                    keyboardType="decimal-pad"
                    style={styles.modalInput}
                    value={amountInput}
                    onChangeText={setAmountInput}
                    />
                    <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                        const monto = parseFloat(amountInput);
                        if (!isNaN(monto) && monto > 0) {
                        const qty = monto / selectedProduct.price;
                        addProduct(selectedProduct, qty);
                        setShowAmountModal(false);
                        setAmountInput('');
                        setSelectedProduct(null);
                        } else {
                        alert('Ingresa un monto válido');
                        }
                    }}
                    >
                    <Text style={{ color: '#fff' }}>Agregar</Text>
                    </TouchableOpacity>
                </View>
                </TouchableWithoutFeedback>
            </View>
            </TouchableWithoutFeedback>
        </Modal>
        )}

    </>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingTop: 30
    },
    payButton: {
        width: 272,
        height: 58,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4462FB',
        borderRadius: 10,
    },
    totalText: {
        fontFamily: '',
        fontSize: 24,
    },
    productsView: {
        width: '100%',
        height: '70%',
        marginTop: 35,
        marginLeft: 1,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    searchBarView: {
        width: '100%',
        height: 60,
        padding: 0,
        margin: 0,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    productListTitle: {
        width: '40%',
        height: '40%',
        fontSize: 13,
        fontWeight: '700'
    },
    searchBar: {
        backgroundColor: '#fff',
        width: '55%',
        height: '60%',
        borderRadius: 10,
        borderColor: '#C9C9C9',
        borderWidth: 3,
        padding: 3
    },
    productsList: {
        margin: 0,
        padding: 0,
        width: '100%',
        height:144,
    },
    footerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%'
    },
    scannerView:{
        flexDirection: 'row',
        width: 358,
        height: 54,
        marginTop: 30, 
        backgroundColor: '#4462FB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingLeft: 40
    },
    scannerViewLittle:{
        flexDirection: 'row',
        width: 235,
        height: 54,
        marginTop: 30, 
        backgroundColor: '#4462FB',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
        paddingLeft: 40,
    },
    scannerText: {
        fontSize: 24
    },
    scannerTextLittle: {
        fontSize: 16,
    },
    cameraView: {
        width: "20%",
        height: "100%",
        padding: 0,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cameraViewLittle: {
        width: "30%",
        height: "100%",
        padding: 0,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cameraImage: {
        width: "30%",
        height: "30%",
    },
    ticketButton: {
        width: 62,
        height: 54,
        backgroundColor: '#4462FB',
        borderRadius: 24,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noTicketButton: {
        display: 'none'
    },
    ticketImage: {
        width: '70%',
        height: '70%'
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: '15%'
      },
      modalWrapper: {
        width: '60%',
        height: '90%',
        marginTop: '5%',
        marginLeft: '5%', 
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignItems: 'center'
      },
      modalContent: {
        width: '80%',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
      },
      modalItem: {
        fontSize: 16,
        paddingVertical: 10,
        textAlign: 'center',
      },
      amountModal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginHorizontal: 30,
        marginTop: '50%',
        alignItems: 'center'
      },
      modalInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        width: 150,
        padding: 10,
        marginBottom: 15,
        borderRadius: 8
      },
      modalButton: {
        backgroundColor: '#4462FB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8
      },
      
})