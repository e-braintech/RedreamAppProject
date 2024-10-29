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
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import DetailDeviceScreen from './src/screens/DetailDeviceScreen';
import ScanDeviceScreen from './src/screens/ScanDeviceScreen';

const Stack = createStackNavigator<ROOT_NAVIGATION>();

async function requestPermissions() {
  if (Platform.OS === 'ios') {
    // iOS에서 요청할 권한 목록을 배열에 추가
    const permissions = [
      PERMISSIONS.IOS.BLUETOOTH,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ];

    // requestMultiple을 사용하여 권한 요청
    const statuses = await requestMultiple(permissions);

    // 각 권한의 요청 결과를 확인
    if (
      statuses[PERMISSIONS.IOS.BLUETOOTH] === RESULTS.GRANTED &&
      statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED
    ) {
      console.log('iOS BLE 및 위치 권한 허용됨');
    } else {
      console.log('iOS 권한 거부됨');
    }
  } else if (Platform.OS === 'android') {
    // Android에서 요청할 권한 목록을 배열에 추가
    const permissions = [
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ];

    // requestMultiple을 사용하여 권한 요청
    const statuses = await requestMultiple(permissions);

    // 각 권한의 요청 결과를 확인
    if (
      statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.GRANTED &&
      statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.GRANTED &&
      statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
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
