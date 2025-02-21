// ManualRoleSearch/utils/storageUtils.ts
export const getLocalStorageValue = (key: string, defaultValue = ''): string => {
    return localStorage.getItem(key) || defaultValue;
};

export const setLocalStorageValue = (key: string, value: string): void => {
    localStorage.setItem(key, value);
};
