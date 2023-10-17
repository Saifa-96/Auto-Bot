import base64
import numpy as np
import cv2


class ImageOperator:
    def __init__(self):
        self.image_dict: dict[str, str] = {}

    def set_image_dict(self, images: list):
        image_dict = {}
        for image in images:
            image_dict[image["id"]] = image["detail"]
        self.image_dict = image_dict

    def get_ndarray(self, image_id: str):
        base64_image = self.image_dict[image_id]
        image_data = base64.b64decode(base64_image.split(",")[1])
        image_array = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        return image


image_operator = ImageOperator()
