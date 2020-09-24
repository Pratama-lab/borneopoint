import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  pageContainer: {
    width: '100%',
    height: '100%'
  },
  contentPageContainer: {
    paddingTop: wp('5%'),
    paddingBottom: wp('5%'),
    flex: 1,
    // marginLeft: wp('5%'),
    // marginRight: wp('5%')
  },
  termTitleText: {
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    fontWeight: 'bold',
    fontSize: wp('5%'),
    alignSelf: 'center',
  },
  descriptionText: {
    marginTop: wp('4.444445%'),
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    fontSize: wp('3.8888889%'),
    // textAlign: 'justify'
    textAlign: 'justify'
  }
})