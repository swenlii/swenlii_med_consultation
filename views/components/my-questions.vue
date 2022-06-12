<div class="container">
    <div class="left-container2">
        <div class="personal-menu" >
            <h3 class="account-menu-header">Personal account</h3>
            <div class="account-menu-item selected"><a href="#my-questions">My questions</a></div>
            <div class="account-menu-item" v-if="userObj && userObj.isDoctor === 1"><a href="#my-comments">My comments</a></div>
            <div class="account-menu-item" v-if="userObj && userObj.isDoctor === 1"><a href="#my-balance">My balance</a></div>
            <div class="account-menu-item"><a href="#my-messages">My messages</a></div>
            <div class="account-menu-item"><a href="#settings">Settings</a></div>
        </div>
    </div>
    <div class="right-container2">
        <div class="my-questions" v-if="userObj">
            <h3 style="margin-bottom: 24px">My questions</h3>
            <hr>
            <div class="question" v-for="question in this.questions" v-if="showQuestion(question)">
                <div style="display: flex; justify-content: space-between">
                    <div style="display: flex; align-items: center">
                        <a :href="'#one-question/' + question.id" class="avatar-last-question" :style="'background-image: url(/images/users/' + (question.avatarPath ? question.avatarPath : 'user-avatar-placeholder.png') + ');'"></a>
                        <div>
                            <div class="author-last-question">By <a style="color: #333333" :href="'#one-question/' + question.id">{{question.userName}}</a></div>
                            <div class="time-last-question">
                                <img src="/images/clock-icon.png">
                                <div>{{question.day}} {{question.month}}, {{question.time}}</div>
                            </div>
                            <div :class="'answers-count-last-question ' + ((question.answers && question.answers.length > 0) ? '' : 'zero-answers')">{{question.answers ? question.answers.length : 0}} answers</div>
                        </div>
                    </div>
                    <div class="price-last-question">{{question.paymentCount}} USD</div>
                </div>
                <p><a :href="'#one-question/' + question.id" class="text-last-question">{{question.title}}</a></p>
                <hr>
            </div>
        </div>
        <div class="right-container2" style="position: relative" v-else>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                You must be logged in to see your questions.</div>
        </div>
    </div>
</div>