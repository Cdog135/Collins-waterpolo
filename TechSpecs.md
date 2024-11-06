Tech Stack:
I have chosen to use the Babylon framework for this particular game. Babylon has everything needed to create the complex 3D visuals and animations in this game. What caught my eye about Babylon is the water physics showcased on its main page, which we will have to implement in this game, as well as its focus on 3D models and animations. The one downside may be that Babylon is difficult to learn, but this game will not require a lot of code due to its simple nature, so it should be alright.

Contenders: aframe.io, PlayCanvas, Oimo.js
aframe.io: This framework seems too focused on vr and ar functionality, so it is not suited well to the needs of this waterpolo game. Its 3D graphics also seemed too simplistic for the needs of this game
PlayCanvas: This one is probably the second best option, but it is more focused on performance than quality of animation and model, which is why I am choosing Babylon over it.
Oimo.js: This one is just a physics engine, so there would need to be another package downloaded to handle the 3D models and animations, and I want to limit the amount of downloads for this simple project.

Architecture:
1. GameManager
Manages game state, score, and player lives, and oversees game progression.

Variables
score: int - Tracks the player’s score (goals made).
lives: int - Number of lives (remaining missed shots allowed).
isGameOver: boolean - Indicates if the game is over.
player: Player - Instance of the chosen player.
goalie: Goalie - Instance of the goalie.
roundsPlayed: int - Tracks rounds played within a game (which can be used for statistics at the end of the game)
Methods
initializeGame
Behavior: Sets initial score and lives, instantiates player and goalie objects, and initializes first round.
startRound
Behavior: Resets player and goalie states and prepares for a new shot attempt.
endRound
Behavior: Updates score or decrements lives based on whether the shot was a goal. Checks for game over conditions.
resetGame
Behavior: Resets all game variables to initial state for replay.
updateScore
Input: int points - Points awarded per goal.
Behavior: Adds points to score after a successful goal.
checkGameOver
Output: boolean - Returns true if lives have reached zero.
2. Player
Handles the player character’s interactions and movement, including shot direction selection.

Variables
position: Point - Player’s position in the pool.
selectedDirection: String - The direction the player aims to shoot (“LEFT”, “MIDDLE”, “RIGHT”).
Methods
selectShotDirection
Input: String direction
Behavior: Sets selectedDirection based on user input.
takeShot
Output: boolean - Returns true if the shot is not blocked.
Behavior: Attempts a shot, then checks Goalie.checkBlock to determine the result.
3. Goalie
Represents the goalie, including random blocking choices or potential skill-based mechanisms.

Variables
position: Point - Goalie’s position in the goal area.
blockDirection: String - Direction the goalie will attempt to block (“LEFT”, “MIDDLE”, “RIGHT”).
Methods
chooseBlockDirection
Behavior: Randomly selects a direction to block, with possible logic for pattern recognition if skill-based.
checkBlock
Input: String shotDirection - The direction of the player’s shot.
Output: boolean - Returns true if the goalie successfully blocks.
Behavior: Compares blockDirection with shotDirection to determine if the shot is blocked.
4. UIManager
Handles game menus, start screen, score display, and end game/replay prompts.

Variables
welcomeMessage: String - Text displayed on start screen.
scoreDisplay: HTMLElement - Displays the current score.
livesDisplay: HTMLElement - Displays remaining lives.
Methods
displayStartScreen
Behavior: Shows the welcome message and player selection options.
updateScoreDisplay
Behavior: Refreshes the score display after each round.
displayEndScreen
Behavior: Shows game over screen with replay option.