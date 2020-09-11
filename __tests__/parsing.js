const {
  Card,
  Suit,
  NominalValue
} = require('../pokerEvaluate')

const {
  parseLine,
  parseFile,
  outputLine,
  unparseDecks,
} = require('../parser')

test('parsing a line', () => {

  const line = "TH JH QC QD QS QH KH AH 2S 6S"
  const cards = parseLine(line)
  
  expect(cards).toEqual(
    [
      [
        new Card(Suit.Hearts, NominalValue.Ten),
        new Card(Suit.Hearts, NominalValue.Jack),
        new Card(Suit.Clubs, NominalValue.Queen),
        new Card(Suit.Diamonds, NominalValue.Queen),
        new Card(Suit.Spades, NominalValue.Queen)
      ],
      [
        new Card(Suit.Hearts, NominalValue.Queen),
        new Card(Suit.Hearts, NominalValue.King),
        new Card(Suit.Hearts, NominalValue.Ace),
        new Card(Suit.Spades, NominalValue.Two),
        new Card(Suit.Spades, NominalValue.Six)
      ]]
  );
});

test('parsing a file', () => {

  const cards = parseFile('input_test_oneline')
  
  expect(cards).toEqual(
    [[
      [
        new Card(Suit.Hearts, NominalValue.Ten),
        new Card(Suit.Hearts, NominalValue.Jack),
        new Card(Suit.Clubs, NominalValue.Queen),
        new Card(Suit.Diamonds, NominalValue.Queen),
        new Card(Suit.Spades, NominalValue.Queen)
      ],
      [
        new Card(Suit.Hearts, NominalValue.Queen),
        new Card(Suit.Hearts, NominalValue.King),
        new Card(Suit.Hearts, NominalValue.Ace),
        new Card(Suit.Spades, NominalValue.Two),
        new Card(Suit.Spades, NominalValue.Six)
      ]
    ]]
  );
});