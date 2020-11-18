import React, { Component } from 'react'
import { View, SafeAreaView, Text } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from './pages/splash'
import SignInScreen from './pages/signIn'
import SignUpScreen from './pages/signUp'
import HomeScreen from './pages/home'
import DealsScreen from './pages/deals'
import HistoryScreen from './pages/history'
import ProfileScreen from './pages/profile'
import TermsAndConditionScreen from './pages/termsAndCondition'
import PrivacyPolicyScreen from './pages/privacyPolicy'
import ResetPasswordScreen from './pages/resetPassword'
import NotificationsScreen from './pages/notifications'
import TopUpScreen from './pages/topUp'
import WithdrawScreen from './pages/withdraw'
import InfoAndPromotionScreen from './pages/infoAndPromotion'
import TransferScreen from './pages/transfer'
import PurchaseScreen from './pages/purchase'
import SummaryScreen from './pages/summary'
import detailPulsaScreen from './pages/detailPulsa'
import ForexScreen from './pages/forex'
import dealDetailScreen from './pages/dealDetail'
import ongoingPaymentScreen from './pages/ongoingPayment'
import MobileScreen from './pages/mobile'
import DataScreen from './pages/data'
import GamingScreen from './pages/gaming'
import EtollScreen from './pages/etoll'
import VouchersScreen from './pages/vouchers'
import KtpnPhoneScreen from './pages/ktpnphone'
import infoDetailScreen from './pages/infoDetail'
import WaitingScreen from './pages/waiting'
import PhoneScreen from './pages/signinphone'
import PhonesScreen from './pages/signupphone'
import InputNameScreen from './pages/inputName'
// import TransferScreen from './pages'
import { AuthContext, AuthState } from './context'

import Header from './components/header'
import PageHeader from './components/pageHeader'
import TabBar from './components/tabBar'

import configureGoogleSignIn from './functions/configureGoogleSignIn'
// import initializeFirebaseApp from './functions/initializeFirebaseApp'

const Stack = createStackNavigator()
const Tab   = createBottomTabNavigator()

const isLoggedIn = false

const ProfileStack = () => {
  return (
    <AuthContext.Consumer>
    {
      authState => 
        <Stack.Navigator headerMode={'float'}>
          <Stack.Screen name={"Profile"} component={ProfileScreen} options={{
            header            : (props: StackHeaderProps) => <Header {...props}/>,
            // animationEnabled: true,
          }}/> 
          
        </Stack.Navigator>
    }</AuthContext.Consumer>

  )
}

const DealsStack = () => {
  return (
    <Stack.Navigator headerMode={'float'}>
      <Stack.Screen name={"Deals"} component={DealsScreen} options={{
        header            : (props: StackHeaderProps) => <Header {...props}/>,
        // animationEnabled: true,
      }}/> 
      {/* <Stack.Screen name={"SignUp"} component={SignUpScreen} options={{
        header            : (props: StackHeaderProps) => <Header {...props}/>,
        animationEnabled: false,
      }}/>  */}
    </Stack.Navigator>
  )
}
const HistoryStack = () => {
  return (
    <Stack.Navigator headerMode={'float'}>
      <Stack.Screen name={"History"} component={HistoryScreen} options={{
        header            : (props: StackHeaderProps) => <Header {...props}/>,
        // animationEnabled: true,
      }}/> 
      {/* <Stack.Screen name={"SignUp"} component={SignUpScreen} options={{
        header            : (props: StackHeaderProps) => <Header {...props}/>,
        animationEnabled: false,
      }}/>  */}
    </Stack.Navigator>
  )
}

const HomeStack = () => {
  return (
    <Stack.Navigator headerMode={'float'}>
      <Stack.Screen name={"Home"} component={HomeScreen} options={{
        header            : (props: StackHeaderProps) => <Header {...props}/>,
        // animationEnabled: true,
      }}/> 
      <Stack.Screen name={"SignUp"} component={SignUpScreen} options={{
        header            : (props: StackHeaderProps) => <Header {...props}/>,
        // animationEnabled  : true,
      }}/> 
    </Stack.Navigator>
  )
} 

const MainStack = () => {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="Home"     component={HomeStack}/>
      <Tab.Screen name="History"  component={HistoryStack}/>
      <Tab.Screen name="Deals"    component={DealsStack}/>
      <Tab.Screen name="Profile"  component={ProfileStack}/>
    </Tab.Navigator>
  )
}

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{
          header            : (props: StackHeaderProps) => null,
          // animationEnabled  : true,
        }}/>{
          <>
            <Stack.Screen name="Main" component={MainStack}  options={{
              header            : (props: StackHeaderProps) => null,
              // animationEnabled  : true,
            }}/>
            <Stack.Screen name="Notifications" component={NotificationsScreen}  options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Notifications'}/>,
              // animationEnabled  : true,
            }}/>
            <Stack.Screen name="TopUp" component={TopUpScreen}  options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'TopUp'}/>,
              // animationEnabled  : true,
            }}/>
            <Stack.Screen name="Withdraw" component={WithdrawScreen}  options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Withdraw'}/>,
              // animationEnabled  : true,
            }}/>
            <Stack.Screen name="Transfer" component={TransferScreen}  options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Transfer'}/>,
              // animationEnabled  : true,
            }}/>
            {/* <Stack.Screen name="Withdraw" component={TransferScreen}  options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props}/>,
              // animationEnabled  : true,
            }}/> */}
            <Stack.Screen name={"TermsAndCondition"} component={TermsAndConditionScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Terms And Condition'}/>,
              // animationEnabled: true,
            }}/> 
            <Stack.Screen name={"PrivacyPolicy"} component={PrivacyPolicyScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Privacy Policy'}/>,
              // animationEnabled: true,
            }}/> 
            <Stack.Screen name={"ResetPassword"} component={ResetPasswordScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Reset Password'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name={"InfoAndPromotion"} component={InfoAndPromotionScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Info and Promotion'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name={"Purchase"} component={PurchaseScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Electricity'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name={"Forex"} component={ForexScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Forex'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name={"Summary"} component={SummaryScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Purchase'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name={"SignIn"} component={SignInScreen} options={{
              header : (props: StackHeaderProps) => null,
              // animationEnabled: true,
            }}/> 
            <Stack.Screen name={"SignUp"} component={SignUpScreen} options={{
              header : (props: StackHeaderProps) => null,
              // animationEnabled: true,
            }}/> 
            <Stack.Screen name="detailPulsa" component={detailPulsaScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Ongoing Payment'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="dealDetail" component={dealDetailScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Deals Detail'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="ongoingPayment" component={ongoingPaymentScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Detail'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="Mobile" component={MobileScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Mobile'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="Data" component={DataScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Data Plan'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="Gaming" component={GamingScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Gaming'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="EToll" component={EtollScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'EToll'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="Vouchers" component={VouchersScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Vouchers'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="KtpnPhone" component={KtpnPhoneScreen} options={{
              header            : (props: StackHeaderProps) => null,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="InfoDetail" component={infoDetailScreen} options={{
              header            : (props: StackHeaderProps) => <PageHeader {...props} title={'Info & Promotion'}/>,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="Waiting" component={WaitingScreen} options={{
              header            : (props: StackHeaderProps) => null,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="Phone" component={PhoneScreen} options={{
              header            : (props: StackHeaderProps) => null,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="Phones" component={PhonesScreen} options={{
              header            : (props: StackHeaderProps) => null,
              // animationEnabled: true,
            }}/>
            <Stack.Screen name="inputName" component={InputNameScreen} options={{
              header            : (props: StackHeaderProps) => null,
              // animationEnabled: true,
            }}/>
          </>
        }</Stack.Navigator>
    </NavigationContainer>
  )
}

class App extends Component{
  componentDidMount = () => {
    try{
      // initializeFirebaseApp()
      configureGoogleSignIn()
    }catch(error){
      console.debug(error)
    }
  }
  render = () => 
    <AuthState>
      <RootStack/>
    </AuthState>
}



export default App