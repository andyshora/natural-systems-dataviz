import React from 'react';

const Office = ({ width, height, x, y }) => {

  return (
    <rect
      className='office'
      width={width}
      height={height}
      x={x}
      y={y} />
  );
};

export default Office;
