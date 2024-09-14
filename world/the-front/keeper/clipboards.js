let $clipboard = $(".clipboard");
let $loginUser = $("#login-user");
let $loginPass = $("#login-pass");
let $loginButton = $("#login-button");
let $loginInfo = $("#login-info");
let $registerUser = $("#register-user");
let $registerPass = $("#register-pass");
let $registerConfirmation = $("#register-confirmation");
let $registerButton = $("#register-button");
let $registerInfo = $("#register-info");
let $setForm = $("#set-form");
let $loginForm = $("#login-form");
let $changeOldPassword = $("#change-old-password");
let $changePassword = $("#change-password");
let $changeConfirmation = $("#change-confirmation");
let $changeButton = $("#change-button");
let $setButton = $("#set-button");
let $setInfo = $("#set-info");
let $returnButtons = $(".return-button");

//try to login
$loginButton.on("click", async (e) => {
    let response = await base.attemptLogin($loginUser.val(), $loginPass.val());

    if (response.status === "success") {
        Dialogue.addGlobalFlag("logged-in");
        closeClipboard("for-login");
        keeper.interrupt();
    }
    else {
        $loginInfo.text(response.message);
    }
});

//try to register an account
$registerButton.on("click", async function () {
    if ($registerPass.val() == $registerConfirmation.val()) {
        let response = await base.attemptRegister(
            $registerUser.val(),
            $registerPass.val()
        );

        if (response.status === "success") {
            $registerInfo.text("You hear a nod from deep within the shack. Your new account has been registered.");
        }
        else {
            $registerInfo.text(response.message);
        }
    }
    else {
        $registerInfo.text("The passwords must match.");
    }
});

$setButton.on("click", async function () {
    if ($changePassword.val() == $changeConfirmation.val()) {
        let response = await base.changePassword(
            $changeOldPassword.val(),
            $changePassword.val(),
            $changeConfirmation.val()
        );

        if (response.status === "success") {
            $setInfo.text("Password changed successfully.");
        }
        else {
            $setInfo.text("Change Error: " + response.message);
        }
    }
    else {
        $setInfo.text("The passwords must match.");
    }
});

let clickClose = function clickClose(e) {
    e.stopPropagation();
    let $currentClipboard = $(e.currentTarget).parent();

    if (!$currentClipboard.hasClass("on-counter")) {
        $currentClipboard.addClass("on-counter");
        $currentClipboard.find(".scribbles").removeClass("invisible");
    }
}

let closeClipboard = function closeClipboard(which) {
    let $currentClipboard = $(`.${which}`);

    if (!$currentClipboard.hasClass("on-counter")) {
        $currentClipboard.addClass("on-counter");
        $currentClipboard.find(".scribbles").removeClass("invisible");
    }
}

//pick up a clipboard
$clipboard.on("click", function clickClipboard(e) {
    let $currentClipboard = $(e.currentTarget);

    if ($currentClipboard.hasClass("on-counter")) {
        $clipboard.addClass("on-counter");
        $clipboard.find(".scribbles").removeClass("invisible");
        $currentClipboard.removeClass("on-counter");
        $currentClipboard.find(".scribbles").addClass("invisible");
    }
});

//put down a clipboard
$(".close").on("click", clickClose);