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

    const now = new Date();
    const formattedDate = now.toLocaleString('th-TH', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });

    for (let row of rows) {
        row.set('Test Date', formattedDate);

        if (tool === 'Newman') {
            row.set('Newman+Postman Status', status);
        } else if (tool === 'Playwright') {
            row.set('Playwright Status', status);
        }
        await row.save();
    }
    console.log(`✅ Updated ${tool} status and Test Date in Google Sheets`);
}

updateSheet().catch(err => {
    console.error(err);
    process.exit(1);
});