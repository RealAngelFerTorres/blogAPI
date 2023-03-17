function Error(props) {
  const { icon, error } = props;

  return (
    <div className='error'>
      <div className='material-icons icon--XL'>{icon ?? 'cloud_off'}</div>
      <div className='text'>
        {error ?? 'Server is currently offline. Sorry for the inconvenience.'}
      </div>
    </div>
  );
}

export default Error;
