export const caveAdventure = new Audio("/assets/WAV/CaveAdventure.wav");
export const intro = new Audio("/assets/WAV/Intro.wav");
intro.ontimeupdate = function () {
  if (intro.currentTime > 8.45) {
    intro.currentTime = 0;
  }
};

export const correct = new Audio("/assets/WAV/Correct.wav");
export const damage = new Audio("/assets/WAV/Damage.wav");
export const incorrect = new Audio("/assets/WAV/Incorrect.wav");
export const menuFail = new Audio("/assets/WAV/MenuFail.wav");
export const menuSound = new Audio("/assets/WAV/MenuSound.wav");
export const monsterDeath = new Audio("/assets/WAV/MonsterDeath.wav");
export const monsterSpawn = new Audio("/assets/WAV/MonsterSpawn.wav");
export const runAway = new Audio("/assets/WAV/RunAway.wav");
