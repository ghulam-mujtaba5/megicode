const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, '..', 'components', 'Reviews', 'CompaniesSection.tsx'),
    path.join(__dirname, '..', 'components', 'Reviews', 'CompaniesSection.module.css')
];

files.forEach(file => {
    try {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`Deleted: ${file}`);
        }
    } catch (err) {
        console.error(`Error deleting ${file}:`, err);
    }
});
