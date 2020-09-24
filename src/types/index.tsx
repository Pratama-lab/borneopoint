import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Splash    : undefined
  Auth      : undefined
  App       : undefined
  // Home: { userId: string };
  // Login: { sort: 'latest' | 'top' } | undefined;
  // Register: { sort: 'latest' | 'top' } | undefined;
};

type AuthStackParamList = { 
  Login     : undefined
  Register  : undefined
}

type SplashScreenRouteProp = RouteProp<RootStackParamList, 'Splash'>
type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList,'Splash'>

export type SplashRoutingProps = {
  route       : SplashScreenRouteProp
  navigation  : SplashScreenNavigationProp
}

export type SplashScreenProps = {
  route       : SplashScreenRouteProp
  navigation  : SplashScreenNavigationProp
}