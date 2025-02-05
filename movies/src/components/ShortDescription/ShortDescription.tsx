import React, { useEffect, useRef, useState } from 'react';

import { ShortDescriptionProps } from '../Types/types';
import './ShortDescription.css'

const ShortDescription: React.FC<ShortDescriptionProps> = ({ description }) => {
  const [truncatedDescription, setTruncatedDescription] = useState(description);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const tempElementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const tempElement = tempElementRef.current;
    if (container && tempElement) {
      const containerHeight = container.offsetHeight;
      let truncated = description;

      tempElement.textContent = description;
      const fullHeight = tempElement.offsetHeight;

      if (fullHeight <= containerHeight) {
        setTruncatedDescription(description);
      } else {
        let endIndex = description.length;
        while (endIndex > 0 && tempElement.offsetHeight > containerHeight) {
          truncated = description.substring(0, endIndex) + ' ' + '...';
          tempElement.textContent = truncated;
          endIndex--;
        }
        setTruncatedDescription(truncated);
      }
    }
  }, [description]);

  return (
    <div>
      <p ref={containerRef} className="description-container">
        {truncatedDescription}
      </p>
      <span ref={tempElementRef} style={{visibility: 'hidden', position: 'absolute', whiteSpace: 'normal' }}></span>
    </div>
  );
};

export default ShortDescription;