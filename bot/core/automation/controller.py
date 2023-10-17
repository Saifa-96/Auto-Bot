import random

import platform
import pyautogui
import pyperclip

system = platform.system()
isMac = system == "Darwin"


class Controller:
    def __init__(self, offset=(0, 0)):
        self.offset = offset

    def point_click(self, x, y):
        offset_x, offset_y = self.offset
        pyautogui.moveTo(x + offset_x, y + offset_y, duration=0.1)
        print("click point", x + offset_x, y + offset_x)
        pyautogui.click()

    def click_in_area(self, area: tuple[float, float, float, float]):
        x, y, w, h = area
        random_x = random.uniform(x, x + w)
        random_y = random.uniform(y, y + h)
        self.point_click(random_x, random_y)

    def input(self, text):
        pyautogui.typewrite(text, interval=0.05)

    def copy_and_paste(self, text):
        pyperclip.copy(text)
        c = "command" if isMac else "ctrl"
        pyautogui.keyDown(c)
        pyautogui.press("v")
        pyautogui.keyUp(c)
