/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 // Design Dependencies 
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// Functional dependencies
import {
  JolocomSDK,
  JolocomTypeormStorage,
  JolocomKeychainPasswordStore,
} from 'react-native-jolocom'
import WS from 'react-native-websocket'
import { createConnection } from 'typeorm'
import ormconfig from './src/ormconfig'

const App = () => {
  
  const [email, setEmail] = React.useState('');
  const [sdk, setSDK] = React.useState('');
  async function initJolocom() {
    const conn = await createConnection(ormconfig)
    const storage = new JolocomTypeormStorage(conn)
    const passwordStore = new JolocomKeychainPasswordStore()
    let _sdk = new JolocomSDK({ storage, passwordStore })
    _sdk.transports.ws.configure({ WebSocket:WS })
    setSDK(_sdk);
  }

  const createAgent = async (sdk) => {
  
    console.log(sdk);
    console.log("done");
    const bob = await sdk.createAgent('testPass', 'jun');
    // console.log(bob);
  }
  useEffect(() => {
    console.log('effect');
  }) 


  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex:1, backgroundColor:'#e3e3e3', justifyContent:'center'}}>
        <View style={{ alignItems:'stretch', width: '90%', alignSelf:'center'}}>
          <TextInput style={{ borderColor:'black', borderWidth:1, textAlign:'center', marginVertical:10}}
               underlineColorAndroid = "transparent"
               placeholder = "Enter JWT"
               value={email}
               editable={true}
               placeholderTextColor = "#9a73ef"
               autoCapitalize = "none"
               onChangeText = {(jwt) => setEmail(jwt)}
          />
          <Button
            title="Init Jolo"
            onPress={initJolocom}
          />
          <Button
            title="Submit JWT"
            onPress={() => createAgent(sdk)}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
