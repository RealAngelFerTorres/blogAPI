function ErrorPopup(props) {
  const { errors, showErrors, stateChanger } = props;

  const closePopup = (e) => {
    stateChanger(false);
  };

  return (
    <div className={`errorPopupContainer ${showErrors ? 'show' : ''}`}>
      <div className='upper' title='Close' onClick={closePopup}>
        <button className='material-icons icon'>close</button>
      </div>
      <div className='middle'>
        {errors.map((error, index) => {
          return (
            <div className='errorMessages' key={index}>
              • {error.msg}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ErrorPopup;
