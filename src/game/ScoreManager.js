const ASC_POLICY = ((a, b) => a < b);
const DESC_POLICY = ((a, b) => a > b);

class ScoreManager {
  constructor(comList){
    this.highscoreList = [];
    this.scoreListeners = [];

    this.comList = comList;
    this.orderPolicy = DESC_POLICY;

    this.defaultScores = {};
    this.primaryScore = '';
  }

  /*
  Trigger listenrs to update
  */
  triggerUpdate(){
    this.scoreListeners.forEach((val) => {
      val.update();
    });
  }

  /*
  Set if sorting on primary score should be done asc or desc
  */
  setAscOrder(doAsc){
    if(doAsc){
      this.orderPolicy = ASC_POLICY;
    } else{
      this.orderPolicy = DESC_POLICY;
    }

    this.resort();
  }

  addScoreType(name, defaultVal, primary = false){
    this.defaultScores[name] = defaultVal;

    // Add to all current players
    this.highscoreList.forEach((val, index) => {
      this.highscoreList[index][name] = defaultVal;
    });

    if(primary){
      this.primaryScore = primary;
      this.resort()
    }
  }

  /*
  Sort highscorelist based on the current orderPolicy and primaryScore
  */
  resort(){
    this.highscoreList.sort((a, b) => this.orderPolicy(a[this.primaryScore], b[this.primaryScore]));
    this.triggerUpdate();
  }

  getList(){
    return this.highscoreList;
  }


  addScoreListener(listener){
    this.scoreListeners.push(listener);
  }

  addPlayer(idTag){
    let newObj = {
      'id': idTag,
      'name': this.comList[idTag].name
    };

    // Add default values of all score types
    Object.keys(this.defaultScores).forEach((key, index) => {
      newObj[key] = this.defaultScores[key];
    });

    this.highscoreList.push(newObj);
    this.resort();
  }

  removePlayer(idTag){
    delete this.scores[idTag];
  }

  resetScore(scoreType, idTag = undefined) {
    this.highscoreList.forEach((val, index) => {
      this.highscoreList[index].score = 0;
    });

    this.triggerUpdate();
  }

  mutateScore(scoreType, idTag, muteFunc){
    if (! (scoreType in this.defaultScores)){
      throw new Error(scoreType + ' not a valid scoretype');
    }

    this.highscoreList.forEach((val, index) => {
      if(val.id === idTag){
        this.highscoreList[index].score = muteFunc(this.highscoreList[index].score);
      }
    });

    if(scoreType === this.primaryScore){
      this.resort()
    } else{
      this.triggerUpdate();
    }
  }

  addScore(scoreType, idTag, n){
    this.mutateScore(scoreType, idTag, x => x + n);
  }

  removeScore(scoreType, idTag, n, allowNegative = false){
    if(allowNegative){
      this.mutateScore(scoreType, idTag, x => x - n);
    }
    else{
      this.mutateScore(scoreType, idTag, x => Math.max(0, (x - n)));
    }
  }

  setScore(scoreType, idTag, n){
    this.mutateScore(scoreType, idTag, x => n);
  }
}

export default ScoreManager;
