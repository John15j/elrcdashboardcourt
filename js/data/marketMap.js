// WorldCupIQ Market Map

window.marketMap = {

    "eng-cro": "https://polymarket.com",
    "bra-hai": "https://polymarket.com",
    "sco-mor": "https://polymarket.com"

};

window.getMarketUrl = function(matchId) {
    return (
        window.marketMap[matchId] ||
        "https://polymarket.com"
    );
};
