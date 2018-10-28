import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Picker, Content, ListItem, Container, CheckBox, Badge, Toast, Root, List, Thumbnail, Right, Button, ActionSheet } from 'native-base';
import Spinner from 'react-native-spinkit';
import { StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationBar, Title, Image, TextInput, View, Row, Text, Subtitle, Divider, Caption, ListView } from '@shoutem/ui';
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from './../../renderIf';

var JOIN = ['Join Team', 'Cancel'];

export default class TeamInfo extends Component {


    constructor(props) {
        super(props);
        this.state = {
            teamName: this.props.teamName,
            team: Object,
            type: '',
            loading: false,
            coaches: [],
            players: [],
            parents: [],
            flag: 1,
            loadingMembers: false
        };
    }

    componentWillMount() {
        this.loader();
        this.fetchTeam(JSON.stringify(this.props.navigation.getParam('teamName')));
        this.inTeam();
        console.log(this.state.loadingMembers);
        
    }

    fetchTeam = (teamName) => {

        
        firebase.firestore().collection("teams").doc(teamName.replace(/['"]+/g, ''))
            .get()
            .then((e) => {
                console.log(e.data());
                this.setState({
                    type: e.data().info.type
                })
                this.setPlayers(e.data());
                this.setCoaches(e.data());
                this.setParents(e.data());
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }
    
    loader = () => {
        this.setState({ loadingMembers: true });
    }

    setPlayers = (e) => {
        console.log(e);

        if(e.players){
            this.setState({
                players: e.players
            });
        }
        
    }
    setCoaches = (e) => {
        console.log(e);
        if(e.coaches){
        this.setState({
            coaches: e.coaches
        });
    }
    this.setState({
        loadingMembers: false
    })
    }
    setParents = (e) => {
        console.log(e);

        if(e.parents){
        this.setState({
            parents: e.parents
        });
    }
    }

    joinTeam = (key) => {
        var user = firebase.auth().currentUser;
        this.setState({
            loading: true
        })

        firebase.firestore().collection('users').doc(user.uid).get()
            .then((doc) => {
                console.log(doc.data().type);
                if (doc.data().type == "Player") {
                    firebase.firestore().collection('teams').doc(key).get()
                        .then((doc) => {
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

                if (doc.data().type == "Coach") {
                    firebase.firestore().collection('teams').doc(key).get()
                        .then((doc) => {
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

                if (doc.data().type == "Parent") {
                    firebase.firestore().collection('teams').doc(key).get()
                        .then((doc) => {
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

    actionButton = (index) => {
        // alert(index);

        if (index == 0) {

            this.joinTeam(JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, ''));
            alert('Done');
            this.props.navigation.dispatch(StackActions.pop({
                n: 1,
            }))
            
        }
        else if (index == 1) {
            // this._signOutUser();
        }
    }

    inTeam = () => {
        var user = firebase.auth().currentUser;
        firebase.firestore().collection('teams').doc(JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '')).get()
        .then((e) => {
            if (e.data().players != undefined && e.data().players.includes(user.uid)) {
                this.setState({
                    flag: 1
                });
            }
            else if (e.data().parents != undefined && e.data().parents.includes(user.uid)) {
                this.setState({
                    flag: 1
                });
            }
            else if (e.data().coaches != undefined && e.data().coaches.includes(user.uid)) {
                this.setState({
                    flag: 1
                });
            }
            else if (e.data().info.adminID == user.uid){
                this.setState({
                    flag: 1
                });
            }
            else {
                this.setState({
                    flag: 0
                });
            }
        })
    }

    getRegistered = () => {
        return this.state.players.length + this.state.coaches.length + this.state.parents.length;
    }

    static navigationOptions = {
        header: null
    };

    render() {
        const popAction = StackActions.pop({
            n: 1,
        });
        return (
                <View styleName="fill-parent">

                
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#0BC5B7', '#29D890']} style={styles.linearGradient}>
                        <NavigationBar
                        styleName='clear'
                            // style={{
                            //     container: {
                            //         backgroundColor: '#4caf50'
                            //     },
                            // }}
                            leftComponent={
                                <TouchableHighlight>
                                    <Icon onPress={() => this.props.navigation.dispatch(popAction)} name="long-arrow-left" size={25} style={{ marginLeft: '15%' }} color='#fff' />
                                    {/* <Text style={{marginLeft:'1%'}}>Back</Text> */}
                                </TouchableHighlight>
                            }
                            centerComponent={<Title style={{ fontSize: 20, paddingTop: 3, }}>Team Info</Title>}
                            // rightComponent={
                            //     <TouchableHighlight
                            //         onPress={() =>
                            //             ActionSheet.show(
                            //                 {
                            //                     options: JOIN,
                            //                     cancelButtonIndex: 1,
                            //                     title: "Do you want to Join Team?"
                            //                 },
                            //                 buttonIndex = (index) => {
                            //                     this.actionButton(index);
                            //                 }
                            //             )}
                            //     >
                            //         <View style={{ marginRight: '15%', marginTop: '2%' }}>
                            //             <Icon name="handshake-o" size={30} color="#000" />
                            //         </View>
                            //     </TouchableHighlight>
                            // }
                        />
                        </LinearGradient>

                    <Container style={{ marginTop: '-4%', flex:1 }}>
                    <ScrollView>

                        <Content>
                            <List>
                                <ListItem style={{ borderBottomColor: '#fff' }}>
                                    <View stlye={{ marginLeft: '15%', marginTop: '5%', padding: '3%' }}>
                                        <TouchableOpacity>
                                            <Icon name="plus-square" size={90} color="#000" style={{ alignSelf: 'center' }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View styleName="vertical stretch" style={{ flex: 1.5, marginLeft: '10%', marginTop: '5%', padding: '3%' }}>
                                        <Subtitle>Team Name: {JSON.stringify(this.props.navigation.getParam('teamName'))}</Subtitle>
                                        <Subtitle>Code: {JSON.stringify(this.props.navigation.getParam('teamCode'))}</Subtitle>
                                        <Subtitle>{this.state.type} Team</Subtitle>
                                        <Subtitle>Organization: </Subtitle>
                                    </View>
                                </ListItem>
                                <ListItem style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.iconGrid}>
                                        <Icon name="user-circle" size={43} color="#000" style={{ alignSelf: 'center' }} />

                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.iconGrid}>
                                        <Icon name="book" size={43} color="#000" style={{ alignSelf: 'center' }} />
                                        <Badge style={{ backgroundColor: '#19CFA0', position: 'absolute', left: '70%', top:'50%',padding: 10 }}>
                                            <Text style={{ color: 'white', marginTop:'50%' }}>{this.getRegistered()}</Text>
                                        </Badge>
                                        </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconGrid} onPress={() => { this.props.navigation.navigate('TeamOptions', { teamName: JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '')})}}>
                                        <Icon name="ellipsis-v" size={43} color="#000" style={{ alignSelf: 'center' }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.iconGrid}>
                                        <Icon name="braille" size={43} color="#000" style={{ alignSelf: 'center' }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.iconGrid}>
                                            <Icon name="users" size={43} color="#000" style={{ alignSelf: 'center' }} />
                                        </TouchableOpacity>
                                </ListItem>

                            {/* <ScrollView> */}

                            {renderIf(this.state.loadingMembers,
                        <View style={{marginTop:'15%'}}>
                            <Row>
                            <Spinner style={styles.spinner} size={50} type={'9CubeGrid'} color={'#19CFA0'} />
                            </Row>
                        </View>
                        )}

                        {renderIf(this.state.loadingMembers == false,
                            <View>
                                        <Divider styleName="section-header">
                                            <Caption>Coaches ({this.state.coaches.length})</Caption>
                                        </Divider>
                        
                                        {renderIf(this.state.coaches.length > 0,
                                        <Row>
                                            <List style={{flexDirection:'row'}} containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                                                <FlatList
                                                    data={this.state.coaches}
                                                    keyExtractor={(item, index) => item.key}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity>
                                                            <Image
                                                                styleName="small rounded-corners" style={{ borderRadius: 50, width:50, height:50 }}
                                                                source={{ uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-10.png' }}
                                                                />
                                                        </TouchableOpacity >
                                                    )}
                                                    />
                                            </List>
                                        </Row>
                                                )}
                                        <Divider styleName="section-header">
                                            <Caption>Players ({this.state.players.length})</Caption>
                                        </Divider>
                                    {renderIf(this.state.players.length > 0,
                                        <Row>
                                                <FlatList
                                                    data={this.state.players}
                                                    keyExtractor={(item, index) => item.key}
                                                    horizontal={true}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity>
                                                            <Image
                                                                styleName="small rounded-corners" 
                                                                style={{ borderRadius: 50, width: 50, height: 50  }}
                                                                source={{ uri: 'http://via.placeholder.com/640x360' }}
                                                                />
                                                        </TouchableOpacity >
                                                    )}
                                                    />
                                        </Row>
                                    )}
                                        <Divider styleName="section-header">
                                            <Caption>Parents ({this.state.parents.length})</Caption>
                                        </Divider>
                                    {renderIf(this.state.parents.length > 0,
                                        <Row>
                                            <List style={{ flexDirection: 'row' }} containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                                                <FlatList
                                                    data={this.state.parents}
                                                    keyExtractor={(item, index) => item.key}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity>
                                                            <Image
                                                                styleName="small rounded-corners" style={{ borderRadius: 50, width: 50, height: 50  }}
                                                                source={{ uri: 'http://via.placeholder.com/640x360' }}
                                                                />
                                                        </TouchableOpacity >
                                                    )}
                                                    />
                                            </List>
                                        </Row>
                                    )}
                                </View>
                        )}

                                    
                                {/* </ScrollView> */}
                        
                            </List>
                        </Content>

                            </ScrollView>

                    {renderIf(this.state.flag == 0,
                        < Button block style={{ position: 'absolute', left: '10%', top: '90%', padding: 20, width: '80%', borderRadius: 5, backgroundColor:'#19CFA0'}} onPress={() =>
                            ActionSheet.show(
                                {
                                    options: JOIN,
                                    cancelButtonIndex: 1,
                                    title: "Do you want to Join Team?"
                                },
                                buttonIndex = (index) => {
                                    this.actionButton(index);
                                }
                            )}>
                            <Text style={{ color: 'white' }}>Join Team</Text>
                        </Button>
                    )}

                    </Container>
                </View>

        );
    }
}


const styles = StyleSheet.create({
    iconGrid: {
    backgroundColor: '#fff',
    flex: 1,
    height: '100%',
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingRight: '1%',
    paddingLeft: '1%',
    borderRadius: 10,
    borderColor:'#323232',
    borderStyle: 'solid',
    borderWidth:1,
    marginLeft:'2%',
    marginTop:'3%'
    },
    white: {
        color:"#FFF"
    },
    bottomView: {

        width: '100%',
        height: 50,
        backgroundColor: '#FF9800',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    },
        spinner: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 50
    },
    linearGradient: {
        width: '100%',
        height: 85
    }
});