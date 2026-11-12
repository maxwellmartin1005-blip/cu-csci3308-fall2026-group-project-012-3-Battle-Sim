/* I needed a user to create the classes with so that would have a creator_id*/

INSERT INTO users (id, username, password_hash,email) VALUES (0, 'admin', '$2a$10$6ocV87OneRLGOAiyEpwXE.vn4skhxeiuIp0yZyddkqvgvbC/BNuQ.','admin@admin.com') returning *;

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'The Generic One, Master of None', 500, 300, 300, 300, 300, 300, 'fire')
;

INSERT INTO Moves_to_Fighters  (FighterID, MovesID) VALUES (0,1); 
INSERT INTO Moves_to_Fighters  (FighterID, MovesID) VALUES (0,7);
INSERT INTO Moves_to_Fighters  (FighterID, MovesID) VALUES (0,7);
INSERT INTO Moves_to_Fighters  (FighterID, MovesID) VALUES (0,7); 


INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Speedster the Living Rapid', 475, 300, 250, 300, 325, 350, 'water')
;

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Golem Earth''s protector', 525, 300, 350, 275, 300, 250, 'earth')
;

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Druid of the Swift Weeds', 500, 300, 275, 350, 250, 325, 'life')
;

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Inferno the Ash Bringer', 500, 350, 275, 300, 250, 325, 'fire')
;

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'Seraphin of Purification', 550, 275, 300, 325, 250, 300, 'light')
;

INSERT INTO fighters (creator_id, name , health, attack, defense, alteration, permanence, agility, element) 
VALUES (0, 'The Generic One, Master of None', 500, 275, 250, 300, 300, 300, 'dark')
returning *;