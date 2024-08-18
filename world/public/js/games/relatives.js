/**
 * This game class must be extended to YourGame to be
 * useful.
 */
class RelativesGame {
    /**
     * 
     * @param {String} id Used to grab a the containing div.
     * @param {String} onSubmit Optional script to run on the server.
     * @param {Number} beatCD Override update frequency
     */
    constructor (id, onSubmit = null, beatCD = 100) {
        this.$div = $(`.game#${id}`);
        this.onSubmit = onSubmit;
        this.beatCD = beatCD;

        /*
            Call these functions at the end of the constructor
            of classes that extend RelativesGame:
                this.render();
                this.beat();
        */
    }

    /**
     * Creates divs for and fill with each group of parts in the game.
     */
    render = () => {
        this.$inputsBox = $(`<div class="inputs"></div>`).appendTo(this.$div);
        this.$submitBox = $(`<div class="submits"></div>`).appendTo(this.$div);
        this.$outputsBox = $(`<div class="outputs"></div>`).appendTo(this.$div);

        this.$inputs = {};
        this.$submit = null;
        this.$outputs = {};
        this.addInputs();
        this.addSubmit();
        this.addOutputs();
    }

    /**
     * Clears all inputs' values;
     */
    clearInputs = () => {
        let keys = Object.keys(this.$inputs);

        for (let i = 0; i < keys.length; i++) {
            this.$inputs[keys[i]].val("");
        }
    }

    /**
     * Clears all text in outputs.
     */
    clearOutputs = () => {
        let keys = Object.keys(this.$outputs);

        for (let i = 0; i < keys.length; i++) {
            this.$outputs[keys[i]].text("");
        }
    }

    /**
     * Grabs all input values and posibly sends them to the server script,
     * then resolves.
     */
    submit = () => {
        let data = {};

        let keys = Object.keys(this.$inputs);
        for (let i = 0; i < keys.length; i++) {
            data[keys[i]] = this.$inputs[keys[i]].val();
        }

        if (this.onSubmit) {
            base.do(this.onSubmit, data).then((res) => {
                this.resolve(data, res);
            });
        }
        else this.resolve(data);
    }  

    /**
     * Keeps the update function repeating.
     */
    beat = () => {
        setTimeout(() => {
            this.update();
            this.beat();
        }, this.beatCD);
    }

    /**
     * Optional OVERRIDE: Creates and activates a submit button.
     */
    addSubmit = () => {
        this.$submit = $(`<button>Submit</button>`).appendTo(this.$submitBox);
        this.$submit.on("click", () => { this.submit(); });
    }

    /**
     * Optional OVERRIDE: Creates a default text input.
     */
    addInputs = () => {
        this.$inputs = {
            default: $(`<input type="text" id="default">`).appendTo(this.$inputsBox)
        };
    }

    /**
     * Optional OVERRIDE: Creates a default text output.
     */
    addOutputs = () => {
        this.$outputs = {
            default: $(`<p id="default"></p>`).appendTo(this.$outputsBox)
        };
    }

    /**
     * Optional OVERRIDE: This function happens every beat.
     */
    update = () => {

    }

    /**
     * OVERRIDE: This is what happens when the game completes.
     * @param {Object} inputs Collected values from input elements.
     * @param {Object} extResponse Response from server script.
     */
    resolve = (inputs, extResponse) => {

    }
}