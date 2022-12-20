import { NewGameMenu } from './components/NewGameMenu';

import './App.css';
import { PlayGame } from './components/PlayGame';

function App() {
    return (
        <div className="App flex-row-center">
            {/*
            <NewGameMenu />
            */}

            {<PlayGame />}
        </div>
    );
}

export default App;
