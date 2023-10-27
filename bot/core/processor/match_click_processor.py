from dataclasses import dataclass
from dataclasses_json import DataClassJsonMixin
from ..declaration import Template, Task
from ..automation import Directive
from .abc_processor import Processor


@dataclass
class MatchClickSettings(DataClassJsonMixin):
    targets: list[Template]


class MatchClickProcessor(Processor):
    def __init__(self, task: Task):
        self.settings = MatchClickSettings.from_dict(task.data)
        self.next_step_id = (
            None if len(task.next_steps) == 0 else task.next_steps[0].next_task_id
        )

    def perform(self, directive: Directive) -> str:
        targets = self.settings.targets
        for target in targets:
            result = directive.single_click(target)
            print("match click processor: ", result)
            if result:
                return True
        return False

    def get_next_processor_id(self) -> str:
        return self.next_step_id
