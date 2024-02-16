import React, { ReactNode, ElementType } from 'react';
import { Theme } from '../../theme/v1';
export type TypographyProps = {
    as?: ElementType;
    bold?: boolean;
    children: ReactNode;
    color?: string;
    fontSize?: string;
    lineHeight?: string;
    theme?: Theme;
    onClick?: () => void;
};
declare const Typography: ({ ...props }: TypographyProps) => React.JSX.Element;
export default Typography;
