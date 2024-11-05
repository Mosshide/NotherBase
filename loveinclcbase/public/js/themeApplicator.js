// this class is used to apply the theme to the website
class ThemeApplicator {
    constructor(settings) {
        this.settings = {
            description: "Love INC of Lewis County is mobilizing the church to transform lives.",
            signUpAfterHero: false,
            enableExperimental: false,
            ...settings
        };

        this.signUpCooldown = 30000;
        this.lastSignUp = 0;

        this.path = window.location.pathname.split('/');
        this.path = this.path[this.path.length - 1];

        // get all the elements needed
        this.$head = $("head");
        this.$main = $("main");
        this.$body = $("body");

        // add the font awesome css to the head
        //this.$head.append($(`<link async rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">`));

        //ADD FONTS
        this.$head.append($(`<link async href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">`));

        // add the meta description to the head
        this.$head.append($(`<meta name="description" content="${this.settings.description}">`));

        // add the nav button for mobile
        this.$navButton = $("<button id='nav-button'>Navigation<i class='fa-solid fa-bars'></i></button>").prependTo(this.$main);
        this.$navButton.click(() => this.enableNavMobile());
        
        // add the nav
        this.$nav = $(`<nav></nav>`).prependTo(this.$body);
        // add the logo
        this.$nav.append($(`<a class="nav-header" href="/"><img src="/img/ui/banner_small.webp" alt="Love INC of Lewis County"></a>`));
        // add the nav items
        this.$navItems = $(`<ul></ul>`).appendTo(this.$nav);
        if (this.path == "the-front") this.$navItems.append($(`<li><a class="selected" href="/the-front">Home</a></li>`));
        else this.$navItems.append($(`<li><a href="/the-front">Home</a></li>`));
        if (this.path == "getInvolved") this.$navItems.append($(`<li><a class="selected" href="/getInvolved">Get Involved</a></li>`));
        else this.$navItems.append($(`<li><a href="/getInvolved">Get Involved</a></li>`));
        if (this.path == "resources") this.$navItems.append($(`<li><a class="selected" href="/resources">Resources</a></li>`));
        else this.$navItems.append($(`<li><a href="/resources">Resources</a></li>`));
        if (this.path == "contact") this.$navItems.append($(`<li><a class="selected" href="/contact">Contact Us</a></li>`));
        else this.$navItems.append($(`<li><a href="/contact">Contact Us</a></li>`));
        if (this.path == "about") this.$navItems.append($(`<li><a class="selected" href="/about">About Us</a></li>`));
        else this.$navItems.append($(`<li><a href="/about">About Us</a></li>`));
        this.$navItems.append($(`<li><a class="external" id="donate" href="https://loveinclewiscounty.maxgiving.com/">Donate</a></li>`));
        // add the close button for mobile
        this.$closeNav = $(`<button id="close-nav"><i class="fa-solid fa-xmark"></i></button>`).appendTo(this.$nav);
        this.$closeNav.click(() => this.disableNavMobile());

        // add the Love INC National reference bar
        this.$national = $(`<div class="national"></div>`).prependTo(this.$body);
        // add the Love INC National logo container
        this.$nationalLogoItems = $(`<div class="logo-items"></div>`).appendTo(this.$national);
        // add the Love INC logo
        this.$nationalLogoItems.append($(`<img src="/img/logo-icon-transparent-mono-mini.png" alt="Love INC Logo">`));
        // add the Love INC National link
        this.$nationalLogoItems.append($(`<p>AN AFFILIATE OF <a href="https://loveinc.org" target="_blank">LOVE IN THE NAME OF CHRIST NATIONAL</a></p>`));
        // add the START A LOVE INC NEAR YOU link
        this.$national.append($(`<a id="start" href="https://loveinc.org/start-a-love-inc" target="_blank">START A LOVE INC NEAR YOU</a>`));

        // add the footer
        this.$footer = $(`<div class="footer"></div>`).appendTo("body");
        // add the footer items
        this.$footer.append($("<h6>loveincoflewiscounty.org</h6>"));
        this.$footer.append($("<p>Love INC of Lewis County</p>"));
        this.$footer.append($("<p>PO Box 152</p>"));
        this.$footer.append($("<p>Chehalis, WA 98532</p>"));
        this.$footer.append($("<p>(360) 748-8611</p>")); 
        this.$footer.append($(`<a href="/tac" target="_blank">Terms and Conditions</a>`));  
        this.$footer.append($(`<a href="/privacy" target="_blank">Privacy Policy</a>`));

        if (this.settings.enableExperimental) {
            // add the mailing list sign up
            this.$mailingList = $(`<section class="mailing-list"></section>`);
            this.$signupForm = $(`<div class="sign-up"></div>`).appendTo(this.$mailingList);
            this.$signupForm.append($(`<h3>Sign up for our Newsletter</h3>`));
            this.$signupForm.append($(`<p>Stay up to date with the latest from Love INC of Lewis County.</p>`));
            this.$signupForm.append($(`<p>Fields marked with * are required to be filled.</p>`));
            this.$nameLabel = $(`<label for="mailing-name">*Name:</label>`).appendTo(this.$signupForm);
            this.$mailingName = $(`<input type="text" id="mailing-name" placeholder="Your Name">`).appendTo(this.$nameLabel);
            this.$streetLabel = $(`<label for="mailing-street">Street:</label>`).appendTo(this.$signupForm);
            this.$mailingStreet = $(`<input type="text" id="mailing-street" placeholder="123 Avenue St">`).appendTo(this.$streetLabel);
            this.$cityLabel = $(`<label for="mailing-city">City:</label>`).appendTo(this.$signupForm);
            this.$mailingCity = $(`<input type="text" id="mailing-city" placeholder="Town City">`).appendTo(this.$cityLabel);
            this.$stateLabel = $(`<label for="mailing-state">State:</label>`).appendTo(this.$signupForm);
            this.$mailingState = $(`<input type="text" id="mailing-state" placeholder="WA">`).appendTo(this.$stateLabel);
            this.$zipLabel = $(`<label for="mailing-zip">Zip:</label>`).appendTo(this.$signupForm);
            this.$mailingZip = $(`<input type="text" id="mailing-zip" placeholder="98765">`).appendTo(this.$zipLabel);
            this.$emailLabel = $(`<label for="mailing-email">*Email:</label>`).appendTo(this.$signupForm);
            this.$mailingEmail = $(`<input type="email" id="mailing-email" placeholder="your@email.com">`).appendTo(this.$emailLabel);
            this.$mailingAlert = $(`<p class="invisible alert">Please fill out required fields.</p>`).appendTo(this.$signupForm);
            this.$signupButton = $(`<button class="external">Sign Up</button>`).appendTo(this.$signupForm);
            this.$signupButton.click(() => this.signUpForMailingList());
            if (this.settings.signUpAfterHero) this.$mailingList.insertAfter($(".hero"));
            else this.$mailingList.insertBefore(this.$footer);
        }
    }

    enableNavMobile() {
        this.$nav.addClass("mobile-full");
        this.$main.addClass("nav-open");
    }

    disableNavMobile() {
        this.$nav.removeClass("mobile-full");
        this.$main.removeClass("nav-open");
    }

    signUpForMailingList() {
        if (this.lastSignUp + this.signUpCooldown < Date.now()) {
            let name = this.$mailingName.val();
            let street = this.$mailingStreet.val();
            let city = this.$mailingCity.val();
            let state = this.$mailingState.val();
            let zip = this.$mailingZip.val();
            let email = this.$mailingEmail.val();
            if (name == "" || email == "") {
                this.$mailingAlert.removeClass("invisible");
                return;
            }

            base.do("add-to-mailing-list", {
                name: name,
                street: street,
                city: city,
                state: state,
                zip: zip,
                email: email,
                route: "/the-front"
            }).then((res) => {
                this.$mailingAlert.removeClass("invisible");
                if (res.status == "success") {
                    this.$mailingAlert.text(`Thank you for signing up!`);
                } else {
                    this.$mailingAlert.text(`There was an error signing up. Please try again later.`);
                }
            });
            
            this.lastSignUp = Date.now();
        }
        else {
            this.$mailingAlert.removeClass("invisible");
            this.$mailingAlert.text(`Please wait before submitting another form.`);
        }
    }
}