# Battle Stat Documentation

## Purpose:
Explain the battle mechanics of our game and how we want our turns system to work, alond with descriptions of all the other stats in the game.
## Stats:
HP: Health Points, lose all of them and you lose.
Attack: A modifier that helps determine how much damage a move does
Defense: A modifier that helps determine how much less damage a move does to you.
Alteration: A modifier that helps determine how effective your stat changing moves are.
Permanence: A modifier that helps determine how much less effective stat changing moves are to you.
Agility: A value that determines your priority in the speed mechanic

## Speed Mechanic:
The speed mechanic is what determines who takes their turn when. We're going based off a system where you take your turn seperate from your opponent taking their turn. The way that this is determined is if you take your agility stat you need to find your constant NTime (the cooldown time after a normal attack). NTime can be calculated by NTime = LAgility - Agility, where LAgility is a constant that's a bit larger than the speed cap. From there you can get QTime (the cooldown time after a quick attack) and LTime (the cooldown time after a long attack) by doing QTime = NTime /2, and LTime = NTime * 2. Whenever you throw out a move your players countdown (PCount) gets changed to the cooldown time associated with the move. This creates probably our biggest change from traditional turn-based games which is that it's possible to throw out multiple moves in the time it takes someone to throw one. This'll of course be balenced by having moves that take longer to come out being stronger. PCount is a timer that is not associated with actual time, but instead associated with a loop that subtracts from PCount until it reaches 0. A match starts out with both peoples PCount = their NTime. 

## What is a Move
A move is an ability you make on your turn. A move has variables to take into account such as:
Damage: How much damage a move does
Healing: How much a move heals yourself
AttAlter: How much a move alters the opponents attack
DAlter:How much a move alters the opponents defense
AltAlter: How much a move alters the opponents alteration
PAlter:How much a move alters the opponents permanence
AgiAlter:How much a move alters the opponents agility
SAttAlter: How much a move alters your own attack
SDAlter:How much a move alters your own defense
SAltAlter: How much a move alters your own alteration
SPAlter:How much a move alters your own permanence
SAgiAlter:How much a move alters your own agility
Element: what is the elemental typing of this move

## Types of Moves:
Quick Attack = do less damage, take less time (QTime)
Normal Attack = do normal damage, take normal time (NTime)
Long Attack = do lots of damage, take long time (LTime)

Quick Alteration = do less alteration, take less time (QTime)
Normal Alteration = do normal alteration, take normal time (NTime)
Long Alteration = do lots of alteration, take long time (LTime)
Burst Alteration (stretch goal) = Quick but temporary changes, take less time, but are temporary

## How is Damage calculated:
effectiveness = a variable that can only be either -1, 0, or 1 based off if the move is resistant, normal, or supereffective. 

Damage = ((Move.Damage * Player.Attack) * (2^effectiveness)) / Opponent.Defense


## How are stat changes calculated
Stat Changes are calculated for every stat effected by a move.
effectiveness = a variable that can only be either -1, 0, or 1 based off if the move is resistant, normal, or supereffective. 

StatChange = ((Move.Alter * Player.Alteration) * (2^effectiveness)) / Opponent.Permanence



