import React, { useEffect, useState } from 'react'
import axios from 'axios'
import YouTube from 'react-youtube';
import './App.css';

function App() {
    // constantes iniciales
    const API_URL = "https://api.themoviedb.org/3"
    const API_KEY = "3873cc61d5bf5f09cc7eb5d0c45e9ee6"
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original"
    const URL_IMAGE = "https://image.tmdb.org/t/p/original"

    // variables de estado
    const [movies, setMovies] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [trailer, setTrailer] = useState(null);
    const [movie, setMovie] = useState({ title: "Loading Movies" });
    const [playing, setPlaying] = useState(false);

    // funcion para realizar la peticion a la API
    const fetchMovies = async (searchKey) => {
        const type = searchKey ? "search" : "discover"
        const { data: { results },
        } = await axios.get(`${API_URL}/${type}/movie`, {
            params: {
                api_key: API_KEY,
                query: searchKey,
            },
        });

        setMovies(results)
        setMovie(results[0])
        if(results.length){
            await fetchMovie(results[0].id)
        }

    }

    const selectMovie = async(movie)=>{
        fetchMovie(movie.id)
        setMovie(movie)
        window.scrollTo(0,0)
    }
    //funcion para buscar peliculas
    const searchMovies = (e)=>{
        e.preventDefault();
        fetchMovies(searchKey)
    }

    // funcionpara la peticion de un solo objeto y mostrar en reproductor de video
    const fetchMovie = async(id)=>{
        const {data} = await axios.get(`${API_URL}/movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos",
            },
        });

        if(data.videos && data.videos.results){
            const trailer = data.videos.results.find(
                ( vid ) => vid.name === "Official Trailer" 
            )
            setTrailer(trailer ? trailer : data.videos.results[0])
        }
        setMovie(data)
    }

    useEffect(() => {
        fetchMovies();
    }, []);

    return (
        <div>
            {/* nav */}
            <nav>
                <div className="navbar">
                    <div className="navbar-brand">
                        <h1>Trailer Movies</h1>
                    </div>
                    {/* buscadoor */}
                    <form className='' onSubmit={searchMovies}>
                        <input
                            className='inputSearch'
                            type={'text'}
                            placeholder='  search...'
                            onChange={(e) => setSearchKey(e.target.value)}>
                        </input>
                        <button className='btnSearch'>search</button>
                    </form>
                </div>
            </nav>
                
            {/* contenedor del baner y reproductor de trailer*/}
            <div>
                <main>
                    {movie ? (
                        <div
                            className='viewtrailer'
                            style={{
                                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
                            }}
                            >
                        {playing ? (
                            <>
                            <YouTube
                                videoId={trailer.key}
                                className='reproductor container'
                                apts={{
                                    width:"100%",
                                    height:"100%",
                                    playerVars:{
                                        autoplay: 1,
                                        controls: 0 ,
                                        cc_load_policy:0,
                                        fs: 0,
                                        iv_load_policy: 0,
                                        modestbranding:0,
                                        rel: 0,
                                        showinfo:0,
                                    },

                                }}
                            />
                            <button onClick={()=>setPlaying(false)} className='botonn'>
                                close
                            </button>
                            </>
                        ) : (
                            <div className='containertra'>
                                <div className=''>
                                    {trailer ? (
                                        <button
                                            className='boton'
                                            onClick={()=>setPlaying(true)}
                                            type="button"
                                            >
                                                Play Trailer
                                            </button>
                                        ):(
                                            "Sorry, no trailer available"
                                        )}
                                        <h1 className='text-white'>{movie.title}</h1>
                                        <p className='text-white'>{movie.overview}</p>
                                    </div>
                                </div>
                        )}
                        </div>
                    ) : null}
                </main>
            </div>


            <div className='maa'>
            <h2 className='text-center mb-5 maa'>Trailer movies</h2>

            {/* contenedor que muestra poster de peliculas actualez */}
            <div  className="containerrr mt-3">
                <div className="row">
                    {movies.map((movie) => (
                        <div key={movie.id} className="col-md-4 mb-3" onClick={() => selectMovie(movie)}>
                            <img src={`${URL_IMAGE + movie.poster_path}`} alt={movie.title} className="movie-img" />
                            <h4 className='text-center movie-title'>{movie.title}</h4>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
    );
}

export default App;
