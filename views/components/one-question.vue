<div class="container">
    <div class="left-container">
        <div class="one-question">
            <h3 class="first-h3">{{this.oneQuestion.title}}</h3>
            <div class="close-answer">
                <button id="closeButton" v-if="userObj && userObj.id === oneQuestion.userId" @click="closeQuestion()">Close answer</button>
                <div>Consult a {{oneQuestion.sectionOfMedecine}}</div>
            </div>
            <div class="question-block">
                <div class="who-when">
                    <a href="#" class="question-who">{{oneQuestion.userName}}</a>
                    <div class="question-when">{{oneQuestion.day}} {{oneQuestion.month}}, {{oneQuestion.time}}</div>
                </div>
                <div class="question-text">{{oneQuestion.text}}</div>
                <div v-if="oneQuestion.files && oneQuestion.files !== ''">
                    <div class="question-attachments">Attachments</div>
                    <div class="file-image">
                        <div class="one-question-attachment" v-for="file in oneQuestion.files.split(',')" :style="backgroundPath(file)"><a :href="'/images/questions/' + file">{{file.split('/')[1]}}</a></div>
                    </div>
                </div>
                <hr>
                <div style="display: flex; justify-content: space-between">
                    <div class="tags-block" v-if="oneQuestion.keyword">
                        <a class="tag" @click="searchByTag(tag)" v-for="tag in oneQuestion.keyword.split(',')">{{tag}}</a>
                    </div>
                    <div class="price" v-if="oneQuestion.paymentFree === 0">{{oneQuestion.paymentCount}} {{oneQuestion.paymentCurrency}}</div>
                </div>
            </div>
            <h3 class="second-h3">Doctors' answers</h3>
            <div class="answers-one-question" v-if="oneQuestion.answers">
                <div v-for="answer in oneQuestion.answers">
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
                                    <button v-if="showTrueAnswer(answer.trueAnswer)" @click="() => trueAnswerClick(answer)" :class="(answer.trueAnswer === 1) ? '' : 'active'">True Answer</button>
                                    <img src="/images/like.png" style="cursor: pointer;" @click="likeIt(answer)">
                                    {{answer.likesCount && answer.likesCount !== '' ? answer.likesCount.split('|').length : 0}} like it
                                </div>
                            </div>
                            <div class="proffessional-one-question">{{answer.specializations}}</div>
                        </div>

                    </div>
                    <div class="text-one-question">{{answer.answerText}}</div>
                </div>
                <hr style="margin-top:15px; margin-bottom: 15px" v-if="answer !== oneQuestion.answers[oneQuestion.answers.length - 1]">
                </div>
            </div>
            <div class="answers-one-question" v-if="!oneQuestion.answers">
                <h5>There are no answers yet. For now.</h5>
            </div>
            <div class="form-answer" v-if="userObj && userObj.isDoctor === 1">
                <h4 style="font-size: 18px; font-weight: 600; margin: 40px 0px 5px 0px; color: black;">Your answer</h4>
                <textarea placeholder="Your answer" id="textAnswer" required></textarea>
                <input type="submit" value="Reply" class="post-answer-button" @click="postAnswer">
            </div>
        </div>
        <div id="window-close-answer" class="window-close-answer">
            <div class="window">
                <h3>Do you want to close question?</h3>
                <div class="text-under-head">Good day! I am diagnosed with varicosity of the lower extremistes...</div>
                <div class="buttons">
                    <button class="button-yes" @click="closeWin('yes')">Yes</button>
                    <button class="button-no"  @click="closeWin('no')">No</button>
                </div>
            </div>
        </div>
    </div>
    <div class="right-container">
        <ask-doctor-form v-bind:user-obj="userObj"></ask-doctor-form>
    </div>
</div>