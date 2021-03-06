const ASC_POLICY = (a, b) => a - b;
const DESC_POLICY = (a, b) => b - a;

class ScoreManager {
  constructor() {
    this.highscoreList = [];
    this.scoreListeners = [];

    this.orderPolicy = DESC_POLICY;

    this.defaultScores = {};
    this.primaryScore = '';

    this.styleGuide = {};
  }

  /*
  Get a list of all the different scoretypes
  */
  getScores() {
    return Object.keys(this.defaultScores);
  }

  /*
  Trigger listenrs to update
  */
  triggerUpdate() {
    this.scoreListeners.forEach(val => {
      val.update();
    });
  }

  /*
  Set if sorting on primary score should be done asc or desc
  */
  setAscOrder(doAsc) {
    if (doAsc) {
      this.orderPolicy = ASC_POLICY;
    } else {
      this.orderPolicy = DESC_POLICY;
    }

    this.resort();
  }

  /*
  Add a new score type to be part of score tracking
  If primary is true the score list is sorted by this score value
  */
  addScoreType(name, defaultVal, primary = false) {
    this.defaultScores[name] = defaultVal;

    // Add to all current players
    this.highscoreList.forEach((val, index) => {
      this.highscoreList[index][name] = defaultVal;
    });

    if (primary) {
      this.primaryScore = name;
      this.resort();
    }
  }

  hasScoreType(name) {
    return this.defaultScores[name] !== undefined;
  }

  /*
  Sort highscorelist based on the current orderPolicy and primaryScore
  */
  resort() {
    if (this.primaryScore === '') {
      return;
    }

    const { primaryScore } = this;
    this.highscoreList.sort((a, b) => this.orderPolicy(a[primaryScore], b[primaryScore]));
    this.triggerUpdate();
  }

  /*
  Get the highscore list sorted on the primary score type
  */
  getList() {
    return this.highscoreList;
  }

  /*
  Add an object with an update() function to be called every time a score is updated
  */
  addScoreListener(listener) {
    this.scoreListeners.push(listener);
  }

  /*
  Add a new player to keep track of score for
  */
  addPlayer(playerObj) {
    const newObj = {
      id: playerObj.id,
      name: playerObj.name,
    };

    const newStyling = {
      backgroundColor: playerObj.backgroundColor,
      iconColor: playerObj.iconColor,
      iconID: playerObj.iconID,
    };

    // Add default values of all score types
    Object.keys(this.defaultScores).forEach(key => {
      newObj[key] = this.defaultScores[key];
    });

    this.highscoreList.push(newObj);
    this.styleGuide[playerObj.id] = newStyling;
    this.resort();
  }

  /*
  Remove a player to not keep counting score for
  */
  removePlayer(idTag) {
    let remId = -1;

    this.highscoreList.forEach((val, index) => {
      if (val.id === idTag) {
        remId = index;
      }
    });

    if (remId !== -1) {
      this.highscoreList.splice(remId, 1);
    }

    delete this.styleGuide[idTag];

    this.triggerUpdate();
  }

  /*
  Reset all scores of the given type to their default values
  if idTag is given only the player with the given tag has their score reset
  */
  resetScore(scoreType) {
    this.highscoreList.forEach((val, index) => {
      this.highscoreList[index][scoreType] = 0;
    });

    this.triggerUpdate();
  }

  /*
  Helper function to mutate a score according to a given function from current score to new score
  */
  mutateScore(scoreType, idTag, muteFunc) {
    if (!(scoreType in this.defaultScores)) {
      throw new Error(`${scoreType} not a valid scoretype`);
    }

    this.highscoreList.forEach((val, index) => {
      if (val.id === idTag) {
        this.highscoreList[index][scoreType] = muteFunc(this.highscoreList[index][scoreType]);
      }
    });

    if (scoreType === this.primaryScore) {
      this.resort();
    } else {
      this.triggerUpdate();
    }
  }

  /*
  Add n points to the given score
  */
  addScore(scoreType, idTag, n) {
    this.mutateScore(scoreType, idTag, x => x + n);
  }

  /*
  Remove n points to the given score
  If allowNegative is true the score is allowed to go below 0
  */
  removeScore(scoreType, idTag, n, allowNegative = false) {
    if (allowNegative) {
      this.mutateScore(scoreType, idTag, x => x - n);
    } else {
      this.mutateScore(scoreType, idTag, x => Math.max(0, x - n));
    }
  }

  /*
  Set the given score to n
  */
  setScore(scoreType, idTag, n) {
    this.mutateScore(scoreType, idTag, () => n);
  }

  /*
  Get the given score.
  */
  getScore(scoreType, idTag) {
    if (!(scoreType in this.defaultScores)) {
      throw new Error(`${scoreType} not a valid scoretype`);
    }

    let searchVal = null;

    this.highscoreList.some((val, index) => {
      if (val.id === idTag) {
        searchVal = this.highscoreList[index][scoreType];
        return true;
      }
      return false;
    });

    return searchVal;
  }
}

export default ScoreManager;
