import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import useSound from "use-sound";
import allMatchedAudio from "../public/sounds/allMatched.flac";
import matchedAudio from "../public/sounds/matched.wav";
import misMatchedAudio from "../public/sounds/misMatched.wav";
import playAudio from "../public/sounds/play.mp3";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ home, start, playSound }) {
  const [soundState, setSoundState] = useState(() => {
    const soundFromLocalStorage = localStorage.getItem("sound");
    return soundFromLocalStorage !== null
      ? soundFromLocalStorage == "true"
      : true;
  });

  //  sync the soundstate
  useEffect(() => {
    localStorage.setItem("sound", soundState.toString());
  }, [soundState]);

  return (
    <div>
      <header className="flex justify-between p-5 items-center bg-indigo-100 shadow-sm">
        <p
          className="font-extrabold  text-xl text-indigo-400 cursor-pointer"
          onClick={home}
        >
          MEMORY
        </p>{" "}
        <div>
          {soundState ? (
            <icons.GiSoundOn
              onClick={() => setSoundState(!soundState)}
              className="h-8 w-8 cursor-pointer text-indigo-400 hover:text-indigo-500"
            />
          ) : (
            <icons.GiSoundOff
              onClick={() => setSoundState(!soundState)}
              className="h-8 w-8 cursor-pointer text-indigo-400 hover:text-indigo-500"
            />
          )}
        </div>
      </header>
      <div className="mx-auto w-96 text-center mt-10 p-10 space-y-2 ">
        <h1 className="font-bold text-indigo-400 text-4xl">Welcome!</h1>
        <p className="text-indigo-400">Test your memory with tile flip</p>
        <button
          onClick={() => {
            if (soundState) {
              playSound();
            }
            start();
          }}
          className="w-36 rounded-full font-bold bg-gradient-to-b from-indigo-500 to-transparent bg-indigo-400 text-white p-3  cursor-pointer hover:bg-gradient-to-t mt-5 self-center "
        >
          Play
        </button>
      </div>

      <div className="text-center my-10 max-w-md  mx-auto">
        <h1 className="font-bold my-5  text-indigo-400 text-xl">
          How to play?
        </h1>
        <div className="flex flex-col space-y-2 mb-10">
          <li className="bg-indigo-200 text-indigo-500 rounded-md text-start mt-2 p-2 mx-5">
            Click on the play button
          </li>
          <li className="bg-indigo-200 text-indigo-500 rounded-md text-start mt-2 p-2 mx-5">
            Click on a tile to flip
          </li>
          <li className="bg-indigo-200 text-indigo-500 rounded-md text-start mt-2 p-2 mx-5">
            Match the flipped tile by flipping another one
          </li>
          <li className="bg-indigo-200 text-indigo-500 rounded-md text-start mt-2 p-2 mx-5">
            Check your tries count
          </li>
          <li className="bg-indigo-200 text-indigo-500 rounded-md text-start mt-2 p-2 mx-5">
            The shorter the tries count the better
          </li>
        </div>
      </div>
    </div>
  );
}

export function WonScreen({ start, allMatchedAudioFn }) {
  const [soundState, setSoundState] = useState(() => {
    const soundFromLocalStorage = localStorage.getItem("sound");
    return soundFromLocalStorage !== null
      ? soundFromLocalStorage == "true"
      : true;
  });

  //  sync the soundstate
  useEffect(() => {
    localStorage.setItem("sound", soundState.toString());
  }, [soundState]);

  if (soundState) {
    allMatchedAudioFn();
  }
  return (
    <div>
      <header className="flex justify-between p-5 items-center bg-indigo-100 shadow-sm">
        <p
          className="font-extrabold  text-xl text-indigo-400 cursor-pointer"
          onClick={start}
        >
          MEMORY
        </p>{" "}
        <div>
          {soundState ? (
            <icons.GiSoundOn
              onClick={() => setSoundState(!soundState)}
              className="h-8 w-8 cursor-pointer text-indigo-400 hover:text-indigo-500"
            />
          ) : (
            <icons.GiSoundOff
              onClick={() => setSoundState(!soundState)}
              className="h-8 w-8 cursor-pointer text-indigo-400 hover:text-indigo-500"
            />
          )}
        </div>
      </header>

      <div className="flex justify-center items-center mt-40 flex-col  space-y-5">
        <h1 className="font-bold text-indigo-400 text-4xl">Congratulations!</h1>

        <p
          className="w-36 rounded-full font-bold bg-gradient-to-b from-indigo-500 to-transparent bg-indigo-400 text-white p-3 mt-2  hover:bg-gradient-to-t self-center cursor-pointer text-center "
          onClick={start}
        >
          Play Again
        </p>
      </div>
    </div>
  );
}

export function PlayScreen({ won, start }) {
  const [soundState, setSoundState] = useState(() => {
    const soundFromLocalStorage = localStorage.getItem("sound");
    return soundFromLocalStorage !== null
      ? soundFromLocalStorage == "true"
      : true;
  });

  //  sync the soundstate
  useEffect(() => {
    localStorage.setItem("sound", soundState.toString());
  }, [soundState]);

  const [playAudioFn] = useSound(playAudio);
  const [matchedAudioFn] = useSound(matchedAudio);
  const [misMatchedAudioFn] = useSound(misMatchedAudio);

  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    // play click sound when a tile is fliped
    if (soundState) {
      playAudioFn();
    }
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        // matched tile sound
        if (soundState) {
          matchedAudioFn();
        }
        confetti({
          ticks: 100,
        });
        newState = "matched";
      } else {
        // mismatched tile sound

        if (soundState) {
          misMatchedAudioFn();
        }
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(won, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <div>
      <header className="flex justify-between p-5 items-center bg-indigo-100 shadow-sm">
        <p
          className="font-extrabold  text-xl text-indigo-400 cursor-pointer"
          onClick={start}
        >
          MEMORY
        </p>{" "}
        <div>
          {soundState ? (
            <icons.GiSoundOn
              onClick={() => setSoundState(!soundState)}
              className="h-8 w-8 cursor-pointer text-indigo-400 hover:text-indigo-500"
            />
          ) : (
            <icons.GiSoundOff
              onClick={() => setSoundState(!soundState)}
              className="h-8 w-8 cursor-pointer text-indigo-400 hover:text-indigo-500"
            />
          )}
        </div>
      </header>
      <div className="mt-14 text-center space-y-5 w-[400px] mx-auto">
        <div className="text-indigo-500 ">
          Tries{" "}
          <span className="ml-2 px-5 text-indigo-600 font-bold rounded-md bg-indigo-300">
            {tryCount}
          </span>
        </div>
        <div className="flex-wrap p-2 flex justify-center">
          {getTiles(16).map((tile, i) => (
            <Tile
              key={i}
              flip={() => {
                flip(i);
              }}
              {...tile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
