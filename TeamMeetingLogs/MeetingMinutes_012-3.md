**TA Meeting Notes**  
**Course:** CSCI 3308  
**TA:** Altaf Barelvi

---

## November 3, 2026

### Overview

Altaf reviewed the project board and recent development work. The main priorities are to merge pending PRs, publish updated release notes, connect the application components, and finalize the basic battle mechanics.

### Action Items

- [ ] **Team:** Review and merge pending PRs, including the results screen.
- [ ] **Yuan:** Generate and publish updated release notes after the pending PRs are merged. Planned for later that day.
- [ ] **Max:** Submit the public project-board link to the Lab 9 assignment on Canvas.
- [ ] **Max:** Write the pull request checklist to connect with the existing workflow guides.
- [ ] **Aidan:** Follow up with Max about available coding tasks.
- [ ] **Max:** Create an issue for documenting the current battle mechanics and updating the project proposal.
- [ ] **Team:** Finalize the basic battle mechanics and distinguish required features from stretch goals.
- [ ] **Team:** Set up Docker Compose for shared development and testing.
- [ ] **Team:** Hold a follow-up meeting after the TA meeting to coordinate work and catch everyone up.

### Lab and Repository Clarifications

#### Submission

One team member needs to submit the project-board link on Canvas for Lab 9. The board must be public. Max volunteered to submit it.

#### Project Board

Altaf approved keeping epics in a separate board column. This helps distinguish them from individual tasks and makes their progress easier to track.

Some user stories still need story points assigned.

#### Team Meetings

Notes are **not required for additional team work sessions**, though the team can keep them when useful.

#### Release Notes

The existing release notes cover Week 1. Updated notes are waiting on pending PRs to be merged.

### Development Progress

#### Documentation

Max created the user story creation and completion checklist and documented the commit workflow. A linked table of contents may be added later.

The pull request checklist is the next planned guide. After that, Max would like to take on coding tasks as well.

#### User Interface

The team reported that many screens already have UI work completed, with approximately two or three more PRs expected to finish the remaining work.

Andre updated the results-screen PR after Aidan’s review. It still needs final review and merging.

Altaf reviewed the battle-screen screenshot and gave positive feedback.

#### Database and Development Setup

Database work is progressing, with a database PR submitted. Yuan clarified that it does not include Docker Compose.

The team is currently testing through local npm setups and agreed that Docker Compose should be added soon.

### Project Planning

#### Battle Mechanics

The team still needs to finalize and document the battle mechanics. Character templates were discussed as a way to simplify character creation.

Max offered to collect the team’s ideas and update the project proposal. Altaf said the documentation could live elsewhere in the repository, but keeping the proposal current could help with the final presentation.

#### Basic Working Version

Altaf recommended aiming for a minimal working system, potentially by the end of the week, so everyone can test it and build on it.

Template characters and moves could support this first version. Additional move pools and other features remain possible stretch goals.

### Next Discussion

Use the follow-up team meeting to coordinate pending work, clarify battle mechanics, and bring everyone up to date. The next scheduled discussion with Altaf is Thursday’s lab.

---

## October 27, 2026

### Overview

Altaf reviewed the proposal and repository and said the project is in good shape. The main remaining work is to finish proposal edits, improve documentation, and submit the proposal link.

### Action Items

- [ ] **Team:** Submit the direct GitHub link to the project proposal on Canvas. Only one person needs to submit.
  - **Deadline:** Wednesday, October 28 at 11:59 PM Mountain Time, verified on Canvas.
  - Check that linked images and supporting files display correctly.
- [ ] **Team:** Review the proposal PR and finish remaining edits.
- [ ] **Andre:** Review and edit the meeting summary for accuracy.
- [ ] **Aidan:** Add a README describing the planned project source-code structure before the next meeting.
- [ ] **Zander:** Continue documentation updates and open another PR that evening.
- [ ] **Altaf:** Clarify the required `.gitignore` location with the professor.
- [ ] **Altaf:** Confirm which outside libraries and services the team may use.

### Lab and Repository Clarifications

#### Submission

Submit the proposal through a direct GitHub link rather than an externally hosted document.

#### Project Board

GitHub Projects is **not required for Lab 8**. Altaf plans to explain how to use it during Thursday’s lab.

#### Team Meetings

Recitation attendance remains required. Recitations will increasingly serve as project work time.

Additional work sessions can happen as needed, either with the full team or smaller groups. Online meetings through Discord or similar tools are also fine.

#### `.gitignore` Placement

The team reported testing the root-level `.gitignore`. Altaf will ask the professor about the apparent conflict with the assignment’s folder-placement instructions.

### Project Planning

#### Backend and Multiplayer

The team described backend work for storing character and move information and supporting multiplayer.

PostgreSQL remains the preferred approach because the team already knows it. The multiplayer design needs further research.

#### Computer-Controlled Opponent

A bot was discussed as a **possible stretch goal**, with options including:

- Choosing random moves.
- Choosing moves based on elemental type advantages.

No bot implementation was finalized.

#### Character Graphics

Options discussed included:

- Starting with a few preset characters.
- Using interchangeable assets for hair, clothing, and other features.
- Beginning with static images and adding animation later.

Image-upload requirements, asset storage, and permitted libraries still need clarification.

### Next Discussion

Bring questions about character assets, animation, and backend design to Thursday’s lab.
