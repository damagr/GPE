import React, {Component} from 'react';
import {ActivityIndicator, View} from 'react-native';

// A loading icon with animation to make the user feel the app more responsive
export class GPEActivityIndicator extends Component {
    render() {
        return (
            <View style={[{ flex: 1, justifyContent: "center" }, { justifyContent: "space-around"}]}>
                <ActivityIndicator size='large' color='#ffcc57' />
            </View>
        );
    }
}
