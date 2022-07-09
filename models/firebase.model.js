import env from '../utils/env.js';
import admin from 'firebase-admin';
// import fnStorage from '@google-cloud/storage';
// const Storage = fnStorage.Storage;

// const storage = new Storage({
//     keyFileName: '../cert/' + env.STORAGE_CERT_NAME,
// });

// const storageBucket = storage.bucket(env.STORAGE_BUCKET);

// export default storageBucket;

admin.initializeApp({
    credential: admin.credential.cert(`./cert/${env.STORAGE_CERT_NAME}`),
    storageBucket: env.STORAGE_BUCKET
});
const bucket = admin.storage().bucket();
export default bucket;