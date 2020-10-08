import React, { Component } from 'react'
import { View, Dimensions, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native'
import {AuthContext} from '../context'
import styles from '../styles/ongoingPayment'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import axios from 'axios'

const bcaLogo = require('../assets/icons/bca.png')

class OngoingPayment extends Component<any,any>{
  constructor(props){
    super(props)
  }
  state = {
    viewHeight: undefined,
    design: 'center',
    va: '788873336484',
    amount: '120000',
    exp: '2020-10-09 15:01',
    method: undefined
  }

  componentDidMount = async () => {
    this.setState({method: this.props.route.params.method})
  }

  adjustDesign = (height) => {
    var screenSize = Dimensions.get('window').height - 64;
    if (+height > +screenSize){
      this.setState({design: 'scroll'})
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
    <Text>VA</Text>
    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'center', fontSize: wp('4.5%') }}>VA. Number</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'center', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.va}</Text>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'center', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Amount</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'center', fontSize: wp('7%'), color: '#3269B3' }}>Rp. {this.format(this.state.amount)}</Text>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'center', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Exp. Date</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'center', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.exp}</Text>
    </>
  )

  renderTF = () => (
    <>
    <Text>TF</Text>
    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'center', fontSize: wp('4.5%') }}>VA. Number</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'center', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.va}</Text>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'center', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Amount</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'center', fontSize: wp('7%'), color: '#3269B3' }}>Rp. {this.format(this.state.amount)}</Text>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'center', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Exp. Date</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'center', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.exp}</Text>
    </>
  )

  renderPM = () => (
    <>
    <Text>PM</Text>
    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'center', fontSize: wp('4.5%') }}>VA. Number</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'center', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.va}</Text>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'center', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Amount</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'center', fontSize: wp('7%'), color: '#3269B3' }}>Rp. {this.format(this.state.amount)}</Text>

    <Text style={{ fontFamily: 'Ubuntu-Bold', textAlign: 'center', marginTop: wp('10%'), fontSize: wp('4.5%') }}>Exp. Date</Text>
    <Text style={{ fontFamily: 'Ubuntu-Light', textAlign: 'center', fontSize: wp('7%'), color: '#3269B3' }}>{this.state.exp}</Text>
    </>
  )

  render = () => 
  <>
    {this.state.design === 'center' ?
      <View onLayout={(event) => {
          var {x, y, width, height} = event.nativeEvent.layout;
          this.setState({viewHeight: +(height - 64)/2})
          this.adjustDesign(height)
        }} style={{ width: '100%', marginTop: this.state.viewHeight, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ padding: wp('8%'), width: wp('80%'), backgroundColor: '#FFF', elevation: 7, borderRadius: wp('2%'), marginTop: wp('2%'), marginBottom: wp('2%') }}>
          {this.state.method === 'indomaret' || this.state.method === 'alfamart' ?
            this.renderPM()
            :
            ( this.state.method === 'bca' ?
              this.renderTF() : this.renderVA()
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
                this.renderTF() : this.renderVA()
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