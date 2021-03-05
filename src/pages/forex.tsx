import React, { Component } from 'react'
import {Picker} from '@react-native-community/picker';
import { ScrollView , Alert, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, FlatList, Platform, BackHandler } from 'react-native';
import {getPrePaidItem} from '../api'
import { widthPercentageToDP  as wp} from 'react-native-responsive-screen';
import formatRupiah from '../functions/formatRupiah';
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle } from 'react-native-popup-dialog';

import { AuthContext } from '../context'

import { getAccountInfo, purchasePrePaid } from '../api'

const logo = require('../assets/miniLogo.png')
// const indomaretLogo = require('../assets/images/indomart.png')
// const alfamartLogo = require('../assets/images/alfamart_new.png')
// const cimbniagaLogo = require('../assets/images/cimbniaga.jpg')
// const bniLogo = require('../assets/images/bni.png')
// const bagLogo = require('../assets/images/bag.jpg')
// const bcaLogo = require('../assets/images/bca.png')
// const mandiriLogo = require('../assets/images/mandiri.png')

class Forex extends Component<any,any>{
  constructor(props){
    super(props)
    this.state = {
      data: undefined,
      all_operator: undefined,
      all_product: undefined,
      amount: undefined,
      selectedOperator: -1,
      selectedProduct: -1,
      selectedProductIndex: -1,
      hpValue: undefined,
      loading: true,
      productEnabled: false,
      inputEnabled: false,
      price: 0,
      payment_page: true,
      payment_method: undefined,
      topup_platform: [],
      currenPlatform: null,
      selectedPlatform: [],
      visible: false,
      discount: undefined,
      discount_not_valid: undefined,
      gettingAccountInfo: false,
      coupon: undefined,
      code: undefined
    }
  }
    
    
    
  componentDidMount = async () => {
    const check_login = await AsyncStorage.getItem('@id_login')
    axios.get('https://admin.borneopoint.co.id/api/get_user', {params: {
      id_login: check_login
    }})
    .then(resp => {
      this.setState({
        phone_number: resp.data.phone,
        loading: false
      })
      // console.log(this.state.status)
    })
    .catch(err => {
      console.log('Get User : '+err)
    })

    axios.get('https://admin.borneopoint.co.id/api/get_topup_platform')
    .then(resp => {
        //   if(typeof resp.data === 'undefined'){
        //     this.componentDidMount()
    //   } else {
        //   }
            this.setState({
                loading: false,
                topup_platform: resp.data
            })
            // alert(JSON.stringify(resp.data))
    }).catch(e => {
        this.setState({
            loading: false
        })
        console.log("GET_ALL_OPERATOR => ", e)
    })
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

  selectingOperator = (itemValue) => {
      this.setState({loading:true})
      if(itemValue !== -1){
          this.setState({
              selectedOperator: itemValue,
              selectedPlatform: this.state.topup_platform[itemValue],
              loading:false
          })
          // console.log(this.state.selectedPlatform)
      }else{
        this.setState({
            selectedOperator: -1,
            selectedPlatform: [],
            amount: undefined,
            price: 0,
            loading:false,
            payment_method: undefined
        })
    }
}

//   selectingProduct = async (itemValue) => {
//     if (itemValue !== -1){
//       const item = itemValue.split(' - ')
//       this.setState({
//         selectedProduct: itemValue,
//         price: item[1]
//       })
//     } else { this.setState({ selectedProduct: itemValue, price: 0, payment_method: undefined }) }
//   }

//   calculatePrice = () => {
//     // try{
//     //   console.log('calculate')
//     //   if(this.state.selectedItemIndex != -1 && this.state.data && this.state.selectedProductIndex != -1) {
//     //     console.log(this.state.data[this.state.selectedItemIndex].extraPrice)
//     //     console.log(this.state.data[this.state.selectedItemIndex].product[this.state.selectedProductIndex].pulsa_price)
//     //     const number = this.state.data[this.state.selectedItemIndex].extraPrice + this.state.data[this.state.selectedItemIndex].product[this.state.selectedProductIndex].pulsa_price
//     //     console.log('number', number)
//     //     return Number.isNaN(number) ? '0' : number.toString()
//     //   }else{
//     //     return '0'
//     //   }
//     // }catch(error){
//     //   return '0'
//     // }
//   }

  selectingPaymentMethod = (paymentName) => {
      try{
        this.setState({payment_method: paymentName})
      }catch(error){ console.debug(error) }
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

handlePay = async () => {
  const id_login = await AsyncStorage.getItem('@id_login')
  this.setState({loading: true})
  var data = {
    // product_operator: this.state.product_operator,
    // product_nominal: this.state.product_nominal,
    phone: this.state.phone_number,
    user_id: id_login,
    product_type: 'topup_platform',
    // product_id: this.state.product_id,
    pulsa_price: '0',
    price_borneo: this.state.price,
    topup_id: this.state.selectedPlatform.id,
    topup_rate: this.state.selectedPlatform.rate,
    topup_conversion: this.state.amount,
    payment_channel: this.state.selectedPlatform.platform,
    coupon: this.state.code
  }

  // product_operator, product_nominal, phone_number, user_id, product_id, pulsa_price, price_borneo
  axios.get('https://admin.borneopoint.co.id/api/top_up_request', {params:{data}})
  .then(response => {
    this.setState({loading: false})
    if (response.data.status === 'Success'){
      Alert.alert(
          'Success!',
          "We're Processing your order",
          [
              { text: 'OK', onPress: () => this.props.navigation.reset({ routes: [{ name: 'Main' }] }) }
          ]
      )
    }else{
      if (response.data.data.message === "Insufficient Balance") {
        Alert.alert(
          response.data.data.message,
          response.data.data.submessage,
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: "cancel" },
            { text: 'Top Up Now', onPress: () => this.props.navigation.push('TopUp') }
          ]
        )
      } else {
        Alert.alert(
          response.data.data.message,
          response.data.data.submessage,
          [
            { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: "cancel" }
          ]
        )
      }
    }
  })
  .catch((e) => console.log(e))
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

  render = () =>
  <>
    {this.state.loading ?
      <View style={[ styles.horizontal_loading, styles.container_loading ]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
      :
      null
    }
    <ScrollView contentContainerStyle={{padding: wp('5%')}}>
        <Dialog
          dialogTitle={<DialogTitle style={{ backgroundColor: '#FFF', elevation: 3 }} title="Input Pin" />}
          visible={this.state.visible}
          onTouchOutside={() => this.setState({visible:false})}
          dialogStyle={{ backgroundColor: '#FFF', elevation: 4 }}
            footer={
              <DialogFooter>
                <DialogButton
                  text="CANCEL"
                  onPress={() => { this.setState({visible: false}) }}
                />
                <DialogButton
                  text="OK"
                  onPress={() => { this.setState({visible: false}) }}
                />
              </DialogFooter>
            }
          >
            <DialogContent>
              <View style={{ width: wp('85%'), paddingTop: wp('7%'), alignItems: 'center' }}>
                <TextInput
                  style={{ width: wp('70%'), height: wp('15%'), backgroundColor: '#FFF', elevation: 4 }}
                  textAlign={'center'}
                  keyboardType={'numeric'}
                />
              </View>
            </DialogContent>
        </Dialog>
        <View>
            <View>
            <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Select Platform</Text>
            </View>
            <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%') }}>
            <Picker
                mode={'dropdown'}
                selectedValue={this.state.selectedOperator}
                style={{ flex: 1,}}
                onValueChange={this.selectingOperator}
            >
                <Picker.Item value={-1} label='Choose item ...' />
                {
                this.state.topup_platform.length != 0 ? 
                    this.state.topup_platform.map((item,index) => (
                        <Picker.Item key={index} label={item.platform +' ('+ item.currency +') '} value={index} />
                    )) : null
                }
            </Picker>
            </View>
        </View>

        {/* <View>
            <View>
                <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Currency</Text>
            </View>
            <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%') }}>
                <Picker
                    // enabled={this.state.productEnabled}
                    mode={'dropdown'}
                    // selectedValue={this.state.selectedProduct}
                    style={{ flex: 1,}}
                    // onValueChange={(itemValue, itemIndex) => this.selectingProduct(itemValue)}
                >
                <Picker.Item value={-1} label='Choose item ...' />
                {
                    this.state.currency != undefined ? 
                    this.state.currency.map((item,index) => <Picker.Item key={index} label={item} value={item} />) : null
                }
                </Picker>
            </View>
        </View> */}

        <View>
            <View>
                <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Rate</Text>
            </View>
            <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%') }}>
                {this.state.selectedPlatform.length != 0 ?
                    <View>
                        <Text style={{fontSize: 16, paddingHorizontal: 10, marginTop: wp('5%'), marginBottom: wp('5%')}}>IDR {this.format(this.state.selectedPlatform.rate)}</Text>
                    </View>
                    :
                    <View>
                        <Text style={{fontSize: 16, paddingHorizontal: 10, marginTop: wp('5%'), marginBottom: wp('5%')}}>IDR 0</Text>
                    </View>
                }
                {/*editable={this.state.selectedOperator !== -1 && this.state.selectedProduct !== -1 ? true : false}*/}
            </View>
        </View>


        {this.state.selectedPlatform.length != 0 ?
          <View>
            <View>
              <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Claim Coupon</Text>
            </View>
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
              (this.state.discount_not_valid !== undefined ?
                <Text style={{ fontSize: wp('3%'), color: '#FF0000' }}>Voucher is not valid</Text>
                :
                null
              )
            }
            <View>
                <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Amount</Text>
            </View>
            <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%') }}>
                <TextInput
                  onChangeText={(text) => {
                    this.setState({
                      amount: text*1,
                      price: +text * +this.state.selectedPlatform.rate
                    })
                  }}
                  style={{fontSize: 16, paddingHorizontal: 10}}
                  keyboardType='phone-pad'
                />
            </View>
          </View>
          :
          null
        }

        {/* { this.state.selectedPlatform.length != 0 && this.state.amount != '' ?
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
    } */}
    </ScrollView>
      
    <View style={{position: 'relative', bottom: 0 , paddingTop: wp('2.5%'), paddingBottom: wp('5%'), width: '100%', backgroundColor: 'white', elevation: 16, flexDirection: 'row'}}>
      <View style={{flexDirection: 'column', flex: 1, marginLeft: wp('5%'), justifyContent: 'center'}}>
        <Text style={{fontWeight: 'bold', fontSize: wp('4%')}}>Total</Text>
        {this.state.code !== undefined ?
          <Text style={{color: '#1DF318', fontWeight: 'bold', fontSize: wp('4%')}}>Rp {this.format(this.state.price-this.state.discount)}</Text>
          :
          <Text style={{color: '#1DF318', fontWeight: 'bold', fontSize: wp('4%')}}>Rp {this.format(this.state.price)}</Text>
        }
      </View>
      <View style={{
        // justifyContent: 'flex-end'
        justifyContent: 'center',
        marginRight: wp('5%')
      }}>
        <TouchableOpacity
          onPress={() => this.handlePay()}
          style={{ backgroundColor: this.state.selectedOperator != -1 && this.state.selectedPlatform.length != 0 && this.state.amount != '' ? '#3269B3': '#ccc', borderRadius: wp('2.223%'), padding: wp('2.5%'), flexDirection: 'row'}} disabled={!(this.state.selectedOperator != -1 && this.state.selectedPlatform.length != 0 && this.state.amount != '')}>
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
  authState => <Forex authState={authState} {...props}/>
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