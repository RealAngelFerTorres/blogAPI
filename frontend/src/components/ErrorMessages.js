function ErrorMessages(props) {
  const { errors } = props;

  return (
    <div className='middle'>
      {errors.map((error, index) => {
        return (
          <div className='errorMessages' key={index}>
            {error.msg}
          </div>
        );
      })}
    </div>
  );
}

export default ErrorMessages;
