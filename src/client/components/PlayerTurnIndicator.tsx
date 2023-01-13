import xTokenImage from '../assets/icon-x.svg';
import oTokenImage from '../assets/icon-o.svg';

type PlayerTurnIndicatorProps = {
    //  Prop indicating the current player's turn
    playerTurn: number;
};

export const PlayerTurnIndicator = ({
    playerTurn,
}: PlayerTurnIndicatorProps) => {
    return (
        <div className="play-game-top-menu-expanding-element bg-semi-dark-navy box-shadow-semi-dark-navy-sm">
            <div className="token-image-filter-silver">
                {playerTurn === 1 ? (
                    <>
                        <img
                            className="player-turn-mark"
                            src={xTokenImage}
                            aria-label={'x-mark'}
                        />
                        <p className="player-turn-heading upper-text"> Turn</p>
                    </>
                ) : playerTurn === 2 ? (
                    <>
                        <img
                            className="player-turn-mark"
                            src={oTokenImage}
                            aria-label={'x-mark'}
                        />
                        <p className="player-turn-heading upper-text"> Turn</p>
                    </>
                ) : (
                    <p>Error</p>
                )}
            </div>
        </div>
    );
};
