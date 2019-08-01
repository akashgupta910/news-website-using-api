(function AJAX() {
    let api_key = '89dc14a0f40f4974856a11e1b6fb2575';
    let country = 'in';
    let category = sessionStorage.getItem('category');
    let headline = 'top-headlines';

    let api;

    if (sessionStorage.getItem('api') == null) {
        document.querySelector(".head h1").innerHTML = sessionStorage.getItem('category');
        api = `https://newsapi.org/v2/${headline}?country=${country}&category=${category}&apiKey=${api_key}`;
    } else {
        api = sessionStorage.getItem('api');
        document.querySelector(".head h1").innerHTML = sessionStorage.getItem('search_text');
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', api, true);

    xhr.onreadystatechange = function () {
        let DONE = 4;
        let OK = 200;
        if (this.readyState === DONE) {
            if (this.status === OK) {
                console.log("Success");
                let data = JSON.parse(this.responseText);
                updateCarousel(data);
                updateCard(data);
            } else {
                console.log('Error: ' + this.status);
            }
        }
    };

    xhr.send();
}());

(function Category() {
    let links = document.getElementsByClassName("links");
    for (let index = 0; index < links.length; index++) {
        links[index].addEventListener('click', () => {
            let cat = links[index].getAttribute('id');
            sessionStorage.setItem('category', cat);
            sessionStorage.removeItem('api');
            location.reload();
        });
    }
}());

function Search() {
    let search_input = document.getElementById('search-input').value;
    if (search_input != "") {
        console.log(search_input);
        sessionStorage.setItem('api', `https://newsapi.org/v2/everything?q=${search_input}&apiKey=89dc14a0f40f4974856a11e1b6fb2575`);
        sessionStorage.setItem('search_text', search_input);
        location.reload();
    }
}

function updateCarousel(data) {
    if (data['articles'].length > 0) {
        for (let index = 0; index < 3; index++) {
            let carouselElemParent = document.querySelector("#carous-el .carousel-inner");
            let elem = document.createElement('div');

            if (index == 0)
                elem.className = 'carousel-item active';
            else
                elem.className = 'carousel-item';

            elem.innerHTML = `
            <div class="card mb-3">
                <div class="row no-gutters">
                    <div class="col-md-7">
                        <img src="${data['articles'][index].urlToImage}"
                            class="card-img">
                    </div>
                    <div class="col-md-5">
                        <div class="card-body">
                            <p class="text-muted">${data['articles'][index].publishedAt}</p>
                            <h5 class="card-title">${data['articles'][index].title}</h5>
                            <p class="card-text">${data['articles'][index].content}</p>
                            <a href='${data['articles'][index].url}' target='_blank'><button>Read More<i class="fa fa-arrow-circle-right"></i></button></a>
                        </div>
                    </div>
                </div>
            </div>`;

            carouselElemParent.appendChild(elem);
        }
    } else {
        document.querySelector('.not-found').innerHTML = "Result Not Found!";
        console.log('no')
    }
}

function updateCard(data) {
    for (let index = 3; index < data['articles'].length; index++) {
        let card_parent_elem = document.querySelector("#news .row");
        let elem = document.createElement("div");
        elem.className = "col-md-3"
        elem.innerHTML = `
            <div class="card">
                <img src="${data['articles'][index].urlToImage}"
                    class="card-img-top">
                <div class="card-body">
                    <p class="text-muted">${data['articles'][index].publishedAt}</p>
                    <a href="${data['articles'][index].url}" target='_blank'><h5 class="card-title">${data['articles'][index].title}</h5></a>
                    <p class='card-text'>${data['articles'][index].description}</p>
                </div>
            </div>`;
        card_parent_elem.appendChild(elem);
    }
}