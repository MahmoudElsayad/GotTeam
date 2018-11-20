import React, { Component } from 'react';
import { TouchableHighlight, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Spinner from 'react-native-spinkit';
import { Picker, Container, Body, Form, Root, Item, Label, Input, Textarea, Content, ListItem, CheckBox, Text } from 'native-base';
import { StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { SearchBar } from "react-native-elements";
import { NavigationBar, Title, Switch, TextInput, View, Row, Subtitle, Divider, Caption, Button } from '@shoutem/ui';
import renderIf from './../../renderIf';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';





export default class TeamMessage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            teamName: this.props.teamName,
            data: [],
            message: '',
            recipients: [],
            urgent: false,
            members: false,
            followers: false,
            subject: '',
            message:'',
            sendNow: false,
            sendOnDate: false,
            isDatePickerVisible: false,
            isTimePickerVisible: false,
            selectedDate: '01/01/2018',
            selectedTime: '11:00 AM',
            createLoading: false
        };
        this.arrayholder = [];
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.fetchUsers();
    };

    fetchUsers = () => {
        var query = firebase.firestore().collection("users");
        query
            .get()
            .then((e) => {
                this.setUsers(e.docs);
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    setUsers = (e) => {
        this.teamsTemp = [];

        for (let index = 0; index < e.length; index++) {
            const element = e[index];
            this.teamsTemp.push(element.data());
        }
        this.setState({
            data: this.teamsTemp
        });
        this.arrayholder = this.teamsTemp;
        console.log(this.state.data);

    }

    _showDatePicker = () => this.setState({ isDatePickerVisible: true });

    _hideDatePicker = () => this.setState({ isDatePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({
            selectedDate: date.toString().substring(0,15)
        });
        this._hideDatePicker();
    };

    _showTimePicker = () => this.setState({ isTimePickerVisible: true });

    _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

    _handleTimePicked = (time) => {
                this.setState({
            selectedTime: time.toString().substring(15,21)
        });
        this._hideTimePicker();
    };

    searchFilterFunction = text => {
        const empty = [];
        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.name.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({ data: newData });

    };

    addUser = (name) => {
        console.log(name);
    }

    sendMessage = () => {
        this.setState({
            createLoading: true
        })
        var user = firebase.auth().currentUser;
        
        firebase.firestore().collection("messages").add({
            teamName: JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, ''),
            message: this.state.message,
            urgent: this.state.urgent,
            members: this.state.members,
            followers: this.state.followers,
            subject: this.state.subject,
            sendOnDate: this.state.sendOnDate,
            userID: user.uid,
            time: moment().format('llll')
        })
            .then((ref) => {
                firebase.firestore().collection("messages").doc(ref.id).
                    update({
                        id: ref.id
                    })
                console.log('Added document with ID: ', ref.id);
                this.props.navigation.dispatch(StackActions.pop({
                    n: 3,
                }))
            })
            .catch((error)=> {
                console.error("Error writing document: ", error);
            });
        
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


    render() {
        const popAction = StackActions.pop({
            n: 3,
        });
        return (
            <Root>
            
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
                        centerComponent={<Title style={{ fontSize: 18, paddingTop: 3, width: '140%' }}>Send Team Message</Title>}
                        rightComponent={
                            <TouchableOpacity style={{ marginRight: '15%' }} onPress={() => 
                            this.sendMessage()}>
                                <Icon name='paper-plane' size={20} color='#fff' />
                            </TouchableOpacity>
                        }
                        />
                        </LinearGradient>

                    {renderIf(this.state.createLoading,
                        // <PulseIndicator style={{ margin: 0 }} color='#000' size={100} />
                        <Spinner style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginBottom: 50
                        }} size={40} type={'9CubeGrid'} color={'#19CFA0'} />
                    )}


                    {renderIf((this.state.createLoading == false),
                    <View styleName="fill-parent" style={{ marginTop: '15%' }}>
                        <View styleName="vertical h-start">
                    <ScrollView style={{marginTop:'1%', width:'100%', height:'110%'}}>

                            <Row style={{ width: '100%' }}>
                                    <Text> Include </Text>
                                    <ListItem style={{marginRight:'4%', width:'150%'}}>
                                        <CheckBox color='#19CFA0' onPress={() => {
                                            this.setState(prevState => ({
                                                members: !prevState.members
                                            }))
                                        }} style={{ marginRight: '10%' }} checked={this.state.members} />
                                        <Body>
                                            <Subtitle style={{ marginBottom: '2%' }} >Members</Subtitle>
                                        </Body>
                                    </ListItem>
                                <ListItem style={{ width: '150%' }} >
                                        <CheckBox color='#19CFA0' onPress={() => {
                                            this.setState(prevState => ({
                                                followers: !prevState.followers
                                            }))
                                        }} style={{ marginRight: '10%' }} checked={this.state.followers} />
                                        <Body>
                                            <Subtitle style={{ marginBottom: '2%' }} >Followers</Subtitle>
                                        </Body>
                                    </ListItem>
                            </Row>

                            <Row style={{width:'100%' , marginTop:'-7%'}}>
                                <ListItem style={{ marginRight: '4%', marginLeft: '34%', marginTop:'-3%',width: '150%' }}>
                                        <CheckBox color='#19CFA0' onPress={() => {
                                        this.setState(prevState => ({
                                            parents: !prevState.parents
                                        }))
                                    }} style={{ marginRight: '10%' }} checked={this.state.parents} />
                                    <Body>
                                        <Subtitle style={{ marginBottom: '2%' }} >Parents</Subtitle>
                                    </Body>
                                </ListItem>
                            </Row>

                            <Row style={{ width: '100%' }}>
                                <Content>
                                    <ListItem>
                                        <CheckBox color='#f00' onPress={() => {
                                            this.setState(prevState => ({
                                                urgent: !prevState.urgent
                                            }))
                                        }} style={{ marginRight: '10%' }} checked={this.state.urgent} />
                                        <Body>
                                            <Text style={{ marginBottom: '2%' }} >Mark as urgent</Text>
                                        </Body>
                                    </ListItem>
                                </Content>
                            </Row>

                            <Row style={{width:'100%'}}>
                                <Content>
                                    <Form>
                                        <Item stackedLabel>
                                            <Label>Subject</Label>
                                            <Input 
                                            placeholder={"Message's Subject"}
                                                    onChangeText={(subject) => this.setState({ subject })}
                                            />
                                        </Item>
                                    </Form>
                                </Content>
                            </Row>

                            <Row style={{width:'100%'}}>
                                <Content>
                                    <Form>
                                            <Label style={{marginBottom:'1%'}}>Message</Label>
                                            <Textarea rowSpan={5} 
                                                underlineColorAndroid="transparent"
                                                onChangeText={(message) => this.setState({ message })}
                                                bordered placeholder="message ..." />
                                    </Form>
                                </Content>
                            </Row>

                                <Row style={{ width: '100%' }}>
                                    <ListItem>
                                        <CheckBox color='#19CFA0' onPress={() => {
                                            this.setState(prevState => ({
                                                sendNow: !prevState.sendNow
                                            }))
                                        }} style={{ marginRight: '10%' }} checked={this.state.sendNow} />
                                            <Text style={{ marginBottom: '2%'}} >Send Now</Text>
                                    </ListItem>

                                    <ListItem>
                                        <CheckBox color='#19CFA0' onPress={() => {
                                            this.setState(prevState => ({
                                                sendOnDate: !prevState.sendOnDate
                                            }))
                                        }} style={{ marginRight: '10%' }} checked={this.state.sendOnDate} />
                                            <Text style={{ marginBottom: '2%'}} >Send on Date and Time</Text>
                                    </ListItem>

                                </Row>
                                

                                <Row style={{ width: '100%'}}>
                                    <Form>
                                        <Item stackedLabel>
                                            <Label>Select Time</Label>
                                            <Row style={{width:'100%',marginTop:'1%'}}>
                                                <Icon style={{ marginRight: '15%' }} name='clock-o' size={20} color='#' />
                                                <TouchableOpacity onPress={this._showTimePicker}>
                                                        <Text>{this.state.selectedTime}</Text>
                                                </TouchableOpacity>
                                            </Row>
                                        </Item>
                                    </Form>
                                </Row>

                                <Row style={{ width: '100%'}}>
                                    <Form>
                                        <Item stackedLabel>
                                            <Label>Select Date</Label>
                                            <Row style={{width:'100%',marginTop:'1%'}}>
                                                <Icon style={{ marginRight:'15%' }} name='calendar' size={20} color='#000' />
                                                <TouchableOpacity onPress={this._showDatePicker}>
                                                        <Text>{this.state.selectedDate}</Text>
                                                </TouchableOpacity>
                                            </Row>
                                        </Item>
                                    </Form>
                                </Row>
                                

                                <DateTimePicker
                                    isVisible={this.state.isDatePickerVisible}
                                    onConfirm={this._handleDatePicked}
                                    onCancel={this._hideDatePicker}
                                    mode={'date'}
                                />

                                <DateTimePicker
                                    isVisible={this.state.isTimePickerVisible}
                                    onConfirm={this._handleTimePicked}
                                    onCancel={this._hideTimePicker}
                                    mode={'time'}
                                />

                </ScrollView>
                        </View>
                    </View>
                )}


                </View>
            </Root>

        );
    }
}

const styles = {
    linearGradient: {
        width: '100%',
        height: 85
    }
};