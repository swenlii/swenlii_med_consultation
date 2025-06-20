<div class="container">
    <div class="left-container2" style="min-height: 430px">
        <div id="settings" class="settings" v-if="userObj && userObj.isDoctor === 0">
            <h3>Settings</h3>
            <input type="text" placeholder="Search by name">
            <select>
                <option value="" selected disabled>Choose selection</option>
                <option value="variant1">Variant 1</option>
                <option value="variant2">Variant 2</option>
                <option value="variant3">Variant 3</option>
                <option value="variant4">Variant 4</option>
            </select>
            <select>
                <option value="" selected disabled>Scientific degree</option>
                <option value="variant1">Variant 1</option>
                <option value="variant2">Variant 2</option>
                <option value="variant3">Variant 3</option>
                <option value="variant4">Variant 4</option>
            </select>
            <select id="doctor-profession2" @change="addSearchProfession()">
                <option value="" selected disabled>Doctor's specilization</option>
                <option value="Allergologist-Immunologist">Allergologist-Immunologist</option>
                <option value="Andrologist">Andrologist</option>
                <option value="Resuscitation anesthetist">Resuscitation anesthetist</option>
                <option value="Obstetrician">Obstetrician</option>
                <option value="Trichologist">Trichologist</option>
                <option value="Venereologist">Venereologist</option>
                <option value="Veterinarian">Veterinarian</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Hematologist">Hematologist</option>
                <option value="Hepatologist">Hepatologist</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Gynecologist-endocrinologist">Gynecologist-endocrinologist</option>
                <option value="Hirudotherapist">Hirudotherapist</option>
                <option value="Homeopathist">Homeopathist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Children\'s gynecologist">Children's gynecologist</option>
                <option value="Children\'s dermatologist">Children's dermatologist</option>
                <option value="Children\'s ENT">Children's ENT</option>
                <option value="Children\'s neurologist">Children's neurologist</option>
                <option value="Children\'s dentist">Children's dentist</option>
                <option value="Children\'s surgeon">Children's surgeon</option>
                <option value="Nutritionist">Nutritionist</option>
                <option value="Infectionist">Infectionist</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Heart surgeon">Heart surgeon</option>
                <option value="Beautician">Beautician</option>
                <option value="Reproductologist">Reproductologist</option>
                <option value="Speech therapist">Speech therapist</option>
                <option value="ENT">ENT</option>
                <option value="Mammologist">Mammologist</option>
                <option value="Chiropractor">Chiropractor</option>
                <option value="Masseur">Masseur</option>
                <option value="Expert in narcology">Expert in narcology</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Neurosurgeon">Neurosurgeon</option>
                <option value="Oculist">Oculist</option>
                <option value="Oncologist">Oncologist</option>
                <option value="Orthodontist">Orthodontist</option>
                <option value="Orthopedist">Orthopedist</option>
                <option value="Ophthalmologist">Ophthalmologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Plastic surgeon">Plastic surgeon</option>
                <option value="Proctologist">Proctologist</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Psychologist">Psychologist</option>
                <option value="Psychotherapist">Psychotherapist</option>
                <option value="Pulmonologist">Pulmonologist</option>
                <option value="Rheumatologist">Rheumatologist</option>
                <option value="Radiologist">Radiologist</option>
                <option value="Sexologist">Sexologist</option>
                <option value="Somnologist">Somnologist</option>
                <option value="Vascular surgeon">Vascular surgeon</option>
                <option value="Dentist">Dentist</option>
                <option value="Therapist">Therapist</option>
                <option value="Traumatologist">Traumatologist</option>
                <option value="Urologist">Urologist</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Phlebologist">Phlebologist</option>
                <option value="TB specialist">TB specialist</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Dental surgeon">Dental surgeon</option>
                <option value="Endocrinologist">Endocrinologist</option>
            </select>
            <div class="files-block">
                <div class="file-tag" v-for="prof in searchSpecializ"><span>{{prof}}</span><img @click="hideSearchSpecializ(prof)" src="/images/x-icon.png"></div>
            </div>
            <input type="submit" class="next-button" value="Search" @click="searchBySpecializ">
        </div>
        <div class="personal-menu" v-else>
            <h3 class="account-menu-header">Personal account</h3>
            <div class="account-menu-item"><a href="#my-questions">My questions</a></div>
            <div class="account-menu-item" v-if="userObj && userObj.isDoctor === 1"><a href="#my-comments">My comments</a></div>
            <div class="account-menu-item" v-if="userObj && userObj.isDoctor === 1"><a href="#my-balance">My balance</a></div>
            <div class="account-menu-item"><a href="#my-messages">My messages</a></div>
            <div class="account-menu-item selected"><a href="#settings">Settings</a></div>
        </div>
    </div>
    <div class="registr-doctor-container" style="margin-left: 20px;" v-if="userObj && userObj.isDoctor === 1">
        <form class="registr-doctor-form"  v-on:submit="saveSettings($event)">
            <h3>Doctor registration</h3>
            <div class="avatar-in-registration">
            </div>
            <input type="file" accept="image/*" class="registr-doctor-files" id="registr-doctor-files" name="registr-files" placeholder="drag the file here" ref="registrDoctorFiles" @change="avatarChange()">
            <div class="drag-file" style="margin-top: 20px; margin-bottom: 20px">
                <span>drag the file here</span>
                <label for="registr-doctor-files">Select</label>
            </div>
            <textarea v-model="aboutMe" class="textarea-in-doctor-registration" placeholder="About you"></textarea>
            <div class="doctor-registration-colums">
                <div class="doctor-registration-colum">
                    <input type="text" v-model="firstLastName" placeholder="Enter your first and last name" maxlength="300">
                    <input type="password" v-model="changePassword" placeholder="Old password" maxlength="200">
                    <input type="text" v-model="experience" placeholder="Enter your experience" maxlength="400">
                    <select v-model="currency">
                        <option value="">Choose currency</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="RUB">RUB</option>
                        <option value="CZK">CZK</option>
                    </select>
                </div>
                <div class="doctor-registration-colum">
                    <input type="email" v-model="email" placeholder="Enter your email" maxlength="200">
                    <input type="password" v-model="repeatPassword" placeholder="New password" maxlength="200">
                    <select id="doctor-profession" style="margin-bottom: 0px" @change="addProfession(this.value)">
                        <option value="" selected disabled>Choose selection</option>
                        <option value="Allergologist-Immunologist">Allergologist-Immunologist</option>
                        <option value="Andrologist">Andrologist</option>
                        <option value="Resuscitation anesthetist">Resuscitation anesthetist</option>
                        <option value="Obstetrician">Obstetrician</option>
                        <option value="Trichologist">Trichologist</option>
                        <option value="Venereologist">Venereologist</option>
                        <option value="Veterinarian">Veterinarian</option>
                        <option value="Gastroenterologist">Gastroenterologist</option>
                        <option value="Hematologist">Hematologist</option>
                        <option value="Hepatologist">Hepatologist</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Gynecologist-endocrinologist">Gynecologist-endocrinologist</option>
                        <option value="Hirudotherapist">Hirudotherapist</option>
                        <option value="Homeopathist">Homeopathist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Children\'s gynecologist">Children's gynecologist</option>
                        <option value="Children\'s dermatologist">Children's dermatologist</option>
                        <option value="Children\'s ENT">Children's ENT</option>
                        <option value="Children\'s neurologist">Children's neurologist</option>
                        <option value="Children\'s dentist">Children's dentist</option>
                        <option value="Children\'s surgeon">Children's surgeon</option>
                        <option value="Nutritionist">Nutritionist</option>
                        <option value="Infectionist">Infectionist</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Heart surgeon">Heart surgeon</option>
                        <option value="Beautician">Beautician</option>
                        <option value="Reproductologist">Reproductologist</option>
                        <option value="Speech therapist">Speech therapist</option>
                        <option value="ENT">ENT</option>
                        <option value="Mammologist">Mammologist</option>
                        <option value="Chiropractor">Chiropractor</option>
                        <option value="Masseur">Masseur</option>
                        <option value="Expert in narcology">Expert in narcology</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Neurosurgeon">Neurosurgeon</option>
                        <option value="Oculist">Oculist</option>
                        <option value="Oncologist">Oncologist</option>
                        <option value="Orthodontist">Orthodontist</option>
                        <option value="Orthopedist">Orthopedist</option>
                        <option value="Ophthalmologist">Ophthalmologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Plastic surgeon">Plastic surgeon</option>
                        <option value="Proctologist">Proctologist</option>
                        <option value="Psychiatrist">Psychiatrist</option>
                        <option value="Psychologist">Psychologist</option>
                        <option value="Psychotherapist">Psychotherapist</option>
                        <option value="Pulmonologist">Pulmonologist</option>
                        <option value="Rheumatologist">Rheumatologist</option>
                        <option value="Radiologist">Radiologist</option>
                        <option value="Sexologist">Sexologist</option>
                        <option value="Somnologist">Somnologist</option>
                        <option value="Vascular surgeon">Vascular surgeon</option>
                        <option value="Dentist">Dentist</option>
                        <option value="Therapist">Therapist</option>
                        <option value="Traumatologist">Traumatologist</option>
                        <option value="Urologist">Urologist</option>
                        <option value="Pharmacist">Pharmacist</option>
                        <option value="Phlebologist">Phlebologist</option>
                        <option value="TB specialist">TB specialist</option>
                        <option value="Surgeon">Surgeon</option>
                        <option value="Dental surgeon">Dental surgeon</option>
                        <option value="Endocrinologist">Endocrinologist</option>
                    </select>
                    <div class="files-block">
                        <div class="file-tag" id="prof" v-for="prof in specializations"><span>{{prof}}</span>      <img src="/images/x-icon.png" @click="hideSpecializ(prof)"></div>
                    </div>
                </div>
            </div>
            <div class="margin-for-button-registr"></div>
            <input type="submit" class="save-button" value="Save">
        </form>
    </div>
    <div class="right-container2" v-else-if="userObj && userObj.isDoctor === 0">
        <div class="my-doctors">
            <h3 style="margin-bottom: 32px">Doctors</h3>
            <hr>
            <div v-for="doctor in doctors">
                <div class="one-doctor">
                <div class="info-doctor">
                    <a href="#" class="big-avatar-doctor" :style="'background-image: url(/images/users/' + (doctor.avatarPath ? doctor.avatarPath : 'user-avatar-placeholder.png') + ')'"></a>
                    <div class="right-info-doctor">
                        <div>
                            <a href="#" class="name-of-doctor">{{doctor.firstLastName}}</a>
                            <img style="display: inline-block; height: 12px; margin-right: 5px"src="/images/star-icon.png">
                            <img style="display: inline-block; height: 12px; margin-right: 5px"src="/images/star-icon.png">
                            <img style="display: inline-block; height: 12px; margin-right: 5px"src="/images/star-icon.png">
                            <img style="display: inline-block; height: 12px; margin-right: 5px"src="/images/star-icon.png">
                        </div>
                        <div class="who-doctor">{{doctor.specializations}}</div>
                        <div class="experience-doctor">Work experience: {{doctor.experience}}</div>
                    </div>
                </div>
                </div>
                <button class="online-consiltation-button" @click="showWinPay(doctor.id)">Online consultation 10 EUR</button><hr>
            </div>
        </div>
    </div>
    <div class="right-container2" style="position: relative" v-else>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            You must be logged in to see your settings.</div>
    </div>
    <div id="pay-to-doctor" class="right-container">
        <form class="ask-doctor-form" v-on:submit="submitOnPayDoctor($event)">
            <div id="ask-doctor-form-step2">
                <h3 class="header">Payment</h3>
                <div>
                    <p>All the money issues go to the doctors</p>
                    <div class="step-2-payment-count"><input type="number" step="0.01" min="0.01" style="margin: 0px" name="payment-count" placeholder="Enter the price, min 3$" v-model="paymentCount" required><span>$</span></div>
                    <p>Choose payment system</p>
                    <div style="display: flex">
                        <input id="toggle-card" class="toggle toggle-left" name="toggle" value="card" v-model="paymentType" type="radio" checked>
                        <label for="toggle-card" class="btn yes"><span>Card</span><img src="/images/credit-card.png"></label>
                        <input id="toggle-coinbase" class="toggle toggle-right" name="toggle" value="coinbase" v-model="paymentType" type="radio">
                        <label for="toggle-coinbase" class="btn no"><img src="/images/coinbase.png"></label>
                    </div>
                    <div class="payment-card" v-if="paymentType === 'card'">
                        <input type="text" name="payment-count" placeholder="Enter the name" v-model="paymentCardName">
                        <input type="text" name="payment-count" placeholder="Enter the number" v-model="paymentCardNumber">
                        <div class="payment-card-three">
                            <input type="text" style="margin-left: 0px" name="payment-count" placeholder="12/20" v-model="paymentCardDate">
                            <input type="text" name="payment-count" placeholder="2021" v-model="paymentCardYear">
                            <input type="text" name="payment-count" placeholder="CVV" v-model="paymentCardCVV">
                        </div>
                        <div class="payment-agreement">
                            <input type="checkbox" id="check" v-model="paymentCardAgreement"/>
                            <label for="check" style="--d: 10px;">
                                <svg viewBox="0,0,50,90">
                                    <path d="M5 30 L 20 45 L 45 5"></path>
                                </svg>
                            </label>
                            <span>I have read and accept the user agreement</span>
                        </div>
                    </div>
                    <div class="payment-coinbase" v-if="paymentType === 'coinbase'">
                        <p>BitCoin, Ethereum, BitCoin Cash, LiteCoin, <br>
                            USD Coin. You will be redirected <br>
                            to CoinBase to complete payment.
                        </p>
                        <div style="text-align: center; margin-top: 20px">
                            <a href="#" target="_blank" id="link-on-coinbase">Follow the link</a>
                        </div>
                    </div>
                </div>
            </div>
            <input type="submit" class="next-button" value="Next">
        </form>
    </div>

    <div id="pay-window-close" class="window-close-answer">
        <div class="window">
            <h3>For consultation you need to pay, are you ready?</h3>

            <div class="buttons">
                <button class="button-yes" @click="closeWin('yes')">Yes</button>
                <button class="button-no"  @click="closeWin('no')">No</button>
            </div>
        </div>
    </div>
</div>