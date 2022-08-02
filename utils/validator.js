import { NUM_TO_CART_STATE } from './database.js';

export default {
    isValidStr(str) {
        return str !== undefined &&
            str !== null &&
            str.length > 0;
    },

    isValidEmail(email) {
        let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return regex.test(email);
    },

    isValidNum(str) {
        return this.isValidStr(str) && /^[0-9]+$/.test(str);
    },

    isValidOrderState(state) {
        if (!this.isValidNum(state.toString())) {
            return false;
        }
        return NUM_TO_CART_STATE[`${state}`] !== undefined;
    },
}