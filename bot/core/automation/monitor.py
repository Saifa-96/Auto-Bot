from core.declaration import Region
from platform import system
from mss import mss
from numpy import array
from cv2 import resize, cvtColor, COLOR_BGRA2BGR
from ctypes import windll

class Monitor:
    def __init__(self, area: Region):
        self._scale_factor = 1 if system() == 'Darwin' else windll.shcore.GetScaleFactorForDevice(0) / 100
        self.monitor_area = self._init_monitor_area(area)
        self._region = area
    
    def _init_monitor_area(self, area: Region):
        return {
        "left": int(area.x * self._scale_factor),
        "top": int(area.y * self._scale_factor),
        "width": int(area.w * self._scale_factor),
        "height": int(area.h * self._scale_factor),
        }
    
    def _cvt_sct_2_frame(self, grabbed_img):
        img_np = array(grabbed_img)
        img_np_3_channel = cvtColor(img_np, COLOR_BGRA2BGR)

        width = self._region.w
        height = self._region.h

        dsize = (int(width), int(height))
        scaled_frame = resize(img_np_3_channel, dsize)
        return scaled_frame

    
    def start(self, callback):
        with mss() as sct:
            def get_frame():
                img = sct.grab(self.monitor_area)
                return self._cvt_sct_2_frame(img)
            callback(get_frame)
    
    def get_frame(self):
        with mss() as sct:
            img = sct.grab(self.monitor_area)
            return self._cvt_sct_2_frame(img)