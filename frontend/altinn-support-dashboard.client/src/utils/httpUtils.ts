export const isSuccess = (status: number) => status >= 200 && status < 300;
export const isError = (status: number) => status >= 400;
