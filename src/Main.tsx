import React, { useState, useEffect, useRef, useReducer } from "react";
import io, { Socket } from "socket.io-client";
import { BASE_URL } from "./consts";

// import {
//   DownloadListReducer,
//   DownloadListInitialState,
//   AddDownloadList,
// } from "./context/DownloadList";
import { DownloadCardProps, DownloadConvertEvent } from "./interfaces/Cards";
import DownloadCard from "./components/DownloadCard";

type JointVenture = DownloadCardProps & DownloadConvertEvent;

const centralStore: JointVenture[] = [];

const Main = () => {
  // const [state, dispatch] = useReducer(
  //   DownloadListReducer,
  //   DownloadListInitialState
  // );

  const [id, setId] = useState("");
  const [downloadedList, setDownloadedList] = useState<JointVenture[]>([]);
  const [socketEventStatus, setSocketEventStatus] = useState("Initializing");
  const [socket, setSocket] = useState<Socket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendRequest = () => {
    if (inputRef.current?.value && socket) {
      socket.emit("request_link", {
        link: inputRef.current.value,
        clientId: id,
      });
      setSocketEventStatus("Sending request to server");
    }
  };

  // const addList = (data: JointVenture) => {
  //   dispatch(AddDownloadList(data));
  // };

  useEffect(() => {
    const localClientId = localStorage.getItem("clientid");
    setId(localClientId || "");
    const socket = io(`${BASE_URL}/ytdl`, {
      path: "/ws",
      extraHeaders: {
        clientId: localClientId || id,
      },
    });
    socket.on("connect", () => {
      setSocketEventStatus("Connected to the server");
    });

    socket.on("handshake_id", (data) => {
      setId(data.clientId);
      localStorage.setItem("clientid", data.clientId);
      setSocketEventStatus("Received client id from the server");
    });

    socket.on("request_link_accepted", (data) => {
      setSocketEventStatus(data.message);
    });

    socket.on("request_link_rejected", (data) => {
      setSocketEventStatus(data.message);
    });

    socket.on("request_download_info", (data) => {
      const localData = {
        downloadId: data.downloadId,
        videoTitle: data.title,
        videoLink: data.link,
        duration: data.length,
        size: -1,
        createdAt: new Date(),
        remainingAge: new Date(Date.now() + 3600 * 2),
        isDownloading: 0,
        downloadProgress: 0,
        isConverting: -1,
        convertProgress: 0,
      };
      if (
        downloadedList.findIndex((x) => x.downloadId === data.downloadId) === -1
      ) {
        centralStore.push(localData);
        setDownloadedList(centralStore);
      }
      // addList(localData);
    });
    socket.on("request_download_progress", (data) => {
      // setSocketEventStatus(
      //   `Downloading "${data.title}" ${data.current}/${data.total}`
      // );
      (() => {
        const idx = centralStore.findIndex(
          (x) => x.downloadId === data.downloadId
        );
        if (idx !== -1) {
          centralStore[idx].isDownloading = 1;
          centralStore[idx].downloadProgress = data.current / data.total;
        }
        setDownloadedList(centralStore);
      })();
    });

    socket.on("request_download_finish", (data) => {
      setSocketEventStatus(data.message);
      // const newArray = [...downloadedList];
      const idx = centralStore.findIndex(
        (x) => x.downloadId === data.downloadId
      );
      if (idx !== -1) centralStore[idx].isDownloading = 2;
      setDownloadedList(centralStore);
    });

    socket.on("request_convert_start", (data) => {
      // setSocketEventStatus("Conversion started");
      // const newArray = [...downloadedList];
      const idx = centralStore.findIndex(
        (x) => x.downloadId === data.downloadId
      );
      if (idx !== -1) centralStore[idx].isConverting = 0;
      setDownloadedList(centralStore);
    });

    socket.on("request_convert_progress", (data) => {
      setSocketEventStatus("Conversion in progress");
      // const newArray = [...downloadedList];
      const idx = centralStore.findIndex(
        (x) => x.downloadId === data.downloadId
      );
      if (idx !== -1) {
        centralStore[idx].isConverting = 1;
        centralStore[idx].convertProgress = data.progress;
      }
      setDownloadedList(centralStore);
    });

    socket.on("request_convert_finish", (data) => {
      // const newArray = [...downloadedList];
      const idx = centralStore.findIndex(
        (x) => x.downloadId === data.downloadId
      );
      if (idx !== -1) centralStore[idx].isConverting = 2;
      setTimeout(() => {
        setDownloadedList(centralStore);
      }, 1000);
      setSocketEventStatus("Conversion complete");
    });

    setSocket(socket);
  }, []);
  return (
    <div className="flex flex-col mx-auto justify-center text-center container max-w-5xl">
      <p className="text-4xl uppercase">Howling YTDL</p>
      <p className="text-lg">A Simple Youtube to MP3 Downloader</p>
      <div className="flex flex-col mt-8 mx-auto text-center">
        <p className="text-2xl">Status: {socketEventStatus}</p>
      </div>
      <div className="flex mt-8 mx-auto mb-4 text-left">
        <p className="text-2xl">Your ID: {id === "" ? "Not set" : id}</p>
      </div>
      <div className="flex mx-auto my-4 border w-full border-blue-400">
        <input
          className="w-full py-2 pl-4 flex-grow"
          type="text"
          name="ytLink"
          id="ytLink"
          placeholder="Youtube Link Here"
          ref={inputRef}
        />
        <button
          onClick={sendRequest}
          className="border px-4 bg-blue-500 text-white"
        >
          Send
        </button>
      </div>
      <div className="flex flex-col mx-auto w-full">
        {downloadedList.map((cardData) => {
          return <DownloadCard key={cardData.downloadId} {...cardData} />;
        })}
      </div>
    </div>
  );
};

export default Main;
