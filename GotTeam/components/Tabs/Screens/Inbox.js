import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationBar, Title, Image, View, Row, Text, Subtitle, Divider, Caption, Button } from '@shoutem/ui';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Spinner from 'react-native-spinkit';
import { Toast } from 'native-base';
import { ActionSheet, ActionSheetItem } from 'react-native-action-sheet-component';
import renderIf from './../../renderIf';
import { List, ListItem, SearchBar } from "react-native-elements";
import PTRView from 'react-native-pull-to-refresh'
import Icon from 'react-native-vector-icons/FontAwesome';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'


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
            team: [],
            _refresh: false,
            userID: '',
        }
        this.users = Object;
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.user = user;
            this.setState({
                userID: user.uid
            });
            this.loader();
        });
        var user = firebase.auth().currentUser;
        this.fetchTeams(user);
        this.fetchMessages(user);

    };

    fetchMessages = (user) => {
        this.id = user.uid;
        firebase.firestore().collection("messages")
            .get()
            .then((e) => {
                this.setMessages(e.docs);
                
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    fetchTeams = (user) => {
        this.id = user.uid;
        firebase.firestore().collection("teams")
            .get()
            .then((e) => {
                this.setTeams(e.docs, this.id);
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    setTeams = (e, uid) => {
        this.loader();
        this.teamsTemp = [];

        for (let index = 0; index < e.length; index++) {
            const element = e[index];

            if (element.data().players != undefined) {
                if (element.data().players.includes(uid) == true) {
                    this.teamsTemp.push(element.data().info.name);
                    continue;
                }
            }
            if (element.data().parents != undefined) {
                if (element.data().parents.includes(uid) == true) {
                    this.teamsTemp.push(element.data().info.name);
                    continue;
                }
            }
            if (element.data().coaches != undefined) {
                if (element.data().coaches.includes(uid) == true) {
                    this.teamsTemp.push(element.data().info.name);
                    continue;
                }
            }
            else {
                if (element.data().info.adminID == uid) {
                    this.teamsTemp.push(element.data().info.name);
                }
            }

        }
        this.setState({
            teams: this.teamsTemp
        });
        console.log(this.teamsTemp);

        this.setState({ loading: false });
    }

    inTeam = (teamName, uid) => {
        if (this.state.teams.includes(teamName)) {
            return true;
        }
        else {
            return false;
        }
    }

    _Refresh = () => {
        this.setState({ refreshing: true });
        var user = firebase.auth().currentUser;
        this.fetchMessages(user);

    }

    duplicate = (teamName) => {
        console.log(teamName);
        
        for (let index = 0; index < this.messagesTemp.length; index++) {
            const element = this.messagesTemp[index];
            console.log(element);
            
            if (element.teamName == teamName) {
                return true;
            }
        }
        return false;
    }

    setMessages = (e) => {
        this.messagesTemp = [];
        this.newElement;
        for (let index = 0; index < e.length; index++) {
            const element = e[index];
            console.log(element);
            console.log(this.duplicate(element.data().teamName));
            
            if (this.inTeam(element.data().teamName) && this.duplicate(element.data().teamName) == false ) {
                this.messagesTemp.push(element.data());
            }
        }
        this.setState({
            data: this.messagesTemp
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

    updateUsers = (uid,name) => {
        this.users[uid] = name;
    } 

    get = (k)=> {
        console.log(this.users[k.userID]);
        return this.users[k];
    }

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
                            <Title style={{ marginLeft: '25%', fontSize: 20, paddingTop: 3, }}>Inbox</Title>
                        }
                        rightComponent={
                            <View style={{ flexDirection: 'row', marginRight: '5%', marginTop: '2%', width: '130%' }}>
                                <TouchableOpacity
                                    // onPress={() => this.props.navigation.navigate('CalendarScreen')}
                                >
                                    <Icon style={{ marginLeft: '10%' }} name="search" size={30} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Icon style={{ marginLeft: '10%' }} name="user-circle-o" size={30} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Icon style={{ marginLeft: '10%' }} name="send-o" size={30} color="#fff" />
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
                        <ScrollView>
                            <List containerStyle={{ marginTop: '-1%', borderTopWidth: 0, borderBottomWidth: 0, height: '100%' }}>
                                <FlatList
                                    data={this.state.data}
                                    keyExtractor={(item, index) => item.key}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                        onPress={()=> {
                                                this.props.navigation.navigate('Message', { teamName: item.teamName})
                                        }}
                                        >
                                            <Row style={{ width: '100%' }}>
                                                <Image
                                                    style={{ width: 80, height: 80, borderRadius: 100, }}
                                                    source={{ uri: 'http://via.placeholder.com/640x360' }}
                                                />
                                                <View styleName="vertical">
                                                    <View styleName="horizontal space-between">
                                                    <Subtitle>{item.teamName}</Subtitle>
                                                </View>
                                                    <Text style={{ marginLeft: '3%' }} numberOfLines={1}>{item.subject}</Text>
                                                <Caption style={{marginTop:'2%'}}>{item.time.split(9)}</Caption>
                                                </View>

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
                        text="Create Team Message"
                        value="item1"
                        // onPress={() => this.props.navigation.navigate('CreateEvent')}
                    />
                    <ActionSheetItem
                        text="Create Team Survey"
                        value="item2"
                    />
                    <ActionSheetItem
                        text="Send Member or Group Message"
                        value="item3"
                    />
                    <ActionSheetItem
                        text="Cancel"
                        value="item4"
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
        height: '100%',
        backgroundColor: '#fff'
    },
    radioButtonWrap: {
        marginRight: 5
    }
};


export default Events;