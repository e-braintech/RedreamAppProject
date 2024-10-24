import React from 'react';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ActionStepType} from '../types/types';
import SelectStepModalRenderItem from './SelectStepModalRenderItem';

interface SelectStepModalProps {
  data: ActionStepType[];
  onSelect: (step: number, index: number) => void;
  selectedStep: number | null;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

const SelectStepModal: React.FC<SelectStepModalProps> = ({
  data,
  onSelect,
  selectedStep,
  isOpen,
  onToggle,
}) => {
  const handleSelect = (step: number, index: number) => {
    console.log(`높이 설정: ${step}단계`); // 로그로 선택된 텍스트 출력
    onSelect(step, index);
    onToggle(false); // 선택 후 드롭다운을 닫습니다.
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => onToggle(true)}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 5,
          backgroundColor: '#f0f0f0',
        }}>
        <Text style={{textAlign: 'center'}}>
          {selectedStep !== null
            ? `${selectedStep} 단계`
            : '높이 조절 단계를 설정하세요.'}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => onToggle(false)}>
        <TouchableWithoutFeedback onPress={() => onToggle(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: '#ffffff',
              }}>
              <FlatList
                data={data}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item, index}) => (
                  <SelectStepModalRenderItem
                    step={item.step}
                    index={index}
                    onSelect={() => handleSelect(item.step, index)}
                  />
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SelectStepModal;
