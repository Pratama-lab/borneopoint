import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  pageContainer: {
    flex: 1
  },
  flatlist: {
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    flex: 1,
  },
  flatlistContainer: {
    paddingTop: wp('5%'),
    paddingBottom: wp('5%'),
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor : '#ccc',
    marginTop: wp('2.5%'),
    marginBottom: wp('2.5%')
  }
})