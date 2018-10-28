import React, {Component} from 'react';
import { StyleSheet, View, TextInput, ImageBackground, AsyncStorage, TouchableOpacity, ActivityIndicator, Picker } from 'react-native';
import { WaveIndicator, BarIndicator, DotIndicator, MaterialIndicator, PacmanIndicator, PulseIndicator, SkypeIndicator, UIActivityIndicator } from 'react-native-indicators';
import { Button, Text, Toast, Root} from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';
import renderIf from './../../renderIf';
import bgSrc from './../../Login/LoginScreen/images/login.png';


export default class LoginScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      fullName: '',
      mobile:'',
      type:'Player',
      loginLoading: false,
      signupLoading: false
    }
  }

  _signUpAsync = () => {
    this.setState({ signupLoading: true })
    firebase.auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.password)
      .then((user) => {
        console.log(user.user.uid);
        
        firebase.firestore().collection('users').doc(user.user.uid).set({
          email: user.user.email,
          name: this.state.name,
          mobile: this.state.mobile,
          type: this.state.type
        });
        this.setState({ signupLoading: false });
      })
      .catch(function (e) {
        this.setState({ signupLoading: false });     
        Toast.show({
          text: e.message,
          buttonText: "Okay",
          duration: 6000
        })
      }.bind(this))
  }

  static navigationOptions = {
    header: null
  }


  render() {
    const { navigation } = this.props;

    return (
      <Root>
      <ImageBackground style={styles.picture} source={bgSrc}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={'Enter your Name ...'}
            secureTextEntry={false}
            autoCorrect={false}
            autoCapitalize={'sentences'}
            placeholderTextColor="white"
            underlineColorAndroid="transparent"
            onChangeText= {(name) => this.setState({ name })}
          />
          <TextInput
            style={styles.input}
            placeholder={'+201060075112'}
            secureTextEntry={false}
            autoCorrect={false}
            autoCapitalize={'sentences'}
            placeholderTextColor="white"
            underlineColorAndroid="transparent"
            onChangeText= {(mobile) => this.setState({ mobile })}
          />
          <TextInput
            style={styles.input}
            placeholder={'elsayadi5700@gmail.com'}
            secureTextEntry={false}
            autoCorrect={false}
            autoCapitalize={'sentences'}
            placeholderTextColor="white"
            underlineColorAndroid="transparent"
            onChangeText= {(email) => this.setState({ email })}
          />

          <TextInput
            style={styles.input}
            placeholder={'*************'}
            secureTextEntry={true}
            autoCorrect={false}
            placeholderTextColor="white"
            underlineColorAndroid="transparent"
            onChangeText={(password) => this.setState({ password })}
          />

            <Picker
              selectedValue={this.state.type}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) => this.setState({ type: itemValue })}>
              <Picker.Item label="Player" value="Player" />
              <Picker.Item label="Coach" value="Coach" />
              <Picker.Item label="Parent" value="Parent" />
            </Picker>
          <TouchableOpacity>

            {renderIf(this.state.signupLoading,
              <ActivityIndicator style={{ margin: 0 }} color='#fff' size={40} />
            )}

                <Button rounded light style={styles.button} onPress={this._signUpAsync}><Text> Sign Up </Text></Button>
            

          </TouchableOpacity>
        </View>
      </ImageBackground >
      </Root>
    );
  }
}


const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    height: 40,
    marginHorizontal: 20,
    paddingLeft: 45,
    borderRadius: 20,
    color: '#ffffff',
    width: '80%',
    marginBottom: '5%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 290
  },
  picture: {
    flex: 1,
    width: null,
    height: null
  },
  button: {
    marginTop: '3%',
    alignSelf: 'center',
    justifyContent: 'flex-start'
  }
});