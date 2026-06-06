const Database = {

    init() {

        const defaults = {

            cases: [],
            defendants: [],
            officers: [],
            hearings: [],
            activity: []

        };

        Object.keys(defaults)
            .forEach(key => {

                if (
                    !localStorage.getItem(key)
                ) {

                    Storage.set(
                        key,
                        defaults[key]
                    );

                }

            });

    },

    log(message) {

        const activity =
            Storage.get("activity");

        activity.unshift({

            message,

            date:
                new Date()
                .toLocaleString()

        });

        Storage.set(
            "activity",
            activity
        );

    }

};
