function About() {
  return (
    <div className='about'>
      <div className='subtitle'>About</div>
      <div className='about__text'>
        This project was made from the ground up by RealAngelFerTorres for The
        Odin Project. The page usage is as follows:
      </div>
      <div className='cardsContainer'>
        <div className='card'>
          <div className='card__upper'>
            <div className='material-icons'>person</div>
            <div className='cardFont--medium'>Users</div>
          </div>
          <div className='cardFont--small'>
            Users can navigate the page without login or register. Registered
            users can interact with the community.
          </div>
        </div>
        <div className='card'>
          <div className='card__upper'>
            <div className='material-icons'>edit_note</div>
            <div className='cardFont--medium'>Posts</div>
          </div>
          <div className='cardFont--small'>
            Registered users can make posts about anything they want. Also, they
            can make drafts (to publish them later), edit or delete created
            posts.
          </div>
        </div>
        <div className='card'>
          <div className='card__upper'>
            <div className='material-icons'>forum</div>
            <div className='cardFont--medium'>Comments</div>
          </div>
          <div className='cardFont--small'>
            Users can comment on posts and reply to that comments. Edit or
            delete comments are available options too.
          </div>
        </div>
        <div className='card'>
          <div className='card__upper'>
            <div className='material-icons'>shift</div>
            <div className='cardFont--medium'>Votes</div>
          </div>
          <div className='cardFont--small'>
            Posts can be upvoted or downvoted. User's karma is defined by votes
            received (positives and negatives).
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
