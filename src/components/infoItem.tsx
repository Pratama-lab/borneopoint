import React, { Component } from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const defaultImage = require('../assets/images/imagePlaceholder.png')



class InfoItem extends Component<{name:string, description: string,goTo: Function}>{
  constructor(props:any){
    super(props)
  }
  render = () => 
    <TouchableOpacity style={{
      width: wp('66.666%'),
      aspectRatio: 24/16,
      backgroundColor: '#ccc',
      borderRadius: wp('2.223%'),
      overflow: 'hidden',
      elevation: 4,
      position: 'relative'
    }} onPress={() => this.props.goTo(this.props.name, this.props.description)}>
      <View style={{
        width: '100%',
        height: '100%'
      }}>
        <Image source={{
          uri: 'https://picsum.photos/200/300',
          cache: 'only-if-cached'
        }} style={{width: '100%', height: '100%',}}/>
      </View>
      <View style={{
        // height: '50%',
        width: '100%',
        aspectRatio: 240/64,
        backgroundColor: 'rgba(255,255,255,0.9)',
        position: 'absolute',
        bottom: 0,
        left: 0
      }}>
        <Text style={{marginLeft: wp('2.2223'), fontWeight: 'bold', marginTop: wp('1.11115'), fontSize: wp('3.3%')}}>{ this.props.name ? this.props.name : "Info & Promotion title"}</Text>
        <Text style={{marginLeft: wp('2.2223'), fontSize: wp('3%')}} numberOfLines={2}>{this.props.description ? this.props.description : "Mau TopUp dapet diskon coba klik di sini untuk lihat detail promo !"}</Text>
      </View>
    </TouchableOpacity>
}

export default InfoItem