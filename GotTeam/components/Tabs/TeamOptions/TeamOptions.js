import React, { Component } from 'react';
import { TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Picker, Content, ListItem, Container, ActionSheet, Body, Toast, Root, List, Thumbnail, Right } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from 'react-navigation';
import { NavigationBar, Title, Image, TextInput, View, Row, Text, Subtitle, Divider, Caption, ListView } from '@shoutem/ui';
import Icon from 'react-native-vector-icons/FontAwesome';

var BUTTONS = ['Add Player', 'Add Coach', 'Add Parent', 'Add another', 'Add members from other team', 'Add members from Address Book', 'Cancel'];
var LEAVETEAM = ['Leave Team','No'];


export default class TeamOptions extends Component {


    constructor(props) {
        super(props);
        this.state= {
            teamName: this.props.teamName,
            data: []
        }
        
    }

    static navigationOptions = {
        header: null
    };

    

    leaveTeam = (index) => {

        var user = firebase.auth().currentUser;

        if (index == 0) {
            console.log(JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, ''));
            
            firebase.firestore().collection('users').doc(user.uid).get()
                .then( (doc) => {
                console.log(doc.data().type);
                if(doc.data().type == "Player"){
                    firebase.firestore().collection("teams").doc(JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, ''))
                    .update({
                        players: firebase.firestore.FieldValue.arrayRemove(user.uid)
                    })
                    .then(() => {
                        Toast.show({
                            text: "You Left the Team",
                            buttonText: "Okay",
                            duration: 5000
                        })
                    })
                    .then(() => {
                        this.props.navigation.dispatch(StackActions.pop({n:4}))
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });
                }
                if(doc.data().type == "Coach"){
                    firebase.firestore().collection("teams").doc(JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, ''))
                    .update({
                        coaches: firebase.firestore.FieldValue.arrayRemove(user.uid)
                    })
                    .then(() => {
                        Toast.show({
                            text: "You Left the Team",
                            buttonText: "Okay",
                            duration: 5000
                        })
                    })
                    .then(() => {
                        this.props.navigation.dispatch(StackActions.pop({n:4}))
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });
                }
                if(doc.data().type == "Parent"){
                    firebase.firestore().collection("teams").doc(JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, ''))
                    .update({
                        parents: firebase.firestore.FieldValue.arrayRemove(user.uid)
                    })
                    .then(() => {
                        Toast.show({
                            text: "You Left the Team",
                            buttonText: "Okay",
                            duration: 5000
                        })
                    })
                    .then(() => {
                        this.props.navigation.dispatch(StackActions.pop({n:4}))
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });
                }

        })
    }}

    editTeam = () => {
        var user = firebase.auth().currentUser;

        var name = JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '');
        console.log('called');
        
        firebase.firestore().collection("teams").where('info.name', '==', name)
            .get()
            .then((e) => {
                if (e.docs[0].data().info.adminID == user.uid) {
                    this.props.navigation.navigate('EditTeamInfo', { teamName: name });
                }
                else{
                    alert('You can only edit your own teams.');
                }
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    sendTeamMessage = () => {
        var user = firebase.auth().currentUser;

        var name = JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '');
    
        firebase.firestore().collection("teams").where('info.name', '==', name)
            .get()
            .then((e) => {
                if (e.docs[0].data().info.adminID == user.uid) {
                    this.props.navigation.navigate('TeamMessage', { teamName: JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '')})
                }
                else{
                    alert('You are not an admin or a team owner to send a Team Message.');
                }
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }
    

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
                            <TouchableOpacity>
                                <Icon onPress={() => this.props.navigation.dispatch(popAction)} name="long-arrow-left" size={20} style={{ marginLeft: '15%' }} color='#fff' />
                                {/* <Text style={{marginLeft:'1%'}}>Back</Text> */}
                            </TouchableOpacity>
                        }
                        centerComponent={<Title style={{ fontSize: 20, paddingTop: 3, }}>Team Options</Title>}
                    />
                    </LinearGradient>

                    <Container style={{ marginTop: '-4%' }}>
                        <Content>
                                <TouchableOpacity>
                            <List>
                                    <ListItem onPress={() =>
                                        ActionSheet.show(
                                            {
                                                options: BUTTONS,
                                                cancelButtonIndex: 7,
                                                title: "Add Members"
                                            },
                                            buttonIndex => {
                                                this.setState({ clicked: BUTTONS[buttonIndex] });
                                            }
                                        )}>
                                    <Text>Add Members</Text>
                                </ListItem>
                                <ListItem>
                                    <Text>Send Invitations</Text>
                                </ListItem>
                                <ListItem>
                                    <TouchableOpacity onPress={() => this.sendTeamMessage()}>
                                        <Text>Create Team Message</Text>
                                    </TouchableOpacity>
                                </ListItem>
                                <ListItem>
                                    <Text>Create Group Message</Text>
                                </ListItem>
                                <ListItem>
                                    <Text>My Groups</Text>
                                </ListItem>
                                <ListItem>
                                    <TouchableOpacity onPress={() => {
                                        this.props.navigation.navigate('Notifications', { teamName: JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '')});
                                    }}>
                                    <Text>Set Notifications</Text>
                                    </TouchableOpacity>
                                </ListItem>
                                <ListItem>
                                    <Text>Signup Items</Text>
                                </ListItem>
                                <ListItem>
                                    <Text>Dues and Payment Items</Text>
                                </ListItem>
                                <ListItem>
                                    <Text>Team Documents</Text>
                                </ListItem>
                                <ListItem>
                                    <Text>Track Items</Text>
                                </ListItem>
                                <ListItem>
                                    <TouchableOpacity onPress={() => this.editTeam()}>
                                        <Text>Edit Team Info</Text>
                                    </TouchableOpacity>
                                </ListItem>
                                <ListItem>
                                    <Text>View Team Website</Text>
                                </ListItem>
                                <ListItem style={{backgroundColor: 'red', marginLeft:'-3%', paddingLeft:'5%'}}
                                        onPress={() =>
                                            ActionSheet.show(
                                                {
                                                    options: LEAVETEAM,
                                                    cancelButtonIndex: 1,
                                                    title: "Are you sure that you want to leave the team? "
                                                },
                                                buttonIndex = (index) => {
                                                    this.leaveTeam(index);
                                                }
                                            )}>
                                    <Text style={{color:'white'}}>Leave Team</Text>
                                </ListItem>
                            </List>
                                </TouchableOpacity>
                        </Content>
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
        borderColor: '#323232',
        borderStyle: 'solid',
        borderWidth: 1,
        marginLeft: '2%',
        marginTop: '3%'
    },
    linearGradient: {
        width: '100%',
        height: 85
    }
});