import React, { useState, useEffect, useRef } from "react";
import DownloadCard from "./components/DownloadCard";
import { DownloadCardProps } from "./interfaces/Cards";
import io, { Socket } from "socket.io-client";

let dummyCardsData: DownloadCardProps[] = [
  {
    downloadId: "testId",
    videoTitle: "Test Title",
    videoLink: "https://howlingmoon.dev",
    duration: 3662,
    size: 1024,
    createdAt: new Date(),
    remainingAge: new Date(Date.now() + 3600 * 2),
  },
];

const App: React.FC = () => {
  const [id, setId] = useState("");
  const [downloadedList, setDownloadedList] = useState<DownloadCardProps[]>([]);
  const [socketEventStatus, setSocketEventStatus] = useState("Initializing");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [displayMessageText, setDisplayMessageText] = useState("");
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

  useEffect(() => {
    const localClientId = localStorage.getItem("clientid");
    setId(localClientId || "");
    const socket = io("http://localhost:5000", {
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

    socket.on("request_download_progress", (data) => {
      setSocketEventStatus(
        `Downloading "${data.title}" ${data.current}/${data.total}`
      );
    });

    socket.on("request_download_finish", (data) => {
      setSocketEventStatus(data.message);
      if (
        downloadedList.findIndex((x) => x.downloadId === data.downloadId) === -1
      ) {
        const newArray = [
          ...downloadedList,
          {
            downloadId: data.downloadId,
            videoTitle: data.title,
            videoLink: data.link,
            duration: data.length,
            size: -1,
            createdAt: new Date(),
            remainingAge: new Date(Date.now() + 3600 * 2),
          },
        ];
        setDownloadedList(newArray);
      }
    });

    setSocket(socket);
  }, []);
  return (
    <div className="flex flex-col mx-auto justify-center text-center container max-w-5xl">
      <p className="text-4xl uppercase">Howling YTDL</p>
      <p className="text-lg">A Simple Youtube to MP3 Downloader</p>
      <div className="flex mt-8 mx-auto text-left">
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
          return <DownloadCard {...cardData} />;
        })}
      </div>
    </div>
  );
};

export default App;
