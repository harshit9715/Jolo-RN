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
  View,
  StatusBar,
  TextInput,
  Button,
} from 'react-native';

// Functional dependencies
import {
  JolocomLinking,
  JolocomWebSockets,
  Agent,
  JolocomSDK,
  JolocomTypeormStorage,
  JolocomKeychainPasswordStore,
} from 'react-native-jolocom'
import WS from 'react-native-websocket'
import { createConnection, getConnection } from 'typeorm'
import ormconfig from './src/ormconfig'
import { generateSecureRandomBytes } from '@jolocom/sdk/js/util'
import { entropyToMnemonic } from 'bip39'
"use strict";
const humanTimeout = () => new Promise(resolve => setTimeout(resolve, 1000));

const App = () => {

  const [email, setEmail] = React.useState('');
  const [sdk, setSDK] = React.useState('');
  const [did, setDid] = React.useState('');
  async function initJolocom() {
    await initTypeorm().then(async storage => {
      const passwordStore = new JolocomKeychainPasswordStore()
      const sdk = new JolocomSDK({ storage })
      sdk.setDefaultDidMethod('jun')
      await sdk.usePlugins(new JolocomLinking(), new JolocomWebSockets())
      const agent = new Agent({
        sdk,
        passwordStore,
      })
      console.log("agent", JSON.stringify(agent))
      setSDK(sdk);
      let mnemonic =
        "mistake ordinary flush whisper crumble nerve asthma system science relax object ski";
      const seed = await generateSecureRandomBytes(16)
      const identity = await agent.loadFromMnemonic(entropyToMnemonic(seed))
      await humanTimeout()
      const encryptedSeed = await identity.asymEncryptToDid(
        Buffer.from(seed),
        identity.did, {
        prefix: '',
        resolve: async _ => identity.identity
      })
      await agent.storage.store.setting(
        'encryptedSeed',
        {
          b64Encoded: encryptedSeed.toString('base64')
        }
      )
      await humanTimeout()
      setDid(identity.did)
      console.log('did', did)
      // const agent = sdk._makeAgent("harshit123", "jolo");
      // const alice = await agent.loadFromMnemonic(mnemonic);
      //console.log("alice", JSON.stringify(alice.didDocument));

      // const myPublicProfile = {
      //   name: "HyperloopTT",
      //   about: "Digital Identity Solutions Provider",
      //   url: "https://www.hyperlooptt.com/",
      //   image: "https://pbs.twimg.com/profile_images/1205537913125167104/OmZn7WUw_400x400.jpg",
      //   description: "HTT Description",
      //   customData: "testing what else can be added.",
      // };
      // let signedCred = await agent.signedCredential({
      //   metadata: claimsMetadata.publicProfile,
      //   claim: myPublicProfile,
      //   subject: alice.identity.did,
      // });
      // // console.log("signedCred", JSON.stringify(signedCred));
      // await agent.didMethod.registrar.updatePublicProfile(
      //   agent.keyProvider,
      //   "harshit123",
      //   alice.identity,
      //   signedCred
      // );
      // let resolved = await sdk.didMethods
      //   .get("jolo")
      //   .resolver.resolve(
      //     "did:jolo:a93a40cc4870d88db6d29600b95bb6cc166409b2e0fccbc038b48df81c4d816a"
      //   );
      //  console.log("did", JSON.stringify(resolved.didDocument));

    })

    // const conn = await createConnection(ormconfig)
    // const storage = new JolocomTypeormStorage(conn)
    // const passwordStore = new JolocomKeychainPasswordStore()
    // let _sdk = new JolocomSDK({ storage, passwordStore })
    // _sdk.transports.ws.configure({ WebSocket: WS })
    // setSDK(_sdk);
  }
  async function initTypeorm() {
    const connection = await initConnection()
    await connection.synchronize()
    return new JolocomTypeormStorage(connection)
  }
  const initConnection = async () => {
    let connection
    try {
      connection = getConnection()
    } catch (e) {
      connection = await createConnection(ormconfig)
    }
    return connection
  }
  const createAgent = async (sdk) => {

    // console.log("sdk", sdk);
    //console.log("done");
    const bob = await sdk.createAgent('testPassrtry', 'jun');
    //console.log(bob);
  }
  useEffect(() => {
    console.log('effect');
  })


  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e3e3e3', justifyContent: 'center' }}>
        <View style={{ alignItems: 'stretch', width: '90%', alignSelf: 'center' }}>
          <TextInput style={{ borderColor: 'black', borderWidth: 1, textAlign: 'center', marginVertical: 10 }}
            underlineColorAndroid="transparent"
            placeholder="Enter JWT"
            value={email}
            editable={true}
            placeholderTextColor="#9a73ef"
            autoCapitalize="none"
            onChangeText={(jwt) => setEmail(jwt)}
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
    backgroundColor: "#000000",
  },

});

export default App;
