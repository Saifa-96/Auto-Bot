import sys
import json
from dataclasses import dataclass
from core.executor import Region


@dataclass
class Option:
    region: Region
    flow_id: str | None
    image_path: str | None
    config_path: str | None


def get_option():
    region = None
    image_path = None
    config_path = None
    flow_id = None

    for arg in sys.argv:
        if arg.startswith("--image="):
            image_path = arg.split("--image=")[1]
        elif arg.startswith("--area="):
            region_str = arg.split("--area=")[1]
            x, y, w, h = list(map(int, region_str.split(",")))
            region = Region(x=x, y=y, w=w, h=h)
        elif arg.startswith("--config="):
            config_path = arg.split("--config=")[1]
        elif arg.startswith("--flow="):
            flow_id = arg.split("--flow=")[1]

    return Option(
        region=region,
        image_path=image_path,
        config_path=config_path,
        flow_id=flow_id,
    )


def get_config_json(config_path: str):
    with open(config_path, "r") as file:
        data = json.load(file)
        return data
