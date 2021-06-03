import * as React from 'react';
import {createRef, Fragment} from 'react';
import '../App.css';
import {TabPanel, TabView} from 'primereact/tabview';
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from 'primereact/inputtext';
import {GPEInput} from '../components/GPEInput';
import {GPEDatePicker} from "../components/GPEDatePicker";
import {axios, GPEApi, moment} from '../components/GPEConst';

export class OrdersView extends React.Component {

    constructor(props) {
        super(props);
        this.GPEAlert = createRef();
        this.state = {
            orders: [],
            allOrders: [],
            orderLines: [],
            allOrderLines: [],
            filter: '',
            orderId: 0,
            clientId: 0,
            orderNum: 0,
            date: '',
            deliveryDate: '',
            deliverer: '',
            total: 0,
            delivered: true,
            paid: 0,
            payingMethod: '',
            employeeId: 0,
            ordersFilteredDates: [],
            showPaid: '',
            showDelivered: '',
            visibleModify: false,
            visibleModifyLines: false,
            lineId: 0,
            articleId: 0,
            lotId: '',
            description: '',
            price: 0,
            brand: '',
            category: '',
            quantity: 0,
            iva: 0,
            discount: 0,
            totalLine: 0,
        }
    }

    componentDidMount() {
        this.getOrders();
        this.getOrderLines();
    }

    // We get all orders info with this promises and save the info into our states
    getOrders = () => {
        axios.get(GPEApi + 'Orders').then((response) => {
            response.data.forEach(item => {
                item.Date = moment(item.Date).format('DD/MM/YYYY');
                item.DeliveryDate = moment(item.Date).format('DD/MM/YYYY');
            });
            this.setState({orders: response.data});
            this.setState({allOrders: response.data});
            this.setState({ordersFilteredDates: response.data});
            this.clearInputs();
        })
    }

    // Gets all orderLines and saves it in our states
    getOrderLines = (orderId) => {
        let orderLinesList = [];
        axios.get(GPEApi + 'OrderLines').then((response) => {
            response.data.forEach(o => {
                if (o.OrderId === orderId) {
                    orderLinesList.push(o);
                }
            })
            this.setState({allOrderLines: response.data});
            this.setState({orderLines: orderLinesList});
        },)
    }

    //Updates Order and OrderLine info to the db
    updateOrder = () => {
        let order = {
            OrderId: this.state.orderId,
            ClientId: this.state.clientId,
            OrderNum: this.state.orderNum,
            Date: this.state.date,
            DeliveryDate: this.state.deliveryDate,
            Deliverer: this.state.deliverer,
            Total: this.state.total,
            Delivered: this.state.delivered,
            Paid: this.state.paid,
            PayingMethod: this.state.payingMethod,
            EmployeeId: this.state.employeeId,
        }
        axios.put(GPEApi + 'Orders', order).then(response => {
                this.visibleHandler();
                this.getOrders();
                this.clearInputs();
                this.GPEShowSuccess('Order updated');
            }
        )
    }

    updateOrderLine = () => {
        let orderLine = {
            OrderId: this.state.orderId,
            LineId: this.state.lineId,
            ArticleId: this.state.articleId,
            LotId: this.state.lotId,
            Description: this.state.description,
            Price: this.state.price,
            Brand: this.state.brand,
            Category: this.state.category,
            Quantity: this.state.quantity,
            Iva: this.state.iva,
            Discount: this.state.discount,
            TotalLine: this.state.totalLine,
        }
        axios.put(GPEApi + 'OrderLines', orderLine).then(response => {
                this.visibleHandlerLines();
                this.getOrderLines(this.state.orderId)
                this.showOrderLine(this.state.orderId)
                this.GPEShowSuccess('Line updated');
            }
        )
    }

    //Filters Orders data table content
    filter = () => {
        let orderList = [];
        if (this.state.filter === '') {
            this.setState({orders: this.state.allOrders});
        } else {
            this.state.ordersFilteredDates.forEach(element => {
                const filterText = this.state.filter.toUpperCase();
                if (element.OrderId === (filterText)
                    || element.ClientId === (filterText)
                    || element.EmployeeId === (filterText)
                    || element.OrderNum.includes(filterText)
                    || element.Deliverer.toUpperCase().includes(filterText)
                    || element.Client.City.toUpperCase().includes(filterText)
                ) {
                    orderList.push(element);
                }
            });
            this.setState({orders: orderList});
        }
    };

    filterDate = () => {
        let orderList = [];
        if (this.state.date === '') {
            this.setState({orders: this.state.allOrders});
        } else {
            this.state.allOrders.forEach(element => {
                const filterDate = this.state.date;
                if (element.Date.includes(filterDate)
                    || element.DeliveryDate.includes(filterDate)) {
                    orderList.push(element);
                }
            });
            this.setState({orders: orderList});
            this.setState({ordersFilteredDates: orderList});
        }
    }

    //Returns buttons to show delivered data table
    btnActive = (rowData) => {
        return (<>{rowData.Delivered ?
            <Button label='YES' className='p-button-success'/>
            :
            <Button label='NO' className=' p-button-danger'/>
        }
        </>)
    }

    //Filters Orders by delivered
    showDelivered = () => {

        let orderList = [];
        this.state.allOrders.forEach(element => {
            if (element.Delivered === true) {
                orderList.push(element);
            }
        });
        this.setState({orders: orderList}, () => {
            this.setState({showDelivered: !this.state.showDelivered})
        });
    };
    showNotDelivered = () => {
        let orderList = [];
        this.state.allOrders.forEach(element => {
            if (element.Delivered === false) {
                orderList.push(element);
            }
        });
        this.setState({orders: orderList}, () => {
            this.setState({showDelivered: !this.state.showDelivered})
        });
    };

    //This will show the orderLines of an specific Order
    showOrderLine = (id) => {
        let orderLinesList = [];
        this.state.allOrderLines.forEach(element => {
            if (element.OrderId === id) {
                orderLinesList.push(element);
            }
        });
        this.setState({orderLines: orderLinesList});
    }

    //Returns a button to use in Orders and OrderLines data table
    modifyOrder = (rowData) => {
        return <Button label='View' icon='pi pi-eye' onClick={() => this.showInputs(rowData)}
                       className='p-button-secondary p-mr-2'
                       style={{backgroundColor: '#86AEC2'}}/>
    }
    modifyOrderLine = (rowData) => {
        return <Button label='Modify' icon='pi pi-pencil' onClick={() => this.showInputsLines(rowData)}
                       className='p-button-secondary p-mr-2'
                       style={{backgroundColor: '#86AEC2'}}/>
    }

    //This will show inputs to modify Orders
    showInputs = (rowData) => {
        this.showOrderLine(rowData.OrderId);
        this.visibleHandler();
        this.setState({orderId: rowData.OrderId});
        this.setState({clientId: rowData.ClientId});
        this.setState({orderNum: rowData.OrderNum});
        this.setState({date: rowData.Date});
        this.setState({deliveryDate: rowData.DeliveryDate});
        this.setState({total: rowData.Total});
        this.setState({deliverer: rowData.Deliverer});
        this.setState({delivered: rowData.Delivered});
        this.setState({payingMethod: rowData.PayingMethod});
        this.setState({employeeId: rowData.EmployeeId});
        this.setState({paid: rowData.Paid});
    }

    //This will show inputs to modify OrderLines
    showInputsLines = (rowData) => {
        this.visibleHandlerLines();
        this.setState({orderId: rowData.OrderId});
        this.setState({lineId: rowData.LineId});
        this.setState({articleId: rowData.ArticleId});
        this.setState({lotId: rowData.LotId});
        this.setState({description: rowData.Description});
        this.setState({price: rowData.Price});
        this.setState({brand: rowData.Brand});
        this.setState({category: rowData.Category});
        this.setState({quantity: rowData.Quantity});
        this.setState({iva: rowData.Iva})
        this.setState({discount: rowData.Discount});
        this.setState({totalLine: rowData.TotalLine});
    }

    //All the handlers we use
    filterHandler = (e) => {
        this.setState({filter: e.target.value}, () => {
            this.filter();
        });
    };
    dateFilterHandler = (e) => {
        e = moment(e).format('DD/MM/YYYY')
        this.setState({date: e}, () => this.filterDate())
    }
    visibleHandler = () => {
        this.setState({visibleModify: !this.state.visibleModify});
    }
    visibleHandlerLines = () => {
        this.setState({visibleModifyLines: !this.state.visibleModifyLines});
    }
    orderNumHandler = (e) => {
        this.setState({orderNum: e.target.value});
    }
    dateHandler = (e) => {
        this.setState({date: e.target.value});
    }
    deliveryDateHandler = (e) => {
        this.setState({deliveryDate: e.target.value});
    }
    deliveredHandler = () => {
        this.setState({delivered: !this.state.delivered});
    }
    paidHandler = (e) => {
        this.setState({paid: e.target.value})
    }
    payingMethodHandler = (e) => {
        this.setState({payingMethod: e.target.value});
    }
    lotIdHandler = (e) => {
        this.setState({lotId: e.target.value});
    }
    priceHandler = (e) => {
        this.setState({price: e.target.value});
    }
    quantityHandler = (e) => {
        this.setState({quantity: e.target.value});
    }
    discountHandler = (e) => {
        this.setState({discount: e.target.value});
    }

    //Clears all inputs used to update Orders and OrderLines
    clearInputs = () => {
        this.setState({orderId: 0});
        this.setState({clientId: 0});
        this.setState({orderNum: 0});
        this.setState({date: ''});
        this.setState({deliveryDate: ''});
        this.setState({deliverer: ''});
        this.setState({paid: 0})
        this.setState({total: 0});
        this.setState({payingMethod: ''});
        this.setState({employeeId: 0});
        this.setState({lineId: 0});
        this.setState({articleId: 0});
        this.setState({lotId: ''});
        this.setState({description: ''});
        this.setState({price: 0});
        this.setState({brand: ''});
        this.setState({category: ''});
        this.setState({quantity: 0});
        this.setState({iva: 0})
        this.setState({discount: 0});
        this.setState({totalLine: 0});
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
                <TabView>
                    <TabPanel header='Orders'>
                        {this.state.visibleModify ?
                            <div>
                                <div className='clients-area'>
                                    <InputText value={this.state.orderId} disabled/>
                                    <InputText value={this.state.clientId} disabled/>
                                    <InputText value={this.state.orderNum} disabled/>
                                    <InputText value={this.state.date} disabled/>
                                    <InputText value={this.state.deliveryDate} disabled/>
                                    <InputText value={this.state.deliverer} disabled/>
                                    <InputText value={this.state.total} disabled/>
                                    <InputText value={this.state.paid} onChange={this.paidHandler}
                                               placeholder='Paid'
                                               className={this.state.paid == '' && 'p-invalid p-d-block'}/>
                                    <InputText onChange={this.payingMethodHandler}
                                               placeholder='Paying Method'
                                               className={this.state.payingMethod == '' && 'p-invalid p-d-block'}/>
                                    <InputText value={this.state.employeeId} disabled/>
                                    {this.state.delivered ?
                                        <Button label='YES' onClick={this.deliveredHandler}
                                                className='p-button-success'/>
                                        :
                                        <Button label='NO' onClick={this.deliveredHandler}
                                                className=' p-button-danger'/>
                                    }
                                    <Button label='Modify' icon='pi pi-send' onClick={this.updateOrder}
                                            className='p-button-secondary p-mr-2'
                                            style={{backgroundColor: '#77FF94', color: 'black'}}/>
                                </div>
                                <div>
                                    <DataTable value={this.state.orderLines}>
                                        <Column style={{textAlign: 'center', width: '20%'}} field='OrderId'
                                                header='OrderId'/>
                                        <Column style={{textAlign: 'center', width: '20%'}} field='LineId'
                                                header='LineId'/>
                                        <Column style={{textAlign: 'center', width: '20%'}} field='ArticleId'
                                                header='ArticleId'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} field='LotId'
                                                header='LotId'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} field='Description'
                                                header='Description'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} field='Price'
                                                header='Price'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} field='Brand'
                                                header='Brand'/>
                                        <Column style={{textAlign: 'center', width: '10%'}} field='Category'
                                                header='Category'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} field='Quantity'
                                                header='Quantity'/>
                                        <Column style={{textAlign: 'center', width: '30%'}} field='Iva'
                                                header='Iva'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} field='Discount'
                                                header='Discount'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} field='TotalLine'
                                                header='TotalLine'/>
                                        <Column style={{textAlign: 'center', width: '25%'}}
                                                body={this.modifyOrderLine}
                                                field="Modify" header="Modify"/>
                                    </DataTable>
                                </div>
                                {this.state.visibleModifyLines ?
                                    <div className='clients-area'>
                                        <InputText value={this.state.orderId} disabled/>
                                        <InputText value={this.state.lineId} disabled/>
                                        <InputText value={this.state.articleId} disabled/>
                                        <InputText value={this.state.lotId} onChange={this.lotIdHandler}
                                                   placeholder='Lot Id'/>
                                        <InputText value={this.state.description} disabled/>
                                        <InputText value={this.state.price} onChange={this.priceHandler}
                                                   placeholder='Price'/>
                                        <InputText value={this.state.paid} disabled/>
                                        <InputText value={this.state.category} disabled/>
                                        <InputText value={this.state.quantity} onChange={this.quantityHandler}
                                                   placeholder='Quantity'/>
                                        <InputText value={this.state.iva} disabled/>
                                        <InputText value={this.state.discount} onChange={this.discountHandler}
                                                   placeholder='Discount'/>
                                        <InputText value={this.state.totalLine} disabled/>
                                        <Button label='Modify' icon='pi pi-send' onClick={this.updateOrderLine}
                                                className='p-button-secondary p-mr-2'
                                                style={{backgroundColor: '#77FF94', color: 'black'}}/>
                                    </div>
                                    : <div/>
                                }
                            </div>
                            :
                            <div>
                                <div className='flex-center'>
                                    <GPEInput onChange={this.filterHandler}/>
                                    <GPEDatePicker tittle={'Date'} getDate={this.dateFilterHandler}/>
                                    <Button label='Refresh' icon='pi pi-refresh' onClick={this.getOrders}
                                            className='p-button-secondary p-mr-2'
                                            style={{backgroundColor: '#86AEC2'}}/>

                                    {this.state.showDelivered ?
                                        <Button label='Show delivered' onClick={this.showDelivered}
                                                className='p-button-secondary p-mr-2' icon='pi pi-eye'
                                                style={{backgroundColor: '#86AEC2'}}/> :
                                        <Button label='Show not delivered' onClick={this.showNotDelivered}
                                                className='p-button-secondary p-mr-2' icon='pi pi-eye'
                                                style={{backgroundColor: '#86AEC2'}}/>
                                    }
                                </div>
                                <div>
                                    <DataTable value={this.state.orders}>
                                        <Column style={{textAlign: 'center', width: '10%'}} field='OrderId'
                                                header='OrderId'/>
                                        <Column style={{textAlign: 'center', width: '10%'}} field='ClientId'
                                                header='ClientId'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} field='OrderNum'
                                                header='OrderNum'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} field='Date' header='Date'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} field='DeliveryDate'
                                                header='DeliveryDate'/>
                                        <Column style={{textAlign: 'center', width: '10%'}} field='Deliverer'
                                                header='Deliverer'/>
                                        <Column style={{textAlign: 'center', width: '15%'}} field='Total'
                                                header='Total'/>
                                        <Column style={{textAlign: 'center', width: '15%'}} field='Paid' header='Paid'/>
                                        <Column style={{textAlign: 'center', width: '20%'}} field='PayingMethod'
                                                header='Method'/>
                                        <Column style={{textAlign: 'center', width: '20%'}} field='EmployeeId'
                                                header='EmployeeId'/>
                                        <Column style={{textAlign: 'center', width: '20%'}} field='Client.City'
                                                header='City'/>
                                        <Column body={this.btnActive} style={{textAlign: 'center', width: '10%'}}
                                                field='Delivered' header='Delivered'/>
                                        <Column style={{textAlign: 'center', width: '25%'}} body={this.modifyOrder}
                                                field="View" header="View Lines"/>
                                    </DataTable>
                                </div>
                            </div>
                        }
                    </TabPanel>
                </TabView>
            </Fragment>
        )
    }
}
