import React, { Component } from 'react'
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

import styles from '../styles/signIn'
import { widthPercentageToDP  as wp} from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import AuthInput from '../components/authInput'
import GoogleButton from '../components/googleButton'
import FacebookButton from '../components/facebookButton'
import Logo from '../components/Logo'

import googleSignIn from '../functions/googleSignIn'
import authenticateFacebook from '../functions/authenticateFacebook'
import AsyncStorage from '@react-native-community/async-storage'
import { login } from '../api'
import axios from 'axios'

import {AuthContext} from '../context'
// import { ScrollView } from 'react-native-gesture-handler'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk';

const logo = require('../assets/logo.png')

class SignIn extends Component<any,{}>{
  constructor(props: any){
    super(props)
    // this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this)
  }
  private email
  private password
  componentDidMount = () => {
    GoogleSignin.configure({
      webClientId: '496131193989-aj85nal4bpq0dvmcnhis4u98ijn5pqi7.apps.googleusercontent.com',  // client ID of type WEB for your server (needed to verify user ID and offline access)
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '',  // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true  // [Android] related to `serverAuthCode`, read the docs link below *.
    })
  }
  getValueEmail = (text: string) => {
    this.email = text
  }
  getValuePassword = (text: string) => {
    this.password = text
  }
  goTo = (title, params?: any) => {
    try{
      this.props.navigation.navigate(title, params)
    }catch(error){ console.debug(error) }
  }
  navigateRegister = () => {
    try{
      this.props.navigation.reset({
        routes: [{ name: 'SignUp' }],
      })
    }catch(error){ console.debug(error) }
  }
  handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({
        name: userInfo.user.name,
        email: userInfo.user.email,
        id_email: userInfo.user.id,
        photo: userInfo.user.photo
      })
      console.log(userInfo)
      axios.get('https://borneopoint.co.id/public/api/insert_user', {params:{
          nama: this.state.name,
          email: this.state.email,
          id_login: this.state.id_email,
      }})
      .then(resp => {
        console.log(resp)
        AsyncStorage.setItem('@id_login', this.state.id_email)
        this.goTo('Home')
      })
      .catch(err => {
        console.log('Insert user: '+err)
      })
    }
    catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('SIGN_IN_CANCELLED')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('IN_PROGRESS')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE')
      } else {
        console.log(error)
      }
    }
  }
  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, user) => {
        if (error) {
          console.log('login info has error: ' + error);
          Alert.alert('Error fetching data: ' + error.toString());
        } else {
          this.setState({
            userInfo: user,
          });
          // alert(JSON.stringify(user));
          // console.log('result:', user);

          axios.get('https://borneopoint.co.id/public/api/insert_user', {params:{
            nama: this.state.userInfo.name,
            email: this.state.userInfo.email,
            id_login: this.state.userInfo.id,
          }})
          .then(() => {
            AsyncStorage.setItem('@id_login', this.state.userInfo.id)
            this.goTo('Home')
          })
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };
  handleFacebookSignIn = () => {
    // const result = await authenticateFacebook()
    // console.debug(result)
    
    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            this.getInfoFromToken(accessToken);
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  }
  handleLogin = async ({firebaseIdToken}: {firebaseIdToken?: string}) => {
    try{
      console.debug('firebaseIdToken',firebaseIdToken)
      console.log(firebaseIdToken == undefined ? { email: this.email, password: this.password } : { firebaseIdToken })
      const result = await login(firebaseIdToken == undefined ? { email: this.email, password: this.password } : { firebaseIdToken })
      if(result == undefined || result instanceof Error)
        Alert.alert(
          "SignIn",
          "SignIn failed",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      console.debug('result', result)
      this.props.authState.setAuth({...result.data, token: result.token}, this.props.navigation.goBack)
    }catch(error){
      console.debug(error)
    }
  }
  render = () => 
    // <KeyboardAvoidingView 
    //   behavior={Platform.OS == "ios" ? "padding" : "height"} style={{flex: 1}}>
      <View style={styles.layout}>
          
        <LinearGradient colors={[ '#6FC3F7', '#3269B3']} style={styles.linearGradient}/>
        <View style={{
          display         : 'flex',
          flexDirection   : 'column',
          alignItems      : 'center',
          justifyContent  : 'center',
          marginTop       : wp('20%'),
          zIndex          : 1
        }}>
          <View style={styles.logoImageContainer}>
            <Image 
              source={logo}
              resizeMode={'contain'}
              style={styles.logoImage}/>
          </View>
          {/* <Text style={styles.logoNameText}>BorneoPay</Text> */}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.pageText}>Sign In</Text>
          <AuthInput type={'email'} getValue={this.getValueEmail} style={styles.input}/>
          <AuthInput type={'password'} getValue={this.getValuePassword} style={styles.input}/>
          <TouchableOpacity style={styles.loginButton} onPress={() => this.handleLogin({})}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
          <View style={styles.socialLoginContainer}>
            <GoogleButton onPress={this.handleGoogleSignIn}/>
            <View style={styles.socialDistancing}/>
            <FacebookButton onPress={this.handleFacebookSignIn}/>
          </View>
        </View>
        <Text style={styles.noAccountInfo}>Don’t have an account ? Click here <Text onPress={this.navigateRegister} style={styles.linkText}>Register</Text></Text>
        <Text style={styles.forgotPassword}>Forgot password ?</Text>
      </View>
    // </KeyboardAvoidingView>
}

export default (props) => 
<AuthContext.Consumer>
{
  authState => <SignIn authState={authState} {...props}/>
}
</AuthContext.Consumer>