// var fs = require('fs');

class InstanceNameHandler {
  // This constructor will be used when we implement the random name generator.
  /* eslint-disable no-useless-constructor */
  constructor() {
    /* eslint-enable no-useless-constructor */
    /*
    // Load in nouns
    fs.readFile('InstanceWordsNouns.txt', (err, data) => {
      if (err) throw err;
      this.nouns = `${data}`.split('\n');
      for (let i = this.nouns.length - 1; i >= 0; i -= 1) {
        // Sometimes there are empty strings in the list. Remove them
        if (this.nouns[i] === '') {
          this.nouns.splice(i, 1);
        }
      }
    });

    // Load in adjectives
    fs.readFile('InstanceWordsAdjectives.txt', (err, data) => {
      if (err) throw err;
      this.adjectives = `${data}`.split('\n');
      for (let i = this.adjectives.length - 1; i >= 0; i -= 1) {
        // Sometimes there are empty strings in the list. Remove them
        if (this.adjectives[i] === '') {
          this.adjectives.splice(i, 1);
        }
      }
    });
    this.getRandomItemFromList = this.getRandomItemFromList.bind(this);
    this.getRandomInstaneName = this.getRandomInstanceName.bind(this);
    */
  }

  /*
   * returns a random item from a given list.
   */
  /* eslint-disable class-methods-use-this */
  getRandomItemFromList(list) {
    /* eslint-enable class-methods-use-this */

    return list[Math.floor(Math.random() * list.length)];
  }

  /*
   * returns a random instance name from a list of adjectives and nouns.
   */
  /* eslint-disable class-methods-use-this */
  getRandomInstanceName() {
    /* eslint-enable class-methods-use-this */
    return 'FierceCastle'; // this.getRandomItemFromList(this.adjectives) + this.getRandomItemFromList(this.nouns);
  }
}

export default InstanceNameHandler;
