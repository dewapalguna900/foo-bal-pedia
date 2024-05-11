import { openDB, deleteDB, wrap, unwrap } from './idb/index.js';

const idbPromises = openDB("foo-bal-pedia", 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
        const teamsObjectStore = db.createObjectStore('teams', { keyPath: 'id' });
    }
});

const dbObjects = {
    saveForLater: function (team) {
        idbPromises.then(db => {
            const tx = db.transaction('teams', 'readwrite');
            const store = tx.objectStore('teams');

            let data = {
                'id': team.team.id,
                'name': team.team.name,
                'founded': team.team.founded,
                'logo': team.team.logo,
                'venue': team.venue.name,
                'venue_address': team.venue.address + ', ' + team.venue.city,
                'venue_capacity': team.venue.capacity
            };
            console.log(data);

            store.add(data);
            return tx.done;
        }).then(() => alert('Informasi Team berhasil disimpan.'));
    },
    getAll: function () {
        return new Promise(function (resolve, reject) {
            idbPromises
                .then(db => {
                    const tx = db.transaction('teams', 'readonly');
                    const store = tx.objectStore('teams');

                    return store.getAll();
                })
                .then(teams => {
                    resolve(teams);
                });
        });
    },
    getTeamById: function (id) {
        return new Promise(function (resolve, reject) {
            idbPromises
                .then(db => {
                    const tx = db.transaction('teams', 'readonly');
                    const store = tx.objectStore('teams');

                    return store.get(parseInt(id));
                })
                .then(team => {
                    resolve(team);
                })
        });
    },
    deleteSavedTeam: function (id) {
        idbPromises
            .then(db => {
                const tx = db.transaction('teams', 'readwrite');
                const store = tx.objectStore('teams');

                store.delete(parseInt(id));
                return tx.done;
            })
            .then(() => alert('Tim Favotir berhasil dihapus.'));
    }
}

export default dbObjects;