import React from 'react';
import {Text, View} from 'react-native';
import {Device} from 'react-native-ble-plx';

interface BluetoothRenderItemProps {
  device: Device;
  index: number;
}

const BluetoothRenderItem: React.FC<BluetoothRenderItemProps> = ({
  device,
  index,
}) => {
  return (
    <View key={index} style={{padding: 10, borderBottomWidth: 1}}>
      <Text>{device.name}</Text>
      <Text>{device.id}</Text>
    </View>
  );
};

export default BluetoothRenderItem;
