import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GPELabel } from '../components/GPELabel';
import { GPEInput } from '../components/GPEInput';
import { GPEPicker } from '../components/GPEPicker';
import { NavigationBar } from '../components/NavigationBar';
import { style } from '../components/GPEConst';

export default class OrderAddItemsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLot: '',
            discount: '',
            units: '',
            total: 0,
            orderLines: [],
            orderLine: {},
            article: {},
            order: {},
            isReady: false,
            added: false
        };
    }

    componentDidMount() {
        this.getInfo();
    }

    // Method that gets orderLines, order and article information
    getInfo = () => {
        this.setState({ orderLines: this.props.route.params.orderLines });
        this.setState({ order: this.props.route.params.order });
        this.setState({ article: this.props.route.params.article }, () => {
            this.setState({ isReady: true });
        });
    };

    // Method that creates the orderLine and adds it to the orderLines array
    updateOrderLines = () => {
        let orderLine = {
            OrderId: null,
            LineId: null,
            ArticleId: this.state.article.ArticleId,
            LotId: this.state.selectedLot,
            Description: this.state.article.Description,
            Price: this.state.article.Price,
            Brand: this.state.article.Brand,
            Category: this.state.article.Category,
            Quantity: this.state.units,
            Iva: this.state.article.Iva,
            Discount: this.state.discount,
            TotalLine: this.state.total,
        };
        let orderLines;
        if (this.state.orderLines !== undefined) {
            orderLines = this.state.orderLines;
        } else {
            orderLines = [];
        }
        orderLines.push(orderLine);
        this.setState({ orderLines });
    };

    // Method that calculates the total given the VAT and Discount
    getTotal = () => {
        let priceQuantity = this.state.article.Price * this.state.units;
        let priceDiscount = priceQuantity - (priceQuantity * (this.state.discount / 100));
        let priceIva = priceDiscount + (priceDiscount * (this.state.article.Iva / 100));
        let priceDecimals = Math.trunc(priceIva * 100) / 100;
        this.setState({ total: priceDecimals });
    };

    getLot = (e) => {
        this.setState({ selectedLot: e });
    };

    changeUnits = (units) => {
        this.setState({ units }, () => this.getTotal());
    };

    changeDiscount = (discount) => {
        this.setState({ discount }, () => this.getTotal());
    };

    deleteUnits = () => {
        this.setState({ units: '' }, () => this.getTotal());
    };

    deleteDiscount = () => {
        this.setState({ discount: '' }, () => this.getTotal());
    };

    // Method that calls updateOrderLines function and then navigates to OrderArticlesScreen
    addItemList = () => {
        if (!this.state.added) {
            this.setState({added: true});
            this.updateOrderLines();
            this.props.navigation.navigate('OrderArticlesScreen', {
                orderLines: this.state.orderLines,
                order: this.state.order,
                previousScreen: 'OrderAddItemsScreen'
            });
        }
    };

    // Method that gets if the number introduced is a valid positive int
    isAnIntNumber = (number) => {
        for (let i = 0; i < number.length; i++) {
            if (!Number.isInteger(parseInt(number[i]))) {
                return false;
            }
        }
        return true;
    };

    // Method that looks if any of the fields is empty, and in that case creates an alert
    checkFields = () => {
        let flag = true;
        if (this.state.selectedLot === '') {
            alert('You have to select a lot ');
            flag = false;
        } else if (this.state.units <= 0 && !this.Number.isFinite(this.state.units)) {
            alert('You have to introduce a number over 0 in Units');
            flag = false;
        } else if (this.state.discount < 0 || this.state.discount > 100 || this.state.discount !== ''
            && !this.isAnIntNumber(this.state.discount)) {
            flag = false;
            alert('You have to introduce a number between 0-100 in discount');
        }
        if (flag) {
            let stock = 0;
            this.state.article.Lots.forEach(element => {
                if (element.LotId == this.state.selectedLot) {
                    stock = element.Stock;
                }
            });
            if (this.state.units > stock) {
                alert('There\'s no sufficient stock of this product. (Stock: ' + stock + ')');
            } else {
                this.addItemList();
            }
        }
    };

    render() {
        if (this.state.isReady) {
            return (
                <View style={style.container}>
                    <NavigationBar leftIcon={'arrow-back-ios'} leftIconSize={40} rightIcon={'add-circle-outline'}
                                   rightIconSize={45} pageName={'Add Item'} marginLeft={'2%'} marginRight={'1%'}
                                   pressLeftIcon={() => this.props.navigation.goBack()}
                                   pressRightIcon={this.checkFields}/>
                    <View style={{margin: '5%'}}>
                        <Text style={styles.text}>{this.state.article.Description}</Text>
                        <GPEPicker sendIcon={'table-rows'} getOption={this.getLot} pickerSize={'100%'}
                                   getScreen={'OrderAddItemsScreen'} getItemsList={this.state.article.Lots}/>
                        <GPEInput title={'Units'} placeholder={'0'} onChangeText={this.changeUnits}
                                  delete={this.deleteUnits} value={this.state.units}
                                  marginTop='2%' keyboardType='numeric'/>
                        <GPELabel title={'Unit price'} content={this.state.article.Price}
                                  marginTop='2%'/>
                        <GPEInput title={'Discount'} placeholder={'0'} marginTop='2%'
                                  marginBottom='2%'
                                  onChangeText={this.changeDiscount} delete={this.deleteDiscount}
                                  value={this.state.discount} keyboardType='numeric'/>
                        <GPELabel title={'Total (IVA applied: ' + this.state.article.Iva + '%)'}
                                  content={this.state.total}
                                  marginTop='10%'/>
                    </View>
                </View>
            );
        }
        return <View/>;
    }
}

const styles = StyleSheet.create({
    defaultView: {
        flex: 1,
        marginLeft: '8%',
        marginRight: '2%',
    },
    text: {
        fontSize: 25,
        color: '#f7f7f7',
        marginBottom: '2%',
    },
});
