/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Button, Linking, Platform, Text, View} from 'react-native';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import {BLEService} from './src/services/BLEService';

async function requestPermissions() {
  if (Platform.OS === 'ios') {
    const bluetoothPermission = await request(PERMISSIONS.IOS.BLUETOOTH);
    const locationPermission = await request(
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    );

    if (
      bluetoothPermission === RESULTS.GRANTED &&
      locationPermission === RESULTS.GRANTED
    ) {
      console.log('iOS BLE 및 위치 권한 허용됨');
    } else {
      console.log('iOS 권한 거부됨');
    }
  } else if (Platform.OS === 'android') {
    const bluetoothScan = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
    const bluetoothConnect = await request(
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    );
    const locationPermission = await request(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );

    if (
      bluetoothScan === RESULTS.GRANTED &&
      bluetoothConnect === RESULTS.GRANTED &&
      locationPermission === RESULTS.GRANTED
    ) {
      console.log('Android BLE 및 위치 권한 허용됨');
    } else {
      console.log('Android 권한 거부됨');
    }
  }
}

function App(): React.JSX.Element {
  // Logic
  const [bluetoothState, setBluetoothState] = useState<string | null>(null);

  // 블루투스 설정 페이지로 이동하는 함수
  const openBluetoothSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=Bluetooth');
    } else if (Platform.OS === 'android') {
      Linking.openSettings();
    }
  };

  useEffect(() => {
    requestPermissions();

    // 블루투스 상태 확인
    BLEService.getState()
      .then(state => {
        if (state === 'PoweredOn') {
          setBluetoothState('on');
          Toast.show({
            type: 'success',
            text1: 'Bluetooth is ON',
            text2: 'Bluetooth is currently enabled.',
          });
        } else if (state === 'PoweredOff') {
          setBluetoothState('off');
          Toast.show({
            type: 'error',
            text1: 'Bluetooth is OFF',
            text2: 'Bluetooth is currently disabled.',
          });
        } else {
          setBluetoothState(null);
        }
      })
      .catch(error => {
        console.error('Error checking Bluetooth state:', error);
        setBluetoothState('Error');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to check Bluetooth state.',
        });
      });
  }, []);

  // View
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title={
          bluetoothState === 'on'
            ? 'Go to Bluetooth Settings (Turn Off)'
            : 'Go to Bluetooth Settings (Turn On)'
        }
        onPress={openBluetoothSettings}
      />
      <Text>
        {bluetoothState === 'on' ? 'Bluetooth is ON' : 'Bluetooth is OFF'}
      </Text>
      <Toast />
    </View>
  );
}

export default App;
