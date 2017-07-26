import React from 'react';
import _ from 'lodash';

import Person from 'components/person';

import './canvas.css';

let world = null;
/**
 * Main Canvas
 */
class Canvas extends React.Component {
  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    const { width, height, stats, offices, resolution } = props;
    this._handleCountryChange = this._handleCountryChange.bind(this);
    this._addThings = this._addThings.bind(this);
    this._targets = [];

    this.state = {
      width,
      height,
      activeCountryKey: 'uk',
      companies: this._getNewCompanies(offices.length), // to store counts for each company
      messsage: null
    };
  }
  componentDidMount() {
    this._initWorld();
  }
  _getNewCompanies(num) {
    return _.times(num).map(() => {
      return {
        totals: {
          workers: { male: 0, female: 0 },
          board: { male: 0, female: 0 },
          exco: { male: 0, female: 0 }
        },
        employees: []
      };
    });
  }
  _createPeople(num, type, country) {
    const { stats, offices } = this.props;
    const { activeCountryKey } = this.state;
    const prob = stats[country][type];

    let newAdditions = {
      male: 0,
      female: 0
    };

    let people = [];

    for (let i = 0; i < num; i++) {
      const rand = Math.random() * 100;
      const male = rand > prob;
      const gender = male ? 'male': 'female';
      const person = new Person({
        gender,
        company: _.random(0, offices.length - 1),
        type,
        country
      });

      people.push(person);
      newAdditions[gender]++;
    }

    this.setState({
      message: `Hiring ${num} people at ${type} level. In ${country}, there is a ${prob}% chance they will be female. Numbers hired: ${newAdditions.male} male${newAdditions.male === 1 ? '' : 's'} and ${newAdditions.female} female${newAdditions.female === 1 ? '' : 's'}.`
    });

    return people;
  }
  _addThings(e) {

    const num = Number.parseInt(e.target.getAttribute('data-number'));
    const typeKey = e.target.getAttribute('data-type');

    if (!(/workers|board|exco/.test(typeKey))){
      return;
    }

    const { activeCountryKey } = this.state;
    const { stats, width, height } = this.props;

    // generate some random people
    const people = this._createPeople(num, typeKey, activeCountryKey);

    const radius = 8;
    let targetLevel = 0;

    switch (typeKey) {
      case 'workers':
        targetLevel = 2;
        break;
      case 'board':
        targetLevel = 1;
        break;
      case 'exco':
        break;
    }

    for (let i = 0; i < people.length; i++) {
      const p = people[i];
      console.log(`${p.name} has just been hired. New position: ${typeKey}`);

      BitShadowMachine.System.add('Agent', {
        seekTarget: this._targets[p.company][targetLevel],
        motorSpeed: 0.2 + _.random(0, 0.2, true),
        location: new BitShadowMachine.Vector(-50, height * 0.8),
        color: p.color,
        width: radius,
        height: radius,
        perlinAccelLow: -0.075 - _.random(0, 0.1, true),
        perlinAccelHigh: 0.025 + _.random(0, 0.05, true),
        flocking: true,
        maxSteeringForce: 1 + _.random(0, 1, true),
        cohesionStrength: 0.1,
        separateStrength: 1.5
      });
    }

    // this._addNewCounts(typeKey, newAdditions);
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
    const { stats, width, height, offices, resolution } = this.props;

    let _container = this._container;
    this._targets = [];

    BitShadowMachine.System.Classes = {
      Walker: Walker,
      Agent: Agent
    };

    const _targets = this._targets;

    const system = BitShadowMachine.System.setup(function() {
      // this = System
      world = this.add('World', {
        el: document.getElementById('container'),
        gravity: new BitShadowMachine.Vector(0, 0),
        c: 0,
        id: 'world',
        color: [255, 255, 255],
        width: width,
        height: height,
        resolution
      });

      const w = world.width;
      const h = world.height;

      // create statis Walkers, which will be in the same place as the offices
      // these will be the targets of the Agents representing people

      // create targets
      for (let i = 0; i < offices.length; i++) {

        const office = offices[i];
        _targets.push([]);

        // we need to create 3 Walkers per office
        // representing the different levels in the heirarchy
        for (let level = 0; level < 3; level++) {
          const xOffset = office.width / 2;
          const yOffset = (level + 0.5) * (office.height / 3); // offset y position for each level
          const walkerPosition = [office.position[0] + xOffset, office.position[1] + yOffset];
          // console.log(`Adding office level ${level} at ${walkerPosition[0]},${walkerPosition[1]}`);
          const target = this.add('Walker', {
            maxSpeed: 0,
            perlin: false,
            location: new BitShadowMachine.Vector(walkerPosition[0] / resolution, walkerPosition[1] / resolution),
            color: [0, 255, 0],
            opacity: 0
          });
          _targets[i].push(target);
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
    const { activeCountryKey, counts, message } = this.state;
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
        </div>
        <div id='container' className='container' ref={_container => { this._container = _container;}} />
        { message && <p className='message'>{message}</p>}
      </div>
    );
  }
}

export default Canvas;
