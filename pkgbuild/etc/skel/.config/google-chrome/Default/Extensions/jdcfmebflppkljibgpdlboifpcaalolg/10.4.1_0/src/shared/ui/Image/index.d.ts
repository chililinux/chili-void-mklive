import { RendererType } from 'lottie-web';
import React, { ElementType } from 'react';
import { Theme } from '../../theme/v1';
export type ImageProps = {
    as?: ElementType;
    theme?: Theme;
    alt?: string;
    src: string;
    lottieProps?: {
        loop?: boolean;
        autoplay?: boolean;
        renderer?: RendererType;
    };
};
declare const Image: ({ ...props }: ImageProps) => React.JSX.Element;
export default Image;
