import { useEffect, useRef, useState } from "react";
import { ImagePlus, RotateCcw, Trash2 } from "lucide-react";
import { resolveProfilePhotoUrl } from "../utils/profilePhoto";
import "./ProfilePhotoPicker.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const CROP_SIZE = 512;

export default function ProfilePhotoPicker({
  value = "",
  onChange,
  label = "Profile photo",
  company = false,
}) {
  const inputRef = useRef(null);
  const imageRef = useRef(null);
  const pointerRef = useRef(null);
  const [source, setSource] = useState(() => value ? resolveProfilePhotoUrl(value) : "");
  const [sourceIsLocal, setSourceIsLocal] = useState(false);
  const [imageSize, setImageSize] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const [isNewSelection, setIsNewSelection] = useState(false);

  useEffect(() => () => {
    if (sourceIsLocal) URL.revokeObjectURL(source);
  }, [source, sourceIsLocal]);

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Choose a JPG, JPEG, PNG or WEBP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Images must be 5 MB or smaller.");
      return;
    }

    if (sourceIsLocal) URL.revokeObjectURL(source);
    setSource(URL.createObjectURL(file));
    setSourceIsLocal(true);
    setImageSize(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setIsNewSelection(true);
    setError("");
  };

  const applyCrop = () => {
    const image = imageRef.current;
    if (!image || !imageSize) return;

    const baseScale = Math.max(
      CROP_SIZE / imageSize.width,
      CROP_SIZE / imageSize.height
    );
    const sourceWidth = CROP_SIZE / (baseScale * zoom);
    const sourceHeight = CROP_SIZE / (baseScale * zoom);
    const sourceX = Math.max(
      0,
      Math.min(
        imageSize.width - sourceWidth,
        (imageSize.width - sourceWidth) / 2 - offset.x / (baseScale * zoom)
      )
    );
    const sourceY = Math.max(
      0,
      Math.min(
        imageSize.height - sourceHeight,
        (imageSize.height - sourceHeight) / 2 - offset.y / (baseScale * zoom)
      )
    );

    const canvas = document.createElement("canvas");
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    const context = canvas.getContext("2d");
    if (!context) {
      setError("Image cropping is unavailable in this browser.");
      return;
    }

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      CROP_SIZE,
      CROP_SIZE
    );
    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Unable to crop this image. Please choose another.");
        return;
      }

      const croppedFile = new File(
        [blob],
        company ? "company-logo.jpg" : "profile-photo.jpg",
        { type: "image/jpeg" }
      );
      if (sourceIsLocal) URL.revokeObjectURL(source);
      const croppedPreview = URL.createObjectURL(croppedFile);
      setSource(croppedPreview);
      setSourceIsLocal(true);
      setImageSize({ width: CROP_SIZE, height: CROP_SIZE });
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setIsNewSelection(false);
      setError("");
      onChange(croppedFile);
    }, "image/jpeg", 0.92);
  };

  const removeImage = () => {
    if (sourceIsLocal) URL.revokeObjectURL(source);
    setSource("");
    setSourceIsLocal(false);
    setImageSize(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setIsNewSelection(true);
    setError("");
    onChange(null);
  };

  const onPointerDown = (event) => {
    if (!isNewSelection || !imageSize) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  };

  const onPointerMove = (event) => {
    if (!pointerRef.current || !imageSize) return;
    const scale = Math.max(
      CROP_SIZE / imageSize.width,
      CROP_SIZE / imageSize.height
    ) * zoom;
    const maxX = Math.max(0, (imageSize.width * scale - CROP_SIZE) / 2);
    const maxY = Math.max(0, (imageSize.height * scale - CROP_SIZE) / 2);
    setOffset({
      x: Math.max(-maxX, Math.min(maxX, pointerRef.current.offsetX + event.clientX - pointerRef.current.x)),
      y: Math.max(-maxY, Math.min(maxY, pointerRef.current.offsetY + event.clientY - pointerRef.current.y)),
    });
  };

  return (
    <div className="photo-picker">
      <label className="photo-picker-label">{label}</label>
      <div className={`photo-picker-frame ${company ? "photo-picker-company" : ""}`}>
        {source ? (
          <img
            ref={imageRef}
            className={`photo-picker-image ${isNewSelection ? "photo-picker-cropping" : ""}`}
            src={source}
            alt="Selected image preview"
            draggable="false"
            onLoad={(event) => setImageSize({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            })}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => { pointerRef.current = null; }}
            onPointerCancel={() => { pointerRef.current = null; }}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            }}
          />
        ) : (
          <span className="photo-picker-empty"><ImagePlus size={27} /></span>
        )}
      </div>
      <div className="photo-picker-actions">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={selectImage}
          aria-label={`Choose ${label.toLowerCase()}`}
        />
        <button type="button" className="photo-picker-button" onClick={() => inputRef.current?.click()}>
          <ImagePlus size={15} />{source ? "Change image" : "Choose image"}
        </button>
        {source && (
          <button type="button" className="photo-picker-button" onClick={removeImage}>
            <Trash2 size={15} />{!isNewSelection && value ? "Remove saved photo" : "Remove"}
          </button>
        )}
      </div>
      {isNewSelection && source && (
        <div className="photo-picker-crop-controls">
          <span>Drag to reposition</span>
          <label>
            Zoom
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </label>
          <button type="button" className="photo-picker-button" onClick={() => {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          }}>
            <RotateCcw size={14} />Reset
          </button>
          <button type="button" className="photo-picker-apply" disabled={!imageSize} onClick={applyCrop}>
            Use this crop
          </button>
        </div>
      )}
      <small className="photo-picker-help">JPG, JPEG, PNG or WEBP · Maximum 5 MB</small>
      {error && <small className="photo-picker-error" role="alert">{error}</small>}
    </div>
  );
}
