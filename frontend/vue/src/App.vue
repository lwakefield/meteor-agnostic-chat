<template>
    <div class="chat-wrapper">
        <div class="chat">
            <h1> Meteor Agnostic Chat </h1>

            <content v-el:content>
                <p v-for="m in messages" class="message">
                    <img src="https://api.adorable.io/avatars/40/{{m.from}}" height="30" width="30">
                    <strong>{{ m.from }}</strong> - {{ m.message }}
                </p>
            </content>

            <div>
                <form @submit.stop.prevent="sendMessage">
                    <input type="text" placeholder="From" name="from" v-model="from">
                    <input type="text" placeholder="Message" name="new-message" v-model="newMessage">
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import { createClass } from 'asteroid';
    const Asteroid = createClass();
    const asteroid = new Asteroid({
        endpoint: "ws://localhost:9000/websocket"
    });
    asteroid.subscribe("messages");

    export default {
        data() {
            return {
                messages: [],
                from: '',
                newMessage: ''
            }
        },
        methods: {
            sendMessage() {
                if (!this.from || !this.newMessage) return;

                asteroid.call('addMessage', this.from, this.newMessage)
                    .then(result => {
                        this.newMessage = '';
                    })
            }
        },
        created() {
            asteroid.ddp.on('added', ({
                collection,
                id,
                fields
            }) => {
                if (collection === 'messages') {
                    fields._id = id;
                    this.messages.push(fields)
                }
                this.$nextTick(() => {this.$els.content.scrollTop = this.$els.content.scrollHeight})
            });
        }
    }
</script>

<style>
    * {
        box-sizing: border-box;
    }
    
    body {
        margin: 0;
        font-family: Helvetica, sans-serif;
        font-weight: lighter;
    }

    ::-webkit-scrollbar {
        appearance: none;
        width: 3px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #eee;
    }
    
    .chat-wrapper {
        display: flex;
        justify-content: center;
    }
    
    .chat {
        width: 32rem;
        height: 100vh;
        border: 1px solid #eee;
        padding: 1rem;
        display: flex;
        flex-flow: column nowrap;
    }
    
    h1 {
        text-align: center;
    }

    h1, strong {
        font-weight: normal;
    }

    .message {
        display: flex;
        align-items: center;
        margin: 0.25rem 0;
    }

    content {
        flex-grow: 1;
        overflow: scroll;
    }
    
    form {
        display: flex;
    }
    
    input,
    button {
        height: 2rem;
    }
    
    button {
        border: none;
    }
    
    input {
        border: 1px solid #eee;
    }
    
    input + input {
        border-left: none;
    }
    
    input[name="new-message"] {
        flex-grow: 1;
    }
    
    button[type="submit"] {
        background-color: deepskyblue;
        color: white;
    }
</style>
