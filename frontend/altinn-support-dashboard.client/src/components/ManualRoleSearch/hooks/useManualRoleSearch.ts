// ManualRoleSearch/hooks/useManualRoleSearch.ts
import { useState } from 'react';
import { Role } from '../models/manualRoleSearchTypes';

export const UseManualRoleSearch = (baseUrl: string) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoles = async (rollehaver: string, rollegiver: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/manualrole?rollehaver=${rollehaver}&rollegiver=${rollegiver}`);
            if (!response.ok) {
                throw new Error('Error fetching roles');
            }
            const data = await response.json();
            setRoles(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const clearRoles = () => {
        setRoles([]);
    };

    return { fetchRoles, roles, isLoading, error, clearRoles };
};
