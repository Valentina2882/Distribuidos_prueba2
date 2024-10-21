const CryptoJs = require("crypto-js");

const Encrypt = (data)=>{
    var ciphertext = CryptoJs.AES.encrypt(data, process.env.AUTH_AES_SECRET_KEY).toString();
    return ciphertext;
}
const Decrypt = (data)=>{
    var bytes = CryptoJs.AES.decrypt(data, process.env.AUTH_AES_SECRET_KEY);
    var originalText = bytes.toString(CryptoJs.enc.Utf8);
    return originalText
}

module.exports = {
    Encrypt,
    Decrypt
}