function PostImage({ image }) {
  return (
    <div className="w-full desktop:w-[80%] h-full overflow-hidden">
      <img
        src={image}
        className="w-full h-full block object-contain rounded-xl"
        alt=""
      />
    </div>
  );
}

export default PostImage;
