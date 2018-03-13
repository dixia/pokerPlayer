const {PokerEvaluator,
  Card,
  Suit,
  Hand,
  NominalValue,
  run
} = require('../pokerEvaluate')

test('PokerEvaluator is defined', () => {

  const engine = new PokerEvaluator();
  expect(engine).toBeDefined();

});

test('evaluate one pairs', () => {

  const engine = new PokerEvaluator();

  const onePairs = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Clubs, NominalValue.Seven),
    new Card(Suit.Diamonds, NominalValue.Five),
    new Card(Suit.Spades, NominalValue.Six)
  ];
  
  const hasPair = engine._rules['hasPair'](onePairs);

  expect(hasPair).toBeTruthy();
  
  const yes = engine._rules['Pair'](onePairs);

  expect(yes).toBeTruthy();

});

test('evaluate two pairs', () => {

  const engine = new PokerEvaluator();

  const twoPairs = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Clubs, NominalValue.Four),
    new Card(Suit.Diamonds, NominalValue.Four),
    new Card(Suit.Spades, NominalValue.Six)
  ];
  
  const isTwoPair = engine._rules['TwoPair'](twoPairs);

  expect(isTwoPair).toBeTruthy();
});

test('evaluate three of kind', () => {

  const engine = new PokerEvaluator();

  const hands = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Clubs, NominalValue.Two),
    new Card(Suit.Diamonds, NominalValue.Four),
    new Card(Suit.Spades, NominalValue.Six)
  ];
  
  const yes = engine._rules['ThreeOfKind'](hands);

  expect(yes).toBeTruthy();
});

test('evaluate four of kind', () => {

  const engine = new PokerEvaluator();

  const hands = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Clubs, NominalValue.Two),
    new Card(Suit.Diamonds, NominalValue.Two),
    new Card(Suit.Spades, NominalValue.Six)
  ];
  
  const yes = engine._rules['FourOfKind'](hands);

  expect(yes).toBeTruthy();
});

test('evaluate full house', () => {

  const engine = new PokerEvaluator();

  const hands = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Clubs, NominalValue.Two),
    new Card(Suit.Diamonds, NominalValue.Six),
    new Card(Suit.Spades, NominalValue.Six)
  ];
  
  const pair = engine._rules['hasPair'](hands);

  expect(pair).toBeTruthy();
  
  const three = engine._rules['hasThreeOfKind'](hands);

  expect(three).toBeTruthy();

  const yes = engine._rules['FullHouse'](hands);

  expect(yes).toBeTruthy();
});

test('evaluate straight', () => {

  const engine = new PokerEvaluator();

  const hands = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Three),
    new Card(Suit.Clubs, NominalValue.Four),
    new Card(Suit.Diamonds, NominalValue.Five),
    new Card(Suit.Spades, NominalValue.Six)
  ];
  
  const yes = engine._rules['Straight'](hands);

  expect(yes).toBeTruthy();
});

test('evaluate flush', () => {

  const engine = new PokerEvaluator();

  const wronghands = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Three),
    new Card(Suit.Hearts, NominalValue.Four),
    new Card(Suit.Hearts, NominalValue.Five),
    new Card(Suit.Diamonds, NominalValue.Six)
  ];

  const no = engine._rules['Flush'](wronghands);

  expect(no).toBeFalsy();

  const hands = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Three),
    new Card(Suit.Hearts, NominalValue.Four),
    new Card(Suit.Hearts, NominalValue.Five),
    new Card(Suit.Hearts, NominalValue.Six)
  ];
  
  const yes = engine._rules['Flush'](hands);

  expect(yes).toBeTruthy();
});

test('evaluate straight flush', () => {

  const engine = new PokerEvaluator();

  const NotStraightFlush = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Three),
    new Card(Suit.Hearts, NominalValue.Four),
    new Card(Suit.Hearts, NominalValue.Five),
    new Card(Suit.Hearts, NominalValue.Ten)
  ];

  const no = engine._rules['StraightFlush'](NotStraightFlush);

  expect(no).toBeFalsy();
  
  const straightFlush = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Three),
    new Card(Suit.Hearts, NominalValue.Four),
    new Card(Suit.Hearts, NominalValue.Five),
    new Card(Suit.Hearts, NominalValue.Six)
  ];

  const yes = engine._rules['StraightFlush'](straightFlush);

  expect(yes).toBeTruthy();
});

test('check hand', () => {

  const engine = new PokerEvaluator();
  
  const straightFlush = [
    new Card(Suit.Hearts, NominalValue.Ace),
    new Card(Suit.Hearts, NominalValue.King),
    new Card(Suit.Hearts, NominalValue.Queen),
    new Card(Suit.Hearts, NominalValue.Jack),
    new Card(Suit.Hearts, NominalValue.Ten)
  ];

  const yes = engine.check(straightFlush);

  expect(yes).toEqual([Hand.StraightFlush]);
});

test('check highest card', () => {

  const engine = new PokerEvaluator();
  
  const hand = [
     { suit: 3, nominalValue: 13 },
     { suit: 2, nominalValue: 12 },
     { suit: 4, nominalValue: 4 },
     { suit: 2, nominalValue: 3 },
     { suit: 4, nominalValue: 9 } 
  ];

  const yes = engine.check(hand);

  expect(yes).toEqual([0]);
});

test('rank cards', () => {

  const engine = new PokerEvaluator();
  
  const flush = [
    new Card(Suit.Spades, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Three),
    new Card(Suit.Hearts, NominalValue.Four),
    new Card(Suit.Hearts, NominalValue.Five),
    new Card(Suit.Hearts, NominalValue.Six)
  ];

  const straightFlush = [  
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Three),
    new Card(Suit.Hearts, NominalValue.Four),
    new Card(Suit.Hearts, NominalValue.Five),
    new Card(Suit.Hearts, NominalValue.Six)
  ];

  const yes = engine.rank(straightFlush, flush);

  expect(yes).toBeTruthy();
  
  //eql case?

  const hands = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Clubs, NominalValue.Two),
    new Card(Suit.Diamonds, NominalValue.Six),
    new Card(Suit.Spades, NominalValue.Six)
  ];
  
  const no = engine.rank(hands, straightFlush);

  expect(no).toBeFalsy();
});

test('rank cards 2', () => {

  const engine = new PokerEvaluator();
  
  const straightFlush = [
    new Card (Suit.Hearts, NominalValue.Ten),
    new Card (Suit.Hearts, NominalValue.Jack),
    new Card (Suit.Hearts, NominalValue.Queen),
    new Card (Suit.Hearts, NominalValue.King),
    new Card (Suit.Hearts, NominalValue.Ace)
  ];

  const highcard = [
    new Card(Suit.Hearts, NominalValue.Queen),
    new Card(Suit.Hearts, NominalValue.King),
    new Card(Suit.Hearts, NominalValue.Ace),
    new Card(Suit.Spades, NominalValue.Two),
    new Card(Suit.Spades, NominalValue.Six)
  ]

  const no = engine.rank(highcard, straightFlush);

  expect(no).toBeFalsy();

  const yes = engine.rank(straightFlush, highcard);

  expect(yes).toBeTruthy();
});

test('best', () => {

  const engine = new PokerEvaluator();
  
  const flush = [
    new Card(Suit.Spades, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Three),
    new Card(Suit.Hearts, NominalValue.Four),
    new Card(Suit.Hearts, NominalValue.Five),
    new Card(Suit.Hearts, NominalValue.Six)
  ];

  const straightFlush = [
    new Card(Suit.Hearts, NominalValue.Two),
    new Card(Suit.Hearts, NominalValue.Three),
    new Card(Suit.Hearts, NominalValue.Four),
    new Card(Suit.Hearts, NominalValue.Five),
    new Card(Suit.Hearts, NominalValue.Six)
  ];

  const yes = engine.best(engine.allHands(straightFlush, flush));
  
  expect(yes).toEqual([
      new Card(Suit.Hearts, NominalValue.Two),
      new Card(Suit.Hearts, NominalValue.Three),
      new Card(Suit.Hearts, NominalValue.Four),
      new Card(Suit.Hearts, NominalValue.Five),
      new Card(Suit.Hearts, NominalValue.Six)
  ]);
});

test('best 2', () => {

  const engine = new PokerEvaluator();
  
  const first = [
    new Card(Suit.Hearts, NominalValue.Ten),
    new Card(Suit.Hearts, NominalValue.Jack),
    new Card(Suit.Clubs, NominalValue.Queen),
    new Card(Suit.Diamonds, NominalValue.Queen),
    new Card(Suit.Spades, NominalValue.Queen)
  ];

  const second = [
    new Card(Suit.Hearts, NominalValue.Queen),
    new Card(Suit.Hearts, NominalValue.King),
    new Card(Suit.Hearts, NominalValue.Ace),
    new Card(Suit.Spades, NominalValue.Two),
    new Card(Suit.Spades, NominalValue.Six)
  ];

  const yes = engine.best(engine.allLegalHands(first, second));
  
  expect(yes).toEqual([
    new Card (Suit.Hearts, NominalValue.Ten),
    new Card (Suit.Hearts, NominalValue.Jack),
    new Card (Suit.Hearts, NominalValue.Queen),
    new Card (Suit.Hearts, NominalValue.King),
    new Card (Suit.Hearts, NominalValue.Ace)
  ]);
});

test('ranking high cards', () => {

  const engine = new PokerEvaluator();
  
  const first = [
    new Card(Suit.Spades, NominalValue.Ten),
    new Card(Suit.Diamonds, NominalValue.Jack),
    new Card(Suit.Clubs, NominalValue.Queen),
    new Card(Suit.Diamonds, NominalValue.King),
    new Card(Suit.Spades, NominalValue.Nine)
  ];

  const second = [
    new Card(Suit.Spades, NominalValue.Ten),
    new Card(Suit.Diamonds, NominalValue.Jack),
    new Card(Suit.Clubs, NominalValue.Queen),
    new Card(Suit.Diamonds, NominalValue.King),
    new Card(Suit.Spades, NominalValue.Eight)
  ];

  const yes = engine.rankHighCard(first, second);
  
  expect(yes).toBeTruthy()

  const first2 = [
    new Card(Suit.Spades, NominalValue.Ten),
    new Card(Suit.Diamonds, NominalValue.Jack),
    new Card(Suit.Clubs, NominalValue.Jack),
    new Card(Suit.Diamonds, NominalValue.King),
    new Card(Suit.Spades, NominalValue.Eight)
  ];

  const second2 = [
    new Card(Suit.Spades, NominalValue.Ten),
    new Card(Suit.Diamonds, NominalValue.Jack),
    new Card(Suit.Clubs, NominalValue.Queen),
    new Card(Suit.Diamonds, NominalValue.King),
    new Card(Suit.Spades, NominalValue.Nine)
  ];

  const no = engine.rankHighCard(first2, second2);
  
  expect(no).toBeTruthy()
});

test('run the game', () => {
  run("input","output_test")
});