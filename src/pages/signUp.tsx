import React, { Component } from 'react'
import { View, Text, Image, ActivityIndicator, TouchableOpacity,Alert } from 'react-native'

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

const logo = require('../assets/logo.png')

class SignUp extends Component<any,{}>{
  constructor(props: any){
    super(props)
  }
  private email
  private password
  private name
  componentDidMount = () => {
  
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
  navigateSignIn = () => {
    try{
      this.props.navigation.reset({
        routes: [{ name: 'SignIn' }],
      })
    }catch(error){ console.debug(error) }
  }
  handleSignUp = async ({firebaseIdToken}: {firebaseIdToken?: string}) => {
    try{
      console.log(firebaseIdToken ? { email: this.email, password: this.password } : { firebaseIdToken })
      if(!firebaseIdToken && (this.password.length < 8))
        Alert.alert(
          "SignUp",
          "Password must be at least 8 character and contains 1 number",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        )
      else{
        const result:any = await register(firebaseIdToken == undefined ? { name:this.name, email: this.email, password: this.password } : { firebaseIdToken })
        if(result == undefined || result instanceof Error)
          Alert.alert(
            "SignUp",
            "SignUp failed",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
        console.debug('result', result)
        this.props.authState.setAuth({...result.data, token: result.token}, this.props.navigation.goBack)
      }
    }catch(error){
      console.debug(error)
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
        <Text style={styles.pageText}>Sign Up</Text>
        <AuthInput type={'name'} getValue={this.getValueName} style={styles.input}/>
        <AuthInput type={'email'} getValue={this.getValueEmail} style={styles.input}/>
        <AuthInput type={'password'} getValue={this.getValuePassword} style={styles.input}/>
        <TouchableOpacity style={styles.loginButton} onPress={() => this.handleSignUp({})}>
          <Text style={styles.loginText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.socialLoginContainer}>
          <GoogleButton />
          <View style={styles.socialDistancing}/>
          <FacebookButton/>
        </View>
      </View>
      <Text style={styles.noAccountInfo}>Already have an account ? Click here <Text onPress={this.navigateSignIn} style={styles.linkText}>Sign In</Text></Text>
    </View>
}

export default (props) => 
<AuthContext.Consumer>
{
  authState => <SignUp authState={authState} {...props}/>
}
</AuthContext.Consumer>