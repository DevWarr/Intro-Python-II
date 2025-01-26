import {
  intro,
  caveAdventure,
  correct,
  incorrect,
  damage,
  menuFail,
  menuSound,
  monsterDeath,
  monsterSpawn,
  runAway,
} from "../assets/WAV/audioExports";

export enum MusicTrackNumber {
  INTRO,
  CAVE_ADVENTURE,
}
const MUSIC_FILES: Record<MusicTrackNumber, HTMLAudioElement> = {
  [MusicTrackNumber.INTRO]: intro,
  [MusicTrackNumber.CAVE_ADVENTURE]: caveAdventure,
};

export enum SFXTrackNumber {
  CORRECT,
  INCORRECT,
  DAMAGE,
  MENU_FAIL,
  MENU_SOUND,
  MONSTER_DEATH,
  MONSTER_SPAWN,
  RUN_AWAY,
}

const SFX_FILES: Record<SFXTrackNumber, HTMLAudioElement> = {
  [SFXTrackNumber.CORRECT]: correct,
  [SFXTrackNumber.INCORRECT]: incorrect,
  [SFXTrackNumber.DAMAGE]: damage,
  [SFXTrackNumber.MENU_FAIL]: menuFail,
  [SFXTrackNumber.MENU_SOUND]: menuSound,
  [SFXTrackNumber.MONSTER_DEATH]: monsterDeath,
  [SFXTrackNumber.MONSTER_SPAWN]: monsterSpawn,
  [SFXTrackNumber.RUN_AWAY]: runAway,
};

export class AudioManager {
  private currentMusic: HTMLAudioElement | null = null;

  constructor() {}

  public playMusic(track: MusicTrackNumber) {
    console.log("Playing music");
    if (this.currentMusic !== null) {
      this.currentMusic.pause();
    }
    this.currentMusic = MUSIC_FILES[track];
    this.currentMusic.loop = true;
    this.currentMusic.volume = 0.7;
    this.currentMusic.currentTime = 0;
    this.currentMusic.play();
  }

  public stopMusic() {
    if (this.currentMusic !== null) {
      this.currentMusic.volume = 0;
      this.currentMusic.pause();
    }
  }

  public playSFX(track: SFXTrackNumber) {
    SFX_FILES[track].play();
  }
}
