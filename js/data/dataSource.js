// WorldCupIQ Data Source
// This becomes the ONLY file the UI talks to later.

class DataSource {
    constructor() {
        this.adapter =
            window.CUPIQ_CONFIG?.USE_LIVE_DATA
                ? window.liveAdapter
                : window.mockAdapter;
    }

    getLiveMatches() {
        return this.adapter.getLiveMatches();
    }

    getUpcomingMatches() {
        return this.adapter.getUpcomingMatches();
    }

    getRecentMatches() {
        return this.adapter.getRecentMatches();
    }

    getMatchById(id) {
        return this.adapter.getMatchById(id);
    }

    getAiFeed(id) {
        return this.adapter.getAiFeed(id);
    }

    getMarketUrl(id) {
        return this.adapter.getMarketUrl(id);
    }
}

window.dataSource = new DataSource();
