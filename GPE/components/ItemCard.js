import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

// Component used to show articles in a FlatList. We get an article object using props from the parent to show the client info
export class ItemCard extends Component {
    render() {
        let article = this.props.getArticle;
        return (
            <View style={styles.mainContainer}>
                <View style={{justifyContent: 'space-between', flexDirection: 'column'}}>
                    <Text style={[styles.text, {
                        fontWeight: 'bold',
                        fontSize: 20,
                        marginBottom: '3%',
                    }]}>{article.Description}</Text>
                    <Text style={styles.text}>Category: {article.Category}</Text>
                    <Text style={styles.text}>Brand: {article.Brand}</Text>
                </View>
                <View style={{justifyContent: 'space-between', flexDirection: 'column', alignContent: 'flex-end'}}>
                    <Text style={[styles.text, {alignSelf: 'flex-end'}]}>ID: {article.ArticleId}</Text>
                    <Text style={[styles.text, {fontSize: 23}]}>{article.Price} €</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: '3%',
        paddingBottom: '3%',
        paddingRight: '2%',
        paddingLeft: '2%',
        backgroundColor: '#3b3b3b',
        borderColor: '#ffcc57',
        borderTopWidth: 1,
        borderBottomWidth: 2,
    },
    text: {
        color: '#f7f7f7',
        fontSize: 16,
        marginBottom: '1%',
    },
});
