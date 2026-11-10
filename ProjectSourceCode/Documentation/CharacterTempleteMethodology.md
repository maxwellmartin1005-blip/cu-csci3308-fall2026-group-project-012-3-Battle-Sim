# Purpose

To lay out how a class/templete is to be created and how its stats are in scale with other stats so that, if any fundamental changes are needed for balancing, they can be made here to visualize their impact before implementation. This file is also meant to serve as the base for class creation.


# Stat layout
The following Stat layout is inspired very loosely by the  Golden Sun series, 


Base HP is 500

Base attack is 300

Base defense is 300

Aggility = 300

Alteration = 300

Permenence = 300

# Class Creation

Stat changes to create other template/class are based on the idea of having modifiers of +2, +1, -1, -2 applied to the generic template/class. 


Considering the other stats, I rescaled the numbers to +50, +25, -25, -50 to match.

 When making a class, all modifiers must be applied to different stats, you can not give speed both +25 and +50. The only exception is the creation of the template class that all others are based on, that original class will have no modifiers

For example, if a class will have its attack boosted by 50, then three other stats must be changed by +25, -25, and -50 respectively, this allows for many different class types to give combat variety.


There are six elements for a class to have

list:
* Fire
* Earth
* Water
* Life
* Light
* Dark

Classes will be made by combining the stat distribution described above with a chosen element, some classes may be entirely unique from their competition, or, in some cases, just elemental variants, like water fighter, fire fighter, etc
