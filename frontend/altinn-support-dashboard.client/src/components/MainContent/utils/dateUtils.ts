export const formatDate = (dateString: string): string => {
    if (!dateString || dateString.startsWith('0001-01-01')) {
        return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleString('no-NO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
