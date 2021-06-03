import {NavigationBar} from '../components/NavigationBar';
import React, {Component} from 'react';
import {ScrollView, View} from 'react-native';
import {GPEPicker} from '../components/GPEPicker';
import {GPEInput} from '../components/GPEInput';
import {axios, GPEApi, style} from '../components/GPEConst';
import {GPELabel} from '../components/GPELabel';
import {GPEModal} from '../components/GPEModal';

export default class DeliverPaymentScreen extends Component {

    constructor() {
        super();
        this.state = {
            order: [],
            paidAmount: '',
            selectedMethod: '',
            paymentMethod: ['Cash', 'Credit Card', 'Pending'],
            isReady: false,
            visible: false,
        };
    }

    // Here we get from DeliverCheckScreen the full filled order, when we asign the state we render with the isReady state
    componentDidMount() {
        this.setState({order: this.props.route.params.item}, () => this.setState({isReady: true}));
    }

    // Promise used to send to the server the total paid from the client if the worker choose Credit or Cash and check the
    // Order as delivered in the server. If the worker choose Pending, the total amount will be always 0.
    // After the promise we navigate again to the VisitDeliverScreen
    updateOrdersState = () => {
        const deliverPending = GPEApi + 'Orders/Deliver?OrderId=' + this.state.order.OrderId + '&Paid=0&PayingMethod=' + this.state.selectedMethod;
        const deliver = GPEApi + 'Orders/Deliver?OrderId=' + this.state.order.OrderId + '&Paid=' + this.state.paidAmount + '&PayingMethod=' + this.state.selectedMethod;
        this.chageConfirmVisibility();
        if (this.checkFields()) {
            this.state.selectedMethod === 'Pending'
                ? axios.put(deliverPending).then(this.props.navigation.navigate('VisitDeliverScreen', {deliverPending}))
                : axios.put(deliver).then(this.props.navigation.navigate('VisitDeliverScreen', {deliverPending}));
        } else {
            alert('Please fill all fields with valid information.');
        }
    };

    // Handlers used for hide/show our dialog to finally insert the new client
    chageConfirmVisibility = () => {
        this.setState({visible: !this.state.visible});
    };

    // Handlers to save/erase info from states
    paidAmountHandler = (e) => {
        this.setState({paidAmount: e});
    };
    selectedOptionHandler = (e) => {
        this.setState({selectedMethod: e});
    };
    paidAmountRemove = () => {
        this.setState({paidAmount: ''});
    };

    // Checking empty/filled inputs, if all inputs are filled it shows a dialog to confirm if we are sure about update the Order as delivered.
    checkFields() {
        let flag = true;
        if (this.state.selectedMethod === '') {
            flag = false;
        }
        if ((this.state.paidAmount === '' || !this.isAFloatNumber(this.state.paidAmount)
            || this.state.paidAmount > this.state.order.Total) && this.state.selectedMethod !== 'Pending') {
            flag = false;
        }
        if ((this.state.selectedMethod === 'Cash' || this.state.selectedMethod === 'Credit Card') && this.state.paidAmount === '0') {
            flag = false;
        }
        return flag;
    };

    // Method that gets if the number introduced is a valid positive float calculating if the user introduced more than one comma or
    // dot, or if the user introduced a minus
    isAFloatNumber = (number) => {
        let dotsNumber = 0;
        for (let i = 0; i < number.length; i++) {
            if (number[i] === ',' || number[i] === '.') dotsNumber += 1;
            if (dotsNumber === 2) return false;
            if (number[i] === '-') return false;
        }
        return true;
    };

    render() {
        return (
            <View style={style.container}>
                {this.state.isReady === true ?
                    <View>
                        <NavigationBar leftIcon={'arrow-back-ios'} leftIconSize={40} marginLeft={'2%'}
                                       pageName={'Payment'} rightIcon={'done'} rightIconSize={50} marginRight={'1%'}
                                       pressLeftIcon={() => this.props.navigation.goBack()}
                                       pressRightIcon={this.chageConfirmVisibility}/>
                        <GPEModal isVisible={this.state.visible} content='Are you sure to continue?'
                                  leftButtonTitle='Cancel' leftButtonPress={this.chageConfirmVisibility}
                                  rightButtonTitle='Continue' rightButtonPress={this.updateOrdersState}/>
                        <ScrollView>
                            <View style={{marginLeft: '5%', marginRight: '5%'}}>
                                <GPEPicker pickerSize={'100%'} marginTop={'10%'} getScreen={'DeliverPaymentScreen'}
                                           getItemsList={this.state.paymentMethod}
                                           getOption={this.selectedOptionHandler}/>
                                <GPEInput title={'Paid'} placeholder={'0.0€'}  marginTop='10%'
                                          onChangeText={this.paidAmountHandler} keyboardType={'numeric'}
                                          delete={this.paidAmountRemove} value={this.state.paidAmount}/>
                                <GPELabel title={'Total'} content={this.state.order.Total}
                                          marginTop='10%'/>
                                <GPELabel title={'Client'}  marginTop='10%'
                                          content={this.state.order.Client.Name}/>
                                <GPELabel title={'Contact Name'}  marginTop='10%'
                                          content={this.state.order.Client.ContactName}/>
                            </View>
                        </ScrollView>
                    </View> : <View/>}
            </View>
        );
    }
}
