import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, Dimensions } from 'react-native';
import { StackActions } from 'react-navigation';
import { Container, Header, Content, Button, Text } from 'native-base';
import Spinner from 'react-native-spinkit';
import { NavigationBar, Title, Switch, TextInput, View, Row, Subtitle, Divider, Caption } from '@shoutem/ui';
import LinearGradient from 'react-native-linear-gradient';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { List, ListItem, SearchBar } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from '../../renderIf';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class AddTeams extends Component {


    constructor(props) {
        super(props);
        this.state = {
            createLoading: false,
            data: []
        };
    }

    componentWillMount() {
        firebase.firestore().collection("teams")
            .get()
            .then((e) => {
                this.setTeams(e.docs);
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    setTeams = (e) => {
        this.teamsTemp = [];

        for (let index = 0; index < e.length; index++) {
            const element = e[index];
            this.teamsTemp.push(element.data().info)
        }
        this.setState({
            data: this.teamsTemp
        });
    }
    
    fetchTeam = (key) => {

    }

    static navigationOptions = {
        header: null
    };

    render() {
        const popAction = StackActions.pop({
            n: 1,
        });
        const uri = 'https://images.unsplash.com/photo-1537351967534-3e91fc90121d?ixlib=rb-0.3.5&s=1fcdb0c9a4cebb0f7cdfb4e099e7a4c6&auto=format&fit=crop&w=400&q=80';
        return (
            <View styleName='fill-parent'>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#0BC5B7', '#29D890']} style={styles.linearGradient}>
                <NavigationBar
                styleName='clear'
                    // style={{
                    //     container: {
                    //         backgroundColor: '#4caf50'
                    //     },
                    // }}
                    leftComponent={
                        <TouchableHighlight>
                            <Icon onPress={() => this.props.navigation.dispatch(popAction)} name="long-arrow-left" size={20} style={{ marginLeft: '15%' }} color='#fff' />
                        </TouchableHighlight>
                    }
                    centerComponent={<Title style={{ fontSize: 20, paddingTop: 3, }}>Add Teams</Title>}
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
                    }} size={40} type={'9CubeGrid'} color={'#4caf50'} />
                )}

                {renderIf(!this.state.createLoading,
                    <View styleName="fill-parent" style={{ marginTop: '15%'}}>
                        <View styleName='vertical h-start'>
                            <Row style={{ width: '100%' }}>
                                <View>
                                    <TouchableHighlight>
                                        <Icon name="image" size={60} color="#000" style={{ alignSelf: 'center' }} />
                                    </TouchableHighlight>
                                    <Text style={{ alignSelf: 'center', marginTop: '2%' }}>Add Image</Text>
                                </View>

                                <View styleName="vertical stretch" style={{ flex: 1.8 }}>
                                    <Subtitle>Enter team name, team code or organization name</Subtitle>
                                    <TextInput
                                        placeholder={'Type here ...'}
                                        onChangeText={(teamName) => this.fetchTeam(teamName)}
                                    />
                                </View>

                                {/* <Row style={{ marginTop: '15%' }}>
                                    <Button block dark onPress={() => this.props.navigation.navigate('CreateTeam')} style={{ width: '80%', alignSelf: 'center', justifyContent: 'center', alignContent: 'center' }}>
                                        <Text>Create Team</Text>
                                    </Button>
                                </Row> */}

                            </Row>

 {/* Separator  */}
                            <View
                                style={{
                                    height: 1,
                                    width: "100%",
                                    backgroundColor: "#CED0CE",
                                }}
                            />

                            {/* {renderIf(this.state.data.length > 0, 
                            <List>
                                <FlatList
                                    data={this.state.data}
                                    keyExtractor={(item,index) => item.key}
                                    renderItem = {({item}) => {
                                        <View>
                                        <Row style={{ width: '100%' }}>
                                            <View>
                                                <TouchableHighlight>
                                                    <Icon name="image" size={90} color="#000" style={{ alignSelf: 'center' }} />
                                                </TouchableHighlight>
                                            </View>

                                            <View styleName="vertical stretch" style={{ flex: 1.8 }}>
                                                <Subtitle>Team name : {item.name}</Subtitle>
                                                <Subtitle>Team Code : #####</Subtitle>
                                                <Subtitle>( {item.type} )</Subtitle>
                                                <Subtitle>Organization: </Subtitle>
                                            </View>



                                        </Row>

                                            <Row style={{ width: '100%' }}>
                                                <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                    <TouchableHighlight style={styles.iconGrid}>
                                                        <Icon name="user-circle" size={40} color="#000" style={{ alignSelf: 'center' }} />
                                                    </TouchableHighlight>
                                                    <TouchableHighlight style={styles.iconGrid}>
                                                        <Icon name="registered" size={40} color="#000" style={{ alignSelf: 'center' }} />
                                                    </TouchableHighlight>
                                                    <TouchableHighlight style={styles.iconGrid} onPress={() => { this.props.navigation.navigate('TeamOptions', {teamName: item.name}) }}>
                                                        <Icon name="plus" size={40} color="#000" style={{ alignSelf: 'center' }} />
                                                    </TouchableHighlight>
                                                    <TouchableHighlight style={styles.iconGrid}>
                                                        <Icon name="braille" size={40} color="#000" style={{ alignSelf: 'center' }} />
                                                    </TouchableHighlight>
                                                    <TouchableHighlight style={styles.iconGrid}>
                                                        <Icon name="users" size={40} color="#000" style={{ alignSelf: 'center' }} />
                                                    </TouchableHighlight>
                                                </View>
                                            </Row>
                                        </View>
                                    }}
                                >
                                </FlatList>
                            </List>
                            )} */}




                                <Row style={{ paddingTop: '15%', width:'100%', justifyContent:'center', alignContent:'center' }}>
                                    <View style={{ flexDirection: 'column',}}>
                                    <Button block light onPress={() => this.props.navigation.navigate('All Types')} style={{ width: '70%', alignSelf: 'center', justifyContent: 'center', alignContent: 'center', marginBottom:'3%' , borderRadius:10,
                                     }}>
                                        <Text style={{ color: "black"}}>All Types</Text>
                                    </Button>
                                    <Button block dark onPress={() => this.props.navigation.navigate('JoinTeams')} style={{ width: '70%', alignSelf: 'center', justifyContent: 'center', alignContent: 'center', borderRadius: 10, backgroundColor:'#19CFA0' }}>
                                        <Text style={styles.white}>Search & Join Teams</Text>
                                    </Button>
                                    </View>
                                </Row>

                                <Row style={{ paddingTop: '5%', width:'100%', justifyContent:'center', alignContent:'center',
                            backgroundColor: '#fafafa' }}>
                                    <Button block onPress={() => this.props.navigation.navigate('CreateTeam' , {
                                    teamName: '',
                                    type: 'football',
                                    organization: '',
                                    selected: 'Manual',
                                    age: false,
                                    terms: false,
                                    autoAccept: false,
                                    teamWithParents: false,
                                    region: {
                                        latitude: 31.0411511,
                                        longitude: 30.4575227,
                                        latitudeDelta: LATITUDE_DELTA,
                                        longitudeDelta: LONGITUDE_DELTA,
                                    }
                                })} style={{ width: '90%', alignSelf: 'center', justifyContent: 'center', alignContent: 'center', backgroundColor:'#19CFA0' }}>
                                        <Text style={styles.white}>Create Team</Text>
                                    </Button>
                                </Row>
                        </View>
                    </View>
                )}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    iconGrid: {
        backgroundColor: '#fff',
        flex: 1,
        height: '100%',
        paddingTop: '2%',
        paddingBottom: '2%',
        paddingRight: '1%',
        paddingLeft: '1%',
        borderRadius: 10,
        borderColor: '#323232',
        borderStyle: 'solid',
        borderWidth: 1,
        marginLeft: '2%',
        marginTop: '3%'
    },
    white: {
        color:'#FFF'
    },
    linearGradient: {
        width: '100%',
        height: 85
    }
});