function About() {
  return (
    <div className='about'>
      <div className='subtitle'>About</div>
      <div className='post__text'>
        This project was made from scratch by RealAngelFerTorres for The Odin
        Project. The page usage is as follows:
      </div>
      <div className='cardsContainer'>
        <div className='card'>
          <div className='card__upper'>
            <div className='material-icons'>edit_note</div>
            <div className='cardFont--medium'>Post</div>
          </div>
          <div className='cardFont--small'>
            The community can share content by posting news, stories, links,
            announcements, life-hacks, etc.
          </div>
        </div>
        <div className='card'>
          <div className='card__upper'>
            <div className='material-icons'>forum</div>
            <div className='cardFont--medium'>Comment</div>
          </div>
          <div className='cardFont--small'>
            The community comments on posts. Comments provide discussion and
            often humor.
          </div>
        </div>
        <div className='card'>
          <div className='card__upper'>
            <div className='material-icons'>shift</div>
            <div className='cardFont--medium'>Upvote</div>
          </div>
          <div className='cardFont--small'>
            Posts can be upvoted or downvoted. The most interesting content
            rises to the top.
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
