# COMMIT CHECKLIST

# 1. Before starting your Commit

## 1.1 Identifying Story and Branch
 
 Before you start work or a commit, you should have a User Story and a Branch. To find a user story go into the project board and either take one that is assinged to you, or one in todo that is not assinged to anybody(do not do this untill after Wensday Nov 4th, as the assignment  requires us to make and do our own stoires for this first week), and move it into the In-progess setction (see Please see [User-Story-Creation-Checklist.md](./User-Story-Creation-Checklist.md) for more infomration on moving storyies), if you already have an issue/story in the In-Progress section you can use that instead. Open the Issue by clicking on it form the Project Board, on the right most side there should be a section called "Development", the "Relationships" section is above it. If a branch was linked or created during Story creation, you should see it there. If not, you can create one by clicking the blue link, or connect a preexisting one by clicking on the gear and searching for the branch.

## 1.2
Open up your IDE, and make sure all work unrelated to the commit is saved and pushed to the right branch


Before contniuing make sure you are on the right branch, to check do, git status, the very first line will tell you which branch your on. If you're not on the right branch, use git checkout (branch name)

If the branch is not there checkout into main, git pull, checkout back into your branch.

Once you have confirmed you are on the right branch, pull from it to make sure your IDE has the most recent version.

Depending on the feature you are working on, you may want to merge in any recent changes from main. To do this, checkout into main, pull it, checkout back into your branch, and run git merge main

If you run into a merge conflict after the last step, please see section 3.1.

Now you can make your changes to the file

# 2. Creating your Commit

Once you're done making some changes, use the git add command to add the changed files. If you are unsure what has changed, git status will show you all files with untracked changes. If you want to add all untracked changes, do git add . but, this isn't always the best practice, especially if there are multiple files with changes on them, instead, it's advised to do git add [local or absolute path], and then write a commit for each file

### Please note
You can have multiple commits stored on your local repo at once, meaning as long as you keep committing your progress you can work offline while maintaining a  version history. When you're back online, push as you normally would, and it will push all commits you had made, not just the most recent one. 

# 3. Pushing your Commit and What to do Beforehand
Before you push your commit, it may be a good idea to pull into your repo just to make sure no changes to the remote repository have occurred while you were making your changes. If you receive a message like "Everything up-to-date," you are fine to push and skip to section 4, if not, please read the next subsection 

## 3.1 Resolving a merge conflict
If you encounter a merge conflict on your branch, please contact the person whose changes conflict with yours; if you are unsure who, contact the whole team. If it is a self conflict, you don't need to notify anyone and can resolve it yourself. Once you have agreed upon a plan on how to resolve the merge conflict, you can use VS Code's(other IDEs may have a similar feature, but they have not been tested) merge conflict resolution mode(should activate by default if you pull in a conflict) to solve the conflict, and then push to your branch.



# 4. Next steps

Now that you've pushed your commit, you can go make more or proceed to create a pull request (see pull request checklist once it is completed).

