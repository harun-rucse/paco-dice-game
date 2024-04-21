import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="hidden tablet:flex absolute left-0 bottom-0 w-full h-[10rem] z-50 bg-[#24224a] dark:bg-[#2a223e] items-end px-8 laptop:px-16 py-4 pb-6 justify-between border-t border-[#433761]">
      <div className="px-4 self-start space-y-1 tablet:w-[50%] laptop:w-[30%]">
        <p className="text-center text-white uppercase">Partners & Investors</p>
        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center flex-wrap gap-5 tablet:gap-x-8 laptop:gap-x-8 desktop:gap-x-16">
            <Link to="https://giveaway.com/" target="_blank">
              <img
                src="/icons/giveaway.png"
                alt=""
                className="w-20 laptop:w-[5.5rem]"
              />
            </Link>
            <Link
              to="https://www.dexview.com/bsc/0xe1d0065c4cd16C14C539547bac404cA6F586b8ce"
              target="_blank"
            >
              <img
                src="/icons/dexview.png"
                alt=""
                className="w-20 laptop:w-[5.5rem]"
              />
            </Link>
            <Link to="https://www.cyberscope.io/" target="_blank">
              <img
                src="/icons/cyberscope.png"
                alt=""
                className="w-20 laptop:w-[6.2rem]"
              />
            </Link>
            <Link to="https://cwallet.com" target="_blank">
              <img
                src="/icons/cwallet.png"
                alt=""
                className="w-20 laptop:w-[5.5rem]"
              />
            </Link>
            <Link to="https://www.pinksale.finance/" target="_blank">
              <img
                src="/icons/pinksale.png"
                alt=""
                className="w-20 laptop:w-[6.2rem]"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-8 laptop:gap-24">
        <ul className="space-y-2">
          <li className="text-white">Features</li>
          <li className="text-[#745b97]">
            <Link to="/dice">Dice</Link>
          </li>
          <li className="text-[#745b97]">
            <Link to="/staking">Staking</Link>
          </li>
          <li className="text-[#745b97]">
            <Link to="/lottery">Lottery</Link>
          </li>
        </ul>

        <ul className="space-y-2">
          <li className="text-white">Bonuses</li>
          <li className="text-[#745b97]">
            <Link to="/referral">Referral</Link>
          </li>
          <li className="text-[#745b97]">
            <Link to="/paco-faucet">Paco Faucet</Link>
          </li>
        </ul>

        <ul className="space-y-2">
          <li className="text-white">Socials</li>
          <li className="text-[#745b97]">
            <Link to="https://t.me/PacoDeLlama" target="_blank">
              Telegram
            </Link>
          </li>
          <li className="text-[#745b97]">
            <Link to="https://twitter.com/pacodellamadefi" target="_blank">
              Twitter
            </Link>
          </li>
          <li className="text-[#745b97]">
            <Link to="https://discord.com/invite/HpCG9rDz7X" target="_blank">
              Discord
            </Link>
          </li>
        </ul>

        <ul className="space-y-2">
          <li className="text-white">About</li>
          <li className="text-[#745b97]">
            <Link to="/whitepaper">Whitepaper</Link>
          </li>
          <li className="text-[#745b97]">
            <Link to="/support">Support</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
