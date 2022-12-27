import { useState } from 'react';

import { Switch } from './Switch';
import { Button } from './Button';
import { gameModes, gameSettings } from '../lib';

import xTokenImage from '../assets/icon-x.svg';
import oTokenImage from '../assets/icon-o.svg';

type NewGameMenuProps = {
    gameModeButtonOnClick: ({ mark, mode }: gameSettings) => void;
};

export const NewGameMenu = (props: NewGameMenuProps) => {
    const [selectedMark, setSelectedMark] = useState(0);

    return (
        <div className="main-horizontal-content new-game-menu">
            <div className="flex-row-center token-logo-group">
                <img className="token-image-logo" src={xTokenImage} />
                <img className="token-image-logo" src={oTokenImage} />
            </div>
            <div
                className="new-game-menu-token-select-box bg-semi-dark-navy border-radius-15 box-shadow-semi-dark-navy"
                role="radiogroup"
                aria-labelledby="pick-player-one-mark-heading"
            >
                <h1
                    id="pick-player-one-mark-heading"
                    className="new-game-pick-mark-heading heading-xs upper-text"
                >
                    Pick Player 1’s Mark
                </h1>
                <div className="new-game-switch-box flex-row-center">
                    <Switch
                        className="new-game-switch-box-inner border-radius-10"
                        selected={selectedMark}
                        optionOne={
                            <img
                                className="token-image-logo"
                                src={xTokenImage}
                                aria-label={'x-mark'}
                            />
                        }
                        optionTwo={
                            <img
                                className="token-image-logo"
                                src={oTokenImage}
                                aria-label={'o-mark'}
                            />
                        }
                        switchOptionClassName={{
                            default:
                                'switch-option switch-radio-accessibiltiy token-image-filter-silver',
                            selected:
                                'switch-option switch-radio-accessibiltiy token-image-filter-dark-navy',
                        }}
                        onChange={setSelectedMark}
                    />
                </div>
                <p className="new-game-p-text body upper-text opacity-50 ">
                    Remember: X Goes First
                </p>
            </div>
            <div className="flex-col-center new-game-buttons-group">
                <Button
                    className={
                        'new-game-button bg-light-yellow border-radius-15 box-shadow-light-yellow heading-xs upper-text'
                    }
                    onClick={() =>
                        props.gameModeButtonOnClick({
                            mark: selectedMark,
                            mode: gameModes[0],
                        })
                    }
                    text="New Game (VS CPU)"
                />
                <Button
                    className={
                        'new-game-button bg-light-blue border-radius-15 box-shadow-light-blue heading-xs upper-text'
                    }
                    onClick={() =>
                        props.gameModeButtonOnClick({
                            mark: selectedMark,
                            mode: gameModes[1],
                        })
                    }
                    text="New Game (VS Player)"
                />
            </div>
        </div>
    );
};
