import * as push from "./modules/pusher.js";
var pusher = null;
var timer=null;
var users = 0;
var group = "";
const screen1 = document.querySelector("#Screen_1")
const screen2 = document.querySelector("#Screen_2")
screen2.setAttribute("style", "display:none;");
const currentGroup = document.querySelector("#group");
var currentTime = 0;
const time = document.querySelector("#timer");
const joinbutton=document.querySelector("#add");
const chatList=document.querySelector("#chatlist");
const logoutButton=document.querySelector("#logout");
const sendButton=document.querySelector("#send");


const join = function () {
    let name = document.querySelector("#username").value;
    group = document.querySelector("#channel").value;
    currentGroup.textContent = `${group}:online users: ${users}`;
    if (name && group) {
        pusher = new push.PusherHandler(name, group);
        users = pusher.numberUsers;
        currentTime = 60;
        timer=setInterval(function(){ updateTimer(); }, 1000)
        let screen1 = document.querySelector("#Screen_1")
        screen1.setAttribute("style", "display:none;");
        screen2.setAttribute("style", "");
    }
}



const updatechat=function() {
    let origin=pusher.userName;
    let usersSet=new Set();
    usersSet.add(origin);
    let chatList = document.querySelector("#chatlist");
    chatList.innerHTML=`<ul id="chatlist" class="list-group overflow-auto w-75 h-50 text-center"></ul>`;
    let user = origin.split("@")[0];
    push.msgs.forEach(element => {
    let elemOrigin=element.split("!")[0];
    let elemuser=elemOrigin.split("@")[0];
    let msg=element.split("!")[1];
    let tem=elemOrigin.substring(1);
    if (tem === origin) chatList.innerHTML += `<li class="list-group-item text-xxl-end">you:
        ${msg}</li>`;

    else {
        chatList.innerHTML += `<li class="list-group-item text-xxl-start">${elemuser}:
    ${msg}</li>`;
    usersSet.add(elemOrigin);
    }
    users=usersSet.size;
    currentGroup.textContent = `${group}:online users: ${users}`;
    });
    

}
const sendMessage=function(){
    let message=document.querySelector("#msg").value;
    pusher.sendMessage(message);
    currentTime=60;
}

let logout = function () {
    screen2.setAttribute("style", "display:none;");
    screen1.setAttribute("style", "");
    clearInterval(timer);
    timer=null;
    currentTime = 0;
    chatList.innerHTML=`<ul id="chatlist" class="list-group overflow-auto w-75 h-50 text-center"></ul>`
}
let setTimerLabel = function () {

    time.textContent = currentTime < 60 ? `You will logout after: (0:${currentTime})` : `You will logout after: (1:00)`;
}
let updateTimer = function () {
    currentTime--;
    updatechat()
    if (currentTime < 0) {
        logout();
        clearInterval(timer);
    }
    else {
        setTimerLabel();

    }
}
joinbutton.addEventListener("click",function(){ join(); });
logoutButton.addEventListener("click",function(){ logout(); });
sendButton.addEventListener("click",function(){ sendMessage(); });