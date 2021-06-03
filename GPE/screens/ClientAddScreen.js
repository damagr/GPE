import React, {Component} from 'react';
import {ScrollView, View} from 'react-native';
import {NavigationBar} from '../components/NavigationBar';
import {GPEInput} from '../components/GPEInput';
import {GPEModal} from '../components/GPEModal';
import {axios, GPEApi, style} from '../components/GPEConst';

export default class ClientAddScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            contact: '',
            nif: '',
            phone: '',
            address: '',
            province: '',
            postalCode: '',
            city: '',
            visible: false,
        };
    }

    // All handlers used for save/remove the states inserted by the user
    nameHandler = (e) => {
        this.setState({name: e});
    };
    emailHandler = (e) => {
        this.setState({email: e});
    };
    contactHandler = (e) => {
        this.setState({contact: e});
    };
    nifHandler = (e) => {
        this.setState({nif: e});
    };
    phoneHandler = (e) => {
        this.setState({phone: e});
    };
    addressHandler = (e) => {
        this.setState({address: e});
    };
    cityHandler = (e) => {
        this.setState({city: e});
    };
    postalCodeHandler = (e) => {
        this.setState({postalCode: e});
    };
    provinceHandler = (e) => {
        this.setState({province: e});
    };

    nameRemove = () => {
        this.setState({name: ''});
    };
    emailRemove = () => {
        this.setState({email: ''});
    };
    contactRemove = () => {
        this.setState({contact: ''});
    };
    nifRemove = () => {
        this.setState({nif: ''});
    };
    phoneRemove = () => {
        this.setState({phone: ''});
    };
    addressRemove = () => {
        this.setState({address: ''});
    };
    cityRemove = () => {
        this.setState({city: ''});
    };
    postalCodeRemove = () => {
        this.setState({postalCode: ''});
    };
    provinceRemove = () => {
        this.setState({province: ''});
    };

    // Handlers used for hide/show our dialog to finally insert the new client
    showConfirm = () => {
        this.setState({visible: true});
    };
    hideConfirm = () => {
        this.setState({visible: false});
    };

    // Method used for check if the NIF is right
    checkNIF = (nif) => {
        const NIF = nif;
        const NIFLetter = NIF.substring(8, 9);
        const NIFNumber = parseInt(NIF.substring(0, 8));
        const letters = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
        const rightLetter = letters[NIFNumber % 23];

        if (NIFLetter.toUpperCase() !== rightLetter) {
            alert('Write a correct NIF\nLetter incorrect\nMaybe the right one is this: ' + rightLetter);
            return false;
        } else {
            return true;
        }
    };

    // Promise for insert in the remote server the new client and go back in navigation if this promise worked
    addNewClient = () => {
        let client = {
            'Name': this.state.name,
            'Address': this.state.address,
            'City': this.state.city,
            'PostalCode': this.state.postalCode,
            'Province': this.state.province,
            'Phone': this.state.phone,
            'Email': this.state.email,
            'NIF': this.state.nif,
            'ContactName': this.state.contact,
        };
        axios.post(GPEApi + 'Clients/AddClient', client).then(this.props.navigation.navigate(this.props.route.params.previousScreen, {client}));
    };

    // Checking empty/filled inputs, if all inputs are filled it shows a dialog to confirm if we are sure about
    // send the new client
    checkFields = () => {
        let flag = true;
        if (this.state.name === '') {
            flag = false;
        } else if (this.state.email === '') {
            flag = false;
        } else if (this.state.contact === '') {
            flag = false;
        } else if (this.state.nif === '' || this.checkNIF(this.state.nif) === false) {
            flag = false;
        } else if (this.state.phone === '' || this.state.phone.length !== 9) {
            alert('Phone requires 9 numbers');
            flag = false;
        } else if (this.state.address === '') {
            flag = false;
        } else if (this.state.province === '') {
            flag = false;
        } else if (this.state.postalCode === '' || this.state.postalCode.length !== 5) {
            alert('Postal code requires 5 numbers');
            flag = false;
        } else if (this.state.city === '') {
            flag = false;
        }

        if (flag) {
            this.showConfirm();
        } else {
            alert('Please fill all fields first');
        }
    };

    render() {
        return (
            <View style={style.container}>
                <NavigationBar leftIcon={'arrow-back-ios'} leftIconSize={40} marginLeft={'2%'}
                               pressLeftIcon={() => this.props.navigation.goBack()}
                               pageName={'Add Client'} rightIcon={'done'} rightIconSize={50}
                               pressRightIcon={this.checkFields}/>
                <GPEModal isVisible={this.state.visible} content='Do you want to add a new client?'
                          leftButtonTitle='Cancel' leftButtonPress={this.hideConfirm}
                          rightButtonTitle='Continue' rightButtonPress={this.addNewClient}/>
                <ScrollView>
                    <View style={{marginLeft: '5%', marginRight: '5%'}}>
                        <GPEInput title={'Name'} placeholder={'Name'} marginTop='5%'
                                  onChangeText={this.nameHandler} delete={this.nameRemove} value={this.state.name}/>
                        <GPEInput title={'Email'} placeholder={'Email'} marginTop='5%'
                                  onChangeText={this.emailHandler} delete={this.emailRemove} value={this.state.email}/>
                        <GPEInput title={'Contact Name'} placeholder={'Contact name'} marginTop='5%'
                                  onChangeText={this.contactHandler} delete={this.contactRemove}
                                  value={this.state.contact}/>
                        <GPEInput title={'NIF'} placeholder={'NIF'} marginTop='5%'
                                  onChangeText={this.nifHandler} delete={this.nifRemove} value={this.state.nif}/>
                        <GPEInput title={'Phone number'} placeholder={'Phone number'} marginTop='5%'
                                  keyboardType='numeric' onChangeText={this.phoneHandler}
                                  delete={this.phoneRemove} value={this.state.phone}/>
                        <GPEInput title={'City'} placeholder={'City'} marginTop='5%'
                                  onChangeText={this.cityHandler} delete={this.cityRemove} value={this.state.city}/>
                        <GPEInput title={'Postal Code'} placeholder={'Postal Code'} marginTop='5%'
                                  keyboardType='numeric'
                                  onChangeText={this.postalCodeHandler} delete={this.postalCodeRemove}
                                  value={this.state.postalCode}/>
                        <GPEInput title={'Province'} placeholder={'Province'} marginTop='5%'
                                  onChangeText={this.provinceHandler} delete={this.provinceRemove}
                                  value={this.state.province}/>
                        <GPEInput title={'Address'} placeholder={'Address'} marginTop='5%'
                                  onChangeText={this.addressHandler} delete={this.addressRemove}
                                  value={this.state.address} marginBottom='5%'/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}


