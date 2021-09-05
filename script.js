import * as push from "./modules/pusher.js";
var pusher = null;
var timer = null;
var users = 0;
var group = "";
const screen1 = document.querySelector("#Screen_1")
const screen2 = document.querySelector("#Screen_2")
screen2.setAttribute("style", "display:none;");
const currentGroup = document.querySelector("#group");
var currentTime = 0;
const time = document.querySelector("#timer");
const joinbutton = document.querySelector("#add");
const chatList = document.querySelector("#chatlist");
const logoutButton = document.querySelector("#logout");
const sendButton = document.querySelector("#send");
const message = document.querySelector("#msg");

const join = function () {
    let name = document.querySelector("#username").value;
    group = document.querySelector("#channel").value;
    currentGroup.textContent = `${group}:online users: ${users}`;
    if (name && group) {
        pusher = new push.PusherHandler(name, group);
        users = pusher.numberUsers;
        currentTime = 60;
        timer = setInterval(function () { updateTimer(); }, 1000)
        let screen1 = document.querySelector("#Screen_1")
        screen1.setAttribute("style", "display:none;");
        screen2.setAttribute("style", "");
        pusher.sendMessage("#enters#");
    }
}



const updatechat = function () {
    pusher.sendMessage("#update#");
    let origin = pusher.userName;
    let usersSet = new Set();
    usersSet.add(origin);
    let chatList = document.querySelector("#chatlist");
    chatList.innerHTML = `<ul id="chatlist" class="list-group overflow-auto w-75 h-50 text-center"></ul>`;
    let user = origin.split("@")[0];
    push.msgs.forEach(element => {
        let elemOrigin = element.split("!")[0];
        let elemuser = elemOrigin.split("@")[0];
        let msg = element.split("!")[1];
        let tem = elemOrigin.substring(1);
        msg=msg.replaceAll("\\n",`<br>`)
        msg=msg.replaceAll(`"`,"");
        elemuser=elemuser.replaceAll(`"`,"");
        if (msg.includes(`#leave#`)) {
            usersSet.delete(elemOrigin);
            users = usersSet.size;
            currentGroup.textContent = `${group}:online users: ${users}`;
            return;
        }
        if (msg.length < 1) {
            users = usersSet.size;
            currentGroup.textContent = `${group}:online users: ${users}`;
            return;
        }
        if (tem === origin){
            if((!(msg.includes(`#enters#`)||msg.includes(`#update#`))))
                chatList.innerHTML += `<li class="list-group-item text-xxl-end">you: ${msg}</li>`;
        } 

        else {
            if(!(msg.includes(`#enters#`)||msg.includes(`#update#`)))
            chatList.innerHTML += `<li class="list-group-item text-xxl-start">${elemuser}:
    ${msg}</li>`;
            usersSet.add(elemOrigin);
        }
        users = usersSet.size;
        currentGroup.textContent = `${group}:online users: ${users}`;
    });


}
const sendMessage = function () {
    let message = document.querySelector("#msg").value;
    pusher.sendMessage(message);
    document.querySelector("#msg").value = "";
    currentTime = 60;
}

let logout = function () {
    screen2.setAttribute("style", "display:none;");
    screen1.setAttribute("style", "");
    clearInterval(timer);
    timer = null;
    currentTime = 0;
    chatList.innerHTML = `<ul id="chatlist" class="list-group overflow-auto w-75 h-50 text-center"></ul>`
    push.clearMsgs();
    pusher.sendMessage("#leave#");
    pusher.unSubscribe(group);
}
let setTimerLabel = function () {

    time.textContent = currentTime < 60 ? `You will logout after: (0:${currentTime})` : `You will logout after: (1:00)`;
}
let updateTimer = function () {
    currentTime--;
    updatechat()
    if (currentTime < 1) {
        logout();
        clearInterval(timer);
    }
    else {
        setTimerLabel();

    }
}
joinbutton.addEventListener("click", function () { join(); });
logoutButton.addEventListener("click", function () { logout(); });
sendButton.addEventListener("click", function () { sendMessage(); });
document.addEventListener('keydown', function (event) {
    if((event.keyCode == 10 || event.keyCode == 13) && event.altKey){
        message.value = message.value.substring(0, this.selectionStart)+"\n";
    }
    else if ((event.keyCode == 10 || event.keyCode == 13)) {
        event.preventDefault();
        sendMessage();
        event.preventDefault();
    }
    
});