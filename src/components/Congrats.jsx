import { useState, useEffect } from 'react';
import '../css/Congrats.css';
import pwUrl from '../assets/imgs/pw.svg';

const SpinningMessage = () => {
  const [animationStage, setAnimationStage] = useState('entering');

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setAnimationStage('exiting');
    }, 3000);

    const removeTimer = setTimeout(() => {
      setAnimationStage('gone');
    }, 4000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (animationStage === 'gone') return null;

  return (
    <div className={`congrats-container ${animationStage}`}>
        <div className="congrats">
          <div className={`image-container ${animationStage}`}>
            <img 
            src={pwUrl} 
            alt="Congratulations, Planeswalker!" 
            className="congrats-img" />
          </div>
          <div className="congrats-text">Maximum Score!</div>
        </div>
    </div>
  );
};

export default SpinningMessage;
