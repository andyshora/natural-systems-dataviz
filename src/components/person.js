import Chance from 'chance';

const chance = new Chance();

class Person {
  constructor(options) {
    const { country, gender, type, company } = options;
    this._color = gender === 'male' ? [0, 100, 255] : [255, 255, 51];
    this._company = company;
    this._country = country;
    this._gender = gender;
    this._type = type;

    // generated props
    this._name = chance.name({ gender });
    this._id = chance.guid();
  }
  get color () {
    return this._color;
  }
  get company () {
    return this._company;
  }
  get gender () {
    return this._gender;
  }
  get id () {
    return this._id;
  }
  get name () {
    return this._name;
  }
  get type () {
    return this._type;
  }
};

export default Person;
