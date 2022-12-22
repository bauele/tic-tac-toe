type ButtonProps = {
    className?: string;
    text: string;
};

export const Button = ({ className, text }: ButtonProps) => {
    return (
        <button className={className}>
            <p>{text}</p>
        </button>
    );
};
