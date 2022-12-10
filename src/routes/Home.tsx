/* eslint-disable jsx-a11y/alt-text */
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { getMovies, IGetMoviesResult } from './../api';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useScroll } from 'framer-motion';
import { theme } from './../theme';

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{bgPhoto:string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)), url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.div`
  font-size: 68px;
  margin-bottom: 20px;
`;

const OverView = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -200px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{bgPhoto:string}>`
  background-color: white;
  background-image: url(${props =>props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
  }
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    opacity: 0;
`;

const BigMovie = styled(motion.div)`
    position:absolute; 
    width: 40vw; 
    height:80vh;
    background-color: red;
    left: 0;
    right: 0;
    margin:  0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-size: 36px;
  position: relative;
  top: -60px;
  padding: 10px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -40px;
  color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: {
    x:window.outerWidth + 10,
  },
  visible: {
    x:0,
  },
  exit: {
    x:-window.outerWidth -10,
  }
}

const BoxVariants = {
  normal: {
    scale:1,
  },
  hover: {
    scale:1.3,
    y:-50,
    transition: {
      delay:0.3,
      type:"tween",
    }
  }
}

const infoVariants = {
  hover: {
    opacity: 1, 
    transition: {
      delay:0.3,
      type:"tween",
    }
  }
}

const offset = 6;

function Home() {
  const history = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const {scrollY} = useScroll();
  const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    if(data) {
      if(leaving) return;
      setLeaving(true);
      
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
  
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  }
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId:number) => {
    history(`/movies/${movieId}`);
  }
  const onOverlayClick = () => history(`/`);
  const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => String(movie.id) ===  bigMovieMatch.params.movieId)

  return (
    <Wrapper>
      {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
              <Title>{data?.results[0].title}</Title>
              <OverView>
                {data?.results[0].overview}
              </OverView>
            </Banner>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row 
                  variants={rowVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit"
                  transition={{type:"tween", duration:1}}
                  key={index} >

                  {data?.results
                        .slice(1)
                        .slice(offset * index, offset * index + offset)
                        .map(movie => (
                          <Box 
                            layoutId={movie.id+""}
                            whileHover="hover"
                            initial="normal"
                            variants={BoxVariants}
                            onClick={() => onBoxClicked(movie.id)}
                            key={movie.id} 
                            transition={{type:"tween"}}
                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                            >
                              <Info variants={infoVariants}>
                                <h4>{movie.title}</h4>
                              </Info>    
                          </Box>
                        ))}
                </Row>  
              </AnimatePresence>             
            </Slider> 
            <AnimatePresence>
              { bigMovieMatch ? (
                 <>
                  <Overlay 
                    onClick={onOverlayClick} 
                    animate={{opacity:1}}
                    exit={{opacity:0}}
                    />
                  <BigMovie 
                    layoutId={bigMovieMatch.params.movieId} 
                    style={{top: scrollY.get() + 60}}
                    >
                      {clickedMovie && <>
                          <BigCover style={{backgroundImage:`linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`}} />
                          <BigTitle>{clickedMovie.title}</BigTitle>
                          <BigOverview>{clickedMovie.overview}</BigOverview>
                        </>}
                  </BigMovie>
                </> 
              ) : null
              }
            </AnimatePresence>
          </>
        )}
    </Wrapper>
  );
}

export default Home;
  
