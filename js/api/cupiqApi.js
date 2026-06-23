// WorldCupIQ API Connector
// Future Cloudflare Worker connector.

window.cupiqApi = {

    async fetch(endpoint) {

        const base =
            window.CUPIQ_CONFIG.WORKER_URL;

        if (!base) {
            throw new Error(
                "Worker URL not configured"
            );
        }

        const response =
            await fetch(`${base}${endpoint}`);

        return response.json();
    }

};
