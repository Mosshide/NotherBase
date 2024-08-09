// bones are 0-6
class Bone extends Element {
    constructor(values) {
        super("div", {
            defaultClasses: "bone"
        });
        this.location = "yard";
        this.positon = [0, 0];
        this.rotation = 0;
        this.faceUp = false;
        this.touching = [ null, null, null, null ];
        this.values = values;
        $(".bone-yard").append(`<div class="bone in-yard" id="${values[0]}-${values[1]}"></div>`);
        this.$div = $(".bone-yard").children().last();
        this.width = parseInt(this.$div.css("width"), 10);
        this.height = parseInt(this.$div.css("height"), 10);

        this.enable(this.click);
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

    unOption() {
        this.$div.removeClass("option");
    }

    option() {
        this.$div.addClass("option");
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

    fits(bone) {
        let compatible = false;

        for (let i = 0; i < this.values.length; i++) {
            for (let j = 0; j < bone.values.length; j++) {
                if (this.values[i] === bone.values[j] && 
                !bone.touching[2 * i + j] &&
                !this.touching[2 * i + j] ) {
                    compatible = true;
                }
            }
        }

        return compatible;
    }

    attach(bone) {
        let offset = [0, 0];
        
        //east
        if (this.touching[0] == null) {
            offset = [-1, 0];
            this.touching[0] = bone;
        }
        //west
        else if (this.touching[1] == null) {
            offset = [1, 0];
            this.touching[1] = bone;
        }
        //north
        else if (this.touching[2] == null) {
            offset = [0, 1];
            this.touching[2] = bone;
        }
        //south
        else if (this.touching[3] == null) {
            offset = [0, -1];
            this.touching[3] = bone;
        }

        let position = [this.positon[0] + offset[0], this.positon[1] + offset[1]];

        bone.moveTo(position, 0);
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
        this.yard = this.addChild(new Yard());
        
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

        this.hands = [this.addChild(new Hand(this, "player-1")), this.addChild(new Hand(this, "player-2"))];
        this.board = this.addChild(new Board(this));
    }

    startRound() {
        console.log("Starting Round");

        this.turn = -1;
        while (this.turn === -1) {
            // reset the board and hands
            this.removeChild(this.board);
            this.board = this.addChild(new Board(this));
            
            // draw 7 bones for each player
            let max = -1;
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < this.players.length; j++) {
                    let bone = this.board.yard.getBone();
                    let check = this.players[j].hand.draw(bone);

                    // check for biggest double
                    if (check[0] === check[1]) {
                        if (check[0] > max) {
                            max = check[0];
                            this.turn = j;
                        }
                    }
                }
            }

            if (this.turn === -1) console.log("No doubles found in players' hands. Restarting");
            else console.log(`Player ${this.turn} has biggest double: [${max}, ${max}]`);
        }

        this.startTurn(true);
    }
}

const dominoGame = new DominoGame();
dominoGame.render(".table");