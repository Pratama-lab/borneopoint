import React, { Component } from 'react'
import { View,  TextInput, Text, TouchableOpacity, Image, Animated, Alert } from 'react-native'
import styles from '../styles/withdraw'
import { widthPercentageToDP as wp} from 'react-native-responsive-screen'
import validateAndConvertNumber from '../functions/validateAndConvertNumber'
import { withdraw } from '../api'
import {AuthContext} from '../context'



const moneyInactive = require('../assets/icons/moneyInactive.png')
const bcaLogo = require('../assets/icons/bca.png')
const mandiriLogo = require('../assets/icons/mandiri.png')
const cimbLogo = require('../assets/icons/cimb.png')
const bniLogo = require('../assets/icons/bni.png')
const money = require('../assets/icons/money.png')
const arrowDown = require('../assets/icons/arrowDown.png')

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
  <TouchableOpacity style={[styles.bankItem,style]} onPress={() => {
    console.log('dsadasd')
  }}>
    <Image source={imageLogoSwitch(type)} style={styles.bankLogo}/>
    <Text style={styles.bankText}>{title}</Text>
  </TouchableOpacity>

class Withdraw extends Component<any,any>{
  constructor(props){
    super(props)
  }
  state = {
    amount: '',
    bankDropDownActive: false,
    animatedDropDownHeight: new Animated.Value(0)
  }
  componentDidMount = () => {
    
  }
  confirmWithdraw = async () => {
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
      if(number < 1000)
        return Alert.alert(
          "Invalid amount",
          "Minimum Withdraw is Rp 1.000,00 !",
          [
            // { text: "Cancel", onPress: () => console.log("OK Pressed") },
            { text: "OK", }
          ],
          { cancelable: false }
        )
      const result = await withdraw({amount: number, userId: this.props.authState._id, userToken: this.props.authState.token})
      if(result == undefined)
        return Alert.alert(
          "Withdraw",
          "Withdraw failed!",
          [
            // { text: "Cancel", onPress: () => console.log("OK Pressed") },
            { text: "OK", }
          ],
          { cancelable: false }
        )
      else
        return Alert.alert(
          "Withdraw",
          "Withdraw success!",
          [
            // { text: "Cancel", onPress: () => console.log("OK Pressed") },
            { text: "OK", onPress: () => this.props.navigation.goBack() }
          ],
          { cancelable: false }
        )
      console.debug('WithdrawResult', result)
    }catch(error){
      console.debug(error)
    }
  }
  animateDropDown = (activate: boolean) => {
    Animated.timing(
      this.state.animatedDropDownHeight,
      {
        toValue: activate ? 1 : 0,
        duration: 300,
        useNativeDriver: false
      }
    ).start();
  }
  toggleDropDown = () => this.setState({ bankDropDownActive: !this.state.bankDropDownActive })
  onChamgeAmount = (text) => {
    this.setState({
      amount: text
    }, () => console.log(this.state.amount))
  }
  render = () => 
    <View style={styles.pageContainer}>
      <Text style={styles.bankTitle}>Bank</Text>
      <TouchableOpacity style={styles.dropDown} onPress={this.toggleDropDown}>
        <View style={styles.placeholderContainer}>
          <View style={styles.bankIconContainer}>
            <Image source={moneyInactive} style={styles.bankIcon}/>
          </View>
          <Text style={styles.placeholderBankText}>Choose Bank</Text>
          <View style={styles.bankIconContainer}>
            <Image source={arrowDown} style={styles.bankIcon}/>
          </View>
        </View>
        {/* <Animated.View 
          style={[
            styles.dropDownContainer,
            { display: this.state.animatedDropDownHeight ? 'flex' : 'none' },
            { opacity: this.state.animatedDropDownHeight }
          ]}>
          <BankItem type={'cimb'} title={'CIMB'} style={styles.bankItemMargin}/>
          <BankItem type={'mandiri'} title={'Mandiri'} style={styles.bankItemMargin}/>
          <BankItem type={'bni'} title={'BNI'} style={styles.bankItemMargin}/>
        </Animated.View> */}
        <View 
          style={[ styles.dropDownContainer ]}>
          <TouchableOpacity onPress={() => console.log('ssss')}>
            {/* <Text>sdadasdasd</Text> */}
          </TouchableOpacity>
        </View>
        
      </TouchableOpacity>
      <View style={styles.optionSectionContainer}>
        <Text style={styles.optionTitle}>Account Number</Text>
        <View style={styles.textInputContainer}>
          <TextInput placeholder={'Enter account number'} style={styles.textInput} keyboardType={'numeric'} placeholderTextColor={'#ccc'}/>
        </View>
      </View>
      <View style={styles.optionSectionContainer}>
        <Text style={styles.optionTitle}>Amount</Text>
        <View style={styles.textInputContainer}>
          <TextInput placeholder={'Enter withdraw amount'} style={styles.textInput} keyboardType={'numeric'} placeholderTextColor={'#ccc'} onChangeText={this.onChamgeAmount} />
        </View>
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={this.confirmWithdraw}>
        <Text style={styles.confirmButtonText} >Withdraw</Text>
      </TouchableOpacity>
    </View>
}

export default (props) => 
<AuthContext.Consumer>{
  authState => <Withdraw authState={authState} {...props}/>
}</AuthContext.Consumer>