import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const { VITE_API_URL: apiUrl = "", VITE_API_KEY: apiKey = "" } = import.meta
  .env;

type GameGridProps = {
  length: number;
  word: string;
};

const gridColsConfig = [
  "grid-cols-1",
  "grid-cols-2",
  "grid-cols-3",
  "grid-cols-4",
  "grid-cols-5",
  "grid-cols-6",
  "grid-cols-7",
  "grid-cols-8",
];

function GameGrid({ length, word }: GameGridProps) {
  const cols = gridColsConfig[length - 1];
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState(0);
  const [wordGuessed, setWordGuessed] = useState(false);
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

  const handleGuess = async () => {
    if (input.length !== length) return;
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
    if (input === word.toUpperCase()) {
      setWordGuessed(true);
    }
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
              : word.includes(element.guess.toLowerCase())
              ? "bg-yellow-500"
              : "bg-red-500";
          return (
            <div
              key={index}
              className={`border border-white flex items-center justify-center rounded-sm aspect-square ${color} font-bold text-lg`}
            >
              {element.guess ?? "-"}
            </div>
          );
        })}
      </div>
      <br />
      {guesses < length && !wordGuessed && (
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
      {wordGuessed && (
        <div>
          <p className="w-full flex text-center justify-center p-3">
            You guessed the city!
          </p>
        </div>
      )}
      {guesses >= length && (
        <div>
          <p className="w-full flex text-center justify-center p-3">
            Better luck next time.
          </p>
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
  const fetchWord = useCallback(async function () {
    const res = await fetch(apiUrl, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    return data;
  }, []);

  const { isPending, error, data } = useQuery({
    queryKey: ["word"],
    queryFn: fetchWord,
  });

  if (isPending) {
    return (
      <div>
        <p className="w-full flex text-center justify-center p-3">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="w-full flex text-center justify-center p-3">
          Error: {error.message}
        </p>
      </div>
    );
  }

  return (
    data.city && (
      <div className="w-full p-5">
        <GameGrid length={data.city.length} word={data.city} />
      </div>
    )
  );
}
