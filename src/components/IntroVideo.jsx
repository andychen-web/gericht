import React, { useState } from "react";
import images from "../data/images";
import { BsPlayCircle, BsPauseCircle } from "react-icons/bs";

const IntroVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const vidRef = React.useRef();

  const handleClick = () => {
    setIsPlaying((prevState) => !prevState);
    if (isPlaying) {
      vidRef.current.pause();
    } else {
      vidRef.current.play();
    }
  };
  return (
    <div className="position-relative vid-container">
      <video
        ref={vidRef}
        width="100%"
        height="100%"
        controls={false}
        loop={true}
        type="video/mp4"
        src={images.meal}
      >
        Your browser does not support the video tag.
      </video>
      <div
        className="position-absolute top-50 start-50 play-btn text-white fs-1"
        onClick={handleClick}
      >
        {isPlaying ? <BsPauseCircle /> : <BsPlayCircle />}
      </div>
    </div>
  );
};

export default IntroVideo;
