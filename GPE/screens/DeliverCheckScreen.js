import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {NavigationBar} from '../components/NavigationBar';
import {style} from '../components/GPEConst';
import {ArticleCard} from '../components/ArticleCard';

export default class DeliverCheckScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: []
        };
    }

    // We get from VisitSalesScreen the full filled order object, which will use to render all items from the OrderLines
    componentDidMount() {
        this.setState({order: this.props.route.params.item});
    }

    render() {
        return (
            <View style={style.container}>
                <NavigationBar leftIcon={'arrow-back-ios'} leftIconSize={40} marginLeft={'2%'}
                               pressLeftIcon={() => this.props.navigation.goBack()}
                               pageName={'Checkout'} rightIcon={'arrow-forward-ios'} rightIconSize={40}
                               pressRightIcon={() => this.props.navigation.navigate('DeliverPaymentScreen', {item: this.state.order})}/>
                <View style={{marginTop: '5%'}}>
                    <FlatList
                        data={this.state.order.OrderLines}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => {
                            return (
                                <View style={{flex: 1}}>
                                    <ArticleCard getItemLine={item}/>
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
        );
    }
}
