import React, { Component } from 'react'
import { View, FlatList } from 'react-native'

import styles from '../styles/notifications'
import NotificationItem from '../components/notificationItem'

class Notifications extends Component{
  constructor(props){
    super(props)
  }
  render = () => 
    <View style={styles.pageContainer}>
      <FlatList 
        style={styles.flatlist} 
        contentContainerStyle={styles.flatlistContainer} 
        renderItem={() => <NotificationItem />} 
        data={[{},{},{}]}
        ItemSeparatorComponent={() => <View style={styles.separator}/>}/>
    </View>
}

export default Notifications