import React, { Component } from 'react'
import {Picker} from '@react-native-community/picker';
import { ScrollView , Alert, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, FlatList, StyleSheet, BackHandler, ToastAndroid } from 'react-native';
import { widthPercentageToDP  as wp} from 'react-native-responsive-screen';
import axios from 'axios'
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle } from 'react-native-popup-dialog';
import { selectContactPhone } from 'react-native-select-contact'
import { AuthContext } from '../context'
import AsyncStorage from '@react-native-community/async-storage';

const logo = require('../assets/miniLogo.png')
const api_base_url = 'https://admin.borneopoint.co.id/api/';
// const api_base_url = 'http://10.10.11.10/api/';

class Mobile extends Component<any,any>{
  constructor(props){
    super(props)
    this.state = {
      data: undefined,
      all_operator: undefined,
      all_product: undefined,
      phone_number: undefined,
      selectedOperator: undefined,
      selectedProduct: -1,
      selectedProductIndex: -1,
      hpValue: undefined,
      loading: true,
      productEnabled: false,
      inputEnabled: false,
      price: 0,
      price_pulsa: 0,
      payment_page: true,
      payment_method: undefined,
      visible: false,
      after4digit: false,
      semi_selecting_pulsa: undefined,
      product_operator: undefined,
      product_nominal: undefined,
      product_id: undefined,
      price_borneo: undefined,
      pulsa_price: undefined,
      zona_id: undefined,
      server_id: undefined,
      server_id_dragon: undefined,
      rolename_dragon: undefined,
      rolename: undefined,
      user_id: undefined,
      hp: undefined,
      discount: undefined,
      discount_not_valid: undefined,
      gettingAccountInfo: false,
      coupon: undefined,
      code: undefined
    }
  }

  componentDidMount = async () => {
    axios.get(api_base_url+'get_all_operator', {params:{
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

  refresh = () => this.componentDidMount
    // onChangePhoneNumber = (text, fromContact = false) => {
    //   this.setState({phone_number: text})
    //   let prefixes = {
    //     'indosat1' : '0814','indosat2' : '0815','indosat3' : '0816','indosat4' : '0855','indosat5' : '0856','indosat6' : '0857','indosat7' : '0858',
    //     'xl1' : '0817','xl2' : '0818','xl3' : '0819','xl4' : '0859','xl5' : '0878','xl6' : '0877',
    //     'axis1' : '0838','axis2' : '0837','axis3' : '0831','axis4' : '0832',
    //     'telkomsel1' : '0812','telkomsel2' : '0813','telkomsel3' : '0852','telkomsel4' : '0853','telkomsel5' : '0821','telkomsel6' : '0823','telkomsel7' : '0822','telkomsel8' : '0851',
    //     'smartfren1' : '0881','smartfren2' : '0882','smartfren3' : '0883','smartfren4' : '0884','smartfren5' : '0885','smartfren6' : '0886','smartfren7' : '0887','smartfren8' : '0888',
    //     'three1' : '0896','three2' : '0897','three3' : '0898','three4' : '0899','three5' : '0895'
    //   };
    //   // console.log(prefixes)
    //   if (fromContact === false){
    //     if (text.length === 4 && this.state.after4digit === false) {
    //       for(var k in prefixes) {
    //         if (text.substr(0, 4) === prefixes[k]) {
    //           axios.get(api_base_url+'get_all_product', {params:{
    //             itemType: this.props.route.params.itemType,
    //             operator: k.slice(0, -1)
    //           }})
    //           .then(data => {
    //             this.setState({
    //               selectedProduct: -1,
    //               loading: false,
    //               all_product: data.data,
    //               productEnabled: true,
    //               price: 0,
    //               payment_method: undefined,
    //               selectedOperator: k.slice(0, -1),
    //               phone_number: text,
    //               after4digit: true
    //             })
    //             console.log(text.substr(0, 4))
    //           }).catch(e => console.log(e))
    //           break;
    //         }
    //       }
    //     }else if (text.length < 4){
    //       this.setState({
    //         selectedOperator: undefined,
    //         all_product: undefined,
    //         after4digit: false,
    //         price_pulsa: 0,
    //         payment_method: undefined,
    //         semi_selecting_pulsa: undefined
    //       })
    //     }
    //   }else{
    //     for(var k in prefixes) {
    //       if (text.substr(0, 4) === prefixes[k]) {
    //         axios.get(api_base_url+'get_all_product', {params:{
    //           itemType: this.props.route.params.itemType,
    //           operator: k.slice(0, -1)
    //         }})
    //         .then(data => {
    //           this.setState({
    //             selectedProduct: -1,
    //             loading: false,
    //             all_product: data.data,
    //             productEnabled: true,
    //             price: 0,
    //             selectedOperator: k.slice(0, -1),
    //             phone_number: text,
    //             after4digit: true
    //           })
    //           console.log(text.substr(0, 4))
    //         }).catch(e => console.log(e))
    //         break;
    //       }
    //     }
    //   }
      
    // }

  selectingOperator = async (itemValue) => {
    this.setState({
      selectedOperator: itemValue,
      productEnabled: false,
      phone_number: undefined,
      zona_id: undefined,
      rolename: undefined,
      server_id: undefined
    })
    console.log(itemValue)
    if (itemValue !== -1){
      this.setState({ loading: true})
      axios.get(api_base_url+'get_all_product', {params:{
        itemType: this.props.route.params.itemType,
        operator: itemValue
      }})
      .then(resp => {
        this.setState({
          loading: false,
          all_product: resp.data,
          semi_selecting_pulsa: undefined,
          price_pulsa: 0,
        })
      }).catch(e => console.log(e))
    } else {
      this.setState({
        all_product: undefined,
        selectedProduct: -1,
        price: 0,
        payment_method: undefined,
        semi_selecting_pulsa: undefined,
        price_pulsa: 0,
      })
    }
  }

  selectingPaymentMethod = (paymentName) => {
    try{
      this.setState({payment_method: paymentName})
    }catch(error){ console.debug(error) }
  }

  selectingPulsa = async (item) => {
    axios.get(api_base_url+'get_all_product', {params:{
      itemType: this.props.route.params.itemType,
      operator: item
    }})
    .then(data => {
      this.setState({
        selectedProduct: -1,
        loading: false,
        all_product: data.data,
        productEnabled: true,
        price: 0,
        payment_method: undefined,
        selectedOperator: item
      })
    }).catch(e => console.log(e))
    console.log("ALL IN ITEM VAR ==> ", item)
    // product_operator, product_nominal, phone_number, user_id, product_id, pulsa_price, price_borneo
    this.setState({
      semi_selecting_pulsa: item.pulsa_code,
      product_operator: item.pulsa_op,
      product_nominal: item.pulsa_nominal,
      product_id: item.pulsa_code,
      price_pulsa: item.price_borneo,
      price_borneo: item.price_borneo,
      pulsa_price: item.pulsa_price
    })

    if (this.state.coupon !== undefined) {
      const _this = this;
      setTimeout(function(){_this.check_coupon()},300);
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

  // getPhoneNumber = () => {
  //   return selectContactPhone()
  //   .then(selection => {
  //     if (!selection) {
  //         return null;
  //     }
      
  //     let { selectedPhone } = selection;
  //     const number = selectedPhone.number.replace('+','0').replace(/ |62|-/g, '').trim();
  //     this.setState({phone_number: number})
  //     if (typeof number !== 'undefined'){
  //       this.setState({
  //         after4digit: true,
  //         price_pulsa: 0,
  //         payment_method: undefined,
  //         semi_selecting_pulsa: undefined
  //       })
  //       this.onChangePhoneNumber(number, true)
  //     }
  //   });
  // }

  check_coupon = async () => {
    if (this.state.price_borneo === undefined) {
      ToastAndroid.show('Please select nominal amount', ToastAndroid.SHORT)
      return false;
    }

    if(this.state.coupon===undefined || this.state.coupon=='') {
      this.setState({discount_not_valid: undefined});
      ToastAndroid.show('Please fill coupon field', ToastAndroid.SHORT)
      this.couponInput.focus();
      return false;
    }

    this.setState({ gettingAccountInfo: true })
    const id_login = await AsyncStorage.getItem('@id_login')

    axios.post(api_base_url+'check_coupon', {
      code: this.state.coupon,
      id_login: id_login,
      type: 'game',
      amount: this.state.price_borneo,
    })
    .then(resp => {
      if (typeof resp.data == 'string') {
        this.setState({
          gettingAccountInfo: false,
          discount_not_valid: resp.data.length?resp.data:'Coupon not valid',
          discount: undefined,
          coupon: undefined,
          code: undefined
        }); this.couponInput.clear();
      } else {
        this.setState({
          gettingAccountInfo: false,
          discount_not_valid: undefined,
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
    this.gamee()

    const id_login = await AsyncStorage.getItem('@id_login')
    this.setState({loading: true})
    var data = {
      product_operator: this.state.product_operator,
      product_nominal: this.state.product_nominal,
      phone_number: this.state.hp,
      user_id: id_login,
      product_type: 'game',
      product_id: this.state.product_id,
      pulsa_price: this.state.pulsa_price,
      price_borneo: this.state.price_borneo,
      payment_channel: 'game',
      coupon: this.state.code
    }

    // product_operator, product_nominal, phone_number, user_id, product_id, pulsa_price, price_borneo
    axios.get(api_base_url+'top_up_request', {params:{data}})
    .then(response => {
      this.setState({loading: false})
      if (response.data.data.message === 'PROCESS'){
        Alert.alert(
            'Success!',
            "We're Processing your order",
            [
                { text: 'OK', onPress: () => this.props.navigation.reset({ routes: [{ name: 'Main' }] }) }
            ]
        )
      }else{
        if (response.data.data.message === 'User not found' || response.data.data.message === 'Customer ID not found') {
          Alert.alert(
            response.data.data.message,
            response.data.data.submessage,
            [
              { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: "cancel" }
            ]
          )
        } else {
          Alert.alert(
            response.data.data.message,
            response.data.data.submessage,
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: "cancel" },
              { text: 'Top Up Now', onPress: () => this.props.navigation.push('TopUp') }
            ]
          )
        }
      }
    })
    .catch((e) => console.log(e))
  }

  gamee = () => {
    // phone_number, rolename, zona_id, server_id
    if (this.state.phone_number !== undefined && this.state.rolename !== undefined && this.state.server_id !== undefined) {
      console.log('Bleach')
      this.setState({hp: this.state.rolename+'|'+this.state.phone_number+'|'+this.state.server_id})
    } else if (this.state.rolename !== undefined && this.state.server_id !== undefined) {
      console.log('Dragonest')
      this.setState({hp: this.state.rolename+'|'+this.state.server_id})
    } else if (this.state.phone_number !== undefined && this.state.zona_id !== undefined) {
      console.log('ML')
      this.setState({hp: this.state.phone_number+'|'+this.state.zona_id})
    } else {
      console.log('only phone_number')
      this.setState({hp: this.state.phone_number})
    }
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
            style={{ width: wp('70%'), height: wp('15%'), backgroundColor: '#FFF', elevation: 4, borderRadius: wp('2%') }}
            textAlign={'center'}
            keyboardType={'number-pad'}
          />
        </View>
      </DialogContent>
    </Dialog>
    {this.props.route.params.itemType === 'game' && (
        <>
        <ScrollView style={{ padding: wp('5%') }}>
            <View>
                <View>
                  <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Select Operator</Text>
                </View>
                <View style={{ elevation: 2, backgroundColor: 'white', borderRadius  : wp('2.22223%'), marginBottom: wp('1%') }}>
                  <Picker
                    mode={'dropdown'}
                    selectedValue={this.state.selectedOperator}
                    style={{ flex: 1 }}
                    onValueChange={(itemValue, itemIndex) => this.selectingOperator(itemValue)}>
                    <Picker.Item value={-1} label='Choose item ...' />
                    {
                      this.state.all_operator != undefined ? 
                  this.state.all_operator.map((item,index) => <Picker.Item key={index} label={item} value={item} />) : null
                    }
                  </Picker>
                </View>
                {this.state.selectedOperator !== -1 && this.state.selectedOperator !== undefined ?
                  <>
                    <View style={{ marginTop: wp('5%') }}>
                        <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>User ID</Text>
                    </View>
                    <View>
                      {this.state.selectedOperator === 'Mobile Legend' ?
                        <View style={{ flexDirection: 'row' }}>
                          <TextInput
                            style={{ backgroundColor: 'white', borderRadius: wp('2.22223%'), elevation: 2, width: wp('40%'), textAlign: 'center' }}
                            onChangeText={(text) => this.setState({phone_number: text})}
                            placeholder="User ID"
                            keyboardType='number-pad'
                            value={this.state.phone_number}
                          />
                          <TextInput
                            style={{ backgroundColor: 'white', borderRadius: wp('2.22223%'), elevation: 2, width: wp('40%'), marginLeft: wp('5%'), textAlign: 'center' }}
                            onChangeText={(text) => this.setState({zona_id: text})}
                            placeholder="Zona ID"
                            keyboardType='number-pad'
                            value={this.state.zona_id}
                          />
                        </View>
                        :
                        (this.state.selectedOperator === 'Bleach Mobile 3D' ?
                          <View style={{ flexDirection: 'row' }}>
                            <TextInput
                              style={{ backgroundColor: 'white', borderRadius: wp('2.22223%'), elevation: 2, width: wp('28.6%') }}
                              onChangeText={(text) => this.setState({rolename: text})}
                              placeholder="Rolename"
                              keyboardType='number-pad'
                              value={this.state.rolename}
                            />
                            <TextInput
                              style={{ backgroundColor: 'white', borderRadius: wp('2.22223%'), elevation: 2, width: wp('28.6%'), marginLeft: wp('2%') }}
                              onChangeText={(text) => this.setState({phone_number: text})}
                              placeholder="User ID"
                              keyboardType='number-pad'
                              value={this.state.phone_number}
                            />
                            <TextInput
                              style={{ backgroundColor: 'white', borderRadius: wp('2.22223%'), elevation: 2, width: wp('28.6%'), marginLeft: wp('2%') }}
                              onChangeText={(text) => this.setState({server_id: text})}
                              placeholder="Server ID"
                              keyboardType='number-pad'
                              value={this.state.server_id}
                            />
                          </View>
                          :
                          (this.state.selectedOperator === 'Dragon Nest M - SEA' ?
                            <View style={{ flexDirection: 'row' }}>
                              <TextInput
                                style={{ backgroundColor: 'white', borderRadius: wp('2.22223%'), elevation: 2, width: wp('40%') }}
                                onChangeText={(text) => this.setState({rolename: text})}
                                placeholder="Rolename"
                                keyboardType='number-pad'
                                value={this.state.rolename}
                              />
                              <TextInput
                                style={{ backgroundColor: 'white', borderRadius: wp('2.22223%'), elevation: 2, width: wp('40%'), marginLeft: wp('5%') }}
                                onChangeText={(text) => this.setState({server_id: text})}
                                placeholder="Server ID"
                                keyboardType='number-pad'
                                value={this.state.server_id}
                              />
                            </View>
                            :
                            <TextInput
                              style={{ backgroundColor: 'white', borderRadius: wp('2.22223%'), elevation: 2 }}
                              onChangeText={(text) => this.setState({phone_number: text})}
                              placeholder="User ID"
                              keyboardType='number-pad'
                              value={this.state.phone_number}
                            />
                          )
                        )
                      }
                    </View>

                    <View style={{ marginTop: wp('5%') }}>
                      <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>Claim Coupon</Text>
                    </View>
                    <View style={{ borderRadius: wp('2.222223%'), elevation: 2, marginTop: wp('3%'), flexDirection: 'row', aspectRatio: 328/46, overflow: 'hidden', width: wp('90%')}}>
                      <TextInput 
                        placeholder={'Enter Coupon Code'} 
                        autoCapitalize={'none'} 
                        placeholderTextColor={'#ccc'} 
                        onChangeText={(text) => this.setState({ coupon: text })} 
                        style={{flex:1 , paddingLeft: wp('5%'), fontSize: wp('4%')}}
                        ref={input => {this.couponInput = input}}
                      />
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
                        <Text style={{ fontSize: wp('3%'), color: '#FF0000' }}>{this.state.discount_not_valid}</Text>
                        :
                        null
                      )
                    }

                    <View style={{ marginTop: wp('5%'), marginBottom: wp('3%') }}>
                        <Text style={{ fontWeight: 'bold', fontSize: wp('5%') }}>Select Item</Text>
                    </View>
                    <FlatList
                        data={this.state.all_product}
                        keyExtractor={item => item.id_pulsa}
                        ListFooterComponent={<View style={{ marginBottom: wp('5%') }} />}
                        renderItem={({item}) => {
                          return (
                          <View>
                              <TouchableOpacity onPress={() => this.selectingPulsa(item)} style={{ padding: wp('3'), marginBottom: wp('2'), backgroundColor: this.state.semi_selecting_pulsa == item.pulsa_code ? '#1DF318' : '#FFF', elevation: 2, borderRadius: wp('2.3%'), width: wp('90%'), flexDirection: 'row' }}>
                                  <View style={{ marginLeft: wp('2%'), justifyContent: 'center', width: wp('40%') }}>
                                      <Text style={{ fontSize: 17, fontFamily: 'Ubuntu-Regular' }}>{this.format(item.pulsa_nominal)}</Text>
                                  </View>
                                  <View style={{ marginLeft: wp('5%'), justifyContent: 'center', width: wp('35%'), alignItems: 'flex-end' }}>
                                      <Text style={{fontFamily: 'Ubuntu-Medium', fontSize: 17, color: '#3269B3' }}>Rp {this.format(item.price_borneo)}</Text>
                                  </View>
                              </TouchableOpacity>
                          </View>
                          )
                        }}
                    />
                  </>
                  :
                  null
                }
            </View>
        </ScrollView>
        <View style={{position: 'relative', paddingTop: wp('2.5%'), paddingBottom: wp('5%'), width: '100%', backgroundColor: 'white', elevation: 16, flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', flex: 1, marginLeft: wp('5%'), justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: wp('4%')}}>Total</Text>
                {this.state.code !== undefined ?
                  <Text style={{color: '#1DF318', fontWeight: 'bold', fontSize: wp('4%')}}>Rp {this.format(this.state.price_pulsa-this.state.discount)}</Text>
                  :
                  <Text style={{color: '#1DF318', fontWeight: 'bold', fontSize: wp('4%')}}>Rp {this.format(this.state.price_pulsa)}</Text>
                }
            </View>
            <View
                style={{
                    // justifyContent: 'flex-end'
                    justifyContent: 'center',
                    marginRight: wp('5%')
                }}
            >
                <TouchableOpacity 
                    onPress={() => this.handlePay()}
                    style={{ backgroundColor: this.state.semi_selecting_pulsa != undefined ? '#3269B3': '#ccc', borderRadius: wp('2.223%'), padding: wp('2.5%'), flexDirection: 'row'}} disabled={this.state.semi_selecting_pulsa == undefined}>
                    <Image source={logo} style={{marginRight: wp('2.5%')}}/>
                    <Text style={{fontWeight: 'bold', fontSize: wp('5%'), color: 'white'}}>Pay</Text>
                </TouchableOpacity>
            </View>
        </View>
        </>
    )}
  </>
}

export default (props) => 
<AuthContext.Consumer>{
  authState => <Mobile authState={authState} {...props}/>
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