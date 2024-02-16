import React from 'react';
export type PartnerData = {
    partner: {
        name: string;
        type: string;
        ref: string;
    };
    offer: {
        value: number;
    };
};
export type Config = {
    uiData: {
        meliuzLogo: string;
        description: string;
        buttonText: string;
        linkText: string;
        options: string[];
        partnerImage: string;
    };
    cap: {
        close: number;
        cta: number;
        subCta: number;
        limit: number;
        options: number[];
    };
};
declare const CashbackAlertPopup: () => React.JSX.Element | null;
export default CashbackAlertPopup;
