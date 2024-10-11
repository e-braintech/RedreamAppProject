/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import DetailDeviceScreen from './src/screens/DetailDeviceScreen';
import ScanDeviceScreen from './src/screens/ScanDeviceScreen';

const Stack = createStackNavigator<ROOT_NAVIGATION>();

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

  useEffect(() => {
    requestPermissions();
  }, []);

  // View
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ScanDevice">
        <Stack.Screen
          name="ScanDevice"
          component={ScanDeviceScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailDevice"
          component={DetailDeviceScreen}
          options={{headerTitle: '', headerShadowVisible: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
