import React, { Component } from 'react';
import { TouchableHighlight } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Picker, Content, ListItem, Container, CheckBox, Body, Toast, Root, List, Left, Right } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from 'react-navigation';
import { NavigationBar, Title, Switch, TextInput, View, Row, Text, Subtitle, Divider, Caption, Button } from '@shoutem/ui';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class EventCreated extends Component {


    constructor(props) {
        super(props);
        this.state = {
            selectedDate:JSON.stringify(this.props.navigation.getParam('selectDate')),
            selectedTime:JSON.stringify(this.props.navigation.getParam('selectedTime')),
            duration:JSON.stringify(this.props.navigation.getParam('duration')),
            type:JSON.stringify(this.props.navigation.getParam('type')),
            publicEvent:JSON.stringify(this.props.navigation.getParam('publicEvent')),
            eventName:JSON.stringify(this.props.navigation.getParam('eventName')),
            arriveTime:JSON.stringify(this.props.navigation.getParam('arriveTime')),
            coachAttendanceStatus:JSON.stringify(this.props.navigation.getParam('coachAttendanceStatus')),
            playerAttendanceStatus: JSON.stringify(this.props.navigation.getParam('playerAttendanceStatus')),
            parentAttendanceStatus: JSON.stringify(this.props.navigation.getParam('parentAttendanceStatus')),
            eventNotes: JSON.stringify(this.props.navigation.getParam('eventNotes')),
            defaultReminder: JSON.stringify(this.props.navigation.getParam('defaultReminder')),
            teams: JSON.stringify(this.props.navigation.getParam('teams'))
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        Toast.show({
            text: "Event Created Successfully",
            buttonText: "Okay",
            duration: 3000
        })
    }



    render() {
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
                            rightComponent={
                                <TouchableHighlight style={{ marginRight: '13%' }} onPress={() => {
                                    this.props.navigation.dispatch(StackActions.pop({
                                        n:2,
                                    }));
                                }}>
                                    <Subtitle>
                                        Next
                        </Subtitle>
                                </TouchableHighlight>
                            }
                        />
                    </LinearGradient>
                    <Container style={{ marginTop: '-4%' }}>
                        <Content>
                            <List>
                                <ListItem style={{ backgroundColor: '#fafafa', flexDirection: 'column', }}>
                                    <Subtitle>Congratulations!</Subtitle>
                                    <Subtitle>Your Event is created.</Subtitle>
                                </ListItem>
                                <ListItem style={{ borderBottomColor: '#fff', marginTop: '1%' }}>
                                    <Text style={{ marginLeft: '4%' }}>Event Name</Text>
                                    <Subtitle style={{ marginLeft: '4%', }}>{JSON.stringify(this.props.navigation.getParam('eventName'))}</Subtitle>
                                </ListItem>
                                <ListItem>
                                    <Text style={{ marginLeft: '4%' }}>Event Type</Text>
                                    <Subtitle style={{ marginLeft: '4%', }}>{JSON.stringify(this.props.navigation.getParam('eventType'))}</Subtitle>
                                </ListItem>
                                <ListItem>
                                    <Text style={{ marginLeft: '4%' }}>Start Date</Text>
                                    <Subtitle style={{ marginLeft: '4%', }}>{JSON.stringify(this.props.navigation.getParam('selectedDate'))}</Subtitle>
                                </ListItem>
                                <ListItem>
                                    <Text style={{ marginLeft: '4%' }}>Time</Text>
                                    <Subtitle style={{ marginLeft: '4%', }}>{JSON.stringify(this.props.navigation.getParam('selectedTime'))}</Subtitle>
                                </ListItem>
                                <ListItem>
                                    <Text style={{ marginLeft: '4%' }}>Event Notes</Text>
                                    <Subtitle style={{ marginLeft: '4%', }}>{JSON.stringify(this.props.navigation.getParam('eventNotes'))}</Subtitle>
                                </ListItem>
                                <ListItem>
                                    <Text style={{ marginLeft: '4%' }}>Teams</Text>
                                    <Subtitle style={{ marginLeft: '4%', }}>{JSON.stringify(this.props.navigation.getParam('teams'))}</Subtitle>
                                </ListItem>
                            </List>
                        </Content>
                    </Container>
                </View>
            </Root>

        );
    }
}

const styles = ({
    linearGradient: {
        width: '100%',
        height: 85
    }
});