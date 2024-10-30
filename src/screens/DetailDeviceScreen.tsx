import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import SelectStepModal from '../components/SelectStepModal';
import {BLEService} from '../services/BLEService';
import {ActionStepType} from '../types/types';
import {encodeToBase64} from '../utils/common';
import {characteristic_UUID, service_UUID} from '../utils/common/uuids';

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

  const [batteryLevel, setBatteryLevel] = useState<number | null>(null); // 배터리 레벨을 저장하는 상태
  const [head, setHead] = useState<number | null>(null); // 머리
  const [neck, setNeck] = useState<number | null>(null); // 목
  const [shoulder, setShoulder] = useState<number | null>(null); // 어깨
  const [leftSide, setLeftSide] = useState<number | null>(null); // 좌측
  const [rightSide, setRightSide] = useState<number | null>(null); // 우측
  const [leftNose, setLeftNose] = useState<number | null>(null); // 코좌
  const [rightNose, setRightNose] = useState<number | null>(null); // 코우
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // 드롭다운 컴포넌트 open 상태

  // 드롭다운에서 항목 선택 시 호출되는 함수
  const handleSelectStep = (part: string, step: number) => {
    switch (part) {
      case 'head':
        setHead(step);
        break;
      case 'neck':
        setNeck(step);
        break;
      case 'shoulder':
        setShoulder(step);
        break;
      case 'leftSide':
        setLeftSide(step);
        break;
      case 'rightSide':
        setRightSide(step);
        break;
      case 'leftNose':
        setLeftNose(step);
        break;
      case 'rightNose':
        setRightNose(step);
        break;
      default:
        console.log(`Unknown part: ${part}`);
    }
  };

  // 드롭다운 메뉴 열림 상태를 관리하는 함수
  const handleDropdownToggle = (part: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenDropdown(part);
    } else {
      setOpenDropdown(null);
    }
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

  // 배터리 잔량을 읽어오는 함수
  const readBatteryLevel = async () => {
    try {
      const characteristic =
        await BLEService.manager.readCharacteristicForDevice(
          deviceId,
          service_UUID,
          characteristic_UUID,
        );

      if (characteristic?.value) {
        // Base64로 인코딩된 값을 디코딩
        const batteryValue = parseInt(atob(characteristic.value), 10);
        setBatteryLevel(batteryValue);
        console.log(`Battery level: ${batteryValue}%`);
      }
    } catch (error) {
      console.error('Failed to read battery level:', error);
    }
  };

  useEffect(() => {
    // 화면이 로드될 때 배터리 정보를 읽어옵니다.
    readBatteryLevel();
  }, []);

  // Logic
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          머리
        </Text>
        <SelectStepModal
          data={actionStep}
          selectedStep={head}
          onSelect={step => handleSelectStep('head', step)}
          isOpen={openDropdown === 'head'}
          onToggle={isOpen => handleDropdownToggle('head', isOpen)}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          목
        </Text>
        <SelectStepModal
          data={actionStep}
          selectedStep={neck}
          onSelect={step => handleSelectStep('neck', step)}
          isOpen={openDropdown === 'neck'}
          onToggle={isOpen => handleDropdownToggle('neck', isOpen)}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          어깨
        </Text>
        <SelectStepModal
          data={actionStep}
          selectedStep={shoulder}
          onSelect={step => handleSelectStep('shoulder', step)}
          isOpen={openDropdown === 'shoulder'}
          onToggle={isOpen => handleDropdownToggle('shoulder', isOpen)}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          좌측
        </Text>
        <SelectStepModal
          data={actionStep}
          selectedStep={leftSide}
          onSelect={step => handleSelectStep('leftSide', step)}
          isOpen={openDropdown === 'leftSide'}
          onToggle={isOpen => handleDropdownToggle('leftSide', isOpen)}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          우측
        </Text>
        <SelectStepModal
          data={actionStep}
          selectedStep={rightSide}
          onSelect={step => handleSelectStep('rightSide', step)}
          isOpen={openDropdown === 'rightSide'}
          onToggle={isOpen => handleDropdownToggle('rightSide', isOpen)}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          코좌
        </Text>
        <SelectStepModal
          data={actionStep}
          selectedStep={leftNose}
          onSelect={step => handleSelectStep('leftNose', step)}
          isOpen={openDropdown === 'leftNose'}
          onToggle={isOpen => handleDropdownToggle('leftNose', isOpen)}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'medium', marginRight: 30}}>
          코우
        </Text>
        <SelectStepModal
          data={actionStep}
          selectedStep={rightNose}
          onSelect={step => handleSelectStep('rightNose', step)}
          isOpen={openDropdown === 'rightNose'}
          onToggle={isOpen => handleDropdownToggle('rightNose', isOpen)}
        />
      </View>
    </View>
  );
};

export default DetailDeviceScreen;
