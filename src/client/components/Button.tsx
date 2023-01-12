import { useState } from 'react';

type ButtonProps = {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    text: string;
};

export const Button = ({ className, onClick, text }: ButtonProps) => {
    const [mouseOver, setMouseOver] = useState(false);
    return (
        <button className={className} onClick={onClick}>
            <p>{text}</p>
        </button>
    );
};
