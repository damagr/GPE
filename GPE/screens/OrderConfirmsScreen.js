import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { ModifyQuantity } from '../components/ModifyQuantity';
import { NavigationBar } from '../components/NavigationBar';
import { ContactInfo } from '../components/ContactInfo';
import { Divider } from 'react-native-elements';
import { GPELabel } from '../components/GPELabel';
import { GPEModal } from '../components/GPEModal';
import { axios, GPEApi, style } from '../components/GPEConst';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class OrderConfirmsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            itemIdRemove: -1,
            visibleRemove: false,
            visibleConfirm: false,
            employee: {},
        };
    }

    componentDidMount() {
        this.updateInfo();
        this.setProductsId();
        this.restoreEmployee();
    }

    // Restore from storage the employee object
    async restoreEmployee() {
        const jsonValue = await AsyncStorage.getItem('employee');
        jsonValue != null ? this.setState({ employee: JSON.parse(jsonValue) }) : null;
    };

    // Method that creates the order and makes a post to the database, then it calls getOrderId function
    addOrder = () => {
        axios.post(GPEApi + 'Orders', {
            ClientId: this.props.route.params.client.ClientId,
            OrderNum: '',
            Date: '',
            DeliveryDate: '',
            Total: this.state.total,
            Delivered: false,
            Paid: 0.0,
            PayingMethod: null,
            Deliverer: this.state.employee.Deliverer,
            EmployeeId: this.state.employee.EmployeeId,
        }).then(this.getOrderId);
    };

    // Given the recently added orderId it gives that value to the orderLines
    getOrderId = () => {
        axios.get(GPEApi + 'Orders/GetLast').then((response) => {
            this.addOrderLines(response.data);
        });
    };

    // Method that creates the orderLines and makes a post to the database
    addOrderLines = (id) => {
        let products = [];
        this.props.route.params.orderLines.forEach(item => {
            item.OrderId = id;
            products.push(item);
        });
        this.setState({ orderLines: products });
        let orderLines = this.props.route.params.orderLines;
        axios.post(GPEApi + 'OrderLines', orderLines);
    };

    // Method that gives every orderLines its lineId
    setProductsId = () => {
        let i = 1;
        this.props.route.params.orderLines.forEach(element => {
            element.LineId = i++;
        });
    };

    // Method that deletes the orderLine with the same id that the state saves and calls updateInfo function
    removeProduct = () => {
        this.props.route.params.orderLines = this.props.route.params.orderLines.filter((article) => {
            return this.state.itemIdRemove !== article.LineId;
        });
        this.updateInfo();
    };

    // Method that calculates and updates the total state
    updateInfo = () => {
        let total = 0;
        this.props.route.params.orderLines.forEach(element => {
            total += element.TotalLine;
        });
        total = Math.trunc(total * 100) / 100;
        this.setState({ total });
    };

    // Method that makes the modal invisible, post the order and returns to VisitSalesScreen
    postOrder = () => {
        this.changeVisibleConfirm();
        if (this.props.route.params.orderLines.length === 0) alert('First you have to add items to the order');
        else {
            this.addOrder();
            this.props.navigation.navigate('VisitSalesScreen', {orderLines: []});
        }
    };

    // Method that chenges the visibility of the remove modal
    changeVisibleRemove = () => {
        this.setState({ visibleRemove: !this.state.visibleRemove });
    };

    // Method that chenges the visibility of the confirm modal
    changeVisibleConfirm = () => {
        this.setState({ visibleConfirm: !this.state.visibleConfirm });
    };

    render() {
        return (
            <View style={style.container}>
                <NavigationBar leftIcon={'arrow-back-ios'} leftIconSize={40} pageName={'Confirm'}
                    rightIcon={'check'} rightIconSize={48} marginLeft={'2%'}
                    pressLeftIcon={() => this.props.navigation.navigate('OrderArticlesScreen', {
                        newOrderLines: this.props.route.params.orderLines,
                        client: this.props.route.params.client,
                    })}
                    pressRightIcon={this.changeVisibleConfirm} />
                <Divider style={{ height: 10, backgroundColor: 'none' }} />
                <View style={{ marginLeft: '2%', marginRight: '2%' }}>
                    <ContactInfo name={this.props.route.params.client.Name} dni={this.props.route.params.client.NIF}
                        change={() => {
                            this.props.navigation.navigate('ChangeClientScreen', {
                                orderLines: this.props.route.params.orderLines,
                                client: this.props.route.params.client,
                            });
                        }} />
                </View>
                <Divider style={{ height: 10, backgroundColor: 'none' }} />
                <FlatList
                    data={this.props.route.params.orderLines}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ marginLeft: '2%', marginRight: '2%' }}>
                                <ModifyQuantity orderLine={item} remove={() => {
                                    this.changeVisibleRemove();
                                    this.setState({ itemIdRemove: item.LineId });
                                }}
                                    itemChange={this.updateInfo} />
                            </View>
                        );
                    }}
                />

                <View style={{ alignItems: 'center', marginTop: '2%' }}>
                    <GPELabel title="Total: " paddingLeft={'2%'} width={'50%'} marginBottom={'4%'}
                        content={this.state.total}
                        currency='€' />
                </View>
                <GPEModal isVisible={this.state.visibleRemove} content='Do you want to delete the item?'
                    leftButtonTitle='Cancel'
                    rightButtonTitle='Confirm' leftButtonPress={this.changeVisibleRemove}
                    rightButtonPress={() => {
                        this.changeVisibleRemove();
                        this.removeProduct();
                    }} />
                <GPEModal isVisible={this.state.visibleConfirm} content='Do you want to end the order?'
                    leftButtonTitle='Cancel' leftButtonPress={this.changeVisibleConfirm}
                    rightButtonTitle='Confirm' rightButtonPress={this.postOrder} />
            </View>
        );
    }
}
