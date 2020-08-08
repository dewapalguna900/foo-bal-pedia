import apiObjects from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Load Menu Navigasi secara dinamis
    const navElements = document.querySelectorAll(".sidenav");
    M.Sidenav.init(navElements);
    loadNav();

    function loadNav() {
        fetch('src/pages/nav.html')
            .then(response => {
                if (response.status !== 200) {
                    console.log('Terjadi kesalahan saat pengambilan data.');
                    return;
                }
                return response.text();
            })
            .then(responseText => {
                document.querySelectorAll('.topnav, .sidenav').forEach(element => {
                    element.innerHTML = responseText;
                });

                document.querySelectorAll('.topnav a, .sidenav a').forEach(element => {
                    element.addEventListener('click', function (event) {
                        // tutup menu nav collapse saat dalam mode hp/smartphone
                        const navElement = document.querySelector('.sidenav');
                        M.Sidenav.getInstance(navElement).close();

                        // load content sesuai navigasi yang dipilih
                        const pageSelected = event.target.getAttribute('href').substr(1);
                        loadPage(pageSelected);
                    });
                });
            });
    }

    // load content from clicked navigation
    let page = window.location.hash.substr(1);
    const pageUrl = ['home', 'competitions', 'saved', 'contact'];
    if (page === "" || !pageUrl.includes(page)) page = "home";
    loadPage(page);

    function loadPage(page) {
        fetch(`/src/pages/${page}.html`)
            .then(response => {
                if (response.status !== 200) {
                    return 'Halaman tidak ditemukan';
                }
                return response.text();
            })
            .then(responseText => {
                const contentElement = document.querySelector("#body-content");
                contentElement.innerHTML = " ";
                contentElement.innerHTML = responseText;

                if (page === 'competitions') {
                    const selectElement = document.querySelector('#selectCompetition');
                    M.FormSelect.init(selectElement);

                    apiObjects.loadCompetitions();

                    document.querySelector('#btnFilter').addEventListener('click', event => {
                        event.preventDefault();
                        getSelectedCompetition(selectElement);
                    });
                } else if (page === 'saved') {
                    apiObjects.getSavedTeams();
                }
            });
    }

    function getSelectedCompetition(selectElement) {
        const selectedCompetition = selectElement.options[selectElement.selectedIndex].value;
        apiObjects.loadCompetitions(selectedCompetition);
        // apiObjects.checkImgUrl('https://upload.wikimedia.org/wikipedia/en/7/78/Nkmaribor_2013.png');
        // const str = apiObjects.checkImgUrl('https://upload.wikimedia.org/wikipedia/en/7/78/Nkmaribor_2013.png');
        // const str = apiObjects.checkImgUrl('https://upload.wikimedia.org/wikipedia/en/1/12/Flag_of_Poland.svg');
        // console.log(str);
    }
});