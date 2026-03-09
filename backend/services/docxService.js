import mammoth from 'mammoth';

export const parseDOCX = async (buffer) => {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        throw new Error('Error parsing DOCX file');
    }
};
