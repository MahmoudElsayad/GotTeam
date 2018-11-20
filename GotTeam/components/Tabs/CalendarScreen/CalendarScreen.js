import React, { Component } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Spinner from 'react-native-spinkit';
import { Picker, Content, ListItem, CheckBox, Body, Toast, Root } from 'native-base';
import { StackActions } from 'react-navigation';
import { NavigationBar, Title, Switch, TextInput, View, Row, Text, Subtitle, Divider, Caption } from '@shoutem/ui';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from '../../renderIf';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';



export default class CalendarScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            user: Object,
            selected: ''
        };

        console.log(props);
        
    }

    static navigationOptions = {
        header: null
    };

    onDayPress = (day) => {
        this.setState({
            selected: day.dateString
        });
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({ user: user });
            this.ref = firebase.firestore().collection('teams');
        });
    };


    render() {
        const popAction = StackActions.pop({
            n: 1,
        });
        const uri = 'https://images.unsplash.com/photo-1537351967534-3e91fc90121d?ixlib=rb-0.3.5&s=1fcdb0c9a4cebb0f7cdfb4e099e7a4c6&auto=format&fit=crop&w=400&q=80';
        return (
            <View styleName="fill-parent" style={{ backgroundColor:'white' }} >
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#0BC5B7', '#29D890']} style={styles.linearGradient}>
            <NavigationBar
            styleName='clear'
                    // style={{
                    //     container: {
                    //         backgroundColor: '#4caf50'
                    //     },
                    // }}
                    leftComponent={
                        <TouchableOpacity>
                            <Icon onPress={() => this.props.navigation.dispatch(popAction)} name="long-arrow-left" size={20} style={{marginLeft:'8%'}} color='#fff'/>
                        </TouchableOpacity>
                }
                centerComponent={<Title style={{fontSize: 20, paddingTop: 3,}}>Calendar</Title>}
                />
                </LinearGradient>

                    {/* {renderIf(this.state.createLoading,
                        // <PulseIndicator style={{ margin: 0 }} color='#000' size={100} />
                        <Spinner style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginBottom: 50}} size={40} type={'9CubeGrid'} color={'#19CFA0'} />
                    )} */}
                        <View styleName="fill-parent" style={{ marginTop: '15%' }}>
                            <View styleName="vertical h-start">
                                <ScrollView style={{ marginTop: '1%', width: '100%', height: '110%' }}>
                            <Calendar
                                style={styles.calendar}
                                onDayPress={(day) => this.onDayPress(day)}
                                hideExtraDays
                                current={'2018-11-13'}
                                markedDates={{
                                    '2018-11-14': { dots: [{ key: 'vacation', color: 'blue', selectedDotColor: 'white' }, { key: 'massage', color: 'red', selectedDotColor: 'white' }], selected: true },
                                    '2018-11-13': { dots: [{ key: 'vacation', color: 'blue', selectedDotColor: 'red' }, { key: 'massage', color: 'red', selectedDotColor: 'blue' }], disabled: true }
                                }}
                                hideArrows={false}
                            />
                            </ScrollView>
                            </View>
                        </View>


            </View>
            
        );
    }
}

const styles = {
    linearGradient: {
        width: '100%',
        height: 85
    },
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350
    }
};
