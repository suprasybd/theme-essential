import React from 'react';
import {
  useSelected,
  useFocused,
  useEditor,
  ReactEditor,
  useSlateStatic,
} from 'slate-react';
import { Transforms } from 'slate';
import useResize from '../../utils/customHooks/useResize.ts';
import { Scale3D } from 'lucide-react';
import './Embed.css';

const Image = ({ attributes, element, children }) => {
  const { url, alt, width, height } = element;
  const selected = useSelected();
  const focused = useFocused();
  const [size, onMouseDown] = useResize(width, height);
  const editor = useSlateStatic();

  // Persist width and height when size changes
  React.useEffect(() => {
    if (true) {
      const path = ReactEditor.findPath(editor, element);
      console.log('nodes path', path);
      Transforms.setNodes(
        editor,
        { width: size.width, height: size.height },
        { at: path }
      );
    }
  }, [size]);

  return (
    <div
      {...attributes}
      className="embed"
      style={{
        display: 'flex',
        boxShadow: selected && focused && '0 0 3px 3px lightgray',
      }}
      {...element.attr}
    >
      <div
        contentEditable={false}
        style={{
          // maxWidth: '100%',
          // maxHeight: '100%',
          maxWidth: `${size.width}px`,
          maxHeight: `${size.height}px`,
          overflow: 'hidden',
        }}
      >
        <img
          alt={alt}
          src={url}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      {children}
    </div>
  );
};

export default Image;
