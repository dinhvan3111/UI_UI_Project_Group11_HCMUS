import env from './env.js';

export default {
    getImgLink(imgPath){
        return `https://storage.googleapis.com/${env.STORAGE_BUCKET}/${imgPath}`;
    },
}