import {
  FC,
  ReactEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { styled } from "styled-components";
import { Button, Card, Flex, Text, Slider, Box } from "@radix-ui/themes";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { ImageData, TemplateItem } from "../../../core";
import { useImages } from "../../../store";
import { ImageShowcase } from "../../ImageShowcase";
import { ScreenshotButton } from "../../ScreenshotButton";

interface TemplateInputProps {
  value: TemplateItem;
  onChange: (v: TemplateItem) => void;
}

export const TemplateInput: FC<TemplateInputProps> = (props) => {
  const { value, onChange } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onValueChange = useCallback<(v: number) => void>(
    debounce((v: number) => {
      onChange({ imageId: value.imageId, threshold: v });
    }, 150),
    [value, onChange],
  );

  const onDelete = useCallback(() => {
    onChange({ imageId: null });
  }, [onChange]);

  if (!value.imageId) {
    return (
      <Box my="2">
        <ScreenshotButton
          onAddImage={(imageData) => onChange({ imageId: imageData.id })}
        />
      </Box>
    );
  }

  return (
    <ImageCard
      data={value}
      onThresholdChange={onValueChange}
      onDelete={onDelete}
    />
  );
};

interface TemplatesInputProps {
  value: TemplateItem[];
  onChange: (v: TemplateItem[]) => void;
}
export const TemplatesInput: FC<TemplatesInputProps> = (props) => {
  const [index, setIndex] = useState<number | null>(null);
  const { value, onChange } = props;

  const addedImage = useCallback(
    (imageData: ImageData) => {
      const { id } = imageData;
      onChange([...value, { imageId: id }]);
    },
    [onChange, value],
  );

  const onThresholdChange = useCallback(
    (index: number, v: number) => {
      const newValue = [...value];
      newValue[index] = { ...value[index], threshold: v };
      onChange(newValue);
    },
    [onChange, value],
  );

  const onDelete = useCallback(
    (index: number) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
      setIndex(null);
    },
    [onChange, value],
  );

  // const { imageURL: sources } = useImageURL(value.map((v) => v.imageId));
  const { images } = useImages();
  const sources = useMemo(() => {
    return value.map(({ imageId }) => {
      const img = images.find((i) => i.id === imageId);
      if (!img) {
        console.warn("Don't find the image URL");
        return "";
      }
      return img.detail;
    });
  }, [images, value]);

  return (
    <Flex direction="column">
      <Box my="2">
        <ScreenshotButton onAddImage={addedImage} />
      </Box>
      <ImageShowcase sources={sources} index={index} onIndexChange={setIndex} />
      {index !== null && (
        <ImageCard
          key={value[index].imageId}
          data={value[index]}
          onThresholdChange={(v) => onThresholdChange(index, v)}
          onDelete={() => onDelete(index)}
        />
      )}
    </Flex>
  );
};

const Image = styled.img`
  object-fit: contain;
  width: 70px;
  height: 70px;
  border: 1px solid #ccc;
  vertical-align: top;
  border-radius: 5px;
`;

interface ImageCardProps {
  data: TemplateItem;
  onThresholdChange: (v: number) => void;
  onDelete: () => void;
}

const ImageCard: FC<ImageCardProps> = (props) => {
  const {
    data: { imageId, threshold = 0.7 },
    onThresholdChange,
    onDelete,
  } = props;

  // const { imageURL } = useImageURL(imageId);
  const { images } = useImages();
  const imageURL = images.find((i) => i.id === imageId)?.detail ?? "";
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSizeStr, setImgSizeStr] = useState<string>("loading...");

  const handleImgLoaded = useCallback<ReactEventHandler>(() => {
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      setImgSizeStr(`${naturalWidth} * ${naturalHeight}`);
    }
  }, []);

  const onDetect = useCallback(async () => {
    const result = await window.monitor.isShow();
    if (result) {
      window.monitor.matchTemplate(imageURL);
    } else {
      toast.warning(
        "Please, open the monitor before detecting the target template.",
      );
    }
  }, [imageURL]);

  const onValueChange = useCallback(
    (v: number[]) => {
      onThresholdChange(v[0]);
    },
    [onThresholdChange],
  );

  return (
    <Card my="2">
      <Flex>
        <Image ref={imgRef} src={imageURL} onLoad={handleImgLoaded} />

        <Box ml="2" grow="1">
          <Text size="2">Size: {imgSizeStr}</Text>
          <div>
            <Text size="2">Threshold: {threshold}</Text>
            <Slider
              mt="2"
              max={0.9}
              min={0.1}
              step={0.01}
              defaultValue={[threshold]}
              onValueChange={onValueChange}
            />
          </div>
        </Box>
      </Flex>
      <Flex mt="2" gap="2" direction="row-reverse">
        <Button color="red" size="1" onClick={onDelete}>
          Delete
        </Button>
        <Button size="1" onClick={onDetect}>
          Detect
        </Button>
      </Flex>
    </Card>
  );
};
