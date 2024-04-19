function AnimateSpinner() {
  return (
    <div className="absolute -top-24 left-4 w-full h-full flex justify-center items-center z-50">
      <div className="flex items-center gap-4">
        <img src="/animation.gif" alt="" className="w-36" />
      </div>
    </div>
  );
}

export default AnimateSpinner;
