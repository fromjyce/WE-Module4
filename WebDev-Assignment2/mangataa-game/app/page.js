"use client";
import { useState } from 'react';

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A',
];

const generateDeck = () => {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      suit,
      rank,
    }))
  );
};

export default function Home() {
  const [deck, setDeck] = useState(generateDeck());
  const [players, setPlayers] = useState([]);
  const [bets, setBets] = useState({});
  const [dealer, setDealer] = useState(null);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState('');

  const shuffleDeck = () => {
    setDeck((prevDeck) => [...prevDeck.sort(() => Math.random() - 0.5)]);
    setMessage('Deck shuffled!');
  };

  const addPlayer = (name) => {
    setPlayers((prev) => [...prev, { name, score: 0 }]);
    setMessage(`${name} joined the game!`);
  };

  const placeBet = (playerName, betCard) => {
    if (bets[playerName]) {
      setMessage(`${playerName} has already placed a bet!`);
      return;
    }
    if (Object.values(bets).find((bet) => bet.rank === betCard.rank && bet.suit === betCard.suit)) {
      setMessage('Card is already bet by another player!');
      return;
    }
    setBets((prev) => ({ ...prev, [playerName]: betCard }));
    setMessage(`${playerName} placed a bet!`);
  };

  const nextRound = () => {
    if (Object.keys(bets).length === 0) {
      setMessage('No bets placed! Dealer wins this round!');
      setRound((prev) => prev + 1);
      return;
    }

    const drawnCard = deck.pop();
    setDeck([...deck]);
    let winner = null;

    Object.entries(bets).forEach(([player, betCard]) => {
      if (betCard.rank === drawnCard.rank && betCard.suit === drawnCard.suit) {
        winner = player;
      }
    });

    if (winner) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.name === winner ? { ...p, score: p.score + 1 } : p
        )
      );
      setMessage(`${winner} wins this round!`);
    } else {
      setMessage('Dealer wins this round!');
    }

    setBets({});
    setRound((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          Mangataa - Tamil Card Game
        </h1>

        <button
          onClick={shuffleDeck}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Shuffle Deck
        </button>

        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Players</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index} className="mt-1">
                {player.name} (Score: {player.score})
              </li>
            ))}
          </ul>
          <button
            onClick={() =>
              addPlayer(prompt('Enter player name:') || 'Player ' + (players.length + 1))
            }
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 mt-2"
          >
            Add Player
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Bets</h2>
          <ul>
            {Object.entries(bets).map(([player, betCard], index) => (
              <li key={index}>
                {player} bet on {betCard.rank} of {betCard.suit}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Current Dealer</h2>
          <p>{dealer || 'No dealer selected yet'}</p>
          <button
            onClick={() =>
              setDealer(players[round % players.length]?.name || 'Dealer')
            }
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
          >
            Select Dealer
          </button>
        </div>

        <button
          onClick={nextRound}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 mt-4"
        >
          Next Round
        </button>

        <p className="mt-6 text-lg">{message}</p>
      </div>
    </div>
  );
}