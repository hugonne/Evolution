// ReSharper disable PossiblyUnassignedProperty
var pixiUtils = window.PIXI.utils;
var pixiSprite = window.PIXI.Sprite;
var pixiApplication = window.PIXI.Application;
var pixiLoader = window.PIXI.loader;
// ReSharper restore PossiblyUnassignedProperty

var Game = function (worldData) {
    this.worldData = worldData;

    //Set with and height of scene
    this._width = document.body.clientWidth;
    this._height = document.body.clientHeight;
    this._center = {
        x: Math.round(this._width / 2),
        y: Math.round(this._height / 2)
    };

    //Determine the scale to use for all elements
    this._scale = this._width / 1920;
    if (this._scale * 1080 < this._height) {
        this._scale = this._height / 1080;
    }

    this.app = new pixiApplication(this._width, this._height, { backgroundColor: 0x1099bb });
    document.body.appendChild(this.app.view);

    //var build = this.build;
    pixiLoader.add("/img/creatures.json").load(this.build.bind(this));
};

Game.prototype = {
    build: function () {
        //this.app.stage.addChild(this.createRandomCreature("breeder"));

        //Add creatures
        this.worldData.baseSpecies.breeders.forEach(function(species) {
            this.app.stage.addChild(this.createCreature(species, "breeders"));
        }.bind(this));
        this.worldData.baseSpecies.hunters.forEach(function (species) {
            this.app.stage.addChild(this.createCreature(species, "hunters"));
        }.bind(this));

        //Game loop
        this.app.ticker.add(function () {
            this.app.stage.children.forEach(function (creature) {
                //If a child has genes, it's in fact a creature
                if (creature.genes) {
                    //Move the creature
                    this.moveCreature(creature);
                    this.app.stage.children.forEach(function(otherCreature) {
                        if (creature !== otherCreature) {
                            if (collisionDetected(creature, otherCreature)) {
                                //Evolve according to collision
                                this.evolveWorld(creature, otherCreature);
                            }
                        }
                    }.bind(this));
                }
            }.bind(this));
        }.bind(this));
    },
    setupBg: function () {
        //Create the texture
        var bg = pixiSprite.fromImage("/img/background3.png");
        //Position the background in the center
        bg.anchor.set(0.5);
        bg.x = this._center.x;
        bg.y = this._center.y;
        bg.width = Math.round(this._scale * 1920);
        bg.height = Math.round(this._scale * 1080);
        //Mount onto the stage
        this.app.stage.addChild(bg);
    },
    createCreature: function (species, family, x, y) {
        if (family !== "breeders" && family !== "hunters") {
            throw "Invalid family. Must be 'breeders' or 'hunters'";
        }

        var texture = pixiUtils.TextureCache[species];
        var creature = new pixiSprite(texture);

        if (!x) {
            x = randomInt(0, this._width - this.worldData.creatureWidth);
        }
        if (!y) {
            y = randomInt(0, this._height - this.worldData.creatureHeight);
        }
        creature.x = x;
        creature.y = y;

        //Creature genes
        creature.genes = {};
        creature.genes.species = species;
        creature.genes.family = family;
        creature.genes.canChangeDirection = randomBool();
        creature.genes.speedX =
            randomFloat(-this.worldData.families[family].maxSpeed, this.worldData.families[family].maxSpeed);
        creature.genes.speedY =
            randomFloat(-this.worldData.families[family].maxSpeed, this.worldData.families[family].maxSpeed);
        creature.genes.breedChance = randomFloat(0, this.worldData.families[family].maxBreedChance);
        creature.genes.killChance = randomFloat(0, this.worldData.families[family].maxKillChance);

        //Behavior according to genes
        if (creature.genes.canChangeDirection) {
            creature.genes.changeDirection = function () {
                creature.genes.speedX *= randomBool() ? -1 : 1;
                creature.genes.speedY *= randomBool() ? -1 : 1;
                setTimeout(creature.genes.changeDirection, creature.genes.changeDirectionTime);
            }
            creature.genes.changeDirectionTime = randomInt(1000, 5000);
            creature.genes.changeDirection();
        }

        console.log(creature.genes.species +
            "(" +
            family +
            ") created: B" +
            creature.genes.breedChance +
            " - K" +
            creature.genes.killChance);
        return creature;
    },
    createRandomCreature: function (family, x, y) {
        if (family !== "breeders" && family !== "hunters") {
            throw "Invalid family. Must be 'breeders' or 'hunters'";
        }

        //Get random creature from Sprite
        var species = this.worldData.species[family][randomInt(0, this.worldData.species[family].length - 1)];

        return this.createCreature(species, family, x, y);
    },
    evolveWorld: function (creatureOne, creatureTwo) {
        //this.app.stage.removeChild(creatureOne);
        //this.app.stage.addChild(createRandomCreature("breeders"));

        var getFamily = function(familyOne, familyTwo) {
            //Same family creatures produce breed into that family.
            //Different family creatures breed into a random family.
            if (familyOne === familyTwo) {
                return creatureOne.genes.family;
            }
            var isBreeder = randomBool();
            return isBreeder ? "breeders" : "hunters";
        }

        //Determine what each creature plans to do
        var creatureOneActionFactor = randomFloat(0, 1);
        var creatureTwoActionFactor = randomFloat(0, 1);
        var creatureOneWantsToBreed = false;
        var creatureTwoWantsToBreed = false;
        var creatureOneWantsToKill = false;
        var creatureTwoWantsToKill = false;

        //Figure out what each creature wants to do
        if (creatureOneActionFactor < creatureOne.genes.killChance) {
            creatureOneWantsToKill= true;
        }
        else if (creatureOneActionFactor < (creatureOne.genes.killChance + creatureOne.genes.breedChance)) {
            creatureOneWantsToBreed = true;
        }
        if (creatureTwoActionFactor < creatureTwo.genes.killChance) {
            creatureTwoWantsToKill = true;
        }
        else if (creatureOneActionFactor < (creatureOne.genes.killChance + creatureOne.genes.breedChance)) {
            creatureTwoWantsToBreed = true;
        }

        console.log(creatureOne.genes.species +
            ": " +
            creatureOneActionFactor +
            " B:" +
            creatureOneWantsToBreed +
            " K:" +
            creatureOneWantsToKill +
            " - " +
            creatureTwo.genes.species +
            ": " +
            creatureTwoActionFactor +
            " B:" +
            creatureTwoWantsToBreed +
            " K:" +
            creatureTwoWantsToKill);

        //React based on what each creature wants to do
        //Both creatures want to breed, then breed
        if (creatureOneWantsToBreed && creatureTwoWantsToBreed) {
            var family = getFamily(creatureOne.genes.family, creatureTwo.genes.family);
            var newCreature = this.createRandomCreature(family);
            this.app.stage.addChild(newCreature);
            console.log(creatureOne.genes.species +
                "(" +
                creatureOne.genes.family +
                ") breeds with " +
                creatureTwo.genes.species +
                "(" +
                creatureTwo.genes.family +
                ") producing " +
                newCreature.genes.species +
                "(" +
                newCreature.genes.family +
                ")");
            return;
        }
        //One of the creatures wants to kill, then kill the other
        if (creatureOneWantsToKill) {
            console.log(creatureOne.genes.species +
                "(" +
                creatureOne.genes.family +
                ") kills " +
                creatureTwo.genes.species +
                "(" +
                creatureTwo.genes.family +
                ")");
            this.app.stage.removeChild(creatureTwo);
        }
        if (creatureTwoWantsToKill) {
            console.log(creatureTwo.genes.species +
                "(" +
                creatureTwo.genes.family +
                ") kills " +
                creatureOne.genes.species +
                "(" +
                creatureOne.genes.family +
                ")");
            this.app.stage.removeChild(creatureOne);
        }
    },
    moveCreature: function(creature) {
        if (creature.x + creature.genes.speedX <= 0 ||
            creature.x + creature.genes.speedX >= this._width - this.worldData.creatureWidth) {
            creature.genes.speedX *= -1;
        }
        if (creature.y + creature.genes.speedY <= 0 ||
            creature.y + creature.genes.speedY >= this._height - this.worldData.creatureHeight) {
            creature.genes.speedY *= -1;
        }
        creature.x += creature.genes.speedX;
        creature.y += creature.genes.speedY;
    }
};