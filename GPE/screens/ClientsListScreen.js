import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { ClientCard } from '../components/ClientCard';
import { NavigationBar } from '../components/NavigationBar';
import { GPEFilter } from '../components/GPEFilter';
import { axios, GPEApi, style } from '../components/GPEConst';
import { GPEActivityIndicator } from '../components/GPEActivityIndicator';

export default class ClientsListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allClients: [],
            clients: [],
            filter: '',
            client: [],
            loaded: false
        };
    }

    componentDidMount() {
        this.getClients();
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

    // Promise used to get all clients and save them into our states to show them as a clientsList
    getClients = () => {
        axios.get(GPEApi + 'Clients').then((response) => {
            this.setState({ allClients: response.data });
            this.setState({ clients: response.data });
            this.setState({ loaded: true });
        });
    };

    // Methods used to filter items in the screen using the GPEFilter component
    setFilter = (filter) => {
        this.setState({ filter }, () => {
            this.filter();
        });
    };

    // This filter works with Name, Address, City, Phone and ContactName
    filter = () => {
        let clientList = [];
        if (this.state.filter === '') {
            this.setState({ clients: this.state.allClients });
        } else {
            this.state.allClients.forEach(item => {
                const filterText = this.state.filter.toUpperCase();
                if (item.Name.toUpperCase().includes(filterText)
                    || item.Address.toUpperCase().includes(filterText)
                    || item.City.toUpperCase().includes(filterText)
                    || item.Phone.includes(filterText)
                    || item.ContactName.toUpperCase().includes(filterText)) {
                    clientList.push(item);
                }
            });
            this.setState({ clients: clientList });
        }
    };

    render() {
        return (
            <View style={style.container}>
                <NavigationBar leftIcon={'arrow-back-ios'} leftIconSize={40} pageName={'Clients List'} rightIcon={'add'}
                    rightIconSize={50} marginLeft={'2%'}
                    pressLeftIcon={() => this.props.navigation.goBack()}
                    pressRightIcon={() => this.props.navigation.navigate('ClientAddScreen', { previousScreen: 'ClientsListScreen' })}
                />
                <GPEFilter onChange={this.setFilter} />
                {this.state.loaded ?
                    <View style={[style.container, { flexDirection: 'column', flex: 5 }]}>
                        <FlatList
                            data={this.state.clients}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <ClientCard
                                        index={index}
                                        client={item}
                                    />
                                );
                            }}
                        />
                    </View>
                    :
                    <GPEActivityIndicator/>
                }
            </View>
        );
    }
}
