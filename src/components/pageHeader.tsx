import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const back = require('../assets/icons/back.png')
const notification = require('../assets/icons/bell.png')
const eng = require('../assets/icons/eng.png')

interface IHeaderProps{
  navigation?: any,
  title: any
}

class Header extends Component<IHeaderProps>{
  constructor(props: any){
    super(props)
  }
  goTo = () => {
    try{
      this.props.navigation.goBack()
    }catch(error){ console.debug(error) }
  }
  render = () => 
    <View style={{
      height: 64,
      position: 'relative',
      elevation: 8,
      backgroundColor: 'white'
    }}>
      <LinearGradient colors={[ '#3269B3','#6FC3F7' ]} style={{width: '100%', position: 'absolute', height: '100%'}} start={{x: 0, y: 0}} end={{x: 1, y: 0}}/>
      <View style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft: wp('5%')
      }}>
        <TouchableOpacity style={{
          height: '100%',
          aspectRatio: (1/1),
          justifyContent: 'center',
          alignItems: 'center',
        }} onPress={this.goTo}>
          <Image source={back} style={{ height: '50%', width: '50%'}}/>
        </TouchableOpacity>
        <View style={{
          justifyContent: 'center',
          flex: 1,
        }}>
          <Text style={{
            fontFamily: 'Ubuntu-Regular', 
            color: 'white', 
            fontSize: 24
          }}>{this.props.title}</Text>
        </View>
      </View>
    </View>
}

export default Header