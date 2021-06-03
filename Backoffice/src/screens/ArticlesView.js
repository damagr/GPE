import * as React from 'react';
import {createRef, Fragment} from 'react';
import '../App.css';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {TabPanel, TabView} from 'primereact/tabview';
import {GPEInput} from '../components/GPEInput';
import {axios, GPEApi} from '../components/GPEConst';
import {Toast} from 'primereact/toast';

export class ArticlesView extends React.Component {
    constructor(props) {
        super(props);
        this.GPEAlert = createRef();
        this.state = {
            articles: [],
            allArticles: [],
            articleId: '',
            description: '',
            price: '',
            brand: '',
            category: '',
            iva: '',
            activeIndex: 0,
            enabled: false,
            visible: true,
            show: true,
            visibleModify: false,
        }
    }

    componentDidMount() {
        this.getArticles();
    }

    // This promise gets all articles
    getArticles = () => {
        axios.get(GPEApi + 'Articles/BackOffice').then((response) => {
            this.setState({articles: response.data});
            this.setState({allArticles: response.data});
        })
    }

    // This function call checkInputs and if every input is okay makes a put with that information
    updateArticle = () => {
        if (this.checkInputs()) {
            let article = {
                ArticleId: this.state.articleId,
                Description: this.state.description,
                Price: this.state.price,
                Brand: this.state.brand,
                Category: this.state.category,
                Iva: this.state.iva,
            }
            axios.put(GPEApi + 'Articles', article).then(response => {
                    this.visibleHandler();
                    this.getArticles();
                    this.clearInputs();
                }
            )
        } else {
            this.GPEShowError('You have to introduce all fields');
        }

    }

    // Checks if every input has a valid value
    checkInputs = () => {
        if (this.state.description == '' || this.state.price == '' ||
            this.state.brand == '' || this.state.category == '' || this.state.iva == '') {
            return false;
        } else {
            return true;
        }
    }

    // This function call checkInputs and if every input is okay makes a post with that information
    addArticle = () => {
        if (this.checkInputs()) {
            let article = {
                ArticleId: this.state.articleId,
                Description: this.state.description,
                Price: this.state.price,
                Brand: this.state.brand,
                Category: this.state.category,
                Iva: this.state.iva,
                Enabled: false,
            }
            axios.post(GPEApi + 'Articles', article).then(response => {
                    this.getArticles();
                    this.clearInputs();
                    this.setState({activeIndex: 0});
                    this.GPEShowSuccess('Article inserted');
                }
            )
        } else {
            this.GPEShowError('You have to introduce all fields');
        }
    }

    // This are the handlers we use to set every state
    articleIdHandler = (e) => {
        this.setState({articleId: e.target.value});
    }
    descriptionHandler = (e) => {
        this.setState({description: e.target.value});
    };
    priceHandler = (e) => {
        this.setState({price: e.target.value});
    };
    brandHandler = (e) => {
        this.setState({brand: e.target.value});
    };
    categoryHandler = (e) => {
        this.setState({category: e.target.value});
    };
    ivaHandler = (e) => {
        this.setState({iva: e.target.value});
    };
    filterHandler = (e) => {
        this.setState({filter: e.target.value}, () => {
            this.filter();
        });
    };

    // This filters works with ArticleId, Description, Brand, Category, Price and Iva
    filter = () => {
        let articleList = [];
        if (this.state.filter === '') {
            this.setState({articles: this.state.allArticles});
        } else {
            this.state.allArticles.forEach(element => {
                const filterText = this.state.filter.toUpperCase();
                if (element.ArticleId == (filterText) ||
                    element.Description.toUpperCase().includes(filterText) ||
                    element.Brand.toUpperCase().includes(filterText) ||
                    element.Category.toUpperCase().includes(filterText) ||
                    element.Price == (filterText) ||
                    element.Iva == (filterText)
                ) {
                    articleList.push(element);
                }
            });
            this.setState({articles: articleList});
        }
    };

    // Shows every enabled article
    showEnable = () => {
        let articleList = [];
        this.state.allArticles.forEach(element => {
            if (element.Enabled == true) {
                articleList.push(element);
            }
        });
        this.setState({articles: articleList}, () => {
            this.setState({show: !this.state.show})
        });
    };

    // Shows every not enabled article
    showDisable = () => {
        let articleList = [];
        this.state.allArticles.forEach(element => {
            if (element.Enabled == false) {
                articleList.push(element);
            }
        });
        this.setState({articles: articleList}, () => {
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
        this.setState({articleId: rowData.ArticleId});
        this.setState({description: rowData.Description});
        this.setState({price: rowData.Price});
        this.setState({brand: rowData.Brand});
        this.setState({category: rowData.Category});
        this.setState({iva: rowData.Iva});
    }
    // Clears every input value
    clearInputs = () => {
        this.setState({articleId: ''});
        this.setState({description: ''});
        this.setState({price: ''});
        this.setState({brand: ''});
        this.setState({category: ''});
        this.setState({iva: ''});
    }

    // This method is used to create a button with the call of changeArticle in onClick method, it was created to generate this in a table column,
    // and it changes it's label depending on the rowData.Enabled value
    btnActive = (rowData) => {
        return (<>{rowData.Enabled ?
            <Button label='YES' onClick={() => this.changeArticle(rowData)} className='p-button-success'/>
            :
            <Button label='NO' onClick={() => this.changeArticle(rowData)} className=' p-button-danger'/>
        }
        </>)
    }

    // This promise makes a put of the given article using it's ArticleId
    changeArticle = (article) => {
        axios.put(GPEApi + 'Articles/' + article.ArticleId).then(() => this.getArticles())
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
                    <TabPanel header='Articles'>
                        {this.state.visibleModify ?
                            <div>
                                <InputText value={this.state.articleId} disabled onChange={this.articleIdHandler}
                                           placeholder='Article ID' style={{width: '5%'}}/>
                                <InputText value={this.state.description} onChange={this.descriptionHandler}
                                           placeholder='Description'
                                           className={this.state.description == '' && 'p-invalid p-d-block'}/>
                                <InputText value={this.state.price} onChange={this.priceHandler}
                                           placeholder='Price'
                                           className={this.state.price == '' && 'p-invalid p-d-block'}/>
                                <InputText value={this.state.brand} onChange={this.brandHandler}
                                           placeholder='Brand'
                                           className={this.state.brand == '' && 'p-invalid p-d-block'}/>
                                <InputText value={this.state.category} onChange={this.categoryHandler}
                                           placeholder='Category'
                                           className={this.state.category == '' && 'p-invalid p-d-block'}/>
                                <InputText value={this.state.iva} onChange={this.ivaHandler}
                                           placeholder='Iva' className={this.state.iva == '' && 'p-invalid p-d-block'}/>
                                <Button label='Modify' icon='pi pi-send' onClick={this.updateArticle}
                                        className='p-button-secondary p-mr-2'
                                        style={{backgroundColor: '#77FF94', color: 'black'}}/>
                            </div>
                            :
                            <div>
                                <div className='flex-center'>
                                    <GPEInput onChange={this.filterHandler}/>
                                    {this.state.show ? <Button label='Show Enable' onClick={this.showEnable}
                                                               className='p-button-secondary p-mr-2' icon='pi pi-eye'
                                                               style={{backgroundColor: '#86AEC2'}}/> :
                                        <Button label='Show Disable' onClick={this.showDisable}
                                                className='p-button-secondary p-mr-2' icon='pi pi-eye'
                                                style={{backgroundColor: '#86AEC2'}}/>
                                    }
                                    <Button label='Refresh' icon='pi pi-refresh' onClick={this.getArticles}
                                            className='p-button-secondary p-mr-2'
                                            style={{backgroundColor: '#86AEC2'}}/>
                                </div>
                                <div>
                                    <DataTable value={this.state.articles}>
                                        <Column style={{textAlign: 'center'}} field='ArticleId'
                                                header='ArticleId'/>
                                        <Column style={{textAlign: 'center'}} field='Description'
                                                header='Description'/>
                                        <Column style={{textAlign: 'center'}} field='Price'
                                                header='Price'/>
                                        <Column style={{textAlign: 'center'}} field='Brand'
                                                header='Brand'/>
                                        <Column style={{textAlign: 'center'}} field='Category'
                                                header='Category'/>
                                        <Column style={{textAlign: 'center'}} field='Iva'
                                                header='Iva'/>
                                        <Column body={this.btnActive} style={{textAlign: 'center'}}
                                                field='Enabled'
                                                header='Enabled'/>
                                        <Column style={{textAlign: 'center'}} body={this.changePage}
                                                field='Modify' header='Modify'/>
                                    </DataTable>
                                </div>
                            </div>
                        }
                    </TabPanel>
                    <TabPanel header='New Articles'>
                        <div className='flex-center'>
                            <InputText value={this.state.description} onChange={this.descriptionHandler}
                                       placeholder='Description'
                                       className={this.state.description == '' && 'p-invalid p-d-block'}/>
                            <InputText value={this.state.price} onChange={this.priceHandler}
                                       placeholder='Price' className={this.state.price == '' && 'p-invalid p-d-block'}/>
                            <InputText value={this.state.brand} onChange={this.brandHandler}
                                       placeholder='Brand' className={this.state.brand == '' && 'p-invalid p-d-block'}/>
                            <InputText value={this.state.category} onChange={this.categoryHandler}
                                       placeholder='Category'
                                       className={this.state.category == '' && 'p-invalid p-d-block'}/>
                            <InputText value={this.state.iva} onChange={this.ivaHandler}
                                       placeholder='Iva' className={this.state.iva == '' && 'p-invalid p-d-block'}/>
                            <Button label=' New Lot' icon='pi pi-plus-circle' onClick={this.addArticle}
                                    className='p-button-secondary p-mr-2'
                                    style={{backgroundColor: '#77FF94', color: 'black'}}/>
                        </div>
                    </TabPanel>
                </TabView>
            </Fragment>
        )
    }
}
