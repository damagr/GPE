import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { ItemCard } from '../components/ItemCard';
import { NavigationBar } from '../components/NavigationBar';
import { GPEFilter } from '../components/GPEFilter';
import { axios, GPEApi, style } from '../components/GPEConst';
import { GPEActivityIndicator } from '../components/GPEActivityIndicator';

export default class ItemsListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allItems: [],
            items: [],
            filter: '',
            loaded: false
        };
    }

    componentDidMount() {
        this.getArticles();
    }

    // Promise to get all items
    getArticles = () => {
        axios.get(GPEApi + 'articles').then((response) => {
            this.setState({ allItems: response.data });
            this.setState({ items: this.state.allItems });
            this.setState({ loaded: true });
        });
    };

    // Methods used to filter items in the screen using the GPEFilter component
    setFilter = (filter) => {
        this.setState({ filter }, () => {
            this.filter();
        });
    };

    // This filter works with Description, Brand, Category and ArticleId
    filter = () => {
        let itemList = [];
        if (this.state.filter === '') {
            this.setState({ items: this.state.allItems });
        } else {
            this.state.allItems.forEach(items => {
                const filterText = this.state.filter.toUpperCase();
                if (items.Description.toUpperCase().includes(filterText)
                    || items.Brand.toUpperCase().includes(filterText)
                    || items.Category.toUpperCase().includes(filterText)
                    || items.ArticleId == filterText) {
                    itemList.push(items);
                }
            });
            this.setState({ items: itemList });
        }
    };

    render() {
        return (
            <View style={style.container}>
                <NavigationBar leftIcon={'navigate-before'} leftIconSize={60}
                    pageName={'Item List'}
                    pressLeftIcon={() => this.props.navigation.goBack()} />
                <GPEFilter onChange={this.setFilter} />
                { this.state.loaded ?
                    <FlatList
                        data={this.state.items}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            return (
                                <ItemCard getArticle={item} />
                            );
                        }}
                    />
                    :
                    <GPEActivityIndicator />
                }
            </View>
        );
    }
}
