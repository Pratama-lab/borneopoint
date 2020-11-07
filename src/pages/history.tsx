import React, { Component } from 'react'
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator, StyleSheet, Image, Alert, ToastAndroid } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { AuthContext } from '../context'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import Clipboard from '@react-native-community/clipboard'


class History extends Component<any>{
  constructor(props: any){
    super(props);
    this.state = {
      loading: true,
      pending: undefined,
      success: undefined
    }
  }
  componentDidMount = async () => {
    // try{
    //   console.log('authState history', this.props.authState.isSignedIn)
    //   if(this.props.authState.isSignedIn){
    //     console.log('trying to fetch')
    //     this.setState({loading:true})
    //     const result = await getAllTransactionHistory({userToken: this.props.authState.token})
    //     if(result == undefined) throw new Error('fail')
    //     this.setState({ data: result.data, loading: false }, () => console.log('state data history', this.state))
    //   }
    // }catch(error){ 
    //   if(this.state.loading)
    //     this.setState({ loading:false })

    //   console.debug(error)
    // }

    const check_login = await AsyncStorage.getItem('@id_login');

    if (check_login !== undefined){
      this.setState({
        id_login: check_login,
        loading: false
      })
      // alert('berhasil')
    }

    axios.get('https://borneopoint.co.id/public/api/get_user', {params: {
      id_login: check_login
    }})
    .then(resp => {
      // alert(JSON.stringify(resp.data))
      if (resp.data === 'Anda Belum Terdaftar') {
        console.log('Belum Terdaftar')
      } else {
        this.setState({
          name: resp.data.name
        })
      }
    })

    axios.get('https://borneopoint.co.id/public/api/history', {params: {
      id_login: check_login
    }})
    .then(res => {
      // console.log(res.data)
      this.setState({
        loading: false,
        history: res.data,
        status: res.data.status
      })
    })
  }
  refresh = () => {this.componentDidMount()}
  checkSummary = ({purchaseId}) => {
    this.props.navigation.navigate('Summary', { purchaseId })
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
      <View style={[ styless.container_loading, styless.horizontal_loading ]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
      :
      null
    }
    {this.state.id_login !== null ?
      <>
        <FlatList
          data={this.state.history}
          keyExtractor={item => item.transaction_id}
          extraData={this.state}
          ListHeaderComponent={<View style={{ marginTop: wp('3%') }} />}
          renderItem={({item}) => {
            // console.log(item.expired)
            if (item.status === 'Waiting Payment' || item.status === 'Pending') {
              if (item.product_type === 'topup') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: (item.expired === true ? 'red' : '#FFA500'), width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>TopUp - <Text style={{ textTransform: 'uppercase' }}>{item.payment_channel}</Text></Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            {item.expired === true ?
                              <Text style={{ color: 'red', fontFamily: 'Ubuntu-Regular' }}>Expired</Text>
                              :
                              <TouchableOpacity
                                onPress={() => {
                                  const showToast = () => {
                                    ToastAndroid.show("Copied", ToastAndroid.SHORT);
                                  }
                                  Clipboard.setString(item.va) 
                                  showToast()
                                }}
                              >
                                <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), textDecorationLine: 'underline', color: '#4E7ED6' }} numberOfLines={1}>{item.va}</Text>
                              </TouchableOpacity>
                            }
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>Rp {this.format(item.transfer_amount)}</Text>
                          </View>
                        </View>
                        {item.expired === true ?
                          null
                          :
                          <View style={{ marginLeft: wp('2%'), width: wp('10%'), alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ongoingPayment', {data: item})}>
                              <Image source={require('../assets/icons/arrowDown.png')} style={{ transform: [{ rotate: '270deg' }] }} />
                            </TouchableOpacity>
                          </View>
                        }
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'pulsa'){
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#FFA500', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>Pulsa - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#FFA500' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>Rp {this.format(item.product_nominal)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'electricity') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#FFA500', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_operator, ToastAndroid.SHORT)}>Electricity - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#FFA500' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>Rp {this.format(item.product_nominal)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'data') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#FFA500', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_operator, ToastAndroid.SHORT)}>Data - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#FFA500' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('40%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'game') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#FFA500', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_operator, ToastAndroid.SHORT)}>Gaming - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#FFA500' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('40%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{this.format(item.product_nominal)}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'forex') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#FFA500', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>Forex - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#FFA500' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>Rp {this.format(item.product_nominal)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'etoll') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#FFA500', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>EToll - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#FFA500' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>{item.product_nominal}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'vouchers') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#FFA500', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_operator, ToastAndroid.SHORT)}>Vouchers - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#FFA500' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('40%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              }
            } else if (item.status === 'Success') {
              if (item.product_type === 'topup'){
                return (
                <View style={{ alignItems: 'center' }}>
                  <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                    <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ backgroundColor: '#32CD32', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                    </View>
                    <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                      <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                        <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>TopUp - <Text style={{ textTransform: 'uppercase' }}>{item.payment_channel}</Text></Text>
                      </View>
                      <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#32CD32' }} numberOfLines={1}>{item.status}</Text>
                        <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                        <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>Rp {this.format(item.deposit_amount)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                )
              } else if (item.product_type === 'pulsa') {
                return (
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                      <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: '#32CD32', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                      </View>
                      <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                        <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                          <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>Pulsa - {item.product_operator}</Text>
                        </View>
                        <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                          <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#32CD32' }} numberOfLines={1}>{item.status}</Text>
                          <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                          <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>Rp {this.format(item.product_nominal)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              } else if (item.product_type === 'data') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#32CD32', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_operator, ToastAndroid.SHORT)}>Data - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#32CD32' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('40%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'electricity') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#32CD32', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_operator, ToastAndroid.SHORT)}>Electricity - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#32CD32' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>Rp {this.format(item.product_nominal)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'game') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#32CD32', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_operator, ToastAndroid.SHORT)}>Gaming - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#32CD32' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>{this.format(item.product_nominal)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'topup_platform') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#32CD32', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>HotForex - Rp {this.format(item.topup_rate * item.topup_conversion)}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#32CD32' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}
                              onPress={() => {
                                const showToast = () => {
                                  ToastAndroid.show("Copied", ToastAndroid.SHORT);
                                }
                                Clipboard.setString(item.topup_code)
                                showToast()
                              }}
                            >{item.topup_code}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'etoll') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#32CD32', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>EToll - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#32CD32' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>{item.product_nominal}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'vouchers') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#32CD32', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>Vouchers - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#32CD32' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('40%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                            </View>
                          </View>
                        </View>
                        <View style={{ width: wp('10%'), alignItems: 'center', justifyContent: 'center' }}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('ongoingPayment', {data: item})}>
                            <Image source={require('../assets/icons/arrowDown.png')} style={{ transform: [{ rotate: '270deg' }] }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'transfer') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: '#32CD32', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1} onPress={() => ToastAndroid.show(item.receiver_email, ToastAndroid.SHORT)}>Transfer - {item.receiver_email}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: '#32CD32' }} numberOfLines={1}>{item.status}</Text>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('40%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1}>Rp {this.format(item.deposit_amount)}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              }
            } else {
              if (item.product_type === 'topup'){
                return (
                <View style={{ alignItems: 'center' }}>
                  <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                    <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ backgroundColor: 'red', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                    </View>
                    <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                      <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                        <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>TopUp - <Text style={{ textTransform: 'uppercase' }}>{item.payment_channel}</Text></Text>
                      </View>
                      <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: 'red' }} numberOfLines={1}>{item.va}</Text>
                        <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                        <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }}>Rp {this.format(item.transfer_amount)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                )
              }else if (item.product_type === 'pulsa') {
                return (
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                      <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: 'red', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                      </View>
                      <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                        <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                        <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>Pulsa - {item.product_operator}</Text>
                        </View>
                        <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                          <View style={{ maxWidth: wp('35%') }}>
                            <TouchableOpacity onPress={() => {
                              ToastAndroid.show(item.status, ToastAndroid.SHORT)
                            }}>
                              <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: 'red' }} numberOfLines={1}>{item.status}</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                          <View style={{ width: wp('30%') }}>
                            <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              } else if (item.product_type === 'data') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: 'red', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>Data - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <View style={{ maxWidth: wp('35%') }}>
                              <TouchableOpacity onPress={() => {
                                ToastAndroid.show(item.status, ToastAndroid.SHORT)
                              }}>
                                <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: 'red' }} numberOfLines={1}>{item.status}</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('30%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'electricity') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: 'red', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>Electricity - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <View style={{ maxWidth: wp('35%') }}>
                              <TouchableOpacity onPress={() => {
                                ToastAndroid.show(item.status, ToastAndroid.SHORT)
                              }}>
                                <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: 'red' }} numberOfLines={1}>{item.status}</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('30%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'game') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: 'red', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>Gaming - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <View style={{ maxWidth: wp('35%') }}>
                              <TouchableOpacity onPress={() => {
                                ToastAndroid.show(item.status, ToastAndroid.SHORT)
                              }}>
                                <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: 'red' }} numberOfLines={1}>{item.status}</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('30%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'forex') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: 'red', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>Forex - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <View style={{ maxWidth: wp('35%') }}>
                              <TouchableOpacity onPress={() => {
                                ToastAndroid.show(item.status, ToastAndroid.SHORT)
                              }}>
                                <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: 'red' }} numberOfLines={1}>{item.status}</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('30%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'etoll') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: 'red', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>EToll - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <View style={{ maxWidth: wp('35%') }}>
                              <TouchableOpacity onPress={() => {
                                ToastAndroid.show(item.status, ToastAndroid.SHORT)
                              }}>
                                <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: 'red' }} numberOfLines={1}>{item.status}</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('30%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              } else if (item.product_type === 'vouchers') {
                return (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginBottom: wp('3%'), flexDirection: 'row', height: wp('20%'), backgroundColor: '#FFF', elevation: 2, width: wp('90%'), borderRadius: wp('1%') }}>
                        <View style={{ width: wp('10%'), height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ backgroundColor: 'red', width: wp('4%'), height: wp('4%'), borderRadius: wp('3%') }} />
                        </View>
                        <View style={{ marginLeft: wp('2%'), width: wp('66%') }}>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2.2%') }}>
                            <Text style={{ fontFamily: 'Ubuntu-Bold', fontSize: wp('6%') }} numberOfLines={1}>Vouchers - {item.product_operator}</Text>
                          </View>
                          <View style={{ marginLeft: wp('3%'), marginRight: wp('3%'), marginTop: wp('2%'), flexDirection: 'row' }}>
                            <View style={{ maxWidth: wp('35%') }}>
                              <TouchableOpacity onPress={() => {
                                ToastAndroid.show(item.status, ToastAndroid.SHORT)
                              }}>
                                <Text style={{ fontFamily: 'Ubuntu-Regular', fontSize: wp('4%'), color: 'red' }} numberOfLines={1}>{item.status}</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{ width: wp('1.5%'), height: wp('1.5%'), backgroundColor: '#000', borderRadius: wp('3%'), marginTop: wp('1.8%'), marginLeft: wp('1.5%') }} />
                            <View style={{ width: wp('40%') }}>
                              <Text style={{ marginLeft: wp('1.5%'), fontFamily: 'Ubuntu-Regular' }} numberOfLines={1} onPress={() => ToastAndroid.show(item.product_nominal, ToastAndroid.SHORT)}>{item.product_nominal}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              }
            }
          }
          }
        />
      </>
      :
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Auth')}><Text style={{textDecorationLine: 'underline'}}>Please Login First</Text></TouchableOpacity>
      </View>
    }
  </>
}

export default (props) => 
  <AuthContext.Consumer>
  {
    authState => <History authState={authState} {...props}/>
  }
  </AuthContext.Consumer>

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