# import platform
# import random
from random import uniform
from time import sleep
from platform import system

from pynput.mouse import Button, Controller as Mouse

# import pyperclip


class Controller:
    def __init__(self, offset=(0, 0)):
        self._scale_factor = self._get_scale_factor() 
        self.offset = offset
        self.mouse = Mouse()
    
    def _get_scale_factor(self):
        if system() == 'Darwin':
            return 1
        else:
            from ctypes import windll
            return windll.shcore.GetScaleFactorForDevice(0) / 100
            

    def point_click(self, x, y):
        offset_x, offset_y = self.offset

        print("click point", x, y)
        self.mouse.position = (offset_x + x * self._scale_factor, offset_y + y * self._scale_factor)
        sleep(0.2)
        self.mouse.click(Button.left)

    def click_in_area(self, area: tuple[float, float, float, float]):
        x, y, w, h = area
        random_x = uniform(x, x + w)
        random_y = uniform(y, y + h)
        self.point_click(random_x, random_y)

    # def input(self, text):
    #     pyautogui.typewrite(text, interval=0.05)

    # def copy_and_paste(self, text):
    #     pyperclip.copy(text)
    #     c = "command" if isMac else "ctrl"
    #     pyautogui.keyDown(c)
    #     pyautogui.press("v")
    #     pyautogui.keyUp(c)
