import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    width           : wp('66.6%'),
    aspectRatio     : (240/40),
    backgroundColor : 'white',
    borderRadius    : wp('2.223%'),
    elevation       : 4,
    flexDirection   : 'row'
  },
  iconContainer: {
    height          : '100%',
    aspectRatio     : (1/1),
    justifyContent  : 'center',
    alignItems      : 'center'
  },
  icon: {
    height          : '40%',
    aspectRatio     : 1
  },
  textInput: {
    // paddingLeft     : wp('4%'),
    fontSize        : wp('4%'),
    flex            : 1
  }
})