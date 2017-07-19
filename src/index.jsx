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
          <svg width={width} height={height} viewBox={`50 50 100 100`} className='bg' xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id='bg'>
                <stop offset='0%' stopColor='rgb(10, 10, 10)' />
                <stop offset='100%' stopColor='rgb(0, 0, 0)' />
              </linearGradient>
            </defs>
            <rect className='bg__rect' width={200} height={200} x={0} y={0} fill='url(#bg)' />
          </svg>
          <Canvas width={width} height={height} stats={stats} />
        </div>
      );
    } else {
      return <div />;
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
