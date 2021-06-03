import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';

// Component used to recieve an array object and a screen as props, then the picker depending of the screen which we
// send will show a list which we can choose only 1 item and this item will be returned to the parent and work with it
export class GPEPicker extends Component {
    constructor() {
        super();
        this.state = {
            selectedOption: '',
        };
    }

    // When the option is changed we show and send it to teh parent
    updateSelectedOption = (e) => {
        this.setState({selectedOption: e});
        this.props.getOption(e);
    };

    render() {
        let itemsList = this.props.getItemsList;
        let screen = this.props.getScreen;
        return (
            <View style={[styles.view, {marginTop: this.props.marginTop}]}>
                <Picker selectedValue={this.state.selectedOption} onValueChange={this.updateSelectedOption}
                        style={[styles.picker, {width: this.props.pickerSize}]} itemStyle={styles.item}>
                    <Picker.Item label={'Select An Option'}/>
                    {screen === 'DeliverPaymentScreen' && itemsList.map((item, index) => {
                        return (
                            <Picker.Item label={item} value={item} key={index}/>
                        );
                    })}
                    {screen === 'LoggingScreen' && itemsList.map((item, index) => {
                        return (
                            <Picker.Item label={item.Name} value={item.Name} key={index}/>
                        );
                    })}
                    {screen === 'OrderAddItemsScreen' &&  itemsList.map((item, index) => {
                        return (
                            <Picker.Item label={item.LotId} value={item.LotId} key={index}/>
                        );
                    })}
                </Picker>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    picker: {
        backgroundColor: '#3b3b3b',
        color: '#f7f7f7',
    },
    item: {
        color: '#f7f7f7',
    },
    view: {
        borderColor: '#ffcc57',
        borderWidth: 2,
        borderRadius: 4,
        backgroundColor: '#3b3b3b',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
