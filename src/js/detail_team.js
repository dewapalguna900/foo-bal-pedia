import apiObjects from './api.js';
import dbObjects from './db.js';

document.addEventListener('DOMContentLoaded', () => {
    const navElements = document.querySelectorAll(".sidenav");
    M.Sidenav.init(navElements);

    const urlParams = new URLSearchParams(window.location.search);
    const isFromSaved = urlParams.get("saved");
    const btnSaveTeam = document.querySelector('#save-team');
    let dataTeam;

    if (isFromSaved) {
        btnSaveTeam.style.display = 'none';
        apiObjects.getSavedTeamById();
    } else {
        dataTeam = apiObjects.loadTeam();
    }

    btnSaveTeam.addEventListener('click', function (event) {
        dataTeam.then(team => {
            dbObjects.saveForLater(team);
        });
    });
});