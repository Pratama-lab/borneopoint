import React, { Component } from 'react'
import { FlatList, View, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, BackHandler, ToastAndroid } from 'react-native'
import DealsItem from '../components/dealsItem'
import { heightPercentageToDP, widthPercentageToDP as wp }  from 'react-native-responsive-screen'
import { getAllDeal } from '../api'

import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import FastImage from 'react-native-fast-image'

const url = 'https://admin.borneopoint.co.id/asset/images/'

let backPressed = 0;

class Deals extends Component{
  constructor(props:any){
    super(props);
    this.state = {
      loading: true,
      backPressed: 1
    }
  }
  componentDidMount = async () => {
    // try{
    //   this.setState({
    //     loading: true
    //   })
    //   const data = await getAllDeal()
    //   console.debug('dealsData',data)
    //   this.setState({
    //     loading: false,
    //     deals: data.data
    //   }, () => console.log(this.state.deals))
    // }catch(error){
    //   console.debug(error)
    // }

    axios.get('https://admin.borneopoint.co.id/api/get_all_deals')
    .then(resp => {
      this.setState({
        loading: false,
        all_deals: resp.data
      })
    })
  }

  refresh = () => {
    try{
      // this.setState({ loading: true })
      this.componentDidMount()
    }catch(error){
      console.log(error)
    }
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
      <View style={{ width: '100%', alignItems: 'center' }}>
        <FlatList
          data={this.state.all_deals}
          keyExtractor={item => item.deals_id}
          extraData={this.state}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('dealDetail', {deals_id: item.deals_id})} style={{ width: wp('90%'), height: heightPercentageToDP('30%'), marginTop: wp('2%'), backgroundColor: 'white', elevation: 4, borderRadius: wp('2.5%') }}>
              <FastImage source={{ uri: url+item.deals_image }} style={{ width: '100%', height: '100%', borderRadius: wp('2.5%') }} />
            </TouchableOpacity>
          )}
        />
      </View>
    </>
}

export default Deals

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