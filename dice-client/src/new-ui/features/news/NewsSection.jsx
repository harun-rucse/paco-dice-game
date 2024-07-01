import PostContent from "./PostContent";
import PostImage from "./PostImage";

function NewsSection() {
  return (
    <div className="max-w-[600px] laptop:max-w-[800px] desktop:max-w-[1000px] w-full mx-auto">
      <div className="space-y-5">
        <div>
          <h2 className="text-xl tablet:text-3xl">
            Paco Partners with NULS: Unlocking New Opportunities
          </h2>
          <span className="text-[#989898]">2024-07-01</span>
        </div>

        <div className="space-y-10 tablet:space-y-16">
          <div className="space-y-6">
            <PostImage image="/images/news/1.jpeg" />

            <PostContent>
              <p>
                Paco has taken a major step by partnering with NULS, a leading
                crypto player with a market cap of $37,949,905. This partnership
                enhances Paco's credibility and visibility in the crypto space.
              </p>

              <p>**Immediate Benefits**</p>

              <div>
                <p>
                  - **Access to a Large Community**: Taps into NULS' active user
                  base.
                </p>
                <p>
                  - **Robust Ecosystem**: Opens doors for innovation and growth.
                </p>
                <p>
                  - **Cross-Chain Capabilities**: Seamless interaction with
                  other blockchains.
                </p>
                <p>
                  - **Multi-Chain Wallet Integration**: Available on the NABOX
                  Web3 wallet for easy token management.
                </p>
              </div>

              <p>
                This partnership marks a pivotal moment for Paco, setting the
                stage for future growth and success.Paco Partners with NULS:
                Unlocking New Opportunities
              </p>
            </PostContent>
          </div>

          <div className="space-y-6">
            <PostImage image="/images/news/2.jpeg" />

            <PostContent>
              <p>
                Get ready for an exciting opportunity with PACO and NULS! PACO
                has allocated 25 BILLION Paco tokens for this partnership.
                Here's how to get started and earn rewards:
              </p>

              <div className="space-y-4">
                <p>
                  1. **Download NABOX Wallet**: Get the NABOX wallet from their
                  website or app store.
                </p>
                <p>2. **Create an Account**: Set up your account securely.</p>
                <p>
                  3. **Buy NULS**: Purchase NULS tokens from a supported
                  exchange.
                </p>
                <p>
                  4. **Stake Your NULS**: Visit
                  <a
                    className="text-[#1b88d0] px-1"
                    href="https://pocm.nuls.io/pocm/Projects/ProjectsInfo?releaseId=519"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://pocm.nuls.io/pocm/Projects/ProjectsInfo?releaseId=519
                  </a>
                  and follow the instructions to stake your NULS.
                </p>
              </div>

              <p>
                Start earning rewards instantly by participating in this
                exciting opportunity. Don't miss out on your chance to be part
                of the future of crypto with PACO and NULS!
              </p>
            </PostContent>
          </div>

          <div className="space-y-6">
            <PostImage image="/images/news/3.jpeg" />

            <PostContent>
              <p>
                Now you can swap Paco across different blockchains through our
                partnership with NULS on{" "}
                <a
                  className="text-[#1b88d0] px-1"
                  href="https://bridge.nerve.network/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://bridge.nerve.network/
                </a>
                . This partnership expands opportunities for crypto enthusiasts
                and enables users to securely store their valuable Paco tokens
                on their preferred blockchain. Experience seamless transactions
                and explore the full potential of Paco and NULS.
              </p>

              <p>
                Supported chains include BNB, Ethereum, Arbitrum, TRON, Nerve,
                Avalanche, Polygon, NULS, and ENULS, with more chains planned
                for the future.
              </p>
            </PostContent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsSection;
