import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {encodeToBase64} from '../common';
import {BLEService} from '../services/BLEService';
import {right_up_down, right_up_up} from '../utils/actions';
import {characteristic_UUID, service_UUID} from '../utils/uuids';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'DetailDevice'>;

const DetailDeviceScreen = ({navigation}: Props) => {
  // View
  const route = useRoute<RouteProp<ROOT_NAVIGATION, 'DetailDevice'>>(); // useRoute로 데이터 접근
  const {device} = route.params; // 전달받은 기기 데이터

  // 데이터를 블루투스 기기로 보내는 함수
  const sendDataToDevice = (data: string) => {
    try {
      const base64Data = encodeToBase64(data); // 문자열을 Base64로 변환

      // 특성이 검색되었는지 확인
      if (!device) {
        console.error('No connected device found');
        return;
      }

      // 블루투스 기기에 데이터 전송
      BLEService.manager
        .writeCharacteristicWithResponseForDevice(
          device.id,
          service_UUID, // 사용하려는 서비스 UUID
          characteristic_UUID, // 사용하려는 특성 UUID
          base64Data, // Base64로 인코딩된 데이터를 전송
        )
        .then(res => console.log('Data sent:', res))
        .catch(err => console.log('Error sending data:', err));
    } catch (error) {
      console.error('Failed to send data:', error);
    }
  };

  // Logic
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Text>Device Name: {device.name}</Text>
      <Text>Device ID: {device.id}</Text>

      {/* 예시로 head_up_up 버튼을 추가 */}
      <Pressable
        style={{
          backgroundColor: 'blue',
          padding: 10,
          marginTop: 20,
        }}
        onPressIn={() => sendDataToDevice(right_up_down)} // 버튼을 누를 때 전송
        onPressOut={() => sendDataToDevice(right_up_up)} // 버튼에서 손을 뗄 때 전송
      >
        <Text style={{color: 'white'}}>right_down_up</Text>
      </Pressable>
    </View>
  );
};

export default DetailDeviceScreen;
