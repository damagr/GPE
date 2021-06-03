import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Overlay} from 'react-native-elements';

// This component is used to verify if the worker want or not to continue with the action he did
export class GPEModal extends Component {
    render() {
        return (
            <Overlay isVisible={this.props.isVisible} overlayStyle={{
                width: '80%',
                height: '30%',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#ffcc57',
                backgroundColor: '#3b3b3b',
                borderRadius: 8,
            }}>
                <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 20, color: 'white'}}>{this.props.content}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end'}}>
                        <Button type='clear' title={this.props.leftButtonTitle} onPress={this.props.leftButtonPress}
                                titleStyle={{color: '#ffcc57'}}/>
                        <Button type='clear' title={this.props.rightButtonTitle} onPress={this.props.rightButtonPress}
                                titleStyle={{color: '#ffcc57'}}/>
                    </View>
                </View>
            </Overlay>
        );
    }
}
