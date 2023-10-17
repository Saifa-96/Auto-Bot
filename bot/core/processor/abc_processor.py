from abc import ABC, abstractmethod
from core.automation import Directive
from core.declaration import Task


class Processor(ABC):
    @abstractmethod
    def __init__(self, task: Task):
        pass

    @abstractmethod
    def perform(self, directive: Directive) -> bool:
        pass

    @abstractmethod
    def get_next_processor_id(self) -> str:
        pass
