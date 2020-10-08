import React, { Component } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native'
import styles from '../styles/home'
import InfoItem from '../components/infoItem'
import { getAllInfoAndPromotion, getAccountInfo } from '../api'

import { AuthContext } from '../context'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen'
import capitalizeWords from '../functions/capitalizeWords'
import formatRupiah from '../functions/formatRupiah'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import FastImage from 'react-native-fast-image'

const rqr = require('../assets/icons/rqr.png')
const person = require('../assets/icons/person.png')
const topUp = require('../assets/icons/topUp.png')
const transfer = require('../assets/icons/transfer.png')
const withdraw = require('../assets/icons/withdraw.png')
const electricity = require('../assets/icons/electricity.png')
const mobile = require('../assets/icons/mobile.png')
const data = require('../assets/icons/data.png')
const gaming = require('../assets/icons/gaming.png')
const money = require('../assets/icons/money.png')
const bpjs = require('../assets/icons/bpjs.png')
const vouchers = require('../assets/icons/vouchers.png')
const others = require('../assets/icons/others.png')
const url = 'https://borneopoint.co.id/public/storage/media_images/'

class Home extends Component<any,any>{
  constructor(props: any){
    super(props);
    this.infoAndPromotion = this.infoAndPromotion.bind(this);
    this.state = {
      loading: true,
      infoAndPromotions: null,
      accountInfo: undefined,
      saldo: 0,
      deskripsi: '',
      description: [{ 'desc': 'hai cok' }, { 'desc': 'hai cok' }, { 'desc': 'hai cok' }, { 'desc': 'hai cok' }, { 'desc': 'hai cok' }]
    }
  }
  componentDidMount = async () => {
    // try{
    //   this.setState({
    //     loading: true
    //   })
    //   const data = await getAllInfoAndPromotion()
    //   let accountInfo
    //   if(this.props.authState.isSignedIn)
    //     accountInfo = await getAccountInfo({userId: this.props.authState._id, userToken: this.props.authState.token})
    //   console.log(accountInfo)
    //   if(data == undefined || (this.props.authState.isSignedIn && accountInfo == undefined))
    //     throw new Error('failed to load data')
    //   this.setState({
    //     loading: false,
    //     infoAndPromotions: data.data,
    //     accountInfo: this.props.authState.isSignedIn ? accountInfo.data : undefined
    //   }, () => console.log('state', this.state))
    // }catch(error){
    //   Alert.alert(
    //     "Network Error",
    //     "Failed to fetch data",
    //     [
    //       // { text: "Cancel", onPress: () => console.log("OK Pressed") },
    //       { text: "OK", onPress: () => this.setState({loading: false}) }
    //     ],
    //     { cancelable: false }
    //   )
    // }

    this.setState({
      loading: true,
    })

    const check_login = await AsyncStorage.getItem('@id_login');

    // alert(check_login)
    if (check_login !== undefined){
      this.setState({
        id_login: check_login,
        loading: true
      })
      // alert('berhasil')
    }

    axios.get('https://borneopoint.co.id/api/get_user', {params: {
      id_login: check_login
    }})
    .then(resp => {
      // alert(JSON.stringify(resp.data))
      this.setState({
        name: resp.data.name,
        saldo: resp.data.saldo,
        loading: false
      })
    })
    .catch(err => {
      console.log('Get User : '+err)
    })

    axios.get('https://borneopoint.co.id/public/api/get_media')
    .then(res => {
      // alert(JSON.stringify(this.state.deskripsi))
      this.setState({
        loading: false,
        infoAndPromotion: res.data
      })
    })
  }
  goTo = (title, params?: any) => {
    try{
      this.props.navigation.navigate(title, params)
    }catch(error){ console.debug(error) }
  }
  infoAndPromotion = (name,description):any => {
    this.props.navigation.navigate('InfoAndPromotion',{ name, description})
  }
  render = () =>
  <>
    {this.state.loading ?
      <View style={[ styless.container_loading, styless.horizontal_loading ]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
      :
      null
    }
    <ScrollView 
      style={styles.page} 
      contentContainerStyle={styles.pageContent}
    >
      {this.state.id_login === null ?
        <View style={styles.walletCard}>
          <View style={[styles.profileWalletContainer, { justifyContent: 'center'}]}>
            <TouchableOpacity style={{ backgroundColor: '#3269B3', width: widthPercentageToDP('60%'), justifyContent: 'center', alignItems: 'center', borderRadius: widthPercentageToDP('8.8888%')}} onPress={() => this.goTo('Auth')}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: widthPercentageToDP('5%'), padding: widthPercentageToDP('1%')}}>Login / Register</Text>
            </TouchableOpacity>
          </View>
        </View>
        :
        <View style={styles.walletCard}>
          <View style={styles.profileWalletContainer}>
            <View style={styles.profilePictureContainer}>
              {
                this.state.photo === undefined ? 
                  <Image source={person}/>
                  :
                  <Image source={{
                    uri: `https://borneopoint.co.id/public/profilePicture/${this.state.photo}?${Math.floor(Math.random() * 100 * 100)}`,
                    cache: 'reload'
                  }} style={{
                    width       : '100%',
                    aspectRatio : 1/1,
                    height      : '100%',
                    borderRadius: 120
                }}/>
              }
            </View>
            <View style={styles.userContainer}>
              <View style={styles.usernameContainer}>
                <Text style={styles.userText} numberOfLines={1}>{capitalizeWords(this.state.name)}</Text>
              </View>
              <View style={styles.walletContainer}>
                <Text style={styles.walletText}>Rp {formatRupiah(this.state.saldo.toString(), undefined)},00</Text>
              </View>
            </View>
          </View>
          <View style={styles.walletOperationContainer}>
            <TouchableOpacity style={styles.walletItemContainer} onPress={() => this.goTo('TopUp')}>
              <Image source={topUp} style={styles.walletItemImage}/>
              <Text style={styles.walletItemText}>TopUp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletItemContainer} onPress={() => this.goTo('Transfer')}>
              <Image source={transfer} style={styles.walletItemImage}/>
              <Text style={styles.walletItemText}>Transfer</Text>
            </TouchableOpacity>
             {/*<TouchableOpacity style={styles.walletItemContainer} onPress={() => this.goTo('Withdraw')}>
                           <Image source={withdraw} style={styles.walletItemImage}/>
                           <Text style={styles.walletItemText}>Withdraw</Text>
                         </TouchableOpacity>*/}
          </View>
            {/*<TouchableOpacity style={styles.qrButton}>
            <Image source={rqr} style={styles.qrImage}/>
            <Text style={styles.scanText}>Scan</Text>
          </TouchableOpacity>*/}
        </View>
      }
      <View style={styles.ppobContainer}>
        <View style={styles.topPPOB}>
          <TouchableOpacity style={styles.ppobItem} onPress={() => this.goTo('Purchase', {itemType: 'pln'})}>
            <Image style={styles.ppobItemImage} source={electricity}/>
            <Text style={styles.ppobItemText}>Electricity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ppobItem} onPress={() => this.goTo('Purchase', {itemType: 'pulsa'})}>
            <Image style={styles.ppobItemImage} source={mobile} />
            <Text style={styles.ppobItemText}>Mobile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ppobItem} onPress={() => this.goTo('Purchase', {itemType: 'data'})}>
            <Image style={styles.ppobItemImage} source={data}/>
            <Text style={styles.ppobItemText}>Data Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ppobItem} onPress={() => this.goTo('Purchase', {itemType: 'game'})}>
            <Image style={styles.ppobItemImage} source={gaming}/>
            <Text style={styles.ppobItemText}>Gaming</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomPPOB}>
          <TouchableOpacity style={styles.ppobItem} onPress={() => this.goTo('Forex')}>
            <Image style={styles.ppobItemImage} source={money}/>
            <Text style={styles.ppobItemText}>Forex</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ppobItem} onPress={() => this.goTo('Purchase', {itemType: 'etoll'})}>
            <Image style={styles.ppobItemImage} source={bpjs}/>
            <Text style={styles.ppobItemText}>EToll</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ppobItem} onPress={() => this.goTo('Purchase', {itemType: 'voucher'})}>
            <Image style={styles.ppobItemImage} source={vouchers} />
            <Text style={styles.ppobItemText}>Vouchers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ppobItem}>
            <Image style={styles.ppobItemImage} source={others}/>
            <Text style={styles.ppobItemText}>Others</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.infoAndPromotionContainer}>
        <Text style={styles.infoAndPromotionText}>Info & Promotion</Text>
        <View style={{ marginTop: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('1%'), marginRight: widthPercentageToDP('1%') }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <FlatList
              data={this.state.infoAndPromotion}
              keyExtractor={item => item.id}
              horizontal={true}
              extraData={this.state}
              renderItem={({item}) => (
                <TouchableOpacity style={{ width: widthPercentageToDP('50%'), borderRadius: widthPercentageToDP('2.5%'), elevation: 3, marginLeft: widthPercentageToDP('5%'), backgroundColor: 'white', marginTop: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('1%'), marginRight: widthPercentageToDP('1%'), alignItems: 'center' }}>
                  <FastImage source={{ uri: url+item.images}} style={{ width: '100%', height: heightPercentageToDP('20%'), borderRadius: widthPercentageToDP('2.5%') }} />
                  <View style={{ marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%') }}>
                    <Text numberOfLines={5}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  </>
}

export default (props) => 
<AuthContext.Consumer>{
  authState => <Home authState={authState} {...props}/>
}</AuthContext.Consumer>

const styless = StyleSheet.create({
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