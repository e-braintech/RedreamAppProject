import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

interface SelectStepModalRenderItemProps {
  step: number;
  index: number;
  onSelect: (item: number, index: number) => void;
}

const SelectStepModalRenderItem: React.FC<SelectStepModalRenderItemProps> = ({
  step,
  index,
  onSelect,
}) => {
  // Logic

  // View
  return (
    <TouchableOpacity
      onPress={() => onSelect(step, index)}
      style={{
        width: '100%',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderRadius: 5,
        borderBottomColor: '#ddd',
      }}>
      <Text style={{textAlign: 'center'}}>{`${step} 단계`}</Text>
    </TouchableOpacity>
  );
};

export default SelectStepModalRenderItem;
