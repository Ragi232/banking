import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { colors, fonts } from '../theme';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import CardsScreen from '../screens/CardsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PinSetupScreen from '../screens/PinSetupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SecurityScreen from '../screens/SecurityScreen';
import SendAmountScreen from '../screens/SendAmountScreen';
import SendRecipientScreen from '../screens/SendRecipientScreen';
import SendReviewScreen from '../screens/SendReviewScreen';
import SendSuccessScreen from '../screens/SendSuccessScreen';
import TwoFactorScreen from '../screens/TwoFactorScreen';
import UnlockScreen from '../screens/UnlockScreen';
import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const TAB_ICONS: Record<keyof TabParamList, { active: IconName; inactive: IconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  History: { active: 'time', inactive: 'time-outline' },
  Analytics: { active: 'pie-chart', inactive: 'pie-chart-outline' },
  Cards: { active: 'card', inactive: 'card-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={TAB_ICONS[route.name][focused ? 'active' : 'inactive']} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    primary: colors.primary,
    border: colors.border,
  },
};

export default function RootNavigator() {
  const hydrated = useStore((s) => s.hydrated);
  const onboarded = useStore((s) => s.onboarded);
  const token = useStore((s) => s.token);
  const hasPin = useStore((s) => s.hasPin);
  const locked = useStore((s) => s.locked);
  const status = useStore((s) => s.status);
  const init = useStore((s) => s.init);
  const loadData = useStore((s) => s.loadData);

  useEffect(() => {
    void init();
  }, [init]);

  const authed = !!token && hasPin && !locked;
  useEffect(() => {
    if (authed && status === 'idle') void loadData();
  }, [authed, status, loadData]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.semibold },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        {!onboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        ) : !token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TwoFactor" component={TwoFactorScreen} options={{ title: 'Verify', headerTitle: '' }} />
          </>
        ) : !hasPin ? (
          <Stack.Screen name="PinSetup" component={PinSetupScreen} options={{ headerShown: false }} />
        ) : locked ? (
          <Stack.Screen name="Unlock" component={UnlockScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="SendRecipient" component={SendRecipientScreen} options={{ title: 'Send to' }} />
            <Stack.Screen name="SendAmount" component={SendAmountScreen} options={{ title: 'Amount' }} />
            <Stack.Screen name="SendReview" component={SendReviewScreen} options={{ title: 'Review' }} />
            <Stack.Screen
              name="SendSuccess"
              component={SendSuccessScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen name="Security" component={SecurityScreen} options={{ title: 'Security Center' }} />
            <Stack.Screen name="ChangePin" component={PinSetupScreen} options={{ title: 'Change PIN' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
