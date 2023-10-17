from dataclasses import dataclass
from dataclasses_json import DataClassJsonMixin
from ..declaration import Task, Template
from ..automation import Directive
from .abc_processor import Processor


@dataclass
class RegionClickSettings(DataClassJsonMixin):
    region: Template
    target: Template


class RegionClickProcessor(Processor):
    def __init__(self, task: Task):
        self.settings = RegionClickSettings.from_dict(task.data)
        self.next_step_id = (
            None if len(task.next_steps) == 0 else task.next_steps[0].next_task_id
        )

    def perform(self, directive: Directive):
        result = directive.region_click(
            region=self.settings.region,
            target=self.settings.target,
        )
        return result

    def get_next_processor_id(self):
        return self.next_step_id
