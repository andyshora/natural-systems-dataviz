import React from 'react';
import _ from 'lodash';

import './canvas.css';

let world = null;
let targets = [];
/**
 * Main Canvas
 */
class Canvas extends React.Component {
  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    const { width, height, stats, numOffices } = props;
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
      },
      positionsInLevels: [numOffices, numOffices, numOffices]
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

    const { activeCountryKey, positionsInLevels } = this.state;
    const { stats } = this.props;

    const probs = stats[activeCountryKey][typeKey];
    let targetLevel = -1;
    let radius = 8;
    let startX = (w / 2) - 100 + _.random(0, 200);
    let startY = h;

    // establish vertical layer group for agents to target
    switch (typeKey) {
      case 'workers':
        targetLevel = 2;
        break;
      case 'board':
        targetLevel = 1;
        radius = 10;
        break;
      case 'exco':
        targetLevel = 0;
        radius = 20;
        startX = w / 2;
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
      const color = male ? [0, 100, 255] : [255, 255, 51];
      const targetsInLevel = positionsInLevels[targetLevel];
      const targetIndex = _.random(0, targetsInLevel - 1);

      BitShadowMachine.System.add('Agent', {
        seekTarget: targets[targetLevel][targetIndex],
        motorSpeed: 0.2 + _.random(0, 0.2, true),
        location: new BitShadowMachine.Vector(startX, startY),
        color,
        width: radius,
        height: radius,
        perlinAccelLow: -0.075 - _.random(0, 0.1, true),
        perlinAccelHigh: 0.025 + _.random(0, 0.05, true),
        flocking: true,
        maxSteeringForce: 1 + _.random(0, 1, true),
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
    const { activeCountryKey, positionsInLevels } = this.state;
    const { stats, width, height } = this.props;

    // the nodes representing lt and exec
    const totalPositions = 8;
    const seekersPerTarget = 20;

    // probability of males and females targetting the levels (cumulative)
    // source: https://www.msci.com/documents/10199/04b6f646-d638-4878-9c61-4eb91748a82b

    // multid array to store targets
    targets = _.map(positionsInLevels, () => []);

    let _container = this._container;

    BitShadowMachine.System.Classes = {
      Walker: Walker,
      Agent: Agent
    };

    const system = BitShadowMachine.System.setup(function() {
      // this = System
      world = this.add('World', {
        el: document.getElementById('container'),
        gravity: new BitShadowMachine.Vector(0, 0),
        c: 0,
        id: 'world',
        color: [255, 255, 255],
        width: width * 0.8,
        height: height * 0.5,
        resolution: 4
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
          // the target zones
          const target = this.add('Walker', {
            maxSpeed: 0,
            perlin: false,
            location: new BitShadowMachine.Vector(x, y),
            color: [0, 0, 0],
            opacity: 0
          });
          targets[level].push(target);
        }
      }
    });
    BitShadowMachine.System.loop();
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
    const { width, height } = this.props;
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
        <nav className='nav'>
          <button data-number={20} data-type='workers' onClick={this._addThings}>Add Workers</button>
          <button data-number={5} data-type='board' onClick={this._addThings}>Add Board</button>
          <button data-number={3} data-type='exco' onClick={this._addThings}>Add Exco</button>
        </nav>
        <div className='text-container' style={{height: height * 0.5, width: width * 0.8}}>
          <div className='text--exco'>Exec</div>
          <div className='text--board'>Board</div>
          <div className='text--workers'>Workers</div>

          <div className='ratio--exco'><span className='m'>{counts.exco.male}</span> : {counts.exco.female} ({~~(100 * counts.exco.female / (counts.exco.female + counts.exco.male)) || ''}%)</div>

          <div className='ratio--board'><span className='m'>{counts.board.male}</span> : {counts.board.female} ({~~(100 * counts.board.female / (counts.board.female + counts.board.male)) || ''}%)</div>

          <div className='ratio--workers'><span className='m'>{counts.workers.male}</span> : {counts.workers.female} ({~~(100 * counts.workers.female / (counts.workers.female + counts.workers.male)) || ''}%)</div>
        </div>
        <div id='container' className='container' ref={_container => { this._container = _container;}} />
      </div>
    );
  }
}

export default Canvas;
