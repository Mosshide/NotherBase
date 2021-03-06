class Bone {
    constructor(values, onClick) {
        this.positon = [0, 0];
        this.rotation = 0;
        this.faceUp = false;
        this.touching = [ null, null, null, null ];
        this.values = values;
        this.player = null;
        $(".bone-yard").append(`<div class="bone in-yard" id="${values[0]}-${values[1]}"></div>`);
        this.$div = $(".bone-yard").children().last();
        this.width = parseInt(this.$div.css("width"), 10);
        this.height = parseInt(this.$div.css("height"), 10);

        this.$div.on("click", {bone: this}, onClick);
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
}

class Board {
    constructor(onBoneClick, onBoardClick) {
        $(".bone-yard").empty();
        this.boneyard = [];
        this.bonesOnBoard = [];
        this.ends = [];
        this.$board = $(".board");
        this.$board.empty();
        this.$board.on("click", onBoardClick);
        this.width = parseInt(this.$board.css("height"), 10);
        this.height = parseInt(this.$board.css("width"), 10);

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                this.boneyard.push(new Bone([i, j], onBoneClick));
            }
        }
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

    getBoneFromYard() {
        if (this.boneyard.length > 0) {
            let chosen = Math.floor(Math.random() * this.boneyard.length);

            this.boneyard[chosen].flipUp();
            this.boneyard[chosen].$div.removeClass("in-yard");

            return this.boneyard.splice(chosen, 1)[0];
        }
        else return null;
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
}

class Player {
    constructor(name, $handDiv, $scoreDiv) {
        this.hand = [];
        this.board = null;
        this.choice = {
            bone: null,
            target: null,
            pole: -1
        };
        this.score = 0;
        this.options = [];
        this.name = name;
        this.$handDiv = $handDiv;
        this.$scoreDiv = $scoreDiv;
        this.heldBone = null;
        this.$handDiv.empty();
    }

    draw(bone) {
        console.log(`${this.name} drawing`);
        
        bone.player = this;
        this.hand.push(bone);
        bone.$div.appendTo(this.$handDiv);

        return bone.values;
    }

    selectBone(bone) {
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i] !== bone) this.hand[i].unselect();
        }

        this.board.updateOptions(bone);
    }

    checkForDraw(bigBone = false) {
        this.options = [];

        if (!bigBone) {
            for (let i = 0; i < this.board.ends.length; i++) {
                for (let j = 0; j < this.hand.length; j++) {
                    if (this.hand[j].fits(this.board.ends[i])) this.options.push(j);
                }
            }

            if (this.options.length <= 0) {
                let bone = this.board.getBoneFromYard();
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

    autoTurn(bigbone = false) {
        let chosen = -1;
        if (bigbone) chosen = this.options[0];
        else chosen = this.options[Math.floor(Math.random() * this.options.length)];

        return {
            bone: this.hand.splice(chosen, 1)[0],
            target: "auto",
            pole: "auto"
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

    displayWinner(player) {
        $(".opponent-hand").text(`${player} won!`);
    }

    clear() {
        this.hand = [];
        this.$handDiv.empty();
        this.$scoreDiv.empty();
    }

    addPoints(points) {
        this.score += points;
        this.$scoreDiv.text(this.score);
    }

    startTurn() {
        this.$handDiv.addClass("turn-to-play");
    }

    endTurn() {
        this.$handDiv.removeClass("turn-to-play");
    }
}

class DominoGame {
    constructor() {
        this.turn = -1;
        this.waiting = false;
        this.board = null;
        this.players = null;
        this.scoreToWin = 100;

        $("#play").on("click", (e) => {
            $("#play").toggleClass("invisible");
            this.startGame();
        });
    }

    startGame() {
        console.log("Starting Game");
        
        this.players = [
            new Player("Server", $(".opponent-hand"), $("#score1")), 
            new Player("You", $(".your-hand"), $("#score2"))
        ];

        this.startRound();
    }

    startRound() {
        console.log("Starting Round");

        this.turn = -1;
        while (this.turn === -1) {
            this.board = new Board(this.clickBone, this.clickBoard);
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].board = this.board;
                this.players[i].clear();
            }

            let max = -1;

            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < this.players.length; j++) {
                    let check = this.players[j].draw(this.board.getBoneFromYard());

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
            this.players[0].startTurn();
            this.players[0].checkForDraw(bigBone);
            this.board.place(this.players[0].autoTurn(), bigBone);
            this.players[0].addPoints(this.board.grabPoints());
            if (this.players[0].checkForDomino()) this.resolveDomino(0);
            this.players[0].endTurn();

            this.turn = 1;
            this.startTurn();
        }
        else if (this.turn === 1) {
            this.players[1].startTurn();
            this.players[1].checkForDraw(bigBone);
            this.players[1].updateOptionsVisuals();
            this.waiting = true;
        }
    }

    endTurn() {
        console.log("Ending Turn");
        
        this.board.place(this.players[1].choice);
        this.players[1].addPoints(this.board.grabPoints());
        if (this.players[1].checkForDomino()) this.resolveDomino(1);

        this.turn = 0;
        startTurn();
    }

    resolveDomino(player) {
        console.log("Resolving Domino");
        
        this.players[player].addPoints(this.board.domino());

        this.checkForWin();

        this.startRound();
    }

    checkForWin() {
        console.log("Checking for Win");
        
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].score >= this.scoreToWin) {
                this.players[0].displayWinner(this.players[i].name);

                $("#play").toggleClass("invisible");
            }
        }
    }

    clickBone = (e) => {
        console.log(`clicked ${e.data.bone.values}`);

        if (this.waiting && this.turn === 1) {
            if (e.data.bone == this.players[1].heldBone) {
                this.board.takeBackPlacement()
                this.players[1].unChooseBone(e.data.bone);
            }
            else if (this.players[1].heldBone !== null) {
                this.board.finishPlacement(this.players[1].playBone(), e.data.bone);
                this.players[1].addPoints(this.board.grabPoints());
            }
            else this.board.beginPlacement(this.players[1].chooseBone(e.data.bone));
        }
    }

    clickBoard = (e) => {
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

const dominoGame = new DominoGame();