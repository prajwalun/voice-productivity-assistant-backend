const fs = require('fs');

// Replace this with the actual filename of your service account JSON
const serviceAccount = require('./firebase-service-account.json'); // 👈 update the filename if needed

const rawKey = serviceAccount.private_key;

// Escape newlines for .env
const formattedKey = rawKey.replace(/\n/g, '\\n');

console.log('\n✅ Add the following line to your .env:\n');
console.log(`FIREBASE_PRIVATE_KEY="${formattedKey}"\n`);
