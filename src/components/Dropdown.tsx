import React, {useState} from 'react';
import {FlatList, Pressable, Text, TouchableOpacity, View} from 'react-native';
import {ActionStepType} from '../types/types';

interface DropdownProps {
  data: ActionStepType[];
  onSelect: (step: number, index: number) => void;
  selectedStep: number | null;
}

const Dropdown: React.FC<DropdownProps> = ({data, onSelect, selectedStep}) => {
  // Logic
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (step: number, index: number) => {
    onSelect(step, index);
    setIsOpen(false);
  };

  // View
  return (
    <View style={{flex: 1, zIndex: 1000}}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={{
          padding: 10,
          borderRadius: 5,
          backgroundColor: '#f0f0f0',
          position: 'relative', // 버튼은 상대 위치
        }}>
        <Text style={{textAlign: 'center'}}>
          {selectedStep !== null
            ? `${selectedStep}단계`
            : '높이 조절값 선택을 해주세요.'}
        </Text>
      </Pressable>

      {isOpen && (
        <View
          style={{
            position: 'absolute', // 드롭다운이 버튼 아래에 위치
            top: 50,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            zIndex: 1000, // zIndex를 적용하여 다른 컴포넌트보다 위에 오도록 설정
            elevation: 10, // Android에서의 zIndex 대체
          }}>
          <FlatList
            data={data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => handleSelect(item.step, index)}
                style={{
                  padding: 10,
                  backgroundColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  borderBottomColor: '#ddd',
                }}>
                <Text style={{textAlign: 'center'}}>{`${item.step}단계`}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Dropdown;
