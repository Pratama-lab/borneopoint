import React, { Component } from 'react'
import { ScrollView,View, Alert, Image, Text, RefreshControl } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import {AuthContext} from '../context'
import { getTransactionHistory } from '../api'
import moment from 'moment'
import formatRupiah from '../functions/formatRupiah'

const electricity = require('../assets/icons/electricity.png')
const sandClock = require('../assets/icons/sandClock.png')
const correct = require('../assets/icons/correct.png')


class Summary extends Component<any,any>{
  constructor(props){
    super(props)
  }
  state= {
    loading: false,
    data: undefined
  }
  componentDidMount = async () => {
    try{
      this.setState({ loading: true })
      if(!this.props.route?.params?.purchaseId) return Alert.alert( "Summary", "Purchase id is not detected", [{ text: "Ok", onPress: () => this.props.navigation.goBack() }],{ cancelable: false })
      const result = await getTransactionHistory({ purchaseId: this.props.route?.params?.purchaseId, userToken: this.props.authState.token })
      console.debug(result)
      if(result == undefined) return Alert.alert( "Summary", "Purchase id is not detected", [{ text: "Ok", onPress: () => this.props.navigation.goBack() }],{ cancelable: false })
      this.setState({ loading: false, data: result.data }, () => console.log('stateDATA', this.state.data))
      
    }catch(error){
      console.debug(error)
    }
  }
  refresh = () => this.componentDidMount()
  render = () => 
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={this.refresh}/> }
        contentContainerStyle={{padding: wp('5%')}}>
        {
          this.state.data && 
            <>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <View style={{width: wp('17.77778%'), aspectRatio: 1/1, backgroundColor: 'white', borderRadius: wp('2.2223%'), borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={electricity} style={{width: '80%', height: '80%'}}></Image>
                </View>
                <View style={{justifyContent: 'center', marginLeft: wp('5%')}}>
                  <Text style={{fontWeight: 'bold', fontSize: wp('5%')}}>{this.state.data?.itemObject?.name}</Text>
                </View>
              </View>
              <View>

              </View>
              <View>
                <View style={{flexDirection: 'column', marginBottom: wp('2.5%'), marginTop: wp('2.5%')}}>
                  <Text style={{color: '#425C59'}}>{moment(this.state.data?.created_at).format('YYYY-MM-DD - LT')}</Text>
                  <Text style={{color: '#425C59'}}>Order Id : {this.state.data?._id}</Text>
                </View>
                <View style={{ height: 2, width: '100%', backgroundColor: '#ccc', marginBottom: wp('2.5%')}}></View>
              </View>
              <View style={{alignItems: 'center', flexDirection: 'row', marginBottom: wp('5%')}}>
                <View style={{height: wp('6.6667%'), aspectRatio: 1/1, backgroundColor: this.state.data?.validation?.status == 'PENDING' ? '#FFC850' : '#1DF318', borderRadius: wp('50%'), justifyContent: 'center', alignItems: 'center', marginRight: wp('2.5%')}}>
                  <Image source={this.state.data?.validation?.status =='PENDING' ? sandClock : correct} style={{height: '50%', width: '50%'}}/>
                </View>
                <Text style={{fontSize: wp('3.8889%'), fontWeight: 'bold'}}>{this.state.data?.validation?.status}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ccc', aspectRatio: 328/32, width: '100%'}}>
                <Text style={{
                  marginLeft: wp('2.5%'),
                  fontSize: wp('3.8889%'),
                  fontWeight: 'bold',
                  color: 'black',
                  flex: 1
                }}>Total Payment</Text>
                <Text style={{
                  fontSize: wp('3.8889%'),
                  fontWeight: 'bold',
                  color: 'black',
                  marginRight: wp('2.5%')
                }}>Rp {formatRupiah(this.state.data?.finalPrice.toString(),'')},00</Text>
              </View>
              {
                this.state?.data?.sn !== undefined ?
                <View style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#ccc', width: '100%'}}>
                  <Text style={{
                    marginLeft: wp('2.5%'),
                    fontSize: wp('3%'),
                    fontWeight: 'bold',
                    color: 'black',
                    flex: 1
                  }}>Serian Number </Text>
                  <Text style={{
                    fontSize: wp('3%'),
                    marginLeft: wp('2.5%'),
                    fontWeight: 'bold',
                    color: 'black',
                    marginRight: wp('2.5%')
                  }}>{this.state.data?.sn}</Text>
                </View> : null
              }
              {
                this.state?.data?.pin !== undefined ?
                <View style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#ccc', width: '100%'}}>
                  <Text style={{
                    marginLeft: wp('2.5%'),
                    fontSize: wp('3%'),
                    fontWeight: 'bold',
                    color: 'black',
                    flex: 1
                  }}>Pin</Text>
                  <Text style={{
                    fontSize: wp('3%'),
                    marginLeft: wp('2.5%'),
                    fontWeight: 'bold',
                    color: 'black',
                    marginRight: wp('2.5%')
                  }}>{this.state.data?.pin}</Text>
                </View> : null
              }
            </>
        }       
      </ScrollView>
    </View>
    
}

export default (props) => 
<AuthContext.Consumer>
{
  authState => <Summary authState={authState} {...props}/>
}
</AuthContext.Consumer>