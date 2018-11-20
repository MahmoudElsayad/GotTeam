import React, { Component } from 'react';
import {
    Text,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    TouchableHighlight,
    TouchableOpacity ,
    ScrollView
} from 'react-native';
import { NavigationBar, Title, Subtitle, View, Divider , Caption} from '@shoutem/ui';
import Spinner from 'react-native-spinkit';
import LinearGradient from 'react-native-linear-gradient';
import { Content, Root, Toast } from 'native-base';
import { List, ListItem, SearchBar } from "react-native-elements";
import * as firebase from 'firebase';
import 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from './../../renderIf';
import PTRView from 'react-native-pull-to-refresh'
import { ActionSheet, ActionSheetItem } from 'react-native-action-sheet-component';



var BUTTONS = ['Create Team', 'Join Team', 'Cancel'];
var TeamsButtons = ['Delete Team', 'Team Info', 'Edit Team', 'Cancel'];


class Teams extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            clicked: 0,
            _refresh: false,
            selectedTeam: ['item1']

        }
    }


    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.user = user;
            this.loader();
        });
        var user = firebase.auth().currentUser;
        
        // console.log(user);
        this.fetchTeams(user);

    };


    showInfoActionSheet = (key) => {
        this.setState({ selectedTeam: key });
        this.infoActionSheet.show();
    }

    showJoinActionSheet = () => {
        this.joinActionSheet.show();
    }

    onChange = (value, index, values) => {
        console.log(values);
    }

    onItemPress = (value) => {
        if (value == 'create') {
            this.props.navigation.navigate('AddTeams');
        }
        else if (value == 'join') {
            this.props.navigation.navigate('JoinTeams');
        }

        if (value == 'delete') {
            this.deleteTeam(this.state.selectedTeam);
        }
        else if (value == 'info') {
            this.props.navigation.navigate('TeamInfo', { teamName: this.state.selectedTeam, teamCode: '######' })
        }
    }

    _Refresh = () => {
        this.setState({ refreshing: true });
        var user = firebase.auth().currentUser;
        this.fetchTeams(user);

    }

    fetchTeams = (user) => {
        console.log(user.uid);
        this.id = user.uid ;
        firebase.firestore().collection("teams")
            .get()
            .then((e) => {
                this.setTeams(e.docs, this.id);
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    loader = () => {
        this.setState({ loading: true });
    }

    setTeams = (e, uid) => {
        this.loader();
        this.teamsTemp = [];

        for (let index = 0; index < e.length; index++) {
            const element = e[index];

            if (element.data().players != undefined) {
                if (element.data().players.includes(uid) == true) {
                    this.teamsTemp.push(element.data().info);
                    continue;
                }
            }
            if (element.data().parents != undefined) {
                if (element.data().parents.includes(uid) == true) {
                    this.teamsTemp.push(element.data().info);
                    continue;
                }
            }
            if (element.data().coaches != undefined) {
                if (element.data().coaches.includes(uid) == true) {
                    this.teamsTemp.push(element.data().info);
                    continue;
                }
            }
            else{ 
                if (element.data().info.adminID == uid) {
                    this.teamsTemp.push(element.data().info)
                }
            }

        }
        this.setState({
            data: this.teamsTemp
        });
        this.setState({ loading: false });
    }

    actionButton = (index) => {
        // alert(index);

        if (index == 0) {
            this.props.navigation.navigate('AddTeams');
        }
        else if (index == 1) {
            this.props.navigation.navigate('JoinTeams');
        }

        
    }

    deleteTeam = (key) => {

        this.setState({
            loading: true
        });

        firebase.firestore().collection("teams").doc(key).delete().then(function () {
            Toast.show({
                text: "Team Deleted Successfully",
                buttonText: "Okay",
                duration: 3000
            })
        }).catch(function (error) {
            alert("Error removing document: ", error);
        });
        var user = firebase.auth().currentUser;

        this.fetchTeams(user);

        this.setState({loading: false});

    }

    holdButton = (index,key) => {

        if (index == 0) {
            this.deleteTeam(key);
        }
        else if (index == 1) {
            this.props.navigation.navigate('TeamInfo', { teamName: key, teamCode: '######' })
        }
    }

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

    checkOwner = (key) => {
        var user = firebase.auth().currentUser;

        if (user.uid == key) {
            return true;
        }
        else
            return false;
        
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


    render() {
        console.log(this.state.data);

        return (
            <Root>

                {renderIf((this.state.loading == false && this.state.data.length > 0),
                 <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#0BC5B7', '#29D890']} style={styles.linearGradient}>
                    <NavigationBar
                    styleName='clear'
                        // style={{
                        //     container: {
                        //         backgroundColor: '#4caf50'
                        //     },
                        // }}
                        centerComponent={<Title style={{ fontSize: 20, paddingTop: 3, }}>Teams</Title>}
                        rightComponent={
                            <TouchableOpacity
                                onPress={this.showJoinActionSheet}
                            >
                                <View style={{ marginRight: '15%', marginTop:'2%' }}>
                                    <Icon name="plus-circle" size={30} color="#fff" />
                                </View>
                            </TouchableOpacity>
                        }
                        />
                        </LinearGradient>
                )}

                {renderIf((this.state.data.length == 0),
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#0BC5B7', '#29D890']} style={styles.linearGradient}>
                    <NavigationBar
                    styleName='clear'
                        // style={{
                        //     container: {
                        //         backgroundColor: '#4caf50'
                        //     },
                        // }}
                        centerComponent={<Title style={{ fontSize: 20, paddingTop: 3, }}>Teams</Title>}
                    />
                    </LinearGradient>
                )}


                {renderIf(this.state.loading,
                    <View styleName='fill-parent' style={{ alignContent:'center'}}>
                        {/* <PulseIndicator style={{ marginTop: 10 }} color='#000' size={100} />                         */}
                        <Spinner style={styles.spinner} size={40} type={'9CubeGrid'} color={'#19CFA0'} />
                    </View>
                )}

                {renderIf((this.state.loading == false && this.state.data.length == 0),
                    <View styleName="fill-parent" style={{ marginTop: '12%', height:'100%' }}>
                        <PTRView
                            style={{ height:'100%', backgroundColor:'#fff', marginTop:'5%'}}
                            onRefresh={this._Refresh}
                        >
                        <TouchableHighlight style={styles.container} onPress={() => this.props.navigation.navigate('AddTeams')} underlayColor="white">
                            <View style={styles.button}>
                                    <Icon name="plus-circle" size={150} color="#19CFA0" />
                                <Text style={styles.buttonText}>Add Teams</Text>
                            </View>
                        </TouchableHighlight>
                        </PTRView>
                    </View>
                )}

                {renderIf((this.state.loading == false && this.state.data.length > 0),
                        <PTRView
                            style={styles.contentContainer}
                            onRefresh={this._Refresh}
                        >
                            <Divider styleName="section-header">
                                <Text style={{marginLeft:'2%', marginBottom:'2%'}}>Your Teams</Text>
                            </Divider>
                        <ScrollView>
                        <List containerStyle={{ marginTop: '-1%',borderTopWidth: 0, borderBottomWidth: 0, height:'100%' }}>
                            <FlatList
                                data={this.state.data}
                                keyExtractor={(item, index) => item.key}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                    onPress= {() => {
                                        this.showInfoActionSheet(item.name)
                                        }}
                                        >
                                    <ListItem
                                        roundAvatar
                                        title={item.name}
                                        containerStyle={{ borderBottomWidth: 0, padding: 5 }}
                                        avatar={{ uri: 'http://via.placeholder.com/640x360'}}
                                        />
                                        {renderIf(this.checkOwner(item.adminID),
                                            <Caption style={{ marginLeft: '17%', marginTop: '-4%', marginBottom: '2%' }}>Owner</Caption>
                                            )}
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
                    ref={(actionSheet) => { this.joinActionSheet = actionSheet; }}
                    position="bottom"
                    onChange={this.onChange}
                >
                    <ActionSheetItem
                        text="Create Team"
                        value="create"
                        onPress={this.onItemPress}
                    />
                    <ActionSheetItem
                        text="Join Team"
                        value="join"
                        onPress={this.onItemPress}
                    />
                </ActionSheet>

                <ActionSheet
                    ref={(actionSheet) => { this.infoActionSheet = actionSheet; }}
                    position="bottom"
                    onChange={this.onChange}
                >
                    <ActionSheetItem
                        text="Delete Team"
                        value="delete"
                        onPress={this.onItemPress}
                    />
                    <ActionSheetItem
                        text="Team Info"
                        value="info"
                        onPress={this.onItemPress}
                    />
                </ActionSheet>

            </Root>
        );
    }
}

const styles = {
    button: {
        marginBottom: 30,
        marginTop:'40%',
        width: 260,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    buttonText: {
        padding: 15,
        color: 'black',
        fontSize: 40,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        marginTop: '17%',
        width: '100%',
        height: '100%'
    },

    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 50
    },
    contentContainer: {
        marginTop: '-3%',
        height:'100%',
        backgroundColor: '#fff'
    },
    linearGradient: {
        width: '100%',
        height: 85
    }
};

export default Teams;
