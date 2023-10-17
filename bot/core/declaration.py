import numpy as np
from dataclasses import dataclass, field
from dataclasses_json import dataclass_json, config
from image_operator import image_operator


@dataclass
class Region:
    x: int
    y: int
    w: int
    h: int


@dataclass
class NextStep:
    id: str | None
    next_task_id: str


class TASK_TYPE:
    START = "START"
    REGION_CLICK = "REGION_CLICK"
    MATCH_CLICK = "MATCH_CLICK"
    LOOP = "LOOP"


@dataclass
class Task:
    id: str
    type: TASK_TYPE
    data: dict
    next_steps: list[NextStep]


def cvt_image_id_to_image_np(image_id: str):
    return image_operator.get_ndarray(image_id)


@dataclass_json
@dataclass
class Template:
    image: np.ndarray = field(
        metadata=config(
            field_name="imageId",
            decoder=cvt_image_id_to_image_np,
        )
    )
    threshold: float | None = None
    index: int | None = None
