import React, {Component} from 'react';
import {View} from 'react-native';

export class SeparatorLine extends Component {
    render() {
        return (
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: 'white',
                }}
            />
        );
    }
}

