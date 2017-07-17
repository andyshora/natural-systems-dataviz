import React from 'react';
import _ from 'lodash';

/**
 * Main Canvas
 */
class Canvas extends React.Component {
  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    const { width, height } = props;

    this.state = {
      width,
      height,
      activeCountryKey: 'uk'
    };
  }
  componentDidMount() {

    // the nodes representing lt and exec
    let positionsInLevels = [3, 10];

    const { activeCountryKey } = this.state;

    const totalPositions = 8;
    const seekersPerTarget = 20;

    // probability of males and females targetting the levels (cumulative)
    // source: https://www.msci.com/documents/10199/04b6f646-d638-4878-9c61-4eb91748a82b

    let stats = {
      female: {
        overall: [0.17, 1],
        us: [0.18, 1],
        uk: [0.247, 1],
        norway: [0.375, 1],
        france: [0.34, 1]
      },
      male: {
        overall: [0.83, 1],
        us: [0.82, 1],
        uk: [0.753, 1],
        norway: [0.625, 1],
        france: [0.66, 1]
      }
    };

    // multid array to store targets
    let targets = _.map(positionsInLevels, () => []);

    Flora.System.setup(function() {
      this.world = this.add('World', {
        gravity: new Flora.Vector(),
        c: 0
      });

      // create targets
      for (let i = 0; i < positionsInLevels.length; i++) {
        const level = i;
        const numNodesInThisLevel = positionsInLevels[level];
        for (let j = 0; j < numNodesInThisLevel; j++) {
          const x = (j + 1) * (this.world.width / (numNodesInThisLevel + 1));
          const y = (level + 1) * (this.world.height / (positionsInLevels.length + 1));
          const target = this.add('Walker', {
            maxSpeed: 0,
            perlin: false,
            location: new Flora.Vector(x, y),
            color: [9, 0, 0],
            borderColor: [255, 255, 255],
            borderWidth: 2,
            borderRadius: 100,
            borderStyle: 'solid',
            opacity: 0.5,
            width: this.world.width / (numNodesInThisLevel * 3),
            height: this.world.width / (numNodesInThisLevel * 3)
          });
          targets[level].push(target);
        }
      }

      for (let k = 0; k < totalPositions * seekersPerTarget; k++) {

        let targetLevel = -1;

        const male = k % 2 === 0;
        const genderKey = male ? 'male': 'female';
        const color = male ? [0, 100, 255] : [255, 255, 0];
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
          location: new Flora.Vector((this.world.width / 2) - 100 + _.random(0, 200), this.world.height - 100),
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
  /**
   * render - render the component
   * @return {ReactElement} markup
   */
  render() {
    const { activeCountryKey } = this.state;
    return <p>Board patricipation in {activeCountryKey}.</p>;
  }
}

export default Canvas;
