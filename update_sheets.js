const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function updateSheet() {
    const auth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const tool = process.env.TEST_TOOL;
    const status = process.env.TEST_STATUS;

    for (let row of rows) {
        if (tool === 'Newman') {
            row.set('Newman+Postman Status', status);
        } else if (tool === 'Playwright') {
            row.set('Playwright Status', status);
        }
        await row.save();
    }
}
updateSheet();