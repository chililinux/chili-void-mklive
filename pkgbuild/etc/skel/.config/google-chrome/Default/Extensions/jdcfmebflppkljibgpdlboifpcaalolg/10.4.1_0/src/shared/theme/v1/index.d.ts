import { Theme as StyledTheme } from 'styled-components';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
export interface Theme extends StyledTheme {
    borderWidths: {
        [key: string]: string;
    };
    colors: {
        [key: string]: string;
    };
    fonts: {
        [key: string]: string;
    };
    fontSizes: {
        [key: string]: string;
    };
    fontWeights: {
        [key: string]: number;
    };
    icons: {
        [key: string]: IconDefinition;
    };
    iconSizes: {
        [key: string]: string;
    };
    lineHeights: {
        [key: string]: string;
    };
    radii: {
        [key: string]: string;
    };
    space: {
        [key: string]: string;
    };
}
declare const theme: Theme;
export default theme;
