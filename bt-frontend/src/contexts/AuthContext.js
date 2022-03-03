import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Image, Nav } from "@themesberg/react-bootstrap";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  PhoneAuthCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  updateProfile,
} from "firebase/auth";
import moment from "moment";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Portal } from "react-portal";
import { auth } from "../firebase";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  // const getUpdatedUser = useCallback(() => {
  //   return onAuthStateChanged(auth, (user) => {
  //     return user;
  //   });
  // }, []);
  const currentRole = currentUser?.getIdTokenResult(true).then(({ claims }) => {
    return (
      claims && Object.keys(claims).filter((claim) => claim.includes("ROLE_"))
    );
  });

  const claims = useCallback(
    () => currentUser?.getIdTokenResult(true),
    [currentUser]
  );

  const [loading, setLoading] = useState(true);

  function updateUser(data) {
    return updateProfile(currentUser, data).then((r) => currentUser.reload());
  }
  function updatePhone(data) {
    const c = PhoneAuthCredential();
    return updatePhoneNumber(currentUser, data).then((r) =>
      currentUser.reload()
    );
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function handleUpdateEmail(email) {
    return updateEmail(currentUser, email);
  }

  function findConnection() {
    return fetch(process.env.REACT_APP_BACKEND);
  }
  function updatePW(newPassword) {
    return updatePassword(currentUser, newPassword);
  }
  function countNewMessages(senderId, recipientId) {
    return authenticatedFetch({
      url:
        process.env.REACT_APP_CHAT_SERVICE +
        "/messages/" +
        senderId +
        "/" +
        recipientId +
        "/count",
      method: "GET",
    });
  }
  function findUnreadMessages(recipientId, senderId) {
    return authenticatedFetch({
      url:
        process.env.REACT_APP_CHAT_SERVICE +
        "/unread-messages/" +
        recipientId +
        "/" +
        senderId,
      method: "GET",
    });
  }
  function findUnreadCount(recipientId, senderIds) {
    return (
      recipientId &&
      senderIds &&
      authenticatedFetch({
        url:
          process.env.REACT_APP_CHAT_SERVICE +
          "/unread-count/" +
          recipientId +
          "/" +
          senderIds.join(","),
        method: "GET",
      })
    );
  }

  function findNewMessages(recipientId, senderIds = []) {
    return authenticatedFetch({
      url:
        process.env.REACT_APP_CHAT_SERVICE +
        "/last-messages/" +
        recipientId +
        "/" +
        senderIds.join(","),
      method: "GET",
    });
  }
  function findChatMessages(senderId, recipientId, page = 0) {
    return authenticatedFetch({
      url:
        process.env.REACT_APP_CHAT_SERVICE +
        "/messages/" +
        senderId +
        "/" +
        recipientId +
        "?page=" +
        page +
        "&size=20",
      method: "GET",
    });
  }
  function findChatMessage(id) {
    return authenticatedFetch({
      url: process.env.REACT_APP_CHAT_SERVICE + "/messages/" + id,
      method: "GET",
    });
  }
  function getToken() {
    return currentUser.getIdToken(true);
  }
  function getHeader() {
    return getToken().then((idToken) => {
      return {
        "Content-type": "application/json",
        Authorization: `Bearer ${idToken}`,
      };
    });
  }

  const authenticatedFetch = (options) => {
    return getHeader().then((header) => {
      const defaults = { headers: header };
      options = Object.assign({}, defaults, options);

      return fetch(options.url, options)
        .then((response) => {
          return response.json().then((res) => {
            if (res.status !== 200) {
              return Promise.reject(res);
            }
            return res;
          });
        })
        .catch((e) => {
          return Promise.reject();
        });
    });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    claims,
    currentUser,
    currentRole,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail: handleUpdateEmail,
    updatePassword,
    findChatMessages,
    countNewMessages,
    findNewMessages,
    findConnection,
    findUnreadMessages,
    findChatMessage,
    findUnreadCount,
    authenticatedFetch,
    updateUser,
    updatePW,
    updatePhone,
    getHeader,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
export const useUserNavbar = (size = "30px") => {
  const { currentUser, logout } = useAuth();
  const name = currentUser?.displayName || currentUser?.email;
  const image = !currentUser.photoURL ? (
    <div
      className="bg-senary text-nonary rounded-circle fw-bolder"
      style={{
        height: size,
        width: size,
        lineHeight: size,
        textAlign: "center",
      }}
    >
      {name.substring(0, 2)}
    </div>
  ) : (
    <Image
      src={currentUser.photoURL}
      className="rounded-circle me-2"
      style={{ height: size, width: size }}
    />
  );

  const dropdown = (
    <Dropdown as={Nav.Item} className="" drop="up" flip="true">
      <Dropdown.Toggle as={Nav.Link} className="p-0">
        <div className="media d-flex align-items-center w-100 p-2">
          {image}
          <div className="media-body text-light align-items-center d-none d-sm-block">
            <span className="mb-0 font-small fw-bold">{name}</span>
          </div>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="" style={{ right: "0%", minWidth: "8rem" }}>
        <Dropdown.Item className="fw-bold px-3 text-primary" onClick={logout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" />
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return { name, image, dropdown };
};
