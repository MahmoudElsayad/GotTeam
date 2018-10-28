//imports 
import React from 'react';
import { Text, View,  } from 'react-native';
import { NavigationBar, Title, Switch, TextInput, Row, Subtitle, Divider, Caption, Button } from '@shoutem/ui';


//create component
class Header extends React.Component {

    displayJsx = () => {
            return (
            <View style={styles.viewStyle}>
                    <Title style={styles.textStyle}>{this.props.title}</Title>
            </View>
            );
    }
    
    render() {
        return this.displayJsx();
    }

};

const styles = {
    viewStyle: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        paddingTop: 15,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        width: '100%',
        backgroundColor: '#4caf50'
    },
    textStyle: {
        fontSize: 20,
        fontWeight:'bold',
        color:"#000"
    },
    textStyleMargin: {
        fontSize: 20,
        marginLeft: '25%',
    },
    backButtonContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'stretch',
        height: 60,
        paddingTop: 15,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        width: '100%'
    }
};

//make component available to other parts of the app
export default Header;
