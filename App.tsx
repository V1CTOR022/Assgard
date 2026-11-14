import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Splash from "./src/pages/splash";
import Onboarding from "./src/pages/onboarding";
import Login from "./src/pages/login";
import Registro from "./src/pages/register";
import Home from "./src/pages/Home/Index";
import History from "./src/pages/history";
import Profile from "./src/pages/profile";
import Transaction from "./src/pages/transaction";
import Pendencies from "./src/pages/pending";
import Dashboard from "./src/pages/dashboard";
import TabBar from "./src/components/TabBar";
import { AccountsProvider } from "./src/context/AccountsContext";
import { PendingProvider } from "./src/context/PendingContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AccountsProvider>
        <PendingProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Registro} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="Transaction"
              component={Transaction}
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="Pending"
              component={Pendencies}
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ presentation: "modal" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        </PendingProvider>
      </AccountsProvider>
    </GestureHandlerRootView>
  );
}
