import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

export class GPELabel extends Component {
    render() {
        return (
            <View style={[styles.label, {
                paddingLeft: this.props.paddingLeft,
                width: this.props.width,
                aspectRatio: this.props.height,
                marginTop: this.props.marginTop,
                marginBottom: this.props.marginBottom,
            }]}>
                <Text style={{
                    color: 'white',
                    fontSize: 15,
                    marginLeft: '2%',
                }}>{this.props.title} {this.props.currency}</Text>
                <TextInput style={{color: 'white', fontSize: 18, marginLeft: '1%'}}
                           editable={false}>{this.props.content} {this.props.currency}</TextInput>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    label: {
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ffcc57',
        backgroundColor: '#3b3b3b',
    },
});
