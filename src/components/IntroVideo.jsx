import React from "react";

const IntroVideo = () => {
  return (
    <div className="bg">
      <div className="videobox">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/xPPLbEFbCAo?si=Tnk8om6PpOqJShZ3"
          title="YouTube video player"
          allow="clipboard-write;  encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
};

export default IntroVideo;
