import React, { Component } from 'react'
import moment from 'moment';
const signalR = require("@aspnet/signalr");

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nick: 'Guest',
            isLogin: false,
            message: '',
            messages: [],
            hubConnection: null
        }

        this.login = this.login.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentDidMount() {
        let hubConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl("http://localhost:5000/chat", {
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
            })
            .build();

        hubConnection.start()
            .then(() => console.log('Connection started!'))
            .catch(err => console.error(err));

        hubConnection.on('sendToAll', (nick, receivedMessage) => {
            let dateTimeNow = new Date();
            let timeAgo = moment(dateTimeNow).format('LTS'); 
            const text = `${nick}: ${receivedMessage} at ${timeAgo}`;
            const messages = this.state.messages.concat([text]);
            this.setState({ messages });
        });

        this.setState({
            hubConnection: hubConnection
        })
    }

    sendMessage() {
        const { hubConnection, nick, message } = this.state;
        hubConnection
            .invoke('sendToAll', nick, message)
            .catch(err => console.error(err));

        this.setState({ message: '' });
    }

    login() {
        const { hubConnection, nick } = this.state;
        this.setState({ isLogin: true });
        let message = `has joined`;
        hubConnection
            .invoke('sendToAll', nick, message)
            .catch(err => console.error(err));
        this.setState({ message: '' });
    }

    render() {
        const { isLogin, nick, message, messages } = this.state;
        return (
            <div>
                {!isLogin &&
                    <div className="login-form">
                        <input
                            type="text"
                            placeholder="Nick"
                            value={nick}
                            onChange={e => this.setState({ nick: e.target.value })}
                        />
                        <button onClick={this.login}>Login</button>
                    </div>
                }
                {isLogin &&
                    <div className="message-board">
                        <input
                            type="text"
                            placeholder="Message"
                            value={message}
                            onChange={e => this.setState({ message: e.target.value })}
                        />

                        <button onClick={this.sendMessage}>Send</button>

                        <div>
                            {messages.map((message, index) => (
                                <span style={{ display: 'block' }} key={index}> {message} </span>
                            ))}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Chat