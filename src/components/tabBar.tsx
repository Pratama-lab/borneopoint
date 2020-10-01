import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { heightPercentageToDP as hp} from 'react-native-responsive-screen'
// import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient';

const home = require('../assets/icons/home.png')
const homeActive = require('../assets/icons/homeActive.png')

const history = require('../assets/icons/history.png')
const historyActive = require('../assets/icons/historyActive.png')

const deals = require('../assets/icons/deals.png')
const dealsActive = require('../assets/icons/dealsActive.png')

const profile = require('../assets/icons/profile.png')
const profileActive = require('../assets/icons/profileActive.png')

class Tab extends Component<any,any>{
  constructor(props:any){
    super(props)
  }
  swithcTab = (index: number) => {
    try{
      // this.props.navigation.reset(this.props.state.routes[index].name)
      this.props.navigation.reset({ routes: [{ name: this.props.state.routes[index].name }] })
    }catch(error){
      console.debug(error)
    }
  }
  render = () => {
    const index = this.props.state.index
    return (
      <View 
        style={{
          height: 64,
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          elevation: 8,
          backgroundColor: 'white'
        }}>

        <TouchableOpacity onPress={() => this.swithcTab(0)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
          <Image source={index === 0 ? homeActive : home}/>
          <Text style={{color: index === 0 ? '#3269B3' : 'gray'}}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.swithcTab(1)} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={index === 1 ? historyActive : history}/>
          <Text style={{color: index === 1 ? '#3269B3' : 'gray'}}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.swithcTab(2)} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={index === 2 ? dealsActive : deals}/>
          <Text style={{color: index === 2 ? '#3269B3' : 'gray'}}>Deals</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.swithcTab(3)} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={index === 3 ? profileActive : profile}/>
          <Text style={{color: index === 3 ? '#3269B3' : 'gray'}}>Profile</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Tab