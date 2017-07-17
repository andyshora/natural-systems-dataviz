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
      height
    };
  }
  componentDidMount() {

    // the nodes representing lt and exec
    let positionsInLevels = [1, 2, 5];

    const totalPositions = 8;
    const seekersPerTarget = 20;

    // probability of males and females targetting the levels (cumulative)
    let probabilityOfAttraction = {
      female: [0.1, 0.3, 1],
      male: [0.4, 0.7, 1]
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
            color: [100, 100, 100],
            borderRadius: 0,
            width: 50,
            height: 1
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
        const probs = probabilityOfAttraction[genderKey];

        // decide where agent will go
        if (r < probs[0]) {
          targetLevel = 0;
        } else if (r < probs[1]) {
          targetLevel = 1;
        } else if (r < probs[2]) {
          targetLevel = 2;
       }

        const targetsInLevel = positionsInLevels[targetLevel];
        const targetIndex = _.random(0, targetsInLevel - 1);

        this.add('Agent', {
          seekTarget: targets[targetLevel][targetIndex],
          motorSpeed: 0.2 + _.random(0, 2, true),
          location: new Flora.Vector((this.world.width / 2) - 100 + _.random(0, 200), this.world.height - 100),
          color,
          borderRadius: 10,
          width: 5,
          height: 5,
          perlinAccelHigh: 0.075 + _.random(0, 0.1, true)
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
    return (
      <div>.</div>
    );
  }
}

export default Canvas;
