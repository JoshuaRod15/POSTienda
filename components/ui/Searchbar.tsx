
import { TextInput } from "react-native";

export default function SearchBar({ value, onChangeText }: { value: string, onChangeText: (text: string) => void }) {
    return (
      <TextInput 
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          borderColor: '#C9C9C9',
          borderWidth: 3,
          padding: 8,
          width: '55%'
        }}
        value={value}
        placeholder="Buscar producto..."
        placeholderTextColor={'#828282'}
        onChangeText={onChangeText}
      />
    );
  }
  