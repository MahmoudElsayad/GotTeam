import React, { Component } from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Picker, Content, ListItem, Container, CheckBox, Body, Toast, Root, List, Left, Right } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StackActions } from 'react-navigation';
import { NavigationBar, Title, Switch, TextInput, View, Row, Text, Subtitle, Divider, Caption, Button } from '@shoutem/ui';
import Icon from 'react-native-vector-icons/FontAwesome';


let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



export default class LocationPage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            teamName: JSON.stringify(this.props.navigation.getParam('teamName')),
            type: JSON.stringify(this.props.navigation.getParam('type')),
            organization: JSON.stringify(this.props.navigation.getParam('organization')),
            selected: JSON.stringify(this.props.navigation.getParam('selected')),
            age: JSON.stringify(this.props.navigation.getParam('age')),
            terms: JSON.stringify(this.props.navigation.getParam('terms')),
            autoAccept: JSON.stringify(this.props.navigation.getParam('autoAccept')),
            teamWithParents: JSON.stringify(this.props.navigation.getParam('teamWithParents')),
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            marker: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
            }
        };
        console.log(props);
        
    }    

    static navigationOptions = {
        header: null
    };
    


    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                });
            },
            (error) => console.log(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
        this.watchID = navigator.geolocation.watchPosition(
            position => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                });
            }
        );
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
        console.log(this.state.region);
        
    }

    onMapPress(e) {
        this.setState({
            marker: e.nativeEvent.coordinate,
            region: {
                latitude: this.state.marker.latitude,
                longitude: this.state.marker.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }
        });
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
                                <Icon onPress={() => this.props.navigation.dispatch(popAction)} name="long-arrow-left" size={20} style={{ marginLeft: '15%' }} color='#fff' />
                                {/* <Text style={{marginLeft:'1%'}}>Back</Text> */}
                            </TouchableOpacity>
                        }
                        centerComponent={<Title style={{ fontSize: 18,width:'140%', paddingTop: 3, }}>Set Manual Location</Title>}
                        rightComponent={
                            <TouchableOpacity style={{ marginRight: '13%' }} onPress={() => this.props.navigation.dispatch(popAction, {
                                teamName: this.state.teamName,
                                type: this.state.type,
                                organization: this.state.organization,
                                selected: this.state.selected,
                                age: this.state.age,
                                terms: this.state.terms,
                                autoAccept: this.state.autoAccept,
                                teamWithParents: this.state.teamWithParents,
                                region: this.state.region
                            })}>
                                <Subtitle>
                                    Apply
                        </Subtitle>
                            </TouchableOpacity>
                        }
                    />
                    </LinearGradient>

                    <Container style={{ marginTop: '-4%', height:'100%' }}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.container}
                            showsUserLocation={true}
                            initialRegion={{
                                latitude: this.state.region.latitude,
                                longitude: this.state.region.longitude,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                            onRegionChange={region => this.setState({ region })}
                            onRegionChangeComplete={region => this.setState({ region })}
                            loadingEnabled
                            onPress={(e) => this.onMapPress(e)}
                        >
                                <Marker
                                    coordinate={this.state.marker}
                                    pinColor={'#19CFA0'}
                                />
                        </MapView>
                    </Container>
                </View>
            </Root>

        );
    }
}

const styles = {
    container: {
        height: '108%',
        width: '100%',
    },
     linearGradient: {
        width: '100%',
        height: 85
    }
};
