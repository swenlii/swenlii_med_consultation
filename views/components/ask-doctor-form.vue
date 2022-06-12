<div class="filter-form" v-if="$root.showFilter === true || (userObj && userObj.isDoctor === 1)">
    <h3 class="header">Filter</h3>
    <label>
        <select v-model="sectionForSearch">
            <option value="">Choose selection</option>
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
    </label>
    <input type="text" name="question-title" v-model="keywords" placeholder="Set keywords" maxlength="150" minlength="3">
    <label>
        <select v-model="currency">
            <option value="">Choose currency</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="RUB">RUB</option>
            <option value="CZK">CZK</option>
        </select>
    </label>
    <input type="submit" class="next-button" value="Search" @click="searchByFilters($event)">
</div>
<form class="ask-doctor-form" v-else v-on:submit="pressNext($event)">
    <div id="ask-doctor-form-step1" v-if="step === 1">
        <h3 class="header">Ask a doctor</h3>
        <input type="email" name="question-email" v-model="emailOfUser" placeholder="Your Email" v-if="!userObj">
        <select v-model="sectionOfMedicine" required>
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
        <input type="text" name="question-title" v-model="titleOfQuestion" placeholder="Short question title" maxlength="300" minlength="2" required>
        <textarea placeholder="Your question to the doctor" v-model="questionText" minlength="6" required></textarea>
        <input type="text" name="question-keyword" placeholder="Set keywords" minlength="3" maxlength="300" v-model="questionKeyword" required>
        <input type="file" size="45" class="ask-doctor-files" id="ask-doctor-files" name="question-files" placeholder="drag the file here" ref="askDoctorFiles" @change="addFiles">
        <div class="drag-file">
            <span>drag the file here</span>
            <label for="ask-doctor-files">Select</label>
        </div>
        <div class="files-block" id="files-block">
            <div :id="file.name.split('.')[0]" class="file-tag" v-for="file in questionFiles"><span>{{file.name}}</span>      <img @click="hideFile(file.name.split('.')[0], file.name)" src="/images/x-icon.png"></div>
        </div>
    </div>
    <div id="ask-doctor-form-step2" v-if="step === 2">
        <h3 class="header">Payment</h3>
        <p>Question fee</p>
        <div style="display: flex">
            <input id="toggle-on-doctor" class="toggle toggle-left" name="toggle2" value="0" v-model="paymentFree" type="radio" checked>
            <label for="toggle-on-doctor" class="btn yes">Paid</label>
            <input id="toggle-off-doctor" class="toggle toggle-right" name="toggle2" value="1" v-model="paymentFree" type="radio">
            <label for="toggle-off-doctor" class="btn no">Unpaid</label>
        </div>
        <div v-if="paymentFree === '0'">
            <p>All the money issues go to the doctors</p>
            <select v-model="paymentCurrency" style="margin-top: 0px; margin-bottom: 19px" @change="changeRate" required>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="RUB">RUB</option>
                <option value="CZK">CZK</option>
            </select>
            <div class="step-2-payment-count"><input type="number" step="0.01" min="0.01" style="margin: 0px" name="payment-count" placeholder="Enter the price, min 3$" v-model="paymentCount" required><span>{{paymentCurrency}}</span></div>
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
                    <a href="#" target="_blank" id="follow-the-link">Follow the link</a>
                </div>
            </div>
        </div>
    </div>
    <input type="submit" class="next-button" value="Next">
</form>