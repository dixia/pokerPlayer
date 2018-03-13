const groupBy = require('lodash.groupby');
const pickBy = require('lodash.pickby');
const uniq = require('lodash.uniq');

const _ = require('lodash');
require('lodash.combinations');

const _groupCount = object => Object.keys(object).length

const _findMinNominalValue = arr => {
  return arr
    .map(card => card.nominalValue)
    .reduce((a, b) => {
      return Math.min(a, b);
    });
}

const _findMaxNominalValue = arr => {
  return arr
    .map(card => card.nominalValue)
    .reduce((a, b) => {
      return Math.max(a, b);
    });
}

const HighCardHand = 0

const Hand = Object.freeze({
  'Pair': 1,
  'TwoPair': 2,
  'ThreeOfKind': 3,
  'Straight': 4,
  'Flush': 5,
  'FullHouse': 6,
  'FourOfKind': 7,
  'StraightFlush': 8
});

const Suit = Object.freeze({
  'Hearts': 1,
  'Diamonds': 2,
  'Clubs': 3,
  'Spades': 4
})

const NominalValue = Object.freeze({
  'Two': 1,
  'Three': 2,
  'Four': 3,
  'Five': 4,
  'Six': 5,
  'Seven': 6,
  'Eight': 7,
  'Nine': 8,
  'Ten': 9,
  'Jack': 10,
  'Queen': 11,
  'King': 12,
  'Ace': 13
})

class Card {
  constructor(suit, nominalValue) {
    this.suit = suit
    this.nominalValue = nominalValue
  }
}

class PokerEvaluator {
  constructor() {

    const groupByNominalValue = cards => groupBy(cards, 'nominalValue')

    const identicalValueEql = (cards, count) => _groupCount(pickBy(groupByNominalValue(cards), group => group.length === count))

    const hasPair = cards => identicalValueEql(cards, 2) === 1;

    const isTwoPair = cards => _groupCount(pickBy(groupByNominalValue(cards), group => group.length >= 2)) === 2;

    const isStraight = cards => {    
      const isSimpleStraight = cards => { 
        return _groupCount(groupByNominalValue(cards)) == cards.length &&
        _findMaxNominalValue(cards) - _findMinNominalValue(cards) === 4
      }

      const straight = isSimpleStraight(cards)

      if (straight) {
        return straight
      } else {
        const aceIndex = cards.findIndex( card => card.nominalValue === NominalValue.Ace);
        if (aceIndex !== -1) {
          const newCards = JSON.parse(JSON.stringify(cards)) 
          newCards[aceIndex].nominalValue = NominalValue.Two - 1;
          return isSimpleStraight(newCards)
        } else {
          return straight
        }
      }
    }

    const hasThreeOfKind = cards => identicalValueEql(cards, 3);

    const isThreeOfKind = cards => hasThreeOfKind(cards) && !hasPair(cards);

    const isFlush = cards => _groupCount(groupBy(cards, 'suit')) === 1;

    const isFourOfKind = cards => identicalValueEql(cards, 4);

    const isFullHouse = cards => hasPair(cards) && hasThreeOfKind(cards)

    const isStraightFlush = cards => isFlush(cards) && isStraight(cards)

    this._rules = {
      'group': groupByNominalValue,
      'hasPair': hasPair,
      'Pair': hasPair,
      'TwoPair': isTwoPair,
      'hasThreeOfKind': hasThreeOfKind,
      'ThreeOfKind': isThreeOfKind,
      'Straight': isStraight,
      'Flush': isFlush,
      'FullHouse': isFullHouse,
      'FourOfKind': isFourOfKind,
      'StraightFlush': isStraightFlush
    };

    this._handCodeToName = Object.freeze({
      0:'highest-card',
      1:'one-pair',
      2:'two-pairs',
      3:'three-of-a-kind',
      4:'straight',
      5:'flush',
      6:'full-house',
      7:'four-of-a-kind',
      8:'straight-flush'
    });
  }

  check(cards) {
    const hands = []
    for (const hand in Hand) {
      if (this._rules[hand](cards)) {
        hands.push(Hand[hand])
      }
    }

    if (hands.length === 0) {
      // 0 maps to highest card,
      hands.push(HighCardHand)
    }

    return [hands.sort((a,b) => a - b)[hands.length - 1]]
  }
  
  checkBest(cards) {
    const hands = this.check(cards);
    return hands[0]
  }

  rankHighCard(cards1, cards2) {
    const sortedcards1 = cards1.sort( (a,b) => a.nominalValue - b.nominalValue)
    const sortedcards2 = cards2.sort( (a,b) => a.nominalValue - b.nominalValue)

    for (let index = sortedcards1.length - 1; index > 0; index--) {
      if (sortedcards1[index].nominalValue >= sortedcards2[index].nominalValue) {
        return true
      }
    }
    return false
  }

  rank(cards1, cards2) {
    
    const rank1 = this.check(cards1);
    const rank2 = this.check(cards2);

    if ([rank1, rank2].every(rank => rank === HighCardHand)) {
      return this.rankHighCard(rank1, rank2)
    }

    return rank1 >= rank2
  }

  allLegalHands(initCards, deskCards) {
    let combinations = []
    for (let keepCount = 5; keepCount >= 0; keepCount--) {
      const newFirstDeck = _.combinations(initCards, keepCount)
      const newSecondDeck = deskCards.slice(0, 5 - keepCount)
      
      combinations = combinations.concat(_.flatten(
        newFirstDeck.map(d => {
          const dt =  this.allHands(d, newSecondDeck)
          return dt;
        })
      ))
    }
  
    return combinations
  }

  allHands(initCards, deskCards) {
    return _.combinations(initCards.concat(deskCards), 5)
  }

  best(desk) {
    return desk.reduce((init, next) => {
      return this.rank(init, next) ? init : next
    })
  }
  
  play(round) {
    let bestHand;

    round.some(deck => {
      if (this._rules['StraightFlush'](deck)) {
        bestHand = deck
        return true
      }
    })
    //TODO move to parser
    if (bestHand) {
      return this._handCodeToName[this.checkBest(bestHand)]
    }

    bestHand = this.best(this.allLegalHands(round[0], round[1]));
    
    return this._handCodeToName[this.checkBest(bestHand)]
  }
}

const run = (inputFile, outputFile) => {

  const {
    parseFile,
    outputLine
  } = require('./parser')

  const rounds = parseFile(inputFile)
  
  const content = rounds.map( round => {
    const engine = new PokerEvaluator();
    const bestHand = engine.play(round)
    return outputLine(round, bestHand)
  }).join("\n")

  require('fs').writeFileSync(outputFile, content);
}

module.exports = {
  run: run,
  PokerEvaluator: PokerEvaluator,
  Card: Card,
  Suit: Suit,
  Hand: Hand,
  NominalValue: NominalValue
}

if (require.main === module) {
  run(process.argv[2], process.argv[3])
}