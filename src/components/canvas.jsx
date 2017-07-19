import React from 'react';
import _ from 'lodash';

import './canvas.css';

let world = null;
let targets = [];
const positionsInLevels = [3, 5, 25];
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
    this._addThings = this._addThings.bind(this);
    targets = [];

    this.state = {
      width,
      height,
      activeCountryKey: 'uk',
      counts: {
        workers: {
          male: 0,
          female: 0
        },
        board: {
          male: 0,
          female: 0
        },
        exco: {
          male: 0,
          female: 0
        }
      }
    };
  }
  componentDidMount() {
    this._initWorld();
  }
  _addThings(e) {

    const num = Number.parseInt(e.target.getAttribute('data-number'));
    const typeKey = e.target.getAttribute('data-type');

    const w = world.width;
    const h = world.height;

    if (!(/workers|board|exco/.test(typeKey))){
      return;
    }

    const { activeCountryKey } = this.state;
    const { stats } = this.props;

    let targetLevel = -1;
    let radius = 8;
    const probs = stats[activeCountryKey][typeKey];
    let startX = (w / 2) - 100 + _.random(0, 200);
    let startY = h - 100;

    // establish vertical layer group for agents to target
    switch (typeKey) {
      case 'workers':
        targetLevel = 2;
        break;
      case 'board':
        targetLevel = 1;
        radius = 10;
        startY = h * 0.75;
        break;
      case 'exco':
        targetLevel = 0;
        radius = 20;
        startX = w / 2;
        startY = h / 2;
        break;
    }

    let newAdditions = {
      male: 0,
      female: 0
    };

    for (let i = 0; i < num; i++) {

      // probability will affect whether male / female
      const rand = Math.random() * 100;
      const male = rand > probs;
      const genderKey = male ? 'male': 'female';
      const color = male ? [0, 100, 255] : [255, 255, 0];
      const targetsInLevel = positionsInLevels[targetLevel];
      const targetIndex = _.random(0, targetsInLevel - 1);

      Flora.System.add('Agent', {
        seekTarget: targets[targetLevel][targetIndex],
        motorSpeed: 0.5 + _.random(0, 0.5, true),
        location: new Flora.Vector(startX, startY),
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
      newAdditions[genderKey]++;
    }
    this._addNewCounts(typeKey, newAdditions);
  }
  _addNewCounts(typeKey, newAdditions) {
    let changes = {};
    const existingCounts = this.state.counts;
    changes[typeKey] = {
      male: existingCounts[typeKey].male + newAdditions.male,
      female: existingCounts[typeKey].female + newAdditions.female
    };

    this.setState({
      counts: Object.assign(existingCounts, changes)
    });
  }
  _initWorld() {
    const { activeCountryKey } = this.state;
    const { stats } = this.props;

    // the nodes representing lt and exec
    const totalPositions = 8;
    const seekersPerTarget = 20;

    // probability of males and females targetting the levels (cumulative)
    // source: https://www.msci.com/documents/10199/04b6f646-d638-4878-9c61-4eb91748a82b

    // multid array to store targets
    targets = _.map(positionsInLevels, () => []);

    let _container = this._container;

    const system = Flora.System.setup(function() {
      // this = System
      world = this.add('World', {
        el: document.getElementById('container'),
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
          // this = System
          const target = this.add('Walker', {
            maxSpeed: 0,
            perlin: false,
            location: new Flora.Vector(x, y),
            color: [255, 255, 255],
            borderColor: [255, 255, 255],
            borderWidth: 0,
            borderRadius: 100,
            borderStyle: 'solid',
            opacity: 1,
            width: w / (numNodesInThisLevel * 3),
            height: w / (numNodesInThisLevel * 3)
          });
          targets[level].push(target);
        }
      }

      /*for (let k = 0; k < totalPositions * seekersPerTarget; k++) {

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
      }*/

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
    const { activeCountryKey, counts } = this.state;
    return (
      <div className='canvas'>
        <p>Board participation in {activeCountryKey}.</p>

        <select defaultValue={activeCountryKey} onChange={this._handleCountryChange}>
          <option value='overall'>Overall</option>
          <option value='us'>US</option>
          <option value='uk'>UK</option>
          <option value='france'>France</option>
          <option value='norway'>Norway</option>
        </select>
        <nav>
          <button data-number={10} data-type='workers' onClick={this._addThings}>Add Workers</button>
          <button data-number={10} data-type='board' onClick={this._addThings}>Add Board</button>
          <button data-number={10} data-type='exco' onClick={this._addThings}>Add Exco</button>
        </nav>
        <div id='container' className='container' ref={_container => { this._container = _container;}}>
          <div className='text--exco'>Exco</div>
          <div className='text--board'>Board</div>
          <div className='text--workers'>Workers</div>

          <div className='ratio--exco'><span className='m'>{counts.exco.male}</span> : {counts.exco.female}</div>
          <div className='ratio--board'><span className='m'>{counts.board.male}</span> : {counts.board.female}</div>
          <div className='ratio--workers'><span className='m'>{counts.workers.male}</span> : {counts.workers.female}</div>
        </div>
        <p className='source'>Analysis based on 2015 annual reports of companies listed on each country’ main index: CAC40, FTSE100, FTSE MIB, AEX, BEL20, GDAX supervisory boards, OMX, OBX, McKinsey Women Matter report.</p>
      </div>
    );
  }
}

export default Canvas;
