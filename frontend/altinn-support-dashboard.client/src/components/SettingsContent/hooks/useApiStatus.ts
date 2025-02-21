import { useState, useEffect } from 'react';
import { getBaseUrl } from '../../../utils/utils';
import { authorizedFetch } from '../utils/apiUtils';

type ApiStatus = 'connected' | 'disconnected' | 'loading';

export const useApiStatus = () => {
    const [apiStatusProd, setApiStatusProd] = useState<ApiStatus>('loading');
    const [apiStatusTT02, setApiStatusTT02] = useState<ApiStatus>('loading');

    useEffect(() => {
        const checkApiStatus = async () => {
            try {
                const resProd = await authorizedFetch(`${getBaseUrl('Production')}/health`);
                setApiStatusProd(resProd.ok ? 'connected' : 'disconnected');
            } catch (error) {
                setApiStatusProd('disconnected');
            }
            try {
                const resTT02 = await authorizedFetch(`${getBaseUrl('TT02')}/health`);
                setApiStatusTT02(resTT02.ok ? 'connected' : 'disconnected');
            } catch (error) {
                setApiStatusTT02('disconnected');
            }
        };
        checkApiStatus();
    }, []);

    return { apiStatusProd, apiStatusTT02 };
};
