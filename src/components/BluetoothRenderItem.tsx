import React from 'react';
import {Button, Text, View} from 'react-native';
import {Device} from 'react-native-ble-plx';

interface BluetoothRenderItemProps {
  device: Device;
  index: number;
  connectToDevice: (device: Device) => void;
  disconnectFromDevice?: (device: Device) => void;
  isConnected?: boolean;
}

const BluetoothRenderItem: React.FC<BluetoothRenderItemProps> = ({
  device,
  index,
  connectToDevice,
  disconnectFromDevice,
  isConnected,
}) => {
  return (
    <View key={index} style={{padding: 10, borderBottomWidth: 1}}>
      <Text>{device.name || 'Unnamed Device'}</Text>
      <Text>{device.id}</Text>

      {/* 연결 상태에 따라 버튼 표시 */}
      {isConnected ? (
        <Button
          title="Disconnect"
          onPress={() => disconnectFromDevice?.(device)}
        />
      ) : (
        <Button title="Connect" onPress={() => connectToDevice(device)} />
      )}
    </View>
  );
};

export default BluetoothRenderItem;
