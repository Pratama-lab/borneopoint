import React, { Component } from 'react'
import {Picker} from '@react-native-community/picker';
import { ScrollView , Alert, View, Text, TextInput, TouchableOpacity, Image, RefreshControl, FlatList} from 'react-native';
import {getPrePaidItem} from '../api'
import { widthPercentageToDP  as wp} from 'react-native-responsive-screen';
import formatRupiah from '../functions/formatRupiah';
import axios from 'axios'

import { AuthContext } from '../context'

import { getAccountInfo, purchasePrePaid } from '../api'

const logo = require('../assets/miniLogo.png')


class DetailPulsa extends Component<any,any>{
  constructor(props){
    super(props)
  }
  state={
  	loading: true
  }

  render = () =>
  <>
  </>
}

export default (props) => 
<AuthContext.Consumer>{
  authState => <DetailPulsa authState={authState} {...props}/>
}</AuthContext.Consumer>