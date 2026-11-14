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
* @param p2fighter player two's fighter stats 
* @return the stat change
*/
function calculateStatChange(p1fighter, alter, p2fighter){
    const alteration = p1fighter.alteration;
    const permanence = p2fighter.permanence;
    const effectiveness = getEffectiveness(p1move.element, p2fighter.element);
    return (alter * alteration * effectiveness) / permanence;
}
