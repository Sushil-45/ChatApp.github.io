const messageTypes = {LEFT : 'left',RIGHT: 'right',LOGIN:'login'};

//chat
const chatwindow = document.getElementById('chat');
const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');


//login
let username = '';
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const loginWindow = document.getElementById('login');


const messages= [] ; //{author,date,content,type}

var socket = io();

socket.on('message', message => {
    console.log(message);
    if(message.type != messageTypes.LOGIN){
        if(message.author === username){
            message.type=messageTypes.RIGHT;
        }else{
            message.type=messageTypes.LEFT;
        }
    }
    messages.push(message);
    displayMessages();
    chatwindow.scrollTop = chatwindow.scrollHeight;
});

//take in message object  and return corrsponding
const createMesageHTML = (message) => {
    if(message.type == messageTypes.LOGIN){
        return `
            <p class="seconday-text text-center mb-2"> ${message.author} has joined the chat</p>
        `;
    }

    return `
    <div class="message ${message.type==messageTypes.LEFT ? 'message-left' : 'message-right'}">
    <div id="message-details" class="flex">
        <p class="message-author">${message.type === messageTypes.RIGHT ? '' : message.author}</p>
        <p class="message-date">${message.date}</p>
    </div>
    <p class="message-content">${message.content}</p>

</div>
  `;

};


const displayMessages = () => {
    console.log("tet mssge")
    const messagesHTML = messages
        .map( (message) => createMesageHTML(message))
        .join('');
    
    messageList.innerHTML = messagesHTML;
};


displayMessages();

//sendbtn callback
sendBtn.addEventListener('click', e => {
    
    console.log("test chat");   
    e.preventDefault();
    if(!messageInput.value){
        return console.log('must supply a username');
    }

    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const datestring = `${month}/${day}/${year}`;

    const message = {
        author : username,
        date : datestring,
        content : messageInput.value
        //type : messageTypes.RIGHT
    };

    
    //messages.push(message);
    //displayMessages();

    sendmessage(message);

    messageInput.value='';

    //chatwindow.scrollTop = chatwindow.scrollHeight;
});

const sendmessage = message =>  {
    socket.emit('message',message);

}

//loginbtn
loginBtn.addEventListener('click', e => {
    //preventdefault of a form
    e.preventDefault(); 
    //set username and create logged
    if(!usernameInput.value){
        return console.log('must supply a username');
    }
    username = usernameInput.value;
    
    /*console.log(username)
    messages.push({
        author : username,
        type :messageTypes.LOGIN
    });*/

    sendmessage({author : username,
        type :messageTypes.LOGIN});

    //hide login and show chat
    loginWindow.classList.add('hidden');
    chatwindow.classList.remove('hidden');

    //display messages method
    //displayMessages();
});