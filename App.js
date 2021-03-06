/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Text,
  View,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';

import api from './API';

import Permissions from 'react-native-permissions';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const path = Platform.select({
  ios: 'hello.m4a',
  android: 'sdcard/hello.mp4',  // use `some dir name in front of your actual file name in android.
});

export default class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      recordSecs: 0,
      recordTime: '',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
      audio_uri: ''
    }
  }

  enviar = async () => {
    let formData = new FormData();

    formData.append('audio', {
      uri: this.state.audio_uri,
      name: 'audio.mp4',
      type: 'audio/x-mp4',
    });

    // Subistitua PARAMETRO E VALOR
    formData.append('PARAMETRO', PARAMETRO);
    try {
      const response = await api.post(`API_URL`, formData, {
        //PARAMETRO: VALOR,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(formData);
      if (response.status == 200) {
        ToastAndroid.showWithGravity(
          "Audio enviado com sucesso verificado o console log.",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        console.log(response.data);
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        "Error verificar console log.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      console.log(formData);
      console.log(error.responde);
    }
  }

  componentDidMount(){
    this.permission();
  }

  permission = () => {
    Permissions.request('microphone').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission: response })
      console.log(response);
    })
    Permissions.request('storage').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission: response });
      console.log(response);
    })
  }

  apertou(){
    ToastAndroid.showWithGravity(
      'Mantenha pressional para gravar.',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
    console.log("Apertou porra");
  }

  soutou(){
    ToastAndroid.showWithGravity(
      'soutou',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
    console.log("Soutou porra");
  }
  
  segurou(){
    ToastAndroid.showWithGravity(
      'segurou',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
    console.log("Segurou porra");
  }

  onStartRecord = async () => {
    const file = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      });
      return;
    });
    this.setState({})
    console.log(`file uri: ${file}`);
  }

  onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
  }

  onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.recordTime}</Text>
        <TouchableOpacity
          style={styles.bt}
          onPressIn={() => this.apertou()}
          onPressOut={() => this.onStopRecord()}
          onLongPress={() => this.onStartRecord()}
          >
          <Text style={styles.tx}>Teste</Text>
        </TouchableOpacity>

        <Text>{this.state.playTime}</Text>
        <TouchableOpacity
          style={styles.bt}
          onPressIn={() => this.onStartPlay()}
          >
          <Text style={styles.tx}>ouvir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bt}
          onPressIn={() => this.permission()}
          >
          <Text style={styles.tx}>dá permissão</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bt}
          onPressIn={() => this.permission()}
          >
          <Text style={styles.tx}>enviar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  bt: {
    height: 50,
    width: 150,
    borderRadius: 5,
    backgroundColor: '#c3c3c3',
    marginVertical: 10
  },
  tx: {
    color: "#000",
    fontSize: 20,
    textAlign: 'center'
  }
});
