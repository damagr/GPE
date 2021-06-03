import React, {Component} from 'react';
import {View} from 'react-native';
import {GPEButton} from '../components/GPEButton';
import {GPELogo} from '../components/GPELogo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {style} from '../components/GPEConst';

export default class MainScreen extends Component {
    constructor() {
        super();
        this.state = {
            employee: {},
        };
    }

    // When we navigate to this screen we restore the object employee, which we use to give a functionality depending
    // of the employeeType
    componentDidMount() {
        this.restoreEmployee();
    }

    // Restores the employee from from the async
    async restoreEmployee() {
        const jsonValue = await AsyncStorage.getItem('employee');
        jsonValue != null ? this.setState({employee: JSON.parse(jsonValue)}) : null;
    };

    // Depending of the employeeType when we press the VISIT button we navigate to VisitSalesScreen or VisitDeliverScreen
    // employees with employeeType 'Salesman' access to VisitSalesScreen, there we have all our clients and we can create new
    // orders. Employees with employeeType 'Deliver' access to VisitDeliverScreen, there depending of the field 'Deliverer' and
    // the field 'Delivered' our employee will see orders to deliver or not, there the employee only can see the orders which
    // his name is in the field 'Deliverer' and 'Delivered' field is false.
    render() {
        return (
            <View style={style.container}>
                <View style={{marginLeft: '5%', marginRight: '5%'}}>
                    <View style={{marginTop: '20%', marginBottom: '20%', marginRight: '10%', marginLeft: '10%'}}>
                        <GPELogo/>
                    </View>
                </View>
                <View style={[style.flexRowCenter, {justifyContent: 'space-evenly', marginTop: '5%'}]}>
                    <GPEButton iconName='local-shipping' iconSize={60} buttonName='VISIT'
                               onPress={this.state.employee.Type === 'Salesman' ? () => this.props.navigation.navigate('VisitSalesScreen') : () => this.props.navigation.navigate('VisitDeliverScreen')}/>
                    <GPEButton iconName='contact-page' iconSize={60} buttonName='CLIENTS'
                               onPress={() => this.props.navigation.navigate('ClientsListScreen')}/>
                </View>
                <View style={[style.flexRowCenter, {justifyContent: 'space-evenly', marginTop: '5%'}]}>
                    <GPEButton iconName='category' iconSize={60} buttonName='ITEMS'
                               onPress={() => this.props.navigation.navigate('ItemsListScreen')}/>
                    <GPEButton iconName='logout' iconSize={60} buttonName='LOGOUT'
                               onPress={() => this.props.navigation.navigate('LoggingScreen')}/>
                </View>
            </View>
        );
    }
}
