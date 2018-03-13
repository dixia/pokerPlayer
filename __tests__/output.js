const {
  Card,
  Suit,
  NominalValue,
  PokerEvaluator,
  run,
} = require('../pokerEvaluate')

const {
  parseLine,
  inputParsing,
  outputLine,
  unparseDecks,
} = require('../parser')

test('play a round', () => {

  const round =
    [[
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
  
  const engine = new PokerEvaluator();
  const cards = engine.play(round)

  expect(cards).toEqual("straight-flush")
});

test('play a round 2', () => {
  const round =
    [[
      new Card(Suit.Clubs, NominalValue.Ace),
      new Card(Suit.Diamonds, NominalValue.Two),
      new Card(Suit.Clubs, NominalValue.Nine),
      new Card(Suit.Spades, NominalValue.Three),
      new Card(Suit.Diamonds, NominalValue.King)
    ],
    [
      new Card(Suit.Spades, NominalValue.Five),
      new Card(Suit.Diamonds, NominalValue.Four),
      new Card(Suit.Spades, NominalValue.King),
      new Card(Suit.Spades, NominalValue.Ace),
      new Card(Suit.Clubs, NominalValue.Four)
    ]]

  const engine = new PokerEvaluator();
  const cards = engine.play(round)
  
  expect(cards).toEqual("straight")
});

test('output a round', () => {

  const round =
    [[
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

  const engine = new PokerEvaluator();
  const cards = engine.play(round)

  const cardsLine = outputLine(round, cards)

  expect(cardsLine).toEqual("Hand: TH JH QC QD QS Deck: QH KH AH 2S 6S Best hand: straight-flush")

});

test('unparse cards', () => {

  const decks =
    [[
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


  const cardsLine = unparseDecks(decks)

  expect(cardsLine).toEqual(["TH JH QC QD QS","QH KH AH 2S 6S"])

});