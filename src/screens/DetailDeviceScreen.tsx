import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {BLEService} from '../services/BLEService';
import {ActionStepType} from '../types/types';
import {charToDecimal, decodeFromBase64, encodeToBase64} from '../utils/common';
import {batteryValue} from '../utils/common/actions';
import {
  characteristic_UUID,
  notify_UUID,
  service_UUID,
} from '../utils/common/uuids';

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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['20%', '50%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
    [],
  );

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
  // const sendDataToDevice = (data: string) => {
  //   try {
  //     const base64Data = encodeToBase64(data);

  //     BLEService.manager
  //       .writeCharacteristicWithResponseForDevice(
  //         deviceId,
  //         service_UUID,
  //         characteristic_UUID,
  //         base64Data,
  //       )
  //       .then(res => console.log('Data sent:', res))
  //       .catch(err => console.log('Error sending data:', err));
  //   } catch (error) {
  //     console.error('Failed to send data:', error);
  //   }
  // };

  // 배터리 측정 요청을 보내는 함수
  const requestBatteryLevel = async () => {
    try {
      const base64Data = encodeToBase64(batteryValue);

      // 측정 요청 전송
      await BLEService.manager.writeCharacteristicWithResponseForDevice(
        deviceId,
        service_UUID,
        characteristic_UUID,
        base64Data,
      );

      // 배터리 응답 모니터링 설정
      BLEService.manager.monitorCharacteristicForDevice(
        deviceId,
        service_UUID,
        notify_UUID,
        (error, characteristic) => {
          if (error) {
            console.log('Failed to monitor characteristic:', error);
            return;
          }

          if (characteristic?.value) {
            const decodedValue = decodeFromBase64(characteristic.value);
            const targetCharValue = decodedValue[4];
            const decimalValue = charToDecimal(targetCharValue);
            console.log(`Battery Data: ${decimalValue}`);
            setBatteryLevel(decimalValue);
          }
        },
      );
    } catch (error) {
      console.log('Failed to request battery level:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      requestBatteryLevel();
    }, [batteryLevel]),
  );

  // Logic
  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 32, fontWeight: 'bold', textAlign: 'center'}}>
            나의 베개 설정
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{width: '100%', height: 200, backgroundColor: 'lightgray'}}
          />
        </View>
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Pressable
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderRadius: 10,
              }}
              onPress={handlePresentModalPress}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'violet',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>1</Text>
              </View>
              <Text>머리</Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderRadius: 10,
              }}
              onPress={handlePresentModalPress}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'violet',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>2</Text>
              </View>
              <Text>목</Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderRadius: 10,
              }}
              onPress={handlePresentModalPress}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'violet',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>3</Text>
              </View>
              <Text>머리</Text>
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
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderRadius: 10,
              }}
              onPress={handlePresentModalPress}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'violet',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>4</Text>
              </View>
              <Text>머리 우측</Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderRadius: 10,
              }}
              onPress={handlePresentModalPress}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'violet',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>5</Text>
              </View>
              <Text>머리 좌측</Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                borderWidth: 1,
                borderRadius: 10,
              }}
              onPress={handlePresentModalPress}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'violet',
                  marginBottom: 5,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>6</Text>
              </View>
              <Text>방향</Text>
            </Pressable>
          </View>
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}>
          <BottomSheetView style={{flex: 1}}>
            <Text>test</Text>
          </BottomSheetView>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default DetailDeviceScreen;
