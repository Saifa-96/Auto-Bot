import cv2
import numpy as np


class Detector:
    def __init__(self, threshold):
        self.threshold = threshold

    def _calc_point_symbol(self, x, y):
        symbol_x = round(x ** (1 / 2))
        symbol_y = round(y ** (1 / 2))
        return (
            (symbol_x - 1, symbol_x, symbol_x + 1),
            (symbol_y - 1, symbol_y, symbol_y + 1),
        )

    def _is_existed_of_point(self, map_dict: dict, symbols_x, symbols_y):
        all_keys = map_dict.keys()
        symbol_list_y = map(lambda sy: (symbols_x[1], sy) in all_keys, symbols_y)
        if any(symbol_list_y):
            return True
        symbol_list_x = map(lambda sx: (sx, symbols_y[1]) in all_keys, symbols_x)
        if any(symbol_list_x):
            return True
        return False

    def _filter_points(self, point_list):
        point_map = {}
        for x, y in point_list:
            symbols_x, symbols_y = self._calc_point_symbol(x, y)
            is_existed = self._is_existed_of_point(point_map, symbols_x, symbols_y)
            if is_existed is False:
                point_map[(symbols_x[1], symbols_y[1])] = (x, y)
        return point_map.values()

    def match(self, frame: np.ndarray, template: np.ndarray, threshold=None):
        if threshold is None:
            threshold = self.threshold
        result = cv2.matchTemplate(frame, template, cv2.TM_CCOEFF_NORMED)
        locArr = np.where(result >= threshold)
        if len(locArr) == 0:
            return []

        reversedLocArr = locArr[::-1]
        zipLocArr = list(zip(*reversedLocArr))
        points = self._filter_points(zipLocArr)
        height, width, _ = template.shape
        return [
            (
                x,
                y,
                width,
                height,
            )
            for (x, y) in points
        ]
