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

    takeBackPlacement() {
        this.updateOptions(null);
    }

    finishPlacement(bone, targetBone) {
        this.bonesOnBoard.push(bone);
        this.$board.append(bone.$div);
        
        if (targetBone) {
            targetBone.attach(bone);
            for (let i = 0; i < this.ends.length; i++) {
                if (targetBone == this.ends[i]) this.ends.splice(i, 1, bone);
            }
        }
        else {
            bone.moveTo([0, 0]);
            this.ends.push(bone);
        }

        this.$board.removeClass("big-bone-time");

        return 
    }

    grabPoints() {
        let points = 0;

        for (let i = 0; i < this.ends.length; i++) {
            points += this.ends[i].values[0];
        }

        if (points % 5 === 0) return points;
        else return 0;
    }

    updateOptions(bone) {
        for (let i = 0; i < this.bonesOnBoard.length; i++) {
            this.bonesOnBoard[i].$div.removeClass("highlighted");
        }

        if (bone !== null) {
            if (this.bonesOnBoard.length > 0) {
                for (let i = 0; i < this.ends.length; i++) {
                    if (bone.fits(this.ends[i])) this.ends[i].$div.addClass("highlighted");
                }
            }
            else this.$board.addClass("big-bone-time");
        }
    }

    domino() {
        let total = 0;

        for (let i = 0; i < this.boneyard.length; i++) {
            total += this.boneyard[i].values[0] + this.boneyard[i].values[1];
        }

        this.points = total - (total % 5);

        return this.grabPoints();
    }

    click = (e) => {
        console.log("clicked board");
        if (this.waiting && this.turn === 1) {
            if (this.players[1].heldBone !== null) {
                this.board.finishPlacement(this.players[1].playBone());
                this.players[1].addPoints(this.board.grabPoints());
                this.turn = 0;
                this.startTurn();
            }
        }
    }
}

// a score class
class Score extends Element {
    constructor() {
        super("div", {
            defaultClasses: "score"
        });
        this.amount = 0;
    }

    addPoints(points) {
        this.amount += points;
        this.$div.text(this.amount);
    }

    clear() {
        this.amount = 0;
        this.$div.text(this.amount);
    }
}

// a hand class
class Hand extends Element {
    constructor(player) {
        super("div", {
            defaultClasses: "hand"
        });

        this.player = player;
        this.heldBone = null;
    }

    draw(bone) {
        bone.location = "hand";
        this.addChild(bone);
        return bone.values;
    }

    selectBone(bone) {
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i] !== bone) this.hand[i].unselect();
        }

        this.board.updateOptions(bone);
    }

    checkForDraw(board, bigBone = false) {
        this.options = [];

        if (!bigBone) {
            for (let i = 0; i < this.player.board.ends.length; i++) {
                for (let j = 0; j < this.hand.length; j++) {
                    if (this.hand[j].fits(this.player.board.ends[i])) this.options.push(j);
                }
            }

            if (this.options.length <= 0) {
                let bone = this.player.board.yard.getBone();
                if (bone !== null) {
                    this.draw(bone);
                    this.checkForDraw();
                }
            }
        }
        else {
            let max = -1;
            let chosen = -1;

            for (let j = 0; j < this.hand.length; j++) {
                if (this.hand[j].values[0] === this.hand[j].values[1]) {
                    if (this.hand[j].values[0] > max) {
                        max = this.hand[j].values[0];
                        chosen = j;
                    }
                }
            }

            this.options = [chosen];
        }

        this.updateOptionsVisuals();
    }

    updateOptionsVisuals(only = null) {
        for (let i = 0; i < this.hand.length; i++) {
            this.hand[i].unHighlight();

            if (!only) {
                for (let j = 0; j < this.options.length; j++) {
                    if (this.options[j] === i) this.hand[i].highlight();
                }
            }
            else this.hand[only].highlight();
        }
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

    playBone() {
        for (let i = 0; i < this.options.length; i++) {
            if (this.hand[this.options[i]] == this.heldBone) {
                this.heldBone.unHold();
                this.heldBone.unHighlight();
                this.heldBone = null;
                return this.hand.splice(this.options[i], 1)[0];
            }
        }

        return null;
    }
    
    unChooseBone(bone) {
        bone.unHold();
        this.heldBone = null;
        this.updateOptionsVisuals();
    }

    checkForDomino() {
        if (this.hand.length <= 0) return true;
        else return false;
    }
}

class Player extends Element {
    constructor(dominoGame, name) {
        super("div", {
            defaultClasses: "player"
        });
        this.name = name;
        this.dominoGame = dominoGame;
        this.hand = this.addChild(new Hand(this));
        this.score = this.addChild(new Score());
        this.board = null;
        this.choice = {
            bone: null,
            target: null,
            pole: -1
        };
        this.options = [];
        this.waiting = false;
    }

    startTurn(bigBone = false) {
        this.$div.addClass("turn-to-play");
        this.hand.checkForDraw(this.board, bigBone);
        this.waiting = true;
    }

    endTurn() {
        this.$div.removeClass("turn-to-play");
        this.score.addPoints(this.board.grabPoints());
    }

    displayWinner(player) {
        $(".opponent-hand").text(`${player} won!`);
    }

    displayLoser(player) {
        $(".player-hand").text(`${player} lost!`);
    }
}

class Bot extends Player {
    constructor(name) {
        super();
    }

    autoTurn(bigbone = false) {
        this.$handDiv.addClass("turn-to-play");
        this.checkForDraw(bigBone);
        this.updateOptionsVisuals();

        //
        let chosen = -1;
        if (bigbone) chosen = this.options[0];
        else chosen = this.options[Math.floor(Math.random() * this.options.length)];

        this.choice = {
            bone: this.hand[chosen],
            target: "auto",
            pole: -1
        };

        //
        this.$handDiv.removeClass("turn-to-play");
        this.board.place(this.choice);
        this.addPoints(this.board.grabPoints());
    }
}

class DominoGame extends Container {
    constructor() {
        super({
            defaultClasses: "table"
        });
        this.turn = -1;
        this.board = null;
        this.players = null;
        this.scoreToWin = 100;

        this.buttons = this.addChild(new Buttons({ id: "dominoes-ui" }));
        this.buttons.addButton(new Button("play", (e, self) => { this.startGame(); }, { placeholder: "Play" }));

        this.players = [this.addChild(new Bot(this, "Server")), this.addChild(new Player(this, "You"))];
        this.board = null;
    }

    startGame() {
        console.log("Starting Game");
        this.buttons.hideButton();

        this.startRound();
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

    startTurn(bigBone = false) {
        console.log("Starting Turn");
        
        if (this.turn === 0) {
            this.players[0].autoTurn(bigBone);
            // this.players[0].checkForDraw(bigBone);
            // this.board.place(this.players[0].autoTurn(), bigBone);
            // this.players[0].addPoints(this.board.grabPoints());
            // if (this.players[0].checkForDomino()) this.resolveDomino(0);
            // this.players[0].endTurn();

            this.turn = 1;
            this.startTurn();
        }
        else if (this.turn === 1) {
            this.players[1].startTurn(bigBone);
        }
    }

    endTurn() {
        console.log("Ending Turn");
        if (this.players[this.turn].checkForDomino()) this.resolveDomino();
        this.turn = Math.abs(this.turn - 1);
        startTurn();
    }

    resolveDomino() {
        console.log("Resolving Domino");
        this.players[this.turn].addPoints(this.board.domino(), this.players[Math.abs(this.turn - 1)].domino());
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].clear();
        }
        this.checkForWin();
        this.startRound();
    }

    checkForWin() {
        console.log("Checking for Win");
        if (this.players[this.turn].score >= this.scoreToWin) {
            this.players[this.turn].displayWinner();
            this.players[Math.abs(this.turn - 1)].displayLoser();

            $("#play").removeClass("invisible");
        }
    }
}

const dominoGame = new DominoGame();
dominoGame.render(".table");