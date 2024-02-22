import { useState } from "react";

type GameGridProps = {
  length: number;
  word: string;
};

function GameGrid({ length, word }: GameGridProps) {
  const cols = `grid-cols-${length}`;
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState(0);
  const [gameState, setGameState] = useState(
    Array.from({ length: length * length }).map((_, index) => ({
      guess: null as string | null,
      letter: word[index % length].toUpperCase(),
    }))
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length > length) return;
    setInput(value.toUpperCase());
  };

  const handleGuess = () => {
    setGuesses((prevGuess) => prevGuess + 1);
    const lettersGuessed = (guesses + 1) * length;
    const newGameState = gameState.map((element, index) => {
      if (element.guess !== null) return element;
      if (index < lettersGuessed)
        return { ...element, guess: input[index % length] };
      return element;
    });
    setGameState(newGameState);
    setInput("");
  };

  return (
    <>
      <div id="game-grid" className={`grid ${cols} gap-2`}>
        {gameState.map((element, index) => {
          const color =
            element.guess === null
              ? "bg-none"
              : element.guess === element.letter
              ? "bg-green-500"
              : "bg-red-500";
          return (
            <div
              key={index}
              className={`border border-white flex items-center justify-center rounded-sm aspect-square ${color}`}
            >
              {element.guess ?? "-"}
            </div>
          );
        })}
      </div>
      <br />
      {guesses < length && (
        <div className="w-full flex justify-center">
          <input
            className="p-3 text-center rounded-md text-lg uppercase"
            type="text"
            value={input}
            onChange={handleInputChange}
          />
          <button
            className="p-3 bg-blue-500 text-white rounded-md ml-3"
            onClick={handleGuess}
          >
            Guess
          </button>
        </div>
      )}
      <div>
        <p className="w-full flex text-center justify-center p-3">
          {guesses}/{length} guesses used.
        </p>
      </div>
    </>
  );
}

export default function Game() {
  return (
    <div className="w-full p-5">
      <GameGrid length={5} word={"delhi"} />
    </div>
  );
}
