import xTokenImage from '../assets/icon-x.svg';
import oTokenImage from '../assets/icon-o.svg';

type PlayerTurnIndicatorProps = {
    playerTurn: number;
};

export const PlayerTurnIndicator = ({
    playerTurn,
}: PlayerTurnIndicatorProps) => {
    return (
        <div className="play-game-top-menu-expanding-element bg-semi-dark-navy box-shadow-semi-dark-navy-sm">
            <div className="token-image-filter-silver">
                {playerTurn === 1 ? (
                    <img
                        className="player-turn-mark"
                        src={xTokenImage}
                        aria-label={'x-mark'}
                    />
                ) : (
                    <img
                        className="player-turn-mark"
                        src={oTokenImage}
                        aria-label={'x-mark'}
                    />
                )}
                <p className="player-turn-heading upper-text"> Turn</p>
            </div>
        </div>
    );
};
