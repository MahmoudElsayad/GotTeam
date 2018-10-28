import React, {Component} from 'react';
import { StyleSheet, View, TextInput, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Text, Toast, Root } from 'native-base';
import * as firebase from 'firebase';
import renderIf from './../../renderIf';

import bgSrc from './../LoginScreen/images/login.png';


export default class SignupScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      loginLoading: false,
      signupLoading: false
    }
  }

  _signInAsync = () => {

    this.setState({ loginLoading: true })
    console.log(this.state.email);
    console.log(this.state.password);

    firebase.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
      .then(function (user) {
        this.setState({ loginLoading: false });
      }.bind(this)).catch(function (e) {
        this.setState({ loginLoading: false });
        console.log(e);
        Toast.show({
          text: e.message,
          buttonText: "Okay",
          duration: 6000
        })
      }.bind(this))

  }

  _signUpAsync = () => {
    this.setState({ signupLoading: true })
    console.log(this.state.email);
    console.log(this.state.password);
    
    firebase.auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.password)
      .then(function (user) {
        this.setState({ signupLoading: false });
        user.sendEmailVerification();
      }.bind(this)).catch(function (e) {
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
            placeholder={'elsayadi5700@gmail.com'}
            secureTextEntry={false}
            autoCorrect={false}
            autoCapitalize={'sentences'}
              placeholderTextColor="rgba(0, 0, 0, 0.8)"
            underlineColorAndroid="transparent"
            onChangeText= {(email) => this.setState({ email })}
          />

          <TextInput
            style={styles.input}
            placeholder={'*************'}
            secureTextEntry={true}
            autoCorrect={false}
              placeholderTextColor="rgba(0, 0, 0, 0.8)"
            underlineColorAndroid="transparent"
            onChangeText={(password) => this.setState({ password })}
          />
          <TouchableOpacity>
              {renderIf(this.state.loginLoading,
                <ActivityIndicator style={{ margin: 0 }} color='#fff' size={40} />
              )}
              {renderIf((this.state.loginLoading == false),
                <Button rounded light style={styles.button} onPress={this._signInAsync}><Text> Login </Text></Button>
              )}


            {renderIf(this.state.signupLoading,
              <ActivityIndicator style={{ margin: 0 }} color='#fff' size={40} />
            )}
            {renderIf((this.state.signupLoading == false),
                <Button rounded light style={styles.button} onPress={() => { navigation.navigate('Login') }}><Text> Sign Up </Text></Button>
            )}

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
    marginTop: 190
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