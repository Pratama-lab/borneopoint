import React, { Component } from 'react'
import { View, Dimensions, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView, ToastAndroid } from 'react-native'
import {AuthContext} from '../context'
import styles from '../styles/ongoingPayment'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import axios from 'axios'
import Clipboard from '@react-native-community/clipboard'

const bcaLogo = require('../assets/icons/bca.png')

class OngoingPayment extends Component<any,any>{
  constructor(props){
    super(props)
  }
  state = {
    viewHeight: undefined,
    design: 'center',
    va: undefined,
    amount: 0,
    exp: undefined,
    method: undefined,
    product_operator: undefined,
    product_nominal: undefined,
    sn: undefined
  }

  componentDidMount = async () => {
    console.log(this.props.route.params.data)
    this.setState({
      va: this.props.route.params.data.va,
      method: this.props.route.params.data.payment_channel,
      desc: this.props.route.params.data.keterangan,
      expiredAt: this.props.route.params.data.expiredAt,
      amount: this.props.route.params.data.transfer_amount,
      product_operator: this.props.route.params.data.product_operator,
      product_nominal: this.props.route.params.data.product_nominal,
      sn : this.props.route.params.data.sn
    })
  }

  adjustDesign = (height) => {
    var screenSize = Dimensions.get('window').height - 64;
    if (+height > +screenSize){
      this.setState({
        design: 'scroll',
        viewHeight: ((screenSize - height) - 64)/2
      }, () => {console.log("VIEW HEIGHT => ",this.state.viewHeight)})
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

  renderVA = () => (
    <>
    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', fontSize: wp('4.5%') }}>VA. Number ({this.props.route.params.data.payment_channel.toUpperCase()})</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.va}</Text>
      <TouchableOpacity
        style={{ marginLeft: wp('2%') }}
        onPress={() => {
          const showToast = () => {
            ToastAndroid.show("Copied", ToastAndroid.SHORT);
          }
          Clipboard.setString(this.state.va)
          showToast()
        }}
      >
        <Image source={require('../assets/icons/copy.png')} style={{ width: wp('5%'), height: wp('5%') }} />
      </TouchableOpacity>
    </View>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Amount</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('7%'), color: '#3269B3' }}>Rp {this.format(this.state.amount)}</Text>

    {this.state.exp === undefined ?
      null
      :
      <>
      <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Exp. Date</Text>
      <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.exp}</Text>
      </>
    }
    </>
  )

  renderTF = () => (
    <>
    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', fontSize: wp('4.5%') }}>Account Number ({this.props.route.params.data.payment_channel.toUpperCase()})</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.va}</Text>
      <TouchableOpacity
        style={{ marginLeft: wp('2%') }}
        onPress={() => {
          const showToast = () => {
            ToastAndroid.show("Copied", ToastAndroid.SHORT);
          }
          Clipboard.setString(this.state.va)
          showToast()
        }}
      >
        <Image source={require('../assets/icons/copy.png')} style={{ width: wp('5%'), height: wp('5%') }} />
      </TouchableOpacity>
    </View>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Amount</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('7%'), color: '#3269B3' }}>Rp {this.format(this.state.amount)}</Text>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Description</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('5%'), color: '#3269B3' }}>{this.state.desc}</Text>

    {this.state.exp === undefined ?
      null
      :
      <>
      <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Exp. Date</Text>
      <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.exp}</Text>
      </>
    }
    </>
  )

  renderPM = () => (
    <>
    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', fontSize: wp('4.5%') }}>Amount ({this.props.route.params.data.payment_channel.toUpperCase()})</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('7%'), color: '#3269B3' }}>Rp {this.format(this.state.amount)}</Text>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Description</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('5%'), color: '#3269B3' }}>{this.state.desc}</Text>

    {this.state.exp === undefined ?
      null
      :
      <>
      <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Exp. Date</Text>
      <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('7%'), color: '#3269B3'}}>{this.state.exp}</Text>
      </>
    }
    </>
  )

  renderDW = () => (
    <>
    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', fontSize: wp('4.5%') }}>Operator</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.product_operator}</Text>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('5%'), fontSize: wp('4.5%') }}>Serial Number</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('5%'), color: '#3269B3' }}>{this.state.sn.split(' / ')[0]}</Text>
    
    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('5%'), fontSize: wp('4.5%') }}>Description</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('5%'), color: '#3269B3' }}>{this.state.product_nominal}</Text>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('5%'), fontSize: wp('4.5%') }}>Exp. Date</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('5%'), color: '#3269B3' }}>{this.state.sn.split(' / ')[1]}</Text>

    {this.state.exp === undefined ?
      null
      :
      <>
      <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'left', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Exp. Date</Text>
      <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'left', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.exp}</Text>
      </>
    }
    </>
  )

  render = () => 
  <>
    {this.state.design === 'center' ?
      <View onLayout={(event) => {
          var {x, y, width, height} = event.nativeEvent.layout;
          this.adjustDesign(height)
        }} style={{ width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ padding: wp('8%'), width: wp('80%'), backgroundColor: '#FFF', elevation: 7, borderRadius: wp('2%'), marginTop: wp('2%'), marginBottom: wp('2%') }}>
          {this.state.method === 'indomaret' || this.state.method === 'alfamart' ?
            this.renderPM()
            :
            ( this.state.method === 'bca' ?
              this.renderTF()
              :
              (this.state.method === 'vouchers' ?
                this.renderDW() : this.renderVA()
              )
            )
          }
        </View>
      </View>
      :
      <ScrollView>
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: wp('10%'), marginBottom: wp('10%') }}>
          <View style={{ padding: wp('8%'), width: wp('80%'), backgroundColor: '#FFF', elevation: 4, borderRadius: wp('2%'), marginTop: wp('2%'), marginBottom: wp('2%') }}>
            {this.state.method === 'indomaret' || this.state.method === 'alfamart' ?
              this.renderPM()
              :
              ( this.state.method === 'bca' ?
                this.renderTF()
                :
                (this.state.method === 'vouchers' ?
                this.renderDW() : this.renderVA()
                )
              )
            }
          </View>
        </View>
      </ScrollView>
    }
  </>
}

export default (props) => 
<AuthContext.Consumer>{
  authState => <OngoingPayment authState={authState} {...props}/>
}</AuthContext.Consumer>