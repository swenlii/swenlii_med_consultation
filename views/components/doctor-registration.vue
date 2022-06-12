<div class="container">
    <div class="left-container registr-doctor-container">
        <form class="registr-doctor-form" v-on:submit="registrationDoctor($event)">
            <h3>Doctor registration</h3>
            <div class="avatar-in-registration">
            </div>
            <input type="file" accept="image/*" class="registr-doctor-files" id="registr-doctor-files" name="registr-files" placeholder="drag the file here" ref="registrDoctorFiles" @change="avatarChange()">
            <div class="drag-file" style="margin-top: 20px">
                <span>drag the file here</span>
                <label for="registr-doctor-files">Select</label>
            </div>
            <div class="text-in-doctor-registration">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et<br>
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip<br>
                ex ea commodo consequat.
            </div>
            <textarea v-model="aboutMe" minlength="6" class="textarea-in-doctor-registration" placeholder="About you">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</textarea>
            <div class="doctor-registration-colums">
                <div class="doctor-registration-colum">
                    <input type="text" name="question-title" v-model="firstLastName" placeholder="Enter your first and last name" minlength="4" maxlength="300" required>
                    <input type="password" autocomplete="new-password" name="question-title" v-model="password" placeholder="Enter password" minlength="6" maxlength="200" required>
                    <input type="text" name="question-title" v-model="experience" placeholder="Enter your experience" maxlength="400">
                </div>
                <div class="doctor-registration-colum">
                    <input type="email" name="question-title" v-model="email" placeholder="Enter your email" maxlength="200" required>
                    <input type="password" autocomplete="new-password" name="question-title" v-model="repeatPassword" placeholder="Repeat password" minlength="6" maxlength="200" required>
                    <select id="doctor-profession" style="margin-bottom: 0px" @change="addProfession(this.value)" required>
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
            <div class="text-in-doctor-registration" style="margin-top: 13px">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et<br>
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip<br>
                ex ea commodo consequat.
            </div>
            <div class="margin-for-button-registr"></div>
            <input type="submit" class="registr-button" value="Registration">
        </form>
    </div>
    <div class="right-container">
        <ask-doctor-form v-bind:user-obj="userObj"></ask-doctor-form>
    </div>
</div>