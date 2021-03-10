import React, { Component } from 'react'
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, TextInput, ToastAndroid } from 'react-native'

import { SplashRoutingProps } from '../types/index'
import styles from '../styles/signIn'
import { widthPercentageToDP  as wp} from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient';
import AuthInput from '../components/authInput'
import GoogleButton from '../components/googleButton'
import FacebookButton from '../components/facebookButton'
import {AuthContext} from '../context'
import signUp from '../styles/signUp'
import {register} from '../api'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk';
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

const logo = require('../assets/logo.png');
const api_base_url = 'https://admin.borneopoint.co.id/api/';
//const api_base_url = 'http://10.10.11.10/api/';

class SignUp extends Component<any,{}>{
  constructor(props: any){
    super(props);
    this.state = {
      email: '',
      email_valid: '',
      email_native: '',
      phone_number: null
    }
  }
  private email
  private password
  private name
  componentDidMount = () => {
    GoogleSignin.configure({
      webClientId: '496131193989-aj85nal4bpq0dvmcnhis4u98ijn5pqi7.apps.googleusercontent.com',  // client ID of type WEB for your server (needed to verify user ID and offline access)
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '',  // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true  // [Android] related to `serverAuthCode`, read the docs link below *.
    })
  }

  getValueName = (text: string) => {
    this.name = text
  }

  getValueEmail = (text: string) => {
    this.email = text
  }

  getValuePassword = (text: string) => {
    this.password = text
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
      axios.get(api_base_url+'insert_user', {params:{
          nama: this.state.name,
          email: this.state.email,
          id_login: this.state.id_email,
      }})
      .then(async resp => {
        console.log(resp)
        AsyncStorage.setItem('@id_login', this.state.id_email)

        const check_login = await AsyncStorage.getItem('@id_login')

        axios.get(api_base_url+'get_user', {params: {
          id_login: check_login
        }})
        .then(resp => {
          if (resp.data.status === 'Inactive') {
            this.props.navigation.reset({
              routes: [{ name: 'KtpnPhone' }]
            })
          } else if (resp.data.status === 'Declined') {
            this.props.navigation.reset({
              routes: [{ name: 'KtpnPhone' }]
            })
          } else if (resp.data.status === 'Waiting') {
            this.props.navigation.reset({
              routes: [{ name: 'Waiting' }]
            })
          } else if (resp.data.status === 'Active') {
            this.props.navigation.reset({
              routes: [{ name: 'Main' }],
            })
          }
        })
      })
      .catch(err => {
        console.log(err.message);
        // console.log('Insert user: '+err)
        ToastAndroid.show('This account already exists', ToastAndroid.SHORT)
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

          axios.get(api_base_url+'insert_user', {params:{
            nama: this.state.userInfo.name,
            email: this.state.userInfo.email,
            id_login: this.state.userInfo.id,
          }})
          .then(async() => {
            AsyncStorage.setItem('@id_login', this.state.userInfo.id)

            const check_login = await AsyncStorage.getItem('@id_login')

            axios.get(api_base_url+'get_user', {params: {
              id_login: check_login
            }})
            .then(resp => {
              if (resp.data.status === 'Inactive') {
                this.props.navigation.reset({
                  routes: [{ name: 'KtpnPhone' }]
                })
              } else if (resp.data.status === 'Declined') {
                this.props.navigation.reset({
                  routes: [{ name: 'KtpnPhone' }]
                })
              } else if (resp.data.status === 'Waiting') {
                this.props.navigation.reset({
                  routes: [{ name: 'Waiting' }]
                })
              } else if (resp.data.status === 'Active') {
                this.props.navigation.reset({
                  routes: [{ name: 'Main' }],
                })
              }
            })
          })
          .catch(e => {
            // console.log('Lalalala => '+e)
            ToastAndroid.show('This account already exists', ToastAndroid.SHORT)
          })
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  handleFacebookSignIn = () => {
    // const result = await authenticateFacebook()
    // console.debug(result)
    
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
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

  // handleSignUp = async ({firebaseIdToken}: {firebaseIdToken?: string}) => {
  //   try{
  //     console.log(firebaseIdToken ? { email: this.email, password: this.password } : { firebaseIdToken })
  //     if(!firebaseIdToken && (this.password.length < 8))
  //       Alert.alert(
  //         "SignUp",
  //         "Password must be at least 8 character and contains 1 number",
  //         [
  //           { text: "OK", onPress: () => console.log("OK Pressed") }
  //         ],
  //         { cancelable: false }
  //       )
  //     else{
  //       const result:any = await register(firebaseIdToken == undefined ? { name:this.name, email: this.email, password: this.password } : { firebaseIdToken })
  //       if(result == undefined || result instanceof Error)
  //         Alert.alert(
  //           "SignUp",
  //           "SignUp failed",
  //           [
  //             { text: "OK", onPress: () => console.log("OK Pressed") }
  //           ],
  //           { cancelable: false }
  //         );
  //       console.debug('result', result)
  //       this.props.authState.setAuth({...result.data, token: result.token}, this.props.navigation.goBack)
  //     }
  //   }catch(error){
  //     console.debug(error)
  //   }
  // }

  signUp = () => {
    axios.get(api_base_url+'insert_user', {params:{
      nama: this.name,
      email: this.state.email_native,
      password: this.password,
      phone: this.state.phone_number
    }})
    .then((resp) => {
      console.log(resp.data.id_login)
      AsyncStorage.setItem('@id_login', resp.data.id_login)
      // this.props.navigation.pop('KtpnPhone')
      this.props.navigation.reset({
        routes: [{ name: 'KtpnPhone' }]
      })
    })
    .catch(err => {
      console.log("INSERT USER BY EMAIL => "+err)
    })
  }

  validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      this.setState({ email_native: text, email_valid: 'Email is Not Correct' })
      return false;
    }
    else {
      this.setState({ email_native: text, email_valid: 'Email is Correct' })
      console.log("Email is Correct");
    }
  }

  render = () => 
    <View style={styles.layout}>
      <LinearGradient colors={[ '#6FC3F7', '#3269B3']} style={styles.linearGradient}/>
      <View style={{
        display         : 'flex',
        flexDirection   : 'column',
        alignItems      : 'center',
        justifyContent  : 'center',
        marginTop       : wp('10%'),
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
        <Text style={styles.pageText}>Sign Up</Text>
        <AuthInput type={'name'} getValue={this.getValueName} style={styles.input}/>
        <View style={{ width: '100%', backgroundColor: 'white', height: wp('11%'), borderRadius: wp('2.22223%'), elevation: 4, flexDirection: 'row', marginTop: wp('3.334%') }}>
          <View style={{ height: '100%', marginLeft: wp('3%'), justifyContent: 'center' }}>
            <Image source={this.state.email_native === '' ? require('../assets/icons/email.png') : require('../assets/icons/emailBlack.png')} />
          </View>
          <View style={{ marginLeft: wp('3.8%') }}>
            <TextInput
              placeholder="email"
              style={{ fontSize: wp('4%'), width: wp('55%') }}
              keyboardType={'email-address'}
              onChangeText={(text) => this.validate(text)}
              value={this.state.email_native}
            />
          </View>
        </View>
        {this.state.email_valid === 'Email is Not Correct' ?
          <View style={{ width: '100%' }}>
            <Text style={{ color: 'red' }}>Email is not correct</Text>
          </View>
          :
          null
        }
        <AuthInput type={'password'} getValue={this.getValuePassword} style={styles.input}/>
        <TouchableOpacity style={styles.loginButton} onPress={() => this.signUp()}>
          <Text style={styles.loginText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.socialLoginContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.push('Phones')} style={{ width: wp('35%'), height: wp('11%'), backgroundColor: 'white', elevation: 4, borderRadius: wp('2.22223%'), alignItems: 'center', flexDirection: 'row' }}>
              <Image source={require('../assets/icons/phone-call.png')} style={{ width: wp('5%'), height: wp('5%'), marginLeft: wp('2%'), tintColor: '#00FF66' }} />
              <Text style={{ marginLeft: wp('2%'), fontSize: wp('3.5%') }}>Phone Number</Text>
            </TouchableOpacity>
          </View>
        <View style={styles.socialLoginContainer}>
          <GoogleButton onPress={this.handleGoogleSignIn} />
          <View style={styles.socialDistancing}/>
          <FacebookButton onPress={this.handleFacebookSignIn} />
        </View>
      </View>
      <Text style={styles.noAccountInfo}>Already have an account ? Click here <Text onPress={() => this.props.navigation.pop()} style={styles.linkText}>Sign In</Text></Text>
    </View>
}

export default (props) => 
<AuthContext.Consumer>
{
  authState => <SignUp authState={authState} {...props}/>
}
</AuthContext.Consumer>