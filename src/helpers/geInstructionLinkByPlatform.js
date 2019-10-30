export default function geInstructionLinkByPlatform(platformId) {
  return {
    psn: 'https://id.sonyentertainmentnetwork.com/id/management/#/p/commerce/content/redeem_code',
    steam: 'https://support.steampowered.com/kb_article.php?ref=7480-WUSF-3601',
    egs: 'https://www.epicgames.com/store/en-US/redeem',
    gog: 'https://www.gog.com/redeem',
    uplay: 'https://support.ubi.com/en-us/Faqs/000025121/How-to-redeem-keys-codes',
    origin: 'https://help.ea.com/en-us/help/origin/origin/origin-code-redemption-faq/#redeemcode',
    itch: 'https://itch.io/docs/creators/download-keys',
    xbox: 'https://redeem.microsoft.com',
    nintendo: 'https://ec.nintendo.com/redeem',
  }[platformId] || '';
}
