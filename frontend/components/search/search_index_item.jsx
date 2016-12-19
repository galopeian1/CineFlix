import React from 'react';
import { Link, withRouter } from 'react-router';
import Modal from 'react-modal';
import EpisodeIndexItem from '../genre/episode_index_item';
import StarRatingComponent from 'react-star-rating-component';
import VideoPlayer from '../video_player/video_player';

class SearchIndexItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      rating: props.title.avg_rating,
      currentVideoId: props.title.episodes[0] ? props.title.episodes[0].video_url : ""
    };

    this.handleMyListClick = this.handleMyListClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.changeCurrentVideoId = this.changeCurrentVideoId.bind(this);
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  changeCurrentVideoId(id) {
    this.setState({ currentVideoId: id});
  }

  handleMyListClick(serie) {
    if (this.isSerieInMyList()) {
      this.props.removeSerieFromMyList(serie);
    } else {
      this.props.addSerieToMyList(serie);
    }
  }

  isSerieInMyList() {
    for (let i = 0; i < this.props.favorites.series.length; i++) {
      if (this.props.favorites.series[i].id === this.props.title.id) {
        return true;
      }
    }
    return false;
  }

  renderMyListToggle() {
    let myListButtonText;
    if (this.isSerieInMyList()) {
      myListButtonText = String.fromCharCode(10003) + " MY LIST";
    } else {
      myListButtonText = String.fromCharCode(65291) + " MY LIST";
    }
    return (
      <button
        className='my-list-button'
        onClick={ () => this.handleMyListClick(this.props.title)}>{myListButtonText}</button>
    );
  }

  render () {
    const customStyles = {
      overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(0, 0, 0, 0.75)',
        transition        : '0.8s'
      },
      content : {
        position                   : 'absolute',
        top                        : '0',
        left                       : '40px',
        right                      : '40px',
        bottom                     : '0',
        background                 : '#141414',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch',
        outline                    : 'none',
        padding                    : '0',
        color                      : 'black',
        width                      : '70%',
        margin                     : '0 auto'
      },
    };

    const episodeIndexItems = this.props.title.episodes.map((episode, id) => {
      return (
        <div key={episode.id} className="episode-group group">
          <EpisodeIndexItem
            episode={episode}
            changeIt={this.changeCurrentVideoId}/>
          <p className="episode-title">
            {episode.episode_number}. {episode.title}
          </p>
          <p className="episode-synopsis">{episode.synopsis}</p>
        </div>
      );
    });

    return (
      <div className="serie-group group">
        <img src={this.props.title.image_url}
          className="serie-image"
          onClick={this.openModal}/>
        <Modal
          className="modal"
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

            <section className="video-player">
              <VideoPlayer videoId={this.state.currentVideoId}/>
            </section>
          <div className="top-modal group">
            <section className="description-info group">
              <p className="serie-title">{this.props.title.title}</p>
              <StarRatingComponent
                name='rating'
                className='rating'
                starCount={5}
                value={this.state.rating}
                onStarClick={this.onStarClick.bind(this)} />
              <p className="serie-year">{this.props.title.year}</p>
              <p className="serie-description">
                {this.props.title.description}
              </p>
            </section>
            <section className="other-details">
              <p>{this.renderMyListToggle()}</p>
              <p className="serie-genres">Genres: {this.props.title.genres}</p>
            </section>
          </div>
          <section className="episode-index-items group">
            {episodeIndexItems}
          </section>
        </Modal>
      </div>
    );
  }
}


export default SearchIndexItem;
