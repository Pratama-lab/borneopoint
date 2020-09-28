import React, { Component }           from 'react'
import { FlatList, View, RefreshControl, ScrollView, TouchableOpacity }                   from 'react-native'
import DealsItem                      from '../components/dealsItem'
import { heightPercentageToDP, widthPercentageToDP as wp }  from 'react-native-responsive-screen'
import { getAllDeal } from '../api'

import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import FastImage from 'react-native-fast-image'

const url = 'https://borneopoint.co.id/public/asset/images/'

class Deals extends Component{
  constructor(props:any){
    super(props);
    this.state = {
      loading: true,
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

    axios.get('https://borneopoint.co.id/public/api/get_all_deals')
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
    <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={this.refresh()}/>}>
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
    </ScrollView>
}

export default Deals