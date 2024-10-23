import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {encodeToBase64} from '../common';
import {BLEService} from '../services/BLEService';
import {
  head_down_down,
  head_down_up,
  head_up_down,
  head_up_up,
  left_down_down,
  left_down_up,
  left_up_down,
  left_up_up,
  neck_down_down,
  neck_down_up,
  neck_up_down,
  neck_up_up,
  nose_left_down_down,
  nose_left_down_up,
  nose_left_up_down,
  nose_left_up_up,
  nose_right_down_down,
  nose_right_down_up,
  nose_right_up_down,
  nose_right_up_up,
  right_down_down,
  right_down_up,
  right_up_down,
  right_up_up,
  shoulder_down_down,
  shoulder_down_up,
  shoulder_up_down,
  shoulder_up_up,
} from '../utils/actions';
import {characteristic_UUID, service_UUID} from '../utils/uuids';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'DetailDevice'>;

const DetailDeviceScreen = ({navigation}: Props) => {
  // View
  const route = useRoute<RouteProp<ROOT_NAVIGATION, 'DetailDevice'>>(); // useRoute로 데이터 접근
  const {deviceId} = route.params; // 전달받은 기기 데이터

  // 데이터를 블루투스 기기로 보내는 함수
  const sendDataToDevice = (data: string) => {
    try {
      const base64Data = encodeToBase64(data);

      BLEService.manager
        .writeCharacteristicWithResponseForDevice(
          deviceId,
          service_UUID,
          characteristic_UUID,
          base64Data,
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
        backgroundColor: 'white',
      }}>
      {/* <Text style={{textAlign: 'center'}}>Device Name: {device.name}</Text>
      <Text style={{textAlign: 'center'}}>Device ID: {device.id}</Text> */}

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(head_up_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(head_up_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>머리 up</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(head_down_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(head_down_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>머리 down</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(neck_up_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(neck_up_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>목 up</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(neck_down_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(neck_down_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>목 down</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(shoulder_up_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(shoulder_up_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>어깨 up</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(shoulder_down_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(shoulder_down_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>어깨 down</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(left_up_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(left_up_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>좌측 up</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(left_down_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(left_down_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>좌측 down</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(right_up_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(right_up_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>우측 up</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(right_down_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(right_down_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>우측 down</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(nose_left_up_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(nose_left_up_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>코 좌 up</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(nose_left_down_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(nose_left_down_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>코 좌 down</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(nose_right_up_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(nose_right_up_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>코 우 up</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: 'blue',
            padding: 10,
            marginTop: 20,
          }}
          onPressIn={() => sendDataToDevice(nose_right_down_down)} // 버튼을 누를 때 전송
          onPressOut={() => sendDataToDevice(nose_right_down_up)} // 버튼에서 손을 뗄 때 전송
        >
          <Text style={{color: 'white'}}>코 우 down</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DetailDeviceScreen;
