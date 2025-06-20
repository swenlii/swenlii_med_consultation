<div class="container">
    <div class="left-container2">
        <div class="personal-menu" >
            <h3 class="account-menu-header">Personal account</h3>
            <div class="account-menu-item"><a href="#my-questions">My questions</a></div>
            <div class="account-menu-item" v-if="userObj && userObj.isDoctor === 1"><a href="#my-comments">My comments</a></div>
            <div class="account-menu-item" v-if="userObj && userObj.isDoctor === 1"><a href="#my-balance">My balance</a></div>
            <div class="account-menu-item selected"><a href="#my-messages">My messages</a></div>
            <div class="account-menu-item"><a href="#settings">Settings</a></div>
        </div>
    </div>
    <div class="right-container2">
        <div class="my-messages" v-if="userObj">
            <div class="all-my-messages" id="all-my-messages">
                <h3>My messages</h3>
                <hr>
                <div class="my-one-message" v-for="mess in allMessages" v-if="allMessages.length > 0 && mess.paymentComplete === 1">
                    <a :href="'#my-dialog/' + mess.id" @click="clickOnDialog(mess.dialogId)" style="color: #333333; display: flex; margin-right: 30px;">
                        <a href="#" class="avatar-on-message" :style="'background-image: url(/images/users/' + (mess.avatarPath ? mess.avatarPath : 'user-avatar-placeholder.png') + ')'"></a>
                        <div class="info-on-message">
                            <a href="#" class="name-of-doctor">{{mess.firstLastName}}</a>
                            <div class="info-of-doctor" v-if="mess.message">{{mess.message}}</div>
                            <div class="info-of-doctor" v-else>Ask the doctor a question online and get an answer instantly</div>
                        </div>
                    </a>
                    <div class="messages-count" v-if="(userObj.isDoctor === 1 && mess.unreadCountDoctor > 0) || (userObj.isDoctor === 0 && mess.unreadCountUser > 0)">{{userObj.isDoctor === 1 ? mess.unreadCountDoctor : mess.unreadCountUser}}</div><hr>
                </div>
                <div v-else>
                    You have no dialogs yet.
                    <span v-if="userObj.isDoctor === 0">You can start the consultation in settings.</span>
                    <span v-if="userObj.isDoctor === 1">When the consultation begins, a dialogue will appear here.</span>
                </div>
            </div>
        </div>
        <div class="right-container2" style="position: relative" v-else>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                You must be logged in to see messages.</div>
        </div>
    </div>
</div>