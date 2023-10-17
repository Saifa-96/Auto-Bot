from ..automation.directive import Directive
from ..declaration import Task
from .abc_processor import Processor


class StartProcessor(Processor):
    def __init__(self, task: Task):
        self.next_step = (
            None if len(task.next_steps) == 0 else task.next_steps[0].next_task_id
        )

    def perform(self, directive: Directive) -> str:
        return self.next_step

    def get_next_processor_id(self) -> str:
        return self.next_step
