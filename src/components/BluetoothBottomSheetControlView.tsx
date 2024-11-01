import React from 'react';
import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';

interface BluetoothBottomSheetControlViewProps {
  stepNumber: number;
  title: string;
  stepLevel: number;
  setStepLevel: React.Dispatch<React.SetStateAction<number>>;
}

const BluetoothBottomSheetControlView: React.FC<
  BluetoothBottomSheetControlViewProps
> = ({stepNumber, title, stepLevel, setStepLevel}) => {
  // Logic
  // 단계 수 증가 함수
  const handleIncrease = () =>
    setStepLevel(prev => (prev < 5 ? prev + 1 : prev));

  // 단계 수 감소 함수
  const handleDecrease = () => setStepLevel(prev => (prev > 0 ? prev - 1 : 0));

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
          }}>
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
          }}>
          <Text>확인</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BluetoothBottomSheetControlView;
