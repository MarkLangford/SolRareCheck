class SolRareCheck {
  tab = null;
  nftTitle = null;
  nftToken = null;

  // UI
  nftTokenUI = null;
  nftTitleUI = null;
  nftImage = null;
  moonrank = null;

  constructor() {
    this.run();
  }

  async run() {
    await this.getChromeTab();
    this.getUI();
    this.getNftToken();
    this.getNftTitle();
    this.buildUI();
  }

  async getChromeTab() {
    this.tab = await chrome.tabs.query({ active: true, currentWindow: true });
  }

  getUI() {
    this.nftTokenUI = document.getElementById("nft-property-token");
    this.nftTitleUI = document.getElementById("nft-property-title");
    this.moonrank = document.getElementById("moonrank-rarity");
    this.nftImage = document.getElementById("nft-image");
  }

  getNftToken() {
    const magicedenURL = this.tab[0].url;
    const splitUrl = magicedenURL.split("/");
    this.nftToken = splitUrl.at(-1);
  }

  getNftTitle() {
    this.nftTitle = this.tab[0].title;
  }

  buildUI() {
    if (this.nftToken.length > 40) {
      this.nftTokenUI.innerText = this.nftToken;
      this.nftTitleUI.innerText = this.nftTitle;
      //this.getRank().then((moonrankData) => {
      fetch(`https://moonrank.app/${this.nftToken}`)
        .then((response) => response.text())
        .then((moonrankData) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(moonrankData, "text/html");
          const moonImage = doc.getElementsByClassName(
            "object-cover h-full w-full"
          );
          this.nftImage.src = moonImage[0].src;
          const rankRaw = doc.getElementsByClassName(
            "text-mr-lumen-purple hover:text-mr-signature-yellow bg-mr-heading-purple px-2 py-1 rounded shadow bg-gradient-to-b from-mr-space-purple via-mr-stratos-purple to-mr-atmos-purple"
          );
          const rank = rankRaw[0].childNodes[2].innerHTML;
          this.moonrank.innerText = "MOONRANK: " + rank;
        })
        .catch((error) => {
          this.moonrank.innerText = "Collection not on MOONRANK";
          this.nftImage.src =
            "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png";
        });
    } else {
      this.nftTitleUI.innerText = "Magic Eden - NFT Marketplace";
      this.nftTokenUI.innerText = "Please select an NFT";
      this.moonrank.innerText - "";
      this.nftImage.src =
        "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png";
    }
  }
}

window.onload = new SolRareCheck();
