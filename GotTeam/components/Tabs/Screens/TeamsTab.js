import {
    createStackNavigator,
} from 'react-navigation';
import Teams from './Teams';
import AddTeams from './AddTeams';

const TeamsTab = createStackNavigator({
    Teams: { screen: Teams },
    AddTeams: { screen: AddTeams },
});

export default TeamsTab;