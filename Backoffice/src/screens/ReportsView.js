import * as React from 'react';
import {Fragment} from 'react';
import '../App.css';
import {TabPanel, TabView} from 'primereact/tabview';
import {Chart} from 'primereact/chart';
import {axios, GPEApi, moment} from '../components/GPEConst'

export class ReportsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ordersDate: [],
            ordersCount: [],
            clientsDate: [],
            clientsCount: [],
        }
    }

    componentDidMount() {
        this.getOrdersDate();
        this.getOrdersCount();
        this.getClientsDate();
        this.getClientsCount();
    }

    // Here we create all our promises to charge the states and show after that the charts
    // when we receive dates we use moment js to set the spanish format
    getOrdersDate = () => {
        let newDates = [];
        axios.get(GPEApi + 'Orders/GetDates').then((response) => {
            response.data.forEach(item => newDates.push(moment(item).format('DD-MM-YYYY')) );
            this.setState({ordersDate: newDates});
        })
    }
    getOrdersCount = () => {
        axios.get(GPEApi + 'Orders/GetRegisters').then((response) => {
            this.setState({ordersCount: response.data});
        })
    }
    getClientsDate = () => {
        let newDates = [];
        axios.get(GPEApi+'Clients/GetDates').then((response) => {
            response.data.forEach(item => newDates.push(moment(item).format('DD-MM-YYYY')) );
            this.setState({clientsDate: newDates});
        })
    }
    getClientsCount = () => {
        axios.get(GPEApi+'Clients/GetRegisters').then((response) => {
            this.setState({clientsCount: response.data});
        })
    }

    render() {
        const ordersData = {
            labels: this.state.ordersDate,
            datasets: [
                {
                    label: 'Orders',
                    data: this.state.ordersCount,
                    fill: false,
                    borderColor: '#ffcc57',
                    backgroundColor: '#393e46',
                }
            ]
        };
        const clientsData = {
            labels: this.state.clientsDate,
            datasets: [
                {
                    label: 'Clients',
                    data: this.state.clientsCount,
                    fill: false,
                    borderColor: '#ffcc57',
                    backgroundColor: '#393e46'
                }
            ]
        };
        const chartOptions = {
            legend: {
                labels: {
                    fontColor: '#ffcc57'
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: '#ffcc57'
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: '#ffcc57'
                    }
                }]
            }
        }
        return (
            <Fragment>
                <TabView>
                    <TabPanel header='Orders'>
                        <div className='chart'>
                            <Chart className='chart' type='line' data={ordersData} options={chartOptions}/>
                        </div>
                    </TabPanel>
                    <TabPanel header='Clients'>
                        <div className='chart'>
                            <Chart className='chart' type='line' data={clientsData} options={chartOptions}/>
                        </div>
                    </TabPanel>
                </TabView>
            </Fragment>
        )
    }
}
