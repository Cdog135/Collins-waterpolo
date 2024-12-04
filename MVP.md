# MVP Implementation Plan



## Day 1-2 (Core Framework)
Basic Setup
Created a simple Three.js scene
Added camera positioned to view the game area
Set up basic lighting to see objects
Core Game Objects
Ball
Created a basic yellow sphere for the ball
Set starting position at bottom of screen
Added simple movement controls
Goal
Built simple white posts and crossbar
Added basic net design
Positioned at back of scene
Water Surface
Added blue plane for water
Simple up/down animation for water motion
## Day 3 (Core Game Features)
Mouse Controls
Click and drag ball to aim
Release to shoot towards goal
Ball moves smoothly to target location
Shot System
Ball follows path to where player aimed
Returns to start position after each shot
Simple collision detection with goal area
## Day 4-5 (Improvements)
Mobile Support
Added touch controls for mobile devices
Ball follows finger/touch movement
Same shooting mechanics as mouse
Refinements
Made sure ball movement is smooth
Fixed goal size and position
Added simple instructions text
Made game work on different screen sizes

----------------------------------------------------------------------------------
## NEXT STEPS
----------------------------------------------------------------------------------
Create a goalie object who chooses a third of the goal to block and will output block if the goalie guesses correctly.
Add a scoring system that increments when the ball goes in the goal.
Add a lives system that decrements when the ball is blocked.
Add a game over screen that displays the final score and allows the player to restart.
Add music and sound effects.
Make it so the player can skip a shot by dragging the ball towards the bottom of the screen.
make it so the player can adjust the speed of the shot by dragging the ball quicker or slower.



Add a multiplayer option where a second player can control the goalie.





### Initialization inside GameManager
**Priority:** [P0]
**Implementation Timeline:** [Day 1]

**Core Requirements:**
- The initialization of player, goalie, ball, and net objects
- Functionality to reset the state of the objects
- A score that increases when shots are scored
- Lives that decrease when shots are blocked

**Technical Components:**
- Variables
    - `score` (*int*): Tracks the player’s score (goals made).
    - `lives` (*int*): Number of lives (missed shots allowed).
    - `isGameOver` (*boolean*): Indicates if the game is over.
- Methods
    - `initializeGame`: Sets initial score and lives, instantiates player and goalie objects, and starts the first round.
    - `startRound`: Resets player and goalie states to prepare for a new shot attempt.
    - `resetGame`: Resets all game variables to initial state for replay.
    - `checkGameOver`: Returns `true` if lives have reached zero.

**Simplifications:**
- Objects are made in 2D instead of 3D models


### Shot and Block Mechanics
**Priority:** [P0]
**Implementation Timeline:** [Day 2]

**Core Requirements:**
- a shooter direction that prompts the ball to be shot in that direction
- an randomly generated block direction that prompts the goalie to dive/move in that direction
- when the block lines up with the shot, the shot is blocked, causing a lives to go down
- when the block does not line up with the shot, the goal is scored, causing score to go up

**Technical Components:**
- Variables
    - `shooterDirection` (*String*): The direction the player aims to shoot (`"LEFT"`, `"MIDDLE"`, `"RIGHT"`). Then they will choose (`SKIP`, `REGULAR`).
    - `blockDirection` (*String*): The direction the goalie will block (`"LEFT"`, `"MIDDLE"`, `"RIGHT"`).
- Methods
    - `selectShotDirections` (*direction: String*): Sets `shooterDirection` based on user input. Checks if shooterDirection is same as blockDirection (which is randomized here if not chosen by player 2). Updates necessary variables based on goal success.
    - `endRound`: Updates score or decrements lives based on the shot’s outcome and checks for game-over conditions.

**Simplifications:**
- For now, skipping shots is avoided, though can be implemented if there is enough time.

**Dependencies:**
- Depends on the initialization step- including lives, score, and object initialization.

### Shot Skipping
**Priority:** [P1]
**Implementation Timeline:** [Day 3]

**Core Requirements:**
- Implements a choice to shoot normally or to skip the shot
- An option for the goalie to block a skip shot
- The functionality for how shots are scored/saved is unchanged

**Technical Components:**
 - `shooterSkip` (*boolean*): After shooter chooses direction, they will choose (`SKIP`, `REGULAR`).
 - `blockerSkip` (*boolean*): After blocker chooses direction, they will choose (`SKIP`, `REGULAR`).
 - UPDATES `selectShotDirections` (*direction: String*): now checks skip variables.

**Dependencies:**
- Depends on the initial shot step completed during day 2.


### Start/End screens
**Priority:** [P1]
**Implementation Timeline:** [Day 3]

**Core Requirements:**
- Start and end screen, including options to replay and start the game

**Technical Components:**
- Variables
    - `welcomeMessage` (*String*): Text displayed on the start screen.
- Methods
    - `displayEndScreen`: Shows the game-over screen with replay options.

**Simplifications:**
- Not including multiplayer options.

**Dependencies:**
- Depends on the init done in day 1.

### Post-Game Statistics
**Priority:** [P2]
**Implementation Timeline:** [Day 4]

**Core Requirements:**
- Functionality to track rounds played

**Technical Components:**
- Variables
    - `roundsPlayed` (*int*): Tracks rounds played, which can be used for post-game statistics.
- Methods
    - UPDATE `resetGame`: now updates statistics

**Dependencies:**
- Depends on init done in day 1


### Multiplayer
**Priority:** [P2]
**Implementation Timeline:** [Day 4]

**Core Requirements:**
- Ability for a second user to play goalie
- The multiplayer functionality is across the same device, with each user using different buttons to prompt action

**Technical Components:**
- Variables
    - `selectedPlayer`: The player that is currently highlighted on the start screen. `P2`
    - `selectedMultiplayer`: The player selected by player 2 (if multiplayer toggled) `P2`

- Methods
    - UPDATE `selectShotDirections` (*direction: String*): This will now allow for multiplayer functionality
    - `changeSelectedPlayer`: Switches the highlighted player on the start screen. `P2`
    - `toggleMultiplayer`: Toggles multiplayer, if selected, player two can choose a different character `P2`

**Dependencies:**
- Depends on init, shooting mechanics, and start screen


### 3D Features
**Priority:** [P2]
**Implementation Timeline:** [Day 5]

**Core Requirements:**
- Transition all of the objects to 3D assets using the Babylon engine

**Technical Components:**
- UPDATE - `initializeGame`: Now initializes 3D objects and background

**Dependencies:**
- Relies on completion of initialization