import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types';
import ConfirmButton from '../components/ConfirmButton';

type Props = NativeStackScreenProps<ROOT_NAVIGATION, 'Intro'>;

const IntroScreen = ({navigation}: Props) => {
  // Logic
  const handleShowLog = () => {
    console.log('test');
  };

  // View
  return (
    <View style={styles.container}>
      <ConfirmButton
        title="시작하기"
        buttonStyle={styles.buttonContainer}
        textStyle={styles.buttonText}
        onSubmit={handleShowLog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 70 : 30,
    backgroundColor: 'yellow',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'medium',
  },
});

export default IntroScreen;
