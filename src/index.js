const deepai = require('deepai');
const fs = require('fs');
const path = require('path');
const base64 = require('node-base64-image');
const { convertTo64 } = require('../utils/base64');

const randomUUI = (a,b) => {for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'');return b}

/**
 * toonify class class that allows you to transform an image (where a person's face is clearly visible) to give it an cartoon effect.
 * Use what is created by DeepAi Toonify
 * 
 * @class toonify
 * @see {@link https://deepai.org/machine-learning-model/toonify|DeepAiToonify}
 */

class toonify {
    constructor(apiKey) {
        this.apiKey = apiKey || '';
        if (this.apiKey !== '') {
            deepai.setApiKey(this.apiKey);
        }
    }

    /**
     * Allows you to transform an image to apply an cartoon style
     * 
     * @param {objet} args
     * @param {string} args.photo - Image to transform, can be image path, image url or base64 image
     * @param {string} args.destinyFolder - Path to save the transformed image, if not provided the image will be delivered in base64
     * @return {Promise<string>} Transformed image
     */
    transform(args) {
        return new Promise((resolve, reject) => {
            if (typeof args.photo !== 'undefined' && args.photo !== '') {
                if (this.apiKey === '') {
                    reject('An apiKey must be provided to continue, you can get it here: https://deepai.org/dashboard/profile');
                } else {
                    convertTo64(args.photo)
                    .then(async (res) => {
                        let nameFile = `${ randomUUI() }.jpeg`;
                        let pathImage = path.join(__dirname, `../images/${ nameFile }`);
                        let base64Image = res.split(';base64,').pop();
                        fs.writeFileSync(pathImage, base64Image, {encoding: 'base64'}, (err) => {
                            if(err) log.error('File created with error');
                        });
                        var cartoon = await deepai.callStandardApi("toonify", {
                            image: fs.createReadStream(pathImage)
                        });
                        fs.unlinkSync(pathImage);
                        if (typeof cartoon.output_url !== 'undefined'){
                            convertTo64(cartoon.output_url)
                            .then(data64 => {
                                let base64Cartoon = data64.split(';base64,').pop();
                                if (args.destinyFolder !== undefined && args.destinyFolder !== ''){
                                    if (fs.existsSync(args.destinyFolder)) {
                                        const finalImage = path.join(args.destinyFolder, nameFile);
                                        fs.writeFileSync(finalImage, base64Cartoon, {encoding: 'base64'}, (err) => {
                                            console.log('File created');
                                        });
                                        resolve({
                                            "urlImage": cartoon.output_url, 
                                            "localImage": finalImage
                                        });   
                                    } else {
                                        reject('Destiny Directory not found.');
                                    }
                                } else {
                                    resolve({
                                        "urlImage": cartoon.output_url, 
                                        "base64Image": base64Cartoon
                                    });   
                                }
                            })
                            .catch(err => {
                                reject('An error occurred while trying to transform the image');
                            })
                        }
                    })
                    .catch(err => {
                        reject(err);
                    })
                }
            } else {
                reject('An image must be provided to transform...');
            }
        })
    }
}

module.exports = toonify;