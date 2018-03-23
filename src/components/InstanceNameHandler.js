// var fs = require('fs');

class InstanceNameHandler {
  constructor() {
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
  getRandomItemFromList(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  /*
   * returns a random instance name from a list of adjectives and nouns.
   */
  getRandomInstanceName() {
    return 'FierceCastle'; // this.getRandomItemFromList(this.adjectives) + this.getRandomItemFromList(this.nouns);
  }
}

export default InstanceNameHandler;
