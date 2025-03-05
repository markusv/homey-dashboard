import { FocusedElement } from "../Focus/FocusedElement/FocusedElement";
import "./ImageFocus.css";

export const ImageFocus = ({ close, imageSrc }) => {
  return (
    <FocusedElement title="Noen ringer på døra" onCloseClick={close}>
      <div className="imageFocusContainer">
        <img src={imageSrc} />
      </div>
    </FocusedElement>
  );
};
