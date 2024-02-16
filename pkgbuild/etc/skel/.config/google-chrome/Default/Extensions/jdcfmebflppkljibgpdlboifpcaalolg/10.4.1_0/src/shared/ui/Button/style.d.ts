/// <reference types="react" />
import { Theme } from '../../theme/v1';
import { ButtonProps } from '.';
type ExtendsButtonProps = ButtonProps & {
    borderRadius: string;
    paddingX: string;
    paddingY: string;
    theme?: Theme;
};
declare const _default: {
    PrimaryButton: import("styled-components").IStyledComponent<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, ExtendsButtonProps>>;
};
export default _default;
