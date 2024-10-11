import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {encodeToBase64} from '../common';
import {BLEService} from '../services/BLEService';
import {head_up_down, head_up_up} from '../utils/bytes';
import {characteristic_UUID, service_UUID} from '../utils/uuids';

const DetailDeviceScreen = ({navigation}) => {
  // View
  const route = useRoute<RouteProp<ROOT_NAVIGATION, 'DetailDevice'>>(); // useRoute로 데이터 접근
  const {device} = route.params; // 전달받은 기기 데이터

  // 데이터를 블루투스 기기로 보내는 함수
  const sendDataToDevice = async (byteArray: number[]) => {
    try {
      const base64Data = encodeToBase64(byteArray); // 바이트 배열을 Base64로 변환

      // 블루투스 기기에 데이터 전송
      await BLEService.manager.writeCharacteristicWithResponseForDevice(
        device.id,
        service_UUID,
        characteristic_UUID,
        base64Data, // Base64로 인코딩된 데이터를 전송
      );

      console.log(`Data sent: ${base64Data}`);
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
        onPress={() => sendDataToDevice(head_up_up)} // head_up_up 바이트 배열 전송
        style={{
          backgroundColor: 'blue',
          padding: 10,
          marginTop: 20,
        }}>
        <Text style={{color: 'white'}}>Head Up Up</Text>
      </Pressable>

      {/* head_up_down 버튼 */}
      <Pressable
        onPress={() => sendDataToDevice(head_up_down)} // head_up_down 바이트 배열 전송
        style={{
          backgroundColor: 'green',
          padding: 10,
          marginTop: 20,
        }}>
        <Text style={{color: 'white'}}>Head Up Down</Text>
      </Pressable>
    </View>
  );
};

export default DetailDeviceScreen;
