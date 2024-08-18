class Entity {
    /**
     * Represents an entity.
     * @constructor
     * @param {string} name - The name of the entity.
     * @param {string} kind - The kind of the entity.
     * @param {HTMLElement} $parent - The parent element of the entity.
     */
    constructor(name, kind, $parent) {
        this.$div = null;
        this.$parent = $parent;
        this.children = [];
        this.named = {};
        this.name = name;
        this.kind = kind;
        this.spawnCooldown = 0;
        this.invertYAxis = false;

        this.position = [0, 0];
        this.angle = 0;
        this.animation = "linear";
        this.size = [0, 0];

        this.render();
    }

    /**
     * Flips the Y axis of the entity.
     */
    flipYAxis = () => {
        this.invertYAxis = !this.invertYAxis;
    }

    /**
     * Sets the CSS property of the entity's div element.
     * 
     * @param {string} prop - The CSS property to set.
     * @param {string} val - The value to set for the CSS property.
     */
    css(prop, val) {
        if (this.$div) this.$div.css(prop, val);
    }

    /**
     * Moves the entity to the specified coordinates.
     * @param {number} x - The x-coordinate to move to.
     * @param {number} y - The y-coordinate to move to.
     * @param {string} [measure="%"] - The unit of measurement for the x-coordinate. Defaults to "%".
     * @param {string} [measure2=null] - The unit of measurement for the y-coordinate. Defaults to the same unit as measure.
     */
    moveTo(x, y, measure = "%", measure2 = null) {
        this.position = [x, y];
        this.css("left", `${x}` + measure);
        if (!this.invertYAxis) this.css("bottom", `${y}` + (measure2 ? measure2 : measure));
        else this.css("top", `${y}` + (measure2 ? measure2 : measure));
    }

    /**
     * Sets the size of the entity.
     * @param {number} w - The width of the entity.
     * @param {number} h - The height of the entity.
     * @param {string} [measure="px"] - The unit of measurement for the width and height.
     * @param {string} [measure2=null] - The unit of measurement for the height, if different from the width.
     */
    setSize(w, h, measure = "px", measure2 = null) {
        this.size = [w, h];
        this.css("width", `${w}` + measure);
        this.css("height", `${h}` + (measure2 ? measure2 : measure));
    }

    /**
     * Rotates the entity to the specified angle.
     * @param {number} angle - The angle to rotate the entity to, in degrees.
     */
    rotateTo(angle) {
        this.angle = angle;
        this.css("transform", `rotate(${angle}deg)`);
    }

    /**
     * Adds a child entity to the current entity.
     * 
     * @param {Object} child - The child entity to be added.
     * @param {number} [requireCooldown=0] - The cooldown required before adding the child entity.
     */
    addChild = (child, requireCooldown = 0) => {
        if (requireCooldown <= 0 || requireCooldown < this.spawnCooldown) {
            this.spawnCooldown = 0;
            this.children.push(child);
            this.$div.append(child.$div);
            if (!Array.isArray(this.named[child.name])) this.named[child.name] = [];
            this.named[child.name].push(child);
        }
    }

    /**
     * Sets the image of the entity.
     * 
     * @param {string} imgPath - The path to the image.
     */
    setImage(imgPath) {
        this.css("background", `url("${imgPath}")`);
    }

    /**
     * Updates the entity.
     * @param {number} interval - The time interval for the update.
     * @param {any} [context=null] - The context for the update.
     */
    update = (interval, context = null) => {
        this.spawnCooldown += interval;
        this.onUpdate(interval, context);

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].update(interval);
        }
    }

    /**
     * This function is called on every update.
     * @param {number} interval - The time interval in milliseconds.
     * @returns {null} - Returns null.
     */
    onUpdate = (interval) => {
        return null;
    }

    /**
     * Renders the entity by creating a div element with the specified class names and appending it to the parent element.
     * Also renders any child entities recursively.
     */
    render = () => {
        this.$div = $(`<div class="${this.kind} entity ${this.name}"></div>`);
        this.css("position", "absolute");
        this.css("transform-origin", "bottom");

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].render();
            this.$div.append(this.children[i].$div);
        }
    }
}

class Ground {
    /**
     * Represents an Entity object.
     * @constructor
     * @param {jQuery} $div - The jQuery object representing the entity's HTML element.
     * @param {number} [updateInterval=250] - The interval in milliseconds at which the entity updates.
     * @param {Object} [settings] - Additional settings for the entity.
     * @param {boolean} [settings.invertYAxis=false] - Whether to invert the Y-axis of the entity's movement.
     */
    constructor($div, updateInterval = 250, settings) {
        this.$div = $div;
        this.entities = [];
        this.updateInterval = updateInterval;
        this.spawnCooldown = 0;
        this.named = {};
        this.settings = {
            invertYAxis: false,
            ...settings
        }

        this.interval = setInterval(this.update, this.updateInterval);
    }

    /**
     * Spawns an entity into the game world.
     * 
     * @param {Entity} entity - The entity to spawn.
     * @param {number} [requireCooldown=0] - The cooldown required before spawning (in milliseconds).
     * @param {number} [maxPopulation=0] - The maximum population limit for the entity. Set to 0 for unlimited.
     */
    spawn(entity, requireCooldown = 0, maxPopulation = 0) {
        if (this.settings.invertYAxis) entity.flipYAxis();

        if (!Array.isArray(this.named[entity.name])) this.named[entity.name] = [];

        if ((this.named[entity.name].length < maxPopulation || maxPopulation < 1) && 
        (requireCooldown <= 0 || requireCooldown < this.spawnCooldown)) {
            this.spawnCooldown = 0;
            this.entities.push(entity);
            this.$div.append(entity.$div);
            if (!Array.isArray(this.named[entity.name])) this.named[entity.name] = [];
            this.named[entity.name].push(entity);
        }
    }

    /**
     * Despawns an entity.
     * 
     * @param {} which - The entity to despawn.
     */
    despawn(which) {
        //despawn entity
    }

    /**
     * Removes all entities from the container and empties the div element.
     */
    despawnAll = () => {
        this.$div.empty();
        this.entities = [];
    }

    /**
     * Updates the entity and its child entities.
     */
    update = () => {
        this.spawnCooldown += this.updateInterval;
        let context = this.onUpdate();

        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(this.updateInterval, context);            
        }
    }

    /**
     * Updates the entity.
     * @param {number} [interval=this.updateInterval] - The time interval for the update.
     * @returns {null} Returns null.
     */
    onUpdate = (interval = this.updateInterval) => {
        return null;
    }
}