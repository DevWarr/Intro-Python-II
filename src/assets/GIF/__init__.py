import os
from PIL import Image

FILEPATH = os.path.dirname(__file__)

artifacts = ["divid", "multip", "square", "radical", "artifact"]
poses = ["stand", "correct", "incorrect"]

all_poses = {}

for name in artifacts:
  for pose in poses:
    file_name = os.path.join(FILEPATH, f"{name}_{pose}.gif")
    guardian_name = name.capitalize() + " Guardian"
    if guardian_name not in all_poses:
      all_poses[guardian_name] = {}
    all_poses[guardian_name][pose] = Image.open(file_name)

if __name__ == "__main__":
  print(all_poses)
