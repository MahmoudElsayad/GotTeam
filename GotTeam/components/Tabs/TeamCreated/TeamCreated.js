import React, { Component } from 'react';
import { TouchableHighlight } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Picker, Content, ListItem, Container, CheckBox, Body, Toast, Root, List, Left, Right } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from 'react-navigation';
import { NavigationBar, Title, Switch, TextInput, View, Row, Text, Subtitle, Divider, Caption, Button } from '@shoutem/ui';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class TeamCreated extends Component {


    constructor(props) {
        super(props);
        this.state = {
            teamName: '',
        };
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {

    };

    componentDidMount() {
        Toast.show({
            text: "Team Created Successfully",
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
                                    n: 3,
                                }));
                            }}>
                                <Subtitle>
                                    Next
                        </Subtitle>
                            </TouchableHighlight>
                        }
                    />
                    </LinearGradient>
                    <Container style={{marginTop:'-4%'}}>
                        <Content>
                            <List>
                                <ListItem style={{backgroundColor: '#fafafa', flexDirection: 'column',}}>
                                    <Subtitle>Congratulations!</Subtitle>
                                    <Subtitle>Your team is created.</Subtitle>
                                </ListItem>
                                <ListItem style={{borderBottomColor:'#fff' , marginTop:'1%'}}>
                                    <Text style={{marginLeft:'4%'}}>Team Name</Text>
                                    <Subtitle style={{marginLeft: '4%',}}>{JSON.stringify(this.props.navigation.getParam('teamName'))}</Subtitle>
                                </ListItem>
                                <ListItem>
                                    <Text style={{marginLeft:'4%'}}>Team Code</Text>
                                    <Subtitle style={{ marginLeft: '4%', }}>{JSON.stringify(this.props.navigation.getParam('teamCode'))}</Subtitle>
                                </ListItem>
                                <ListItem style={{ borderBottomColor: '#fff',flexDirection:'column', alignItems:'flex-start', padding:'2%'}}>
                                    <Text style={{ lineHeight: 20}}>
                                        Your team members can now join your team via GotTeam app by searching for team name or team code
                                    </Text>

                                    <Text style={{marginTop:'5%', lineHeight:22}}>  
                                        You will receive join request alerts when the team members join, and after you approve their requests, they will become part of your team and added to the team roster. You can also manually add members to the team roster.
                                    </Text>

                                    <Text style={{ marginTop: '5%', lineHeight:22 }}>
                                        You can notify team members verbally or by giving them printed instructions.
                                    </Text>

                                    <Text style={{ marginTop: '5%', lineHeight:22 }}>
                                        You can also invite them via email or SMS
                                    </Text>
                                </ListItem>
                                <ListItem style={{alignItems:'center', alignContent:'center', justifyContent:'center'}}>
                                    <Button styleName='secondary' style={{ width:'60%'}}>
                                        <Text style={{fontSize: 15,}}>Add Members</Text>
                                    </Button>
                                </ListItem>
                            </List>

                            <Button onPress={() => {
                                this.props.navigation.dispatch(StackActions.pop({
                                    n: 3,
                                }));
                            }} style={{ marginTop: '3%', width: '80%', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', backgroundColor:'#19CFA0'}}> 
                                <Text style={{fontSize:20, color:'#fff'}}>Next</Text>
                            </Button>
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