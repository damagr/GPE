import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Icon} from 'react-native-elements';

export class GPEInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
    }

    render() {
        return (
            <View style={[styles.input, {
                aspectRatio: this.props.height, width: this.props.width, marginTop: this.props.marginTop,
                marginBottom: this.props.marginBottom,
            }]}>
                <View style={{width: '80%'}}>
                    <Text style={{color: 'white', fontSize: 15, marginLeft: '2%'}}>{this.props.title}</Text>
                    <TextInput style={{color: 'white', fontSize: 18}} placeholder={this.props.placeholder}
                               placeholderTextColor='#7c7c7c' onChangeText={(text) => this.props.onChangeText(text)}
                               keyboardType={this.props.keyboardType} value={this.props.value}/>
                </View>
                <View style={{justifyContent: 'center', marginRight: '2%'}}>
                    <Icon
                        name='cancel'
                        type='material'
                        color='#ffcc57'
                        size={40}
                        onPress={this.props.delete}/>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    input: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ffcc57',
        backgroundColor: '#3b3b3b',
    },
});
