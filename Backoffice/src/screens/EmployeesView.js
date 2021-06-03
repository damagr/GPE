import * as React from 'react';
import {createRef, Fragment} from 'react';
import '../App.css';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {TabPanel, TabView} from 'primereact/tabview';
import {Toast} from 'primereact/toast';
import {axios, GPEApi} from '../components/GPEConst'
import {GPEInput} from '../components/GPEInput';
import {Dropdown} from 'primereact/dropdown';

export class EmployeesView extends React.Component {
    constructor(props) {
        super(props);
        this.GPEAlert = createRef();
        this.state = {
            employees: [],
            allEmployees: [],
            deliverers: [],
            name: '',
            type: '',
            deliverer: '',
            enabled: false,
            types: ['Salesman', 'Deliverer'],
            enabledOptions: ['true', 'false'],
            visible: true,
            activeIndex: 0,
            employeeId: '',
            show: true,
        }
    }

    componentDidMount() {
        this.getEmployees();
    }

    //Get the data base employees information
    getEmployees = () => {
        let deliverers = [];
        axios.get(GPEApi + 'Employees/BackOffice').then((response) => {
            response.data.forEach(e => {
                if (e.Type == 'Deliverer') {
                    deliverers.push(e.Name);
                }
            });
            this.setState({deliverers});
            this.setState({employees: response.data});
            this.setState({allEmployees: response.data});
        })

    }

    //Post a new employee on data base
    addEmployee = () => {
        if (this.checkInputs()) {
            let employee = {
                Name: this.state.name,
                Type: this.state.type,
                Deliverer: this.state.deliverer,
                Enabled: false,
            }
            axios.post(GPEApi + 'Employees', employee).then(response => {
                    this.getEmployees();
                    this.clearInputs();
                    this.setState({activeIndex: 0});
                    this.GPEShowSuccess('Employee inserted');
                }
            )
        } else {
            this.GPEShowError('You have to introduce all fields')
        }
    }

    //Update the employee with a new name and new type
    updateEmployee = () => {
        if (this.checkInputs()) {
            let emp = {
                EmployeeId: this.state.employeeId,
                Name: this.state.name,
                Type: this.state.type,
                Deliverer: this.state.deliverer
            }
            axios.put(GPEApi + 'Employees', emp).then(response => {
                    this.visibleHandler();
                    this.getEmployees();
                    this.clearInputs();
                    this.GPEShowSuccess('Employee updated');
                }
            )
        } else {
            this.GPEShowError('You have to introduce all fields')
        }
    }

    //Check the enabled field and shou a green button if is true and red button if is false
    btnActive = (rowData) => {
        return (<>{rowData.Enabled ?
            <Button label='YES' onClick={() => this.changeEnabled(rowData)} className='p-button-success'/>
            :
            <Button label='NO' onClick={() => this.changeEnabled(rowData)} className=' p-button-danger'/>
        }
        </>)
    }

    changeEnabled = (employees) => {
        axios.put(GPEApi + 'Employees/ChangeState?employeeId=' + employees.EmployeeId).then(() => this.getEmployees())
    }

    //Take the value and save it in the state
    nameHandler = (e) => {
        this.setState({name: e.target.value});
    };

    //Take the value and save it in the state
    delivererHandler = (e) => {
        this.setState({deliverer: e.target.value});
    };

    //Take the value and save it in the state
    employeeIdHandler = (e) => {
        this.setState({employeeId: e.target.value});
    };

    //Take the value and save it in the state
    typeHandler = (e) => {
        if (e.target.value == 'Deliverer') {
            this.setState({type: e.target.value});
            this.setState({deliverer: ''});
        } else {
            this.setState({type: e.target.value});
        }
    };

    //Take the value and save it in the state
    enabledHandler = (e) => {
        this.setState({enabled: e.target.value});
    };
    //Show and hide the modify screen
    visibleHandler = () => {
        this.setState({visible: !this.state.visible});
    }

    //Clear inputs value
    clearInputs = () => {
        this.setState({name: ''});
        this.setState({type: ''});
        this.setState({deliverer: ''})
    }

    checkSalesMan = () => {
        if (this.state.type == 'Salesman' && this.state.deliverer != '') {
            return true;
        }
        if (this.state.type == 'Deliverer' && this.state.deliverer == '') {
            return true;
        }
        return false;
    }
    //Check if inputs are empty
    checkInputs = () => {
        if (this.state.name == '' || this.state.type == '') {
            return false;
        }
        if (this.checkSalesMan()) {
            return true;
        } else return false
    }
    //tTake the information of the actual employye and save it in the state for use it later
    showInputs = (rowData) => {
        this.visibleHandler();
        this.setState({employeeId: rowData.EmployeeId});
        this.setState({name: rowData.Name});
        this.setState({enabled: rowData.Enabled});
    }

    //Button used for go to the modify screen
    changePage = (rowData) => {
        return <Button label='Modify' icon='pi pi-pencil' onClick={() => this.showInputs(rowData)}
                       className='p-button-secondary p-mr-2'
                       style={{backgroundColor: '#86AEC2'}}/>
    }

    //Take the value and save it in the state
    filterHandler = (e) => {
        this.setState({filter: e.target.value}, () => {
            this.filter();
        });
    };

    //This function takes the input value and filter de array of information using it
    filter = () => {
        let employeeList = [];
        if (this.state.filter === '') {
            this.setState({employees: this.state.allEmployees});

        } else {
            this.state.allEmployees.forEach(element => {
                const filterText = this.state.filter.toUpperCase();
                if (element.EmployeeId == this.state.filter
                    || element.Name.toUpperCase().includes(filterText)
                    || element.Type.toUpperCase().includes(filterText)
                ) {
                    employeeList.push(element);
                }
            });
            this.setState({employees: employeeList});
        }
    };

    showEnable = () => {
        let employeeList = [];
        this.state.allEmployees.forEach(element => {
            if (element.Enabled == true) {
                employeeList.push(element);
            }
        });
        this.setState({employees: employeeList}, () => {
            this.setState({show: !this.state.show})
        });
    };

    showDisable = () => {
        let employeeList = [];
        this.state.allEmployees.forEach(element => {
            if (element.Enabled == false) {
                employeeList.push(element);
            }
        });
        this.setState({employees: employeeList}, () => {
            this.setState({show: !this.state.show})
        });
    };

    GPEShowError = (error) => {
        this.GPEAlert.current.show({severity: 'error', summary: 'Error', detail: error, life: 3000});
    }

    GPEShowSuccess = (detailValue) => {
        this.GPEAlert.current.show({severity: 'success', summary: 'Done', detail: detailValue, life: 3000});
    }

    render() {
        return (
            <Fragment>
                <Toast ref={this.GPEAlert}/>
                <TabView activeIndex={this.state.activeIndex}
                         onTabChange={(e) => this.setState({activeIndex: e.index})}>
                    <TabPanel header='Employees Filter'>
                        {this.state.visible === true ? <div>
                                <div className='flex-center'>
                                    <GPEInput onChange={this.filterHandler}/>
                                    <Button label='Refresh' icon='pi pi-refresh' onClick={this.resetStates}
                                            className='p-button-secondary p-mr-2'
                                            style={{backgroundColor: '#86AEC2'}}/>
                                    {this.state.show ?
                                        <Button label='Show Enable' onClick={this.showEnable}
                                                className='p-button-secondary p-mr-2' icon='pi pi-eye'
                                                style={{backgroundColor: '#86AEC2'}}/> :
                                        <Button label='Show Disable' onClick={this.showDisable}
                                                className='p-button-secondary p-mr-2' icon='pi pi-eye'
                                                style={{backgroundColor: '#86AEC2'}}/>
                                    }
                                </div>
                                <div>
                                    <DataTable value={this.state.employees}>
                                        <Column style={{textAlign: 'center'}} field='EmployeeId'
                                                header='EmployeeId'/>
                                        <Column style={{textAlign: 'center'}} field='Name' header='Name'/>
                                        <Column style={{textAlign: 'center'}} field='Type'
                                                header='Type'/>
                                        <Column style={{textAlign: 'center'}} field='Deliverer'
                                                header='Deliverer'/>
                                        <Column body={this.btnActive} style={{textAlign: 'center'}}
                                                field='Enabled' header='Enabled'/>
                                        <Column style={{textAlign: 'center'}} body={this.changePage}
                                                field='Modify' header='Modify'/>
                                    </DataTable>
                                </div>
                            </div> :
                            <div><InputText value={this.state.employeeId} onChange={this.employeeIdHandler} disabled
                                            placeholder='ID'/>
                                <InputText value={this.state.name} onChange={this.nameHandler}
                                           placeholder='Name'
                                           className={this.state.name == '' && 'p-invalid p-d-block'}/>
                                <Dropdown value={this.state.type} options={this.state.types}
                                          placeholder='Select Type' onChange={this.typeHandler}
                                          className={this.state.type == '' && 'p-invalid p-d-block'}/>
                                {this.state.type == 'Salesman' &&
                                <Dropdown value={this.state.deliverer} options={this.state.deliverers}
                                          placeholder='Select Deliverer' onChange={this.delivererHandler}
                                          className={this.state.type == '' && 'p-invalid p-d-block'}/>}
                                <Button label='Modify' icon='pi pi-send' onClick={this.updateEmployee}
                                        className='p-button-secondary p-mr-2'
                                        style={{backgroundColor: '#77FF94', color: 'black'}}/>

                            </div>}
                    </TabPanel>
                    <TabPanel header='New Employees'>
                        <div className='flex-center'>
                            <InputText value={this.state.name} onChange={this.nameHandler}
                                       placeholder='Name' className={this.state.name == '' && 'p-invalid p-d-block'}/>
                            <Dropdown value={this.state.type} options={this.state.types}
                                      placeholder='Select Type' onChange={this.typeHandler}
                                      className={this.state.type == '' && 'p-invalid p-d-block'}/>
                            {this.state.type == 'Salesman' &&
                            <Dropdown value={this.state.deliverer} options={this.state.deliverers}
                                      placeholder='Select Deliverer' onChange={this.delivererHandler}
                                      className={this.state.type == '' && 'p-invalid p-d-block'}/>}
                            <Button label=' New Lot' icon='pi pi-plus-circle' onClick={this.addEmployee}
                                    className='p-button-secondary p-mr-2'
                                    style={{backgroundColor: '#77FF94', color: 'black'}}/>
                        </div>
                    </TabPanel>
                </TabView>
            </Fragment>
        )
    }
}
