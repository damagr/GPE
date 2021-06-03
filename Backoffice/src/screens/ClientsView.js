import * as React from 'react';
import {createRef, Fragment} from 'react';
import '../App.css';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {TabPanel, TabView} from 'primereact/tabview';
import {Button} from 'primereact/button';
import {axios, GPEApi, moment} from '../components/GPEConst'
import {GPEInput} from '../components/GPEInput';
import {Toast} from 'primereact/toast';

export class ClientsView extends React.Component {
    constructor(props) {
        super(props);
        this.GPEAlert = createRef();
        this.state = {
            clients: [],
            allClients: [],
            clientId: '',
            name: '',
            email: '',
            contact: '',
            nif: '',
            phone: '',
            address: '',
            province: '',
            postalCode: '',
            city: '',
            activeIndex: 0,
            enabled: false,
            visible: true,
            show: true,
            visibleModify: false,
        }
    }

    componentDidMount() {
        this.getClients();
    }

    // This promise gets all clients
    getClients = () => {
        axios.get(GPEApi + 'Clients/BackOffice').then((response) => {
            response.data.forEach(item => {
                item.RegisterDate = moment(item.RegisterDate).format('DD/MM/YYYY');
            });

            this.setState({clients: response.data});
            this.setState({allClients: response.data});
        })
    }

    // Makes a put with the inputs values if everyInput has a valid value
    updateClient = () => {
        if (this.checkInputs()) {
            let client = {
                clientId: this.state.clientId,
                Name: this.state.name,
                Address: this.state.address,
                City: this.state.city,
                PostalCode: this.state.postalCode,
                Province: this.state.province,
                Country: 'Spain',
                Phone: this.state.phone,
                Email: this.state.email,
                NIF: this.state.nif,
                ContactName: this.state.contact,
                Enabled: this.state.enabled
            }
            axios.put(GPEApi + 'Clients', client).then(response => {
                    this.visibleHandler();
                    this.getClients();
                    this.clearInputs();
                    this.GPEShowSuccess('Client updated');
                }
            )
        } else {
            this.GPEShowError('You have to introduce all fields');
        }
    }

    // Makes a post with the inputs values if everyInput has a valid value
    addClient = () => {
        if (this.checkInputs()) {
            let client = {
                clientId: this.state.clientId,
                Name: this.state.name,
                Address: this.state.address,
                City: this.state.city,
                PostalCode: this.state.postalCode,
                Province: this.state.province,
                Country: 'Spain',
                Phone: this.state.phone,
                Email: this.state.email,
                NIF: this.state.nif,
                ContactName: this.state.contact,
                Enabled: this.state.enabled
            }
            axios.post(GPEApi + 'Clients/AddClient', client).then(response => {
                    this.getClients();
                    this.clearInputs();
                    this.setState({activeIndex: 0});
                    this.GPEShowSuccess('Client inserted');
                }
            )
        } else {
            this.GPEShowError('You have to introduce all fields');
        }
    }

    // Checks if the given NIF is correct
    checkNIF = (nif) => {
        const NIF = nif;
        const NIFLetter = NIF.substring(8, 9);
        const NIFNumber = parseInt(NIF.substring(0, 8));
        const letters = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
        const rightLetter = letters[NIFNumber % 23];
        if (NIFLetter.toUpperCase() !== rightLetter) {
            alert('Letter incorrect' + '\n' + 'Maybe the right one is this: ' + rightLetter);
            return false;
        } else {
            return true;
        }
    };

    // Checks if every input has a valid value
    checkInputs = () => {
        if (this.state.name == '' || this.state.email == '' ||
            this.state.contact == '' || this.state.nif == '' ||
            this.state.phone == '' || this.state.address == '' ||
            this.state.province == '' || this.state.postalCode == '' ||
            this.state.city == '' || !this.checkNIF(this.state.nif)) {
            return false;
        } else {
            return true;
        }
    }

    // This are the handlers we use to set every state
    nameHandler = (n) => {
        this.setState({name: n.target.value});
    };
    emailHandler = (s) => {
        this.setState({email: s.target.value});
    };
    contactHandler = (b) => {
        this.setState({contact: b.target.value});
    };
    nifHandler = (n) => {
        this.setState({nif: n.target.value});
    };
    phoneHandler = (p) => {
        this.setState({phone: p.target.value});
    };
    addressHandler = (l) => {
        this.setState({address: l.target.value});
    };
    cityHandler = (l) => {
        this.setState({city: l.target.value});
    };
    postalCodeHandler = (l) => {
        this.setState({postalCode: l.target.value});
    };
    provinceHandler = (l) => {
        this.setState({province: l.target.value});
    };
    filterHandler = (e) => {
        this.setState({filter: e.target.value}, () => {
            this.filter();
        });
    };

    // This filters works with NIF, Name, City, Province and ClientId
    filter = () => {
        let clientList = [];
        if (this.state.filter === '') {
            this.setState({clients: this.state.allClients});
        } else {
            this.state.allClients.forEach(element => {
                const filterText = this.state.filter.toUpperCase();
                if (element.NIF == (filterText) ||
                    element.Name.toUpperCase().includes(filterText) ||
                    element.City.toUpperCase().includes(filterText) ||
                    element.Province.toUpperCase().includes(filterText) ||
                    element.ClientId == (filterText)
                ) {
                    clientList.push(element);
                }
            });
            this.setState({clients: clientList});
        }
    };

    // Shows every enabled client
    showEnable = () => {
        let clientList = [];
        this.state.allClients.forEach(element => {
            if (element.Enabled == true) {
                clientList.push(element);
            }
        });
        this.setState({clients: clientList}, () => {
            this.setState({show: !this.state.show})
        });
    };

    // Shows every not enabled client
    showDisable = () => {
        let clientList = [];
        this.state.allClients.forEach(element => {
            if (element.Enabled == false) {
                clientList.push(element);
            }
        });
        this.setState({clients: clientList}, () => {
            this.setState({show: !this.state.show})
        });
    };

    // This method is used to create a button with the call of showInputs in onClick method, it was created to generate this in a table column
    changePage = (rowData) => {
        return <Button label='Modify' icon='pi pi-pencil' onClick={() => this.showInputs(rowData)}
                       className='p-button-secondary p-mr-2'
                       style={{backgroundColor: '#86AEC2'}}/>
    }

    // Changes visibleModify state to alter between the table and the inputs visibility
    visibleHandler = () => {
        this.setState({visibleModify: !this.state.visibleModify});
    }

    // Sets every input with the given values an call visibleHandler
    showInputs = (rowData) => {
        this.visibleHandler();
        this.setState({clientId: rowData.ClientId});
        this.setState({name: rowData.Name});
        this.setState({email: rowData.Email});
        this.setState({contact: rowData.ContactName});
        this.setState({nif: rowData.NIF});
        this.setState({phone: rowData.Phone});
        this.setState({address: rowData.Address});
        this.setState({city: rowData.City});
        this.setState({postalCode: rowData.PostalCode});
        this.setState({province: rowData.Province});
    }
    // Clears every input value
    clearInputs = () => {
        this.setState({name: ''});
        this.setState({email: ''});
        this.setState({contact: ''});
        this.setState({nif: ''});
        this.setState({phone: ''});
        this.setState({address: ''});
        this.setState({city: ''});
        this.setState({postalCode: ''});
        this.setState({province: ''});
    }

    // This method is used to create a button with the call of changeEnabled in onClick method, it was created to generate this in a table column,
    // and it changes it's label depending on the rowData.Enabled value
    btnActive = (rowData) => {
        return (<>{rowData.Enabled ?
            <Button label='YES' onClick={() => this.changeEnabled(rowData)} className='p-button-success'/>
            :
            <Button label='NO' onClick={() => this.changeEnabled(rowData)} className=' p-button-danger'/>
        }
        </>)
    }

    // This promise makes a put of the given client using it's ClientId
    changeEnabled = (clients) => {
        axios.put(GPEApi + 'Clients/' + clients.ClientId).then(() => this.getClients())
    }

    // Creates a GPEAlert error with the given details
    GPEShowError = (error) => {
        this.GPEAlert.current.show({severity: 'error', summary: 'Error', detail: error, life: 3000});
    }
    // Creates a GPEAlert succes with the given details
    GPEShowSuccess = (detailValue) => {
        this.GPEAlert.current.show({severity: 'success', summary: 'Done', detail: detailValue, life: 3000});
    }

    render() {
        return (
            <Fragment>
                <Toast ref={this.GPEAlert}/>
                <TabView activeIndex={this.state.activeIndex}
                         onTabChange={(e) => this.setState({activeIndex: e.index})}>
                    <TabPanel header='Clients'>
                        {this.state.visibleModify ?
                            <div className='clients-area'>
                                <InputText value={this.state.clientId} disabled
                                           placeholder='Client ID'/>
                                <InputText value={this.state.name} onChange={this.nameHandler}
                                           className={this.state.name == '' && 'p-invalid p-d-block'}
                                           placeholder='Name'/>
                                <InputText value={this.state.address} onChange={this.addressHandler}
                                           className={this.state.address == '' && 'p-invalid p-d-block'}
                                           placeholder='Address'/>
                                <InputText value={this.state.city} onChange={this.cityHandler}
                                           className={this.state.city == '' && 'p-invalid p-d-block'}
                                           placeholder='City'/>
                                <InputText value={this.state.postalCode} onChange={this.postalCodeHandler}
                                           className={this.state.postalCode == '' && 'p-invalid p-d-block'}
                                           placeholder='Code Postal'/>
                                <InputText value={this.state.province} onChange={this.provinceHandler}
                                           className={this.state.province == '' && 'p-invalid p-d-block'}
                                           placeholder='Provincie'/>
                                <InputText value={this.state.phone} onChange={this.phoneHandler}
                                           className={this.state.phone == '' && 'p-invalid p-d-block'}
                                           placeholder='Phone'/>
                                <InputText value={this.state.email} onChange={this.emailHandler}
                                           className={this.state.email == '' && 'p-invalid p-d-block'}
                                           placeholder='Email'/>
                                <InputText value={this.state.nif} onChange={this.nifHandler}
                                           className={this.state.nif == '' && 'p-invalid p-d-block'}
                                           placeholder='Nif'/>
                                <InputText value={this.state.contact} onChange={this.contactHandler}
                                           className={this.state.contact == '' && 'p-invalid p-d-block'}
                                           placeholder='ContactName'/>
                                <Button label='Modify' icon='pi pi-send' onClick={this.updateClient}
                                        className='p-button-secondary p-mr-2'
                                        style={{backgroundColor: '#77FF94', color: 'black'}}/>
                            </div>
                            :
                            <div>
                                <div className='flex-center'>
                                    <GPEInput onChange={this.filterHandler}/>
                                    {this.state.show ?
                                        <Button label='Show Enable' onClick={this.showEnable}
                                                className='p-button-secondary p-mr-2' icon='pi pi-eye'
                                                style={{backgroundColor: '#86AEC2'}}/> :
                                        <Button label='Show Disable' onClick={this.showDisable}
                                                className='p-button-secondary p-mr-2' icon='pi pi-eye'
                                                style={{backgroundColor: '#86AEC2'}}/>
                                    }
                                    <Button label='Refresh' icon='pi pi-refresh' onClick={this.getClients}
                                            className='p-button-secondary p-mr-2'
                                            style={{backgroundColor: '#86AEC2'}}/>
                                </div>
                                <div>
                                    <DataTable value={this.state.clients}>
                                        <Column field='ClientId' header='ClientId' style={{textAlign: 'center'}}/>
                                        <Column field='Name' header='Name' style={{textAlign: 'center'}}/>
                                        <Column field='Address' header='Address' style={{textAlign: 'center'}}/>
                                        <Column field='City' header='City' style={{textAlign: 'center'}}/>
                                        <Column field='Province' header='Province' style={{textAlign: 'center'}}/>
                                        <Column field='Phone' header='Phone' style={{textAlign: 'center'}}/>
                                        <Column field='NIF' header='NIF' style={{textAlign: 'center'}}/>
                                        <Column field='ContactName' header='ContactName' style={{textAlign: 'center'}}/>
                                        <Column field='RegisterDate' header='RegisterDate'
                                                style={{textAlign: 'center'}}/>
                                        <Column body={this.btnActive} style={{textAlign: 'center'}} field='Enabled'
                                                header='Enabled'/>
                                        <Column style={{textAlign: 'center'}} body={this.changePage} field='Modify'
                                                header='Modify'/>
                                    </DataTable>
                                </div>
                            </div>}
                    </TabPanel>
                    <TabPanel header='Add New Client'>
                        <div className='clients-area'>
                            <InputText value={this.state.name} onChange={this.nameHandler}
                                       className={this.state.name == '' && 'p-invalid p-d-block'}
                                       placeholder='Name'/>
                            <InputText value={this.state.address} onChange={this.addressHandler}
                                       className={this.state.address == '' && 'p-invalid p-d-block'}
                                       placeholder='Address'/>
                            <InputText value={this.state.city} onChange={this.cityHandler}
                                       className={this.state.city == '' && 'p-invalid p-d-block'}
                                       placeholder='City'/>
                            <InputText value={this.state.postalCode} onChange={this.postalCodeHandler}
                                       className={this.state.postalCode == '' && 'p-invalid p-d-block'}
                                       placeholder='Code Postal'/>
                            <InputText value={this.state.province} onChange={this.provinceHandler}
                                       className={this.state.province == '' && 'p-invalid p-d-block'}
                                       placeholder='Provincie'/>
                            <InputText value={this.state.phone} onChange={this.phoneHandler}
                                       className={this.state.phone == '' && 'p-invalid p-d-block'}
                                       placeholder='Phone'/>
                            <InputText value={this.state.email} onChange={this.emailHandler}
                                       className={this.state.email == '' && 'p-invalid p-d-block'}
                                       placeholder='Email'/>
                            <InputText value={this.state.nif} onChange={this.nifHandler}
                                       className={this.state.nif == '' && 'p-invalid p-d-block'}
                                       placeholder='Nif'/>
                            <InputText value={this.state.contact} onChange={this.contactHandler}
                                       className={this.state.contact == '' && 'p-invalid p-d-block'}
                                       placeholder='ContactName'/>
                            <Button label=' New Client' icon='pi pi-plus-circle' onClick={this.addClient}
                                    className='p-button-secondary p-mr-2'
                                    style={{backgroundColor: '#77FF94', color: 'black'}}/>
                        </div>
                    </TabPanel>
                </TabView>
            </Fragment>
        )
    }

}
