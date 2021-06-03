import React, {Component} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import {GPEPicker} from '../components/GPEPicker';
import {GPELabel} from '../components/GPELabel';
import {GPELogo} from '../components/GPELogo';
import {axios, GPEApi, style} from '../components/GPEConst';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';

export default class LoggingScreen extends Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            employee: {},
        };
    }

    componentDidMount() {
        this.getEmployees();
    }

    // Using the AsyncStorage we save our employee object which we use to asign a certain navigation in MainScreen
    async storeEmployee(value) {
        try {
            await AsyncStorage.setItem('employee', JSON.stringify(value));
        } catch (e) {
            Alert.alert('Something went wront, try again.');
        }
    };

    // Calls the storeEmployee function and navigates to the main screen
    gpeLog = () => {
        this.storeEmployee(this.state.employee).then(this.props.navigation.navigate('MainScreen'));
    };

    // Promise to get all employees and asign it to an array object
    getEmployees = () => {
        axios.get(GPEApi + 'Employees').then((response) => {
            this.setState({employees: response.data});
        });
    };

    // When the picker option is selected we save the entire object depending of the employee's name
    employeeHandler = (e) => {
        this.state.employees.forEach(item => {
            if (item.Name === e) {
                this.setState({employee: item});
            }
        });
    };

    // Check if there's an employee selected
    checkEmployeeSelected = () => {
        if (Object.keys(this.state.employee).length === 0) {
            alert('First you have to choose your employee');
        } else {
            this.gpeLog();
        }
    };

    render() {
        return (
            <View style={[style.container]}>
                <View style={{marginLeft: '5%', marginRight: '5%'}}>
                    <View style={{margin: '10%'}}>
                        <GPELogo/>
                    </View>
                    <GPEPicker pickerSize={'100%'} sendIcon={'perm-identity'} getItemsList={this.state.employees}
                               getOption={this.employeeHandler} getScreen={'LoggingScreen'}/>
                </View>
                <View style={{margin: '5%', }}>
                    <GPELabel title={'Worker\'s name'} content={this.state.employee.Name}/>
                </View>
                <View style={{marginLeft: '5%', marginRight: '5%'}}>
                    <GPELabel title={'Worker\'s function'} content={this.state.employee.Type}/>
                </View>
                <View style={[styles.button,{marginTop: '10%'}]}>
                    <Pressable onPress={this.checkEmployeeSelected}>
                        <Icon name={'login'} type='material' size={60} color={'#ffcc57'}/>
                    </Pressable>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ffcc57',
        width: '20%',
        marginTop: '10%'
    },
});
