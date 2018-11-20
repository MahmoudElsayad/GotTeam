import React from 'react';
import { StyleSheet, StatusBar, View, YellowBox } from 'react-native';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import RNfirebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';
import { Content, ActionSheet, Root, Toast } from 'native-base';
import Spinner from 'react-native-spinkit';
import IntroSlider from './components/IntroSlider/IntroSlider';
import Login from './components/Login/Login';
import LoginScreen from './components/Login/LoginScreen/LoginScreen';
import Tabs from './components/Tabs/Tabs';
import AddTeams from './components/Tabs/AddTeams/AddTeams';
import CreateTeam from './components/Tabs/CreateTeam/CreateTeam';
import TeamCreated from './components/Tabs/TeamCreated/TeamCreated';
import TeamInfo from './components/Tabs/TeamInfo/TeamInfo';
import TeamOptions from './components/Tabs/TeamOptions/TeamOptions';
import JoinTeams from './components/Tabs/JoinTeams/JoinTeams';
import SignUp from './components/Login/SignupScreen/SignupScreen';
import TeamMessage from './components/Tabs/TeamMessage/TeamMessage';
import LocationPage from './components/Tabs/LocationPage/LocationPage';
import EditTeamInfo from './components/Tabs/EditTeamInfo/EditTeamInfo';
import Notifications from './components/Tabs/Notifications/Notifications';
import CreateEvent from './components/Tabs/CreateEvent/CreateEvent';
import CalendarScreen from './components/Tabs/CalendarScreen/CalendarScreen';
import EventCreated from './components/Tabs/EventCreated/EventCreated';
import Message from './components/Tabs/Message/Message';


class AuthLoader extends React.Component {
  
  constructor() {
    super();
    this._bootstrapAsync();
  }
  
  componentWillMount() {
    YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader','Method', 'Setting', 'Warning','Remote']);
  }  

  async componentDidMount() {
   const notificationOpen: NotificationOpen = await RNfirebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const action = notificationOpen.action;
            const notification: Notification = notificationOpen.notification;
            var seen = [];
            alert(JSON.stringify(notification.data, function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    seen.push(val);
                }
                return val;
            }));
        } 
        const channel = new RNfirebase.notifications.Android.Channel('test-channel', 'Test Channel', RNfirebase.notifications.Android.Importance.Max)
                .setDescription('My apps test channel');
// Create the channel
        RNfirebase.notifications().android.createChannel(channel);
        
        this.notificationListener = RNfirebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            notification
                .android.setChannelId('test-channel')
                .android.setSmallIcon('ic_launcher');
            RNfirebase.notifications()
                .displayNotification(notification);
            
        });
        this.notificationOpenedListener = RNfirebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            var seen = [];
            alert(JSON.stringify(notification.data, function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    seen.push(val);
                }
                return val;
            }));
            RNfirebase.notifications().removeDeliveredNotification(notification.notificationId);
            
        });
  }

  notificationDisplayedListener = () => {
    RNfirebase.notifications().onNotificationDisplayed((notification: Notification) => {
      console.log(notification);
      
    });
  } 
    
  // initialNotification = () => {
  //   RNfirebase
  //     .notifications()
  //     .getInitialNotification((notificationOpen) => {
  //       console.log(notificationOpen);

  //     })
  // }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    ActionSheet.actionsheetInstance = null;
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    firebase.auth().onAuthStateChanged(user => {
      // currentUser is ready now.
      if (user) {
        console.log(user);
        // User signed in. You can also access from firebase.auth().currentUser.
        this.props.navigation.navigate('Tabs');
      } else {
        // User signed out.
        this.props.navigation.navigate('IntroSlider');
      }
    });
  };

  // Render any loading content that you like here
  render() {
    return (
      <Root>
        <View style={styles.container}>
          {/* <PulseIndicator  color='#4caf50' size={100} /> */}
          <Spinner style={styles.spinner} size={60} type={'9CubeGrid'} color={'#19CFA0'} />
          <StatusBar barStyle="default" />
        </View>
      </Root>
    );
  }
}

const TeamsTab = createStackNavigator({
  Tabs: {
    screen: Tabs,
    navigationOptions: {
      header: null
    }
  },
  AddTeams: { screen: AddTeams },
  CreateTeam: { screen: CreateTeam },
  TeamCreated: { screen: TeamCreated },
  TeamInfo: { screen: TeamInfo },
  TeamOptions: { screen: TeamOptions },
  JoinTeams: { screen: JoinTeams },
  TeamMessage: { screen: TeamMessage },
  LocationPage: { screen: LocationPage },
  EditTeamInfo: { screen: EditTeamInfo },
  Notifications: { screen: Notifications },
  CreateEvent: { screen: CreateEvent },
  CalendarScreen: { screen: CalendarScreen },
  EventCreated: { screen: EventCreated },
  Message: { screen: Message },
},
);

const LoginStack = createStackNavigator({
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
  LoginScreen: {
    screen: LoginScreen
  },

}
);


export default createSwitchNavigator(
  {
    Tabs: TeamsTab,
    IntroSlider: IntroSlider,
    Login: LoginStack,
    AuthLoader: AuthLoader,
  },
  {
    initialRouteName: 'AuthLoader',
  },

);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 50
  },
});