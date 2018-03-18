const rp = require('request-promise-native');
const mongoose = require('mongoose');

// 拿到movie Model
const Movie = mongoose.model('Movie');

// 拿到Category Model
const Category = mongoose.model('Category');

function fetchmovie(item) {
    return new Promise(async (resolve) => {
        console.log(`http://api.douban.com/v2/movie/${item.movieId}`);
        const url = `http://api.douban.com/v2/movie/${item.movieId}`;
        const result = await rp(url);

        let body;
        try {
            body = JSON.parse(result);
        } catch (err) {
            console.error(err);
        }
        resolve(body);
    });
}

(async () => {
    const movies = await Movie.find({
        // 使用$or,表示其数组内的多个查询条件为or的关系
        $or: [
            // $exists 表示此字段没有
            {
                summary: {
                    $exists: false,
                }
            },
            {
                summary: null,
            },
            {
                year: {
                    $exists: false,
                }
            },
            {
                title: '',
            },
            {
                summary: '',
            },
        ]
    });
    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i];
        let movieData = await fetchmovie(movie);
        if (movieData) {
            let tags = movieData.tags || [];
            movie.tags = movie.tags || [];
            movie.summary = movieData.summary || '';
            movie.title = movieData.alt_title || movieData.title || '';
            movie.rawTitle = movieData.title || '';

            console.log(movieData.attrs);
            if (movieData.attrs) {
                movie.movieTypes = movieData.attrs.movie_type || [];

                movie.year = movieData.attrs.year[0] || 2500;

                for (let i = 0; i < movie.movieTypes.length; i++) {
                    const element = movie.movieTypes[i];

                    let cat = await Category.findOne({
                        name: element,
                    });

                    if (!cat) {
                        cat = new Category({
                            name: element,
                            movies: [movie._id]
                        });
                    } else {
                        if (cat.movies.indexOf(movie._id) === -1) {
                            cat.movies.push(movie._id);
                        }
                    }

                    await cat.save();

                    if (!movie.category) {
                        movie.category.push(cat._id);
                    } else {
                        if (movie.category.indexOf(cat._id) === -1) {
                            movie.category.push(cat._id);
                        }
                    }
                }

                let dates = movieData.attrs.pubdate || [];
                let pubdates = [];
                dates.forEach(item => {
                    if (item && item.split('(').length) {
                        let parts = item.split('(');
                        const date = parts[0];
                        let country = '未知';

                        if (parts[1]) {
                            country = parts[1].split(')')[0];
                        }

                        pubdates.push({
                            date: new Date(date),
                            country,
                        });
                    }
                });
                movie.pubdate = pubdates;
            }

            tags.forEach(tag => {
                movie.tags.push(tag.name);
            });
            // console.log('m', movie);
            await movie.save();
        }
    }
})();
