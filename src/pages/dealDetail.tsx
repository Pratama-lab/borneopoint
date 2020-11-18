import React, { Component } from 'react'
import { ScrollView,Text, Image,View, ActivityIndicator, StyleSheet, BackHandler } from 'react-native'
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

  componentWillMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.pop();
    return true;
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
    <>
      {this.state.loading ?
        <View style={[ styles.horizontal_loading, styles.container_loading ]}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
        :
        null
      }
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: widthPercentageToDP('5%')}}>
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
    </>
}

export default DealDetail

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