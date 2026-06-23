// WorldCupIQ Normalize
// Future API cleanup layer.

window.normalizeMatch = function(raw) {

    return {
        id: raw.id,
        homeTeam: raw.homeTeam,
        awayTeam: raw.awayTeam,
        status: raw.status,
        kickoff: raw.kickoff
    };

};
