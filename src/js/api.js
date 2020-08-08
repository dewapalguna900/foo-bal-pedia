import dbObjects from "./db.js";

const apiObjects = {
    loadCompetitions: function (id_competition = 2000) {
        const url = `https://api.football-data.org/v2/competitions/${id_competition}/teams`;

        if ("caches" in window) {
            caches.match(url)
                .then(response => {
                    if (response) {
                        response.json()
                            .then(responseJson => {
                                this.setViewCompetitions(responseJson);
                            });
                    }
                })
        }

        fetch(url, {
            headers: {
                'X-Auth-Token': '35794953e6804ca6ac42557550827322'
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    return 'Data tidak ditemukan.';
                }
                return response.json();
            })
            .then(responseJson => {
                this.setViewCompetitions(responseJson);
            });
    },
    setViewCompetitions: function (responseJson) {
        const competitionView = document.createElement('div');
        competitionView.id = 'detail-competition';
        competitionView.className = 'row center-align';

        // cek jika element id detail-competition ada
        // jika iya, hapus element tsb agar dapat diisi dengan data yang baru
        if (document.querySelector("#detail-competition")) {
            let detailCompetition = document.querySelector("#detail-competition");
            detailCompetition.parentNode.removeChild(detailCompetition);
        }
        let competitionStr = `<div class="row" style="text-align: center;">
                <h4 class="col l12 m12 s12">${responseJson.competition.name} - ${responseJson.competition.lastUpdated.slice(0, 4)}</h4>
                <h5 class="col l12 m12 s12">Season ${responseJson.season.id}</h5>`;
        if (responseJson.season.winner === null) {
            competitionStr += `<h5 class="col l12 m12 s12">Belum Ada Pemenang pada Season ini</h5>`;
        } else {
            competitionStr += `<h5 class="col l12 m12 s12"><strong>-- WINNER --</strong></h5>
                    <div class="col s4 m4 l4"></div>
                    <div class="col s12 m4 l4 card-panel hoverable" style="padding: 10px;">
                        <img src="${responseJson.season.winner.crestUrl}" alt="Bendera ${responseJson.season.winner.name}"
                            class="responsive-img">
                        <p class="center-align">${responseJson.season.winner.name}</p>
                        <a href="./detail-team.html?id=${responseJson.season.winner.id}" class="waves-effect waves-light btn btn-detail-team">Detail Tim</a>
                    </div>
                    <div class="col s4 m4 l4"></div>
                </div>`;
        }

        competitionStr += `<h5 class="col l12 m12 s12" style="text-align: center;margin-bottom:30px;"><hr><strong>-- TEAM PARTICIPATED --</strong></h5>
                <div class="row" style="text-align: center;">`;
        responseJson.teams.forEach(team => {
            let teamLogo = '../../assets/img/default_team_logo.png';
            if (team.crestUrl !== null && team.crestUrl !== "") {
                teamLogo = team.crestUrl.replace(/^http:\/\//i, 'https://');
            }

            competitionStr += `<div class="col s12 m6 l3 card-panel hoverable" style="padding: 5px;margin-bottom: 20px;">
                        <img src="${teamLogo}" alt="Bendera ${team.name}"
                            class="responsive-img" style="height: 200px">
                        <p class="center-align">${team.name}</p>
                        <a href="./detail-team.html?id=${team.id}" class="waves-effect waves-light btn btn-detail-team">Detail Tim</a>
                    </div>`;
        });
        competitionStr += '</div>';
        competitionView.innerHTML = competitionStr;

        const contentContainer = document.querySelector('#body-content');
        let page = window.location.hash.substr(1);

        // cek apakah halaman yang sedang aktif 'Masih' di Halaman Kompetisi
        if (page === "competitions") {
            contentContainer.appendChild(competitionView);
        }
    },
    loadTeam: function () {
        return new Promise(function (resolve, reject) {
            const UrlParams = new URLSearchParams(window.location.search);
            const id_team = UrlParams.get('id');

            const url = `https://api.football-data.org/v2/teams/${id_team}`;

            if ("caches" in window) {
                caches.match(url)
                    .then(response => {
                        if (response) {
                            response.json()
                                .then(responseJson => {
                                    apiObjects.setDetailTeamView(responseJson);
                                    resolve(responseJson);
                                })
                        }
                    })
            }

            fetch(url, {
                headers: {
                    'X-Auth-Token': '35794953e6804ca6ac42557550827322'
                }
            }).then(response => {
                if (response.status !== 200) {
                    return 'Data tidak ditemukan.';
                }
                return response.json();
            })
                .then(responseJson => {
                    apiObjects.setDetailTeamView(responseJson);
                    resolve(responseJson);
                })
        });
    },
    setDetailTeamView: function (data) {
        const contentContainer = document.querySelector('#body-content');
        const detailTeamView = document.createElement('div');
        detailTeamView.className = 'row';

        let teamLogo = '../../assets/img/default_team_logo.png';
        if (data.crestUrl !== null && data.crestUrl !== "") {
            teamLogo = data.crestUrl.replace(/^http:\/\//i, 'https://');
        }

        let strDetailTeam = `<h4 class="col s12 m12 l12 center-align">-= ${data.name} =-</h4>
        <img src="${teamLogo}" alt="Bendera Team ${data.name}" id="img-team" 
            class="responsive-img" width="60%" style="display:block;margin:0 auto;">
        <hr>
        <table class="striped">
            <thead style="background-color: darkturquoise;">
                <tr>
                    <th colspan="2" class="center-align">Informasi Tim</th>
                </tr>
            </thead>
            <tr>
                <td>Nama Tim</td>
                <td>: ${data.name}</td>
            </tr>
            <tr>
                <td>Warna Jersey</td>
                <td>: ${data.clubColors}</td>
            </tr>
            <tr>
                <td>Berdiri</td>
                <td>: Tahun ${data.founded}</td>
            </tr>
            <tr>
                <td>Kode FIFA</td>
                <td>: ${data.tla}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>: ${data.email}</td>
            </tr>
            <tr>
                <td>No. Telp</td>
                <td>: ${data.phone}</td>
            </tr>
            <tr>
                <td>Official Website</td>
                <td>: <a href="${data.website}" target="_blank">${data.website}</a></td>
            </tr>
        </table>
        <hr>
        <h6 class="center-align light-blue lighten-2" style="padding: 20px 0;"><strong>Personil Tim</strong></h6>`;

        if (data.squad.length !== 0) {
            strDetailTeam += '<ol class="collapsible">';
            data.squad.forEach(personil => {
                strDetailTeam += `<li>
                <div class="collapsible-header">${personil.name} (${personil.role})</div>
                <div class="collapsible-body">
                    <table>
                        <tr>
                            <td>Nama</td>
                            <td>: ${personil.name}</td>
                        </tr>
                        <tr>
                            <td>TTL</td>
                            <td>: ${personil.countryOfBirth}, ${personil.dateOfBirth.substr(0, 10)}</td>
                        </tr>
                        <tr>
                            <td>Nationality</td>
                            <td>: ${personil.nationality}</td>
                        </tr>
                        <tr>
                            <td>Role</td>
                            <td>: ${personil.role}</td>
                        </tr>
                        <tr>
                            <td>Posisi</td>
                            <td>: ${personil.position}</td>
                        </tr>
                    </table>
                </div>
            </li>`;
            });
            strDetailTeam += '</ol>';
        } else {
            strDetailTeam += `<ol class="collapsible">
                <li>
                <div class="collapsible-header">Squad Information not available.</div>
                <div class="collapsible-body">Squad Information not available.</div>
                </li>
            </ol>`;
        }

        detailTeamView.innerHTML = strDetailTeam;
        contentContainer.innerHTML = " ";
        contentContainer.appendChild(detailTeamView);

        const collapsibleElm = document.querySelectorAll('.collapsible');
        M.Collapsible.init(collapsibleElm);

        setTimeout(() => {
            // cek jika gambar Bendera Team rusak/tidak tampil
            // langsung ganti ke gamabr default
            if (document.querySelector("#img-team").clientHeight < 50) {
                document.querySelector("#img-team").setAttribute('src', '../../assets/img/default_team_logo.png');
            }
        }, 1500);
    },
    getSavedTeams: function () {
        dbObjects.getAll()
            .then(dbTeams => {
                console.log(dbTeams);

                const savedTeamsContainer = document.createElement('div');
                savedTeamsContainer.className = 'row center-align';
                savedTeamsContainer.id = 'saved-team-container';

                let strSavedTeams = "";
                dbTeams.forEach(team => {
                    let teamLogo = '../../assets/img/default_team_logo.png';
                    if (team.crestUrl !== null && team.crestUrl !== "") {
                        teamLogo = team.crestUrl.replace(/^http:\/\//i, 'https://');
                    }

                    strSavedTeams += `<div class="col s12 m6 l3 card-panel hoverable" style="padding: 5px;margin-bottom: 20px;">
                    <img src="${teamLogo}" alt="Bendera ${team.name}"
                        class="responsive-img" style="height: 200px">
                    <p class="center-align">${team.name}</p>
                    <a href="./detail-team.html?id=${team.id}&saved=true" class="waves-effect waves-light btn btn-detail-team">Detail Tim</a>
                    <a href="#" class="waves-effect waves-light btn btn-detail-team red btn-delete-saved-team" data="${team.id}"><i class="far fa-trash-alt"></i></a>
                </div>`;
                });

                savedTeamsContainer.innerHTML = strSavedTeams;

                const contentContainer = document.querySelector('#body-content');
                contentContainer.appendChild(savedTeamsContainer);
            })
            .then(() => {
                document.querySelectorAll('.btn-delete-saved-team').forEach(btnElm => {
                    btnElm.addEventListener('click', function (event) {
                        event.preventDefault();

                        let yakin_hapus = confirm("Yakin Hapus?");
                        if (yakin_hapus) {
                            const idSavedTeam = this.getAttribute('data');
                            dbObjects.deleteSavedTeam(idSavedTeam);

                            // trigger klik pada Menu Navigasi Saved untuk refresh
                            document.querySelector('a[href="#saved"]').click();
                        } else {
                            alert('Tindakan Penghapusan dibatalkan.');
                        }
                    });
                })
            })
    },
    getSavedTeamById: function () {
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get('id');

        dbObjects.getTeamById(idParam)
            .then(team => {
                apiObjects.setDetailTeamView(team);
            });
    }
}

export default apiObjects;