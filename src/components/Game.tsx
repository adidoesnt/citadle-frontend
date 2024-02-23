import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const { VITE_NODE_ENV = "PROD", VITE_API_URL = "" } = import.meta.env;
const apiUrl =
  VITE_NODE_ENV === "DEV"
    ? VITE_API_URL
    : "https://citadle-backend-c0afcab83640.herokuapp.com/city";

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
  const date = useMemo(() => new Date(), []);
  const cols = gridColsConfig[length - 1];
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [guesses, setGuesses] = useState(0);
  const [wordGuessed, setWordGuessed] = useState(false);
  const [gameState, setGameState] = useState(
    Array.from({ length: length * length }).map((_, index) => ({
      guess: null as string | null,
      letter: word[index % length].toUpperCase(),
    }))
  );

  const gameStateToEmoji = useCallback(() => {
    const emojiMap = {
      correct: "🟩",
      incorrect: "🟥",
      close: "🟨",
    };
    const rows = [];
    for (let i = 0; i < Math.sqrt(gameState.length); i++) {
      const row = gameState.slice(
        i * Math.sqrt(gameState.length),
        (i + 1) * Math.sqrt(gameState.length)
      );
      rows.push(
        row
          .map((cell) => {
            if (cell.guess === null) return;
            if (cell.guess === cell.letter) return emojiMap.correct;
            if (word.includes(cell.guess.toLowerCase())) return emojiMap.close;
            return emojiMap.incorrect;
          })
          .join("")
      );
    }
    return rows.join("\n");
  }, [gameState, word]);

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

  const handleShare = () => {
    const data = gameStateToEmoji();
    const formattedDate = date.toLocaleDateString().split("T")[0];
    const result = `Citadle - ${formattedDate}\n\n${guesses}/${length} guesses\n\n${data}`;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <>
      {copied && (
        <div>
          <p className="w-full flex text-center justify-center p-3">
            Result copied to clipboard!
          </p>
        </div>
      )}
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
            className="p-3 text-center rounded-md text-lg uppercase bg-[#3b3b3b]"
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
        <div className="flex w-full justify-center">
          <p className="flex text-center justify-center p-3">
            You guessed the city!
          </p>
          <button
            className="p-3 bg-blue-500 text-white rounded-md ml-3"
            onClick={handleShare}
          >
            Share
          </button>
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
    const res = await fetch(apiUrl);
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
