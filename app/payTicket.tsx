import { useTicketStore } from '@/store/ticketStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Alert, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

const generateSmartSuggestions = (total: number): number[] => {
    const denominations = [ 2, 5, 10, 20, 50, 100, 200, 500]
    const suggestions =  new Set<number>()
    const minDiff = 1;
    for (const d of denominations) {
        const rounded = Math.ceil(total / d) * d
        if(rounded - total >= minDiff){
            suggestions.add(rounded)
        }
    }

    for(const d of denominations) {
        if(d > total)suggestions.add(d)
    }

    return Array.from(suggestions).sort((a, b) => a - b)
  }

export default function PayTicket() {
    const router = useRouter()
    const {ticket, clearTicket} = useTicketStore()
    const totalString = ticket.total.toString()
    const [recivedCash, setRecivedCash] = useState(totalString)
    const  suggestions =  useMemo(() => {
        const all = generateSmartSuggestions(ticket.total)
        return all.slice(0, 4)
    }, [ticket.total])
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const closeModal = () => {
        setModalVisible(false);
      };

    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.main}>
        <View style={styles.totalView}>
            <Text style={styles.totalAmount}>{`$${ticket.total}`}</Text>
            <Text style={styles.totalText}>Cantidad a pagar</Text>
        </View>

        <View style={styles.suggestionView}>
            <Text style={styles.suggestionTitle}>Efectivo recibido</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, backgroundColor: '#ECECEC', borderBottomColor: '#4462FB', borderBottomWidth: 3 }}>
            <Text style={styles.dollar}>$</Text>
            <TextInput 
                value={recivedCash}
                onChangeText={setRecivedCash}
                keyboardType='numeric'
                style={[styles.recivedCashInput, {flex: 1}]}
            />
            </View>
            <View style={styles.suggestionsPayView}>
                {suggestions.map((amount, index) => (
                    <TouchableOpacity
                        style={styles.suggestionsPay}
                        key={index}
                        onPress={() => setRecivedCash(amount.toString())}
                    >
                        <Text style={styles.suggestionsText}>{`$${amount}`}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        <View style={styles.payMethodsView}>
        <TouchableOpacity
            style={styles.cardMethodButton}
            disabled={loading}
            onPress={async () => {
                if (loading) return
                setLoading(true)
                try {
                const token = await AsyncStorage.getItem('token')
                const newTicket = { ...ticket, payType: 'CARD', state: 'PAID' }

                const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/ticket`, newTicket, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                })

                if (res.status === 201) {
                    clearTicket()
                    Alert.alert('Hecho')
                    router.replace('/ventas')
                }
                } catch (error) {
                console.log(error)
                Alert.alert('Error al crear el ticket')
                } finally {
                setLoading(false)
                }
            }}
            >
            <Text style={styles.suggestionsText}>{loading ? 'Cargando...' : 'Pago con tarjeta'}</Text>
        </TouchableOpacity>

            <TouchableOpacity style={styles.cashMethodButton} onPress={() => {
                if(Number(recivedCash) < ticket.total) {
                    Alert.alert('El dinero recibido es menor al importe') 
                    return
                }
                const cambio = Number(recivedCash) - ticket.total;
                ticket.recivedCash = Number(recivedCash)
                ticket.returnedCash = cambio
                setModalVisible(true)
            }}>
                <Text style={styles.suggestionsText}>Pagar</Text>
            </TouchableOpacity>
        </View>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
            >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>{`El cambio es $${ticket.returnedCash}`}</Text>
                <TouchableOpacity
                    style={styles.modalButton}
                    disabled={loading}
                    onPress={async () => {
                        if (loading) return
                        setLoading(true)
                        closeModal()
                        try {
                        const token = await AsyncStorage.getItem('token')
                        const newTicket = { ...ticket, state: 'PAID' }
                        const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/ticket`, newTicket, {
                            headers: {
                            Authorization: `Bearer ${token}`,
                            },
                        })

                        if (res.status === 201) {
                            clearTicket()
                            Alert.alert('Hecho')
                            router.replace('/ventas')
                        }
                        } catch (error) {
                        console.log(error)
                        Alert.alert('Error al crear el ticket')
                        } finally {
                        setLoading(false)
                        }
                    }}
                    >
                    <Text style={styles.suggestionsText}>{loading ? 'Cargando...' : 'De acuerdo'}</Text>
                </TouchableOpacity>

            </View>
            </View>
        </Modal>
      </View>
      </TouchableWithoutFeedback>
    )
  
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#FFF',
        flex: 1,
        alignItems: 'center'
    },
    totalView: {
        paddingTop: '10%',
        width: '80%',
        alignItems: 'center'
    },
    totalAmount:{
        fontSize: 50,
        fontWeight: 'bold'
    },
    totalText: {
        fontSize: 20
    },
    suggestionView: {
        paddingTop: '15%',
        width: '90%'
    },
    suggestionTitle: {
        fontSize: 20
    },
    recivedCashInput: {
        fontSize: 20,
        backgroundColor: '#ECECEC',
        height: 35,
    },
    suggestionsPayView: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    suggestionsPay: {
        backgroundColor: '#4462FB',
        width: '19%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        borderRadius: 50
    },
    suggestionsText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    payMethodsView: {
        marginTop: '60%',
        width: '90%',
        alignItems: 'center'
    },
    cardMethodButton: {
        width: '90%',
        height: 50,
        borderColor: '#4462FB',
        borderWidth: 3,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cashMethodButton: {
        marginTop: 20,
        width: '90%',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4462FB'
    },
    dollar: {
        fontSize: 20,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 3
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        width: '70%',
        height: '20%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        justifyContent: 'space-around',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      modalText: {
        fontSize: 25,
        marginBottom: 15,
        textAlign: "center"
      },
      modalButton: {
        width: '80%',
        height: 50,
        backgroundColor: '#4462FB',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }
})