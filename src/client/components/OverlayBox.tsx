import { Button } from './Button';

type OverlayBoxProps = {
    mainText: string;
    mainTextColor?: 'light-yellow' | 'light-blue';
    mainImage?: string;
    subText?: string;
    buttonOneText: string;
    buttonOneOnClick?: Function;
    buttonTwoText: string;
    buttonTwoOnClick?: Function;
};

export const OverlayBox = ({
    mainText,
    mainImage = '',
    subText = '',
    buttonOneText,
    buttonOneOnClick,
    buttonTwoOnClick,
    buttonTwoText,
}: OverlayBoxProps) => {
    const overlayBoxPositioning = () => {
        return subText === ''
            ? 'overlay-box-main-text-only'
            : 'overlay-box-main-and-sub-texts';
    };

    return (
        <div className={`overlay-box ${overlayBoxPositioning()}`}>
            {subText !== '' ? (
                <h2 className="overlay-sub-text upper-text">{subText}</h2>
            ) : (
                <></>
            )}

            <div className={`overlay-main-text-container  `}>
                {mainImage !== '' ? (
                    <img className="overlay-main-image" src={mainImage} />
                ) : (
                    <></>
                )}

                <h1 className="overlay-main-text upper-text">{mainText}</h1>
            </div>

            <div className="overlay-button-container flex-row-center">
                <Button
                    className={
                        'overlay-button overlay-button-1 bg-silver box-shadow-silver-sm border-radius-10 upper-text'
                    }
                    text={buttonOneText}
                />
                <Button
                    className={
                        'overlay-button overlay-button-2 bg-light-yellow box-shadow-light-yellow-sm border-radius-10 upper-text'
                    }
                    text={buttonTwoText}
                />
            </div>
        </div>
    );
};
