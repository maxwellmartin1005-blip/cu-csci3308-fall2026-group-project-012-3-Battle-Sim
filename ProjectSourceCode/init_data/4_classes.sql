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
INSERT INTO moves_to_fighters(fighter_id, move_id) VALUES(2,2),
-- Soft and Wet(Long Alteration, Water)
(2,32),
-- Focus (short Alteration, Water)
(2,20),
-- Tsunami(Long Atack, Water)
(2,14);



INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Golem Earth''s protector', 525, 300, 350, 275, 300, 250, 'earth')
;

-- Pebble Toss(Quick Attack, Earth)
INSERT INTO moves_to_fighters(fighter_id, move_id) VALUES(3,3),
-- Intimidate(Quick Alteration, Earth)
(3,21),
-- Boulder Bash(Long Atack, Earth)
(3,15),
-- Bulk Up(Long Alteration, Earth)
(3,33);


INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Druid of the Swift Weeds', 500, 300, 275, 350, 250, 325, 'life')
;

-- Total Peace(Long Alteration, Life)
INSERT INTO moves_to_fighters(fighter_id, move_id) VALUES(4,34),
-- Get Dirty(Normal Alteration, Earth)
(4,27),
-- Healing(Normal Alteration, Life)
(4,28),
-- Sprout(Quick Atack, Life)
(4,4);

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Inferno the Ash Bringer', 500, 350, 275, 300, 250, 325, 'fire')
;

-- Fire Jab(Quick Attack, Fire)
INSERT INTO moves_to_fighters(fighter_id, move_id) VALUES(5,1),
-- Blind(Nomral Attack, Light)
(5,11),
-- Flaming Spin Kick(Long Attack, Fire)
(5,13),
-- Flame On(Long Alteration, Fire)
(5,31);

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Seraphin of Purification', 550, 275, 300, 325, 250, 300, 'light')
;

-- Blind(Nomral Attack, Light)
INSERT INTO moves_to_fighters(fighter_id, move_id) VALUES(6,11),
-- Divine Judgement(Long Atack, Light)
(6,17),
-- Glow Up(Normal Alteration, Light)
(6,29),
-- Restraining Order(Long Alteration, Light)
(6,35);

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Abyssal Trickster', 500, 275, 250, 325, 350, 300, 'dark')
;

-- Shadow Strike(Long Attack, Dark)
INSERT INTO moves_to_fighters(fighter_id, move_id) VALUES(7,18),
-- Got Your Nose(Normal Alteration, Dark)
(7,30),
-- Manipulate(Long Alteration, Dark)
(7,36),
-- Get Dirty(Normal Alteration, Earth)
(7,27);

