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
  {number: 1, title: '어깨'},
  {number: 2, title: '목'},
  {number: 3, title: '머리'},
  {number: 4, title: '머리 우측'},
  {number: 5, title: '머리 좌측'},
  {number: 6, title: '향기'},
];

const DetailDeviceScreen = ({navigation}: Props) => {
  // View

  const route = useRoute<RouteProp<ROOT_NAVIGATION, 'DetailDevice'>>(); // useRoute로 데이터 접근
  const {deviceId} = route.params; // 전달받은 기기 데이터

  const [selectedStep, setSelectedStep] = useState<ActionStepType | null>(null);
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

  const handlePresentModalPress = useCallback((stepNumber: number) => {
    const step = actionStep.find(item => item.number === stepNumber);
    if (step) {
      setSelectedStep(step);
      bottomSheetModalRef.current?.present();
    }
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

        {/* 각각의 Pressable 컴포넌트에 수동으로 할당 */}
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
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              marginHorizontal: 5,
              borderWidth: 1,
              borderRadius: 10,
            }}
            onPress={() => handlePresentModalPress(actionStep[0].number)}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: 'violet',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {actionStep[0].number}
              </Text>
            </View>
            <Text>{actionStep[0].title}</Text>
          </Pressable>

          <Pressable
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              marginHorizontal: 5,
              borderWidth: 1,
              borderRadius: 10,
            }}
            onPress={() => handlePresentModalPress(actionStep[1].number)}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: 'violet',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {actionStep[1].number}
              </Text>
            </View>
            <Text>{actionStep[1].title}</Text>
          </Pressable>

          <Pressable
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              marginHorizontal: 5,
              borderWidth: 1,
              borderRadius: 10,
            }}
            onPress={() => handlePresentModalPress(actionStep[2].number)}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: 'violet',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {actionStep[2].number}
              </Text>
            </View>
            <Text>{actionStep[2].title}</Text>
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
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              marginHorizontal: 5,
              borderWidth: 1,
              borderRadius: 10,
            }}
            onPress={() => handlePresentModalPress(actionStep[3].number)}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: 'violet',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {actionStep[3].number}
              </Text>
            </View>
            <Text>{actionStep[3].title}</Text>
          </Pressable>

          <Pressable
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              marginHorizontal: 5,
              borderWidth: 1,
              borderRadius: 10,
            }}
            onPress={() => handlePresentModalPress(actionStep[4].number)}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: 'violet',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {actionStep[4].number}
              </Text>
            </View>
            <Text>{actionStep[4].title}</Text>
          </Pressable>

          <Pressable
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              marginHorizontal: 5,
              borderWidth: 1,
              borderRadius: 10,
            }}
            onPress={() => handlePresentModalPress(actionStep[5].number)}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: 'violet',
                marginBottom: 5,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {actionStep[5].number}
              </Text>
            </View>
            <Text>{actionStep[5].title}</Text>
          </Pressable>
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}>
          <BottomSheetView
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {selectedStep && (
              <View>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}>
                  {selectedStep.title}
                </Text>
                <Text>설정 번호: {selectedStep.number}</Text>
              </View>
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default DetailDeviceScreen;
