import { Camera, CameraView } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Escaner() {
const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const hasScannedRef = useRef(false);
  const {returnTo} = useLocalSearchParams();

    

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      hasScannedRef.current = false;
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }: {type: string, data: string}) => {
    if(hasScannedRef.current) return;

    hasScannedRef.current = true;
    setScanned(true);
    router.replace({
        pathname: returnTo as any,
        params: { scannData: data }
      });
    
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["code128", "code39", "ean13", "ean8", "upc_a", "upc_e", "pdf417", "itf14"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});