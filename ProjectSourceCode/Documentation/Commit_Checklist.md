# COMMIT CHECKLIST

# 1. Before starting your Commit

## 1.1 identifying Story and Branch
 
 Before you start on work or a commit you should have a User Story and a Branch. To find a user story go into the project board and either take one that is assinged to you, or one in todo that is not assinged to anybody(do not do this untill after Wensday Nov 4th, as the assignment  requires us to make and do our own stoires for this first week), and move it into the In-progess setction (see Please see [User-Story-Creation-Checklist.md](./User-Story-Creation-Checklist.md) for more details. for more infomration on moving storyies), if you already have an issue/story in the In-Progress section you can use that instead. Open the Issue by clicking on it form the Project Board, on the right most side there should be a section called "Development", the "Relationships" section is above it. If a branch was linked or created during Story creation you should see it there, if not you can create one by clicking the blue link, or conect a prexisting one via clikcing on the gear and searching for the branch.

## 1.2
Open up your IDE, and make sure all work unrelaeted to the commit are saved and pushed to the right branch


Before contniuing make sure you are on the right branch, to check do, git status, the very first line will tell you which branch your on. If your not on the right branch use git checkout (branch name)(create guide if its not there)

Once you have confirmed you are on the right branch pull from it to make sure your IDE has the most recent version.

Deppending on the feature you are working on you may want to  merge in any recent changes from main, to do this checkout into main, pull it, checkout back into your branch, and do git merge main

If you run into a merge confilct after the last step pleaes see section 3.1.

Now you can make your changes to the file

# 2. Creating you Commit

Once your done making some changes use the git add comand to add the changes files, if you are unsure what has changed git stauts will show you all files with untracked changes. If you want to add all untracked changes do git add . but, this isnt always the best pracitce, espicaly if there are multiple files with changes on them, instead its advised to do git add [local or absolute path], and then writre a commit for each file

### Please note
you can have multtiple commits stored on your lcoal repo at once, meaning as long as you keep commiting your progress you cna work ofliine while mainting a nice versoin history. When your back online push as you normanly would and it will push all commts you had made not just the most recent one, this is great for traveling or taking the bus 

# 3. Pushing your Commit and What to do Before hand
Before you push your commit it may be a good idea to pull into your repo just to make sure no changes to the remot repostiry havce cocured while you were making you rchanges. if you recive a messege liek "Everthing up-to-date" you are fine to push and skip to section 4, if not please read the next subsection 

## 3.1 Resolving a merge conflict
If you encounter a merge conflict on your branch please contact the person whose changes conlifct with yours, if you are unsure who, contatct the whole team. If it is a self conflict you dont need to notify anyone and can reoslve it yourself. Once you have agreedapon a plan how to reolve the merge conflict you can use VS Code's(other IDEs may have a simlair feature but they have not been tested) merge conlict resoultion mode(should acctiavete by default if you pull in a confilct) to solve the conlifct, and then push to your brnach



# 4. Next steps

Now that your you pushed you commit you can go make more or procedd to create a pull reest(see pull request checklist once it is completed).

