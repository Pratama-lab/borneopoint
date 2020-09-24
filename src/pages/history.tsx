import React, { Component } from 'react'
import { View, FlatList, TouchableOpacity, Text, RefreshControl } from 'react-native'

import HistoryItem from '../components/historyItem'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { AuthContext } from '../context'
import { getAllTransactionHistory} from '../api'

import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'


class History extends Component<any>{
  constructor(props: any){
    super(props);
    this.state = {
      loading: false,
      data: []
    }
  }
  componentDidMount = async () => {
    // try{
    //   console.log('authState history', this.props.authState.isSignedIn)
    //   if(this.props.authState.isSignedIn){
    //     console.log('trying to fetch')
    //     this.setState({loading:true})
    //     const result = await getAllTransactionHistory({userToken: this.props.authState.token})
    //     if(result == undefined) throw new Error('fail')
    //     this.setState({ data: result.data, loading: false }, () => console.log('state data history', this.state))
    //   }
    // }catch(error){ 
    //   if(this.state.loading)
    //     this.setState({ loading:false })

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

    axios.get('https://borneopoint.co.id/public/api/get_user', {params: {
      id_login: check_login
    }})
    .then(resp => {
      // alert(JSON.stringify(resp.data))
      if (resp.data === 'Anda Belum Terdaftar') {
        console.log('Belum Terdaftar')
      } else {
        this.setState({
          name: resp.data.name
        })
      }
    })
  }
  refresh = () => {this.componentDidMount()}
  checkSummary = ({purchaseId}) => {
    this.props.navigation.navigate('Summary', { purchaseId })
  }
  render = () => 
    this.state.id_login !== null ? 
      <FlatList 
        data={this.state.data}
        extraData={this.state.data}
        keyExtractor={(item) => item._id}
        horizontal={false} 
        contentContainerStyle={{ alignItems: 'center', paddingTop: wp('5%'), paddingBottom: wp('5%'), backgroundColor: 'white', height: '100%' }} 
        ItemSeparatorComponent={() => <View style={{ height: wp('3.33335%') }}/>}
        refreshControl={<RefreshControl refreshing={this.refresh()} onRefresh={this.refresh()}/>}
        renderItem={({item}) => 
          <>
            <HistoryItem
              checkSummary={this.checkSummary}
              title={item?.item?.itemObject?.name}
              price={item?.finalPrice} date={item?.created_at}
              status={item?.validation?.status} data={item}
            />
          </>
        }
      />
      :
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Auth')}><Text style={{textDecorationLine: 'underline'}}>Please Login First</Text></TouchableOpacity>
      </View>
}

export default (props) => 
  <AuthContext.Consumer>
  {
    authState => <History authState={authState} {...props}/>
  }
  </AuthContext.Consumer>