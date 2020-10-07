import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import styles from '../styles/topUp'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import validateAndConvertNumber from '../functions/validateAndConvertNumber'
import axios from 'axios'
import {AuthContext} from '../context'
import AsyncStorage from '@react-native-community/async-storage'
import { topUp } from '../api'

const bcaLogo = require('../assets/icons/bca.png')
const mandiriLogo = require('../assets/icons/mandiri.png')
const cimbLogo = require('../assets/icons/cimb.png')
const bniLogo = require('../assets/icons/bni.png')
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
    default:
      return money
  }
}

class TopUp extends Component<any,any>{
  constructor(props){
    super(props)
  }
  state = {
    amount: undefined,
    payment_method: undefined
  }

  componentDidMount = async () => {
    
  }

  onChamgeAmount = (text) => {
    this.setState({
      amount: text
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
      if(this.state.payment_method != undefined){
        this.setState({loading: true})
        const check_login = await AsyncStorage.getItem('@id_login');
        axios.get('https://borneopoint.co.id/public/api/get_user', {params: {
          id_login: check_login
        }})
        .then(resp => {
          axios.get('https://borneopoint.co.id/public/api/topup_va_cimb_niaga', {params:{
            user_id: resp.data.id_login,
            name: resp.data.name,
            email: resp.data.email,
            payment_method: this.state.payment_method,
            amount: this.state.amount
          }})
          .then(resp => {
            this.setState({loading: false})
            console.log(resp.data)
          })
        })
        .catch(err => {
          console.log('Get User : '+err)
        })
      }else{
        alert('Please select payment method')
      }
    }else{
      alert('Please fill the amount')
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
    <View style={styles.pageContainer}>
      <View style={styles.optionSectionContainer}>
        <Text style={styles.optionTitle}>Amount</Text>
        <View style={{ borderRadius: widthPercentageToDP('2.222223%'), elevation: 2, marginTop: widthPercentageToDP('3%')}}>
          <TextInput  placeholder={'Enter TopUp amount'}  placeholderTextColor={'#ccc'} keyboardType={'numeric'} onChangeText={this.onChamgeAmount} onEndEditing={() => {}} style={{ paddingLeft: widthPercentageToDP('5%'), fontSize: widthPercentageToDP('4%')}}/>
        </View>
      </View>
      <View style={styles.optionSectionContainer}>
        <Text style={styles.optionTitle}>Bank Transfer</Text>
        <TouchableOpacity style={this.switchSelected('transfer_bca')} onPress={() => this.setState({payment_method: 'transfer_bca'})}>
          <Image source={imageLogoSwitch('bca')} style={styles.bankLogo} />
          <Text style={styles.bankText}>BCA</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionSectionContainer}>
        <Text style={styles.optionTitle}>Virtual Account</Text>
          <TouchableOpacity style={this.switchSelected('va_cimb_niaga')} onPress={() => this.setState({payment_method: 'va_cimb_niaga'})}>
            <Image source={imageLogoSwitch('cimb')} style={styles.bankLogo} />
            <Text style={styles.bankText}>CIMB</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.switchSelected('va_mandiri')} onPress={() => this.setState({payment_method: 'va_mandiri'})}>
            <Image source={imageLogoSwitch('mandiri')} style={styles.bankLogo} />
            <Text style={styles.bankText}>Mandiri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.switchSelected('va_bni')} onPress={() => this.setState({payment_method: 'va_bni'})}>
            <Image source={imageLogoSwitch('bni')} style={styles.bankLogo} />
            <Text style={styles.bankText}>BNI</Text>
          </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{alignSelf: 'center',
          marginTop: widthPercentageToDP('5%'),
          width: widthPercentageToDP('64.44444%'),
          aspectRatio: 232/48,
          backgroundColor: '#3269B3',
          borderRadius: widthPercentageToDP('2.22223%'),
          justifyContent: 'center',
          alignItems: 'center'
        }} onPress={this.confirmTopUp}>
        <Text style={{
          fontSize: widthPercentageToDP('5%'),
          color: 'white',
          fontFamily: 'Ubuntu-Bold'
        }}>TopUp</Text>
      </TouchableOpacity>
    </View>
}

export default (props) => 
<AuthContext.Consumer>{
  authState => <TopUp authState={authState} {...props}/>
}</AuthContext.Consumer>