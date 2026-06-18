import { useEffect, useState } from 'react';
import { FALLBACK_EVENT_IMAGE } from '../data/eventImages';

const EventImage = ({
  src,
  alt = '',
  className = '',
  fallback = FALLBACK_EVENT_IMAGE,
  ...props
}) => {
  const [url, setUrl] = useState(src || fallback);

  useEffect(() => {
    setUrl(src || fallback);
  }, [src, fallback]);

  return (
    <img
      {...props}
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (url !== fallback) setUrl(fallback);
      }}
    />
  );
};

export default EventImage;
