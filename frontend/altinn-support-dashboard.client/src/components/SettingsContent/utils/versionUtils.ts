export const getVersionInfo = () => {
    const versionNumber = '2.4.7';
    const envName =
        (typeof process !== 'undefined' && process.env && process.env.REACT_APP_ENV_NAME) || '';
    let versionName: string;
    switch (envName) {
        case 'production':
            versionName = 'Produksjonsmiljø';
            break;
        case 'test':
            versionName = 'Testmiljø';
            break;
        default:
            versionName = 'Lokalt utviklingmiljø';
    }
    return { versionNumber, versionName };
};
