import { atom, useAtom } from "jotai";
import { v4 as uuid } from "uuid";
import { ImageData } from "../core";

const imagesAtom = atom<ImageData[]>([]);
export default imagesAtom;

export const useImages = () => {
  const [images, setImages] = useAtom(imagesAtom);

  const addImage = (imageURL: string): ImageData => {
    const data = { id: uuid(), detail: imageURL };
    setImages((state) => [...state, data]);
    return data;
  };

  const removeImage = (imageId: string): void => {
    setImages((images) => {
      return images.filter((i) => i.id !== imageId);
    });
  };

  const getImageURL = (imageId: string): string => {
    const img = images.find((i) => i.id === imageId);
    if (!img) {
      console.warn("The image data is not found.");
      return "";
    }
    return img.detail;
  };

  return { images, addImage, removeImage, getImageURL };
};
