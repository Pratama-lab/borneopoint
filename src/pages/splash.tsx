import React, { Component } from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native'
import auth from '@react-native-firebase/auth'
import { SplashRoutingProps } from '../types/index'
import styles from '../styles/splash'
import { widthPercentageToDP  as wp} from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../context'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

class Splash extends Component<any,{}>{
  constructor(props: any){
    super(props)
  }
  componentDidMount = async  () => {
    // setTimeout(() => {
    //   try{
    //     const routeNames = this.props.navigation.dangerouslyGetState().routeNames
    //     // console.log(routeNames.indexOf(("Auth")))
    //     // if(routeNames.indexOf(("Auth")) !== -1)
    //     //   this.props.navigation.reset({
    //     //     routes: [{ name: 'Main' }],
    //     //   })
    //     // else
    //     //   this.props.navigation.reset({
    //     //     routes: [{ name: 'Main' }],
    //     //   })
    //     this.props.navigation.reset({
    //         routes: [{ name: 'Main' }],
    //       })
    //   }catch(error){
    //     console.error(error)
    //   }
    // },1000)
    // await this.props.authState.setup()
    // this.props.navigation.reset({
    //   routes: [{ name: 'Main' }],
    // })

    auth().onAuthStateChanged(async user => {
      if (user) {
        console.log("logged in");
        // console.log("phone => ", await AsyncStorage.getItem('@phone'))
        if (await AsyncStorage.getItem('@id_login') !== null) {
          const id_login = await AsyncStorage.getItem('@id_login')
          axios.get('https://admin.borneopoint.co.id/api/get_user', {params: {
            id_login: id_login
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
              this.props.authState.setup()
              this.props.navigation.reset({
                routes: [{ name: 'Main' }],
              })
            }
          })
        } else if (await AsyncStorage.getItem('@phone') !== null) {
          this.props.navigation.reset({
            routes: [{ name: 'inputName' }],
          })
        }
      } else {
        console.log("not logged in");
      }
    });

    const check_login = await AsyncStorage.getItem('@id_login')

    if (check_login !== null){
      axios.get('https://admin.borneopoint.co.id/api/get_user', {params: {
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
          this.props.authState.setup()
          this.props.navigation.reset({
            routes: [{ name: 'Main' }],
          })
        }
      })
    } else {
      this.props.authState.setup()
      this.props.navigation.reset({
        routes: [{ name: 'Main' }],
      })
    }
  }
  render = () => 
    <View style={styles.layout}>
      <LinearGradient colors={[ '#6FC3F7', '#3269B3']} style={styles.linearGradient}/>
      <View style={styles.logoContainer}>
        <View style={styles.logoImageContainer}>
          <Image 
            source={require('../assets/logo.png')} 
            resizeMode={'contain'}
            style={styles.logoImage}/>
        </View>
        {/* <Text style={styles.logoNameText}>BorneoPay</Text> */}
      </View>
      <View style={{flex: 1}}/>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white"/>
        <Text style={styles.loadingText}>L O A D I N G . . .</Text>
        <Text style={styles.appVersionText}>V 0.0.1</Text>
      </View>
    </View>
}

export default  (props) => 
<AuthContext.Consumer>
{
  authState => <Splash authState={authState} {...props}/>
}
</AuthContext.Consumer>