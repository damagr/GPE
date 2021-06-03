import * as React from 'react';
import { Fragment} from 'react';
import '../App.css';
import {Button} from 'primereact/button';

export  class GPEButton extends  React.Component{
    render() {
        return(
            <Fragment>
                <Button label={this.props.getLabel} icon={this.props.getIcon} className={this.props.getClassName} />
            </Fragment>
        )
    }

}

