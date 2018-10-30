import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationBar, Title, Switch, TextInput, View, Row, Subtitle, Divider, Caption} from '@shoutem/ui';
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

                    
                    {renderIf(this.state.loading == false,
                        
                    <View style={styles.container}>
                        <Image
                            style={{ width: 100, height: 100, borderRadius:50}}
                            source={{ uri: 'http://via.placeholder.com/640x360' }}
                            />

                        <Text style={styles.text}>{this.state.name}</Text>
                        <Text style={styles.text}>{this.state.type}</Text>
                        <Text style={styles.text}>{this.state.mobile}</Text>
                        <Text style={styles.text}>{this.state.email}</Text>
                    </View>
                            )}

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
        justifyContent: 'center',
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
    }
    
};

export default Profile;