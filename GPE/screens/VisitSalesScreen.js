import React, { Component } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { ClientCard } from '../components/ClientCard';
import { NavigationBar } from '../components/NavigationBar';
import { GPEFilter } from '../components/GPEFilter';
import { axios, GPEApi, style } from '../components/GPEConst';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GPEActivityIndicator } from '../components/GPEActivityIndicator';

export default class VisitSalesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: {},
            allClients: [],
            clients: [],
            filter: '',
            orderLines: [],
            client: [],
            loaded: false
        };
    }

    // When we navigate to this screen we restore the object employee and get the clientsList
    componentDidMount() {
        this.getClients();
        this.restoreEmployee();
    }

    // When the users navigates to this screen this method looks for a possible client to now if the clients arrays
    // should be updated
    componentDidUpdate() {
        if (this.props.route.params !== undefined) {
            if (this.state.client !== this.props.route.params.client && this.props.route.params.client !== []) {
                this.setState({ client: this.props.route.params.client });
                this.getClients();
            }
        }
    }

    // Restore from storage the employee object
    async restoreEmployee() {
        const jsonValue = await AsyncStorage.getItem('employee');
        jsonValue != null ? this.setState({ employee: JSON.parse(jsonValue) }) : null;
    };

    // Promise used to get all clients and save them into our states to show them as a clientsList
    getClients = () => {
        axios.get(GPEApi + 'Clients').then((response) => {
            this.setState({ allClients: response.data });
            this.setState({ clients: response.data });
            this.setState({ loaded: true });
        });
    };

    // Methods used to filter items in the screen using the GPEFiler component
    setFilter = (filter) => {
        this.setState({ filter }, () => {
            this.filter();
        });
    };

    // This filter works with Name, Address, City, Phone, ContactName
    filter = () => {
        let clientList = [];
        if (this.state.filter === '') {
            this.setState({ clients: this.state.allClients });
        } else {
            this.state.allClients.forEach(element => {
                const filterText = this.state.filter.toUpperCase();
                if (element.Name.toUpperCase().includes(filterText)
                    || element.Address.toUpperCase().includes(filterText)
                    || element.City.toUpperCase().includes(filterText)
                    || element.Phone.includes(filterText)
                    || element.ContactName.toUpperCase().includes(filterText)) {
                    clientList.push(element);
                }
            });
            this.setState({ clients: clientList });
        }
    };

    // Navigates to OrderArticleScreen and sends the client and the orderlines
    navigateToScreen = (item) => {
        this.props.navigation.navigate('OrderArticlesScreen', { previousScreen: 'VisitSalesScreen', client: item,
            orderLines: this.state.orderLines });
    };

    render() {
        return (
            <View style={style.container}>
                <NavigationBar leftIcon={'arrow-back-ios'} leftIconSize={40} pageName={'Clients'} rightIcon={'add'}
                    rightIconSize={50} marginLeft={'2%'}
                    pressLeftIcon={() => this.props.navigation.goBack()}
                    pressRightIcon={() => this.props.navigation.navigate('ClientAddScreen', { previousScreen: 'VisitSalesScreen' })}
                />
                <GPEFilter onChange={this.setFilter} />
                { this.state.loaded ?
                    <View style={[style.container, { flexDirection: 'column', flex: 5 }]}>
                        <FlatList
                            data={this.state.clients}
                            keyExtractor={(item) => item.ClientId.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <Pressable
                                        onPress={() => this.navigateToScreen(item)}>
                                        <ClientCard
                                            index={index}
                                            client={item}
                                        />
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
