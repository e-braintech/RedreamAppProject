import React, {useEffect, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  FlatList,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
} from 'react-native';
import {Device, State} from 'react-native-ble-plx';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import Toast from 'react-native-toast-message';
import BluetoothRenderItem from '../components/BluetoothRenderItem';
import {BLEService} from '../services/BLEService';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'ScanDevice'>;

const ScanDeviceScreen = ({navigation}: Props) => {
  // Logic
  const [bluetoothState, setBluetoothState] = useState<string | null>(null); // 블루투스 활성화 여부를 감지하는 상태
  const [devices, setDevices] = useState<Device[]>([]); // 스캔된 BLE 기기들을 저장하는 상태, Device[] 타입으로 정의
  const [isScanning, setIsScanning] = useState<boolean>(false); // 스캔 중 여부를 저장하는 상태
  const [scanFinished, setScanFinished] = useState<boolean>(false); // 스캔이 끝났는지 여부를 저장하는 상태
  const [refreshing, setRefreshing] = useState<boolean>(false); // RefreshControl 상태
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null); // 연결된 기기 상태
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  ); // 앱 상태 저장

  useEffect(() => {
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

    // AppState를 통해 앱 상태 변경 감지
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove(); // 컴포넌트 언마운트 시 상태 변경 감지 이벤트 해제
      appStateSubscription.remove(); // 앱 상태 감지 해제
      BLEService.manager.stopDeviceScan(); // 컴포넌트가 언마운트될 때 스캔 종료
    };
  }, []);

  // 앱 상태가 변경될 때 호출되는 함수
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log('Current app state: ', nextAppState); // 현재 상태 로그 출력

    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground');
      BLEService.manager.state().then(bluetoothState => {
        if (bluetoothState === State.PoweredOn) {
          startDeviceScan(); // Bluetooth가 켜져 있을 때만 스캔 재시작
        } else {
          console.log('Bluetooth is not powered on');
          setBluetoothState('off');
        }
      });
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      console.log('App has gone to the background or is inactive');
      if (connectedDevice) {
        disconnectFromDevice(connectedDevice);
      }
      setDevices([]);
    }
    setAppState(nextAppState); // 상태 업데이트
  };

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
      Linking.openURL('app-settings://bluetooth/RedreamApp'); // iOS 설정 페이지로 이동
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

  // 블루투스 기기와 연결하는 함수
  const connectToDevice = (device: Device) => {
    BLEService.manager
      .connectToDevice(device.id)
      .then(() =>
        BLEService.manager.discoverAllServicesAndCharacteristicsForDevice(
          device.id,
        ),
      )
      .then(device => {
        setConnectedDevice(device);
        Toast.show({
          type: 'success',
          text1: 'Connected',
          text2: `Connected to ${device.name}`,
        });
        navigation.navigate('DetailDevice', {device});
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Connection Failed',
          text2: `Failed to connect to ${device.name}`,
        });
      });
  };

  // 블루투스 기기와 연결을 끊는 함수
  const disconnectFromDevice = (device: Device) => {
    return BLEService.manager
      .cancelDeviceConnection(device.id)
      .then(() => {
        setConnectedDevice(null); // 연결 해제 시 연결된 기기 상태 초기화
        Toast.show({
          type: 'success',
          text1: 'Disconnected',
          text2: `Disconnected from ${device.name}`,
        });
        console.log('Device disconnected:', device);
      })
      .catch(error => {
        console.log('Failed to disconnect device:', error);
        Toast.show({
          type: 'error',
          text1: 'Disconnection Failed',
          text2: `Failed to disconnect from ${device.name}`,
        });
      });
  };

  // 스캔 버튼 클릭 시 처리: 연결된 기기 해제 후 스캔
  const handleRestartScan = () => {
    if (connectedDevice) {
      disconnectFromDevice(connectedDevice).then(() => {
        startDeviceScan(); // 연결 해제 후 스캔 시작
      });
    } else {
      startDeviceScan(); // 연결된 기기가 없으면 바로 스캔 시작
    }
  };

  // RefreshControl에서 스캔 재시작
  const onRefresh = () => {
    setRefreshing(true);
    startDeviceScan();
    setTimeout(() => {
      setRefreshing(false); // 3초 후 RefreshControl 종료
    }, 3000);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {bluetoothState === 'on' ? (
        <>
          {!scanFinished ? (
            <Text style={{textAlign: 'center', marginBottom: 50}}>
              디바이스 스캔 중...
            </Text>
          ) : (
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 50,
                backgroundColor: 'blue',
                height: 50,
              }}
              onPress={handleRestartScan}>
              <Text style={{color: 'white'}}>스캔</Text>
            </Pressable>
          )}
          <FlatList
            data={devices}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <BluetoothRenderItem
                device={item}
                index={index}
                connectToDevice={connectToDevice}
                disconnectFromDevice={disconnectFromDevice}
                isConnected={connectedDevice?.id === item.id}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
      ) : (
        <>
          {Platform.OS === 'ios' ? (
            <Pressable
              onPress={enableBluetooth} // iOS에서는 설정으로 이동
            >
              <Text>블루투스 켜기</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={enableBluetooth} // Android에서는 블루투스를 켤 수 있음
            >
              <Text>블루투스 켜기</Text>
            </Pressable>
          )}
        </>
      )}
      <Toast position="bottom" />
    </SafeAreaView>
  );
};

export default ScanDeviceScreen;
