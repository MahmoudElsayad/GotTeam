import React, { Component } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Spinner from 'react-native-spinkit';
import { Picker, Content, ListItem, CheckBox, Body, Toast, Root } from 'native-base';
import { StackActions } from 'react-navigation';
import { NavigationBar, Title, Switch, TextInput, View, Row, Text, Subtitle, Divider, Caption } from '@shoutem/ui';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import TeamCreated from './../TeamCreated/TeamCreated';
import renderIf from './../../renderIf';



export default class CreateTeam extends Component {


    constructor(props) {
        super(props);
        this.state = {
            teamName: JSON.stringify(this.props.navigation.getParam('teamName')),
            type: JSON.stringify(this.props.navigation.getParam('type')),
            organization: JSON.stringify(this.props.navigation.getParam('organization')),
            user: Object,
            selected: JSON.stringify(this.props.navigation.getParam('selected')),
            age: this.props.navigation.getParam('age'), //false
            terms: this.props.navigation.getParam('terms'), //false
            createLoading: false,
            autoAccept: this.props.navigation.getParam('autoAccept'), // false
            teamWithParents: this.props.navigation.getParam('teamWithParents'), //false
            region: this.props.navigation.getParam('region')
        };

        console.log(props);
        
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({ user: user });
            this.ref = firebase.firestore().collection('teams');
        });
    };

    createTeam = () => {
        this.setState({createLoading: true});
        if (this.state.age == true ) {
            if (this.state.terms == false) {
                this.setState({ createLoading: false });
                alert('Please make sure to accept terms & conditions.');
            } else {
                this.ref.doc(this.state.teamName).set({
                    info: {
                        name: this.state.teamName,
                        organization: this.state.organization,
                        type: this.state.type,
                        autoAccept: this.state.autoAccept,
                        teamWithParents: this.state.teamWithParents,
                        adminID: this.state.user.uid,
                        location: this.state.region
                    }
                }).then(() => {
                    this.props.navigation.navigate('TeamCreated', { teamName: this.state.teamName, teamCode: 'ADASFA' })
                }).catch((error) => {
                    this.setState({ createLoading: false });
                    alert(error);
                })
            }
        } else {
            this.setState({ createLoading:false});
            alert('You should be 13 or Older in order to create a team.');
        }
        
    }

    getLocation(selected) {
       this.setState({ selected });
        console.log(selected);
        
       if (selected == 'Manual') {
           this.props.navigation.navigate('LocationPage', {
               teamName: this.state.teamName,
               type: this.state.type,
               organization: this.state.organization,
               selected: this.state.selected,
               age: this.state.age,
               terms: this.state.terms,
               autoAccept: this.state.autoAccept,
               teamWithParents: this.state.teamWithParents });
       }

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
                centerComponent={<Title style={{fontSize: 20, paddingTop: 3,}}>Create Team</Title>}
                rightComponent={
                    <TouchableOpacity style={{marginRight:'13%'}} onPress={this.createTeam}>
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
                        <View styleName="fill-parent" style={{ marginTop: '15%' }}>
                            <View styleName="vertical h-start">
                                <ScrollView style={{ marginTop: '1%', width: '100%', height: '110%' }}>

                                <Row style={{ width: '100%' }}>
                                    <View>
                                        <TouchableOpacity>
                                            <Icon name="plus-square" size={90} color="#000" style={{ alignSelf: 'center' }} />
                                        </TouchableOpacity>
                                        <Text style={{ alignSelf: 'center', marginTop: '2%' }}>Add Image</Text>
                                    </View>
                                    <View styleName="vertical stretch" style={{ flex: 1.5 }}>
                                        <Subtitle>Team Name</Subtitle>
                                        <TextInput
                                            placeholder={'Type here ...'}
                                            onChangeText={(teamName) => this.setState({ teamName })}
                                        />
                                        <Subtitle>Team Type</Subtitle>
                                        <Picker
                                            mode="dropdown"
                                            iosIcon={<Icon name="ios-arrow-down-outline" />}
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
                                    </View>
                                </Row>

                                <Divider styleName="section-header">
                                    <Caption>Set Team Location</Caption>
                                </Divider>

                                <Row style={{ width: '100%' }}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        placeholder="Select your SIM"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        style={{ width: undefined }}
                                        selectedValue={this.state.selected}
                                        onValueChange={(selected) => { this.getLocation(selected) }}
                                    >
                                        <Picker.Item label="GPS" value="GPS" />
                                        <Picker.Item label="Manual" value="Manual" />
                                    </Picker>
                                </Row>
                                {renderIf(this.state.selected == 'GPS',
                                    <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Caption>Latitude: {this.state.region.latitude}</Caption>
                                        <Caption>Longitude: {this.state.region.longitude}</Caption>
                                        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
                                    </View>
                                )}

                                <Divider styleName="section-header">
                                    <Caption>Member Enrollment Rules</Caption>
                                </Divider>

                                <Row style={{ width: '100%' }}>
                                    <Content>
                                        <ListItem>
                                                <CheckBox color='#19CFA0' onPress={() => {
                                                this.setState(prevState => ({
                                                    autoAccept: !prevState.autoAccept
                                                }))
                                            }} style={{ marginRight: '10%' }} checked={this.state.autoAccept} />
                                            <Body>
                                                <Subtitle style={{ marginBottom: '2%' }} >Auto Accept</Subtitle>
                                                <Text>Member will not require Admin approval to join</Text>
                                            </Body>
                                        </ListItem>
                                        <ListItem>
                                                <CheckBox color='#19CFA0' onPress={() => {
                                                this.setState(prevState => ({
                                                    teamWithParents: !prevState.teamWithParents
                                                })) }} style={{ marginRight: '10%' }} checked={this.state.teamWithParents} />
                                            <Body>
                                                <Subtitle style={{ marginBottom: '2%' }} >Team with Parents</Subtitle>
                                                <Text>Parents can also join the Team</Text>
                                            </Body>
                                        </ListItem>
                                    </Content>
                                </Row>

                                <Divider styleName="line" />

                                <Row style={{ width: '100%' }}>
                                    <Text>I am 13 Years or Older</Text>
                                    <Switch
                                        onValueChange={value => this.setState({ age: value })}
                                        value={this.state.age}
                                            style={{ color: '#19CFA0', backgroundColor:'#19CFA0'}}
                                    />
                                </Row>

                                <Row style={{ width: '100%' }}>
                                    <Subtitle> I agree the Terms & Conditions </Subtitle>
                                    <Switch
                                        onValueChange={value => this.setState({ terms: value })}
                                        value={this.state.terms}
                                    />
                                </Row>
                            </ScrollView>
                            </View>
                        </View>

                    )}


            </View>
            
        );
    }
}

const styles = {
    linearGradient: {
        width: '100%',
        height: 85
    }
};
