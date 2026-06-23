// WorldCupIQ Research Vault

const STORAGE_KEY = "cupiq-vault";

window.vault = {

    getAll() {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );
    },

    save(match) {

        const items = this.getAll();

        items.push(match);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(items)
        );
    },

    remove(id) {

        const items = this.getAll().filter(
            item => item.id !== id
        );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(items)
        );
    }

};
