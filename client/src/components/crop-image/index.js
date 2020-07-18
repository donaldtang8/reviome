import React, { Fragment, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import getCroppedImg from './cropImage';

const CropBox = ({ classes, image, type, callback }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        callback
      );
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  return (
    <Fragment>
      <div className="crop__container">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={3 / 3}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="crop__controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.05}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(zoom)}
        />
      </div>
      <div className="crop__button">
        <Button
          className="btn__action btn__action--active"
          onClick={showCroppedImage}
          variant="contained"
        >
          Crop Image
        </Button>
      </div>
    </Fragment>
  );
};

CropBox.propTypes = {
  image: PropTypes.string.isRequired,
  type: PropTypes.string,
  callback: PropTypes.func.isRequired,
};

export default CropBox;
