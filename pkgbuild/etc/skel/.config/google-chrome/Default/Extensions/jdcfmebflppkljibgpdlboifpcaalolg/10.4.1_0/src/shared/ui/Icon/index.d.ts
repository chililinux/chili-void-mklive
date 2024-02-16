import React, { HTMLAttributes } from 'react';
import { IconLookup } from '@fortawesome/free-solid-svg-icons';
import { Theme } from '../../theme/v1';
export type IconContainerProps = HTMLAttributes<HTMLDivElement> & {
    theme?: Theme;
    size?: string;
    color?: string;
    customSize?: number;
    rotate?: number;
};
export type IconBaseProps = {
    icon?: IconLookup;
    iconProp: string;
    colorProp?: string;
};
export type IconProps = IconContainerProps & {
    icon: string;
};
declare const Icon: ({ color, icon, ...other }: IconProps) => React.JSX.Element;
export default Icon;
