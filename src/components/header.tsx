import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const logo = require('../assets/miniLogo.png')
const notification = require('../assets/icons/bell.png')
const eng = require('../assets/icons/eng.png')

interface IHeaderProps{
  navigation?: any
}

class Header extends Component<IHeaderProps>{
  constructor(props: any){
    super(props)
  }
  goTo = (routeName:string) => {
    try{
      this.props.navigation.navigate(routeName)
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
        <View style={{
          height: '100%',
          aspectRatio: (1/1),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Image source={logo} style={{ height: '50%', width: '50%'}}/>
        </View>
        <View style={{
          justifyContent: 'center',
          flex: 1,
        }}>
          <Text style={{
            fontFamily: 'Ubuntu-Regular', 
            color: 'white', 
            fontSize: 24
          }}>BorneoPoint</Text>
        </View>
        {/* <TouchableOpacity style={{
          height: '80%',
          aspectRatio: (1/1),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Image source={eng} style={{ height: '50%', width: '50%'}}/>
        </TouchableOpacity> */}
        {/* <TouchableOpacity 
          style={{
            height: '80%',
            aspectRatio: (1/1),
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            marginRight: wp('5%')
          }}
          onPress={() => this.goTo('Notifications')}>
          <Image source={notification} style={{ height: '50%', width: '50%'}}/>
          <View style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            backgroundColor: 'red',
            borderRadius: 120,
            width: '40%',
            aspectRatio: 1/1,
            justifyContent: 'center',
            alignItems: 'center'
          }}><Text style={{color: 'white'}}>2</Text></View>
        </TouchableOpacity> */}
      </View>
    </View>
}

export default Header