import React, {Component} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Icon} from 'react-native-elements';

export class GPEFilter extends Component {
    render() {
        return (
            <View style={styles.input}>
                <View style={{justifyContent: 'center'}}>
                    <Icon
                        name='search'
                        type='material'
                        color='#98a5ad'
                        size={30}
                        style={{marginLeft: '3%'}}
                        onPress={this.eraseContent}/>
                </View>
                <TextInput style={{flex: 1, color: 'white', fontSize: 20, paddingBottom: '2.5%'}} placeholder='Filter'
                           placeholderTextColor='#7c7c7c' onChangeText={(text) => this.props.onChange(text)}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#98a5ad',
        aspectRatio: 9,
    },
});
