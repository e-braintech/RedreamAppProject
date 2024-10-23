import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {encodeToBase64} from '../common';
import Dropdown from '../components/Dropdown';
import {BLEService} from '../services/BLEService';
import {ActionStepType} from '../types/types';
import {characteristic_UUID, service_UUID} from '../utils/uuids';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'DetailDevice'>;

const actionStep: ActionStepType[] = [
  {step: 1},
  {step: 2},
  {step: 3},
  {step: 4},
  {step: 5},
  {step: 6},
  {step: 7},
  {step: 8},
  {step: 9},
  {step: 10},
];

const DetailDeviceScreen = ({navigation}: Props) => {
  // View
  const route = useRoute<RouteProp<ROOT_NAVIGATION, 'DetailDevice'>>(); // useRoute로 데이터 접근
  const {deviceId} = route.params; // 전달받은 기기 데이터

  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  // 드롭다운에서 항목 선택 시 호출되는 함수
  const handleSelectStep = (step: number, index: number) => {
    setSelectedStep(step);
    console.log(`Selected Step: ${step}, Index: ${index}`);
  };

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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          머리
        </Text>
        <Dropdown
          data={actionStep}
          selectedStep={selectedStep}
          onSelect={handleSelectStep}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          목
        </Text>
        <Dropdown
          data={actionStep}
          selectedStep={selectedStep}
          onSelect={handleSelectStep}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          어깨
        </Text>
        <Dropdown
          data={actionStep}
          selectedStep={selectedStep}
          onSelect={handleSelectStep}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          좌측
        </Text>
        <Dropdown
          data={actionStep}
          selectedStep={selectedStep}
          onSelect={handleSelectStep}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          우측
        </Text>
        <Dropdown
          data={actionStep}
          selectedStep={selectedStep}
          onSelect={handleSelectStep}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          코좌
        </Text>
        <Dropdown
          data={actionStep}
          selectedStep={selectedStep}
          onSelect={handleSelectStep}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          코우
        </Text>
        <Dropdown
          data={actionStep}
          selectedStep={selectedStep}
          onSelect={handleSelectStep}
        />
      </View>
    </SafeAreaView>
  );
};

export default DetailDeviceScreen;
