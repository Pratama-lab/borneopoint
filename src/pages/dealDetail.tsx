import React, { Component } from 'react'
import { ScrollView,Text, Image,View, RefreshControl } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

const url = 'https://borneopoint.co.id/public/asset/images/'

class DealDetail extends Component<any>{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      deskripsi:''
    }
  }

  componentDidMount = () => {
    axios.get('https://borneopoint.co.id/public/api/get_deals_detail', {params: {
      deals_id: this.props.route.params.deals_id
    }})
    .then(resp => {
      console.log("DEALS ID => ", this.props.route.params.deals_id)
      console.log("RESPON => ", resp)
      this.setState({
        loading: false,
        image: resp.data[0].deals_image,
        deskripsi: resp.data[0].deals_description
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

  render= () => 
    <ScrollView style={{flex: 1}} contentContainerStyle={{padding: widthPercentageToDP('5%')}} refreshControl={<RefreshControl refreshing={this.state.loading}></RefreshControl>}>
      <View style={{elevation: 2}}>
        <FastImage 
          style={{width: '100%', aspectRatio: 16/9, marginBottom: widthPercentageToDP('5%'), borderRadius: widthPercentageToDP('2.5%')}}
          resizeMode={'cover'}
          source={{
            uri: url+this.state.image
          }}/>
      </View>
      <Text style={{ fontSize: widthPercentageToDP('5%') }}>{this.state.deskripsi}</Text>
    </ScrollView>
}

export default DealDetail