import { atom, useAtom } from "jotai";
import { type Rectangle } from "electron";

const monitorVisibleAtom = atom<boolean>(false);

const monitorAreaAtom = atom<Rectangle>({
  x: 0,
  y: 0,
  width: 100,
  height: 200,
});
export default monitorAreaAtom;

export const useMonitor = () => {
  const [visible, setVisible] = useAtom(monitorVisibleAtom);
  const [area, setArea] = useAtom(monitorAreaAtom);

  const toggleVisible = (isShow?: boolean) => {
    setVisible((v) => {
      return isShow === undefined ? !v : isShow;
    });
  };

  return {
    visible,
    toggleVisible,
    area,
    setArea,
  };
};
