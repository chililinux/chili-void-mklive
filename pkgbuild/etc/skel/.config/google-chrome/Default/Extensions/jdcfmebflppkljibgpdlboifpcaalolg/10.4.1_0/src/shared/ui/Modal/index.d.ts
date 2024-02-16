import React, { HTMLAttributes, ReactNode } from 'react';
import { Theme } from '../../theme/v1';
type PositionsType = 'center' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left' | 'top' | 'top-right' | 'extension';
export type DialogProps = HTMLAttributes<HTMLDivElement> & {
    withContainer?: boolean;
    $position?: PositionsType;
    $isOpen?: boolean;
    $customPosition?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
};
export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
    $isOpen?: boolean;
};
export type ContentProps = HTMLAttributes<HTMLDivElement> & {
    theme?: Theme;
    $width?: string;
    $borderRadius?: string;
    $margin?: string;
    $noPadding?: boolean;
    $isRowDirection?: boolean;
    $header?: boolean;
};
export type ModalProps = DialogProps & ContentProps & {
    children: ReactNode;
    background?: boolean;
    backgroundClick?: () => void;
    closeIconClick?: () => void;
    logoSrc?: string;
    options?: {
        label: string;
        onClick: () => void;
    }[];
    width?: string;
};
declare const Modal: (props: ModalProps) => React.JSX.Element;
export default Modal;
