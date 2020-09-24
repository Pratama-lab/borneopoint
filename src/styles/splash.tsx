import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  layout: {
    height          : '100%',
    display         : 'flex',
    flexDirection   : 'column',
    flex            : 1,
    // justifyContent  : 'center',
    alignItems      : 'center',
    // backgroundColor : '#2c2c2c'
    position        : 'relative',
  },
  linearGradient: {
    width     : '100%',
    height    : '100%',
    position  : 'absolute',
    top       : 0,
    left      : 0,
    zIndex    : 1,
  },
  logoContainer: {
    display         : 'flex',
    flexDirection   : 'column',
    alignItems      : 'center',
    justifyContent  : 'center',
    marginTop       : wp('20%'),
    zIndex          : 1
  },
  logoImageContainer: { width: wp('50%'), aspectRatio: (1/1) },
  logoImage: { flex: 1,aspectRatio: (1/1) },
  logoNameText: {
    fontFamily    : 'Ubuntu-Regular',
    fontWeight    : 'normal',
    fontSize      : wp('8%'),
    marginTop     : wp('2.5%'),
    color         : 'white'
  },
  loadingContainer: {
    display         : 'flex',
    alignItems      : 'center',
    justifyContent  : 'center',
    marginBottom    : wp('20%'),
    zIndex          : 1
  },
  loadingText   : {
    marginTop   : wp('3.33'),
    fontWeight  : 'bold',
    color       : 'white'
  },
  appVersionText: {
    color       : 'white'
  }
})