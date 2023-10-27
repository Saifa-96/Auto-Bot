from dataclasses import dataclass, field

from dataclasses_json import DataClassJsonMixin, config

from ..automation import Directive
from ..declaration import Task, Template
from .abc_processor import Processor


@dataclass
class Conditional(DataClassJsonMixin):
    id: str
    name: str
    type: str
    targets: list[Template]


@dataclass
class OrConditional(DataClassJsonMixin):
    id: str
    name: str
    conditionals: list[Conditional]


def parse_conditionals_dict(conditionals_list: list[dict]):
    conditionals = []
    for item in conditionals_list:
        if "conditionals" in item:
            conditionals.append(OrConditional.from_dict(item))
        else:
            conditionals.append(Conditional.from_dict(item))
    return conditionals


@dataclass
class LoopSettings(DataClassJsonMixin):
    conditionals: list[Conditional | OrConditional] = field(
        metadata=config(decoder=parse_conditionals_dict)
    )


class LoopStack:
    _stack = []

    def push(processor):
        LoopStack._stack.append(processor)

    def is_looping():
        return len(LoopStack._stack) > 0

    def get_loop_processor():
        return LoopStack._stack[-1]

    def loop_finished():
        LoopStack._stack.pop()

    def is_pushed(processor):
        return processor in LoopStack._stack


class LoopProcessor(Processor):
    def __init__(self, task: Task):
        self.loop_start_id = self.get_loop_start_processor_id(task)
        self.out_loop_id = None
        self.settings = LoopSettings.from_dict(task.data)
        self.next_steps = task.next_steps
        # print(task.next_steps)

    def perform(self, directive: Directive) -> bool:
        result = self.check_conditionals(directive)
        if result:
            LoopStack.loop_finished()
        elif LoopStack.is_pushed(self) is False:
            LoopStack.push(self)

        return True

    def check_conditionals(self, directive: Directive):
        self.out_loop_id = None
        for c in self.settings.conditionals:
            result = False
            if hasattr(c, "conditionals"):
                # TODO or conditional logic
                pass
            else:
                result = directive.is_exist(c.targets)

            if result:
                for step in self.next_steps:
                    if step.id == c.id:
                        self.out_loop_id = step.next_task_id
                        return True
        return False

    def get_next_processor_id(self) -> str:
        if self.out_loop_id:
            return self.out_loop_id
        return self.loop_start_id

    def get_loop_start_processor_id(self, task: Task):
        loop_start_processor_id = next(
            (step.next_task_id for step in task.next_steps if step.id is None), None
        )
        return loop_start_processor_id
