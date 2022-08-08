var client = contentful.createClient({
    space: '3jktv19hntdn',
    accessToken: 'nMaydufpx3qh3ACcT0_j-kizuKFzIZAAEm6hVhhPARc',
});

let count = 10;
client.getEntries({ content_type: "joke" })
    .then(
        response => {
            count = response.total;
        }
    )

function fetchRandomJoke() {
    let randomIndex = Math.floor(Math.random() * count);
    client.getEntries(
        {
            content_type: "joke",
            "fields.id": randomIndex,
            limit: 1, // The number of nested CMS entries to include
        }
    ).then(result => {
        let title = "";
        let body = "Désolé mais ça marche pas 😢";
        if (result.total >= 0) {
            let randomJoke = result.items[0];
            if (randomJoke) {
                title = randomJoke.fields.title;
                body = randomJoke.fields.jokeBody;
            }
            let titleUI = document.getElementById('joke-title').innerHTML = title;
            let bodyUI = document.getElementById('joke-body').innerHTML = body;
            document.getElementById("duck").setAttribute("style", "visibility: visible;");
        }
    });
}

window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js');
    }
}