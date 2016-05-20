import './app.scss';
import { createClass } from 'asteroid';
const Asteroid = createClass();
const asteroid = new Asteroid({
    endpoint: "ws://localhost:9000/websocket"
});
asteroid.subscribe("messages");

let $ = selector => document.querySelector(selector);

asteroid.ddp.on('added', ({ collection, id, fields }) => {
    if (collection === 'messages') {
        let message = document.createElement('p');
        message.classList = 'message';
        message.id = `message-${id}`;
        message.innerHTML = `
            <img src="https://api.adorable.io/avatars/40/${fields.from}" height="30" width="30">
            &nbsp;<strong>${fields.from}</strong>&nbsp;${fields.message}
        `;
        let content = $('content');
        content.appendChild(message);
        content.scrollTop = content.scrollHeight;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    $('form').addEventListener('submit', e => {
        e.preventDefault();
        let from = $('input[name="from"]').value;
        let message = $('input[name="new-message"]').value;

        if (!from || !message) return;

        asteroid.call('addMessage', from, message)
            .then(result => {
                $('input[name="new-message"]').value = '';
            });
    });
})
