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
            <div class="message-with-one-doctor" id="message-with-one-doctor">
                <h3 style="margin-bottom: 20px">DOCTOR {{messages.firstLastName}}</h3>
                <hr>
                <div class="info-doctor">
                    <div style="display: flex; float: left">
                        <a href="#" class="big-avatar-doctor" :style="'background-image: url(/images/users/' + (messages.avatarPath ? messages.avatarPath : 'user-avatar-placeholder.png') + ')'"></a>
                        <div class="right-info-doctor">
                            <div>
                                <a href="#" class="name-of-doctor" style="margin-top:5px; margin-right: 0px; color: #333333">{{messages.firstLastName}}</a>
                                <img style="display: inline-block; height: 12px; margin-right: 3px"src="/images/star-icon.png">
                                <img style="display: inline-block; height: 12px; margin-right: 3px"src="/images/star-icon.png">
                                <img style="display: inline-block; height: 12px; margin-right: 3px"src="/images/star-icon.png">
                                <img style="display: inline-block; height: 12px; margin-right: 3px"src="/images/star-icon.png">
                            </div>
                            <div class="who-doctor">{{messages.specializations}}</div>
                            <div class="experience-doctor">Work experience: {{messages.experience}}</div>
                        </div>
                    </div>
                    <div class="doctor-online" v-if="online === 1">Online</div>
                    <div class="doctor-online" style="color: #333333" v-else>Offline</div>
                </div>
                <hr>
                <div class="all-messages-block">
                    <div v-for="chatObj in messages.replyArr" :class="chatObj.userId === userObj.id ? 'message-doctor-to-me' : 'my-message-to-doctor'">
                        <a href="#" class="avatar-in-message" :style="avatarInMessage(chatObj.userId)"></a>
                        <div class="message" v-html="chatObj.message"></div>
                    </div>
                </div>
                <div class="form-message-send">
                    <div class="send-message"><input v-model="messageText" @keyup="keyUp($event)" type="text" placeholder="Send a message"><button @click="sendMessage()">Send</button></div>
                    <div>
                        <input type="file" id="send-message-files" ref="filesInMessage" name="question-files" placeholder="drag the file here" @change="addFilesForMessage">
                        <div class="drag-file">
                            <span>drag the file here</span>
                            <label for="send-message-files">Select</label>
                        </div>
                    </div>
                    <div class="files-block">
                        <div :id="file.name.split('.')[0]" class="file-tag" v-for="file in messageFiles"><span>{{file.name}}</span>      <img @click="hideFile(file.name.split('.')[0], file.name)" src="/images/x-icon.png"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-container2" style="position: relative" v-else>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                You must be logged in to see messages.</div>
        </div>
    </div>
</div>