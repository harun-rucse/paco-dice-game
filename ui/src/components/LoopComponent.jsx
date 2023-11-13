import React, { useState, useEffect, useRef } from "react";

function LoopComponent() {
  const [isLooping, setIsLooping] = useState(false);
  const loopRef = useRef();

  useEffect(() => {
    if (isLooping) {
      // Start the loop
      let i = 0;
      loopRef.current = setInterval(() => {
        console.log("Looping...", i++);
        // Loop logic goes here
      }, 1000); // Loop every 1 second
    }

    // Cleanup function to stop the loop
    return () => {
      if (loopRef.current) {
        clearInterval(loopRef.current);
      }
    };
  }, [isLooping]); // Dependency array

  return (
    <div>
      <button onClick={() => setIsLooping(true)}>Start Loop</button>
      <button onClick={() => setIsLooping(false)}>Stop Loop</button>
    </div>
  );
}

export default LoopComponent;
