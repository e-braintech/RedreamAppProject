import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Device} from 'react-native-ble-plx';

interface BluetoothRenderItemProps {
  device: Device;
  index: number;
  connectToDevice: (device: Device) => void;
}

const BluetoothRenderItem: React.FC<BluetoothRenderItemProps> = ({
  device,
  index,
  connectToDevice,
}) => {
  return (
    <TouchableOpacity onPress={() => connectToDevice(device)}>
      <View key={index} style={{padding: 10, borderBottomWidth: 1}}>
        <Text>{device.name}</Text>
        <Text>{device.id}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BluetoothRenderItem;
