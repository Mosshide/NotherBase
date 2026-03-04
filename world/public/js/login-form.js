
class LoginForm extends Container {
    constructor(settings = {}) {
        super({
            defaultClasses: "meta login-form",
            ...settings
        });

        this.addChild(new Text("h3", { text: "Login to Your Account" }));

        this.usernameInput = this.addChild(new Input("text", {
            header: "Your Username:",
            placeholder: "Username",
            onKeyup: async (e) => {
                if (e.which === 13 || e.key === "Enter") {
                    this.loginButton.settings.onClick();
                }
            }
        }));

        this.passwordInput = this.addChild(new Input("password", {
            header: "Your Password:",
            placeholder: "password",
            onKeyup: async (e) => {
                if (e.which === 13 || e.key === "Enter") {
                    this.loginButton.settings.onClick();
                }
            }
        }));

        this.loginButton = this.addChild(new Button("login", async () => {
                let username = this.usernameInput.getValue();
                let password = this.passwordInput.getValue();
                this.usernameInput.setValue("");
                this.passwordInput.setValue("");
                this.loginButton.disable();
                this.infoText.setValue("Attempting to login...");
                let response = await base.attemptLogin(username, password);
                this.infoText.setValue(response.message);
                if (response.status === "success") location.reload();
                else this.loginButton.enable();
            },{
                placeholder: "Login",
                defaultClasses: "login-button"
            }
        ));

        this.infoText = this.addChild(new Text("p", { defaultClasses: "info-text" }) );
    }
}