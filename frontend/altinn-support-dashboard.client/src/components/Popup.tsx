import { toast } from "react-toastify";
import popupStyle from "./Popup.module.css";

export function showPopup(message: string, type?: string) {
  if (type === "error") {
    return toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      className: popupStyle.errorMessage,
    });
  }
}

