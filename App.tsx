/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

async function requestPermissions() {
  if (Platform.OS === 'ios') {
    const bluetoothPermission = await request(PERMISSIONS.IOS.BLUETOOTH);
    const locationPermission = await request(
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    );

    if (
      bluetoothPermission === RESULTS.GRANTED &&
      locationPermission === RESULTS.GRANTED
    ) {
      console.log('iOS BLE 및 위치 권한 허용됨');
    } else {
      console.log('iOS 권한 거부됨');
    }
  } else if (Platform.OS === 'android') {
    const bluetoothScan = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
    const bluetoothConnect = await request(
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    );
    const locationPermission = await request(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );

    if (
      bluetoothScan === RESULTS.GRANTED &&
      bluetoothConnect === RESULTS.GRANTED &&
      locationPermission === RESULTS.GRANTED
    ) {
      console.log('Android BLE 및 위치 권한 허용됨');
    } else {
      console.log('Android 권한 거부됨');
    }
  }
}

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
