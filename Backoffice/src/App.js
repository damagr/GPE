import './App.css';
import 'primereact/resources/themes/arya-orange/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import * as React from 'react';
import {HashRouter, NavLink, Route, Switch} from 'react-router-dom';
import {LotsView} from './screens/LotsView';
import {ArticlesView} from './screens/ArticlesView';
import {ReportsView} from './screens/ReportsView';
import {ClientsView} from './screens/ClientsView';
import {EmployeesView} from "./screens/EmployeesView";
import {OrdersView} from "./screens/OrdersView";
import gpe from "./assets/gpe.png"

export default class App extends React.Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <div style={{display:"flex", flexDirection:'row'}}>
                        <div style={{marginRight:'8%', marginLeft:'1%', marginTop:'1%', marginBottom: '1%'}}>
                        <img src={gpe} alt='logo'/>
                        </div>
                        <nav style={{display: 'flex',flexDirection: 'row', alignItems: 'flex-end'}}>
                            <NavLink to='/articles' activeClassName='selectedLink' className='nav-link'>
                                Articles
                            </NavLink>
                            <NavLink to='/lots' activeClassName='selectedLink' className='nav-link'>
                                Lots
                            </NavLink>
                            <NavLink to='/orders' activeClassName='selectedLink' className='nav-link'>
                                Orders
                            </NavLink>
                            <NavLink to='/clients' activeClassName='selectedLink' className='nav-link'>
                                Clients
                            </NavLink>
                            <NavLink to='/employees' activeClassName='selectedLink' className='nav-link'>
                                Employees
                            </NavLink>
                            <NavLink to='/reports' activeClassName='selectedLink' className='nav-link'>
                                Reports
                            </NavLink>
                        </nav>
                    </div>
                    <div>
                        <Switch>
                            <Route path='/articles'>
                                <ArticlesView/>
                            </Route>
                            <Route path='/lots'>
                                <LotsView/>
                            </Route>
                            <Route path='/orders'>
                                <OrdersView/>
                            </Route>
                            <Route path='/clients'>
                                <ClientsView/>
                            </Route>
                            <Route path='/employees'>
                                <EmployeesView/>
                            </Route>
                            <Route path='/reports'>
                                <ReportsView/>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </HashRouter>
        );
    }
}
