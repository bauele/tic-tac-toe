import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { PlayGame } from './components/PlayGame';
import { NewGameMenu } from './components/NewGameMenu';
import { gameModes, gameMode, gameSettings } from './lib';

import './App.css';

function App() {
    const [gameMode, setGameMode] = useState('');
    const [playerMark, setPlayerMark] = useState(0);
    const navigate = useNavigate();

    const selectGameMode = ({ mark, mode }: gameSettings) => {
        if (gameModes.includes(mode)) {
            setGameMode(mode);
            setPlayerMark(mark);
            navigate('/play');
        } else {
            alert('Invalid game mode');
        }
    };

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={
                        <NewGameMenu gameModeButtonOnClick={selectGameMode} />
                    }
                />
                <Route
                    path="/play"
                    element={
                        <PlayGame gameMode={gameMode} playerMark={playerMark} />
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
