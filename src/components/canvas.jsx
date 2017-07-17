import React from 'react';
import _ from 'lodash';

import './canvas.css';

let worlds = [];
/**
 * Main Canvas
 */
class Canvas extends React.Component {
  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    const { width, height, stats } = props;
    this._handleCountryChange = this._handleCountryChange.bind(this);

    this.state = {
      width,
      height,
      activeCountryKey: 'uk'
    };
  }
  componentDidMount() {
    this._initWorld();
  }
  _initWorld() {
    const { activeCountryKey } = this.state;
    const { stats } = this.props;

    // the nodes representing lt and exec
    let positionsInLevels = [3, 10];


    const totalPositions = 8;
    const seekersPerTarget = 20;

    // probability of males and females targetting the levels (cumulative)
    // source: https://www.msci.com/documents/10199/04b6f646-d638-4878-9c61-4eb91748a82b

    // multid array to store targets
    let targets = _.map(positionsInLevels, () => []);

    let _container = this._container;

    const system = Flora.System.setup(function() {
      let world = this.add('World', {
        el: _container,
        gravity: new Flora.Vector(),
        c: 0,
        id: 'world',
        color: [255, 255, 255]
      });

      const w = world.width;
      const h = world.height;

      // create targets
      for (let i = 0; i < positionsInLevels.length; i++) {
        const level = i;
        const numNodesInThisLevel = positionsInLevels[level];
        for (let j = 0; j < numNodesInThisLevel; j++) {
          const x = (j + 1) * (w / (numNodesInThisLevel + 1));
          const y = (level + 1) * (h / (positionsInLevels.length + 1));
          const target = this.add('Walker', {
            maxSpeed: 0,
            perlin: false,
            location: new Flora.Vector(x, y),
            color: [0, 0, 0],
            borderColor: [255, 255, 255],
            borderWidth: 2,
            borderRadius: 100,
            borderStyle: 'solid',
            opacity: 0.1,
            width: w / (numNodesInThisLevel * 3),
            height: w / (numNodesInThisLevel * 3)
          });
          targets[level].push(target);
        }
      }

      for (let k = 0; k < totalPositions * seekersPerTarget; k++) {

        let targetLevel = -1;

        const male = k % 2 === 0;
        const genderKey = male ? 'male': 'female';
        const color = male ? [0, 100, 255] : [255, 127, 80];
        const r = Math.random();
        const probs = stats[genderKey][activeCountryKey];
        let radius = 0;

        // decide where agent will go
        if (r < probs[0]) {
          targetLevel = 0;
          radius = 20;
        } else if (r < probs[1]) {
          targetLevel = 1;
          radius = 10;
        }
      //   } else if (r < probs[2]) {
      //     targetLevel = 2;
      //     radius = 5;
      //  }

        const targetsInLevel = positionsInLevels[targetLevel];
        const targetIndex = _.random(0, targetsInLevel - 1);

        this.add('Agent', {
          seekTarget: targets[targetLevel][targetIndex],
          motorSpeed: 0.5 + _.random(0, 0.5, true),
          location: new Flora.Vector((w / 2) - 100 + _.random(0, 200), h - 100),
          color,
          borderRadius: 10,
          width: radius,
          height: radius,
          perlinAccelLow: -0.075 - _.random(0, 0.1, true),
          perlinAccelHigh: 0.075 + _.random(0, 0.1, true),
          flocking: true,
          maxSteeringForce: 5 + _.random(0, 10, true),
          cohesionStrength: 0.1,
          separateStrength: 1.5
        });
      }

    });
    Flora.System.loop();
  }
  _handleCountryChange(e) {

    // this.setState({
    //   activeCountryKey: e.target.value
    // });
  }
  /**
   * render - render the component
   * @return {ReactElement} markup
   */
  render() {
    const { activeCountryKey } = this.state;
    return (
      <div>
        <div className='container' ref={_container => { this._container = _container;}} />
        <p>Board patricipation in {activeCountryKey}.</p>
        <select onChange={this._handleCountryChange}>
          <option selected={activeCountryKey === 'overall'} value='overall'>Overall</option>
          <option selected={activeCountryKey === 'us'} value='us'>US</option>
          <option selected={activeCountryKey === 'uk'} value='uk'>UK</option>
          <option selected={activeCountryKey === 'france'} value='france'>France</option>
          <option selected={activeCountryKey === 'norway'} value='norway'>Norway</option>
        </select>
      </div>
    );
  }
}

export default Canvas;
