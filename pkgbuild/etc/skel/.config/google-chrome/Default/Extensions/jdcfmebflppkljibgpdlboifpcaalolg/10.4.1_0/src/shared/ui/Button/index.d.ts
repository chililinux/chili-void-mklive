import React, { ButtonHTMLAttributes } from 'react';
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary';
    size?: 'small' | 'medium' | 'large';
    borderRadius?: string;
    paddingX?: string;
    paddingY?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    children: any;
};
declare const Button: (props: ButtonProps) => React.JSX.Element;
export default Button;
