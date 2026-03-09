import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Popover, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Quill snow toolbar icon SVGs (so icons are visible)
const IconBold = () => (
  <svg viewBox="0 0 18 18">
    <path className="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z" />
    <path className="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z" />
  </svg>
);
const IconItalic = () => (
  <svg viewBox="0 0 18 18">
    <line className="ql-stroke" x1="7" x2="13" y1="4" y2="4" />
    <line className="ql-stroke" x1="5" x2="11" y1="14" y2="14" />
    <line className="ql-stroke" x1="8" x2="10" y1="14" y2="4" />
  </svg>
);
const IconUnderline = () => (
  <svg viewBox="0 0 18 18">
    <path className="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3" />
    <rect className="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15" />
  </svg>
);
const IconStrike = () => (
  <svg viewBox="0 0 18 18">
    <line className="ql-stroke ql-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5" />
    <path className="ql-fill" d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z" />
    <path className="ql-fill" d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z" />
  </svg>
);
const IconListOrdered = () => (
  <svg viewBox="0 0 18 18">
    <line className="ql-stroke" x1="7" x2="15" y1="4" y2="4" />
    <line className="ql-stroke" x1="7" x2="15" y1="9" y2="9" />
    <line className="ql-stroke" x1="7" x2="15" y1="14" y2="14" />
    <line className="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5" />
    <path className="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z" />
    <path className="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156" />
    <path className="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109" />
  </svg>
);
const IconListBullet = () => (
  <svg viewBox="0 0 18 18">
    <line className="ql-stroke" x1="6" x2="15" y1="4" y2="4" />
    <line className="ql-stroke" x1="6" x2="15" y1="9" y2="9" />
    <line className="ql-stroke" x1="6" x2="15" y1="14" y2="14" />
    <line className="ql-stroke" x1="3" x2="3" y1="4" y2="4" />
    <line className="ql-stroke" x1="3" x2="3" y1="9" y2="9" />
    <line className="ql-stroke" x1="3" x2="3" y1="14" y2="14" />
  </svg>
);
const IconLink = () => (
  <svg viewBox="0 0 18 18">
    <line className="ql-stroke" x1="7" x2="11" y1="7" y2="11" />
    <path className="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z" />
    <path className="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z" />
  </svg>
);
const IconImage = () => (
  <svg viewBox="0 0 18 18">
    <rect className="ql-stroke" height="10" width="12" x="3" y="4" />
    <circle className="ql-fill" cx="6" cy="7" r="1" />
    <polyline className="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12" />
  </svg>
);
const IconClean = () => (
  <svg viewBox="0 0 18 18">
    <line className="ql-stroke" x1="5" x2="13" y1="3" y2="3" />
    <line className="ql-stroke" x1="6" x2="9.35" y1="12" y2="3" />
    <line className="ql-stroke" x1="11" x2="15" y1="11" y2="15" />
    <line className="ql-stroke" x1="15" x2="11" y1="11" y2="15" />
    <rect className="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14" />
  </svg>
);

const TOOLS = [
  { type: 'bold', className: 'ql-bold', title: 'Bold', content: 'Make the selected text bold.', Icon: IconBold },
  { type: 'italic', className: 'ql-italic', title: 'Italic', content: 'Make the selected text italic.', Icon: IconItalic },
  { type: 'underline', className: 'ql-underline', title: 'Underline', content: 'Underline the selected text.', Icon: IconUnderline },
  { type: 'strike', className: 'ql-strike', title: 'Strikethrough', content: 'Strike through the selected text.', Icon: IconStrike },
  { type: 'list', value: 'ordered', className: 'ql-list', title: 'Numbered list', content: 'Insert a numbered list.', Icon: IconListOrdered },
  { type: 'list', value: 'bullet', className: 'ql-list', title: 'Bulleted list', content: 'Insert a bulleted list.', Icon: IconListBullet },
  { type: 'link', className: 'ql-link', title: 'Link', content: 'Insert or edit a link. Select text first, then click to add a URL.', Icon: IconLink },
  { type: 'image', className: 'ql-image', title: 'Image', content: 'Insert an image. Enter an image URL.', Icon: IconImage },
  { type: 'clean', className: 'ql-clean', title: 'Clear formatting', content: 'Remove formatting from the selected text.', Icon: IconClean },
];

const HEADER_OPTIONS = [
  { key: 'paragraph', label: 'Paragraph', value: false },
  { key: '1', label: 'Heading 1', value: 1 },
  { key: '2', label: 'Heading 2', value: 2 },
  { key: '3', label: 'Heading 3', value: 3 },
];

function ParagraphHeadingDropdown({ quill }) {
  const [currentHeader, setCurrentHeader] = useState(false); // false = paragraph, 1/2/3 = heading

  useEffect(() => {
    if (!quill) return;
    const updateFromSelection = () => {
      // Use getSelection(false) so we never focus the editor when just reading for the dropdown label.
      // getSelection(true) would steal focus from other fields (Title, Short Description, etc.) when user clicks them.
      const range = quill.getSelection(false);
      if (range && range.length >= 0) {
        const format = quill.getFormat(range);
        const header = format.header;
        setCurrentHeader(header === undefined || header === false ? false : header);
      } else {
        setCurrentHeader(false);
      }
    };
    quill.on('selection-change', updateFromSelection);
    updateFromSelection();
    return () => {
      quill.off('selection-change', updateFromSelection);
    };
  }, [quill]);

  const handleMenuClick = ({ key }) => {
    if (!quill) return;
    const option = HEADER_OPTIONS.find((o) => o.key === key);
    if (!option) return;
    quill.format('header', option.value);
    setCurrentHeader(option.value);
  };

  const label = currentHeader === false || currentHeader === undefined
    ? 'Paragraph'
    : `Heading ${currentHeader}`;

  const menu = {
    items: HEADER_OPTIONS.map((opt) => ({
      key: opt.key,
      label: opt.label,
    })),
    onClick: handleMenuClick,
  };

  return (
    <Popover content="Choose paragraph style or heading level (H1, H2, H3)." title="Paragraph & headings" trigger="hover">
      <Dropdown menu={menu} trigger={['click']} placement="bottomLeft">
        <button type="button" className="quill-toolbar-dropdown-trigger" aria-label="Paragraph style">
          <span className="quill-toolbar-dropdown-label">{label}</span>
          <DownOutlined className="quill-toolbar-dropdown-icon" />
        </button>
      </Dropdown>
    </Popover>
  );
}

function ToolButton({ tool, quill }) {
  const Icon = tool.Icon;

  const handleClick = () => {
    if (!quill) return;
    if (tool.type === 'list') {
      quill.format('list', tool.value);
      return;
    }
    if (tool.type === 'link') {
      const url = prompt('Enter the URL:');
      if (url) quill.format('link', url);
      return;
    }
    if (tool.type === 'image') {
      const url = prompt('Enter the image URL:');
      if (url) {
        const range = quill.getSelection(true) || { index: quill.getLength(), length: 0 };
        quill.insertEmbed(range.index, 'image', url);
      }
      return;
    }
    if (tool.type === 'clean') {
      quill.removeFormat(quill.getSelection());
      return;
    }
    quill.format(tool.type, true);
  };

  const popoverContent = <div><p style={{ margin: 0 }}>{tool.content}</p></div>;

  return (
    <Popover content={popoverContent} title={tool.title} trigger="hover">
      <button type="button" className={tool.className} onClick={handleClick} value={tool.value || undefined}>
        {Icon && <Icon />}
      </button>
    </Popover>
  );
}

function Toolbar({ quill }) {
  return (
    <div className="ql-toolbar ql-snow quill-toolbar-with-popover">
      <span className="ql-formats">
        <ParagraphHeadingDropdown quill={quill} />
      </span>
      <span className="ql-formats">
        {TOOLS.filter((t) => ['bold', 'italic', 'underline', 'strike'].includes(t.type)).map((t) => (
          <ToolButton key={t.type} tool={t} quill={quill} />
        ))}
      </span>
      <span className="ql-formats">
        {TOOLS.filter((t) => t.type === 'list').map((t) => (
          <ToolButton key={`list-${t.value}`} tool={t} quill={quill} />
        ))}
      </span>
      <span className="ql-formats">
        {TOOLS.filter((t) => ['link', 'image'].includes(t.type)).map((t) => (
          <ToolButton key={t.type} tool={t} quill={quill} />
        ))}
      </span>
      <span className="ql-formats">
        {TOOLS.filter((t) => t.type === 'clean').map((t) => (
          <ToolButton key={t.type} tool={t} quill={quill} />
        ))}
      </span>
    </div>
  );
}

export default function QuillWithTooltips(props) {
  const quillRef = useRef(null);
  const [quill, setQuill] = useState(null);

  const modules = useMemo(
    () => ({
      ...props.modules,
      toolbar: false,
    }),
    [props.modules]
  );

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 80;
    let blurTimer;

    function tryGetEditor() {
      if (cancelled || attempts >= maxAttempts) return;
      attempts += 1;
      try {
        const editor = quillRef.current?.getEditor?.();
        if (editor) {
          setQuill(editor);
          // Prevent editor from stealing focus on mount so other drawer fields (Title, Short Description, etc.) work
          blurTimer = setTimeout(() => {
            try {
              editor.blur();
            } catch (_) {}
          }, 0);
          return;
        }
      } catch (_) {}
      setTimeout(tryGetEditor, 50);
    }
    const t = setTimeout(tryGetEditor, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
      if (blurTimer) clearTimeout(blurTimer);
    };
  }, []);

  return (
    <div className="quill-with-tooltips">
      <Toolbar quill={quill} />
      <ReactQuill ref={quillRef} {...props} modules={modules} />
    </div>
  );
}
