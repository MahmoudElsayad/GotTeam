import React, { Component } from 'react';
import { TouchableHighlight, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Picker, Container, Body, Form, Root, Item, Label, Input, Textarea, Content, ListItem, CheckBox, Text } from 'native-base';
import Spinner from 'react-native-spinkit';
import { StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { SearchBar } from "react-native-elements";
import { NavigationBar, Title, Image, Switch, View, Row, Subtitle, Divider, Caption, Button } from '@shoutem/ui';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-modal-datetime-picker';
import renderIf from '../../renderIf';




export default class Notifications extends Component {


    constructor(props) {
        super(props);
        this.state = {
            teamName: '',
            eventReminderMobile: false,
            eventChangesMobile: false,
            carpoolSignupMobile: false,
            liveCoverageMobile: false,
            gameRemindersMobile: false,
            gameChangesMobile: false,
            gameScoreAddedMobile: false,
            photoVideoMobile: false,
            teamSurveysMobile: false,
            teamMessageMobile: false,
            memberMessageMobile: false,
            eventReminderEmail: false,
            eventChangesEmail: false,
            carpoolSignupEmail: false,
            liveCoverageEmail: false,
            gameRemindersEmail: false,
            gameChangesEmail: false,
            gameScoreAddedEmail: false,
            photoVideoEmail: false,
            teamSurveysEmail: false,
            teamMessageEmail: false,
            memberMessageEmail: false,
            allMobile: false,
            allEmail: false,
            reminderTime: '',
            isStartDatePickerVisible: false,
            selectedStartDate: '01/01/2018',
            loading: false
        };
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        this.loader();        
    }

    loader = () => {
        this.setState({ loading: true });
    }

    componentDidMount() {

        var name = JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '');

        firebase.firestore().collection("teams").doc(name).get()
            .then((doc) => {
                console.log(doc.data().notifications);
                
                if (doc.data().notifications) {
                    this.setState({
                        eventReminderMobile: doc.data().notifications.eventReminderMobile,
                        eventChangesMobile: doc.data().notifications.eventChangesMobile,
                        carpoolSignupMobile: doc.data().notifications.carpoolSignupMobile,
                        liveCoverageMobile: doc.data().notifications.liveCoverageMobile,
                        gameRemindersMobile: doc.data().notifications.gameRemindersMobile,
                        gameChangesMobile: doc.data().notifications.gameChangesMobile,
                        gameScoreAddedMobile: doc.data().notifications.gameScoreAddedMobile,
                        photoVideoMobile: doc.data().notifications.photoVideoMobile,
                        teamSurveysMobile: doc.data().notifications.teamSurveysMobile,
                        teamMessageMobile: doc.data().notifications.teamMessageMobile,
                        memberMessageMobile: doc.data().notifications.memberMessageMobile,
                        eventReminderEmail: doc.data().notifications.eventReminderEmail,
                        eventChangesEmail: doc.data().notifications.eventChangesEmail,
                        carpoolSignupEmail: doc.data().notifications.carpoolSignupEmail,
                        liveCoverageEmail: doc.data().notifications.liveCoverageEmail,
                        gameRemindersEmail: doc.data().notifications.gameRemindersEmail,
                        gameChangesEmail: doc.data().notifications.gameChangesEmail,
                        gameScoreAddedEmail: doc.data().notifications.gameScoreAddedEmail,
                        photoVideoEmail: doc.data().notifications.photoVideoEmail,
                        teamSurveysEmail: doc.data().notifications.teamSurveysEmail,
                        teamMessageEmail: doc.data().notifications.teamMessageEmail,
                        memberMessageEmail: doc.data().notifications.memberMessageEmail,
                        reminderTime: doc.data().notifications.reminderTime
                    })
                }

                this.setState({ loading: false });

            }).catch((error) => {
                console.log(error);
                
            })

    }

    commitChanges = () => {

        this.loader();

        var name = JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '');

        firebase.firestore().collection("teams").doc(name)
            .update({
                'notifications.eventReminderMobile' : this.state.eventReminderMobile,
                'notifications.eventChangesMobile' : this.state.eventChangesMobile,
                'notifications.carpoolSignupMobile' : this.state.carpoolSignupMobile,
                'notifications.liveCoverageMobile' : this.state.liveCoverageMobile,
                'notifications.gameRemindersMobile' : this.state.gameRemindersMobile,
                'notifications.gameChangesMobile' : this.state.gameChangesMobile,
                'notifications.gameScoreAddedMobile' : this.state.gameScoreAddedMobile,
                'notifications.photoVideoMobile' : this.state.photoVideoMobile,
                'notifications.teamSurveysMobile' : this.state.teamSurveysMobile,
                'notifications.teamMessageMobile' : this.state.teamMessageMobile,
                'notifications.memberMessageMobile' : this.state.memberMessageMobile,
                'notifications.eventReminderEmail' : this.state.eventReminderEmail,
                'notifications.eventChangesEmail' : this.state.eventChangesEmail,
                'notifications.carpoolSignupEmail' : this.state.carpoolSignupEmail,
                'notifications.liveCoverageEmail' : this.state.liveCoverageEmail,
                'notifications.gameRemindersEmail' : this.state.gameRemindersEmail,
                'notifications.gameChangesEmail' : this.state.gameChangesEmail,
                'notifications.gameScoreAddedEmail' : this.state.gameScoreAddedEmail,
                'notifications.photoVideoEmail' : this.state.photoVideoEmail,
                'notifications.teamSurveysEmail' : this.state.teamSurveysEmail,
                'notifications.teamMessageEmail' : this.state.teamMessageEmail,
                'notifications.memberMessageEmail' : this.state.memberMessageEmail,
                'notifications.reminderTime': this.state.reminderTime,
            }).then(()=> {
                this.props.navigation.dispatch(StackActions.pop({
                    n: 5,
                }));
            }).catch((error) => {
                console.log(error);
                
            })

    }

    _showStartDatePicker = () => this.setState({ isStartDatePickerVisible: true });

    _hideStartDatePicker = () => this.setState({ isStartDatePickerVisible: false });

    _handleStartDatePicked = (date) => {
        this.setState({
            selectedStartDate: date.toString().substring(0, 15)
        });
        this._hideStartDatePicker();
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

    allMobile = () => {

        this.setState(prevState => ({
            allMobile: !prevState.allMobile
        }))

        console.log(this.state.allMobile);
        

        if (this.state.allMobile == false) {
            this.setState({
                eventReminderMobile: true,
                eventChangesMobile: true,
                carpoolSignupMobile: true,
                liveCoverageMobile: true,
                gameRemindersMobile: true,
                gameChangesMobile: true,
                gameScoreAddedMobile: true,
                photoVideoMobile: true,
                teamSurveysMobile: true,
                teamMessageMobile: true,
                memberMessageMobile: true
            })
        }

        if (this.state.allMobile == true) {
            this.setState({
                eventReminderMobile: false,
                eventChangesMobile: false,
                carpoolSignupMobile: false,
                liveCoverageMobile: false,
                gameRemindersMobile: false,
                gameChangesMobile: false,
                gameScoreAddedMobile: false,
                photoVideoMobile: false,
                teamSurveysMobile: false,
                teamMessageMobile: false,
                memberMessageMobile: false,
            })
        }

    }

    allEmail = () => {

        this.setState(prevState => ({
            allEmail: !prevState.allEmail
        }))

        if (this.state.allEmail == false) {
            this.setState({
                eventReminderEmail: true,
                eventChangesEmail: true,
                carpoolSignupEmail: true,
                liveCoverageEmail: true,
                gameRemindersEmail: true,
                gameChangesEmail: true,
                gameScoreAddedEmail: true,
                photoVideoEmail: true,
                teamSurveysEmail: true,
                teamMessageEmail: true,
                memberMessageEmail: true,
            })
        }

        if (this.state.allEmail == true) {
            this.setState({
                eventReminderEmail: false,
                eventChangesEmail: false,
                carpoolSignupEmail: false,
                liveCoverageEmail: false,
                gameRemindersEmail: false,
                gameChangesEmail: false,
                gameScoreAddedEmail: false,
                photoVideoEmail: false,
                teamSurveysEmail: false,
                teamMessageEmail: false,
                memberMessageEmail: false,
            })
        }
    }


    render() {
        const popAction = StackActions.pop({
            n: 1,
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
                                    <Icon onPress={() => this.props.navigation.dispatch(popAction, {
                                        teamName: JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '')
                                    })} name="long-arrow-left" size={20} style={{ marginLeft: '15%' }} color='#fff' />
                                    {/* <Text style={{marginLeft:'1%'}}>Back</Text> */}
                                </TouchableOpacity>
                            }
                            centerComponent={<Title style={{ fontSize: 18, paddingTop: 3 }}>Notifications</Title>}

                            rightComponent={
                                <TouchableOpacity style={{ marginRight: '15%' }} onPress={() =>
                                    this.commitChanges()}>
                                    <Icon name='save' size={20} color='#fff' />
                                </TouchableOpacity>
                            }
                        />
                    </LinearGradient>

                    {renderIf(this.state.loading,
                        <View styleName='fill-parent' style={{ alignContent: 'center' }}>
                            <Spinner style={styles.spinner} size={40} type={'9CubeGrid'} color={'#19CFA0'} />
                        </View>
                    )}

                    {renderIf(this.state.loading == false,
                        <View styleName="fill-parent" style={{ marginTop: '15%' }}>
                            <View styleName="vertical h-start">
                                <ScrollView style={{ marginTop: '1%', width: '100%', height: '110%' }}>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Notifications</Label>
                                                    <TouchableOpacity onPress={this._showStartDatePicker}>
                                                        <Text style={{ color: '#19CFA0' }}>{this.state.selectedStartDate}</Text>
                                                    </TouchableOpacity>
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <View styleName="horizontal" style={{ marginLeft: '63%', marginBottom: '-4%', }}>
                                            <Text style={{ color: '#19CFA0' }}>Mobile</Text>
                                            <Text style={{ color: '#19CFA0', marginLeft: '30%' }}>Email</Text>
                                        </View>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Toggle All</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <CheckBox color='#19CFA0' onPress={() => {
                                                this.allMobile()
                                            }} checked={this.state.allMobile} />
                                            <CheckBox color='#19CFA0' onPress={() => {
                                                this.allEmail()
                                            }} style={{ marginLeft: '45%' }} checked={this.state.allEmail} />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Event Reminders</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ eventReminderMobile: value })}
                                                value={this.state.eventReminderMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ eventReminderEmail: value })}
                                                value={this.state.eventReminderEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Event Changes</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ eventChangesMobile: value })}
                                                value={this.state.eventChangesMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ eventChangesEmail: value })}
                                                value={this.state.eventChangesEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Carpool Signup</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ carpoolSignupMobile: value })}
                                                value={this.state.carpoolSignupMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ carpoolSignupEmail: value })}
                                                value={this.state.carpoolSignupEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Live Coverage</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ liveCoverageMobile: value })}
                                                value={this.state.liveCoverageMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ liveCoverageEmail: value })}
                                                value={this.state.liveCoverageEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Game Reminders</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ gameRemindersMobile: value })}
                                                value={this.state.gameRemindersMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ gameRemindersEmail: value })}
                                                value={this.state.gameRemindersEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Game Changes</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ gameChangesMobile: value })}
                                                value={this.state.gameChangesMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ gameChangesEmail: value })}
                                                value={this.state.gameChangesEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Game Score Added</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ gameScoreAddedMobile: value })}
                                                value={this.state.gameScoreAddedMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ gameScoreAddedEmail: value })}
                                                value={this.state.gameScoreAddedEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Photo and Video</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ photoVideoMobile: value })}
                                                value={this.state.photoVideoMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ photoVideoEmail: value })}
                                                value={this.state.photoVideoEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Team Surveys</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ teamSurveysMobile: value })}
                                                value={this.state.teamSurveysMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ teamSurveysEmail: value })}
                                                value={this.state.teamSurveysEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Team Message</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ teamMessageMobile: value })}
                                                value={this.state.teamMessageMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ teamMessageEmail: value })}
                                                value={this.state.teamMessageEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Text style={{ width: '50%' }}>Member Message</Text>
                                        <View styleName="horizontal" style={{ marginLeft: '15%' }}>
                                            <Switch
                                                onValueChange={value => this.setState({ memberMessageMobile: value })}
                                                value={this.state.memberMessageMobile}
                                            />
                                            <Switch
                                                onValueChange={value => this.setState({ memberMessageEmail: value })}
                                                value={this.state.memberMessageEmail}
                                                style={styles.switch}
                                            />
                                        </View>
                                    </Row>


                                    <DateTimePicker
                                        isVisible={this.state.isStartDatePickerVisible}
                                        onConfirm={this._handleStartDatePicked}
                                        onCancel={this._hideStartDatePicker}
                                        mode={'date'}
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
    },

    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 50
    },
    switch: {
        container: {
            marginLeft:'50%'
        }
    }
};