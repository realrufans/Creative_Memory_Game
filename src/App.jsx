import { useState } from "react";
import { StartScreen, PlayScreen, WonScreen } from "./Screens";
import useSound from "use-sound";
import allMatchedAudio from "../public/sounds/allMatched.flac";
import play from "../public/sounds/play.mp3";

function App() {
  const [gameState, setGameState] = useState("start");
  const [allMatchedAudioFn] = useSound(allMatchedAudio);
  const [playAudio] = useSound(play);

  switch (gameState) {
    case "start":
      return (
        <StartScreen
          playSound={playAudio}
          home={() => setGameState("start")}
          start={() => setGameState("play")}
        />
      );
    case "play":
      return (
        <PlayScreen
          start={() => setGameState("start")}
          won={() => setGameState("won")}
        />
      );

    case "won":
      return (
        <WonScreen
          start={() => setGameState("start")}
          allMatchedAudioFn={allMatchedAudioFn}
        />
      );
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;
