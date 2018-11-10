import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationBar, Title, Image, View, Row, Text, Subtitle, Divider, Caption, Button } from '@shoutem/ui';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Spinner from 'react-native-spinkit';
import { Toast } from 'native-base';
import {ActionSheet, ActionSheetItem} from 'react-native-action-sheet-component';
import renderIf from './../../renderIf';
import { List, ListItem, SearchBar } from "react-native-elements";
import PTRView from 'react-native-pull-to-refresh'
import Icon from 'react-native-vector-icons/FontAwesome';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';


var radio_props = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
    { label: 'Maybe', value: 'maybe' }
];



class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            _refresh: false

        }
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.user = user;
            this.loader();
        });
        var user = firebase.auth().currentUser;

        this.fetchEvents(user);

    };

    fetchEvents = (user) => {
        this.id = user.uid;
        firebase.firestore().collection("events")
            .get()
            .then((e) => {
                this.setTeams(e.docs);
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    _Refresh = () => {
        this.setState({ refreshing: true });
        var user = firebase.auth().currentUser;
        this.fetchEvents(user);

    }

    setTeams = (e, uid) => {
        this.teamsTemp = [];

        for (let index = 0; index < e.length; index++) {
            const element = e[index];
                    this.teamsTemp.push(element.data())
            }

        this.setState({
            data: this.teamsTemp
        });
        this.setState({ loading: false });
    }

    loader = () => {
        this.setState({ loading: true });
    }


    showBottomActionSheet = () => {
        this.bottomActionSheet.show();
    }

    onChange = (value, index, values) => {
        console.log(values);
        this.setState({ selectedItems: values });
    }

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large" />
            </View>
        );
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                }}
            />
        );
    };

    updateAttendance = (value,eventName) => {
        // var user = firebase.auth().currentUser;
        
        // var temp = [
        //     {userID: user.uid,
        //     attendance:value}
        // ]
        //         firebase.firestore().collection('events').doc(eventName).get()
        //         .then((e) => {
        //             console.log(e.data());
                    
        //             if (e.data().attendance != undefined) {
        //                 var temp = e.data().attendance.includes(user.uid)
        //                 console.log(temp);
                        
        //             }

        //             firebase.firestore().collection('events').doc(eventName).update({
        //                 attendance: firebase.firestore.FieldValue.arrayUnion(temp)

        //             })
        //         }).then( () => {
        //                 Toast.show({
        //                     text: "Your attendance is updated",
        //                     buttonText: "Okay",
        //                     duration: 3000
        //                 })
        //         }).catch((error) => {
        //             console.log(error);

        //         })
        
    }



    render() {
        return (
            <View styleName='fill-parent' style={{ backgroundColor: '#fff'}}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#0BC5B7', '#29D890']} style={styles.linearGradient}>
                <NavigationBar
                styleName='clear'
                    // style={{
                    //     container: {
                    //         backgroundColor: '#4caf50'
                    //     },
                    // }}
                        leftComponent={
                            <Title style={{ marginLeft:'25%', fontSize: 20, paddingTop: 3, }}>Events</Title>
                        }
                        rightComponent={
                                <View style={{flexDirection: 'row', marginRight: '15%', marginTop: '2%', width:'130%' }}>
                                <TouchableOpacity>
                                <Icon style={{ marginLeft: '10%' }} name="bell" size={30} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                <Icon style={{ marginLeft: '10%' }} name="heart-o" size={30} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('CalendarScreen')}
                                >
                                <Icon style={{ marginLeft: '10%' }} name="calendar" size={30} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.showBottomActionSheet}
                                >
                                <Icon style={{ marginLeft: '10%' }} name="plus-circle" size={30} color="#fff" />
                                </TouchableOpacity>
                                </View>
                        }
                />
                </LinearGradient>

                {renderIf(this.state.loading,
                    <View styleName='fill-parent' style={{ alignContent: 'center' }}>
                        {/* <PulseIndicator style={{ marginTop: 10 }} color='#000' size={100} />                         */}
                        <Spinner style={styles.spinner} size={40} type={'9CubeGrid'} color={'#19CFA0'} />
                    </View>
                )}

                {renderIf((this.state.loading == false && this.state.data.length == 0),
                    <View styleName="fill-parent" style={{ marginTop: '12%', height: '100%' }}>
                        <PTRView
                            style={{ height: '100%', backgroundColor: '#fff', marginTop: '5%' }}
                            onRefresh={this._Refresh}
                        >
                        </PTRView>
                    </View>
                )}


                {renderIf((this.state.loading == false && this.state.data.length > 0),
                    <PTRView
                        style={styles.contentContainer}
                        onRefresh={this._Refresh}
                    >
                        <ScrollView style={{paddingTop:'3%'}}>
                            <List containerStyle={{ marginTop: '-1%', borderTopWidth: 0, borderBottomWidth: 0, height: '100%' }}>
                                <FlatList
                                    data={this.state.data}
                                    keyExtractor={(item, index) => item.key}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity>
                                            <Row style={{width:'100%'}}>
                                                <Image
                                                    style={{width:80,height:80, borderRadius: 100,}}
                                                    source={{ uri: 'http://via.placeholder.com/640x360' }}
                                                />
                                                <View styleName="vertical">
                                                    <Subtitle>{item.selectedTime}</Subtitle>
                                                    <Text style={{ marginLeft:'3%' }} numberOfLines={1}>{item.selectedDate}</Text>
                                                    <Text style={{ marginLeft:'3%' }} numberOfLines={1}>{item.type}</Text>
                                                    <Text style={{ marginLeft:'3%' }} numberOfLines={1}>{item.eventName}</Text>
                                                    <Text style={{ marginLeft:'3%' }} numberOfLines={1}>{item.manualLocation || (item.region.latitude + ' -- ' + item.region.longitude )}</Text>
                                                    <RadioForm
                                                        radio_props={radio_props}
                                                        initial={0}
                                                        onPress={(value) => { this.updateAttendance(value,item.eventName) }}
                                                        formHorizontal={true}
                                                        labelHorizontal={true}
                                                        buttonColor={'#000'}
                                                        animation={true}
                                                        selectedButtonColor={'#19CFA0'}
                                                        style={{padding:'2%'}}
                                                    />
                                                </View>
                                                <Icon style={{ marginRight:'5%' }} name="ellipsis-v" size={25} color="#313131" />
                                            </Row>
                                        </TouchableOpacity >
                                    )}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    ListFooterComponent={this.renderFooter}
                                />
                            </List>
                        </ScrollView>
                    </PTRView>
                )}


                <ActionSheet
                    ref={(actionSheet) => { this.bottomActionSheet = actionSheet; }}
                    position="bottom"
                    onChange={this.onChange}
                    multiple
                >
                    <ActionSheetItem
                        text="Regular Event"
                        value="item1"
                        onPress={() => this.props.navigation.navigate('CreateEvent')
                        }
                    />
                    <ActionSheetItem
                        text="Paid Event"
                        value="item2"
                    />
                </ActionSheet>
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
    }, spinner: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 50
    },
    contentContainer: {
        marginTop: '-3%',
        height: '100%',
        backgroundColor: '#fff'
    },
};


export default Events;