import sys
import cv2
import numpy as np
import mss
from core.automation import Detector
from receiver import get_option, get_config_json, Region
from adaptor import json_stringify, adapt_config
from image_operator import image_operator
from core.executor import AutoGuiExecutor


def get_frame(region: Region):
    with mss.mss() as sct:
        monitor = {
            "left": region.x,
            "top": region.y,
            "width": region.w,
            "height": region.h,
        }
        img = sct.grab(monitor)
        img_np = np.array(img)
        img_np_3_channel = cv2.cvtColor(img_np, cv2.COLOR_BGRA2BGR)
        scaled_frame = cv2.resize(img_np_3_channel, (region.w, region.h))
        return scaled_frame


def detect_target_image(image_path: str, region: Region):
    detector = Detector(threshold=0.75)
    img = cv2.imread(image_path)
    frame = get_frame(region)
    matched_area = detector.match(frame, img, threshold=0.85)
    matched_area_list = list(map(list, matched_area))
    return matched_area_list


def main():
    sys.stdout.flush()
    option = get_option()

    if option.image_path is not None:
        matched_area_list = detect_target_image(
            image_path=option.image_path,
            region=option.region,
        )
        json_str = json_stringify(matched_area_list)
        sys.stdout.write(json_str)
        return

    if option.config_path is not None:
        config_json = get_config_json(option.config_path)
        image_operator.set_image_dict(config_json["images"])
        tasks, start_task_id = adapt_config(config_json, option.flow_id)
        auto_gui_executor = AutoGuiExecutor(tasks=tasks, region=option.region)
        auto_gui_executor.startswith(start_task_id)


main()
