const {
  NominalValue,
  Suit,
  Card
} = require('./pokerEvaluate')

// face-value (A=Ace, 2-9, T=10, J=Jack, Q=Queen, K=King)
const nominalValueMapping = Object.freeze({
    "2":NominalValue.Two,
    "3":NominalValue.Three,
    "4":NominalValue.Four,
    "5":NominalValue.Five,
    "6":NominalValue.Six,
    "7":NominalValue.Seven,
    "8":NominalValue.Eight,
    "9":NominalValue.Nine,
    "T":NominalValue.Ten,
    "J":NominalValue.Jack,
    "Q":NominalValue.Queen,
    "K":NominalValue.King,
    "A":NominalValue.Ace
  })
  
  //the second character is the suit (C=Clubs, D=Diamonds, H=Hearts, S=Spades).
  const suitMapping = Object.freeze({
    "C":Suit.Clubs,
    "D":Suit.Diamonds,
    "H":Suit.Hearts,
    "S":Suit.Spades
  })
  
  const nominalValueToCodeMapping = Object.freeze({
    1:"2",
    2:"3",
    3:"4",
    4:"5",
    5:"6",
    6:"7",
    7:"8",
    8:"9",
    9:"T",
    10:"J",
    11:"Q",
    12:"K",
    13:"A"
  })
  
  //the second character is the suit (C=Clubs, D=Diamonds, H=Hearts, S=Spades).
  const suitToCodeMapping = Object.freeze({
    3:"C",
    2:"D",
    1:"H",
    4:"S"
  })
  
  const parseCard = token => {
    const codes = token.split('')
    const value = nominalValueMapping[codes[0]]
    const suit = suitMapping[codes[1]]
    return new Card(suit, value)
  }
  
  const parseLine = str => {
    const tokens = str.split(' ')
    const initCards = tokens.slice(0, 5).map( cardCode => parseCard(cardCode))
    const deskCards = tokens.slice(5, 10).map( cardCode => parseCard(cardCode))
    return [initCards, deskCards]
  }
  
  const parseFile = filename => {
    var lines = require('fs').readFileSync(filename, 'utf-8')
      .split('\n');
   
    return lines.map( line => parseLine(line))
  }
  
  const unparseCard = card => {
    const codes = []
    codes[0] = nominalValueToCodeMapping[card.nominalValue]
    codes[1] = suitToCodeMapping[card.suit]
    return codes.join('')
  }
  
  const unparseDecks = decks => {
    const firstDeck = decks[0].map(card => unparseCard(card)).join(" ")
    const secondDeck = decks[1].map(card => unparseCard(card)).join(" ")
     
    return [firstDeck, secondDeck]
  }
  
  const outputLine = (round, bestHand) => {
    const cards = unparseDecks(round)
    return "Hand: " + cards[0] + " Deck: " + cards[1] + " Best hand: " + bestHand
  }

  module.exports = {
    outputLine: outputLine,
    parseFile: parseFile,
    parseLine: parseLine,
    unparseDecks: unparseDecks
  }