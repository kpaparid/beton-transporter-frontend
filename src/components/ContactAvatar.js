import { Image } from "@themesberg/react-bootstrap";

const ContactAvatar = ({ value, isEditable }) => {
  const photoUrl = value[0];
  const name = value[1] || value[2];
  return (
    <div className="contact-avatar">
      {value === "" ? (
        <></>
      ) : photoUrl ? (
        <Image
          src={photoUrl}
          className="user-avatar rounded-circle border-0"
          resize="contain"
        />
      ) : (
        <div className="bg-primary text-white rounded-circle fw-bolder user-avatar rounded-circle">
          {name?.substring(0, 2)}
        </div>
      )}
    </div>
  );
};
export default ContactAvatar;
