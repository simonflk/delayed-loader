import React from 'react'
import Head from 'next/head';
import withRedux from 'next-redux-wrapper';
import { Button } from 'react-bootstrap';

import { initStore } from '../store';

// Promise that resolves after some time
const apiRequest = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export default withRedux(initStore)(() => (
    <div>
        <Head>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
        </Head>
        <DemoLoader apiDelay={ 350 } loaderDelay={ 0 } />
        <DemoLoader apiDelay={ 350 } loaderDelay={ 125 } />
        <DemoLoader apiDelay={ 350 } loaderDelay={ 250 } />
        <DemoLoader apiDelay={ 350 } loaderDelay={ 350 } />
        <DemoLoader apiDelay={ 33350 } loaderDelay={ 125 } />
    </div>
))

class DemoLoader extends React.PureComponent {
    static propTypes = {
        loaderDelay: React.PropTypes.number.isRequired,
        apiDelay: React.PropTypes.number.isRequired
    }

    state = {
        loading: false,
        counter: 0
    }

    makeRequest = async () => {
        this.setState({ loading: true })
        await apiRequest(this.props.apiDelay)
        this.setState({
            loading: false,
            counter: this.state.counter + 1
        })
    }

    render () {
        const { loaderDelay } = this.props
        const boxStyle = {
            display: "block",
            width: "80px",
            height: "80px",
            border: "1px solid black",
            textAlign: "center",
            fontSize: "60px"
        }
        return (
            <div>
                <Button bsStyle="primary" onClick={ this.makeRequest }>
                    delay { loaderDelay }ms
                </Button>
                <DelayedLoader
                    loader={ <img style={ boxStyle } src="/static/loading.gif" /> }
                    loading={ this.state.loading }
                    delay={ loaderDelay }>
                    <div style={ boxStyle }>
                        { this.state.counter }
                    </div>
                </DelayedLoader>
            </div>
        )
    }
}

class DelayedLoader extends React.PureComponent {
    static propTypes = {
        loader: React.PropTypes.element.isRequired,
        loading: React.PropTypes.bool,
        children: React.PropTypes.any,
        delay: React.PropTypes.number
    }

    static defaultProps = {
        loading: false,
        delay: 350
    }

    state = { show: false }

    componentWillMount () {
        if (this.props.loading) {
            this.delayLoader()
        }
    }

    componentWillReceiveProps (nextProps) {
        const { loading } = this.props;
        const { show } = this.state;
        if (loading !== nextProps.loading) {
            if (nextProps.loading) {
                this.delayLoader();
            } else {
                this.cancelDelay();
                this.hideLoader();
            }
        }
    }

    delayLoader () {
        this.timer = setTimeout(this.showLoader, this.props.delay)
    }

    cancelDelay () {
        clearTimeout(this.timer);
    }

    showLoader = () => this.setState({ show: true });
    hideLoader = () => this.setState({ show: false });

    render () {
        const { loader, children } = this.props
        const { show } = this.state
        return show ? loader : <div>{ children }</div>
    }
}
