type ScoreCardProps = {
    //  Prop indicating the color of the ScoreCard
    color: 'light-blue' | 'light-yellow' | 'silver';

    //  Prop indicating the heading of the ScoreCard
    heading: string;

    //  Prop indicating the score value of the ScoreCard
    score: number;
};

export const ScoreCard = ({ color, heading, score }: ScoreCardProps) => {
    return (
        <div className={`score-card bg-${color} flex-col-center`}>
            <p className="score-card-heading upper-text">{heading}</p>
            <p className="score-card-value upper-text">{score}</p>
        </div>
    );
};
