from json import load
from dataclasses import dataclass
from core.executor import Region
from argparse import ArgumentParser


@dataclass
class Option:
    region: Region
    flow_id: str | None
    image_path: str | None
    config_path: str | None


def get_option():
    argparser = ArgumentParser(description='turning on auto gui bot.')

    argparser.add_argument('--image', type=str, help='being used for matching area on the monitor.')
    argparser.add_argument('--flow', type=str, help='being used for starting which flow.')
    argparser.add_argument('--config', type=str, help='being used for getting config detail.')
    argparser.add_argument('--area', type=str, help='being used as the monitor area.')
    args = argparser.parse_args()
    # print('args: ', args)

    x, y, w, h = list(map(int, args.area.split(",")))
    region = Region(x=x, y=y, w=w, h=h)

    return Option(
        region,
        image_path=args.image,
        config_path=args.config,
        flow_id=args.flow,
    )



def get_config_json(config_path: str):
    with open(config_path, "r") as file:
        data = load(file)
        return data
