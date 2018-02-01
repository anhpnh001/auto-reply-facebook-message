'use strict';
const login = require('facebook-chat-api');
const request = require('request');

let key = 'ad41316f-d521-44f3-8e52-2b1fdbfb1d5b';
// User list does not receive messages
let except = [
    '100012514756623'
];
// Replace it with your email and password
login({
    email: '',
    password: ''
}, (err, api) => {
    if (err) return console.error(err);
    // Options
    api.setOptions({
        forceLogin: true
    });
    api.listen((err, message) => {
        if (err) return console.error(err);
        if (!message.isGroup && except.indexOf(message.threadID) === -1) {
            api.markAsRead(message.threadID);
            api.sendTypingIndicator(message.threadID, () => {
                request(`http://sandbox.api.simsimi.com/request.p?key=${key}&lc=vn&ft=1.0&text=${encodeURI(message.body)}`,
                    (err, res, body) => {
                        body = JSON.parse(body);
                        if (!body.response) return api.sendMessage('Tôi không hiểu!', message.threadID);
                        api.sendMessage(body.response, message.threadID);
                    }
                );
            });
        }
    });
});