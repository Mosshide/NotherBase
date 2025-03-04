class FlowerBed extends Ground {
    constructor(flowerSeed = [], maxFlowers = 10, id = "") {
        super($(`.ground${id ? `#${id}` : ""}`));
        this.maxFlowers = maxFlowers;
        this.flowerSeed = flowerSeed;
    }

    onUpdate = (interval) => {
        let seed = this.flowerSeed[Math.floor(Math.random() * this.flowerSeed.length)];
        this.spawn(new PlantPart("flower", this.$ground, seed), 
                seed.stem.spawnRate.cooldown + Math.random() * seed.stem.spawnRate.potentialDelay,
                this.maxFlowers);
    }
}