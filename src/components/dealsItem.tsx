import React, { Component } from 'react'
import { TouchableOpacity, View, Image, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import formatRupiah from '../functions/formatRupiah'

const alfamart = require('../assets/images/alfamart.png')

class DealsItem extends Component<any>{
  constructor(props: any){
    super(props)
  }
  render = () => 
    <TouchableOpacity style={{
      width           : wp('90%'), 
      aspectRatio     : 328/128, 
      borderRadius    : wp('2.22223%'),
      backgroundColor : 'white',
      elevation       : 2,
      overflow        : 'hidden',
      flexDirection   : 'row'
    }}>
      <View style={{
        height        : '100%',
        aspectRatio   : 1/1
      }}>
        <Image source={alfamart} style={{height: '100%', width: '100%'}}/>
      </View>
      <View style={{ flex: 1, padding:  wp('2.22223')}}>
        <Text style={{ fontWeight : 'bold', fontSize: wp('3.8888889') }}>{this.props.name ? this.props.name : 'Deals'}</Text>
        <Text style={{ fontSize: wp('3.8888889') }}>Available {this.props.maxTransaction ? this.props.maxTransaction : 0}</Text>
        <View style={{alignSelf: "flex-end", marginTop: 'auto'}}>
          {/* <Text style={{textDecorationLine: 'line-through', color: '#ccc',alignSelf: 'flex-end'}}>Rp 30.000,00</Text> */}
          <Text style={{fontWeight: 'bold', fontSize: wp('4.5%')}}>Rp {formatRupiah(this.props.price?.toString(), undefined)},00</Text>
        </View>
      </View>
    </TouchableOpacity>
}

export default DealsItem