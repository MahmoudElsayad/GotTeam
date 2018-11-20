import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationBar, Title, Image, TextInput, View, Row, Subtitle, Divider, Caption} from '@shoutem/ui';
import Spinner from 'react-native-spinkit';
import { Button, Text, ActionSheet } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from '../../renderIf';

var BUTTONS = ['Edit Profile', 'SignOut', 'Cancel'];

class Profile extends Component {

    constructor(props){
        super(props);
        this.state = { 
            email: '',
            uid: '',
            loading: false,
            name: '',
            mobile:'',
            type: ''
        };
    }

    componentWillMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){

                firebase.firestore().collection('users').doc(user.uid).get()
                .then((doc) => {
                    console.log(doc.data());
                    
                    this.setState({
                        name: doc.data().name,
                        mobile: doc.data().mobile,
                        email: doc.data().email,
                        type: doc.data().type
                    })
                })
            }

            // currentUser is ready now.
            // if (user) {
            //     this.setState({email: user.email, uid: user.uid, loading: true});
            // } else {
            //     this._signOutUser();
            // }
        });
    }

    static navigationOptions = {
        title: 'Profile',
        headerTintColor: '#000',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    _signOutUser = async () => {
        try {
            await firebase.auth().signOut();
        } catch (e) {
            alert(e);
        }
    }
      
    actionButton = (index) => {
        // alert(index);

        if (index == 0) {
            // this.props.navigation.navigate('AddTeams');
        }
        else if (index == 1) {
           this._signOutUser();
        }
    }

    render() {
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
                    centerComponent={<Title style={{ fontSize: 20, paddingTop: 3, }}>Profile</Title>}
                    rightComponent={
                            <TouchableOpacity
                                onPress={() =>
                                    ActionSheet.show(
                                        {
                                            options: BUTTONS,
                                            cancelButtonIndex: 2,
                                            title: "Options"
                                        },
                                        buttonIndex = (index) => {
                                            this.actionButton(index);
                                        }
                                    )}
                            >
                                <View style={{ marginRight: '18%', marginTop:'2%' }}>
                                    <Icon name="bars" size={30} color="#fff" />
                                </View>
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

                    
                    <View styleName="fill-parent" style={{ marginTop: '15%', backgroundColor: '#fff' }}>

                    {renderIf(this.state.loading == false,
                    <View styleName="vertical h-start">
                    <ScrollView style={{ paddingTop: '3%', height:'106%', width:'100%' }}>
                    <Row style={{width:'100%' , flexDirection: 'column'}}>
                        <Image
                            style={{ width: 80, height: 80, borderRadius:50}}
                            source={{ uri: 'http://via.placeholder.com/640x360' }}
                            />
                        <Text style={styles.text}>{this.state.name}</Text>
                        <Text style={styles.text}>{this.state.email}</Text>
                    </Row>
                    
                    <Row styleName="small">
                        <Icon name="question" size={25} style={styles.iconLeft}/>
                        <Text>Help</Text>
                        {/* <Icon name="angle-right" size={25} style={styles.iconRight}/> */}
                    </Row>
                    <Row styleName="small">
                                <Icon name="usd" size={25} style={styles.iconLeft}/>
                        <Text>My Subscribtion</Text>
                        {/* <Icon name="angle-right" size={25} style={styles.iconRight}/> */}
                    </Row>
                    <Row styleName="small">
                                <Icon name="usd" size={25} style={styles.iconLeft}/>
                        <Text>Payment Settings</Text>
                        {/* <Icon name="angle-right" size={25} style={styles.iconRight}/> */}
                    </Row>
                    <Row styleName="small">
                                <Icon name="bell-o" size={25} style={styles.iconLeft}/>
                        <Text>Recent Notifications</Text>
                        {/* <Icon name="angle-right" size={25} style={styles.iconRight}/> */}
                    </Row>
                    <Row styleName="small">
                        <Icon name="volume-up" size={25} style={styles.iconLeft}/>
                        <Text>Notification Sound</Text>
                        {/* <Icon name="angle-right" size={25} style={styles.iconRight}/> */}
                    </Row>


                            <Divider styleName="section-header">
                            </Divider>


                            <Row styleName="small">
                                <Icon name="recycle" size={25} style={styles.iconLeft} />
                                <Text>Check for Updates</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="exclamation-circle" size={25} style={styles.iconLeft} />
                                <Text>Version History</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="heartbeat" size={25} style={styles.iconLeft} />
                                <Text>Lova GotTeam?</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="share-square-o" size={25} style={styles.iconLeft} />
                                <Text>Share GotTeam with friends</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row>


                            <Divider styleName="section-header">
                            </Divider>


                            <Row styleName="small">
                                <Icon name="tags" size={25} style={styles.iconLeft} />
                                <Text>My Offers</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="tags" size={25} style={styles.iconLeft} />
                                <Text>Local Sponsors</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="tags" size={25} style={styles.iconLeft} />
                                <Text>Past Winners</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row>

                            <Divider styleName="section-header">
                            </Divider>


                            <Row styleName="small">
                                <Icon name="audio-description" size={25} style={styles.iconLeft} />
                                <Text>Banner Ads</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="audio-description" size={25} style={styles.iconLeft} />
                                <Text>Full Screen Ads</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="audio-description" size={25} style={styles.iconLeft} />
                                <Text>Sponsors Listings</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="audio-description" size={25} style={styles.iconLeft} />
                                <Text>Email Ads</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row>

                            <Divider styleName="section-header">
                            </Divider>

                            <Row styleName="small">
                                <Icon name="envelope-o" size={25} style={styles.iconLeft} />
                                <Text>Contact Us</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="question-circle-o" size={25} style={styles.iconLeft} />
                                <Text>FAQ's</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="handshake-o" size={25} style={styles.iconLeft} />
                                <Text>Terms & Conditions</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row><Row styleName="small">
                                <Icon name="shield" size={25} style={styles.iconLeft} />
                                <Text>Privacy Policy</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row>

                            <Divider styleName="section-header">
                            </Divider>

                                <TouchableOpacity onPress={() => {
                                    this._signOutUser()
                                }}>
                            <Row styleName="small">
                                <Icon name="sign-out" size={25} style={styles.iconLeft} />
                                <Text style={{color:'red'}}>Logout</Text>
                                {/* <Icon name="angle-right" size={25} style={styles.iconRight} /> */}
                            </Row>
                                </TouchableOpacity>
                
                </ScrollView>
                    </View>
                            )}
                    </View>
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
        alignContent: 'center',
        marginTop:'25%'
    },
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 50
    },
    text: {
        marginTop:'2%',
        fontSize: 15
    },
    linearGradient: {
        width: '100%',
        height: 72
    },
    iconLeft: {
        marginRight:'5%',
        marginLeft:'2%'
    },
    iconRight: {
    }
    
};

export default Profile;