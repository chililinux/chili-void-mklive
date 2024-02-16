/// <reference types="react" />
import { Theme } from '../../../../shared/theme/v1';
export declare const MeliuzCardImage: import("styled-components").IStyledComponent<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, {
    theme: Theme;
    alt: string;
    src: string;
}>>;
export declare const Title: import("styled-components").IStyledComponent<"web", {
    as?: import("react").ElementType | undefined;
    bold?: boolean | undefined;
    children: import("react").ReactNode;
    color?: string | undefined;
    fontSize?: string | undefined;
    lineHeight?: string | undefined;
    theme?: Theme | undefined;
    onClick?: (() => void) | undefined;
}> & (({ ...props }: import("../../../../shared/ui/Typography").TypographyProps) => import("react").JSX.Element);
export declare const Description: import("styled-components").IStyledComponent<"web", {
    as?: import("react").ElementType | undefined;
    bold?: boolean | undefined;
    children: import("react").ReactNode;
    color?: string | undefined;
    fontSize?: string | undefined;
    lineHeight?: string | undefined;
    theme?: Theme | undefined;
    onClick?: (() => void) | undefined;
}> & (({ ...props }: import("../../../../shared/ui/Typography").TypographyProps) => import("react").JSX.Element);
export declare const BottomText: import("styled-components").IStyledComponent<"web", {
    as?: import("react").ElementType | undefined;
    bold?: boolean | undefined;
    children: import("react").ReactNode;
    color?: string | undefined;
    fontSize?: string | undefined;
    lineHeight?: string | undefined;
    theme?: Theme | undefined;
    onClick?: (() => void) | undefined;
}> & (({ ...props }: import("../../../../shared/ui/Typography").TypographyProps) => import("react").JSX.Element);
