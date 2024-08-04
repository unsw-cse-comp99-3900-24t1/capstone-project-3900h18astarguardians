/**
 * Mapview component - A booking system overlaid over the map - for users to be able to see which room they are booking
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import "../styles/MapView.css"
import "../styles/level3Buttons.css"
import "../styles/level4Buttons.css"
import "../styles/level5Buttons.css"
import { useGlobalContext } from "../utils/context";
import { buttons_level2, buttons_level3, buttons_level4, buttons_level5 } from '../mapData/mapData';



interface MapViewProps {
  currLevel: number;
  setHighlightedRoom: Function;
  switchView: Function;
}

const MapView: React.FC<MapViewProps> = ({ currLevel, setHighlightedRoom, switchView }) => {
  const imageUrl = `http://localhost:5000/l${currLevel}.png`;
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const [_clicks, setClicks] = useState<{ x: number; y: number }[]>([]);
  const { token } = useGlobalContext()

  const allowedHDR = token?.type === "hdr_student" || token?.type === "admin"
  const allowedMeeting = token?.type !== "hdr_student"
  const allowedStaffRoom = token?.type === "cse_staff" || token?.type === "admin"

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (imageContainerRef.current) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setClicks((prevClicks) => {
          const newClicks = [...prevClicks, { x, y }];
          if (newClicks.length === 2) {
            const [firstClick, secondClick] = newClicks;
            const left = Math.min(firstClick.x, secondClick.x);
            const top = Math.min(firstClick.y, secondClick.y);
            const width = Math.abs(secondClick.x - firstClick.x);
            const height = Math.abs(secondClick.y - firstClick.y);
            return [];
          }
          return newClicks;
        });
      }
    };

    const imageContainer = imageContainerRef.current;
    if (imageContainer) {
      imageContainer.addEventListener('click', handleClick);
    }

    return () => {
      if (imageContainer) {
        imageContainer.removeEventListener('click', handleClick);
      }
    };
  }, []);

  const addDynamicButtonBehaviour = (buttons: JSX.Element[]) => {
    let newButtons = buttons;
    newButtons = newButtons.map((button) => {
      return React.cloneElement(button, {
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          setHighlightedRoom(event.currentTarget.id);
          switchView();
        },
      });
    })
  
    newButtons = newButtons.map((button: JSX.Element, index) => {
      const isHotdesk = button.props.className.includes('hotdesk');
      const isMeeting = button.props.className.includes('meeting');
      const isStaff = button.props.className.includes('staff');
  
      let isAllowed = false;
      if (isHotdesk) {
        isAllowed = allowedHDR;
      } else if (isMeeting) {
        isAllowed = allowedMeeting;
      } else if (isStaff) {
        isAllowed = allowedStaffRoom;
      }
  
      const buttonStyle = isAllowed ? { cursor: 'pointer', border: '2px solid green', boxShadow: 'inset 0 0 0 1000px rgba(0,355,0,.2)' } : {cursor: 'not-allowed', border: '2px solid red', boxShadow: 'inset 0 0 0 1000px rgba(355,0,0,.2)' };
      return React.cloneElement(button, {
        style: buttonStyle,
        disabled: !isAllowed,
        key: index,
      });
    });
    return newButtons;
  }

  const newButtonsLevel2 = addDynamicButtonBehaviour(buttons_level2);
  const newButtonsLevel3 = addDynamicButtonBehaviour(buttons_level3);
  const newButtonsLevel4 = addDynamicButtonBehaviour(buttons_level4);
  const newButtonsLevel5 = addDynamicButtonBehaviour(buttons_level5);

  return (
    <Box ref={imageContainerRef} className="image-container" sx={{ position: 'relative' }}>
      <img src={imageUrl} alt="Map" />
      {currLevel === 2 && newButtonsLevel2}
      {currLevel === 3 && newButtonsLevel3}
      {currLevel === 4 && newButtonsLevel4}
      {currLevel === 5 && newButtonsLevel5}
    </Box>
  );
};

export default MapView;