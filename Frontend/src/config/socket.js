import socket from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectid) => {
  socketInstance = socket(import.meta.env.VITE_BASE_API_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectid, 
    },
  });

  return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
  socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
  console.log(eventName,"0000")
  socketInstance?.emit(eventName, data);
};
