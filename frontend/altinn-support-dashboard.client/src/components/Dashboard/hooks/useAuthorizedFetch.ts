const authorizedFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = {
        ...options.headers,
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.statusText}: ${errorText}`);
    }
    return response;
};

export default authorizedFetch;
