from pynput import keyboard
from time import sleep
from typing import Callable
from core.declaration import Task, Region
from .automation import Directive, Monitor
from .processor import TASK_PROCESSORS, Processor
from .processor.loop_processor import LoopStack

# import tracemalloc


def cvt_tasks_to_processor_dict(tasks: list[Task]) -> dict[str, Processor]:
    processor_dict = {}
    for task in tasks:
        processor_dict[task.id] = TASK_PROCESSORS[task.type](task)
    return processor_dict


class AutoGuiExecutor:
    def __init__(self, tasks: list[Task], region: Region):
        self.is_running = False
        self._delay = 0.3
        self.region = region
        self.processor_dict = cvt_tasks_to_processor_dict(tasks)
        self.monitor = Monitor(region)

    def startswith(self, task_id: str):
        print("start with: ", task_id)
        self._listen_exit_btn()

        self.is_running = True
        self._exec(task_id)
        self.is_running = False

    def stop(self):
        self.is_running = False

    def _listen_exit_btn(self):
        def on_key_press(key: keyboard.Key | keyboard.KeyCode):
            if key == keyboard.Key.f1:
                self.stop()
                self.listener.stop()
                print("turn off auto bot")

        self.listener = keyboard.Listener(on_press=on_key_press)
        self.listener.start()

    def _exec(self, task_id: str):
        def execute_flow(get_frame):
            # tracemalloc.start()
            directive = Directive(
                get_frame=get_frame,
                offset=(
                    self.monitor.monitor_area["left"],
                    self.monitor.monitor_area["top"],
                ),
                threshold=0.8,
            )

            current_processor = self.processor_dict[task_id]
            while current_processor and self.is_running:
                print("current processor: ", current_processor)
                self._loop(lambda: current_processor.perform(directive))
                next_processor_id = current_processor.get_next_processor_id()

                # current, peak = tracemalloc.get_traced_memory()
                # print(f"Current memory usage: {current / 10**6} MB")
                # print(f"Peak memory usage: {peak / 10**6} MB")
                if next_processor_id:
                    current_processor = self.processor_dict[next_processor_id]
                elif LoopStack.is_looping():
                    current_processor = LoopStack.get_loop_processor()
                else:
                    current_processor = None

        self.monitor.start(execute_flow)

    # def _exec(self, task_id: str):
    #     # tracemalloc.start()
    #     with mss() as sct:

    #         def get_frame():
    #             img = sct.grab(self._monitor)
    #             img_np = array(img)
    #             img_np_3_channel = cvtColor(img_np, COLOR_BGRA2BGR)
    #             scaled_frame = resize(
    #                 img_np_3_channel,
    #                 (self.region.w, self.region.h),
    #             )
    #             return scaled_frame

    #         directive = Directive(
    #             get_frame=get_frame,
    #             offset=(self._monitor["left"], self._monitor["top"]),
    #             threshold=0.8,
    #         )

    #         current_processor = self.processor_dict[task_id]
    #         while current_processor and self.is_running:
    #             print("current processor: ", current_processor)
    #             self._loop(lambda: current_processor.perform(directive))
    #             next_processor_id = current_processor.get_next_processor_id()

    #             # current, peak = tracemalloc.get_traced_memory()
    #             # print(f"Current memory usage: {current / 10**6} MB")
    #             # print(f"Peak memory usage: {peak / 10**6} MB")
    #             if next_processor_id:
    #                 current_processor = self.processor_dict[next_processor_id]
    #             elif LoopStack.is_looping():
    #                 current_processor = LoopStack.get_loop_processor()
    #             else:
    #                 current_processor = None

    def _loop(self, callback: Callable[[], bool]):
        while self.is_running:
            if callback():
                return
            sleep(self._delay)
