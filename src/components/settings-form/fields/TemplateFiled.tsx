import { FC, ReactEventHandler, useCallback, useRef, useState } from "react";
import { styled } from "styled-components";
import { Button, Card, Flex, Text, Slider, Box } from "@radix-ui/themes";
import { debounce } from "lodash";
import { ImageData, TemplateItem } from "../../../core";
import { useAddImage, useImageURL } from "../../../store";

interface TemplateInputProps {
  value: TemplateItem;
  onChange: (v: TemplateItem) => void;
}

export const TemplateInput: FC<TemplateInputProps> = (props) => {
  const {
    value: { imageId, threshold = 0.7 },
    onChange,
  } = props;
  const { imageURL, addImage } = useImageURL(imageId);

  const takeScreenshot = useCallback(async () => {
    const imageURL = await window.screenshot.takeScreenshot();
    const { id } = addImage(imageURL);
    onChange({ imageId: id, threshold });
  }, [onChange]);

  const onValueChange = useCallback<(v: number[]) => void>(
    debounce((v: number[]) => {
      onChange({ imageId, threshold: v[0] });
    }, 150),
    [onChange]
  );

  const onDelete = useCallback(() => {
    onChange({ imageId: null });
  }, [onChange]);

  const onDetect = useCallback(() => {
    // window.screenshot.detectImage(imageURL!);
    window.monitor.matchTemplate(imageURL);
  }, [imageURL]);

  if (!imageURL) {
    return (
      <Box my="2">
        <Button onClick={takeScreenshot}>Screenshot</Button>
      </Box>
    );
  }

  return (
    <Card my="2">
      <Flex>
        <Image src={imageURL} />

        <Box ml="2" grow="1">
          <Text size="2">Threshold: {threshold}</Text>
          <Slider
            mt="2"
            max={0.9}
            min={0.1}
            step={0.01}
            defaultValue={[threshold]}
            onValueChange={onValueChange}
          />
        </Box>
      </Flex>
      <Flex mt="2" gap="2" direction="row-reverse">
        <Button color="red" onClick={onDelete}>
          Delete
        </Button>
        <Button onClick={onDetect}>Detect</Button>
      </Flex>
    </Card>
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
      console.log("image id:", id);
      onChange([...value, { imageId: id }]);
    },
    [value]
  );

  const onThresholdChange = useCallback(
    (index: number, v: number) => {
      const newValue = [...value];
      console.log("threshold changed:", value, newValue);
      newValue[index] = { ...value[index], threshold: v };
      onChange(newValue);
    },
    [value]
  );

  const onDelete = useCallback(
    (index: number) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
      setIndex(null);
    },
    [value]
  );

  const { imageURL: sources } = useImageURL(value.map((v) => v.imageId));

  return (
    <Flex direction="column">
      <ImageInput onAddImage={addedImage} />
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

interface ImageShowcaseProps {
  sources: string[];
  index: number | null;
  onIndexChange: (i: number) => void;
}

const ImageShowcase: FC<ImageShowcaseProps> = (props) => {
  const { sources, index, onIndexChange } = props;
  return (
    <Flex wrap="wrap" gap="2">
      {sources.map((src, i) => (
        <ImageShowcaseItem
          isSelected={i === index}
          key={src}
          src={src}
          onClick={() => onIndexChange(i)}
        />
      ))}
    </Flex>
  );
};

const ImageShowcaseItem: FC<{
  isSelected: boolean;
  src: string;
  onClick: () => void;
}> = ({ isSelected, src, onClick }) => {
  return (
    <Box
      style={{
        width: 60,
        height: 60,
        borderRadius: 5,
        ...(isSelected
          ? { border: "2px solid orange" }
          : { border: "2px solid #ccc" }),
      }}
      onClick={onClick}
    >
      <ImageItem src={src} />
    </Box>
  );
};

const ImageItem = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  vertical-align: top;
`;

interface ImageInput {
  onAddImage: (imageData: ImageData) => void;
}

const ImageInput: FC<ImageInput> = (props) => {
  const { onAddImage } = props;

  // const addImages = useAppSettings.use.addImage();
  const addImage = useAddImage();
  const takeScreenshot = useCallback(async () => {
    const imageURL = await window.screenshot.takeScreenshot();
    const imageData = addImage(imageURL);
    onAddImage(imageData);
  }, [onAddImage]);

  return (
    <Box my="2">
      <Button onClick={takeScreenshot}>Screenshot</Button>
    </Box>
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

  const { imageURL } = useImageURL(imageId);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSizeStr, setImgSizeStr] = useState<string>("loading...");

  const handleImgLoaded = useCallback<ReactEventHandler>((_event) => {
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      setImgSizeStr(`${naturalWidth} * ${naturalHeight}`);
    }
  }, []);

  const onDetect = useCallback(() => {
    // window.screenshot.detectImage(imageURL!);
    window.monitor.matchTemplate(imageURL);
  }, [imageURL]);

  const onValueChange = useCallback(
    (v: number[]) => {
      onThresholdChange(v[0]);
    },
    [onThresholdChange]
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
