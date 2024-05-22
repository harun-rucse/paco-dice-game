import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useDarkMode } from "../../../context/DarkModeContext";

function Rules() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="w-full h-full">
      <Carousel
        className="w-full h-full rounded-2xl"
        showStatus={false}
        showThumbs={false}
        showIndicators
      >
        <img
          src={isDarkMode ? "/images/rules/1-dark.png" : "/images/rules/1.png"}
          className="object-contain w-full h-full"
        />
        <img
          src={isDarkMode ? "/images/rules/2-dark.png" : "/images/rules/2.png"}
          className="object-contain w-full h-auto"
        />
        <img
          src={isDarkMode ? "/images/rules/3-dark.png" : "/images/rules/3.png"}
          className="object-contain w-full h-auto"
        />
        <img
          src={isDarkMode ? "/images/rules/4-dark.png" : "/images/rules/4.png"}
          className="object-contain w-full h-auto"
        />
      </Carousel>
    </div>
  );
}

export default Rules;
