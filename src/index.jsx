import React from 'react';
import ReactDOM from 'react-dom';
import fetchJsonp from 'fetch-jsonp';
import _ from 'lodash';

import Canvas from './components/canvas';
import Office from './components/office';
import stats from 'data/stats';

import './styles/index.css';

const NUM_OFFICES = 10;
const RESOLUTION = 2;
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

    window.onresize = _.debounce(this._setDimensions, 100);

  }
  _setDimensions() {
    if (this._app) {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      }, () => {
        this._canvas.updateTargetPositions(this._getOffices());
      });
    }
  }
  _getOffices() {
    const { width, height } = this.state;

    const CHUNK_WIDTH = width / (NUM_OFFICES + 1);
    const OFFICE_WIDTH = Math.min(width / NUM_OFFICES * 2, 100);

    // calculate office positions
    // todo - this should update on a debounced resize
    const offices = _.times(NUM_OFFICES).map(i => {
      return {
        name: `Office ${i}`,
        position: [(CHUNK_WIDTH * (i + 1)) - 50, height * 0.5 - 150],
        width: OFFICE_WIDTH,
        height: 300
      }
    });

    return offices;
  }
  componentDidMount() {
    this._setDimensions();
  }
  render() {
    const { width, height } = this.state;

    const offices = this._getOffices();

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
            {offices.map((office, i) => {
              return (
                <g key={i}>
                  <Office
                    width={office.width}
                    height={office.height}
                    x={office.position[0]}
                    y={office.position[1]} />
                </g>
              );
            })}
          </svg>
          <Canvas ref={canvas => {this._canvas = canvas;}} width={width} height={height} stats={stats} offices={offices} resolution={RESOLUTION} />
          <p className='source'>Analysis based on 2015 annual reports of companies listed on each country’ main index: CAC40, FTSE100, FTSE MIB, AEX, BEL20, GDAX supervisory boards, OMX, OBX, McKinsey Women Matter report.</p>
        </div>)
      }
      </div>
    );

  }
}

ReactDOM.render(<App />, document.getElementById('root'));
