function ErrorPopup(props) {
  const { errors, showErrors, stateChanger } = props;

  const closePopup = (e) => {
    stateChanger(false);
  };

  return (
    <div className={`errorPopupContainer ${showErrors ? 'show' : ''}`}>
      <div className='errorMessages'>
        {errors.map((error, index) => {
          return (
            <div className='error' key={index}>
              • {error.msg}
            </div>
          );
        })}
      </div>
      <div className='right' title='Close' onClick={closePopup}>
        <button className='material-icons icon'>close</button>
      </div>
    </div>
  );
}

export default ErrorPopup;
