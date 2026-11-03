# User-Stories Creation:


## 0. Creating an Epic

This section is only if an applicable Epic doesn't already exist. If you know an Epic for your story exists already, you may skip to Section One, this section will later have a guide to create an epic, but you probably already know how. If not, please ask the team or ask me to prioritize this section

## 1. Creating the Story Part 1

0. Be in the project board

1. Hover over the bottom of one of the fields (the rectangles that have all the stories in them), an option that says "add item" should appear

2. After clicking it, a text box should show up on the very bottom of the page. Click the "+" button on the far left side of the text field, two options should then show up 
    1. Create New Issue
    2. Add New Item From Repository.
      
    Then Select Create New Issue

3. You should now be in the menu to create your issue, fill in the name of your issue
   
4. In the next section, what is needed in a proper description will be discussed
        
## 2. Creating the Story Part 2: Making a Good Description, User Stories and Acceptance Criteria

Every description should have two parts, the User Story and the Acceptance Criteria

### User Stories
 User Stories should be in the format of "As a [role], I want [goal], so that [reason]  "
    
An example of this is:

 As a developer, I want a user story creation and completion checklist, so that I can follow the team's workflow and avoid miscommunications

### Acceptance Criteria
Acceptance criteria are what must be included, such as functionality when something is clicked, what are valid inputs for a password, or, in the case of the story created for this file, what sections it must have. This is also where it should be specified if placeholders are expected for the resolution of this story(such as creating UI before the images of the characters are ready, or UI before the backend functions)

#### Example of Acceptance Criteria and the User Story Together: 

As a developer, I want a user story creation and completion checklist, so that I can follow the team's workflow and avoid miscommunications


Acceptance Criteria: 
- Creation of the story itself is outlined
- Workflow for writing the description of the Story
- Workflow for writing acceptance criteria
- Workflow for filling out user story attributes such as Epic and Story Points
- Workflow for completing the story

## 3. Creating the Story Part 3: labels and Assignees

Now that the description and title are written, the next step is to assign labels and assignees.

Underneath the description text box, there should be four grey buttons. Click the one with the name "Label" and select the appropriate labels

You could also assign an assignee at this stage by clicking on the "Assignee" button and selecting one or multiple assignee(s)

Before clicking Create, make sure it's assigned to the right project board of "BattleSim-012-TeamAvatar-3"

Now you can click "Create", or if you would like to immediately create another issue, you can select the "Create more" checkbox, then click "Create"

## 4. Creating the Story Part 4: Required Post Creation Additions

Find your newly created issue in the To Do section of the board and click on it

Once it opens, look at all the boxes on the right side of the popup. Here you can assign yourself or another user if you didn't do so during creation(until after Wednesday 4th, you should always be assigning any issue you create to yourself). You can also assign/reasign lables here as well. Next, look at the Relationships section and click the gear, then click the "Add Parent" button. Use the search bar to search for the Epic your story is attached to, see section 0 if you don't have an applicable Epic

Now find the Projects section, it is right underneath the Labels section. There will be two text fields, Epic and Story Points. Fill out the Epic text field with the parent Epic.

Story points represent the effort needed to complete the story specifically: work, complexity, and risk, not hours. This project uses the following story points: 1,2,3,5,8 and 13, with 1 requiring the least amount of effort and 13 requiring the most. If it's a 13, you should split it into multiple stories.

### Deciding on story points

Unless you have been told otherwise for that Sprint, Story points are to be decided during the start of a Sprint as a group. This is because if something happens to a team member that would impact their work, it will be given to other members. In that situation, having a collectively agreed-upon rating would allow this work to be properly planned and time-blocked in this situation.

### Creating/Selecting Your Branch

Under the Relationships section, there should be a Development section. If an existing branch is applicable, click the gear button and search for your branch. While it says pull request in this menu, it will display all branches even if they don't have a pull request on them. If an applicable branch does not exist, don't click the gear; instead, click the Create a branch button

It should auto-generate a name, if not, make one

Your repository destination should be the repository for this project by default, so there is no need to change it

By default, the Branch source is set to main. If you would like to branch off of a different branch, select the button that says "main" and search for the branch that you wish to branch off of

By default, the option "Checkout locally" should be selected. If not, select it and then click "Create branch." A window should pop up with commands to fetch and enter your new branch in your local repository. For your convenience, please click the copy button and proceed to paste the command into your IDE


### Moving your Issue and Story

The following can be done from outside the story by dragging it on the Project board into the appropriate section, or changing it manually from within the issue

If the story is to be done this sprint, it should be in the To Do section. If it won't be done this sprint, move it to the Icebox. The Icebox is for stories that are to be done in future sprints. To move your issue from the inside, look at the "Project" section where you assigned the Epic previously. Right above it should be a "Status" section. By clicking on that status, a drop-down menu will appear where you can select your new status. 

Alternatively, if you are on the general board view, you can drag the issue into the section that corresponds to the desired status

Congratulations, you have now created your story.








# User-Story Completion

## 1. Starting the story 

When you are ready to start a story, you can move it into the In Progress section via the steps in the above "Moving your Story" subsection. After you have marked it as in progress, you may begin working on the story in your branch. When you are done, raise a pull request into main and notify the team. For the guide on how to make and resolve a good pull request, see {the final section of this checklist} 

Once your pull request has been approved and merged into main, you may close the issue by moving it into the "Done" section. This will close your issue. DO NOT close an issue unless you are sure that issue/story is complete, as the process to reopen that story/issue is not listed here. Changing the status/moving the story/issue will not reopen it.  


 DO NOT delete the issue. The only circumstances you should ever delete an issue are: duplicate issues have been created, the team has decided the story/issue is not in line with the requirements for this project even as a stretch goal, or it is a temporary/accidentally created issue.

Congratulations, you have now completed your story



# How to Make a Pull Request

PLEASE NOTE: this section will be moved once the full guide for pull requests is added. What is contained below are the most basic instructions for the process

1. Before making your pull request, make sure all changes are saved and pushed to your branch, then move into main using:

git checkout main

Once you're in main, do git pull, then return to your branch 

git checkout (branch name)

If you have forgotten the name of your branch, do the following to list all branch names:

git branch -r 

### Tip
##
If you are using VS Code(this may work in non-VS Code terminals or other IDEs, but it has not been tested), when writing git checkout (branch name), while writing the branch name you can hit the TAB key to autofill the rest of the branch name. Do note this may not fully work if the part you have written could be the start of more than one branch name, in that case, keep writing until it only matches one.
##


Once you're back in your branch, do git merge main, but make sure you're in your branch before doing this. If there are any merge conflicts, talk with the team member(or the whole team if you are unsure) who wrote the part that conflicts, and discuss what should change to resolve the conflict. Make those changes, and commit and push them to your branch. Make sure that your commit message mentions the merge conflict, that this was in preparation for a pull request, and potentially how it was resolved.

If there are no merge conflicts, commit and push your updated branch. In your message, note that you pulled from main in preparation for a pull request. Additionally, you may also want to pull mid-development if you know changes have been made. In that case, the same procedures above apply, just change the commit messages to reflect that you are pulling to keep up with the changes.

Once your branch has been updated, raise a pull request through GitHub or your terminal. You should already know how to do this, if not, please ask the team for help we would be happy to. Full instructions on raising a pull request will be in the pull request checklist once it's completed. When you raise your pull request, you should put in a comment stating what issue(s) are being resolved and potentially attach any images if they are applicable.

Once you have successfully created the pull request, notify the team so that it may be approved

## Approving a Pull Request

The full file will go into more depth about this, but within GitHub, team members will approve each other's pull requests. If you see someone asking for an approval, either respond saying you will, or that you can not. 

After you have informed the group you are going to be approving the request, you may start

Go into the pull requests tab, and select the pull request you would like to approve and assign yourself as a reviewer

Scroll through the commit history and then go over into the "Files changed" tab. From here, you can see all the changes the team member has made. If it is a .md file, like this checklist, you can fully review it on GitHub if you wish. In all other cases, please skip ahead to the "Checking the Branch section. If the file is a .md file, please continue reading this section

To the left of the Copilot logo are two buttons, one looks like <> and another like a page with one corner folded over. By default, you will be looking at the raw Markdown, but by clicking the button with the page icon you can view all the formatting (rich diff). It is recommended you first check this rich diff version, as flaws might be more noticeable. Read through the file and click the <> button if you find something you think needs to be changed. Do not scroll up to hit the button. This will change which section you are looking at, just click it from where you are. Once it switches over to the raw Markdown, hover over the offending line with your mouse. A blue box with a "+" in it should appear. Click it and write your comment explaining what should be changed in or near that line and why. Then click "Start a review", and go back to viewing the rich diff of the file. Repeat this process till you have read the whole file

on the very top of your screen there should be a green "Submit review button", click it, and choose the request changes button, then  write a commnet sumerizing the changes, and then click the "Submit review" button on the bottom of this window. If there is nothing that you think needs changing, choose the Approve option instead, leave a comment, and click the "Submit review" button



## Checking the Branch 

in your IDE either push your changes to your branch or use git stash on them before doing the following steps. Check if you have the branch on your local system by doing 

git branch -r

That will display every branch in your local repo

 if you already have the branch on your local system, do git checkout (branch name)

If you do not have it, checkout into main, pull, and then check, you should have it now(the full guide will have a better method. If you know of a better method already, please use it instead), and can now checkout into it

Once in that branch, do git pull to make sure the most recent version is on your local repo

From here, you can run the code

If it's front end, you will need to do npm install and then npm start, only if you have Node and npm installed locally. If you don't use a Docker container, at the time of writing, one has not been set up, but one should be in the near future

While it's running, if you notice anything, go back into the  "Files changed" page on GitHub for your next steps

Hover over the offending line with your mouse, a blue box with a "+" in it should appear. Click it and write your comment explaining what should be changed in or near that line and why. Then click "Start a reivew".


When you are done with your review, make sure to look through the whole code if you haven't done so already, to make sure you did not miss any changes you could request. Then at the very top of your screen there should be a green "Submit review button", click it, and choose the request changes button, then write a commnet sumerizing the changes, and then click the "Submit review" button on the bottom of this window. If there is nothing that you think needs changing, choose the Approve option instead, leave a comment, and click the "Submit review" button
