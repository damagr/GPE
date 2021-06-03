import React, {Component} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';

// This component is used in the OrderConfirmScreen, here we can increase/decrease the total units we have in our OrderLines
// and it changes the orderLines total and the order total.
export class ModifyQuantity extends Component {
    // Method that increases the units and calls the updateTotal function
    increaseUnits = () => {
        this.props.orderLine.Quantity = parseInt(this.props.orderLine.Quantity) + 1;
        this.updateTotal();
        this.props.itemChange(this.props.orderLine);
    };

    // Method that decreases the units and calls the updateTotal function
    decreaseUnits = () => {
        if (this.props.orderLine.Quantity > 1) {
            this.props.orderLine.Quantity -= 1;
            this.updateTotal();
            this.props.itemChange(this.props.orderLine);
        }
    };

    // Updates the total value of the items
    updateTotal = () => {
        const priceQuantity = this.props.orderLine.Price * this.props.orderLine.Quantity;
        const priceDiscount = priceQuantity - (priceQuantity * (this.props.orderLine.Discount / 100));
        const priceIva = priceDiscount + (priceDiscount * (this.props.orderLine.Iva / 100));
        this.props.orderLine.TotalLine = Math.trunc(priceIva * 100) / 100;
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>{this.props.orderLine.Description}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={[styles.text, styles.smallText]}>ID: {this.props.orderLine.ArticleId}</Text>
                        <Text style={[styles.text, styles.smallText]}>Price: {this.props.orderLine.Price}€</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Pressable><Icon name={'remove'} type='material' size={35} color={'#ffcc57'}
                                         onPress={this.decreaseUnits}/></Pressable>
                        <Text style={styles.text}>{this.props.orderLine.Quantity}</Text>
                        <Pressable><Icon name={'add'} type='material' size={35} color={'#ffcc57'}
                                         onPress={this.increaseUnits}/></Pressable>
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Button title='Remove' type='clear' titleStyle={[styles.button, {fontSize: 28}]}
                            onPress={this.props.remove}/>
                    <Text style={styles.text}>Total: {this.props.orderLine.TotalLine}€</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#ffcc57',
        backgroundColor: '#3b3b3b',
        paddingTop: '2%',
        paddingBottom: '4%',
        paddingLeft: '4%',
        paddingRight: '4%',
        marginBottom: '1.5%',
    },
    text: {
        color: '#f7f7f7',
        fontSize: 24,
    },
    smallText: {
        fontSize: 18,
    },
    button: {
        color: '#ffcc57',
        fontSize: 50,
    },
});
