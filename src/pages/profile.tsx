import React, { Component } from 'react'
import { ScrollView, View, Image, Text,TouchableOpacity, Alert, TextInput, ActivityIndicator, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import QRCode from 'react-native-qrcode-svg'
import capitalizeWords from '../functions/capitalizeWords'
import { getAccountInfo, editProfile } from '../api'
import { RNCamera } from 'react-native-camera';
import FastImage from 'react-native-fast-image'

import styles from '../styles/profile'
import { AuthContext } from '../context'

import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

const person = require('../assets/icons/person.png')
const rqr = require('../assets/icons/rqr.png')
const camera = require('../assets/icons/camera.png')
const pencil = require('../assets/icons/pencil.png')
const logo = require('../assets/miniLogoColored.png')


interface IProfileProps{
  navigation: any,
  authState: any
}

class Profile extends Component<IProfileProps>{
  constructor(props:any){
    super(props);
    this.state = {
      modal: false,
      edit: false,
      loading: true,
      accountInfo: undefined,
      inputName: undefined,
      inputEmail: undefined,
      inputPhone: undefined,
      camera: false,
      pictureCacheUri: undefined,
      name: '',
      email: '',
      fileName: null,
      file_image: null,
      data: null,
    }
  }
  camera
  componentDidMount = async () => {
    // try{
    //   this.setState({
    //     loading: true
    //   })
    //   let accountInfo
    //   if(this.props.authState.isSignedIn)
    //     accountInfo = await getAccountInfo({userId: this.props.authState._id, userToken: this.props.authState.token})
    //   console.log('accountInfo', accountInfo)
    //   if((this.props.authState.isSignedIn && accountInfo == undefined))
    //     throw new Error('failed to load data')
    //   this.setState({
    //     loading: false,
    //     // infoAndPromotions: data.data,
    //     accountInfo: this.props.authState.isSignedIn ? accountInfo.data : undefined
    //   }, () => console.log('state', this.state))
    // }catch(error){
    //   Alert.alert(
    //     "Network Error",
    //     "Failed to fetch data",
    //     [
    //       // { text: "Cancel", onPress: () => console.log("OK Pressed") },
    //       { text: "OK", onPress: () => this.setState({loading: false}) }
    //     ],
    //     { cancelable: false }
    //   )
    // }

    const check_login = await AsyncStorage.getItem('@id_login')

    if (check_login !== undefined){
      this.setState({
        id_login: check_login,
        loading: false,
      })
      // alert('berhasil')
    }

    axios.get('https://borneopoint.co.id/public/api/get_user', {params: {
      id_login: check_login
    }})
    .then(resp => {
      // alert(JSON.stringify(resp))
      this.setState({
        loading: false,
        name: resp.data.name,
        email: resp.data.email,
        profile: resp.data.profile,
        phone: resp.data.phone,
      })
    })
  }
  goTo = (routeName) => {
    try{
      this.props.navigation.navigate(routeName)
    }catch(error){ console.debug(error) }
  }
  confirmSignOut = () => {
    try{
      Alert.alert(
        "SignOut",
        "Confirm SignOut ?",
        [
          { text: "Cancel", onPress: () => console.log("OK Pressed") },
          { text: "OK", onPress: () => this.handleSignOut() }
        ],
        { cancelable: false }
      );
    }catch(error){
      console.debug(error)
    }
  }
  // createFormDataPhoto = (photo, id_login) => {
	// 	const data = new FormData();

	// 	if(this.state.fileName !== null) {
	// 		data.append('file_image', {
	// 			name : (photo.fileName == null)? 'myphoto': photo.fileName,
	// 			type : photo.type,
	// 			uri : photo.uri
	// 		});
	// 	}
	// 	data.append("id_login", id_login);
	// 	return data;
	// }
  confirmEdit = async () => {
    // try{
    //   this.setState({lodaing: true})
    //   const result = await editProfile({ userToken: String(this.props.authState.token), name: this.state.inputName, email: this.state.inputEmail, profilePicture: this.state.pictureCacheUri })
    //   this.setState({loading: false})
    //   console.log('result', result)
    //   if(result == undefined) throw new Error('fail')
    //   this.refresh()
    // }catch(error){
    //   console.log(error)
    //   Alert.alert(
    //     "Network Error",
    //     "Failed to fetch data",
    //     [
    //       // { text: "Cancel", onPress: () => console.log("OK Pressed") },
    //       { text: "OK", onPress: () => this.setState({loading: false}) }
    //     ],
    //     { cancelable: false }
    //   )
    // }

    const check_login = await AsyncStorage.getItem('@id_login')

    let formData = new FormData();

    if(this.state.data !== null) {
      formData.append("profile", {
        name: new Date().getTime()+'_'+check_login+'.jpg',
        uri: this.state.data.uri,
        type: 'image/jpg'
      });
    }

    formData.append("id_login", check_login);
    formData.append("name", this.state.inputName);
    formData.append("email", this.state.inputEmail);
    formData.append("phone", this.state.inputPhone);

    try {
      let response = await fetch('https://borneopoint.co.id/public/api/update_user_profile', {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });
      console.log( await response.json() )
      // console.log('berhasil')
      this.setState({
        edit: false,
      })
    }
    catch (error) {
      console.log('update_user_profile : ' + error);
    }
  }
  handleSignOut = async () => {
    try{
      await AsyncStorage.removeItem('@id_login')
      this.props.navigation.reset({
        routes: [{ name: 'Main' }],
      })
      console.log('berhasil')
    }catch(error){
      console.log(error)
    }
  }
  openMyQR = () => {
    this.setState({ modal: !this.state.modal })
  }
  refresh = () => {
    try{
      this.componentDidMount()
    }catch(error){
      console.log(error)
    }
  }
  takePicture = async () => {
    if (this.camera) {
      // const options = { quality: 0.5, base64: true };
      const options = { 
        quality: 0.5, 
        // exif: true, 
        writeExif: true, 
        mirrorImage: true, 
        // orientation: "portrait", 
        fixOrientation: true,
        // orientation: 'p'
        // base64: true
      }
      this.state.data = await this.camera.takePictureAsync(options);
      this.setState({pictureCacheUri : this.state.data.uri, camera: false})
      // console.log(data.uri);
    }
  }
  render = () => 
    <>
      {this.state.loading ?
        <View style={[ styless.container_loading, styless.horizontal_loading ]}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
        :
        null
      }
      {this.state.id_login !== null ? 
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{paddingTop: wp('5%'), paddingBottom: wp('5%')}}>
          <View style={{
            width: '100%',
            alignItems: 'center',
            position: 'relative'
          }}>
            {/* <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={{
                width: 120,
                height:120
              }}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              type={RNCamera.Constants.Type.back}
            /> */}
            <View style={{width: wp('35.55556%'), aspectRatio: 1/1, backgroundColor: '#ccc', borderRadius: 120, justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
              <FastImage
                source={this.state.pictureCacheUri ? { uri: this.state.pictureCacheUri } : this.state.profile ? { uri: 'https://borneopoint.co.id/public/storage/profile/'+this.state.profile } : person}
                style={{
                  width       : '100%',
                  aspectRatio : 1/1,
                  height      : '100%',
                  borderRadius: 120
                }}
              />
              {
                this.state.edit === true ?
                  <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0, width: '30%', backgroundColor: '#fff', elevation: 2, aspectRatio: 1/1, borderRadius: 64, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ camera: true })}>
                    <Image source={camera} style={{
                      width: '80%',
                      height: '80%'
                    }}/>
                  </TouchableOpacity> : null
              }
            </View>
            {/* <TouchableOpacity 
              onPress={this.openMyQR}
              style={{
                width           : wp('17.777778'),
                aspectRatio     : 1/1,
                backgroundColor : '#3269B3',
                borderRadius    : 120,
                overflow        : 'hidden',
                justifyContent  : 'center',
                alignItems      : 'center',
                position        : 'absolute',
                right           : wp('5%'),
              }}>
              <Image source={rqr} style={{ width: wp('8.888889%'), aspectRatio: 1/1}}/>
              <Text style={{color: 'white', fontSize: wp('2.77777%')}}>QR</Text>
            </TouchableOpacity> */}
          </View>
          <View style={{ marginTop: wp('5%'), marginLeft: wp('5%'), marginRight: wp('5%') }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              // backgroundColor: 'red'
            }}>
              <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Account</Text>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', elevation: 2, padding: wp('0.5%'), paddingLeft: wp('2%'), paddingRight: wp('2%'), borderRadius: 12, marginLeft: 'auto'}} onPress={() => {
                if(this.state.edit === false)
                  this.setState({ edit: true, inputName: this.state.name, inputEmail: this.state.email, inputPhone: this.state.phone })
                else
                  this.setState({ edit: false, inputName: undefined, inputEmail: undefined, inputPhone: undefined })
              }}>
                <Image source={pencil} style={{ width: wp('3%'), aspectRatio: 1/1}}/>
                <Text style={{marginLeft: wp('1%')}}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Name</Text>
              {
                this.state.edit !== true ? 
                  <Text style={styles.infoText}>{capitalizeWords(this.state.name)}</Text> :
                  <TextInput style={[styles.infoText, { borderColor: 'black', borderWidth: 1, borderRadius: 12}]} value={this.state.inputName} onChangeText={(value) => this.setState({ inputName: value })}/>
              }

            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoText}>{capitalizeWords(this.state.email)}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Phone</Text>
              {
                this.state.edit !== true ? 
                  <Text style={styles.infoText}>{capitalizeWords(this.state.phone)}</Text> :
                  <TextInput style={[styles.infoText, { borderColor: 'black', borderWidth: 1, borderRadius: 12}]} value={this.state.inputPhone} onChangeText={(value) => this.setState({ inputPhone: value })} keyboardType={'numeric'}/>
              }
            </View>
            {/* <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoText}></Text>
            </View> */}
            <View style={{marginTop: wp('4.44444445%')}}>
              <Text style={styles.infoTitle}>Security</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Password</Text>
              <TouchableOpacity style={styles.infoText} onPress={() => this.goTo('ResetPassword')}>
                <Text style={styles.resetPassText}>reset password</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: wp('4.44444445%')}}>
              <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Others</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>App Version</Text>
              <Text style={styles.infoText}>V 1.0.1</Text>
            </View>
            <TouchableOpacity style={styles.infoContainer} onPress={() => this.goTo('TermsAndCondition')}>
              <Text style={styles.resetPassText}>Terms & Condition</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoContainer} onPress={() => this.goTo('PrivacyPolicy')}>
              <Text style={styles.resetPassText}>Privacy Policy</Text>
            </TouchableOpacity>
            <View style={{flex: 1, marginTop: wp('10%'), alignItems: 'center'}}>
            {
              this.state.edit !== true ? 
                <TouchableOpacity style={styles.signOutButton} onPress={this.confirmSignOut}>
                  <Text style={styles.signOutText}>SignOut</Text>
                </TouchableOpacity> :
                <TouchableOpacity style={styles.signOutButton} onPress={this.confirmEdit}>
                  <Text style={styles.signOutText}>Edit</Text>
                </TouchableOpacity>
            }
            </View>
          </View>
        </ScrollView>
        {
          this.state.modal &&
            <TouchableOpacity style={{position:'absolute',bottom:0,alignSelf:'flex-end', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(44, 44, 44, 0.5)'}} onPress={this.openMyQR}>
              <View style={{backgroundColor: 'white', padding: wp('10%'), borderRadius: wp('5%')}}>
                <QRCode value={this.props.authState._id} size={wp('65%')} logo={logo} logoSize={wp('20%')} logoBackgroundColor={'#FFF'}/>
              </View>
            </TouchableOpacity>
        }
        {
          this.state.camera &&
          <TouchableOpacity style={{position:'absolute',bottom:0,alignSelf:'flex-end', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(44, 44, 44, 0.5)'}} onPress={() => this.setState({ camera: false })}>
            <View style={{backgroundColor: 'white', padding: wp('10%'), borderRadius: wp('5%'), width: wp('80%'), height: wp('80%'), justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
              <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={{ height: wp(50), width: wp(50)}}
                type={RNCamera.Constants.Type.front}
                // flashMode={RNCamera.Constants.FlashMode.on}
                ratio={"1:1"}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}/>
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center',  position: 'absolute', bottom: wp(2.5), right: wp(5), backgroundColor: '#3269B3', padding: wp(2.3), borderRadius: wp(2)}}>
                  <TouchableOpacity onPress={this.takePicture.bind(this)} style={{}}>
                    <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}> Take Picture </Text>
                  </TouchableOpacity>
                </View>
            </View>
            
          </TouchableOpacity> 
        }
      </View>
      : 
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Auth')}><Text style={{textDecorationLine: 'underline'}}>Please Login First</Text></TouchableOpacity>
      </View>
      }
    </>
}

export default (props) => 
  <AuthContext.Consumer>
  {
    authState => <Profile authState={authState} {...props}/>
  }
  </AuthContext.Consumer>

const styless = StyleSheet.create({
  container_loading: {
      flex: 1,
      position:'absolute',
      zIndex:2,
      width: '100%',
      height: '100%',
      justifyContent: "center",
      backgroundColor: 'rgba(0,0,0,0.1)'
  },
  
    horizontal_loading: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
  },
})