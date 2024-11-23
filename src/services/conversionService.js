const axios = require('axios');
const fs = require('fs').promises; 
const path = require('path');

async function convertDocToPdf(docPath, callback) {
    try {
        const fileContent = await fs.readFile(docPath, { encoding: 'base64' });
        const postData = {
            "Parameters": [
                {
                    "Name": "File",
                    "FileValue": {
                        "Name": path.basename(docPath),
                        "Data": fileContent
                    }
                },
                {
                    "Name": "StoreFile",
                    "Value": true
                }
            ]
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${process.env.CONVERTAPI_SECRET}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post('https://v2.convertapi.com/convert/doc/to/pdf', postData, config);

        if (!response.data || !response.data.Files || response.data.Files.length === 0) {
            throw new Error('Invalid API response or no PDF file returned from ConvertAPI.');
        }

        const pdfUrl = response.data.Files[0].Url;
        const outputFilePath = path.join(__dirname, '../downloads/', response.data.Files[0].FileName);

        const pdfResponse = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        await fs.writeFile(outputFilePath, pdfResponse.data);

        console.log("PDF successfully downloaded and saved to:", outputFilePath);
        callback(null, outputFilePath);
    } catch (error) {
        console.error('Error converting document with ConvertAPI:', error);
        callback(error, null);
    }
}

module.exports = { convertDocToPdf };
