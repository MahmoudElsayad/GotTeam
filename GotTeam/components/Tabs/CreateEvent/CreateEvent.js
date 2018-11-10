import React, { Component } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Spinner from 'react-native-spinkit';
import { Picker, Container, Body, Form, Root, Item, Label, Input, Textarea, Content, ListItem, CheckBox, Text } from 'native-base';
import { StackActions } from 'react-navigation';
import { NavigationBar, Title, Switch, Button, View, Row, Subtitle, Divider, Caption } from '@shoutem/ui';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from './../../renderIf';
import MultiSelect from 'react-native-multiple-select';


export default class CreateEvent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            user: Object,
            createLoading: true,
            selectedDate: '01/01/2018',
            selectedTime: '11:00 AM',
            duration: 0,
            tagsSelected: [],
            isDatePickerVisible: false,
            isTimePickerVisible: false,
            suggestions: [],
            type: 'practice',
            publicEvent: false,
            eventName: '',
            arriveTime: 0,
            coachAttendanceStatus: '',
            playerAttendanceStatus: '',
            parentAttendanceStatus: '',
            eventNotes:'',
            defaultReminder:'',
            selectedItems: [],
            selected: 'Manual',
            messageBoxStyles: {
                backgroundColor: '#fff',
                color: '#000'
            },
            region: this.props.navigation.getParam('region') || '',
            manualLocation: ''
        };

        console.log(this.props.navigation.getParam('region'));
        

    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({ user: user });
            this.ref = firebase.firestore().collection('teams');
        });

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

    setTeams = (e, uid) => {
        this.teamsTemp = [];

        for (let index = 0; index < e.length; index++) {
            const element = e[index];
            if (element.data().info.adminID == uid) {
                
                this.teamsTemp.push({name: element.data().info.name});
            }
            
        }
        this.setState({
            suggestions: this.teamsTemp
        });
        console.log(this.state.suggestions);
        
        this.setState({ createLoading: false });
    }

    _showDatePicker = () => this.setState({ isDatePickerVisible: true });

    _hideDatePicker = () => this.setState({ isDatePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({
            selectedDate: date.toString().substring(0, 15)
        });
        this._hideDatePicker();
    };

    _showTimePicker = () => this.setState({ isTimePickerVisible: true });

    _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

    _handleTimePicked = (Time) => {
        this.setState({
            selectedTime: Time.toString().substring(15, 21)
        });
        this._hideTimePicker();
    };

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };

    getLocation(selected) {
        this.setState({ selected });

        if (selected == 'GPS') {
            this.props.navigation.navigate('LocationPage', {
                teamName: '',
                type: '',
                organization: '',
                selected: '',
                age: '',
                terms: '',
                autoAccept: '',
                teamWithParents: ''
            });
        }

    }

    createEvent = () => {
        
        this.setState({ createLoading: true });
        var user = firebase.auth().currentUser;
        firebase.firestore().collection('events').doc(this.state.eventName).set({
                owner: user.uid,
                selectedDate: this.state.selectedDate,
                selectedTime: this.state.selectedTime,
                duration: this.state.duration,
                type: this.state.type,
                publicEvent: this.state.publicEvent,
                eventName: this.state.eventName,
                arriveTime: this.state.arriveTime,
                coachAttendanceStatus: this.state.coachAttendanceStatus,
                playerAttendanceStatus: this.state.playerAttendanceStatus,
                parentAttendanceStatus: this.state.parentAttendanceStatus,
                eventNotes: this.state.eventNotes,
                defaultReminder: this.state.defaultReminder,
                teams:this.state.selectedItems,
                region: this.props.navigation.getParam('region') || '',
                manualLocation: this.state.manualLocation
               }).then(() => {
                   this.props.navigation.navigate('EventCreated', {
                       selectedDate: this.state.selectedDate,
                       selectedTime: this.state.selectedTime,
                       duration: this.state.duration,
                       type: this.state.type,
                       publicEvent: this.state.publicEvent,
                       eventName: this.state.eventName,
                       arriveTime: this.state.arriveTime,
                       coachAttendanceStatus: this.state.coachAttendanceStatus,
                       playerAttendanceStatus: this.state.playerAttendanceStatus,
                       parentAttendanceStatus: this.state.parentAttendanceStatus,
                       eventNotes: this.state.eventNotes,
                       defaultReminder: this.state.defaultReminder,
                       teams: this.state.selectedItems,
                       region: this.props.navigation.getParam('region') || '',
                       manualLocation: this.state.manualLocation
                   })
                }).catch((error) => {
                    this.setState({ createLoading: false });
                    alert(error);
                })
            }


    render() {
        const popAction = StackActions.pop({
            n: 1,
        });
        const uri = 'https://images.unsplash.com/photo-1537351967534-3e91fc90121d?ixlib=rb-0.3.5&s=1fcdb0c9a4cebb0f7cdfb4e099e7a4c6&auto=format&fit=crop&w=400&q=80';
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
                            <Icon onPress={() => this.props.navigation.dispatch(popAction)} name="long-arrow-left" size={20} style={{marginLeft:'8%'}} color='#fff'/>
                        </TouchableOpacity>
                }
                centerComponent={<Title style={{fontSize: 20, paddingTop: 3,}}>Create Event</Title>}
                rightComponent={
                    <TouchableOpacity style={{ marginRight: '13%' }} onPress={() => this.createEvent()}>
                        <Subtitle>
                            Create
                        </Subtitle>
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
                            marginBottom: 50}} size={40} type={'9CubeGrid'} color={'#19CFA0'} />
                    )}
                    {renderIf((this.state.createLoading == false),
                        <View styleName="fill-parent" style={{ marginTop: '15%', backgroundColor:'#fff' }}>
                            <View styleName="vertical h-start">
                            <ScrollView style={{ marginTop: '1%', width: '100%', height: '110%' }}>

                                    <Row style={{ width: '100%' }}>
                                        <View style={{ marginLeft:'2%', marginTop:'3%', marginRight:'2%'}}>
                                            <MultiSelect
                                                hideTags
                                                items={this.state.suggestions}
                                                uniqueKey="name"
                                                ref={(component) => { this.multiSelect = component }}
                                                onSelectedItemsChange={this.onSelectedItemsChange}
                                                selectedItems={this.state.selectedItems}
                                                selectText="Select Teams"
                                                searchInputPlaceholderText="Search Teams..."
                                                onChangeInput={(text) => console.log(text)}
                                                altFontFamily="ProximaNova-Light"
                                                tagRemoveIconColor="#19CFA0"
                                                tagBorderColor="#CCC"
                                                tagTextColor="#CCC"
                                                selectedItemTextColor="#CCC"
                                                selectedItemIconColor="#19CFA0"
                                                itemTextColor="#000"
                                                displayKey="name"
                                                searchInputStyle={{ color: '#CCC' }}
                                                submitButtonColor="#19CFA0"
                                                submitButtonText="Submit"
                                            />
                                        </View>
                                    </Row>

                                    
                                    {/* <View>
                                        {this.multiSelect.getSelectedItemsExt(this.state.selectedItems)}
                                    </View> */}


                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Date</Label>
                                                    <TouchableOpacity onPress={this._showDatePicker}>
                                                        <Text>{this.state.selectedDate}</Text>
                                                    </TouchableOpacity>
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Time</Label>
                                                    <TouchableOpacity onPress={this._showTimePicker}>
                                                        <Text>{this.state.selectedTime}</Text>
                                                    </TouchableOpacity>
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Duration (Optional) </Label>
                                                    <Input
                                                        placeholder={"00 Hr"}
                                                        onChangeText={(duration) => this.setState({ duration })}
                                                    />
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Event Name</Label>
                                                    <Input
                                                        placeholder={"Set event name"}
                                                        onChangeText={(eventName) => this.setState({ eventName })}
                                                    />
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Label>Event Type</Label>
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    placeholder="Event Type ..."
                                                    placeholderStyle={{ color: "#bfc6ea" }}
                                                    placeholderIconColor="#007aff"
                                                    style={{ width: undefined }}
                                                    selectedValue={this.state.type}
                                                    onValueChange={(type) => this.setState({ type })}
                                                >
                                                    <Picker.Item label="Practice" value="practice" />
                                                    <Picker.Item label="Home Game" value="homeGame" />
                                                    <Picker.Item label="Away Game" value="awayGame" />
                                                    <Picker.Item label="School Event" value="schoolEvent" />
                                                    <Picker.Item label="Meeting" value="meeting" />
                                                    <Picker.Item label="Field Trip" value="fieldTrip" />
                                                    <Picker.Item label="Fundraiser" value="fundraiser" />
                                                    <Picker.Item label="Other" value="other" />
                                                </Picker>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Public Event</Label>
                                                    <ListItem style={{ marginRight: '4%', width: '100%' }}>
                                                        <CheckBox color='#19CFA0' onPress={() => {
                                                            this.setState(prevState => ({
                                                                publicEvent: !prevState.publicEvent
                                                            }))
                                                        }} style={{ marginRight: '10%' }} checked={this.state.publicEvent} />
                                                        <Body>
                                                            <Subtitle style={{ marginBottom: '2%' }} >Members will not require admin approval to join.</Subtitle>
                                                        </Body>
                                                    </ListItem>
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Event Location</Label>
                                                    <ListItem style={{ marginRight: '4%', width: '100%' }}>
                                                        <Picker
                                                            mode="dropdown"
                                                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                                                            placeholder="Select your SIM"
                                                            placeholderStyle={{ color: "#bfc6ea" }}
                                                            placeholderIconColor="#19CFA0"
                                                            style={{ width: undefined }}
                                                            selectedValue={this.state.selected}
                                                            onValueChange={(selected) => { this.getLocation(selected) }}
                                                        >
                                                            <Picker.Item label="GPS" value="GPS" />
                                                            <Picker.Item label="Manual" value="Manual" />
                                                        </Picker>
                                                        <Body>
                                                            {renderIf(this.state.selected == 'Manual',
                                                                <View style={{ marginleft: '5%' }}>
                                                                    <Label>Manual Location </Label>
                                                                    <Input
                                                                        placeholder={"City, Street number ..."}
                                                                        onChangeText={(manualLocation) => this.setState({ manualLocation })}
                                                                    />
                                                                </View>
                                                            )}
                                                        </Body>
                                                    </ListItem>
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Arrive Time (Minutes Early) - (Optional) </Label>
                                                    <Input
                                                        placeholder={"Arrive time in minutes"}
                                                        onChangeText={(arriveTime) => this.setState({ arriveTime })}
                                                    />
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Label>Set Attendance Status (Optional)</Label>
                                                <View style={{ flexDirection:'row'}}>
                                                <Text style={{ marginTop:'4%', marginRight:'50%'}}>
                                                    Coach
                                                </Text>
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    placeholder="Coach ..."
                                                    placeholderStyle={{ color: "#bfc6ea" }}
                                                    placeholderIconColor="#007aff"
                                                    style={{ width: undefined }}
                                                    selectedValue={this.state.coachAttendanceStatus}
                                                    onValueChange={(coachAttendanceStatus) => this.setState({ coachAttendanceStatus })}
                                                    >
                                                    <Picker.Item label="Yes" value="yes" />
                                                    <Picker.Item label="Maybe" value="maybe" />
                                                    <Picker.Item label="No" value="no" />
                                                    <Picker.Item label="None" value="none" />
                                                </Picker>
                                                </View>
                                                <View style={{ flexDirection:'row'}}>
                                                <Text style={{ marginTop:'4%', marginRight:'50%'}}>
                                                    Player
                                                </Text>
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    placeholder="Player ..."
                                                    placeholderStyle={{ color: "#bfc6ea" }}
                                                    placeholderIconColor="#007aff"
                                                    style={{ width: undefined }}
                                                    selectedValue={this.state.playerAttendanceStatus}
                                                    onValueChange={(playerAttendanceStatus) => this.setState({ playerAttendanceStatus })}
                                                    >
                                                    <Picker.Item label="Yes" value="yes" />
                                                    <Picker.Item label="Maybe" value="maybe" />
                                                    <Picker.Item label="No" value="no" />
                                                    <Picker.Item label="None" value="none" />
                                                </Picker>
                                                </View>
                                                <View style={{ flexDirection:'row'}}>
                                                <Text style={{ marginTop:'4%', marginRight:'50%'}}>
                                                    Parent
                                                </Text>
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    placeholder="Parent ..."
                                                    placeholderStyle={{ color: "#bfc6ea" }}
                                                    placeholderIconColor="#007aff"
                                                    style={{ width: undefined }}
                                                    selectedValue={this.state.parentAttendanceStatus}
                                                    onValueChange={(parentAttendanceStatus) => this.setState({ parentAttendanceStatus })}
                                                    >
                                                    <Picker.Item label="Yes" value="yes" />
                                                    <Picker.Item label="Maybe" value="maybe" />
                                                    <Picker.Item label="No" value="no" />
                                                    <Picker.Item label="None" value="none" />
                                                </Picker>
                                                </View>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Label style={{ marginBottom: '1%' }}>Event Notes (Optional)</Label>
                                                <Textarea style={{ backgroundColor: this.state.messageBoxStyles.backgroundColor, color: this.state.messageBoxStyles.color }} rowSpan={5}
                                                    onValueChange={(eventNotes) => this.setState({ eventNotes })}
                                                    underlineColorAndroid="transparent"
                                                    bordered placeholder="Add details ..." />
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Label>Default Reminder</Label>
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    placeholder="Default Reminder ..."
                                                    placeholderStyle={{ color: "#bfc6ea" }}
                                                    placeholderIconColor="#007aff"
                                                    style={{ width: undefined }}
                                                    selectedValue={this.state.defaultReminder}
                                                    onValueChange={(defaultReminder) => this.setState({ defaultReminder })}
                                                >
                                                    <Picker.Item label="OFF" value="off" />
                                                    <Picker.Item label="1 days before" value="1daysbefore" />
                                                    <Picker.Item label="2 days before" value="2daysbefore" />
                                                    <Picker.Item label="3 days before" value="3daysbefore" />
                                                    <Picker.Item label="4 days before" value="4daysbefore" />
                                                    <Picker.Item label="5 days before" value="5daysbefore" />
                                                    <Picker.Item label="6 days before" value="6daysbefore" />
                                                    <Picker.Item label="7 days before" value="7daysbefore" />
                                                    <Picker.Item label="8 days before" value="8daysbefore" />
                                                    <Picker.Item label="9 days before" value="9daysbefore" />
                                                    <Picker.Item label="10 days before" value="10daysbefore" />
                                                </Picker>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%', marginBottom:'2%' }}>
                                        < Button block style={{ padding: 20, width: '50%', borderRadius: 5, backgroundColor: '#19CFA0', marginLeft: '25%' }} onPress={() => this.createEvent()}>
                                            <Text style={{ color: 'white' }}>Create</Text>
                                        </Button>
                                    </Row>

                            </ScrollView>
                            </View>
                        </View>

                    )}

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

            </View>
            
        );
    }
}

const styles = {
    linearGradient: {
        width: '100%',
        height: 85
    },
    autocompleteContainer: {
        left: 0,
        position: 'absolute',
        right: 0,
        top: '4%',
        zIndex: 1,
    }
};
