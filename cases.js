const Cases = {

    generateCaseNumber() {

        const cases =
            Storage.get("cases");

        const next =
            cases.length + 1;

        return `CASE-2026-${String(next).padStart(4,"0")}`;

    },

    create(data) {

        const cases =
            Storage.get("cases");

        const newCase = {

            id:
                Cases.generateCaseNumber(),

            title:
                data.title || "",

            defendant:
                data.defendant || "",

            status:
                data.status || "Open",

            priority:
                data.priority || "Normal",

            officers:
                data.officers || [],

            witnesses:
                data.witnesses || [],

            evidence:
                data.evidence || [],

            notes:
                data.notes || "",

            createdAt:
                new Date().toLocaleString(),

            updatedAt:
                new Date().toLocaleString()

        };

        cases.push(newCase);

        Storage.set(
            "cases",
            cases
        );

        Database.log(
            `Created ${newCase.id}`
        );

        return newCase;

    },

    getAll() {

        return Storage.get(
            "cases"
        );

    },

    getById(id) {

        return Cases
            .getAll()
            .find(
                c => c.id === id
            );

    },

    update(id, updates) {

        const cases =
            Cases.getAll();

        const index =
            cases.findIndex(
                c => c.id === id
            );

        if(index === -1) return;

        cases[index] = {

            ...cases[index],

            ...updates,

            updatedAt:
                new Date()
                .toLocaleString()

        };

        Storage.set(
            "cases",
            cases
        );

        Database.log(
            `Updated ${id}`
        );

    },

    delete(id) {

        const cases =
            Cases.getAll()
            .filter(
                c => c.id !== id
            );

        Storage.set(
            "cases",
            cases
        );

        Database.log(
            `Deleted ${id}`
        );

    }

};
