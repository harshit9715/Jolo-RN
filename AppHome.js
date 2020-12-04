import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
} from 'react-native';

//import { createIdentityFromKeyProvider } from "jolocom-lib/js/didMethods/utils.js";
import { JolocomSDK, NaivePasswordStore } from "@jolocom/sdk";
import { createConnection } from "typeorm";
import { JolocomTypeormStorage } from "@jolocom/sdk-storage-typeorm";
import { claimsMetadata, JolocomLib } from "jolocom-lib";
import { entityList } from '@jolocom/sdk-storage-typeorm'
import typeOrmConfig from './src/ormconfig'
// create a component
//import liraries

// create a component
const migrations = []
class AppHome extends React.Component {

    componentDidMount() {
        updatePublicProfileMethod(typeOrmConfig).then(result => console.log("done"));
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>MyClass</Text>
            </View>
        );
    }
}


const updatePublicProfileMethod = async (typeOrmConfig) => {
    const connection = await createConnection(typeOrmConfig);
    const sdk = new JolocomSDK({
        storage: new JolocomTypeormStorage(connection),
    });
    let mnemonic =
        "mistake ordinary flush whisper crumble nerve asthma system science relax object ski";
    const agent = sdk._makeAgent("harshit123", "jolo");
    const alice = await agent.loadFromMnemonic(mnemonic);
    console.log("alice", alice.didDocument.toJSON());

    const myPublicProfile = {
        name: "HyperloopTT",
        about: "Digital Identity Solutions Provider",
        url: "https://www.hyperlooptt.com/",
        image:
            "https://pbs.twimg.com/profile_images/1205537913125167104/OmZn7WUw_400x400.jpg",
        description: "HTT Description",
        customData: "testing what else can be added.",
    };
    let signedCred = await agent.signedCredential({
        metadata: claimsMetadata.publicProfile,
        claim: myPublicProfile,
        subject: alice.identity.did,
    });

    console.log("signedCred", signedCred);
    await agent.didMethod.registrar.updatePublicProfile(
        agent.keyProvider,
        "harshit123",
        alice.identity,
        signedCred
    );
    let resolved = await sdk.didMethods
        .get("jolo")
        .resolver.resolve(
            "did:jolo:a93a40cc4870d88db6d29600b95bb6cc166409b2e0fccbc038b48df81c4d816a"
        );
    console.log("did", resolved.didDocument.toJSON());
};


//make this component available to the app
export default AppHome;


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
