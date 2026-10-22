import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type TabParamList = {
  Home: undefined;
  History: undefined;
  Analytics: undefined;
  Cards: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  TwoFactor: undefined;
  PinSetup: undefined;
  Unlock: undefined;
  Main: NavigatorScreenParams<TabParamList> | undefined;
  SendRecipient: undefined;
  SendAmount: undefined;
  SendReview: undefined;
  SendSuccess: undefined;
  Security: undefined;
  ChangePin: undefined;
  Notifications: undefined;
};

export type Nav = NativeStackNavigationProp<RootStackParamList>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
