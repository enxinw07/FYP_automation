const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const API_URL = "https://api.zerogpt.com/api/detect/detectText";
const API_KEY = "c8bb2a4e-3ef7-4770-8064-796a7d7af192";

async function checkReviewWithGPTZero(reviewText) {
    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };
    const data = {
        'text': reviewText
    };

    try {
        const response = await axios.post(API_URL, data, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error processing review: ${error}`);
        return { error: error.message };
    }
}

async function processReviews() {
    const results = [];
    const reviews = [];

    fs.createReadStream('movie_reviews.csv')
        .pipe(csv({ skipLines: 1, headers: ["title", "year", "genre", "review"] }))
        .on('data', (row) => {
            reviews.push(row);
        })
        .on('end', async () => {
            for (const [index, row] of reviews.entries()) {
                const review = row['review'];
                try {
                    const result = await checkReviewWithGPTZero(review);
                    results.push({ ...row, gptzero_result: result });
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 1 second
                } catch (error) {
                    console.error(`Error processing review at index ${index}: ${error}`);
                    results.push({ ...row, gptzero_result: { error: error.message } });
                }
            }

            const outputCsv = 'movie_reviews_with_gptzero_results.csv';
            const outputData = results.map(row =>
                `"${row.title}","${row.year}","${row.genre}","${row.review}","${JSON.stringify(row.gptzero_result).replace(/"/g, '""')}"`).join('\n');

            fs.writeFile(outputCsv, outputData, (err) => {
                if (err) {
                    console.error('Error writing CSV file', err);
                } else {
                    console.log(`Results saved to ${outputCsv}`);
                }
            });
        });
}

processReviews();
