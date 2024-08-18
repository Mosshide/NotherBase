class Lawn extends Ground {
    constructor(maxGrass = 50) {
        super($(".ground#lawn"));
        this.maxGrass = maxGrass;

        this.grass = {
            stem: {
                imgs: [ "/img/textures/substance.png" ],
                spawns: [
                    {
                        position: { minX: 0, minY: 0, maxX: 95, maxY: 95 },
                        rotation: { minAngle: -1, maxAngle: 1 }
                    }
                ],
                growth: { minTime: 100, spawnTime: 110, maxTime: 200 },
                size: { minX: 10, minY: 1, maxX: 2, maxY: 2 },
                children: {
                    leaf: {
                        cooldown: 100, 
                        potentialDelay: 100
                    }
                },
                max: 1,
                spawnRate: { cooldown: 100, potentialDelay: 100 },
                recursionMax: 1
            },
            leaf: {
                imgs: [ "/img/textures/substance.png" ],
                spawns: [{
                    position: { minX: 0, minY: 90, maxX: 75, maxY: 99 },
                    rotation: { minAngle: -15, maxAngle: 15 }
                }],
                growth: { minTime: 1000, spawnTime: 110, maxTime: 2000 },
                size: { minX: 10, minY: 30, maxX: 5, maxY: 50 },
                children: {},
                max: 6,
                spawnRate: { cooldown: 100, potentialDelay: 100 },
                recursionMax: 2
            }
        };
    }

    onUpdate = (interval) => {
        let part = new PlantPart("grass", this.$ground, this.grass);
        part.side = 1;
        part.css("transition", `all .20s ease-out`)
        part.$div.on("click", () => {
            part.side = -1 * part.side;
            part.rotateTo(part.angle + part.side * (Math.random() * 10));
        });

        this.spawn(part, this.grass.stem.spawnRate.cooldown + Math.random() * this.grass.stem.spawnRate.potentialDelay, this.maxGrass);
    }
}