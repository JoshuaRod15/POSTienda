
import { StyleSheet, Text, View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const saleTypes = [
  { id: 'UNIT', name: 'Se vende por unidad' },
  { id: 'LOOSE', name: 'Se vende suelto' },
];

export default function TipoVentaSelector({ value, onChange }: {
  value: string[],
  onChange: (items: string[]) => void
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de venta</Text>
      <SectionedMultiSelect
        items={saleTypes}
        uniqueKey="id"
        displayKey="name"
        onSelectedItemsChange={onChange}
        selectedItems={value}
        IconRenderer={MaterialIcons as any}
        single={false} // Cambia a `true` si solo se debe seleccionar uno
        selectText="Seleccionar tipo(s)"
        confirmText="Confirmar"
        searchPlaceholderText="Buscar tipo..."
        styles={{
          selectToggle: styles.selectToggle,
          button: {backgroundColor: '#4462FB', height: 50},
          container: {marginTop: 150, marginBottom: 150},
          item: {height: 60}
        }}
        showCancelButton
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 50,
    marginBottom: 70,
    
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  selectToggle: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#ECECEC'
  },
});

