import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import styles from '../styles/topUp'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import validateAndConvertNumber from '../functions/validateAndConvertNumber'

import {AuthContext} from '../context'

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
    amount: undefined
  }
  onChamgeAmount = (text) => {
    this.setState({
      amount: text
    }, () => console.log(this.state.amount))
  }
  confirmTopUp = async () => {
    try{
      console.log('dasdsa')
      console.log(this.state.amount)
      if(this.state?.amount === undefined || this.state?.amount === null) 
        return Alert.alert(
          "Amount",
          "Please enter amount !",
          [
            // { text: "Cancel", onPress: () => console.log("OK Pressed") },
            { text: "OK", }
          ],
          { cancelable: false }
        )
      const number = validateAndConvertNumber(this.state.amount)
      if(number == undefined) 
        return Alert.alert(
          "Invalid",
          "Please enter a valid number !",
          [
            // { text: "Cancel", onPress: () => console.log("OK Pressed") },
            { text: "OK", }
          ],
          { cancelable: false }
        )
      if(number < 10000)
        return Alert.alert(
          "Invalid amount",
          "Minimum TopUp is Rp 10.000,00 !",
          [
            // { text: "Cancel", onPress: () => console.log("OK Pressed") },
            { text: "OK", }
          ],
          { cancelable: false }
        )
      const result = await topUp({amount: number, userId: this.props.authState._id, userToken: this.props.authState.token})
      if(result == undefined)
        return Alert.alert(
          "TopUp",
          "TopUp failed!",
          [
            // { text: "Cancel", onPress: () => console.log("OK Pressed") },
            { text: "OK", }
          ],
          { cancelable: false }
        )
      else
        return Alert.alert(
          "TopUp",
          "TopUp success!",
          [
            // { text: "Cancel", onPress: () => console.log("OK Pressed") },
            { text: "OK", onPress: () => this.props.navigation.goBack() }
          ],
          { cancelable: false }
        )
      console.debug('topUpResult', result)
    }catch(error){
      console.debug(error)
    }
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
        <BankItem type={'bca'} title={'BCA'} style={styles.bankItemMargin}/>
      </View>
      <View style={styles.optionSectionContainer}>
        <Text style={styles.optionTitle}>Virtual Account</Text>
        <BankItem type={'cimb'} title={'CIMB'} style={styles.bankItemMargin}/>
        <BankItem type={'mandiri'} title={'Mandiri'} style={styles.bankItemMargin}/>
        <BankItem type={'bni'} title={'BNI'} style={styles.bankItemMargin}/>
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