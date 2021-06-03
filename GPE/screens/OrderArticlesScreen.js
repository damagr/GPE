import React, { Component } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { NavigationBar } from '../components/NavigationBar';
import { GPEFilter } from '../components/GPEFilter';
import { ItemCard } from '../components/ItemCard';
import { axios, GPEApi, style } from '../components/GPEConst';
import { GPEActivityIndicator } from '../components/GPEActivityIndicator';

export default class OrderArticlesScreen extends Component {
    constructor() {
        super();
        this.state = {
            allArticles: [],
            articles: [],
            orderLines: [],
            client: {},
            employeeId: 0,
            loaded: false,
            order: {
                ClientId: 0,
                OrderNum: 0,
                Date: '',
                DeliveryDate: '',
                Total: 0,
                Delivered: false,
                Paid: 0,
                PayingMethod: '',
                Deliverer: '',
                EmployeeId: 0,
            },

        };
    }

    componentDidMount() {
        this.getArticles();
        this.getInfo();
    }

    // Method that looks if the screen that navigated here gave him orderlines and a client
    componentDidUpdate() {
        if (this.props.route.params.newOrderLines !== undefined) {
            if (this.props.route.params.newOrderLines !== this.state.orderLines) {
                this.setState({ orderLines: this.props.route.params.newOrderLines });
            }
        }
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.client !== undefined && this.state.client.length === 0) {
                this.setState({ client: this.props.route.params.client });
            }
            if (this.props.route.params.previousScreen !== undefined) {
                if (this.props.route.params.previousScreen === 'VisitSalesScreen' && this.state.orderLines.length !== 0) {
                    this.setState({ orderLines: [] });
                }
            }
        }
    }

    // Method that gets every article
    getArticles = () => {
        axios.get(GPEApi + 'articles').then((response) => {
            this.setState({ allArticles: response.data });
            this.setState({ articles: response.data });
            this.setState({ loaded: true });
        }, (rejectedResult) => {
            console.error(rejectedResult.statusText);
        });
    };

    // Method that get most of the state values if that value is given by the screen that navigated here
    getInfo = () => {
        this.setState({ client: this.props.route.params.client });
        this.setState({ employeeId: this.props.route.params.employeeId });
        if (this.props.route.params.orderLines !== undefined) {
            this.setState({ orderLines: this.props.route.params.orderLines });
        }
        if (this.props.route.params.order !== undefined) {
            this.setState({ order: this.props.route.params.order });
        }
    };

    // Methods used to filter articles in the screen using the GPEFilter component
    setFilter = (filter) => {
        this.setState({ filter }, () => {
            this.filter();
        });
    };

    // Method that filters articles looking their Description, Brand and ArticleId
    filter = () => {
        let articlesList = [];
        if (this.state.filter === '') {
            this.setState({ articles: this.state.allArticles });
        } else {
            this.state.allArticles.forEach(element => {
                const filterText = this.state.filter.toUpperCase();
                if (element.Description.toUpperCase().includes(filterText) 
                    || element.Brand.toUpperCase().includes(filterText)
                    || element.ArticleId == filterText 
                    || element.Category.toUpperCase().includes(filterText)) {
                    articlesList.push(element);
                }
            });
            this.setState({ articles: articlesList });
        }
    };

    render() {
        return (
            <View style={style.container}>
                <NavigationBar leftIcon={'arrow-back-ios'} leftIconSize={40} pageName={'Add Items'}
                    marginLeft={'2%'}
                    pressLeftIcon={() => this.props.navigation.navigate('VisitSalesScreen', {
                        orderLines: this.state.orderLines,
                        order: this.state.order,
                        client: this.state.client,
                        employeeId: this.state.employeeId,
                    })}
                    rightIcon={'arrow-forward-ios'} rightIconSize={40}
                    pressRightIcon={() => this.props.navigation.navigate('OrderConfirmsScreen', {
                        orderLines: this.state.orderLines,
                        order: this.state.order,
                        client: this.state.client,
                        employeeId: this.state.employeeId,
                    })} />
                <GPEFilter onChange={this.setFilter} />
                {this.state.loaded ?
                    <View style={[style.container, { flexDirection: 'column' }]}>
                        <FlatList
                            data={this.state.articles}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => {
                                return (
                                    <Pressable onPress={() => this.props.navigation.navigate('OrderAddItemsScreen', {
                                        article: item,
                                        orderLines: this.state.orderLines,
                                    })}>
                                        <ItemCard getArticle={item} />
                                    </Pressable>
                                );
                            }}
                        />
                    </View>
                    :
                    <GPEActivityIndicator />
                }
            </View>
        );
    }
}
