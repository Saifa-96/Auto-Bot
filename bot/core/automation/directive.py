from typing import Callable
from numpy import ndarray
from .controller import Controller
from .detector import Detector
from ..declaration import Template


class Directive:
    def __init__(
        self,
        offset: tuple[float, float],
        threshold: float,
        get_frame: Callable[[], ndarray],
    ):
        self._get_frame = get_frame
        self.controller = Controller(offset=offset)
        self.detector = Detector(threshold)

    def _is_matched(self, areas, index) -> bool:
        matchedNum = len(areas)

        # didn't match anything
        if matchedNum == 0:
            return False

        # Is the index included the range of areas
        if matchedNum - 1 < index:
            return False

        return True

    def is_exist(self, templates: list[Template]):
        frame = self._get_frame()
        for t in templates:
            area = self.detector.match(frame, t.image, t.threshold)
            if len(area) > 0:
                return True
        return False

    def single_click(self, template: Template) -> bool:
        frame = self._get_frame()
        index = template.index or 0
        areas = self.detector.match(frame, template.image, template.threshold)

        if self._is_matched(areas, index) is False:
            return False

        area = areas[index]
        self.controller.click_in_area(area)
        return True

    def region_click(self, region: Template, target: Template) -> bool:
        frame = self._get_frame()
        regionAreas = self.detector.match(frame, region.image, region.threshold)
        region_index = region.index if region.index else 0
        if self._is_matched(regionAreas, region_index) is False:
            return False

        targetAreas = self.detector.match(region.image, target.image, target.threshold)
        target_index = target.index if target.index else 0
        if self._is_matched(targetAreas, target_index) is False:
            return False

        regionArea = regionAreas[region_index]
        targetArea = targetAreas[target_index]
        area = (
            regionArea[0] + targetArea[0],
            regionArea[1] + targetArea[1],
            targetArea[2],
            targetArea[3],
        )
        self.controller.click_in_area(area)
        return True
