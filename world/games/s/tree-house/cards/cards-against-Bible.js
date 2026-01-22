// a cards against humanity clone
// extends from the Conainer, Element, and Text classes

class CardsAgainstBible extends Container {
    constructor() {
        super({ defaultClasses: "table", header: "Cards Against Bible" });
        this.state = "waiting"; // waiting, picking, judging, or done
        this.players = [];
        this.judge = -1;
        this.username = '<%= query.test ? "test" : user.username %>';

        hiddenChat.socket.on('chat message', (data) => { this.checkUpdate(data); });
        hiddenChat.socket.on('connect', () => { this.checkUpdate({ text: "updated" }); });
    }

    // sets up the game
    setup() {
        this.state = "waiting";
        this.players = [];
        this.judge = -1;

        this.playersText = this.addChild(new Text("p", { placeholder: "Players: " }));
        
        this.buttons = this.addChild(new Buttons());
        this.join = this.buttons.addChild(new Text("button", { defaultClasses: "join", placeholder: "Join" }));
        this.join.enable(() => {
            this.clickSpot();
        });
        this.startGame = this.buttons.addButton(new Text("button", { defaultClasses: "start", placeholder: "Start Game" }));
        this.startGame.enable(() => {
            this.start();
        });
        this.skipRound = this.buttons.addButton(new Text("button", { defaultClasses: "skip", placeholder: "Skip Round" }));
        this.skipRound.enable(() => {
            this.skip();
        });
        this.skipRound.hide();

        this.alert = this.addChild(new Text("h3", { placeholder: "Click an Open Spot to Join" }));

        this.cards = this.addChild(new Element("div", { defaultClasses: "cards" }));
    }

    // adds a player to the game
    clickSpot() {
        if (this.state === "waiting") {
           
            base.do("toggle-join", {}).then((res) => {
                hiddenChat.sendMessage("updated");
            });
        }
    }

    // checks if the last chat message was "updated"
    checkUpdate(message) {
        if (message.text === "updated") {
            base.do("get-updates", {}).then((res) => {
                console.log(res.data.prompt.text);
                this.update(res.data);
            });
        }
    }

    // updates the game
    update(data) {
        this.state = data.state;
        this.players = data.players;
        this.judge = data.judge;

        if (this.state === "waiting") {
            this.join.show();
            this.skipRound.hide();
            let outText = "Players: ";
            for (let i = 0; i < this.players.length; i++) {
                outText += `${this.players[i]} - ${data.score[this.players[i]] || 0}`;
                if (i < this.players.length - 1) outText += ", ";
            }
            outText += ` - ${12 - this.players.length} spots left`;
            this.playersText.setValue(outText);
            this.cards.closeChildren();
            // add last prompt and last winner and winning card
            if (data.winner && data.prompt) {
                this.cards.addChild(new Text("p", { placeholder: `Last Prompt: ${data.prompt}` }));
                this.cards.addChild(new Text("p", { placeholder: `Last Winner: ${data.winner} with ${data.hand[data.winner][data.chosen[data.winner]]}` }));
            }
            this.alert.setValue("Click an Open Spot to Join");

            if (this.players.includes("<%= user.memory.data.username %>")) {
                this.join.setValue("Leave");
                this.join.$div.addClass("player");
            }
            else {
                this.join.setValue("Join");
                this.join.$div.removeClass("player");
            }

            if (this.players.length >= 3) {
                this.startGame.show();
            }
            else {
                this.startGame.hide();
            }
        }
        else if (this.state === "playing") {
            this.startGame.hide();
            this.join.hide();
            if (data.expiration < Date.now()) this.skipRound.show();
            else this.skipRound.hide();

            this.playersText.setValue(`Players: ${this.players.join(", ")}`);

            this.cards.closeChildren();
            this.prompt = this.cards.addChild(new Text("p", { placeholder: `Prompt: ${data.prompt}` }));
            if (this.players[this.judge] !== this.username) {
                if (data.hand[this.username]?.length) {
                    this.alert.setValue("You are the choosing an answer!");
                    // add answer cards
                    for (let i = 0; i < data.hand[this.username].length; i++) {
                        let card = this.cards.addChild(new Text("button", { 
                            placeholder: data.hand[this.username][i],
                            defaultClasses: `card ${data.chosen[this.username] === i ? "chosen" : ""}`
                        }));
                        card.enable(() => {
                            base.do("play-card", { card: i }).then((res) => {
                                hiddenChat.sendMessage("updated");
                            });
                        });
                    }
                }
                else {
                    this.alert.setValue("Waiting for the next round to start");
                }
            }
            else {
                this.alert.setValue("You are the waiting Judge!");
            }
        }
        else if (this.state === "judging") {
            this.startGame.hide();
            this.join.hide();
            if (data.expiration < Date.now()) this.skipRound.show();
            else this.skipRound.hide();

            this.playersText.setValue(`Players: ${this.players.join(", ")}`);

            this.cards.closeChildren();
            this.prompt = this.cards.addChild(new Text("p", { placeholder: `Prompt: ${data.prompt}` }));
            if (this.players[this.judge] === this.username) {
                this.alert.setValue("Choose the best answer");
                // add answer cards
                let keys = Object.keys(data.chosen);
                for (let i = 0; i < keys.length; i++) {
                    let card = this.cards.addChild(new Text("button", { placeholder: data.hand[keys[i]][data.chosen[keys[i]]] }));
                    //give the card a random order
                    card.$div.css("order", 2 + Math.floor(Math.random() * keys.length * 10));
                    card.enable(() => {
                        base.do("judge-card", { winner: keys[i] }).then((res) => {
                            hiddenChat.sendMessage("updated");
                        });
                    });
                }
            }
            else {
                this.alert.setValue("Waiting for Judge");
                if (data.hand[this.username]?.length) this.cards.addChild(new Text("p", { placeholder: `Your Answer: ${data.hand[this.username][data.chosen[this.username]]}` }));
            }
        }
    }

    // starts the game
    start() {
        if (this.players.length >= 3) {
            this.startGame.hide();

            base.do("start-game", {}).then((res) => {
                hiddenChat.sendMessage("updated");
            });
        }
        else {
            this.alert.setValue("Need at least 3 players to start");
        }
    }

    //skip round
    skip() {
        base.do("skip-round", {}).then((res) => {
            hiddenChat.sendMessage("updated");
        });
    }
}

const cardsAgainstBible = new CardsAgainstBible();
cardsAgainstBible.render(".table");
cardsAgainstBible.setup();
cardsAgainstBible.checkUpdate({ text: "updated" });