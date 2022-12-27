type ButtonProps = {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    text: string;
};

export const Button = ({ className, onClick, text }: ButtonProps) => {
    return (
        <button className={className} onClick={onClick}>
            <p>{text}</p>
        </button>
    );
};
