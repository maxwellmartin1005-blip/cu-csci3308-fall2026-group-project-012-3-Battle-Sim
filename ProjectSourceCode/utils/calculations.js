// Effectiveness lookup table
const effectiveness = {
    fire: {
        fire: 1,
        water: 0.5,
        earth: 1,
        life: 2,
        light: 1,
        dark: 1
    },
    water: {
        fire: 2,
        water: 1,
        earth: 2,
        life: 0.5,
        light: 1,
        dark: 1
    },
    earth: {
        fire: 1,
        water: 2,
        earth: 1,
        life: 0.5,
        light: 1,
        dark: 1
    },
    life: {
        fire: 2,
        water: 0.5,
        earth: 2,
        life: 1,
        light: 1,
        dark: 0.5
    },
    light: {
        fire: 1,
        water: 1,
        earth: 1,
        life: 1,
        light: 1,
        dark: 2
    },
    dark: {
        fire: 1,
        water: 1,
        earth: 1,
        life: 0.5,
        light: 0.5,
        dark: 1
    }
};
/*
* Computes the effectiveness of elements against each other
* 
* @param attackElement attacking element's name
* @param defenseElement defending element's name
* @return the effectiveness value
*/
function getEffectiveness(attackElement, defenseElement){
    return effectiveness[attackElement]?.[defenseElement] ?? 1;
}
/*
* Computes the damage that player 1 will do against player 2
* 
* @param p1fighter player one's fighter stats
* @param p1move player one's move stats
* @param p2fighter player two's fighter stats
* @return the damage dealt
*/
function calculateDamage(p1fighter, p1move, p2fighter){
    const damage = p1move.damage;
    const attack = p1fighter.attack;
    const defense = p2fighter.defense;
    const effectiveness = getEffectiveness(p1move.element, p2fighter.element);
    return (damage * attack * effectiveness) / defense;
}

/*
* Computes the stat change that player 1 will do against player 2
* 
* @param p1fighter player one's fighter stats
* @param alter player one move's base alter value
* @param element player one move's element
* @param p2fighter player two's fighter stats 
* @return the stat change
*/
function calculateStatChange(p1fighter, alter, element, p2fighter){
    const alteration = p1fighter.alteration;
    const permanence = p2fighter.permanence;
    const effectiveness = getEffectiveness(element, p2fighter.element);
    return (alter * alteration * effectiveness) / permanence;
}

/*
 * Performs player 1's move against player 2
 * 
 * @param p1fighter player one's fighter stats
 * @param p1move player one's move
 * @param p2fighter player two's fighter stats
 */
function executeMove(p1fighter, p1move, p2fighter){
    // Calculate and apply damage
    const damage = calculateDamage(p1fighter, p1move, p2fighter);
    p2fighter.health = Math.max(p2fighter.health - damage, 0);

    // Calculate and apply opponent stat changes
    for (const [stat, alter] of Object.entries(p1move.opponentStats)){
        if (alter != 0){
            const change = calculateStatChange(p1fighter, alter, p1move.element, p2fighter);
            p2fighter[stat] += change;
        }
    }
    // Calculate and apply self stat changes
    for (const [stat, alter] of Object.entries(p1move.selfStats)){
        if (alter != 0){
            const change = calculateStatChange(p1fighter, alter, p1move.element, p1fighter);
            // Healing stat calculations
            if (stat == "healing"){
                p1fighter.health += Math.min(p1fighter.health + change, p1fighter.maxHealth);
            }
            else {
                p1fighter[stat] += change;
            }
        }
    }
}