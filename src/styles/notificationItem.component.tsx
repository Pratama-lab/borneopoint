import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  notificationItem: {
    flex: 1,
    flexDirection: 'column'
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: wp('5%')
  },
  notificationDescription: {
    fontSize: wp('3.88889%')
  }
})