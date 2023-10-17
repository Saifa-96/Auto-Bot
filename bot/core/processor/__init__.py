from .abc_processor import Processor
from .start_processor import StartProcessor
from .loop_processor import LoopProcessor
from .region_click_processor import RegionClickProcessor
from .match_click_processor import MatchClickProcessor
from ..declaration import TASK_TYPE


TASK_PROCESSORS: dict[TASK_TYPE, Processor] = {
    TASK_TYPE.START: StartProcessor,
    TASK_TYPE.REGION_CLICK: RegionClickProcessor,
    TASK_TYPE.LOOP: LoopProcessor,
    TASK_TYPE.MATCH_CLICK: MatchClickProcessor,
}
