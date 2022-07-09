import env from '../utils/env.js';
import bucket from '../models/firebase.model.js';

export default {
    uploadFile(file, path){
            if(!file){
                return;
            }
            const blob = bucket.file(path);
            const blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                },
                public: true
            });

            blobWriter.on('error', err => {
                console.log(err);
            });
            blobWriter.on('finish', () => {
                const mediaLink = `https://storage.googleapis.com/${env.STORAGE_BUCKET}/${path}`;
                console.log(mediaLink);
            });

            blobWriter.end(file.buffer);
        
    },

}