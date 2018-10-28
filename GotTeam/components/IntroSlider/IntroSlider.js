import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage, Button, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Actions } from 'react-native-router-flux';


const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 22,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
    }
});

const slides = [
    {
        key: 'somethun',
        title: 'Title 1',
        text: 'Description.\nSay something cool',
        backgroundColor: '#59b2ab',
        icon: 'plus-circle'
    },
    {
        key: 'somethun-dos',
        title: 'Title 2',
        text: 'Other cool stuff',
        backgroundColor: '#febe29',
        icon: 'calendar-alt'
    },
    {
        key: 'somethun1',
        title: 'Title 3',
        text: 'Get going',
        backgroundColor: '#22bcb5',
        icon: 'cookie'
    }
];

export default class IntroSlider extends Component {
    static navigationOptions = {
        header: null
    }

    _renderItem = props => (
        <View
            style={[styles.mainContent, {
                paddingTop: props.topSpacer,
                paddingBottom: props.bottomSpacer,
                width: props.width,
                height: props.height,
                backgroundColor: props.backgroundColor
            }]}
        >
            <Icon name="user" size={120} color="#fff" />
            <View>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.text}>{props.text}</Text>
            </View>
        </View>
    );

    render() {
        return <AppIntroSlider slides={slides} onDone={this._signInAsync} renderItem={this._renderItem} />
    }

    _signInAsync = async () => {
        this.props.navigation.navigate('Login');
    };
}