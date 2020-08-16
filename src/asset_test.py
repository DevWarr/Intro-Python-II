import sys
from assets.guardian_poses import *
from utils.colors import color

pose_enum = ['stand', 'correct', 'incorrect']

def print_pose(int):
    pose = pose_enum[int]
    print("\n\nDIVID GUARDIAN:\n")
    print(color(divid_guardian()[pose]))
    print("\n\nMULTIP GUARDIAN \n")
    print(color(multip_guardian()[pose]))
    print("\n\nSQUARE GUARDIAN\n")
    print(color(square_guardian()[pose]))
    print("\n\nRADICAL GUARDIAN\n")
    print(color(radical_guardian()[pose]))
    print("\n\nARTIFACT GUARDIAN\n")
    print(color(artifact_guardian()[pose]))

def get_pose(args):
    if len(args) == 2 and args[1].isdigit and 0 <= int(args[1]) and int(args[1]) < 3:
        return int(args[1])
    else:
        return None

if __name__ == "__main__":
    pose = get_pose(sys.argv)
    if pose is None:
        print("Please provide a proper pose:")
        print("    0 -> standing pose")
        print("    1 -> 'correct' pose")
        print("    2 -> 'incorrect' pose")
        exit()
    print_pose(pose)