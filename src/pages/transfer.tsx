import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import styles from '../styles/topUp'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import capitalizeWords from '../functions/capitalizeWords'

import validateAndConvertNumber from '../functions/validateAndConvertNumber'

import {AuthContext} from '../context'

import { transfer, userSearch } from '../api'

const bcaLogo = require('../assets/icons/bca.png')
const mandiriLogo = require('../assets/icons/mandiri.png')
const cimbLogo = require('../assets/icons/cimb.png')
const bniLogo = require('../assets/icons/bni.png')
const money = require('../assets/icons/money.png')
const person = require('../assets/icons/person.png')


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

const BankItem = ({ type, title, style } : { title: string, type: string, style?: any }) => 
  <TouchableOpacity style={[styles.bankItem,style]}>
    <Image source={imageLogoSwitch(type)} style={styles.bankLogo}/>
    <Text style={styles.bankText}>{title}</Text>
  </TouchableOpacity>

class TopUp extends Component<any,any>{
  constructor(props){
    super(props)
  }
  state = {
    amount: undefined,
    email: undefined,
    accountInfo: undefined,
    gettingAccountInfo: false
  }
  onChamgeAmount = (text) => {
    this.setState({ amount: text })
  }
  onChangeEmail = (text) => {
    this.setState({ email: text })
  } 
  checkAccount = async () => {
    try{
      this.setState({ gettingAccountInfo: true })
      console.log('email',this.state.email)
      const result = await userSearch({email: this.state.email})
      this.setState({ gettingAccountInfo: false })
      if(!result) return Alert.alert("Check","User not found",[{ text: "OK", }],{ cancelable: false })
      console.debug('accountInfo result', result)
      this.setState({ accountInfo: result.data }, () => console.log(this.state))
    }catch(error){ console.debug(error) }
  }
  confirmTransfer = async () => {
    try{
      if(this.state?.amount === undefined || this.state?.amount === null) 
        return Alert.alert("Amount","Please enter amount !",[{ text: "OK", }],{ cancelable: false })
      const number = validateAndConvertNumber(this.state.amount)
      if(number == undefined) 
        return Alert.alert("Invalid","Please enter a valid number !",[{ text: "OK", }],{ cancelable: false })
      if(number < 1000)
        return Alert.alert("Invalid amount","Minimum Transfer is Rp 1.000,00 !",[{ text: "OK", }],{ cancelable: false })
      if(this.state.accountInfo == undefined)
        return Alert.alert("Transfer","Please check the account first",[{ text: "OK", }],{ cancelable: false })
      if(this.state?.accountInfo?.email == this.props.authState?.email)
        return Alert.alert("Transfer Error","Cannot send to yourself",[{ text: "OK", }],{ cancelable: false })

      const result = await transfer({amount: number, userId: this.props.authState._id, userToken: this.props.authState.token, to: this.state?.accountInfo?._id})
      if(result == undefined)
        return Alert.alert("Transfer", "Transfer failed!", [{ text: "OK", }],{ cancelable: false })
      else
      return Alert.alert("Transfer", "Transfer success!", [{text: "OK", onPress: () => this.props.navigation.goBack()}], { cancelable: false })
      console.debug('topUpResult', result)
    }catch(error){ console.debug(error) }
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
        <Text style={styles.optionTitle}>Email</Text>
        <View style={{ borderRadius: widthPercentageToDP('2.222223%'), elevation: 2, marginTop: widthPercentageToDP('3%'), flexDirection: 'row', aspectRatio: 328/46, overflow: 'hidden', width: widthPercentageToDP('90%')}}>
          <TextInput placeholder={'Enter user email address'} autoCapitalize={'none'} placeholderTextColor={'#ccc'} keyboardType={'email-address'} onChangeText={this.onChangeEmail} onEndEditing={() => {}} style={{flex:1 , paddingLeft: widthPercentageToDP('5%'), fontSize: widthPercentageToDP('4%')}}/>
          <TouchableOpacity style={{ width: widthPercentageToDP('20%'), backgroundColor: '#3269B3', justifyContent: 'center', alignItems: 'center'}} onPress={this.checkAccount}>{
            this.state.gettingAccountInfo ?             
              <ActivityIndicator size="large" color="white"/> :             
              <Text style={{fontSize: widthPercentageToDP('4%'), color: 'white', fontWeight: 'bold'}}>Check</Text>
          }</TouchableOpacity>
        </View>
      </View>
      {
        this.state.accountInfo !== undefined ? 
          // true ?
          <View style={{width: widthPercentageToDP('90%'), elevation: 2, alignSelf: 'center', marginTop: widthPercentageToDP('5%'), backgroundColor: 'white', borderRadius: widthPercentageToDP('2.22233%'), paddingTop: widthPercentageToDP('2.5%'), paddingBottom: widthPercentageToDP('2.5%'), flexDirection: 'row'}}>
            <View style={{ 
              marginLeft: widthPercentageToDP('5%'),
              marginRight: widthPercentageToDP('5%'),
              width: widthPercentageToDP('13.33334%'), 
              aspectRatio: 1/1, 
              borderRadius: widthPercentageToDP('50%'), 
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ccc'
            }}>
              <Image source={person} style={{backgroundColor: '#ccc',}}/>
            </View>
            <View style={{flex:1, justifyContent: 'center'}}>
              <Text 
              numberOfLines={1}
              style={{
                fontWeight  : 'bold',
                fontSize    : widthPercentageToDP('3.8889%')}}>
                { capitalizeWords( this.state?.accountInfo?.name)}
                </Text>
            </View>
          </View> : null
      }
      <TouchableOpacity 
        style={{alignSelf: 'center',
          marginTop: widthPercentageToDP('5%'),
          width: widthPercentageToDP('64.44444%'),
          aspectRatio: 232/48,
          backgroundColor: this.state.accountInfo === undefined ? '#ccc' : '#3269B3',
          borderRadius: widthPercentageToDP('2.22223%'),
          justifyContent: 'center',
          alignItems: 'center'
        }} onPress={this.confirmTransfer} disabled={this.state.accountInfo === undefined}>
        <Text style={{
          fontSize: widthPercentageToDP('5%'),
          color: 'white',
          fontFamily: 'Ubuntu-Bold'
        }}>Transfer</Text>
      </TouchableOpacity>
    </View>
}

export default (props) => 
<AuthContext.Consumer>{
  authState => <TopUp authState={authState} {...props}/>
}</AuthContext.Consumer>