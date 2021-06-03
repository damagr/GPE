import * as React from 'react';
import { Fragment } from 'react';
import '../App.css';
import { InputText } from "primereact/inputtext";

export class GPEInput extends React.Component {
    render() {
        return (

            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={this.props.getValue} onChange={(e) => this.props.onChange(e)}
                    placeholder={this.props.getPlaceholder} placeholder="Search" />
            </span>

        )
    }
}