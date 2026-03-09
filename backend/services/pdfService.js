import pdf from 'pdf-parse';

export const parsePDF = async (buffer) => {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        throw new Error('Error parsing PDF file');
    }
};
