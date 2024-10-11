/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  Text,
} from 'react-native';
import {Device, State} from 'react-native-ble-plx';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import BluetoothRenderItem from './src/components/BluetoothRenderItem';
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
  const [bluetoothState, setBluetoothState] = useState<string | null>(null); // 블루투스 활성화 여부를 감지하는 상태
  const [devices, setDevices] = useState<Device[]>([]); // 스캔된 BLE 기기들을 저장하는 상태, Device[] 타입으로 정의
  const [isScanning, setIsScanning] = useState<boolean>(false); // 스캔 중 여부를 저장하는 상태
  const [scanFinished, setScanFinished] = useState<boolean>(false); // 스캔이 끝났는지 여부를 저장하는 상태

  useEffect(() => {
    requestPermissions();

    // 블루투스 상태 확인 및 상태 변경 감지
    const subscription = BLEService.manager.onStateChange(state => {
      if (state === State.PoweredOn) {
        setBluetoothState('on');
        startDeviceScan(); // 블루투스가 켜져 있으면 기기 스캔 시작
      } else if (state === State.PoweredOff) {
        setBluetoothState('off');
        Toast.show({
          type: 'error',
          text1: 'Bluetooth is OFF',
          text2: 'Please turn on Bluetooth in settings.',
        });
      } else {
        setBluetoothState(state);
      }
    }, true);

    return () => {
      subscription.remove(); // 컴포넌트 언마운트 시 상태 변경 감지 이벤트 해제
      BLEService.manager.stopDeviceScan(); // 컴포넌트가 언마운트될 때 스캔 종료
    };
  }, []);

  // 블루투스 장치 스캔 함수 (3초 후 스캔 중지)
  const startDeviceScan = () => {
    if (isScanning) return; // 이미 스캔 중이면 중복 실행 방지
    setIsScanning(true);
    setScanFinished(false); // 스캔이 진행중임을 표시
    setDevices([]); // 기존 스캔된 기기 목록 초기화

    BLEService.scanDevices(device => {
      // 이름이 존재하는 기기만 필터링
      if (device.name) {
        setDevices(prevDevices => {
          // 기기가 중복되지 않도록 필터링
          if (!prevDevices.find(d => d.id === device.id)) {
            console.log('Device found:', device); // 새로운 기기 발견시 로그 출력
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    // 3초 후 스캔 중지 및 버튼 표시 변경
    setTimeout(() => {
      BLEService.manager.stopDeviceScan();
      setIsScanning(false);
      setScanFinished(true); // 스캔이 끝났음을 표시
      console.log('Scan stopped after 3 seconds');
    }, 3000);
  };

  // 블루투스를 켜는 함수 (iOS에서는 설정 페이지로 유도)
  const enableBluetooth = () => {
    if (Platform.OS === 'ios') {
      // iOS에서는 설정 페이지로 이동
      Linking.openURL('App-Prefs:root=Bluetooth'); // iOS 설정 페이지로 이동
    } else {
      // Android에서는 BLEService로 블루투스를 켤 수 있음
      BLEService.enable()
        .then(() => {
          setBluetoothState('on'); // 블루투스가 켜지면 상태 업데이트
          Toast.show({
            type: 'success',
            text1: 'Bluetooth is ON',
            text2: 'Bluetooth has been enabled.',
          });
        })
        .catch(error => {
          console.error('Failed to turn on Bluetooth:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to enable Bluetooth.',
          });
        });
    }
  };

  // 스캔이 끝난 후 버튼 클릭 시 처리
  const handleRestartScan = () => {
    setScanFinished(false);
    startDeviceScan(); // 다시 스캔 시작
  };

  // View
  return (
    <SafeAreaView style={{flex: 1}}>
      {bluetoothState === 'on' ? (
        <>
          {!scanFinished ? (
            <Text>Scanning for devices...</Text>
          ) : (
            <Button title="Start Scanning Again" onPress={handleRestartScan} />
          )}
          <FlatList
            data={devices}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <BluetoothRenderItem device={item} index={index} />
            )}
          />
        </>
      ) : (
        <>
          {Platform.OS === 'ios' ? (
            <Button
              title="Go to Bluetooth Settings"
              onPress={enableBluetooth} // iOS에서는 설정으로 이동
            />
          ) : (
            <Button
              title="Turn Bluetooth On"
              onPress={enableBluetooth} // Android에서는 블루투스를 켤 수 있음
            />
          )}
        </>
      )}
      <Toast />
    </SafeAreaView>
  );
}

export default App;
