# Toonify!

![image](./images/results.jpg)

Transform your images applying an cartoon style using AI.

It is based on the [DeepAi Toonify](https://deepai.org/machine-learning-model/toonify) api rest.

You need to get a totally free apiKey from the [DeepAi](https://deepai.org/dashboard/profile) page.

## Installation

    npm i --save toonify


## Example


Transform an image from an external url

```js
const toonify = require('toonify');
const cartoon = new toonify('YOUR_API_KEY_HERE');

cartoon.transform({
    photo: 'https://media.gq.com.mx/photos/5e220ec2ffa8c7000803441e/16:9/w_1920,c_limit/40-datos-curiosos-para-descubrir-a-scarlett-johansson.jpg',
    // To save the image to a specific path
    destinyFolder: './images'
})
.then(data => {
    console.log('Image', data);
})
.catch(err => {
    console.log('Error', err);
})

```

Transform a local image and get image in base64

```js
const toonify = require('toonify');
const cartoon = new toonify('YOUR_API_KEY_HERE');
const path = require('path');

cartoon.transform({
    photo: path.join(__dirname, './image.jpg')
})
.then(data => {
    console.log('Image in base64', data);
})
.catch(err => {
    console.log('Error', err);
})

```

## Related

You can find a job where this module is used directly on whatsapp here: [WABOT](https://github.com/luiscruzga/wabot)
