# COMMIT CHECKLIST

# 1. Before starting your Commit

## 1.1 identifying Story and Branch
 
 Before you start on work or a commit you should have a User Story and a Branch. To find a user story go into the project board and either take one that is assinged to you, or one in todo that is not assinged to anybody(do not do this untill after Wensday Nov 4th, as teh sassimenget reuqiers us to make and do our own stoires for this first week), and move it into the In-progess setction (see [link to in progress User Story Checklist] for more infomration on moving storyies), if you already have an issue/story in the In-Progress section you can use that instead. Open the Issue by clicking on it form the Project Board, on the right most side there should be a section called "Development", the "Relationships" section is above it. If a branch was linked or created during Story creation you should see it there, if not you can create one by clicking the blue link, or conect a prexisting one via clikcing on the gear and searching for the branch.

## 1.2
Open up your IDE, and make sure all work unrelaeted to the commit are saved and pushed


Before contniuing make sure you are on the right branch, to check do, git status, the very first line will tell you which branch your on. If your not on the right branch use git checkout (branch name)(create guide if its not there)

Once you have confirmed you are on the right branch pull from it to make sure your IDE has the most recent version.

Now you can make your changes to the file

# 2. Creating you Commit

Once your done making some changes use the git add comand to add the changes files, if you are unsure what has changed git stauts will show you all files with untracked changes. If you want to add all untracked changes do git add . but, this isnt always the best pracitce, espicaly if there are multiple files with changes on them, instead its advised to do git add [local or absolute path], and then writre a commit for each file

# 3. Pushing your Commit and What to do Before hand

# 4. Next steps