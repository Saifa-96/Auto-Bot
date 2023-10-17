from ..automation import Directive
from ..declaration import Task
from .abc_processor import Processor


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

    def perform(self, directive: Directive) -> bool:
        # TODO conditional logics
        result = False
        if result:
            LoopStack.loop_finished()
            # TODO loop out id
            # self.out_loop_id = ....
        elif LoopStack.is_pushed(self) is False:
            LoopStack.push(self)

        return True

    def get_next_processor_id(self) -> str:
        if self.out_loop_id:
            return self.out_loop_id
        return self.loop_start_id

    def get_loop_start_processor_id(self, task: Task):
        loop_start_processor_id = next(
            (step.next_task_id for step in task.next_steps if step.id is None), None
        )
        return loop_start_processor_id
