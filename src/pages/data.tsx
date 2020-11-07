import React, { Component } from 'react'
import { ScrollView , Alert, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, FlatList, StyleSheet, PermissionsAndroid, ToastAndroid} from 'react-native';
import FastImage from 'react-native-fast-image'
import { widthPercentageToDP  as wp} from 'react-native-responsive-screen';
import axios from 'axios'
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle } from 'react-native-popup-dialog';
import Contacts from 'react-native-contacts'
import { selectContactPhone } from 'react-native-select-contact'
import { AuthContext } from '../context'
import AsyncStorage from '@react-native-community/async-storage';

const logo = require('../assets/miniLogo.png')

class Data extends Component<any,any>{
  constructor(props){
    super(props)
  }
  state = {
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
    pulsa_price: undefined
  }



  componentDidMount = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Success')
    } else {
      console.log('Failed')
    }
    
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

  refresh = () => this.componentDidMount
    onChangePhoneNumber = (text, fromContact = false) => {
      this.setState({phone_number: text})
      let prefixes = {
        'indosat1' : '0814','indosat2' : '0815','indosat3' : '0816','indosat4' : '0855','indosat5' : '0856','indosat6' : '0857','indosat7' : '0858',
        'xl1' : '0817','xl2' : '0818','xl3' : '0819','xl4' : '0859','xl5' : '0878','xl6' : '0877',
        'axis1' : '0838','axis2' : '0837','axis3' : '0831','axis4' : '0832',
        'telkomsel1' : '0812','telkomsel2' : '0813','telkomsel3' : '0852','telkomsel4' : '0853','telkomsel5' : '0821','telkomsel6' : '0823','telkomsel7' : '0822','telkomsel8' : '0851',
        'smartfren1' : '0881','smartfren2' : '0882','smartfren3' : '0883','smartfren4' : '0884','smartfren5' : '0885','smartfren6' : '0886','smartfren7' : '0887','smartfren8' : '0888',
        'tri1' : '0896','tri2' : '0897','tri3' : '0898','tri4' : '0899','tri5' : '0895'
      };
      // console.log(prefixes)
      if (fromContact === false){
        if (text.length === 4 && this.state.after4digit === false) {
          for(var k in prefixes) {
            if (text.substr(0, 4) === prefixes[k]) {
              axios.get('https://borneopoint.co.id/public/api/get_all_product', {params:{
                itemType: this.props.route.params.itemType,
                operator: k.slice(0, -1)
              }})
              .then(data => {
                this.setState({
                  selectedProduct: -1,
                  loading: false,
                  all_product: data.data,
                  productEnabled: true,
                  price: 0,
                  payment_method: undefined,
                  selectedOperator: k.slice(0, -1),
                  phone_number: text,
                  after4digit: true
                })
                console.log(data.data)
              }).catch(e => console.log(e))
              break;
            }
          }
        }else if (text.length < 4){
          this.setState({
            selectedOperator: undefined,
            all_product: undefined,
            after4digit: false,
            price_pulsa: 0,
            payment_method: undefined,
            semi_selecting_pulsa: undefined
          })
        }
      }else{
        for(var k in prefixes) {
          if (text.substr(0, 4) === prefixes[k]) {
            axios.get('https://borneopoint.co.id/public/api/get_all_product', {params:{
              itemType: this.props.route.params.itemType,
              operator: k.slice(0, -1)
            }})
            .then(data => {
              this.setState({
                selectedProduct: -1,
                loading: false,
                all_product: data.data,
                productEnabled: true,
                price: 0,
                selectedOperator: k.slice(0, -1),
                phone_number: text,
                after4digit: true
              })
              console.log(text.substr(0, 4))
            }).catch(e => console.log(e))
            break;
          }
        }
      }
      
    }

  selectingOperator = async (itemValue) => {
    this.setState({ selectedOperator: itemValue, productEnabled: false})
    if (itemValue !== -1){
      this.setState({ loading: true})
      
    } else { this.setState({all_product: undefined, selectedProduct: -1, price: 0, payment_method: undefined}) }
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

  selectingPulsa = async (item) => {
    const showToast = () => {
      ToastAndroid.show(item.pulsa_details, ToastAndroid.LONG)
    }
    showToast()
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

  getPhoneNumber = () => {
    return selectContactPhone()
    .then(selection => {
      if (!selection) {
          return null;
      }
      
      let { selectedPhone } = selection;
      const number = selectedPhone.number.replace('+','0').replace(/ |62|-/g, '').trim();
      this.setState({phone_number: number})
      if (typeof number !== 'undefined'){
        this.setState({
          after4digit: true,
          price_pulsa: 0,
          payment_method: undefined,
          semi_selecting_pulsa: undefined
        })
        this.onChangePhoneNumber(number, true)
      }
    });
  }

  handlePay = async () => {
    const id_login = await AsyncStorage.getItem('@id_login')
    this.setState({loading: true})
    var data = {
      product_operator: this.state.product_operator,
      product_nominal: this.state.product_nominal,
      phone_number: this.state.phone_number,
      user_id: id_login,
      product_type: 'data',
      product_id: this.state.product_id,
      pulsa_price: this.state.pulsa_price,
      price_borneo: this.state.price_borneo,
      payment_channel: 'data'
    }

    // product_operator, product_nominal, phone_number, user_id, product_id, pulsa_price, price_borneo
    axios.get('https://borneopoint.co.id/public/api/top_up_request', {params:{data}})
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
    {this.props.route.params.itemType === 'data' && (
        <>
        <ScrollView style={{ padding: wp('5%'), backgroundColor: 'white' }}>
            <View>
                <View>
                    <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>No. Tujuan</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ borderBottomWidth: 2, width: wp('73%'), flexDirection: 'row' }}>
                        <TextInput
                            onChangeText={(text) => this.onChangePhoneNumber(text)}
                            placeholder="Your Phone Number"
                            style={{ fontSize: 16, width: wp('55%') }}
                            keyboardType='phone-pad'
                            value={this.state.phone_number}
                        />
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: wp('18%') }}>
                          {this.state.selectedOperator === 'tri' && (
                            <FastImage source={{ uri: 'https://cdn.mobilepulsa.net/img/logo/pulsa/small/three.png' }} style={{ width: '100%', height: wp('10%') }} />
                          )}
                          {this.state.selectedOperator === 'xl' && (
                            <FastImage source={{ uri: 'https://cdn.mobilepulsa.net/img/logo/pulsa/small/xl.png' }} style={{ width: '100%', height: wp('10%') }} />
                          )}
                          {this.state.selectedOperator === 'axis' && (
                            <FastImage source={{ uri: 'https://cdn.mobilepulsa.net/img/logo/pulsa/small/axis.png' }} style={{ width: '100%', height: wp('10%') }} />
                          )}
                          {this.state.selectedOperator === 'indosat' && (
                            <FastImage source={{ uri: 'https://cdn.mobilepulsa.net/img/logo/pulsa/small/indosat.png' }} style={{ width: '100%', height: wp('10%') }} />
                          )}
                          {this.state.selectedOperator === 'telkomsel' && (
                            <FastImage source={{ uri: 'https://cdn.mobilepulsa.net/img/logo/pulsa/small/telkomsel.png' }} style={{ width: '100%', height: wp('10%') }} />
                          )}
                          {this.state.selectedOperator === 'smartfren' && (
                            <FastImage source={{ uri: 'https://cdn.mobilepulsa.net/img/logo/pulsa/small/smart.png' }} style={{ width: '100%', height: wp('9%') }} />
                          )}
                        </View>
                      </View>
                      <View style={{ alignItems: 'center', alignContent: 'center', marginLeft: wp('3%'), width: wp('13%') }}>
                        <TouchableOpacity onPress={this.getPhoneNumber}>
                            <Image source={require('../assets/icons/address-book.png')} style={{ width: wp('10%'), height: wp('10%'), marginTop: wp('2%') }} />
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>

                <View style={{ marginTop: wp('5%'), marginBottom: wp('3%') }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('5%') }}>Nominal</Text>
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
            </View>
        </ScrollView>
        <View style={{position: 'relative', paddingTop: wp('2.5%'), paddingBottom: wp('5%'), width: '100%', backgroundColor: 'white', elevation: 16, flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', flex: 1, marginLeft: wp('5%'), justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: wp('4%')}}>Total</Text>
                <Text style={{color: '#1DF318', fontWeight: 'bold', fontSize: wp('4%')}}>Rp {this.format(this.state.price_pulsa)}</Text>
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
  authState => <Data authState={authState} {...props}/>
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