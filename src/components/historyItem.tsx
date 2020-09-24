import React, { Component } from 'react'
import { TouchableOpacity, View, Image, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import formatRupiah from '../functions/formatRupiah'

import moment from 'moment'

const rqr = require('../assets/icons/rqr.png')
const person = require('../assets/icons/person.png')
const topUp = require('../assets/icons/topUp.png')
const transfer = require('../assets/icons/transfer.png')
const withdraw = require('../assets/icons/withdraw.png')
const electricity = require('../assets/icons/electricity.png')
const mobile = require('../assets/icons/mobile.png')
const data = require('../assets/icons/data.png')
const gaming = require('../assets/icons/gaming.png')
const money = require('../assets/icons/money.png')
const bpjs = require('../assets/icons/bpjs.png')
const vouchers = require('../assets/icons/vouchers.png')
const others = require('../assets/icons/others.png')

interface IHistoryItemProps{

}

const getImage = (x: any) => {
  switch(x){
    case 'voucher': return vouchers
    case 'data': return data
    case 'pulsa': return mobile
    case 'pln': return electricity
    default: return electricity
  }
}

class HistoryItem extends Component<any,any>{
  constructor(props:any){
    super(props)
  }
  componentDidMount = () => {
    console.log(this.props.title)
  }
  render = () => 
    <TouchableOpacity 
    onPress={() => this.props.checkSummary({purchaseId: this.props.data._id})}
      style={{
      width             : wp('91.11111%'),
      backgroundColor   : 'white',
      borderRadius      : wp('2.22223%'),
      elevation         : 2 ,
      aspectRatio       : 328/80,
      flexDirection     : 'row'
    }}>
      <View style={{
        height          : '100%',
        aspectRatio     : 1/1,
        justifyContent  : 'center',
        alignItems      : 'center'
      }}>
        <View style={{
          height        : '80%',
          aspectRatio   : 1/1,
          borderColor   : '#000000',
          borderWidth   : 1,
          borderRadius  : wp('2.22223%'),
          justifyContent: 'center',
          alignItems    : 'center'
        }}>
          <Image source={getImage(this.props?.data?.itemType)} style={{ height: '80%', width: '80%'}}/>
        </View>
      </View>
      <View style={{
        flex            : 1,
        justifyContent  : 'center',
        height          : '100%'
      }}>
        <Text style={{
          fontWeight    : 'bold'
        }}>{this.props.title}</Text>
        <Text
          numberOfLines={1}
          style={{
            color       : '#ccc'
          }}>{moment(this.props.date).format('YYYY-MM-DD - LT')}</Text>
      </View>
      <View style={{
        // flex        : 1,
        justifyContent  : 'center',
        alignItems      : 'flex-end',
        marginRight     : wp('4.445%'),
        height          : '100%',
        // width: 'min-content'
      }}>
        <Text style={{fontWeight: 'bold'}}>Rp {formatRupiah(this.props.price.toString(), '')},00</Text>
        <Text style={{
          fontWeight    : 'bold',
          color         : this.props.status == 'PENDING' ? '#FFC850' : this.props.status == 'FAILED' ? 'red' : '#1DF318'
        }}>{this.props.status}</Text>
      </View>
    </TouchableOpacity>
}

export default HistoryItem