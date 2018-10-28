import React, { Component } from 'react';
import {
    Text,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationBar, Title, Subtitle, View, Caption } from '@shoutem/ui';
import Spinner from 'react-native-spinkit';
import { StackActions } from 'react-navigation';
import { Content, ActionSheet, Root, Button } from 'native-base';
import { List, ListItem, SearchBar } from "react-native-elements";
import * as firebase from 'firebase';
import 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from './../../renderIf';

var BUTTONS = ['Join Team', 'Team Info', 'Cancel'];
var TeamsButtons = ['Delete Team', 'Team Info', 'Cancel'];


class JoinTeams extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            clicked: 0
        }
        this.arrayholder = [];
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.loader();
            this.ref = firebase.firestore().collection('teams');            
        });
        var user = firebase.auth().currentUser;

        // console.log(user);
        this.fetchTeams();

    };


    fetchTeams = () => {
        var user = firebase.auth().currentUser;
        var query = firebase.firestore().collection("teams");
        query
        .get()
            .then((e) => {
                this.setTeams(e.docs, user.uid);
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    setTeams = (e,uid) => {
        this.loader();
        this.teamsTemp = [];

        for (let index = 0; index < e.length; index++) {
            const element = e[index];
            flag = 0;
            if (element.data().info.adminID == uid) {
                flag = 1;
            }

            if (element.data().players != undefined && element.data().players.includes(uid) == true) {
               flag = 1;
            }
            if (element.data().coaches != undefined && element.data().coaches.includes(uid) == true) {
               flag = 1;
            }
            if (element.data().parents != undefined && element.data().parents.includes(uid) == true) {
               flag = 1;
            }
            
            if (flag == 0) {
                this.teamsTemp.push(element.data());
            }
        }
        this.setState({
            data: this.teamsTemp
        });
        this.arrayholder = this.teamsTemp;
        this.setState({ loading: false });
    }

    loader = () => {
        this.setState({ loading: true });
    }

    joinTeam = (key) => {
        var user = firebase.auth().currentUser;
        this.setState({
            loading: true
        })

        firebase.firestore().collection('users').doc(user.uid).get()
        .then( (doc) => {
            console.log(doc.data().type);
            if(doc.data().type == "Player"){
                firebase.firestore().collection('teams').doc(key).get()
                .then( (doc) => {
                        firebase.firestore().collection('teams').doc(key).update({
                            players: firebase.firestore.FieldValue.arrayUnion(user.uid)
                        });

                    this.setState({
                        loading: false
                    })
                    this.fetchTeams();
                }).catch((error) => {
                    console.log(error);
                    
                })
            }

            if(doc.data().type == "Coach"){
                firebase.firestore().collection('teams').doc(key).get()
                .then( (doc) => {
                        firebase.firestore().collection('teams').doc(key).update({
                            coaches: firebase.firestore.FieldValue.arrayUnion(user.uid)
                        });

                    this.setState({
                        loading: false
                    })
                    this.fetchTeams();
                }).catch((error) => {
                    console.log(error);
                    
                })
            }

            if(doc.data().type == "Parent"){
                firebase.firestore().collection('teams').doc(key).get()
                .then( (doc) => {
                        firebase.firestore().collection('teams').doc(key).update({
                            parents: firebase.firestore.FieldValue.arrayUnion(user.uid)
                        });

                    this.setState({
                        loading: false
                    })
                    this.fetchTeams();
                }).catch((error) => {
                    console.log(error);
                    
                })
            }

        })
        
    }

    actionButton = (index, key) => {
        if (index == 0) {
            this.joinTeam(key);
        }
        else if (index == 1) {
            this.props.navigation.navigate('TeamInfo', { teamName: key, teamCode: '######' })
        }
    }

    checkOwner = (key) => {
        var user = firebase.auth().currentUser;

        if (user.uid == key) {
            return true;
        }
        else
            return false;

    }

    renderHeader = () => {
        return (
            <SearchBar
                placeholder="Search teams ..."
                loadingIcon
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false}
                inputStyle={{ backgroundColor: 'white', color: '#19CFA0', padding: 5, height:40 }}
                containerStyle={{ backgroundColor: 'white', borderColor:'#fff', borderWidth:0 }}
                placeholderTextColor={'#C6CDD7'}
            />
        );
    };

    searchFilterFunction = text => {
        const empty = [];
        const newData = this.arrayholder.filter(item => {
        const itemData = `${item.info.name.toUpperCase()}`;
        const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
            this.setState({ data: newData });
        
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

    checkTeamFull = (team) => {
        return false;
    }

    render() {
        console.log(this.state.data);
        const popAction = StackActions.pop({
            n: 1,
        });

        return (

            // C5CCD6 grey color
            <Root>


                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#0BC5B7', '#29D890']} style={styles.linearGradient}>
                    <NavigationBar
                        styleName='clear'
                        //                         style={{
                        //     container: {
                        //         backgroundColor: '#4caf50'
                        //     },
                        // }}
                        leftComponent={
                            <TouchableHighlight>
                                <Icon onPress={() => this.props.navigation.dispatch(popAction)} name="long-arrow-left" size={20} style={{ marginLeft: '15%' }} color='#fff' />
                            </TouchableHighlight>
                        }
                        centerComponent={<Title style={{ fontSize: 20, paddingTop: 3,color:'#fff' }}>Join Teams </Title>}
                    />
                </LinearGradient>
                

                        

                {/* {renderIf((this.state.data.length == 0),
                    <NavigationBar
                    style={{
                        container: {
                            backgroundColor: '#4caf50'
                        },
                    }}
                    leftComponent={
                        <TouchableHighlight>
                                <Icon onPress={() => this.props.navigation.dispatch(popAction)} name="arrow-left" size={20} style={{ marginLeft: '8%' }} color='#000' />
                            </TouchableHighlight>
                        }
                        centerComponent={<Title style={{ fontSize: 20, paddingTop: 3, }}>Join Teams</Title>}
                        />
                        )} */}


                {renderIf(this.state.loading,
                    <View styleName='fill-parent' style={{ alignContent: 'center' }}>
                        {/* <PulseIndicator style={{ marginTop: 10 }} color='#000' size={100} />                         */}
                        <Spinner style={styles.spinner} size={40} type={'9CubeGrid'} color={'#19CFA0'} />
                    </View>
                )}

                {renderIf((this.state.loading == false),
                    <View style={styles.contentContainer}>
                        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                            <FlatList
                                data={this.state.data}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                    // onPress={() => {
                                    //     ActionSheet.show(
                                    //         {
                                    //             options: BUTTONS,
                                    //             cancelButtonIndex: 2,
                                    //             title: "Teams"
                                    //         },
                                    //         buttonIndex = (index) => {
                                    //             this.actionButton(index, item.info.name);
                                    //         }
                                    //         )
                                    //     }
                                    // }
                                    onPress={() => this.props.navigation.navigate('TeamInfo', { teamName: item.info.name, teamCode: '######' })}
                                    >
                                        <ListItem
                                            roundAvatar
                                            title={item.info.name}
                                            containerStyle={{ borderBottomWidth: 0, padding: 3 }}
                                            avatar={{ uri: 'http://via.placeholder.com/640x360' }}
                                            />
                                        <Caption style={{ marginLeft: '17%', marginTop: '-2%', marginBottom: '2%' }}>({item.info.type})</Caption>                                 

                                        {/* FULL BUTTON */}
                                        {renderIf(this.checkTeamFull(item),
                                            < Button small dark style = {{ position: 'absolute', left: '70%', top: '50%', padding: 20 }}>
                                                <Text style={{ color: 'white' }}>FULL</Text>
                                            </Button>
                                            )}
                                            
                                        <Caption style={{ marginLeft: '17%', marginTop: '-2%', marginBottom: '2%' }}>Organization: {item.info.organization}</Caption>

                                        {renderIf(this.checkOwner(item.info.adminID),
                                            <Caption style={{ marginLeft: '17%', marginTop: '-4%', marginBottom: '2%' }}>Owner</Caption>
                                        )}
                                    </TouchableOpacity >
                                )}
                                ItemSeparatorComponent={this.renderSeparator}
                                ListHeaderComponent={this.renderHeader} 
                                keyExtractor={item => item.name}
                                />
                        </List>
                    </View>
                )}
                </Root>
        );
    }
}

const styles = {
    button: {
        marginBottom: 30,
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
        marginTop: '-5%',
        height: '100%'

    },
    searchBarStyles: {
        color: 'white',
        backgroundColor: 'white'
    },
    linearGradient: {
        width:'100%',
        height:70
    }
};

export default JoinTeams;
