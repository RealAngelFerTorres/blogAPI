import { useState } from 'react';
import githubIcon from '../images/GitHubIcon.png';

function Contact() {
  const [isShowing, setIsShowing] = useState(false);

  const changeShow = () => {
    setIsShowing(true);
  };

  return (
    <div className='contact'>
      <div className='subtitle'>Contact</div>
      <div className='card__contact'>
        <div>
          <div className='material-icons'>email</div>
          <div className='cardFont--small'>Email</div>
        </div>
        {isShowing ? (
          <a className='cardFont--medium' href='mailto:angelftorres@gmail.com'>
            angelftorres@gmail.com
          </a>
        ) : (
          <div className='button--grey' onClick={changeShow}>
            Show email
          </div>
        )}
      </div>
      <div className='card__contact'>
        <div>
          <div
            className='devicon-github-original githubIcon--contact'
            src={githubIcon}
            alt='GitHub icon'
          ></div>
          <div className='cardFont--small'>GitHub</div>
        </div>
        <a
          className='cardFont--medium'
          href='https://github.com/RealAngelFerTorres'
        >
          RealAngelFerTorres
        </a>
      </div>
    </div>
  );
}

export default Contact;
