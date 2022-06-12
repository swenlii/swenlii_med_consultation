<div class="container">
    <div class="left-container">
        <div class="latest-questions">
            <div class="paid-unpaid">
                <input id="toggle-on" class="toggle toggle-left" name="toggle" v-model="paidQuestionCom" value="true" type="radio">
                <label for="toggle-on" :class="{'btn': true, 'yes': true, 'no-active': paidQuestionCom === 'close'}">Paid</label>
                <input id="toggle-off" class="toggle toggle-right" name="toggle" v-model="paidQuestionCom" value="false" type="radio">
                <label for="toggle-off" :class="{'btn': true, 'yes': true, 'no-active': paidQuestionCom === 'close'}">Unpaid</label>
            </div>
            <h3 id="latestQuestionHeader">Latest questions</h3>
            <hr>
            <div v-if="questions.length > 0">
                    <div class="question" v-for="(question, index) in questionsArr" v-if="index < countOnPage">
                        <div style="display: flex; justify-content: space-between">
                            <div style="display: flex; align-items: center">
                                <a :href="'#one-question/'+ question.id" class="avatar-last-question" :style="'background-image: url(/images/users/' + (question.avatarPath ? question.avatarPath : 'user-avatar-placeholder.png') + ');'"></a>
                                <div>
                                    <div class="author-last-question">By <a style="color: #333333" :href="'#one-question/' + question.id">{{question.userName}}</a></div>
                                    <div class="time-last-question">
                                        <img src="/images/clock-icon.png">
                                        <div>{{question.day}} {{question.month}}, {{question.time}}</div>
                                    </div>
                                    <div :class="'answers-count-last-question ' + ((question.answers && question.answers.length > 0) ? '' : 'zero-answers')">{{question.answers ? question.answers.length : 0}} answers</div>
                                </div>
                            </div>
                            <div class="price-last-question" v-if="question.paymentFree === 0">{{question.paymentCount}} {{question.paymentCurrency}}</div>
                        </div>
                        <p><a :href="'#one-question/' + question.id" class="text-last-question">{{question.title}}</a></p>
                        <hr>
                    </div>
            </div>
            <div v-else>
                Questions not found.
            </div>
            <div class="margin-for-button-registr"></div>
            <input type="submit" class="show-more-button" value="Show more" v-if="questionsArr.length > countOnPage" @click="showMore()">
        </div>
    </div>
    <div class="right-container">
        <ask-doctor-form v-bind:user-obj="userObj"></ask-doctor-form>
    </div>
</div>

