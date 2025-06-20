<div class="container">
    <div class="left-container2">
        <div class="personal-menu" >
            <h3 class="account-menu-header">Personal account</h3>
            <div class="account-menu-item"><a href="#my-questions">My questions</a></div>
            <div class="account-menu-item" v-if="userObj && userObj.isDoctor === 1"><a href="#my-comments">My comments</a></div>
            <div class="account-menu-item selected" v-if="userObj && userObj.isDoctor === 1"><a href="#my-balance">My balance</a></div>
            <div class="account-menu-item"><a href="#my-messages">My messages</a></div>
            <div class="account-menu-item"><a href="#settings">Settings</a></div>
        </div>
    </div>
    <div class="right-container2">
        <div class="my-questions" v-if="userObj && userObj.isDoctor === 1">
            <h3 style="margin-bottom: 24px">My balance</h3>
            <hr>
            <h5>Fiat currency</h5>
            <div>EUR: {{userObj.balance.EUR }}</div>
            <div>USD: {{userObj.balance.USD }}</div>
            <div>RUB: {{userObj.balance.RUB }}</div>
            <div>CZK: {{userObj.balance.CZK }}</div>
            <hr>
            <h5>Crypto currency</h5>
            <div>BTC: {{userObj.balance.BTC }}</div>
            <div>BCH: {{userObj.balance.BCH }}</div>
            <div>DAI: {{userObj.balance.DAI }}</div>
            <div>ETH: {{userObj.balance.ETH }}</div>
            <div>LTC: {{userObj.balance.LTC }}</div>
            <div>USDC: {{userObj.balance.USDC}}</div>
            <hr>
            <h5>Total</h5>
            <div>{{$parent.getBalance}} {{userObj.balance.preferredCurrency}}</div>
        </div>
        <div class="right-container2" style="position: relative" v-else>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                You must be logged how doctor in to see your questions.</div>
        </div>
    </div>
</div>