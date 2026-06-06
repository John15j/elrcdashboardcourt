const Router = {

    init() {

        document
            .querySelectorAll(
                ".nav-btn"
            )
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".page"
                            )
                            .forEach(page => {

                                page.classList.remove(
                                    "active"
                                );

                            });

                        document
                            .getElementById(
                                btn.dataset.page +
                                "Page"
                            )
                            .classList.add(
                                "active"
                            );

                    }
                );

            });

    }

};
