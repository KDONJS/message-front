// @ts-nocheck
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export const EmojiPicker = (props) => {
  return (
    <Picker 
      data={data} 
      {...props} 
    />
  );
};

export default EmojiPicker;