import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationBar, Title, Switch, TextInput, View, Row, Text, Subtitle, Divider, Caption, Button, TouchableOpacity } from '@shoutem/ui';
import Icon from 'react-native-vector-icons/FontAwesome';




class Events extends Component {

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
                        leftComponent={
                            <Title style={{ marginLeft: '25%', fontSize: 20, paddingTop: 3, }}>Events</Title>
                        }
                        rightComponent={
                            <View style={{ flexDirection: 'row', marginRight: '15%', marginTop: '2%', width: '130%' }}>
                                <TouchableOpacity>
                                    <Icon style={{ marginLeft: '10%' }} name="bell" size={30} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Icon style={{ marginLeft: '10%' }} name="heart-o" size={30} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Icon style={{ marginLeft: '10%' }} name="calendar" size={30} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Icon style={{ marginLeft: '10%' }} name="plus-circle" size={30} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        }
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
        height: 73
    }
};


export default Events;