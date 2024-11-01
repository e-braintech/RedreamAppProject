import React from 'react';
import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';
import {
  head_step_1,
  head_step_2,
  head_step_3,
  head_step_4,
  head_step_5,
  left_head_step_1,
  left_head_step_2,
  left_head_step_3,
  left_head_step_4,
  left_head_step_5,
  neck_step_1,
  neck_step_2,
  neck_step_3,
  neck_step_4,
  neck_step_5,
  right_head_step_1,
  right_head_step_2,
  right_head_step_3,
  right_head_step_4,
  right_head_step_5,
  shoulder_step_1,
  shoulder_step_2,
  shoulder_step_3,
  shoulder_step_4,
  shoulder_step_5,
  smell_off,
  smell_on,
} from '../utils/common/actions';

interface BluetoothBottomSheetControlViewProps {
  stepNumber: number;
  title: string;
  stepLevel: number;
  setStepLevel: React.Dispatch<React.SetStateAction<number>>;
  sendDataToDevice: (data: string) => void;
  hideBottomSheet: () => void;
}

const BluetoothBottomSheetControlView: React.FC<
  BluetoothBottomSheetControlViewProps
> = ({
  stepNumber,
  title,
  stepLevel,
  setStepLevel,
  sendDataToDevice,
  hideBottomSheet,
}) => {
  // Logic

  // 단계별 Bluetooth 데이터 가져오기
  const getBluetoothData = (
    stepNumber: number,
    level: number,
  ): string | null => {
    switch (stepNumber) {
      case 1: // 어깨
        return [
          shoulder_step_1,
          shoulder_step_2,
          shoulder_step_3,
          shoulder_step_4,
          shoulder_step_5,
        ][level - 1];
      case 2: // 목
        return [
          neck_step_1,
          neck_step_2,
          neck_step_3,
          neck_step_4,
          neck_step_5,
        ][level - 1];
      case 3: // 머리
        return [
          head_step_1,
          head_step_2,
          head_step_3,
          head_step_4,
          head_step_5,
        ][level - 1];
      case 4: // 머리 우측
        return [
          right_head_step_1,
          right_head_step_2,
          right_head_step_3,
          right_head_step_4,
          right_head_step_5,
        ][level - 1];
      case 5: // 머리 좌측
        return [
          left_head_step_1,
          left_head_step_2,
          left_head_step_3,
          left_head_step_4,
          left_head_step_5,
        ][level - 1];
      case 6: // 향기
        return level === 1 ? smell_on : smell_off;
      default:
        return null;
    }
  };

  // 단계 수 증가 함수
  const handleIncrease = () =>
    setStepLevel(prev => (prev < 5 ? prev + 1 : prev));

  // 단계 수 감소 함수
  const handleDecrease = () => setStepLevel(prev => (prev > 0 ? prev - 1 : 0));

  // '확인' 버튼 클릭 시 데이터를 전송하는 함수
  const handleConfirm = () => {
    const dataToSend = getBluetoothData(stepNumber, stepLevel);
    if (dataToSend) sendDataToDevice(dataToSend); // 데이터가 있으면 전송
    hideBottomSheet(); // BottomSheet 닫기
  };

  // View
  return (
    <View style={{flex: 1, marginTop: 50, paddingHorizontal: 30}}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{marginRight: 5, color: 'gray'}}>{`조작 위치`}</Text>
          <View
            style={{
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
              backgroundColor: 'gray',
            }}>
            <Text style={{color: '#ffffff'}}>{stepNumber}</Text>
          </View>
        </View>
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 15,
        }}>
        {title}
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 25,
        }}>
        {`${stepLevel}단`}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 50,
        }}>
        <TouchableOpacity
          style={{padding: 10, borderWidth: 1, borderRadius: 5}}
          onPress={handleDecrease}>
          <Image
            source={require('../assets/up.png')}
            style={{width: 24, height: 24}}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
          }}
          onPress={handleIncrease}>
          <Image
            source={require('../assets/down.png')}
            style={{width: 24, height: 24}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // paddingHorizontal: 30,
            paddingVertical: 10,
            borderWidth: 1,
            borderRadius: 20,
            marginRight: 10,
          }}
          onPress={hideBottomSheet}>
          <Text>취소</Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // paddingHorizontal: 50,
            marginLeft: 10,
            paddingVertical: 10,
            borderWidth: 1,
            borderRadius: 20,
          }}
          onPress={handleConfirm}>
          <Text>확인</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BluetoothBottomSheetControlView;
