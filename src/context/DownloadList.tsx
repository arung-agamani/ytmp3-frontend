import React, { createContext } from "react";
import { DownloadCardProps, DownloadConvertEvent } from "../interfaces/Cards";

type JointVenture = DownloadCardProps & DownloadConvertEvent;
type InitialStateType = {
  downloads: JointVenture[];
};

export const DownloadListInitialState: InitialStateType = {
  downloads: [],
};

export const DownloadListReducer = (
  state: any,
  action: { type: string; data: JointVenture }
) => {
  if (action.type === "ADD_DOWNLOAD_LIST") {
    if (
      state.findIndex(
        (x: JointVenture) => x.downloadId === action.data.downloadId
      ) === -1
    )
      return state;
    else return [...state, action.data];
  } else return state;
};

export const AddDownloadList = (data: JointVenture) => ({
  type: "ADD_DOWNLOAD_LIST",
  data,
});

export const DownloadListContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
}>({
  state: DownloadListInitialState,
  dispatch: () => null,
});
export default DownloadListContext;
