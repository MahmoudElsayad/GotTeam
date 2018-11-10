import React, { Component } from 'react';
import { TouchableHighlight, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Picker, Container, Body, Form, Root, Item, Label, Input, Textarea, Content, ListItem, CheckBox, Text } from 'native-base';
import { StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-spinkit';
import { SearchBar } from "react-native-elements";
import { NavigationBar, Title, Image, TextInput, View, Row, Subtitle, Divider, Caption, Button } from '@shoutem/ui';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-modal-datetime-picker';
import renderIf from '../../renderIf';
import { BackHandler } from 'react-native';





export default class EditTeamInfo extends Component {


    constructor(props) {
        super(props);
        this.state = {
            teamName: '',
            type:'',
            isStartDatePickerVisible: false,
            isEndDatePickerVisible: false,
            selectedStartDate: '01/01/2018',
            selectedEndDate: '01/01/2018',
            selectedTime: '11:00 AM',
            organization: '',
            url: '',
            autoAccept: false,
            teamWithParents: false,
            loading: false
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack(); // works best when the goBack is async
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    goBack = () => {
        console.log('called');

        this.props.navigation.dispatch(StackActions.pop({
            n: 1,
        }));
    }

    componentDidMount() {

        var name = JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '');

        firebase.firestore().collection("teams").where('info.name', '==', name)
            .get()
            .then((e) => {
                var tempDoc = e.docs[0].data();
                this.setState({
                    teamName: tempDoc.info.name,
                    type: tempDoc.info.type,
                    autoAccept: tempDoc.info.autoAccept,
                    organization: tempDoc.info.organization,
                    teamWithParents: tempDoc.info.teamWithParents
                })
                console.log(this.state.type);
                
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
        // firebase.firestore().collection("teams").where('info.name', '==', name)
        //     .get()
        //     .then((e) => {
        //         var tempDoc = e.docs[0].data();
        //         console.log(tempDoc);
        //         tempDoc.info.organization = 'Temp Organization'
        //         console.log(tempDoc);
                
                
        //     })
        //     .catch(function (error) {
        //         console.log("Error getting documents: ", error);
        //     });

    }
    loader = () => {
        this.setState({ loading: true });
    }

    commitChanges = () => {

        this.loader();

        var name = JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '');

        firebase.firestore().collection("teams").doc(name).get()
            .then((doc) => {
                var data = doc.data();
                data.info.name =  this.state.teamName;
                data.info.type = this.state.type;
                data.info.organization = this.state.organization;
                data.info.autoAccept = this.state.autoAccept;
                data.info.teamWithParents = this.state.teamWithParents;
                data.info.website = this.state.url;
                console.log(data);
                

                firebase.firestore().collection('teams').doc(data.info.name)
                    .set(data)
                    .then(() => {
                        console.log(name);
                        
                    firebase.firestore().collection('teams').doc(name).delete();

                        this.props.navigation.dispatch(StackActions.pop({
                            n: 4,
                        }));
                    })  
                    .catch((e) => {
                        console.log(e);
                    })
            })

            // .then((e) => {
            //     var tempDoc = e.docs[0].data();
            //     this.setState({
            //         type: tempDoc.info.type,
            //         autoAccept: tempDoc.info.autoAccept,
            //         organization: tempDoc.info.organization,
            //         teamWithParents: tempDoc.info.teamWithParents
            //     })
            //     console.log(this.state.type);

            // })
            // .catch(function (error) {
            //     console.log("Error getting documents: ", error);
            // });

    }

    _showStartDatePicker = () => this.setState({ isStartDatePickerVisible: true });

    _hideStartDatePicker = () => this.setState({ isStartDatePickerVisible: false });

    _handleStartDatePicked = (date) => {
        this.setState({
            selectedStartDate: date.toString().substring(0, 15)
        });
        this._hideStartDatePicker();
    };

    _showEndDatePicker = () => this.setState({ isEndDatePickerVisible: true });

    _hideEndDatePicker = () => this.setState({ isEndDatePickerVisible: false });

    _handleEndDatePicked = (date) => {
        this.setState({
            selectedEndDate: date.toString().substring(0, 15)
        });
        this._hideEndDatePicker();
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
                                        teamName: JSON.stringify(this.props.navigation.getParam('teamName')).replace(/['"]+/g, '')})} name="long-arrow-left" size={20} style={{ marginLeft: '15%' }} color='#fff' />
                                    {/* <Text style={{marginLeft:'1%'}}>Back</Text> */}
                                </TouchableOpacity>
                            }
                            centerComponent={<Title style={{ fontSize: 18, paddingTop: 3 }}>Edit Team Info</Title>}
                            
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
                                            <TouchableOpacity>
                                                <Image
                                                    styleName="small rounded-corners"
                                                    style={{ borderRadius: 150, width: 200, height: 200, marginLeft: '20%' }}
                                                    source={{ uri: 'http://via.placeholder.com/640x360' }}
                                                />
                                            </TouchableOpacity >
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Team Name</Label>
                                                    <Input
                                                        placeholder={"Rename your team ..."}
                                                        onChangeText={(teamName) => this.setState({ teamName })}
                                                        style={{ width: '80%' }}
                                                    />
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Label>Team Type</Label>
                                                <Picker
                                                    mode="dropdown"
                                                    iosIcon={<Icon name="arrow-down" />}
                                                    placeholder="Team Type ..."
                                                    placeholderStyle={{ color: "#bfc6ea" }}
                                                    placeholderIconColor="#007aff"
                                                    style={{ width: undefined }}
                                                    selectedValue={this.state.type}
                                                    onValueChange={(type) => this.setState({ type })}
                                                >
                                                    <Picker.Item label="⚽   Football" value="football" />
                                                    <Picker.Item label="🏀   Basketball" value="basketball" />
                                                    <Picker.Item label="🏐   Volleyball" value="volleyball" />
                                                    <Picker.Item label="🤾   Handball" value="handball" />
                                                    <Picker.Item label="Other" value="other" />
                                                </Picker>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Divider styleName="section-header">
                                        <Caption>Game Season (Optional)</Caption>
                                    </Divider>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Season Start Date</Label>
                                                    <TouchableOpacity onPress={this._showStartDatePicker}>
                                                        <Text>{this.state.selectedStartDate}</Text>
                                                    </TouchableOpacity>
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Season End Date</Label>
                                                    <TouchableOpacity onPress={this._showEndDatePicker}>
                                                        <Text>{this.state.selectedEndDate}</Text>
                                                    </TouchableOpacity>
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <ListItem>
                                            <CheckBox color='#19CFA0' onPress={() => {
                                                this.setState(prevState => ({
                                                    seasonEventsOnly: !prevState.seasonEventsOnly
                                                }))
                                            }} style={{ marginRight: '10%' }} checked={this.state.seasonEventsOnly} />
                                            <Text style={{ marginBottom: '2%' }} >Season Events Only</Text>
                                        </ListItem>
                                    </Row>

                                    <Divider styleName="section-header">
                                        <Caption>Other Information (Optional)</Caption>
                                    </Divider>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Organization Name</Label>
                                                    <Input
                                                        placeholder={"GotTeamApp Corp."}
                                                        onChangeText={(organization) => this.setState({ organization })}
                                                    />
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Team Website URL</Label>
                                                    <Input
                                                        placeholder={"www ..."}
                                                        onChangeText={(url) => this.setState({ url })}
                                                    />
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Divider styleName="section-header">
                                        <Caption>Other Information (Optional)</Caption>
                                    </Divider>

                                    <Row style={{ width: '100%' }}>
                                        <Content>
                                            <Form>
                                                <Item stackedLabel>
                                                    <Label>Auto Accept</Label>
                                                    <ListItem style={{ marginRight: '4%', width: '100%' }}>
                                                        <CheckBox color='#19CFA0' onPress={() => {
                                                            this.setState(prevState => ({
                                                                autoAccept: !prevState.autoAccept
                                                            }))
                                                        }} style={{ marginRight: '10%' }} checked={this.state.autoAccept} />
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
                                                    <Label>Team With Parents</Label>
                                                    <ListItem style={{ marginRight: '4%', width: '100%' }}>
                                                        <CheckBox color='#19CFA0' onPress={() => {
                                                            this.setState(prevState => ({
                                                                teamWithParents: !prevState.teamWithParents
                                                            }))
                                                        }} style={{ marginRight: '10%' }} checked={this.state.teamWithParents} />
                                                        <Body>
                                                            <Subtitle style={{ marginBottom: '2%' }} >Parents can also join the team.</Subtitle>
                                                        </Body>
                                                    </ListItem>
                                                </Item>
                                            </Form>
                                        </Content>
                                    </Row>

                                    <Divider styleName="line">
                                        <Caption>    </Caption>
                                    </Divider>

                                    <Row style={{ width: '100%' }}>
                                        < Button block style={{ padding: 20, width: '50%', borderRadius: 5, backgroundColor: '#19CFA0', marginLeft: '25%' }} onPress={() => this.commitChanges()}>
                                            <Text style={{ color: 'white' }}>Save</Text>
                                        </Button>
                                    </Row>
                                    <Row style={{ width: '100%', marginTop: '-5%' }}>
                                        < Button block style={{ padding: 20, width: '60%', borderRadius: 5, backgroundColor: '#19CFA0', marginLeft: '20%', marginBottom: '3%' }}>
                                            <Text style={{ color: 'white' }}>Update Team Location</Text>
                                        </Button>
                                    </Row>




                                    <DateTimePicker
                                        isVisible={this.state.isStartDatePickerVisible}
                                        onConfirm={this._handleStartDatePicked}
                                        onCancel={this._hideStartDatePicker}
                                        mode={'date'}
                                    />

                                    <DateTimePicker
                                        isVisible={this.state.isEndDatePickerVisible}
                                        onConfirm={this._handleEndDatePicked}
                                        onCancel={this._hideEndDatePicker}
                                        mode={'date'}
                                    />

                                </ScrollView>
                            </View>
                        </View>)}
                    
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
};