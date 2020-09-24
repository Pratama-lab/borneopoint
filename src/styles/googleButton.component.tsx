import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container         : {
    backgroundColor : 'white',
    borderRadius    : wp('2.223%'),
    flexDirection   : 'row',
    elevation       : 4,
    // width           : wp('66.6%'),
    flex: 1,
    height          : wp('11.11111'),
    // aspectRatio     : (240/40),
  },
  iconContainer: {
    height: '100%',
    aspectRatio: (1/1),
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon : {
    width: '40%',
    aspectRatio: (1/1)
  },
  textContainer: {
    height: '100%',
    justifyContent: 'center'
  },
  text: {
    fontSize: wp(3.33)
  },
})