export const findImage = (obj: unknown): string | null => {
    if (typeof obj !== 'object' || obj === null) return null;

    const record: Record<string, unknown> = obj as Record<string, unknown>;
    for (const key in record) {
        const value = record[key];
        if (key.toLowerCase() === 'image' && typeof value === 'string') {
            return value;
        }

        if (typeof value === 'object') {
            const result = findImage(value);
            if (result) return result;
        }
    }

    return null;
};

export const transformDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

// For the datetime attribute in the <time> element
export const convertToISO8601 = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toISOString();
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`convertToISO8601 failed: ${message}`);
        return dateString;
    }
};

export const createSlug = (title: string, date: string | number | Date): string | null => {
    try {
        if (!title || typeof title !== 'string') {
            throw new Error('Title must be a non-empty string.');
        }
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            throw new Error('Invalid date.');
        }
        const cleanedTitle = title
            .replace(/[.,]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase();

        return `${formattedDate.toISOString().split('T')[0]}-${cleanedTitle}`;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error creating slug:', message);
        return null;
    }
};

export const convertLinkMarkdownToHTML = (markdown: string): string => {
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;

    return markdown.replace(regex, (_match, text: string, url: string) => {
        return `<a href="${url}">${text}</a>`;
    });
};


