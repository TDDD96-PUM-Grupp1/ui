const nouns = [
  "Alchemist",
  "Amulet",
  "Apprentice",
  "Beast",
  "Beauty",
  "Bersek",
  "Bogeyman",
  "Brew",
  "Castle",
  "Cauldron",
  "Cave",
  "Chalice",
  "Creature",
  "Crow",
  "Curse",
];

const adjectives = [
 "Abnormal",
 "Apprentice",
 "Awful",
 "Beautiful",
 "Berserk",
 "Bewitched",
 "Bizarre",
 "Captivated",
 "Charismatic",
 "Charming",
 "Cruel",
 "Dancing",
 "Delirious",
 "Dramatic",
 "Enchanting",
 "Evil",
 "Familiar",
 "Fantastic",
 "Fascinating",
 "Fierce",
];

function getRandomFromList(list)
{
  return list[Math.floor(Math.random() * list.length)];
}
// eslint-disable-next-line
function getRandomInstanceName()
{
  return getRandomFromList(nouns) + getRandomFromList(adjectives);
}

export default getRandomInstanceName;
