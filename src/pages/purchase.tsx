import React, { Component } from 'react'
import {Picker} from '@react-native-community/picker';
import { ScrollView , Alert, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import {getPrePaidItem} from '../api'
import { widthPercentageToDP  as wp} from 'react-native-responsive-screen';
import formatRupiah from '../functions/formatRupiah';
import axios from 'axios'

import { AuthContext } from '../context'

import { getAccountInfo, purchasePrePaid } from '../api'

const logo = require('../assets/miniLogo.png')
const indomaretLogo = require('../assets/images/indomaret.png')
const alfamartLogo = require('../assets/images/alfamart_new.png')
const cimbniagaLogo = require('../assets/images/cimbniaga.jpg')
const bniLogo = require('../assets/images/bni.png')
const bagLogo = require('../assets/images/bag.jpg')
const bcaLogo = require('../assets/images/bca.png')
const mandiriLogo = require('../assets/images/mandiri.png')

class Purchase extends Component<any,any>{
  constructor(props){
    super(props)
  }
  state = {
    data: undefined,
    all_operator: undefined,
    all_product: undefined,
    phone_number: undefined,
    selectedOperator: -1,
    selectedProduct: -1,
    selectedProductIndex: -1,
    hpValue: undefined,
    loading: true,
    productEnabled: false,
    inputEnabled: false,
    price: 0,
    payment_page: true,
    payment_method: undefined
  }



  componentDidMount = async () => {
    axios.get('https://borneopoint.co.id/public/api/get_all_operator', {params:{
      operator: this.props.route.params.itemType
    }})
    .then(data => {
      if(typeof data === 'undefined'){
        this.componentDidMount()
      } else {
        this.setState({
          loading: false,
          all_operator: data.data
        })
      }
    }).catch(e => console.log("GET_ALL_OPERATOR => ", data))
  }
  componentDidUpdate = () => {
    // try{
    //   console.debug('data', this.state.data[this.state.selectedItemIndex])
    // }catch(error){
    //   console.debug(error)
    // }
  }
  refresh = () => this.componentDidMount
  onhpChangeValue = (text) => {
    this.setState({ hpValue: text })
  }

  selectingOperator = async (itemValue) => {
    this.setState({ selectedOperator: itemValue, productEnabled: false})
    if (itemValue !== -1){
      this.setState({ loading: true})
      axios.get('https://borneopoint.co.id/public/api/get_all_product', {params:{
        itemType: this.props.route.params.itemType,
        operator: itemValue
      }})
      .then(data => {
        if(typeof data === 'undefined'){
          this.selectedOperator(itemValue)
        } else {
          this.setState({
            selectedProduct: -1,
            loading: false,
            all_product: data.data,
            productEnabled: true,
            price: 0,
            payment_method: undefined
          })
        }
      }).catch(e => console.log(e))
    } else { this.setState({all_product: undefined, selectedProduct: -1, price: 0, payment_method: undefined}) }
  }

  selectingProduct = async (itemValue) => {
    if (itemValue !== -1){
      const item = itemValue.split(' - ')
      this.setState({
        selectedProduct: itemValue,
        price: item[1]
      })
    } else { this.setState({ selectedProduct: itemValue, price: 0, payment_method: undefined }) }
  }

  calculatePrice = () => {
    // try{
    //   console.log('calculate')
    //   if(this.state.selectedItemIndex != -1 && this.state.data && this.state.selectedProductIndex != -1) {
    //     console.log(this.state.data[this.state.selectedItemIndex].extraPrice)
    //     console.log(this.state.data[this.state.selectedItemIndex].product[this.state.selectedProductIndex].pulsa_price)
    //     const number = this.state.data[this.state.selectedItemIndex].extraPrice + this.state.data[this.state.selectedItemIndex].product[this.state.selectedProductIndex].pulsa_price
    //     console.log('number', number)
    //     return Number.isNaN(number) ? '0' : number.toString()
    //   }else{
    //     return '0'
    //   }
    // }catch(error){
    //   return '0'
    // }
  }

  goTo = (title, params?: any) => {
    try{
      this.props.navigation.navigate(title, params)
    }catch(error){ console.debug(error) }
  }

  selectingPaymentMethod = (paymentName) => {
    try{
      this.setState({payment_method: paymentName})
    }catch(error){ console.debug(error) }
  }

  handlePay = async () => {
    this.setState({loading: true})
    if (this.state.payment_method === "va_cimb_niaga"){
      axios.get('https://borneopoint.co.id/public/api/va_cimb_niaga', {params:{
        phone_number: this.state.phone_number,
        pulsa_code: this.state.selectedProduct.split(' - ')[0],
        user_id: "erwin",
        name: "erwin",
        email: "erwin@tri-niche.com",
        price_borneo: Number(this.state.price) + 500,
        price_mobilepulsa: Number(this.state.price),
        payment_method: this.state.payment_method,
        product_type: this.props.route.params.itemType
      }})
      .then(response => {
        this.setState({loading: false})
        console.log("LALALALALALAL => ", response.data)
        if(response.data.Status === 200){
          this.goTo('detailPulsa')
        }else{
          Alert.alert("Oops!", "Something Went Wrong, Try Again Later")
        }
      }).catch((e, f) => console.log(e, f))
    } else {
      alert('lala')
      this.setState({loading: false})
    }
    // try{
    //   // console.log(this.props.authState)
    //   if(!this.props.authState.isSignedIn)
    //     return Alert.alert( "Pay", "Please login or register first", [ { text: "Later", onPress: () => {}}, { text: "Login", onPress: () => this.props.navigation.navigate('Auth') },],{ cancelable: false })


    //   this.setState({loading: true})
    //   const account = await getAccountInfo({userId: this.props.authState._id, userToken: this.props.authState.token})
    //   this.setState({loading: false})
    //   if(account == undefined) throw new Error('failed to get account info')
    //   console.debug('account',account)
    //   const wallet = account?.data?.wallet
    //   if(wallet == undefined) throw new Error('failed to get wallet info')
    //   let total = 0
    //   if(this.state.selectedItemIndex != -1 && this.state.data && this.state.selectedProductIndex != -1) {
    //     // console.log(this.state.data[this.state.selectedItemIndex].extraPrice)
    //     // console.log(this.state.data[this.state.selectedItemIndex].product[this.state.selectedProductIndex].pulsa_price)
    //     total = this.state.data[this.state.selectedItemIndex].extraPrice + this.state.data[this.state.selectedItemIndex].product[this.state.selectedProductIndex].pulsa_price
    //     // console.log('number', number)
    //     total = Number.isNaN(total) ? 0 : total
    //   }else throw new Error('havent met condition')
    //   // console.debug('wallet', wallet)
    //   // console.debug('total', total)
    //   if(wallet < total) return Alert.alert( "Pay", "Insuficient wallet please top up first", [ { text: "Ok", onPress: () => {}}],{ cancelable: false })

    //   if(this.state.data[this.state.selectedItemIndex].hp_meta !== undefined && this.state.hpValue == undefined) return Alert.alert( "Purchase", "Purchase failed", [ { text: "Ok", onPress: () => {}}],{ cancelable: false })
    //   this.setState({loading: true})

    //   const result = await purchasePrePaid({
    //     itemId: this.state.data[this.state.selectedItemIndex]._id,
    //     productId: this.state.data[this.state.selectedItemIndex].product[this.state.selectedProductIndex]._id,
    //     userToken: this.props.authState.token,
    //     hp: this.state.hpValue || ""
    //   })
    //   console.log('this.state.hpValue', this.state.hpValue)
    //   if(result == undefined) return Alert.alert( "Purchase", "Purchase failed", [ { text: "Ok", onPress: () => {}}],{ cancelable: false })
    //   this.setState({loading: false})

    //   this.props.navigation.navigate('Summary', { purchaseId: result.data._id })
    //   console.debug(result)
    // }catch(error){
    //   console.debug(error)
    //   if(this.state.loading)
    //     this.setState({loading: false})
    // }
  }
  render = () =>
  <>
  {this.state.loading ?
    <View style={[ styles.container_loading, styles.horizontal_loading ]}>
      <ActivityIndicator size="large" color="#FFF" />
    </View>
    :
    null
  }
  <ScrollView contentContainerStyle={{padding: wp('5%')}}>
    <View>
      <View>
        <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Select Operator</Text>
      </View>
      <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%') }}>
        <Picker
          mode={'dropdown'}
          selectedValue={this.state.selectedOperator}
          style={{ flex: 1,}}
          onValueChange={(itemValue, itemIndex) => this.selectingOperator(itemValue)}>
          <Picker.Item value={-1} label='Choose item ...' />
          {
            this.state.all_operator != undefined ? 
              this.state.all_operator.map((item,index) => <Picker.Item key={index} label={item} value={item} />) : null
          }
        </Picker>
      </View>
    </View>
    <View>
      <View>
        <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Select Item</Text>
      </View>
      <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%') }}>
        <Picker
          enabled={this.state.productEnabled}
          mode={'dropdown'}
          selectedValue={this.state.selectedProduct}
          style={{ flex: 1,}}
          onValueChange={(itemValue, itemIndex) => this.selectingProduct(itemValue)}>
          <Picker.Item value={-1} label='Choose item ...' />
          {
            this.state.all_product != undefined ? 
              this.state.all_product.map((item,index) => <Picker.Item key={index} label={item.pulsa_nominal} value={item.pulsa_code+' - '+item.pulsa_price} />) : null
          }
        </Picker>
      </View>
    </View>
    { this.props.route.params.itemType === 'pulsa' ?
      <View>
        <View>
          <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Phone Number</Text>
        </View>
        <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%') }}>
          <TextInput onChangeText={(text) => this.setState({phone_number: text})} placeholder="Your Phone Number" editable={this.state.selectedOperator !== -1 && this.state.selectedProduct !== -1 ? true : false} style={{fontSize: 16, paddingHorizontal: 10}} keyboardType='phone-pad'></TextInput>
        </View>
      </View>
      :
      null
    }
    { this.state.selectedOperator != -1 && this.state.selectedProduct != -1 ?
      <View style={{ flex:1, marginTop: wp('3') }}>
        <View>
          <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Payment Method</Text>
        </View>
        <TouchableOpacity onPress={() => this.selectingPaymentMethod("va_cimb_niaga")}>
        <View style={{ elevation: 2, backgroundColor: this.state.payment_method == "va_cimb_niaga" ? '#1DF318' : 'white', borderRadius  : wp('2.22223%'), marginVertical: wp('1'), paddingHorizontal: wp('2.22223%'), height: wp('10'), justifyContent: 'center' }}>
          <Text style={{ fontSize: wp('3.5%'), fontWeight: this.state.payment_method == "va_cimb_niaga" ? 'none' : 'none' }}>
            <Image source={cimbniagaLogo} style={{width: wp('10'), height: wp('5')}} />
            &nbsp;&nbsp;VA Cimb Niaga
          </Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.selectingPaymentMethod("va_bni")}>
        <View style={{ elevation: 2, backgroundColor: this.state.payment_method == "va_bni" ? '#1DF318' : 'white', borderRadius  : wp('2.22223%'), marginVertical: wp('1'), paddingHorizontal: wp('2.22223%'), height: wp('10'), justifyContent: 'center' }}>
          <Text style={{ fontSize: wp('3.5%'), fontWeight: this.state.payment_method == "va_bni" ? 'none' : 'none' }}>
            <Image source={bniLogo} style={{width: wp('10'), height: wp('5')}} />
            &nbsp;&nbsp;VA BNI</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.selectingPaymentMethod("va_bag")}>
        <View style={{ elevation: 2, backgroundColor: this.state.payment_method == "va_bag" ? '#1DF318' : 'white', borderRadius  : wp('2.22223%'), marginVertical: wp('1'), paddingHorizontal: wp('2.22223%'), height: wp('10'), justifyContent: 'center' }}>
          <Text style={{ fontSize: wp('3.5%'), fontWeight: this.state.payment_method == "va_bag" ? 'none' : 'none' }}>
            <Image source={bagLogo} style={{width: wp('10'), height: wp('5')}} />
            &nbsp;&nbsp;VA BAG
          </Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.selectingPaymentMethod("va_mandiri")}>
        <View style={{ elevation: 2, backgroundColor: this.state.payment_method == "va_mandiri" ? '#1DF318' : 'white', borderRadius  : wp('2.22223%'), marginVertical: wp('1'), paddingHorizontal: wp('2.22223%'), height: wp('10'), justifyContent: 'center' }}>
          <Text style={{ fontSize: wp('3.5%'), fontWeight: this.state.payment_method == "va_mandiri" ? 'none' : 'none' }}>
            <Image source={mandiriLogo} style={{width: wp('10'), height: wp('5')}} />
            &nbsp;&nbsp;VA Mandiri</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.selectingPaymentMethod("indomaret")}>
        <View style={{ elevation: 2, backgroundColor: this.state.payment_method == "indomaret" ? '#1DF318' : 'white', borderRadius  : wp('2.22223%'), marginVertical: wp('1'), paddingHorizontal: wp('2.22223%'), height: wp('10'), justifyContent: 'center' }}>
          <Text style={{ fontSize: wp('3.5%'), fontWeight: this.state.payment_method == "indomaret" ? 'none' : 'none' }}>
            <Image source={indomaretLogo} style={{width: wp('10'), height: wp('5')}} />
            &nbsp;&nbsp;Indomaret
          </Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.selectingPaymentMethod("alfamart")}>
        <View style={{ elevation: 2, backgroundColor: this.state.payment_method == "alfamart" ? '#1DF318' : 'white', borderRadius  : wp('2.22223%'), marginVertical: wp('1'), paddingHorizontal: wp('2.22223%'), height: wp('10'), justifyContent: 'center' }}>
          <Text style={{ fontSize: wp('3.5%'), fontWeight: this.state.payment_method == "alfamart" ? 'none' : 'none' }}>
            <Image source={alfamartLogo} style={{width: wp('10'), height: wp('5')}} />
            &nbsp;&nbsp;Alfamart</Text>
        </View>
        </TouchableOpacity>
      </View>
      :
      null
    }
  </ScrollView>
      <View style={{position: 'relative', bottom: 0 , paddingTop: wp('2.5%'), paddingBottom: wp('5%'), width: '100%', backgroundColor: 'white', elevation: 16, flexDirection: 'row'}}>
        <View style={{flexDirection: 'column', flex: 1, marginLeft: wp('5%'), justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: wp('4%')}}>Total</Text>
          <Text style={{color: '#1DF318', fontWeight: 'bold', fontSize: wp('4%')}}>Rp {this.state.price == 0 ? 0 : Number(this.state.price) + 500}</Text>
        </View>
        <View style={{
          // justifyContent: 'flex-end'
          justifyContent: 'center',
          marginRight: wp('5%')
        }}>
          <TouchableOpacity 
            onPress={() => this.handlePay()}
            style={{ backgroundColor: this.state.selectedOperator != -1 && this.state.selectedProduct != -1 && this.state.payment_method != undefined ? '#3269B3': '#ccc', borderRadius: wp('2.223%'), padding: wp('2.5%'), flexDirection: 'row'}} disabled={!(this.state.selectedOperator != -1 && this.state.selectedProduct != -1 && this.state.payment_method != undefined)}>
            <Image source={logo} style={{marginRight: wp('2.5%')}}/>
            <Text style={{fontWeight: 'bold', fontSize: wp('5%'), color: 'white'}}>Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
      </>
    // <View style={{flex: 1, backgroundColor: 'white'}}>
    // <ScrollView contentContainerStyle={{padding: wp('5%')}} refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={this.refresh}/>}>
    //   <View>
    //     <View>
    //       <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Item</Text>
    //     </View>
    //     <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%') }}>
    //       <Picker
    //         mode={'dropdown'}
    //         selectedValue={this.state.selectedItemIndex}
    //         style={{ flex: 1,}}
    //         onValueChange={(itemValue, itemIndex) => this.setState({ selectedItemIndex: itemValue}) }>
    //         <Picker.Item value={-1} label='Choose item ...' />
    //         {
    //           this.state.data != undefined ? 
    //             this.state.data.map(({name},index) => <Picker.Item key={index} label={name} value={index} />) : null
    //         }
    //       </Picker>
    //     </View>
    //   </View>
    //   {
    //     this.state.selectedItemIndex != -1 &&
    //       <View style={{marginTop: wp('2.5%')}}>
    //         <View>
    //           <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Data</Text>
    //         </View>
    //         <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%') }}>
    //           <Picker
    //             mode={'dropdown'}
    //             selectedValue={this.state.selectedProductIndex}
    //             style={{ flex: 1,}}
    //             onValueChange={(itemValue, itemIndex) => this.setState({ selectedProductIndex: itemValue}) }>
    //             <Picker.Item value={-1} label='Choose nominal ...' />
    //             {
    //               this.state.data[this.state.selectedItemIndex] && this.state.data[this.state.selectedItemIndex]?.product != undefined ? 
    //               this.state.data[this.state.selectedItemIndex].product.map(({name,pulsa_nominal},index) => <Picker.Item key={index} label={pulsa_nominal} value={index} />) : null
    //             }
    //           </Picker>
    //         </View>
    //       </View>
    //   }
    //   {
    //     // (this.state.selectedItemIndex !== -1 && this.state?.data[this.state.selectedItemIndex]?.hp_meta === undefined) ? null :
    //     (this.state.selectedItemIndex != -1 && this.state.selectedProductIndex != -1)  &&
    //       <View style={{marginTop: wp('2.5%')}}>
    //         <View>
    //           <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Customer number</Text>
    //         </View>
    //         <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%') }}>
    //           <TextInput placeholder={this.state.data[this.state.selectedItemIndex].hp_meta} style={{marginLeft: wp('2.5%')}} keyboardType={'number-pad'} textContentType={'telephoneNumber'} onChangeText={this.onhpChangeValue}/>
    //         </View>
    //       </View>
    //   }
      
    // </ScrollView>

}

export default (props) => 
<AuthContext.Consumer>{
  authState => <Purchase authState={authState} {...props}/>
}</AuthContext.Consumer>

const styles = StyleSheet.create({
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