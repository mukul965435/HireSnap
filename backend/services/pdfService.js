import { PDFParse } from 'pdf-parse';

export const parsePDF = async (buffer) => {
    // Initializing the parser with the buffer data
    const parser = new PDFParse({ data: buffer });
    try {
        // Extracting text from the PDF
        const result = await parser.getText();
        const text = typeof result.text === 'string' ? result.text : result.text?.toString();
        
        console.log('PARSED PDF TEXT SAMPLE:', text?.substring(0, 100));
        return text;
    } catch (error) {
        console.error('PDF Parsing Error Instance:', error);
        throw new Error(`Error parsing PDF file: ${error.message}`);
    } finally {
        // Always destroy the parser to free up memory
        await parser.destroy();
    }
};
