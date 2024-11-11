# Game Tech Specs

## Tech Stack

I have chosen to use the **Babylon** framework for this game. Babylon provides the necessary tools to create complex 3D visuals and animations required for this game. The water physics showcased on Babylon’s main page, which we need to implement for this game, as well as its focus on 3D models and animations, caught my attention. Although Babylon may be challenging to learn, the simple nature of this game means it will not require a lot of code, so it should be manageable.

### Contenders

- **Aframe.io**: Focuses heavily on VR and AR functionality, making it less suitable for this water polo game. Its 3D graphics also appear too simplistic for the game’s needs.
- **PlayCanvas**: The second-best option, but it prioritizes performance over animation and model quality, which is why Babylon is preferred.
- **Oimo.js**: A physics engine only, so another package would be required to handle 3D models and animations. To keep the project simple, I prefer minimizing external downloads.

---

## Architecture

### 1. GameManager

Manages game state, score, player lives, ad literally everything.

- **Variables**:
  - `score` (*int*): Tracks the player’s score (goals made).
  - `lives` (*int*): Number of lives (missed shots allowed).
  - `isGameOver` (*boolean*): Indicates if the game is over.
  - `roundsPlayed` (*int*): Tracks rounds played, which can be used for post-game statistics.
  - `selectedDirection` (*String*): The direction the player aims to shoot (`"LEFT"`, `"MIDDLE"`, `"RIGHT"`). Then they will choose (`SKIP`, `REGULAR`).
  - `blockDirection` (*String*): The direction the goalie will block (`"LEFT"`, `"MIDDLE"`, `"RIGHT"`). Then they will choose (`SKIP`, `REGULAR`).

- **Methods**:
  - `initializeGame`: Sets initial score and lives, instantiates player and goalie objects, and starts the first round.
  - `startRound`: Resets player and goalie states to prepare for a new shot attempt.
  - `endRound`: Updates score or decrements lives based on the shot’s outcome and checks for game-over conditions.
  - `resetGame`: Resets all game variables to initial state for replay.
  - `selectShotDirection` (*direction: String*): Sets `selectedDirection` based on user input. Checks if selectedDirection is same as blockDirection (which is randomized here if ot chosen by player 2). Updates necessary variables based on goal success.
  - `updateScore` (*points: int*): Adds points to score after a successful goal.
  - `checkGameOver`: Returns `true` if lives have reached zero.

---

### 2. UIManager

Manages game menus, start screen, score display, and end game/replay prompts.

- **Variables**:
  - `welcomeMessage` (*String*): Text displayed on the start screen.
  - `scoreDisplay` (*HTMLElement*): Shows the current score.
  - `livesDisplay` (*HTMLElement*): Shows remaining lives.
  - `selectedPlayer`: The player that is currently highlighted on the start screen.
  - `selectedMultiplayer`: The player selected by player 2 (if multiplayer toggled)

- **Methods**:
  - `displayStartScreen`: Shows the welcome message and player selection options.
  - `updateScoreDisplay`: Refreshes the score display after each round.
  - `changeSelectedPlayer`: Switches the highlighted player on the start screen.
  - `displayEndScreen`: Shows the game-over screen with replay options.
  - `toggleMultiplayer`: Toggles multiplayer, if selected, player two can choose a different character
