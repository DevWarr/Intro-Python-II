import { GameMap } from "./GameMap";
import { Shrine, Room } from "./Room";
import { MultipGuardian, DividGuardian, SquareGuardian, RadicalGuardian, ArtifactGuardian } from "./Guardians";

const gameMap = new GameMap();

test("All shrines are in the correct locations", () => {
  const multipShrineLocation = gameMap.map[0][0];
  const dividShrineLocation = gameMap.map[1][4];
  const squareShrineLocation = gameMap.map[2][2];
  const radicalShrineLocation = gameMap.map[3][1];
  const artifactShrineLocation = gameMap.map[4][3];

  expect(multipShrineLocation).toBeInstanceOf(Shrine);
  expect((multipShrineLocation as Shrine).guardian).toBeInstanceOf(MultipGuardian);
  expect(dividShrineLocation).toBeInstanceOf(Shrine);
  expect((dividShrineLocation as Shrine).guardian).toBeInstanceOf(DividGuardian);
  expect(squareShrineLocation).toBeInstanceOf(Shrine);
  expect((squareShrineLocation as Shrine).guardian).toBeInstanceOf(SquareGuardian);
  expect(radicalShrineLocation).toBeInstanceOf(Shrine);
  expect((radicalShrineLocation as Shrine).guardian).toBeInstanceOf(RadicalGuardian);
  expect(artifactShrineLocation).toBeInstanceOf(Shrine);
  expect((artifactShrineLocation as Shrine).guardian).toBeInstanceOf(ArtifactGuardian);
});

test("Entrance is the Entrance", () => {
  expect(gameMap.entrance).toBeInstanceOf(Room);
  expect(gameMap.entrance.name).toMatch(/entrance/i);
});
