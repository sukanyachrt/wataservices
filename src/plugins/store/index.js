import { defineStore } from 'pinia'
import CryptoJS from 'crypto-js';
const keyValue = "Y2hhaTQ4NTU0"; // your key value (eg: key)
const ivKey = "a2xhcgAAAAAAAAAAB"; 
export const useAccountStore = defineStore({
    id: 'Wata-Services',
    state: () => {
        return {
            encryptedData: null,
        }
    },
    mutations: {
        setEncryptedData(state, encryptedData) {
            state.encryptedData = encryptedData;
        },
        clearEncryptedData(state) {
            state.encryptedData = null;
        },

    },
    actions: {
        encryptAndStoreData( data) {
            if (data) {  
                const key = CryptoJS.PBKDF2(keyValue, 'salt', { keySize: 256/32, iterations: 100 });
                const iv = CryptoJS.enc.Utf8.parse(ivKey); // Convert string to WordArray
                const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC });
                return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
              }
        },
        decryptData(data) {
            if (data) {
                const key = CryptoJS.PBKDF2(keyValue, 'salt', { keySize: 256/32, iterations: 100 });
                const iv = CryptoJS.enc.Utf8.parse(ivKey);
                const decrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(data) }, key, { iv: iv, mode: CryptoJS.mode.CBC });
                return decrypted.toString(CryptoJS.enc.Utf8);
              }
        },
        resetStore() {

        },
    },
    persist: true,
})
