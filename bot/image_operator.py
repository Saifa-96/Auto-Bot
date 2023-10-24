from base64 import b64decode
from numpy import uint8, frombuffer, fromfile
from cv2 import imdecode, IMREAD_COLOR


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
        image_data = b64decode(base64_image.split(",")[1])
        image_array = frombuffer(image_data, uint8)
        image = imdecode(image_array, IMREAD_COLOR)
        return image
    
    """Read image, solve the problem that imread can not read Chinese paths"""
    def cv_imread(self, file_path: str):
        arr = fromfile(file_path, dtype=uint8)
        cv_img = imdecode(arr, -1)
        return cv_img


image_operator = ImageOperator()
