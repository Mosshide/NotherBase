class Fish extends Element {
    constructor(pond, id) {
        super("div", {
            defaultClasses: "fish",
            id: id
        });
        this.pond = pond;
        this.tail = null;
        this.color = null;
        this.darkColor = null;
        this.position = null;
        this.direction = Math.random() * 360;
        this.mass = .1 + Math.random() * .15;
        this.ySize = .3 + Math.random() * this.mass;
        this.xSize = .3 + Math.random() * this.mass;
        this.slow = 3;
        this.fast = 20;
        this.speed = this.slow;
        this.jumping = false;
        this.beat = 2000 + Math.random() * 1000;
        this.timeout = null;
    }

    update = () => {
        this.tail.$div.removeClass("wag");
        let newPosition = [];

        if (this.jumping) {
            this.direction = 90;
            newPosition = [this.position[0], 75];
            this.jumping = false;
            this.pond.catchFish(this);
            this.close();
        }
        else {
            this.direction = this.direction + (-5 + Math.random() * 10);
            if (this.direction > 360) this.direction -= 360;
            if (this.direction < 0) this.direction += 360;
    
            let rads = this.direction * Math.PI / 180;
            newPosition = [this.position[0] + (Math.cos(rads) * this.speed), this.position[1] - (Math.sin(rads) * this.speed)];
    
            if (newPosition[1] > 90 && this.speed === this.fast) {
                this.direction = 270;
                newPosition = [this.position[0], 115];
                this.jumping = true;
            }
            else if (Math.sqrt(Math.pow(newPosition[0] - 50, 2) + Math.pow(newPosition[1] - 50, 2)) > 45){
                this.direction += 180;
                if (this.direction > 360) this.direction -= 360;
        
                rads = this.direction * Math.PI / 180;
                newPosition = [this.position[0] + (Math.cos(rads) * this.speed), this.position[1] - (Math.sin(rads) * this.speed)];
            }
        }

        this.position = newPosition;

        
        this.updateStyle();
        this.timeout = setTimeout(this.update, this.beat);
        if (this.speed === this.fast) this.speed = this.slow;
    }

    updateStyle = () => {
        this.$div.animate({
            left: `${this.position[0]}%`,
            bottom: `${this.position[1]}%`
        }, {
            duration: this.beat, 
            easing: "linear",
            queue: false
        });

        
        this.tail.$div.addClass("wag");

        if (this.direction > 270 || this.direction < 90) this.css("transform", `rotate(${this.direction}deg) scaleX(${this.xSize}) scaleY(${this.ySize})`);
        else this.css("transform", `rotate(${this.direction - 180}deg) scaleX(${-this.xSize}) scaleY(${this.ySize})`);
    }

    render = () => {
        super.render();

        this.tail = this.addChild(new Element("div", { defaultClasses: "tail" }));
        this.color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.css("background-color", `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`);
        this.darkColor = [this.color[0] / 2, this.color[2], this.color[1]];
        this.tail.css("background-color", `rgb(${this.darkColor[0]}, ${this.darkColor[1]}, ${this.darkColor[2]})`);
        this.position = [1 + Math.floor(Math.random() * 90), 60 - Math.floor(Math.random() * 55)];
        this.css("left", `${this.position[0]}%`);
        this.css("bottom", `${this.position[1]}%`);

        this.$div.animate({
            opacity: 1
        }, 5000 - Math.random() * 3000);

        this.$div.hover(() => {
            this.speed = this.fast;
            if (!this.jumping) {
                clearTimeout(this.timeout);
                this.update();
            }
        });

        this.update();

        return this.$div;
    }
}

class Weed extends Element {
    constructor(id) {
        super("div", {
            defaultClasses: "weed",
            id: id
        });
    }

    render = () => {
        super.render();
        this.css("left", `${5 + Math.random() * 90}%`);
        this.css("height", `${25 + Math.random() * 65}%`);

        return this.$div;
    }
}

class Boat extends Element {
    constructor() {
        super("div", {
            defaultClasses: "boat"
        });
    }
}

class Pond extends Container {
    constructor() {
        super({
            defaultClasses: "water"
        });
        this.maxFish = 50;
        this.maxWeeds = 5;
        this.mouse = [];
        this.fishCaught = 0;

        this.spawnFish();
        this.spawnWeeds();

        this.addChild(new Boat());
        this.addChild(new Element("div", { defaultClasses: "waters" }));
    }

    spawnFish() {
        for (let i = 0; i < this.maxFish; i++) {
            let fish = new Fish(this, i + 1);
            this.addChild(fish);
        }
    }

    spawnWeeds() {
        for (let i = 0; i < this.maxWeeds; i++) {
            let weed = new Weed(i + 1);
            this.addChild(weed);
        }
    }

    catchFish = (which) => {
        this.fishCaught++;
        ui.fishCaught.setValue(`Fish Caught: ${this.fishCaught}`);
    }
}

class UI extends Container {
    constructor() {
        super({
            defaultClasses: "ui"
        });

        this.fishCaught = this.addChild(new Text("h4", {
            defaultClasses: "fishCaught",
            placeholder: "Fish Caught: 0"
        }));
    }
}

let pond = new Pond();
pond.render(".water");

let ui = new UI();
ui.render(".ui");