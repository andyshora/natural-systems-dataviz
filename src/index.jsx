import React from 'react';
import ReactDOM from 'react-dom';
import fetchJsonp from 'fetch-jsonp';
import _ from 'lodash';
// import Flora from 'florajs';

import Canvas from './components/canvas';

import './styles/index.css';

const DATA = [
  {
    country: 'UK',
    board: 0.7,
    exec: 0.1
  },
  {
    country: 'France',
    board: 0.8,
    exec: 0.1
  }
];

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

    // Flora.System.setup(function() {
    //   this.add('World', {
    //     gravity: new Flora.Vector(),
    //     c: 0
    //   });
    //   this.add('Agent', {
    //     followMouse: true
    //   });
    // });
    // Flora.System.loop();

  }
  render() {
    const { width, height } = this.state;

    if (width) {
      return (
        <div className='app'>
          <Canvas width={width} height={height} />
        </div>
      );
    } else {
      return <div />;
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
