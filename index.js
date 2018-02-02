'use strict';
const login = require('facebook-chat-api');
const request = require('request');
// Enter your Simsimi API key
let key = '';
// Enter your username and password
let account = {
    email: '',
    password: ''
}
// List of users is excluded
let except = [
    '100012514756623'
];
login(account, (err, api) => {
    if (err) return console.error(err);
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
                        if (!body.response) return api.sendMessage('I don\'t know!', message.threadID);
                        api.sendMessage(body.response, message.threadID);
                    }
                );
            });
        }
    });
});