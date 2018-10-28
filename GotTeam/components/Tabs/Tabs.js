import React, { Component } from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import TeamsTab from './Screens/Teams';
import Inbox from './Screens/Inbox';
import Events from './Screens/Events';
import Profile from './Screens/Profile';
import Social from './Screens/Social';



const Tabs = TabNavigator({
    Teams: {
        screen: TeamsTab,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <Icon name="user" size={20} color={tintColor} />,
        }
    },
    Events: {
        screen: Events,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <Icon name="calendar" size={20} color={tintColor} />,
        }
    },
    Inbox: {
        screen: Inbox,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <Icon name="inbox" size={20} color={tintColor} />,
        }
    },
    Social: {
        screen: Social,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <Icon name="users" size={20} color={tintColor} />,
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <Icon name="user-circle" size={20} color={tintColor} />,
        }
    },
}, {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: '#fff',
            inactiveTintColor: '#C5CCD6',
            inactiveBackgroundColor: '#fff',
            activeBackgroundColor: '#19CFA0',
            showIcon: true
        },

    }
);

export default Tabs;