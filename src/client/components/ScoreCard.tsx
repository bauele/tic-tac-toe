type ScoreCardProps = {
    color: 'light-blue' | 'light-yellow' | 'silver';
    heading: string;
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
