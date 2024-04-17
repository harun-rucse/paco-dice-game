function CardItem({ item }) {
  console.log(item);
  return (
    <div className="bg-[#24292d] px-8 py-6 rounded-lg">
      <div className="flex items-start gap-4">
        <img src={item.image} alt="" className="w-10" />
        <div className="flex flex-col gap-3">
          <strong>{item.label}</strong>
          <strong className="font-extralight text-lg">
            ${isNaN(item.amount) ? "0.00" : Number(item.amount).toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default CardItem;
