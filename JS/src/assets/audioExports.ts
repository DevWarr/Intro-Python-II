export const caveAdventure = new Audio("CaveAdventure.wav");
export const intro = new Audio("Intro.wav");
intro.ontimeupdate = function () {
  if (intro.currentTime > 8.45) {
    intro.currentTime = 0;
  }
};

export const correct = new Audio("Correct.wav");
export const damage = new Audio("Damage.wav");
export const incorrect = new Audio("Incorrect.wav");
export const menuFail = new Audio("MenuFail.wav");
export const menuSound = new Audio("MenuSound.wav");
export const monsterDeath = new Audio("MonsterDeath.wav");
export const monsterSpawn = new Audio("MonsterSpawn.wav");
export const runAway = new Audio("RunAway.wav");
