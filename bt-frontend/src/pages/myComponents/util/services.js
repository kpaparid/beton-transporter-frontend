import { debounce } from "lodash";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { useAuth } from "../../../contexts/AuthContext";
import {
  chatActiveContact,
  chatContacts,
  chatMessages,
  chatUsers,
} from "../../../contexts/globalState";

export function useServices() {
  const { authenticatedFetch, currentUser } = useAuth();
  const API = process.env.REACT_APP_API_URL;
  const fetchAddToursSettings = useCallback(() => {
    const options = {
      url: API + "settings?id=add-tours",
    };
    return authenticatedFetch(options);
  }, [authenticatedFetch]);
  const postSettings = useCallback(
    (data) => {
      const options = {
        url: API + "/settings",
        body: JSON.stringify(data),
        method: "PUT",
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const registerUsers = useCallback(
    (data) => {
      const options = {
        url: API + "/users",
        body: JSON.stringify(data),
        method: "POST",
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const fetchTodaysTours = useCallback(
    (driver) => {
      const options = {
        url:
          API +
          "tours?driver=" +
          driver +
          "&date=" +
          moment().format("YYYY.MM.DD"),
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const fetchWorkHours = useCallback(
    (driver, from, to) => {
      const options = {
        url:
          API +
          "work-hours?size=500&driver=" +
          driver +
          "&date_gte=" +
          from +
          "&date_lte=" +
          to,
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const fetchUserWorkHours = useCallback(
    (from, to) => {
      return fetchWorkHours(currentUser.uid, from, to);
    },
    [fetchWorkHours, currentUser.uid]
  );
  const fetchTours = useCallback(
    (driver, page = 0) => {
      const options = {
        url:
          API +
          "tours?sort=date,desc&size=20&page=" +
          page +
          "&driver=" +
          driver,
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const fetchUserTours = useCallback(
    (page = 0) => {
      return fetchTours(currentUser.uid, page);
    },
    [fetchTours, currentUser.uid]
  );
  const fetchTodaysWorkHours = useCallback(
    (driver) => {
      const options = {
        url:
          API +
          "work-hours?driver=" +
          driver +
          "&date=" +
          moment().format("YYYY.MM.DD"),
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const fetchUpComingVacations = useCallback(
    (driver) => {
      const date = moment().format("YYYY.MM.DD");
      const options = {
        url:
          API +
          "absent-days?sort=dateFrom,desc&size=500&page=0&reason=vacations&driver=" +
          driver +
          "&dateFrom_gte=" +
          date,
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const fetchUserConfirmedVacations = useCallback(() => {
    const options = {
      url:
        API +
        "absent-days?driver=" +
        currentUser?.uid +
        "&size=500&verified=1&reason=vacations&sort=dateFrom,desc",
    };
    return authenticatedFetch(options);
  }, [authenticatedFetch, currentUser?.uid]);
  const postTour = useCallback(
    (data) => {
      const options = {
        url: API + "/tours",
        method: "PUT",
        body: JSON.stringify(data),
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const postWorkHour = useCallback(
    (data) => {
      const options = {
        url: API + "work-hours",
        method: "PUT",
        body: JSON.stringify(data),
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const postVacations = useCallback(
    (data) => {
      const options = {
        url: API + "absent-days",
        method: "PUT",
        body: JSON.stringify(data),
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const deleteTour = useCallback(
    (id) => {
      const options = {
        method: "DELETE",
        url: API + "tours/" + id,
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const deleteWorkHour = useCallback(
    (id) => {
      const options = {
        method: "DELETE",
        url: API + "work-hours/" + id,
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const deleteVacation = useCallback(
    (id) => {
      const options = {
        method: "DELETE",
        url: API + "absent-days/" + id,
      };
      return authenticatedFetch(options);
    },
    [authenticatedFetch]
  );
  const fetchUsers = useCallback(() => {
    const options = { url: API + "users/all" };
    return authenticatedFetch(options);
  }, [authenticatedFetch]);

  const fetchSettings = useCallback(() => {
    const options = {
      url: API + "settings",
    };
    return authenticatedFetch(options);
  }, [authenticatedFetch]);

  return {
    fetchSettings,
    currentUser,
    registerUsers,
    postTour,
    fetchTodaysTours,
    deleteTour,
    fetchTodaysWorkHours,
    postWorkHour,
    deleteWorkHour,
    fetchUpComingVacations,
    postVacations,
    deleteVacation,
    fetchUsers,
    fetchWorkHours,
    fetchUserWorkHours,
    fetchUserTours,
    fetchUserConfirmedVacations,
    fetchAddToursSettings,
    postSettings,
  };
}

var stompClient = null;
export function useChatServices(
  initialActiveContact,
  onNewMessage,
  initializeContactOnLoad
) {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { fetchUsers } = useServices();
  const { currentUser, findChatMessage, findChatMessages, findNewMessages } =
    useAuth();
  // const [contacts, setContacts] = useState();
  const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
  const [contacts, setContacts] = useRecoilState(chatContacts);
  const [users, setUsers] = useRecoilState(chatUsers);
  const [messages, setMessages] = useRecoilState(chatMessages);
  useEffect(() => {
    sessionStorage.removeItem("recoil-persist");
    initialActiveContact && setActiveContact(initialActiveContact);
    return () => {
      sessionStorage.removeItem("recoil-persist");
    };
  }, []);

  const updateContacts = useCallback(
    (users) => {
      const contactsIds = users
        ?.filter((c) => c.uid !== currentUser.uid)
        .map((c) => c.uid);
      return findNewMessages(currentUser.uid, contactsIds).then(({ data }) => {
        const newContacts = [...users]
          .filter((u) => u.uid !== currentUser.uid)
          .map((c) => {
            return {
              ...c,
              message: data[c.uid]?.message,
              unreadCount: data[c.uid]?.unreadCount,
            };
          })
          .sort((a, b) => {
            return a.message && !b.message
              ? -1
              : !a.message && b.message
              ? 1
              : a.message && b.message
              ? b.message.timestamp.localeCompare(a.message.timestamp)
              : 0;
          });
        setContacts(newContacts);
        return newContacts;
      });
    },
    [currentUser.uid, findNewMessages]
  );
  const loadContacts = useCallback(() => {
    const users = JSON.parse(
      sessionStorage.getItem("recoil-persist")
    )?.chatUsers;
    return users
      ? updateContacts(users)
      : fetchUsers().then(({ data }) => {
          setUsers(data);
          return updateContacts(data);
        });
  }, [currentUser.uid, fetchUsers, findNewMessages, updateContacts]);
  const handleOnConnected = useCallback(() => {
    loadContacts().then((contacts) => {
      if (initializeContactOnLoad) {
        const c = [...contacts]
          .filter((c) => c.uid !== currentUser.uid)
          .sort((a, b) =>
            moment(a?.message?.timestamp).isBefore(b?.message?.timestamp)
              ? 1
              : 0
          );
        setActiveContact(c[0]);
      }
    });
  }, [loadContacts, initializeContactOnLoad]);
  const setActiveContactUid = useCallback(
    (uid) => {
      const contact = contacts?.find((v) => v.uid === uid);
      contact && setActiveContact(contact);
    },
    [contacts]
  );
  const onMessageReceived = useCallback(
    (msg) => {
      const notification = JSON.parse(msg.body);
      const active =
        JSON.parse(sessionStorage.getItem("recoil-persist"))
          ?.chatActiveContact || initialActiveContact;

      if (active?.uid === notification.senderId) {
        const newMessages = JSON.parse(
          sessionStorage.getItem("recoil-persist")
        )?.chatMessages;
        if (newMessages) {
          findChatMessage(notification.id).then(({ data }) => {
            setMessages([data, ...newMessages]);
          });
        } else {
          findChatMessages(active.uid, currentUser.uid, 0)
            .then((msgs) => {
              setTotalPages(msgs.data.totalPages);
              setPage(0);
              setMessages(msgs.data.content);
            })
            .catch((e) => {
              return;
            });
        }
        loadContacts();
      } else {
        loadContacts().then((contacts) => {
          findNewMessages(currentUser.uid, [notification.senderId]).then(
            ({ data }) => {
              const message = Object.values(data)[0].message;
              const contact = contacts?.find(
                (c) => c.uid === notification.senderId
              );
              onNewMessage &&
                onNewMessage({
                  notification,
                  activeUid: active?.uid,
                  message,
                  contact,
                  setActive: () => {
                    sessionStorage.removeItem("recoil-persist");
                    setMessages();
                    setActiveContact(contact);
                  },
                });
            }
          );
        });
      }
    },
    [
      currentUser,
      loadContacts,
      onNewMessage,
      findChatMessage,
      findChatMessages,
      findNewMessages,
    ]
  );
  const { sendMessage, disconnect } = useConnectChat({
    onConnected: handleOnConnected,
    onMessageReceived,
    uid: currentUser.uid,
  });
  const handleDisconnect = useCallback(() => {
    disconnect();
    sessionStorage.removeItem("recoil-persist");
  }, [disconnect]);

  useEffect(() => {
    if (!activeContact?.uid) return;
    findChatMessages(activeContact.uid, currentUser.uid)
      .then((msgs) => {
        setTotalPages(msgs.data.totalPages);
        setMessages(msgs.data.content);
        loadContacts();
      })
      .catch((e) => {
        console.log(e);
      });
  }, [activeContact, currentUser?.uid, findChatMessages, loadContacts]);
  const handleSendMessage = useCallback(
    (message) => {
      const success = sendMessage(
        message,
        currentUser.uid,
        currentUser.name,
        activeContact.uid,
        activeContact.name
      );
      if (success) {
        const msg = { ...success };
        setMessages((old) => [msg, ...old]);
      }
    },
    [messages, activeContact, currentUser, loadContacts]
  );

  const loadNextPage = useCallback(() => {
    if (page + 1 <= totalPages) {
      findChatMessages(currentUser.uid, activeContact.uid, page + 1).then(
        (msgs) => {
          setTotalPages(msgs.data.totalPages);
          const newMessages = [...messages, ...msgs.data.content];
          const ids = [...new Set(newMessages.map((m) => m.id))];
          const finalMessages = ids.map((id) =>
            newMessages.find((m) => m.id === id)
          );

          return setMessages(finalMessages);
        }
      );
      setPage((old) => old + 1);
      return true;
    }
    return false;
  }, [
    currentUser,
    page,
    totalPages,
    activeContact,
    messages,
    setMessages,
    findChatMessages,
  ]);

  return {
    contacts,
    messages,
    setActiveContactUid,
    activeContact,
    sendMessage: handleSendMessage,
    disconnect: handleDisconnect,
    loadNextPage,
    onMessageReceived,
  };
}

export function useConnectChat({ onMessageReceived, uid, onConnected }) {
  const handleMessageReceived = useCallback(
    (msg) => {
      onMessageReceived && onMessageReceived(msg);
    },
    [onMessageReceived]
  );
  const handleConnected = useCallback(() => {
    stompClient.subscribe(
      "/user/" + uid + "/queue/messages",
      handleMessageReceived
    );
    onConnected && onConnected();
  }, [uid, handleMessageReceived, onConnected]);

  const onError = useCallback((err) => {
    console.log(err);
    return null;
  }, []);

  const connect = useCallback(() => {
    const API = process.env.REACT_APP_API_URL;
    const Stomp = require("stompjs");
    var SockJS = require("sockjs-client");
    var socket = new SockJS(API + "/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect(
      {},
      function (frame) {
        console.log("Connected: " + frame);
        handleConnected();
      },
      function (frame) {
        console.log("error: " + frame);
        onError();
      }
    );
  }, [handleConnected, onError]);

  const sendMessage = useCallback(
    (content, senderId, senderName, recipientId, recipientName) => {
      if (content.trim() !== "") {
        const message = {
          senderId,
          recipientId,
          senderName,
          recipientName,
          content,
          timestamp: moment().toISOString(),
        };
        stompClient.send("/app/chat", {}, JSON.stringify(message));
        return message;
      }
      return false;
    },
    []
  );
  const disconnect = useCallback(() => {
    stompClient?.disconnect();
  }, []);
  useEffect(() => {
    uid && connect();
    return () => {
      disconnect();
    };
  }, [uid, connect, disconnect]);
  return {
    sendMessage,
    disconnect,
  };
}

export function useGeoAddresses(initialValue, timeout = 800) {
  const [value, setValue] = useState(initialValue);
  const [places, setPlaces] = useState();

  useEffect(() => {
    var requestOptions = {
      method: "GET",
    };
    value &&
      fetch(
        "https://api.geoapify.com/v1/geocode/autocomplete?text=" +
          value +
          "&bias=proximity:7.695437406095948,51.37591047394929&filter=countrycode:de&format=json&apiKey=" +
          process.env.REACT_APP_GEOAPIFY_API_KEY,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          const newPlaces = result?.results?.map((r) =>
            r?.formatted.replace(", Germany", "")
          );
          newPlaces ? setPlaces(newPlaces) : setPlaces();
        })
        .catch((error) => console.log("error", error));
  }, [value]);

  const handleChange = useCallback((value) => {
    setValue(value);
  }, []);
  const debouncedChange = useMemo(
    () => debounce(handleChange, timeout),
    [handleChange, timeout]
  );
  return { places, onChange: debouncedChange };
}
