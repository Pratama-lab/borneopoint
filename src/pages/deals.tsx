import React, { Component }           from 'react'
import { FlatList, View, RefreshControl }                   from 'react-native'
import DealsItem                      from '../components/dealsItem'
import { widthPercentageToDP as wp }  from 'react-native-responsive-screen'
import { getAllDeal } from '../api'

import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

class Deals extends Component{
  constructor(props:any){
    super(props)
  }
  state = {
    loading: false,
    deals: []
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

    const check_login = await AsyncStorage.getItem('@id_login');

    if (check_login !== undefined){
      this.setState({
        id_login: check_login,
        loading: true
      })
      // alert('berhasil')
    }
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
    <FlatList 
      data={this.state.deals} 
      refreshControl={<RefreshControl refreshing={this.refresh()} onRefresh={this.refresh()}/>}
      keyExtractor={(item) => item._id.toString()}
      horizontal={false} 
      contentContainerStyle={{alignItems: 'center', paddingTop: wp('5%'), paddingBottom: wp('5%'), backgroundColor: 'white', height: '100%'}} 
      ItemSeparatorComponent={() => <View style={{ height: wp('3.33335%') }}/>}
      renderItem={({item}) => <DealsItem {...item}/>}
    />
}

export default Deals