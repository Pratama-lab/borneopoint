import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator, StyleSheet, BackHandler } from 'react-native'
import styles from '../styles/topUp'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import validateAndConvertNumber from '../functions/validateAndConvertNumber'
import axios from 'axios'
import {AuthContext} from '../context'
import AsyncStorage from '@react-native-community/async-storage'
import { topUp } from '../api'

const bcaLogo = require('../assets/images/bca.png')
const mandiriLogo = require('../assets/images/mandiri.png')
const cimbLogo = require('../assets/icons/cimb3x.png')
const bniLogo = require('../assets/images/bni.png')
const bagLogo = require('../assets/images/client-bag.png')
const indomartLogo = require('../assets/images/LogoIndomaret.png')
const alfamartLogo = require('../assets/images/alfamart_new.png')
const money = require('../assets/icons/money.png')

const imageLogoSwitch = (type:string) => {
  switch(type){
    case 'bca': 
      return bcaLogo
    case 'mandiri':
      return mandiriLogo
    case 'cimb':
      return cimbLogo
    case 'bni':
      return bniLogo
    case 'bag':
      return bagLogo
    case 'indomart':
      return indomartLogo
    case 'alfamart':
      return alfamartLogo
    default:
      return money
  }
}

class TopUp extends Component<any,any>{
  constructor(props){
    super(props)
    this.state = {
      amount: undefined,
      payment_method: undefined,
      loading: true
    }
  }

  componentDidMount = async () => {
    this.setState({
      loading: false
    })
  }

  componentWillMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.pop();
    return true;
  }

  onChamgeAmount = (text) => {
    this.setState({
      amount: text*1
    }, () => console.log(this.state.amount))
  }

  switchSelected = (payment_method) => {
    if(this.state.payment_method === payment_method){
      return [styles.bankItemSelected,styles.bankItemMargin];
    }else{
      return [styles.bankItem,styles.bankItemMargin];
    }
  } 

  confirmTopUp = async () => {
    if (this.state.amount !== '' && this.state.amount !== undefined){
      if(this.state.payment_method !== undefined){
        this.setState({loading: true})
        const check_login = await AsyncStorage.getItem('@id_login');
        axios.get('https://borneopoint.co.id/api/get_user', {params: {
          id_login: check_login
        }})
        .then(resp => {
          axios.post('https://borneopoint.co.id/api/borneo_topup', {
            id_login: resp.data.id_login,
            payment_method: this.state.payment_method,
            amount: this.state.amount
          })
          .then(resp => {
            console.log(resp.data)
            this.setState({loading: false})
            if(typeof resp.data.status !== 'undefined' && resp.data.status != 200 && typeof resp.data.message !== 'undefined'){
              Alert.alert('',resp.data.message)
            }else{
              this.props.navigation.push('ongoingPayment', {data: resp.data});
            }
          }).catch(e => console.log("confirmTOPUP ===> ", e.message))
        })
        .catch(err => {
          console.log('Get User : '+err)
        })
      }else{
        Alert.alert('','Please select payment method')
      }
    }else{
      Alert.alert('','Please fill the amount')
    }
    
    // try{
    //   console.log('dasdsa')
    //   console.log(this.state.amount)
    //   if(this.state?.amount === undefined || this.state?.amount === null) 
    //     return Alert.alert(
    //       "Amount",
    //       "Please enter amount !",
    //       [
    //         // { text: "Cancel", onPress: () => console.log("OK Pressed") },
    //         { text: "OK", }
    //       ],
    //       { cancelable: false }
    //     )
    //   const number = validateAndConvertNumber(this.state.amount)
    //   if(number == undefined) 
    //     return Alert.alert(
    //       "Invalid",
    //       "Please enter a valid number !",
    //       [
    //         // { text: "Cancel", onPress: () => console.log("OK Pressed") },
    //         { text: "OK", }
    //       ],
    //       { cancelable: false }
    //     )
    //   if(number < 10000)
    //     return Alert.alert(
    //       "Invalid amount",
    //       "Minimum TopUp is Rp 10.000,00 !",
    //       [
    //         // { text: "Cancel", onPress: () => console.log("OK Pressed") },
    //         { text: "OK", }
    //       ],
    //       { cancelable: false }
    //     )
    //   const result = await topUp({amount: number, userId: this.props.authState._id, userToken: this.props.authState.token})
    //   if(result == undefined)
    //     return Alert.alert(
    //       "TopUp",
    //       "TopUp failed!",
    //       [
    //         // { text: "Cancel", onPress: () => console.log("OK Pressed") },
    //         { text: "OK", }
    //       ],
    //       { cancelable: false }
    //     )
    //   else
    //     return Alert.alert(
    //       "TopUp",
    //       "TopUp success!",
    //       [
    //         // { text: "Cancel", onPress: () => console.log("OK Pressed") },
    //         { text: "OK", onPress: () => this.props.navigation.goBack() }
    //       ],
    //       { cancelable: false }
    //     )
    //   console.debug('topUpResult', result)
    // }catch(error){
    //   console.debug(error)
    // }
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
    <ScrollView>
      <View style={styles.pageContainer}>
        <View style={styles.optionSectionContainer}>
          <Text style={styles.optionTitle}>Amount</Text>
          <View style={{ borderRadius: wp('2.222223%'), elevation: 2, marginTop: wp('3%'), backgroundColor: '#FFF' }}>
            <TextInput  placeholder={'Enter TopUp amount'}  placeholderTextColor={'#ccc'} keyboardType={'numeric'} onChangeText={this.onChamgeAmount} onEndEditing={() => {}} style={{ paddingLeft: wp('5%'), fontSize: wp('4%')}}/>
          </View>
        </View>
        <View style={styles.optionSectionContainer}>
          <Text style={styles.optionTitle}>Bank Transfer</Text>
          <TouchableOpacity style={this.switchSelected('bca')} onPress={() => this.setState({payment_method: 'bca'})}>
            <Image source={imageLogoSwitch('bca')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('5%') }]} />
            <Text style={styles.bankText}>BCA</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionSectionContainer}>
          <Text style={styles.optionTitle}>Virtual Account</Text>
          <TouchableOpacity style={this.switchSelected('cimb')} onPress={() => this.setState({payment_method: 'cimb'})}>
            <Image source={imageLogoSwitch('cimb')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('5%') }]} />
            <Text style={styles.bankText}>CIMB</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.switchSelected('mandiri')} onPress={() => this.setState({payment_method: 'mandiri'})}>
            <Image source={imageLogoSwitch('mandiri')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('5%') }]} />
            <Text style={styles.bankText}>Mandiri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.switchSelected('bni')} onPress={() => this.setState({payment_method: 'bni'})}>
            <Image source={imageLogoSwitch('bni')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('4%') }]} />
            <Text style={styles.bankText}>BNI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.switchSelected('bag')} onPress={() => this.setState({payment_method: 'bag'})}>
            <Image source={imageLogoSwitch('bag')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('5%') }]} />
            <Text style={styles.bankText}>BAG</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionSectionContainer}>
          <Text style={styles.optionTitle}>Physical Merchant</Text>
          <TouchableOpacity style={this.switchSelected('indomaret')} onPress={() => this.setState({payment_method: 'indomaret'})}>
            <Image source={imageLogoSwitch('indomart')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('4.5%') }]} />
            <Text style={styles.bankText}>Indomaret</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.switchSelected('alfamart')} onPress={() => this.setState({payment_method: 'alfamart'})}>
            <Image source={imageLogoSwitch('alfamart')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('4.5%') }]} />
            <Text style={styles.bankText}>Alfamart</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{alignSelf: 'center',
            marginTop: wp('5%'),
            marginBottom: wp('5%'),
            width: wp('64.44444%'),
            aspectRatio: 232/48,
            backgroundColor: '#3269B3',
            borderRadius: wp('2.22223%'),
            justifyContent: 'center',
            alignItems: 'center'
          }} onPress={this.confirmTopUp}>
          <Text style={{
            fontSize: wp('5%'),
            color: 'white',
            fontFamily: 'Ubuntu-Bold'
          }}>TopUp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </>
}

export default (props) => 
<AuthContext.Consumer>{
  authState => <TopUp authState={authState} {...props}/>
}</AuthContext.Consumer>

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