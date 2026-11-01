# User-Stories Creation:


## 0. Creating an Epic

This section is only if an applicble eEpic dosent arleady exist, if you know an Epic for your story exists already you may skip to Section One

## 1. Section one name placeholder
1. hover over the bottom of one of the feilds[name unsure], an option that says add item should appear

2. After clicking it a text box should show up, click the "+" button on the far left side of the text feild two opption shold then show up 
    1. Create New Issue
    2. Add New Item From Repository.
      
    Then Select Create New Issue

3. You should now be in menu to create your issue, fill in the name of your issue 
4. in the next section what is needed in a proper description will be disccused
        
## 2. Making a good discription, User Stories and Acceptence Criteria

Every discription should have two parts, the User story adn Acceptennce Criteria

### User Stroies
 User Stoires should be in the format of As a [role], I want [goal], so that [reason]  
    
An example of this is:

 As a developer, I want a user story creation and completion checklist, so that I can follow the teams work flow and avoid miscommunications

### Acceptence Criteria
Acceptaence criteria is what must be included, suhc as functiality when somthing is clicked, what are vallid inputs for a pasowrd, or in the case of the story created for this file, what sections it must have. This is also where it should be spesicifed if placeholders are expected for the resoultuion of this story(such as creating UI before the images of the charecters are ready)

#### Example of Acceptence Crieria and the User Story Toghter: 

As a developer, I want a user story creation and completion checklist, so that I can follow the teams work flow and avoid miscommunications


Acceptance Criteria: 
- Creation of the story itself is outlined
- Workflow for filling out user story atributeets such as Epic, and story points
- Workflow for wirting the descripton of the story 
- Workflow for writing acceptance criteria
- Workflow for compleating the story

## 3. Ending the Initaial Creatoin Process

Now that the decsription and title are writen the next step is to assign labels and potteilty and Assingee.

undernath the dercitpion text box there hshould be four gery buttons click the one with the name "Label

and selct the opportite labels

you could also assign an assignee at thsi stagae by clciking on the "Assignee" button an dselctiong one or moultipe Assignee(s)

before clicking create make sure its assigned to the right projecet board of "BattleSim-012-TeamAvatar-3"

Now you can click create, or if you would like to imedatly create another issue you can seslect the Create more checkbox, then click create

## 4. Post Creation Addtions

find your newly created issue in the Todo sectoin of the board and click on it

once it opens

look at all the boxes on the left, here you can assign yourself or another user if you didnt do so douring creation(untill after Wensday 4th you should always be assiging any issue you create to yourself), you can also assign/reasign lables here as well. Next look at the Relationships  and click the gear, then click the  add parent button, use the search bar to search for the Epic your story is atacthed to, see section 0 if you dont have an applciable epic

Now find the Projects section, it is right undernith the labels section, there will be two text feilds, Epic and Story Points, put the namme of the parent Epic in the Epic text box

Story points repsent effort needed to compleate teh stroy spesficaly: work, complexist, and risk, not hours. This porject uses the following story points: 1,2,3,5,8 and 13, with 1 being requring the least amountt of effort and 13 requring the most. If its a 13 you should consider spliting it into multiple stories.

### Deciding on story points

Unless you have been told otherwise for that Sprint, Story points are to be decided during the start of a Sprint as a group. This is becuase if somthing happens to a team member that would impact their work, it will be given to other members, by creating a collective raiting work can be proeprly planed and time blocked in this sitaution.

### Creating/ selecting your your branch

undenretih the RelationShips section there should be a Development section if an eexisting branch is applicable click the gear button and search for you rbranch, while it says pull request  in this menu, it will display all brnahces even if they dont have a pull request on them. If an plliable branch does not exist dont click the gear, instead click the create a branch button

It should auto generate a nam e whtat woudl be fine to keep, but it can be chagned if neccary.

Your reposrity diestion should be the reposiry for this project by default, so there is no need to change it

by deafult the Branch source is set to main, if you would like to branch off of a diffren tbaracnh sellect the button that says "main" and serach for the branch that you wish to branch off of

by deafuly the opotin "Checkout loccaly" should be selcted, if not selcte it and then click "Create branch" a window should pop up with comands to fethch and enter your new branch in your local reposoirtory, for your convicne please click the coppy button and precede to paste the comand into your IDE


### Moving your Issue and Story

The following can be done from outside the story by draging it on the Project box into the approite section, or chaning it manualy from withinn the issue

If the story is to be done this sprtin it sohludl be in the Todo section, if not move it to the icebox, thte icebox is for stoyies that are to be done in  furuter spirnts. to move your issue look at the porject section where you assigned the Epic previously, right above it should be a "Status" sectoin, by clking on that status a drop down menu will paer where you can selct your nw status. 

Alternitavilty, if you are on the gernal board view, tou can  drag the issue into the setion that corisponds to the deisred status

Congratalutions you hvae now createred your story.








# User -Stories Compleation

## 1. starintg the story 

When you are ready to start a sotry you can move it into the in progess section via the steps in the above "Moving your Story" subsectoin, after you have marked it as in progess you may beguin working on the story in your branch, when you are done raise a pull request into main and notify the team, for the gudie on how to make and resolve a good pull requst see {link} 

Once your pull request has been approved and merged into main you may close the issue by moiving it into the "Done" section, this will cose your issue. DO NOT close an issue unless you are sure that issue/story is complete, as the process to reopen that asotry/isissue is not lissted here, chanign the status/ moving the story/issue wil not repopen it.  


 DO NOT delete the issue, the only circumstances you should ever delete an issue are: duplicate issues have been created, the team has decided the story/issue is not inline with the requiemnts for this project even as a strch goal, or it is a tempory/accidnetialy created issue.

Congatluations you have now compleated your story



# How to make a pull request

PLEASE NOTE: this section will be moved once the full guide for pull requests is completed, what is continaed bellow are the most basic insturctions for the process

1. Before making your pull request make sure all chagnes are saved and pushed to your branch, then move into main using:

git checkout main

once your in main do git pull, now return to your brnach 

git checkout (branchame)

if you have forgoten the name of your branch do the following to list all branch nnames:

git branch -r 

### Tip
##
If you are using VS Code(this may work in no VS Code terminals or other IDEs but it has not been tested) when writing git checkout (branch name), while writing the branch name you can hit the TAB key to autofill the rst of the brnach name, do note this may not fully work if the part you have writen could be the start of more than one branch name, in that case keep writigni till it only mathces one.
##


once your back in your brnach do git merge main, make sure your in your brnach before doing this. If there are any merge conflicts talk with the team member(or whole team if you are unsure) who wrote the part that conflicts, and discuss what should chaage to resovle the conlfict, make those changes, and commit and psuh them to your branch, make sure that your commit messeage mentions the merge conflict, that this was in prepation of a pull request and potteiatly how ti was reoslved.

If there are no merge conflicts commit and push your updated branch, in you rmessage note that you pulled in from main in prepation of a pull request. Addtainly you may also want to pull mid deveolmpment if you know changes have been made, in that case the same prcocduers above apply, just change the commit meeseges to refrelct that.

once your branch has been updated raise a pull request, through Github or your terminal, you should aleady know how to do this, if not please ask the team for help we would be happy to, full instuictions on raising a pull request will be in the pull reuqest checklist once its completead. When you raise your poull reuest you should put in a comment stating what issue(s) are being resolved and poteatil atach any images if they are applicbble

Once you have succfusly created the pull request notify the team so that it may be apporved

## aproving a pull request

the full file will go into more depth about this, but within Github team members will arpove eachtohers pull requests if you see somone asking for a aproval either respond saying you will, or that you can not and encourge somone else to help out.

after you have informed the group you are goign to be aproving the request you may start

go into the pull requests tab, and selct the pull reuqest you would like to arppove and assign yourself as a reviewer

scroll thorugh the comiit history and then go over into the "Files changed" tab from here  you can see all the changes the team mamber has made, if it is a .md file like this checklist you can fully review it on Github if you would wish, in all other cases please skip ahead to the "Checking the Branch section", if the fiel is a .md file please continue reading gthis section

to the left of the coplolite logo are two button, one looks like <> and naothe rlike a page with one corner foldeed over, by default you will be looking at the raw Markdown but by clikcing the button with e page icon you can view all the formating(rich diff). It is reomcned you first check this version. Read through the file and click the <> button if you find somthing you think needs to be changed, do not scroll up to hit ht ebutton, this will chagne which section you are looking at, just click it from where you are. Once it switchveers over to the raw Markdown hover over teh offending line with your mouse, a blue box awith a "+" in it should appear, click it and write you ccmment explaing what should be changed in our near that line and why. and click start a reivew, go back to viewing the rich diff of the file. repeat this process till you have read the hwole file

on the very top of your screen there should be a green "Submit review button", click it, and choose the request changes button, then  write a commnet sumerizing the changes, and then click the "Submit review" button on the bottom of this window. If there is nothing that you htink needs changing choose the Approve option isntead, leafe ac omment and click the "Submit review" button



## checking the branch 

in your IDE either push your changes to your branch or use git stash on them before doing the following steps.Check if you have the branch on your local system by doing 

git branch -r

That will display every branch in your local repo

 already have the branch on your local system do git checkout (branch name)

if you do not have it checkout into main, pull, and then check, you shoul dhave it now(the full guide will have a better method, if you know of a better method please use it instead), and can now checkout into it

onnce in that branch do git pull to make sure the most recent version is on your lcoal repo

from here you can run the code

if its front end you will need to do npm install and then npm start, only if you have node and npm installed localy, if you dont use a docker contatiner, at the time of wirting one has not been setup but one should be in the future

while looking through it runing if you nitoice anything go back into the  "Files changed" page on github, for your next steps

hover over teh offending line with your mouse, a blue box awith a "+" in it should appear, click it and write you ccmment explaing what should be changed in our near that line and why. and click start a reivew, you may want to leave multiple on diffrent lines



When you are done your review look make sure to look thorugh the whole code iif you havnet done so already to make sure you did not miss any changes you could request. Then at the very top of your screen there should be a green "Submit review button", click it, and choose the request changes button, then  write a commnet sumerizing the changes, and then click the "Submit review" button on the bottom of this window. If there is nothing that you htink needs changing choose the Approve option isntead, leafe ac omment and click the "Submit review" button
