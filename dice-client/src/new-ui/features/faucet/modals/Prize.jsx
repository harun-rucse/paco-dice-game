import TextBox from "./TextBox";

function Prize() {
  return (
    <div className="text-white font-[Poppins] p-4 tablet:p-8 space-y-4">
      <h4 className="text-xl tablet:text-3xl text-center font-bold uppercase">
        Prize Distribution
      </h4>

      <TextBox>
        <TextBox.Text className="text-center">1st - 50%</TextBox.Text>
        <TextBox.Text className="text-center">2nd - 25%</TextBox.Text>
        <TextBox.Text className="text-center">3rd - 10%</TextBox.Text>
        <TextBox.Text className="text-center">4th - 6%</TextBox.Text>
        <TextBox.Text className="text-center">5th - 3%</TextBox.Text>
        <TextBox.Text className="text-center">6th - 2%</TextBox.Text>
        <TextBox.Text className="text-center">7th - 1%</TextBox.Text>
        <TextBox.Text className="text-center">8th - 1%</TextBox.Text>
        <TextBox.Text className="text-center">9th - 1%</TextBox.Text>
        <TextBox.Text className="text-center">10th - 1%</TextBox.Text>
      </TextBox>
    </div>
  );
}

export default Prize;
