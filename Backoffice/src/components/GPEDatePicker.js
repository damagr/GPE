import React from 'react';
import {Calendar} from 'primereact/calendar';

export class GPEDatePicker extends React.Component {
    state = {
        date: ''
    }
    returnDate = (date) => {
        this.setState({date}, () => this.props.getDate(this.state.date));

    }

    render() {
        return (
            <div className='p-field p-col-12 p-md-4'>
                <label htmlFor='time24'>{this.props.title}</label>
                <Calendar id='time24' value={this.state.date} showIcon showTime
                          onChange={(e) => this.returnDate(e.value)}/>
            </div>
        );
    }
}
