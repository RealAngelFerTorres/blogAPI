import { useNavigate } from 'react-router-dom';

function BottomBar() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const navigate = useNavigate();
  const goToAbout = () => {
    navigate('/about');
  };
  const goToFAQ = () => {
    navigate('/faq');
  };
  const goToContact = () => {
    navigate('/contact');
  };
  const goToGithub = () => {
    window.open('https://github.com/RealAngelFerTorres');
  };

  return (
    <div className='bottomBar'>
      <div className='bottomBarOptions'>
        <div
          className='option sign'
          onClick={goToGithub}
          title='https://github.com/RealAngelFerTorres'
        >
          Web design by RealAngelFerTorres
        </div>
        <div className='option' onClick={goToAbout}>
          ABOUT
        </div>
        <div className='option' onClick={goToFAQ}>
          FAQ
        </div>
        <div className='option' onClick={goToContact}>
          CONTACT
        </div>
        <div
          className='option material-icons'
          id='upArrow'
          onClick={scrollToTop}
        >
          arrow_upward
        </div>
      </div>
    </div>
  );
}

export default BottomBar;
