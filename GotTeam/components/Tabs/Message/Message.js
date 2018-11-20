import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card, CardItem, Body, Toast } from "native-base";
import { NavigationBar, Title, Image, View, Row, Text, Subtitle, Divider, Caption, Button } from '@shoutem/ui';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Spinner from 'react-native-spinkit';
import { StackActions } from 'react-navigation';
import { ActionSheet, ActionSheetItem } from 'react-native-action-sheet-component';
import renderIf from './../../renderIf';
import { List, ListItem, SearchBar } from "react-native-elements";
import PTRView from 'react-native-pull-to-refresh'
import Icon from 'react-native-vector-icons/FontAwesome';

class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            teams: [],
            _refresh: false,
            userID: '',
            teamName: JSON.stringify(this.props.navigation.getParam('teamName').replace(/['"]+/g, '')),
            deleteId:0,
            deleteLoading: false

        }

    }

    static navigationOptions = {
        header: null
    };


    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.user = user;
            this.setState({
                userID: user.uid
            });
            this.loader();
        });

        this.getMessage();

    };

    seen = () => {
    
        var user = firebase.auth().currentUser;

        for (let index = 0; index < this.state.data.length; index++) {
            const element = this.state.data[index];
            if (element.userID != user.uid) {
                this.seeMessage(element.id,user.uid);
            }
        }

    }

    seeMessage = (id,uid) => {

        firebase.firestore().collection('messages').doc(id)
        .update({
            seen: firebase.firestore.FieldValue.arrayUnion(uid)
        })
    }


    getMessage = () => {
        
        firebase.firestore().collection("messages")
        .orderBy("time", "desc")
        .get()
        .then( (e) => {
            this.setMessages(e.docs);
        }).catch((error) => {
            console.log(error);
            
        })

    }

    setMessages = (e) => {
        this.messagesTemp = [];
        this.newElement;
        for (let index = 0; index < e.length; index++) {
            const element = e[index];
            if (element.data().teamName == this.state.teamName.replace(/['"]+/g, '')) {
                this.messagesTemp.push(element.data())
            }
        }
        this.setState({
            data: this.messagesTemp
        });
        this.setState({ loading: false });
        this.seen();
    }
 
    deleteMessage = () => {
        
        var user = firebase.auth().currentUser;        
        firebase.firestore().collection('messages').doc(this.state.deleteId)
        .get()
        .then(function (e) {
            console.log(e.data());
            if (e.data().userID == user.uid) {
                firebase.firestore().collection("messages").doc(this.state.deleteId).delete().then(function () {
                    alert('Message deleted.')
                }).catch(function (error) {
                    console.log(error);
                });
            }
            else{
                alert("You don't have permission to delete this message.")
            }
            this.getMessage();
            this.setState({ deleteLoading: false });
            }.bind(this)).catch((error) => {
            console.log(error);
        })
    }


    _Refresh = () => {
        this.setState({ refreshing: true });
        this.getMessage(this.state.teamName);

    }


    loader = () => {
        this.setState({ loading: true });
    }


    showBottomActionSheet = () => {
        this.bottomActionSheet.show();
    }

    showDeleteActionSheet = (id) => {
        
        this.setState({
            deleteLoading: true,
            deleteId: id
        })
        this.deleteActionSheet.show();
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

    render() {

        const popAction = StackActions.pop({
            n: 1,
        });
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
                            <TouchableOpacity>
                                <Icon onPress={() => this.props.navigation.dispatch(popAction)} name="long-arrow-left" size={25} style={{ marginLeft: '15%' }} color='#fff' />
                                {/* <Text style={{marginLeft:'1%'}}>Back</Text> */}
                            </TouchableOpacity>
                        }
                        centerComponent={<Title style={{ fontSize: 20, paddingTop: 3, }}>{this.state.teamName.replace(/['"]+/g, '')}</Title>}
                        rightComponent={
                                <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('TeamMessage', { teamName: JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '') })}
                                >
                                    <Icon style={{ marginRight: '10%' }} name="plus-circle" size={30} color="#fff" />
                                </TouchableOpacity>
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
                                        <Card style={{marginBottom:'4%'}}>
                                            <CardItem header>
                                                <Image
                                                    style={{ width: 50, height: 50, borderRadius: 100, }}
                                                    source={{ uri: 'http://via.placeholder.com/640x360' }}
                                                />
                                                <View style={{ marginLeft:'5%'}}styleName="vertical">
                                                <Subtitle>{item.subject}</Subtitle>
                                                <Caption>{item.time}</Caption>
                                                </View>
                                            </CardItem>
                                            <CardItem>
                                                <Body>
                                                    <Text>
                                                        {item.message}
                                                    </Text>
                                                </Body>
                                            </CardItem>
                                            <CardItem footer>
                                                {/* <View
                                                    style={{
                                                        height: 1,
                                                        width: "100%",
                                                        backgroundColor: "#CED0CE",
                                                    }}
                                                /> */}
                                                <Row style={{ width: '100%', borderTopWidth:1, borderTopColor: '#CED0CE' }}>
                                                    <TouchableOpacity>
                                                        <Icon style={{ marginRight:'2%' }} name="eye" size={22} color="#19CFA0" />
                                                    </TouchableOpacity>
                                                    <View>
                                                        <Text style={{width:'10%'}}>
                                                            { item.seen ? item.seen.length : 0 }
                                                        </Text>
                                                    </View>
                                                    {renderIf(this.state.deleteLoading,
                                                        <ActivityIndicator style={{ margin: 0 }} color='#19CFA0' size={40} />
                                                    )}
                                                    {renderIf(this.state.deleteLoading == false,
                                                        <TouchableOpacity
                                                            onPress={() => this.showDeleteActionSheet(item.id)}
                                                        >
                                                            <Icon name="trash-o" size={22} color="#000" />
                                                        </TouchableOpacity>
                                                    )}
                                                </Row>
                                            </CardItem>
                                        </Card>
                                    )}
                                    // ItemSeparatorComponent={this.renderSeparator}
                                    ListFooterComponent={this.renderFooter}
                                />
                            </List>
                        </ScrollView>
                    </PTRView>
                )}


                {/* <ActionSheet
                    ref={(actionSheet) => { this.bottomActionSheet = actionSheet; }}
                    position="bottom"
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
                </ActionSheet> */}
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
                <ActionSheet
                    ref={(actionSheet) => { this.deleteActionSheet = actionSheet; }}
                    position="bottom"
                >
                    <ActionSheetItem
                        text="Delete Message"
                        value="delete"
                        onPress={() => this.deleteMessage()}
                    />
                    <ActionSheetItem
                        text="Cancel"
                        value="cancel"
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


export default Message;