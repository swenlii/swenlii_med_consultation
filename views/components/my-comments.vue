<div class="container">
    <div class="left-container2">
        <div class="personal-menu" >
            <h3 class="account-menu-header">Personal account</h3>
            <div class="account-menu-item"><a href="#my-questions">My questions</a></div>
            <div class="account-menu-item selected" v-if="userObj && userObj.isDoctor === 1"><a href="#my-comments">My comments</a></div>
            <div class="account-menu-item"><a href="#my-messages">My messages</a></div>
            <div class="account-menu-item"><a href="#settings">Settings</a></div>
        </div>
    </div>
    <div class="right-container2">
        <div class="my-questions" v-if="userObj && userObj.isDoctor === 1">
            <h3 style="margin-bottom: 24px">My comments</h3>
            <hr>
            <div v-for="answer in myAnswers">
                <div>
                    <div style="margin-bottom: 10px; display: flex">
                        <a href="#" class="avatar-one-question" :style="answer.avatarPath && answer.avatarPath !== '' ? 'background-image: url(/images/users/' + answer.avatarPath + ');' : 'user-avatar-placeholder.png'"></a>
                        <div style="flex: 1">
                            <div style="overflow: hidden">
                                <div style="display: inline-block">
                                    <div>
                                        <a href="#" class="author-one-question">{{answer.firstLastName}}</a>
                                        <div class="time-one-question">{{answer.day}} {{answer.month}}, {{answer.time}}</div>
                                        <div class="true-answer-one-question" v-if="answer.trueAnswer === 1">
                                            <img src="/images/star-icon.png">
                                            <div>True answer</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="right-question" style="display: inline-block">
                                    <img src="/images/like.png" style="cursor: pointer;">
                                    {{answer.likesCount && answer.likesCount !== '' ? answer.likesCount.split('|').length : 0}} like it
                                </div>
                            </div>
                            <div class="proffessional-one-question">{{answer.specializations}}</div>
                        </div>

                    </div>
                    <div class="text-one-question">{{answer.answerText}}</div>
                </div>
                <hr style="margin-top:15px; margin-bottom: 15px" v-if="answer !== myAnswers[myAnswers.length - 1]">
            </div>
        </div>
        <div class="right-container2" style="position: relative" v-else>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                You must be logged how doctor in to see your questions.</div>
        </div>
    </div>
</div>