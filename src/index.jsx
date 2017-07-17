import React from 'react';
import ReactDOM from 'react-dom';
import fetchJsonp from 'fetch-jsonp';
import _ from 'lodash';

import Canvas from './components/canvas';
import stats from 'data/stats';

import './styles/index.css';


/**
 * Our main application
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };

  }
  componentDidMount() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  render() {
    const { width, height } = this.state;

    if (width) {
      return (
        <div className='app'>
          <Canvas width={width} height={height} stats={stats} />
        </div>
      );
    } else {
      return <div />;
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
