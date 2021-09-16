import React from "react";
import { DownloadCardProps, DownloadConvertEvent } from "../interfaces/Cards";
import { BASE_URL } from "../consts";

function transformSize(size: number): string {
  if (size >= 1024 * 1024 * 1024) {
    return `${(size / 1024).toPrecision(2)} GB`;
  } else if (size >= 1024 * 1024) {
    return `${(size / 1024).toPrecision(2)} MB`;
  } else if (size >= 1024) {
    return `${(size / 1024).toPrecision(2)} kB`;
  } else return `${size} Bytes`;
}

function transformDuration(duration: number): string {
  let localDuration = duration;
  let hours = 0,
    minutes = 0,
    seconds = 0;
  if (localDuration > 3600) {
    hours = Math.floor(localDuration / 3600);
    localDuration = localDuration - hours * 3600;
  }
  if (localDuration > 60) {
    minutes = Math.floor(localDuration / 60);
    localDuration -= minutes * 60;
  }
  seconds = localDuration;
  return `${hours > 0 ? `${hours} hours ` : ""} ${
    minutes > 0 ? `${minutes} minutes ` : ""
  } ${seconds > 0 ? `${seconds} seconds ` : ""}`;
}

const DownloadCard: React.FC<DownloadCardProps & DownloadConvertEvent> = (
  props
) => {
  const downloadLink = () => {
    if (props.isConverting === 2 && props.isDownloading === 2)
      window.open(`${BASE_URL}/download/${props.downloadId}`);
  };
  return (
    <div className="flex flex-col text-left p-8 bg-blue-100 shadow-lg">
      <p className="text-3xl">{props.videoTitle}</p>
      {/* <p className="text-xl">Size: {transformSize(props.size)}</p> */}
      <p className="text-xl">Duration: {transformDuration(props.duration)}</p>
      <p className="text-xl">
        Download Status :
        {props.isDownloading === -1
          ? "Not Started"
          : props.isDownloading === 0
          ? "Started"
          : props.isDownloading === 1
          ? `Downloading : ${props.downloadProgress}`
          : props.isDownloading === 2
          ? "Done"
          : "What the fuk"}
      </p>
      <p className="text-xl">
        Conversion Status :
        {props.isConverting === -1
          ? "Not Started"
          : props.isConverting === 0
          ? "Started"
          : props.isConverting === 1
          ? `Converting : ${props.convertProgress}`
          : props.isConverting === 2
          ? "Done"
          : "What the fuk"}
      </p>
      <p
        className={`text-xl cursor-pointer ${
          props.isConverting === 2 && "text-blue-600"
        }`}
        onClick={downloadLink}
      >
        Download Here
      </p>
    </div>
  );
};

export default DownloadCard;
