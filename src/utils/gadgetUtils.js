const adjectives = [
  'Silent', 'Shadow', 'Phantom', 'Ghost', 'Stealth', 'Midnight', 'Dark', 'Hidden',
  'Secret', 'Covert', 'Invisible', 'Mystic', 'Enigma', 'Quantum', 'Cyber'
];

const nouns = [
  'Nightingale', 'Kraken', 'Phoenix', 'Dragon', 'Serpent', 'Eagle', 'Wolf',
  'Raven', 'Falcon', 'Cobra', 'Viper', 'Panther', 'Tiger', 'Hawk'
];

const generateCodename = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `The ${adjective} ${noun}`;
};

const generateMissionSuccessProbability = () => {
  return Math.floor(Math.random() * (95 - 65) + 65); // Between 65% and 95%
};

const generateSelfDestructCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = {
  generateCodename,
  generateMissionSuccessProbability,
  generateSelfDestructCode
}; 