Pusher.logToConsole = true;
export var msgs=[];
let addMsg=function(msg) {
   msgs.push(msg)
}
export var clearMsgs=function(){
    msgs=[];
}
export class PusherHandler {

    constructor(userName, group) {
        this.event = "msg";
        this.secret = '7d70f7639ec7b58c30a0';
        this.key = "448486c547d013582aeb";
        this.app = "1261092";
        this.numberUsers = 0;
        this.userName = userName + "@" + Math.random().toString(16).slice(2);
        this.group = group;
        this.pusher = new Pusher(this.key, {
            cluster: 'eu',
        });
        this.presence = null;
        this.channel = null;
        this.subscribeTo(group);
        // if (!document.cookie.match("(^|;) ?user_id=([^;]*)(;|$)")) {
        //     // Primitive auth! This 'user_id' cookie is read by your auth endpoint,
        //     // and used as the user_id in the subscription to the 'presence-quickstart'
        //     // channel. This is then displayed to all users in the user list.
        //     // In your production app, you should use a secure auth system.
        //     document.cookie = "user_id=" + this.userName;
        // }

    }
    addMember() {
        this.numberUsers++;
    }
    removeMember() {
        this.numberUsers--;
    }
    
    subscribeTo(group) {
        this.channel = this.pusher.subscribe(group.toLowerCase());
        this.channel.bind(this.event, function (data) {
            addMsg(JSON.stringify(data));
        })
        // this.presence = this.pusher.subscribe(`presence-${group.toLowerCase()}`)
        // this.presence.bind("pusher:subscription_succeeded", () =>
        //     this.presence.members.each(this.addMember()));
        // this.presence.bind("pusher:member_added", this.addMember());
        // this.presence.bind("pusher:member_removed", (this.removeMember()));
    }
    unSubscribe(group) {
        this.channel = this.pusher.unsubscribe(group.toLowerCase());
        // this.presence = this.pusher.unsubscribe(`presence-${group.toLowerCase()}`)
        this.channel = null;
        // this.presence = null;
    }
    disconnect(group) {
        this.presence = this.pusher.unsubscribe(`presence-${group.toLowerCase()}`)
        this.channel = null;
        this.presence = null;
    }
    countUsers() {
        return this.numberUsers
    }
    getMD5(body) {
        return CryptoJS.MD5(JSON.stringify(body));
    }
    getAuthSignature(md5, timeStamp) {
        return CryptoJS.HmacSHA256(`POST\n/apps/${this.app}/events\nauth_key=${this.key}&auth_timestamp=${timeStamp}&auth_version=1.0&body_md5=${md5}`, this.secret);
    }
    sendMessage = async function (message) {
        let body = { data: `${this.userName}!${message}`, name: this.event, channel: this.group }
        let timeStamp = Date.now() / 1000;
        let md5 = this.getMD5(body);
        //https://cors.bridged.cc/
        let url = `https://cors.bridged.cc/https://api-eu.pusher.com/apps/${this.app}/events?body_md5=${md5}&auth_version=1.0&auth_key=${this.key}&auth_timestamp=${timeStamp}&auth_signature=${this.getAuthSignature(md5, timeStamp)}`;
        let req = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

    }

}

