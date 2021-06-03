import React, {Component} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';

// A simple pressable view created for the GPE project, using props we can
export class GPEButton extends Component {
    render() {
        return (
            <Pressable style={styles.button} onPress={this.props.onPress}>
                <View>
                    <Icon name={this.props.iconName} type='material' size={this.props.iconSize} color={'#ffcc57'}/>
                    <Text style={styles.text}>{this.props.buttonName}</Text>
                </View>
            </Pressable>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ffcc57',
        width: '40%',
    },
    text: {
        color: 'white',
        fontSize: 28,
    },
});
