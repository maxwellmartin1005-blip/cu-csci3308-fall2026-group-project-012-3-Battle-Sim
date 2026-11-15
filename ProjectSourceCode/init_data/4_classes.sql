INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'The Generic One, Master of None', 500, 300, 300, 300, 300, 300, 'fire');

-- Fire Jab(Quick Attack, Fire)
INSERT INTO moves_to_fighters  (fighter_id, move_id) VALUES (1,1);
-- Fire Punch(Normal Attack, Fire)
INSERT INTO moves_to_fighters  (fighter_id, move_id) VALUES (1,7);
-- Hype(Quick Alteration, Fire)
INSERT INTO moves_to_fighters  (fighter_id, move_id) VALUES (1,19);
-- Flame On(Long Alteration, Fire)
INSERT INTO moves_to_fighters  (fighter_id, move_id) VALUES (1,31);


-- DO NOT UNCOMMENT, STILL IN DEVELOPMENT
INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Speedster the Living Rapid', 475, 300, 250, 300, 325, 350, 'water')
;

-- Ripple(Quick Attack, Water)
-- Soft and Wet(Long Alteration, Water)
-- Focus (short Alteration, Water)
-- Tsunami(Long Atack, Water)

-- INSERT INTO moves_to_fighters  (fighter_id, move_id) VALUES (2,1),


INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Golem Earth''s protector', 525, 300, 350, 275, 300, 250, 'earth')
;

-- Pebble Toss(Quick Attack, Earth)
-- Intimidate(Quick Alteration, Earth)
-- Boulder Bash(Long Atack, Earth)
-- Bulk Up(Long Alteration, Earth)



INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Druid of the Swift Weeds', 500, 300, 275, 350, 250, 325, 'life')
;

-- Total Peace(Long Alteration, Life)
-- Get Dirty(Normal Alteration, Earth)
-- Healing(Normal Alteration, Life)
-- Sprout(Quick Atack, Life)

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Inferno the Ash Bringer', 500, 350, 275, 300, 250, 325, 'fire')
;

-- Fire Jab(Quick Attack, Fire)
-- Blind(Nomral Attack, Light)
-- Flaming Spin Kick(Long Attack, Fire)
-- Flame On(Long Alteration, Fire)


INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Seraphin of Purification', 550, 275, 300, 325, 250, 300, 'light')
;

-- Blind(Nomral Attack, Light)
-- Divine Judgement(Long Atack, Light)
-- Glow Up(Normal Alteration, Light)
-- Restraining Order(Long Alteration, Light)

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Abyssal Trickster', 500, 275, 250, 325, 350, 300, 'dark')
returning *;

-- Shadow Strike(Long Attack, Dark)
-- Got Your Nose(Normal Alteration, Dark)
-- Manipulate(Long Alteration, Dark)
-- Get Dirty(Normal Alteration, Earth)
