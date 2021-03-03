from enum import Enum


class Controls(Enum):
  SIMPLE       = 0
  ADVANCED     = 1
  BATTLE       = 2
  INTRO        = 3
  EMPTY        = 4

  def swap_controls(enum):
    if enum is Controls.SIMPLE:
      return Controls.ADVANCED
    else:
      return Controls.SIMPLE


control_text = [
    "~W[n] ~eNorth   ~W[s] ~eSouth   ~W[e] ~eEast   ~W[w] ~eWest   ~Y[o] ~eMore controls     ~R[q] ~eQuit",
    "~W[take ~e~c(item)~W]~e from room   ~W[drop ~e~c(item)~W]~e from inventory   ~Y[o]~e previous controls",
    "Type the ~Wanswer~e to the question, ~Wuse ~e~c(item)~e, or ~Wrun away~e!",
    "Once you're good to go, ~Wtype a player name~e to begin. Or, type ~W[q]~e to quit.",
    ""
]


def get_controls_text(enum):
  return control_text[enum.value]
