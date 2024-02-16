import React from 'react';
export type PartnerData = {
    id: number;
    name: string;
    ref: string;
};
export type Config = {
    uiData: {
        partnerImage: string;
        backgroundImage: string;
        meliuzLogo: string;
        title: string;
        description1: string;
        description2: string;
        activationButton: string;
    };
};
declare const BlocklistPopup: () => React.JSX.Element | null;
export default BlocklistPopup;
