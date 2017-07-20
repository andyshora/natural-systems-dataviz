import React from 'react';
import ReactDOM from 'react-dom';
import fetchJsonp from 'fetch-jsonp';
import _ from 'lodash';

import Canvas from './components/canvas';
import stats from 'data/stats';

import './styles/index.css';

const NUM_OFFICES = 5;
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

    this._setDimensions = this._setDimensions.bind(this);

    window.onresize = this._setDimensions;

  }
  _setDimensions() {
    if (this._app) {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }
  componentDidMount() {
    this._setDimensions();
  }
  render() {
    const { width, height } = this.state;

    return (
      <div className='app' ref={_app => {this._app = _app;}}>
        {
          width && (
          <div>
            <svg width={width} height={height} className='bg' xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id='bg'>
                <stop offset='0%' stopColor='rgb(0, 0, 0)' />
                <stop offset='100%' stopColor='rgb(11, 11, 11)' />
              </linearGradient>
            </defs>
            <rect className='bg__rect' width={width} height={height} x={0} y={0} fill='url(#bg)' />
            {_.times(NUM_OFFICES, i => {
              return (
                <g key={i}>
                  <rect className='office' width={100} height={height * 0.5 - 100} x={(width * 0.1) + ((i + 1) * (width * 0.8) / 6) - 50} y={height * 0.25 + 50} />
                </g>
              );
            })}
          </svg>
          <Canvas width={width} height={height} stats={stats} numOffices={NUM_OFFICES} />
          <p className='source'>Analysis based on 2015 annual reports of companies listed on each country’ main index: CAC40, FTSE100, FTSE MIB, AEX, BEL20, GDAX supervisory boards, OMX, OBX, McKinsey Women Matter report.</p>
        </div>)
      }
      </div>
    );

  }
}

ReactDOM.render(<App />, document.getElementById('root'));
