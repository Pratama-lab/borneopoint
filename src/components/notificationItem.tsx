import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from '../styles/notificationItem.component'

class NotificationItem extends Component{
  constructor(props){
    super(props)
  }
  render = () =>
    <TouchableOpacity style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>Pembayaran PLN Prepaid berhasil !</Text>
      <Text style={styles.notificationDescription} numberOfLines={2}>Pembayaran untuk order 1234567 telah terkonfirmasi !</Text>
    </TouchableOpacity>
}

export default NotificationItem