import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { NavigationBar, Title, Switch, TextInput, View, Row, Text, Subtitle, Divider, Caption, Button } from '@shoutem/ui';
import LinearGradient from 'react-native-linear-gradient';


class Social extends Component {

    render() {
        return (
            <View styleName='fill-parent' style={{ backgroundColor: '#fff' }}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#0BC5B7', '#29D890']} style={styles.linearGradient}>
                <NavigationBar
                styleName='clear'
                    // style={{
                    //     container: {
                    //         backgroundColor: '#4caf50'
                    //     },
                    // }}
                    centerComponent={<Title style={{ fontSize: 20, paddingTop: 3, }}>Social</Title>}
                />
                </LinearGradient>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    linearGradient: {
        width: '100%',
        height:72
    }
};

export default Social;