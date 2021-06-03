import React, { Component } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { ClientCard } from '../components/ClientCard';
import { NavigationBar } from '../components/NavigationBar';
import { GPEFilter } from '../components/GPEFilter';
import { axios, GPEApi, style } from '../components/GPEConst';
import { GPEActivityIndicator } from '../components/GPEActivityIndicator';

export default class ChangeClientScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allClients: [],
            clients: [],
            filter: '',
            orderLines: [],
            loaded: false
        };
    }

    // When we navigate to this screen we restore the object employee and get the clientsList
    componentDidMount() {
        this.getClients();
        this.setState({ orderLines: this.props.route.params.orderLines });
    }

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

    // This filter works with Name, Address, City, Phone and ContactName
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

    render() {
        return (
            <View style={style.container}>
                <NavigationBar leftIcon={'arrow-back-ios'} leftIconSize={40} pageName={'Change Client'}
                    marginLeft={'2%'}
                    pressLeftIcon={() => this.props.navigation.goBack()} />
                <GPEFilter onChange={this.setFilter} />
                {this.state.loaded ?
                    <View style={[style.container, { flexDirection: 'column', flex: 5 }]}>
                        <FlatList
                            data={this.state.clients}
                            keyExtractor={(item) => item.ClientId.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <Pressable
                                        onPress={() => this.props.navigation.navigate('OrderConfirmsScreen', {
                                            client: item,
                                            orderLines: this.state.orderLines,
                                        })}>
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
                    <GPEActivityIndicator/>
                }
            </View>
        );
    }
}
