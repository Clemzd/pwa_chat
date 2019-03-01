<template>
    <div>
        <div v-if="!estConnectte">
            <h1 class="title">Type your username</h1>
            <form>
                <div class="form-group">
                    <input type="text" v-model="utilisateur" placeholder="Username" autocomplete="off"
                           class="form-control"/>
                </div>
                <div class="form-group">
                    <button type="button" class="accent username-submit" @click="startChatting">Start Chatting</button>
                </div>
            </form>
        </div>
        <div v-if="estConnectte">
            <ul>
                <li v-for="unMessage in messages" v-bind:key="unMessage">
                    {{unMessage}}
                </li>
            </ul>
            <input type="text" v-model="message"/>
            <button type="button" @click="envoyerMessage">OK</button>
        </div>
    </div>
</template>

<script>
    import SockJS from 'sockjs-client'
    import Stomp from 'webstomp-client'


    export default {
        name: 'home',
        data: function () {
            return {
                utilisateur: '',
                estConnectte: false,
                messages: []
            }
        },
        methods: {
            startChatting: function () {
                var socket = new SockJS('/ws');
                this.stompClient = Stomp.over(socket);
                this.stompClient.connect({}, this.onConnected, this.onError);
            },

            onError: function () {
                console.error('could not connect');
            },

            onConnected: function () {
                // Subscribe to the Public Topic
                this.stompClient.subscribe('/topic/public', this.onMessageReceived);

                // Tell your username to the server
                this.stompClient.send("/app/addUser",
                    JSON.stringify({'utilisateur': this.utilisateur, 'contenu': '', 'type': 'REJOINDRE'})
                )

                this.estConnectte = true;
            },

            envoyerMessage: function () {

                this.stompClient.send("/app/sendMessage",
                    JSON.stringify({'contenu': this.message, 'utilisateur': this.utilisateur, 'type': 'CHAT'})
                );
            },

            onMessageReceived: function (payload) {
                var message = JSON.parse(payload.body);
                console.log(message);

                if (message.type === 'CHAT') {
                    this.messages.push(message.contenu);
                } else if (message.type === "REJOINDRE") {
                    this.messages.push(message.utilisateur + " rejoint ! ");
                } else if (message.type === "QUITTER") {
                    this.messages.push(message.utilisateur + " nous quitte ;'  ");
                }
            }
        }
    }
</script>
