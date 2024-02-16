/// <reference types="react" />
import { Theme } from '../../../../shared/theme/v1';
export declare const PartnerImageContainer: import("styled-components").IStyledComponent<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {
    theme: Theme;
}>>;
export declare const PartnerImage: import("styled-components").IStyledComponent<"web", {
    as?: import("react").ElementType | undefined;
    theme?: Theme | undefined;
    alt?: string | undefined;
    src: string;
    lottieProps?: {
        loop?: boolean | undefined;
        autoplay?: boolean | undefined;
        renderer?: import("lottie-web").RendererType | undefined;
    } | undefined;
}> & (({ ...props }: import("../../../../shared/ui/Image").ImageProps) => import("react").JSX.Element);
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
export declare const Link: import("styled-components").IStyledComponent<"web", {
    as?: import("react").ElementType | undefined;
    bold?: boolean | undefined;
    children: import("react").ReactNode;
    color?: string | undefined;
    fontSize?: string | undefined;
    lineHeight?: string | undefined;
    theme?: Theme | undefined;
    onClick?: (() => void) | undefined;
}> & (({ ...props }: import("../../../../shared/ui/Typography").TypographyProps) => import("react").JSX.Element);
