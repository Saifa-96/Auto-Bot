# Auto-Gui-Bot

This Electron application is designed for educational research purposes. The front end is written using React (TypeScript), and the back end is written in Python. 

The aim is to allow users to use a workflow editor to design their own auto-GUI scripts, which can be executed by the executor built with OpenCV and Pynput. Since the application will directly control your mouse and keyboard when you run it, I recommend running it on a separate machine or when you don't need to use your computer.

# Feature
1. It can detect the area of given template image on the monitor window.
![detect](doc-assests/detect.gif)

2. After you have organized your workflow, It can follow the configuration of workflow to control the mouse and keyboard to perform the tasks.
![executing](doc-assests/execute.gif)

# Nodes
1. **Match Click Node**: Matches target templates for the mouse click operation.
2. **Region Click Node**: First, it will find the matched region template, then click the target template which will be found on the region template.
3. **Loop Node**: Acts as a looping entrance and is used for setting conditionals which control the loop's break point.


# Next TODO
- [ ] Wait Node: Wait for target templates to appear/disappear.
- [ ] Extend conditional break points.
- [ ] Add wheel and keyboard control functionality.
- [ ] Organize project structure (e.g., add Prettier and tests).