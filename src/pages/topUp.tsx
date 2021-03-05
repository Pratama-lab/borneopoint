import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
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
      loading: true,
      fee: [0],
      free_fee: '',
      coupon: undefined,
      discount: undefined,
      code: undefined,
      gettingAccountInfo: false,
      discount_not_valid: undefined,
    }
  }

  componentDidMount = async () => {
    axios.get('https://admin.borneopoint.co.id/api/topup_method')
    .then(resp => {
      console.log(resp.data)
      this.setState({
        loading: false,
        fee: resp.data,
        free_fee: resp.data,
      })
    })
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

  format = (x) => {
    if(/^\d+$/.test(x.toString().trim()) === true){
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return parts.join(".");
    }else{
      return x;
    }
  }

  check_coupon = async () => {
    this.setState({ gettingAccountInfo: true })

    const id_login = await AsyncStorage.getItem('@id_login')

    axios.post('https://admin.borneopoint.co.id/api/check_coupon', {code: this.state.coupon, id_login: id_login})
    .then(resp => {
      console.log('Check Coupoon => '+JSON.stringify(resp))
      if (resp.data === '') {
        this.setState({
          gettingAccountInfo: false,
          discount_not_valid: 'Voucher is not valid',
          discount: undefined,
          code: undefined
        })
      } else {
        this.setState({
          gettingAccountInfo: false,
          discount: resp.data.discount,
          code: resp.data.code
        })
      }
    })
    .catch(err => {
      console.debug('Check Coupon Error => '+err)
    })
  }

  confirmTopUp = async () => {
    if (this.state.amount !== '' && this.state.amount !== undefined){
      if(this.state.payment_method !== undefined){
        this.setState({loading: true})
        const check_login = await AsyncStorage.getItem('@id_login');
        axios.get('https://admin.borneopoint.co.id/api/get_user', {params: {
          id_login: check_login
        }})
        .then(resp => {
          console.log( {
            id_login: resp.data.id_login,
            payment_method: this.state.payment_method,
            amount: this.state.amount,
            deposit_fee: this.state.final_fee,
            coupon: this.state.code
          })
          axios.post('https://admin.borneopoint.co.id/api/borneo_topup', {
            id_login: resp.data.id_login,
            payment_method: this.state.payment_method,
            amount: this.state.amount,
            deposit_fee: this.state.final_fee,
            coupon: this.state.code
          })
          .then(resp => {
            console.log(resp.data)
            this.setState({loading: false})
            if(typeof resp.data.status !== 'undefined' && resp.data.status != 200 && typeof resp.data.message !== 'undefined'){
              Alert.alert('',resp.data.message)
            }else{
              this.props.navigation.push('ongoingPayment', {data: resp.data});
            }
          }).catch(error => {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          })
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
          {this.state.payment_method === 'bca' && this.state.amount !== undefined && this.state.amount !== 0 ?
            <>
              {this.state.amount < this.state.fee[0].free_fee ?
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp {this.state.fee[0].fee}</Text>
                :
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp 0</Text>
              }
            </>
            : null
          }
          {this.state.payment_method === 'indomaret' && this.state.amount !== undefined && this.state.amount !== 0 ?
            <>
              {this.state.amount < this.state.fee[1].free_fee ?
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp {this.state.fee[1].fee}</Text>
                :
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp 0</Text>
              }
            </>
            : null
          }
          {this.state.payment_method === 'alfamart' && this.state.amount !== undefined && this.state.amount !== 0 ?
            <>
              {this.state.amount < this.state.fee[2].free_fee ?
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp {this.state.fee[2].fee}</Text>
                :
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp 0</Text>
              }
            </>
            : null
          }
          {this.state.payment_method === 'cimb' && this.state.amount !== undefined && this.state.amount !== 0 ?
            <>
              {this.state.amount < this.state.fee[3].free_fee ?
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp {this.state.fee[3].fee}</Text>
                :
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp 0</Text>
              }
            </>
            : null
          }
          {this.state.payment_method === 'bni' && this.state.amount !== undefined && this.state.amount !== 0 ?
            <>
              {this.state.amount < this.state.fee[4].free_fee ?
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp {this.state.fee[4].fee}</Text>
                :
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp 0</Text>
              }
            </>
            : null
          }
          {this.state.payment_method === 'bag' && this.state.amount !== undefined && this.state.amount !== 0 ?
            <>
              {this.state.amount < this.state.fee[5].free_fee ?
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp {this.state.fee[5].fee}</Text>
                :
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp 0</Text>
              }
            </>
            : null
          }
          {this.state.payment_method === 'mandiri' && this.state.amount !== undefined && this.state.amount !== 0 ?
            <>
              {this.state.amount < this.state.fee[6].free_fee ?
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp {this.state.fee[6].fee}</Text>
                :
                <Text style={{ fontSize: wp('3%') }}>Fee Transaksi: Rp 0</Text>
              }
            </>
            : null
          }

          <Text style={[styles.optionTitle, { marginTop: wp('5%') }]}>Claim Coupon</Text>
          <View style={{ borderRadius: wp('2.222223%'), elevation: 2, marginTop: wp('3%'), flexDirection: 'row', aspectRatio: 328/46, overflow: 'hidden', width: wp('90%')}}>
            <TextInput placeholder={'Enter Coupon Code'} autoCapitalize={'none'} placeholderTextColor={'#ccc'} onChangeText={(text) => this.setState({ coupon: text })} style={{flex:1 , paddingLeft: wp('5%'), fontSize: wp('4%')}}/>
            <TouchableOpacity style={{ width: wp('20%'), backgroundColor: '#3269B3', justifyContent: 'center', alignItems: 'center'}} onPress={this.check_coupon}>{
              this.state.gettingAccountInfo ?             
                <ActivityIndicator size="large" color="white"/> :             
                <Text style={{fontSize: wp('4%'), color: 'white', fontWeight: 'bold'}}>Check</Text>
            }</TouchableOpacity>
          </View>
          {this.state.discount !== undefined ?
            <Text style={{ fontSize: wp('3%') }}>Discount: Rp {this.format(this.state.discount)}</Text>
            :
            (this.state.discount_not_valid === 'Voucher is not valid' ?
              <Text style={{ fontSize: wp('3%'), color: '#FF0000' }}>Voucher is not valid</Text>
              :
              null
            )
          }
        </View>
        <View style={styles.optionSectionContainer}>
          <Text style={styles.optionTitle}>Bank Transfer</Text>
          <TouchableOpacity style={this.switchSelected('bca')} onPress={() => {
              this.setState({payment_method: 'bca' })
              if (+this.state.amount < this.state.fee[0].free_fee) {
                this.setState({ final_fee: this.state.fee[0].fee })
              } else {
                this.setState({ final_fee: 0 })
              }
            }}>
            <Image source={imageLogoSwitch('bca')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('5%') }]} />
            <Text style={styles.bankText}>BCA</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionSectionContainer}>
          <Text style={styles.optionTitle}>Virtual Account</Text>
          <TouchableOpacity style={this.switchSelected('cimb')} onPress={() => {
              this.setState({payment_method: 'cimb'})
              if (+this.state.amount < this.state.fee[3].free_fee) {
                this.setState({ final_fee: this.state.fee[3].fee })
              } else {
                this.setState({ final_fee: 0 })
              }
            }}>
            <Image source={imageLogoSwitch('cimb')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('5%') }]} />
            <Text style={styles.bankText}>CIMB</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.switchSelected('mandiri')} onPress={() => {
              this.setState({payment_method: 'mandiri'})
              if (+this.state.amount < this.state.fee[6].free_fee) {
                this.setState({ final_fee: this.state.fee[6].fee })
              } else {
                this.setState({ final_fee: 0 })
              }
            }}>
            <Image source={imageLogoSwitch('mandiri')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('5%') }]} />
            <Text style={styles.bankText}>Mandiri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.switchSelected('bni')} onPress={() => {
              this.setState({payment_method: 'bni'})
              if (+this.state.amount < this.state.fee[4].free_fee) {
                this.setState({ final_fee: this.state.fee[4].fee })
              } else {
                this.setState({ final_fee: 0 })
              }
            }}>
            <Image source={imageLogoSwitch('bni')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('4%') }]} />
            <Text style={styles.bankText}>BNI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.switchSelected('bag')} onPress={() => {
              this.setState({payment_method: 'bag'})
              if (+this.state.amount < this.state.fee[5].free_fee) {
                this.setState({ final_fee: this.state.fee[5].fee })
              } else {
                this.setState({ final_fee: 0 })
              }
            }}>
            <Image source={imageLogoSwitch('bag')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('5%') }]} />
            <Text style={styles.bankText}>BAG</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionSectionContainer}>
          <Text style={styles.optionTitle}>Physical Merchant</Text>
          <TouchableOpacity style={this.switchSelected('indomaret')} onPress={() => {
              this.setState({payment_method: 'indomaret'})
              if (+this.state.amount < this.state.fee[1].free_fee) {
                this.setState({ final_fee: this.state.fee[1].fee })
              } else {
                this.setState({ final_fee: 0 })
              }
            }}>
            <Image source={imageLogoSwitch('indomart')} style={[ styles.bankLogo, { width: wp('12%'), height: wp('4.5%') }]} />
            <Text style={styles.bankText}>Indomaret</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.switchSelected('alfamart')} onPress={() => {
              this.setState({payment_method: 'alfamart'})
              if (+this.state.amount < this.state.fee[2].free_fee) {
                this.setState({ final_fee: this.state.fee[2].fee })
              } else {
                this.setState({ final_fee: 0 })
              }
            }}>
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