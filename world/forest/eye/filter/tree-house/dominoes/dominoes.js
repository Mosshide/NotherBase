// bones are 0-6
class Bone extends Button {
    constructor(values = [1, 1], which = 0) {
        super(`bone-${which}`, null, {
            defaultClasses: "bone",
            placeholder: `${values[0]} | ${values[1]}`,
        });
        this.location = "yard";
        this.positon = [0, 0];
        this.rotation = 0;
        this.faceUp = false;
        this.values = values;
    }

    flipUp() {
        this.$div.text(`${this.values[0]} | ${this.values[1]}`);
    }

    unSelect() {
        this.$div.removeClass("selected");
    }

    select() {
        this.$div.addClass("selected");
        this.player.selectBone(this);
    }

    unHighlight() {
        this.$div.removeClass("highlighted");
    }

    highlight() {
        this.$div.addClass("highlighted");
    }

    hold() {
        this.$div.addClass("held");
    }

    unHold() {
        this.$div.removeClass("held");
    }

    moveTo(position, rotation) {
        this.positon = position;
        this.rotation = rotation;

        this.$div.css("position", "absolute");
        this.$div.css("top", 100 + (position[0] * this.height));
        this.$div.css("left", 100 + (position[0] * this.width));
        //this.$div.css("transform", `rotation(${rotation}deg)`);
    }

    click = (e) => {
        console.log(`clicked ${e.data.bone.values}`);
        if (this.waiting && this.turn === 1 && e.data.bone.location === "hand") {
            if (e.data.bone == this.players[1].heldBone) {
                this.board.takeBackPlacement()
                this.players[1].unChooseBone(e.data.bone);
            }
            // else if (this.players[1].heldBone !== null) {
            //     this.board.finishPlacement(this.players[1].playBone(), e.data.bone);
            //     this.players[1].addPoints(this.board.grabPoints());
            // }
            // else this.board.beginPlacement(this.players[1].chooseBone(e.data.bone));
        }
    }
}

// a yard class
class Yard extends Element {
    constructor() {
        super("div", {
            defaultClasses: "yard"
        });

        this.reset();
    }

    reset() {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                this.addChild(new Bone([i, j]));
            }
        }
    }

    getBone() {
        if (this.children.length > 0) {
            let chosen = Math.floor(Math.random() * this.children.length);

            this.children[chosen].flipUp();
            this.children[chosen].$div.removeClass("in-yard");

            return this.removeChild(this.children[chosen]);
        }
        else return null;
    }
}

class Board extends Element {
    constructor(dominoGame) {
        super("div", {
            defaultClasses: "board"
        });
        
        this.bonesOnBoard = [];
        this.ends = [];
        this.width = 600;
        this.height = 600;        
    }

    place(choice, bigBone = false) {
        console.log(`Placing ${choice.bone.values} at ${choice.target.values} ${choice.pole}`);

        if (!bigBone) {
            if (choice.target === "auto") {
                for (let i = 0; i < this.ends.length; i++) {
                    if (choice.bone.fits(this.ends[i])) {
                        this.bonesOnBoard.push(choice.bone);
                        this.$board.append(choice.bone.$div);
                        this.ends[i].attach(choice.bone);
                        this.ends.splice(i, 1, choice.bone);

                        return true;
                    }
                }

                return false;
            }
            else {
                if (choice.bone.fits(choice.target)) {
                    this.bonesOnBoard.push(choice.bone);
                    this.$board.append(choice.bone.$div);
                    choice.target.attach(choice.bone);
                    
                    for (let i = 0; i < this.ends.length; i++) {
                        if (choice.target == this.ends[i]) this.ends.splice(i, 1, choice.bone);
                    }

                    return true;
                }
            }
        }
        else {
            this.bonesOnBoard.push(choice.bone);
            this.$board.append(choice.bone.$div);
            choice.bone.moveTo([0, 0]);
            this.ends.push(choice.bone);

            return true;
        }

        return false;
    }

    beginPlacement(bone) {
        if (bone !== null) {
            console.log(`attempting to place ${bone.values}`);
            this.updateOptions(bone);
        }
    }
}

// a hand class
class Hand extends Element {
    constructor(game, name) {
        super("div", {
            defaultClasses: "hand",
            id: name
        });

        this.game = game;
        this.heldBone = null;
        this.state = "out-of-game";
    }

    draw(bone) {
        bone.location = "hand";
        this.addChild(bone);
        return bone.values;
    }

    chooseBone(bone) {
        console.log(`Grabbing ${bone.values} from player hand`);

        for (let i = 0; i < this.options.length; i++) {
            if (this.hand[this.options[i]] == bone) {
                bone.hold();
                this.heldBone = bone;
                this.updateOptionsVisuals(this.options[i]);
                return bone;
            }
        }

        return null;
    }
    
    unChooseBone(bone) {
        bone.unHold();
        this.heldBone = null;
        this.updateOptionsVisuals();
    }
}

class DominoGame extends Container {
    constructor() {
        super({
            defaultClasses: "table"
        });
        this.players = null;

        this.yard = this.addChild(new Yard());
        this.hands = [this.addChild(new Hand(this, "player-1")), this.addChild(new Hand(this, "player-2"))];
        this.board = this.addChild(new Board(this));
        this.resetButton = this.addChild(new Button("reset", this.reset, { placeholder: "Reset" }));
        this.joinButton = this.addChild(new Button("join", this.joinGame, { placeholder: "Join" }));
        this.leaveButton = this.addChild(new Button("leave", this.leaveGame, { placeholder: "Leave" }));
    }

    startRound() {
        // reset the board and hands
        this.removeChild(this.board);
        this.board = this.addChild(new Board(this));
        
        // draw 7 bones for each player
        let max = -1;
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < this.players.length; j++) {
                let bone = this.board.yard.getBone();
                let check = this.players[j].hand.draw(bone);
            }
        }
    }

    update() {
        console.log("Updating game");
    }

    reset() {
        console.log("Resetting game");
    }

    joinGame() {
        console.log("Joining game");
    }

    leaveGame() {
        console.log("Leaving game");
    }
}

const dominoGame = new DominoGame();
dominoGame.render(".table");