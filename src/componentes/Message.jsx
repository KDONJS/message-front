import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { sidebarIcons } from './SidebarIcons';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAlt, FaFileArchive, FaFile } from "react-icons/fa";
import emojiFlags from 'emoji-flags';
import './css/message.css';
import { FaShare } from "react-icons/fa";

const users = [
  {
    id: 1,
    name: 'Betty Gregory',
    lastMessage: 'See you soon!',
    time: '1:25 pm',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    messages: [
      { from: 'Betty Gregory', text: 'Hi! How are you?', time: '1:20 pm' },
      { from: 'Yo', text: 'I am good, thanks!', time: '1:21 pm' },
      { from: 'Betty Gregory', text: 'See you soon!', time: '1:25 pm' },
    ]
  },
  {
    id: 2,
    name: 'Garrett Huff',
    lastMessage: 'Thanks!',
    time: '12:10 pm',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    messages: [
      { from: 'Garrett Huff', text: 'Did you finish the project?', time: '12:05 pm' },
      { from: 'Yo', text: 'Yes, I just sent you the files.', time: '12:08 pm' },
      { from: 'Garrett Huff', text: 'Thanks!', time: '12:10 pm' },
    ]
  },
  {
    id: 3,
    name: 'Janie Parker',
    lastMessage: "Let's meet tomorrow.",
    time: '11:00 am',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    messages: [
      { from: 'Janie Parker', text: 'Are you available for a meeting tomorrow?', time: '10:50 am' },
      { from: 'Yo', text: 'Yes, what time works for you?', time: '10:55 am' },
      { from: 'Janie Parker', text: "Let's meet tomorrow.", time: '11:00 am' },
    ]
  },
];

function getFileIcon(file) {
  if (!file) return <FaFile color="#888" size={24} />;
  const ext = file.name.split('.').pop().toLowerCase();
  if (file.type && file.type.startsWith('image/')) return <FaFileImage color="#4caf50" size={24} />;
  if (ext === 'pdf') return <FaFilePdf color="#e53935" size={24} />;
  if (ext === 'doc' || ext === 'docx') return <FaFileWord color="#1976d2" size={24} />;
  if (ext === 'xls' || ext === 'xlsx') return <FaFileExcel color="#388e3c" size={24} />;
  if (ext === 'ppt' || ext === 'pptx') return <FaFilePowerpoint color="#f57c00" size={24} />;
  if (ext === 'zip' || ext === 'rar' || ext === '7z') return <FaFileArchive color="#6d4c41" size={24} />;
  if (ext === 'txt' || ext === 'md' || ext === 'csv') return <FaFileAlt color="#757575" size={24} />;
  return <FaFile color="#888" size={24} />;
}

function replaceFlagsWithImages(text) {
  return text.replace(/([\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF])/g, (match, flag) => {
    const flagData = emojiFlags.data.find(f => f.emoji === flag);
    if (flagData) {
      return `<img src="https://cdnjs.cloudflare.com/ajax/libs/emoji-flags/1.3.0/flags/4x3/${flagData.code.toLowerCase()}.svg" alt="${flagData.name}" title="${flagData.name}" style="width: 1.5em; vertical-align: middle; display: inline-block;" />`;
    }
    return match;
  });
}

const Message = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState(selectedUser.messages);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mainSidebarOpen, setMainSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const textareaRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [tool, setTool] = useState('highlight');
  const [replyTo, setReplyTo] = useState(null);
  const [replyLeaving, setReplyLeaving] = useState(false);
  const touchStartX = useRef(0);
  const [fileAnim, setFileAnim] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const [fileLeaving, setFileLeaving] = useState(false);
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [forwardMsg, setForwardMsg] = useState(null);
  const [selectedForwardUser, setSelectedForwardUser] = useState(null);
  const [actionMenuIdx, setActionMenuIdx] = useState(null);
  const menuRef = useRef();
  const [longPressTimer, setLongPressTimer] = useState(null);

  // Limpieza: No hay variables sin uso. Todas las variables están siendo utilizadas en el componente.

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActionMenuIdx(null);
      }
    }
    if (actionMenuIdx !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionMenuIdx]);

  useEffect(() => {
    setMessages(selectedUser.messages);
  }, [selectedUser]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const maxHeight = parseInt(getComputedStyle(textarea).lineHeight) * 3 + 16;
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [messages, input]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEmojiSelect = (emoji) => {
    setInput(input + emoji.native);
    textareaRef.current.focus();
  };

  const handleForwardClick = (msg) => {
    setForwardMsg(msg);
    setForwardModalOpen(true);
    setSelectedForwardUser(null);
  };

  useEffect(() => {
    if (selectedFile && !imagePreview) {
      setFileAnim(true);
      setTimeout(() => setFileAnim(false), 300);
    }
  }, [selectedFile, imagePreview]);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const handleClipClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImagePreview(null);
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const messageRefs = useRef({});

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === '' && !selectedFile) return;

    let finalImage = imagePreview;
    if (drawingMode) {
      const img = new window.Image();
      img.src = imagePreview;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const drawCanvas = document.getElementById('draw-canvas');
        if (drawCanvas) ctx.drawImage(drawCanvas, 0, 0, img.width, img.height);
        finalImage = canvas.toDataURL();
        sendMessage(finalImage);
        setTimeout(() => textareaRef.current && textareaRef.current.focus(), 0);
      };
      return;
    }
    sendMessage(finalImage);
  };

  // Scroll al mensaje original al hacer click en el reply
  const handleReplyClick = (replyMsg) => {
    if (!replyMsg) return;
    // Busca el índice del mensaje original
    const idx = messages.findIndex(
      m =>
        m.from === replyMsg.from &&
        m.text === replyMsg.text &&
        m.time === replyMsg.time
    );
    if (idx !== -1 && messageRefs.current[idx]) {
      messageRefs.current[idx].scrollIntoView({ behavior: 'auto', block: 'center' });
      const el = messageRefs.current[idx];
      el.classList.add('highlight-reply');
      setTimeout(() => {
        el.classList.remove('highlight-reply');
      }, 500);
    }
  };

  const sendMessage = (finalImage) => {
    let fileObj = null;
    if (selectedFile && !finalImage) {
      fileObj = {
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        type: selectedFile.type,
      };
    }
    const newMessage = {
      from: 'Yo',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: fileObj,
      imagePreview: finalImage,
      replyTo: replyTo,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    setInput('');
    setSelectedFile(null);
    setImagePreview(null);
    setDrawingMode(false);
    setReplyTo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCancelReply = () => {
    setReplyLeaving(true);
    setTimeout(() => {
      setReplyTo(null);
      setReplyLeaving(false);
    }, 350);
  };

  useEffect(() => {
    if (!drawingMode) return;
    const canvas = document.getElementById('draw-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;

    const getStroke = () => {
      if (tool === 'highlight') {
        ctx.globalAlpha = 0.18;
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = 16;
        ctx.globalCompositeOperation = 'source-over';
      } else if (tool === 'pen') {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 3;
        ctx.globalCompositeOperation = 'source-over';
      } else if (tool === 'eraser') {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 18;
        ctx.globalCompositeOperation = 'destination-out';
      }
      ctx.lineCap = 'round';
    };

    const startDraw = (e) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      getStroke();
    };
    const draw = (e) => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      getStroke();
      ctx.stroke();
    };
    const stopDraw = () => {
      drawing = false;
      ctx.closePath();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDraw);
      canvas.removeEventListener('mouseleave', stopDraw);
    };
  }, [drawingMode, tool]);

  return (
    <div className="app-container">
      {isMobile && mainSidebarOpen && (
        <Sidebar
          className="main-sidebar"
          onMensajesClick={() => setMainSidebarOpen(false)}
        />
      )}
      {isMobile && (
        <div
          className={`sidebar-backdrop${sidebarOpen ? '' : ' hide'}`}
          style={{ display: sidebarOpen ? 'block' : 'none' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className={`sidebar${sidebarOpen ? ' sidebar-mobile-open' : ''}`}>
        <div className="sidebar-title-row">
          <div className="sidebar-title">Chats</div>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar"
            title="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="sidebar-search">
          <div className="sidebar-search-box">
            <span className="sidebar-search-icon"><sidebarIcons.buscar /></span>
            <input
              type="text"
              placeholder="Buscar"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="sidebar-search-input"
            />
          </div>
        </div>
        <div className="sidebar-users">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                setSidebarOpen(false);
              }}
              className={`sidebar-user${selectedUser.id === user.id ? ' selected' : ''}`}
            >
              <span className="sidebar-user-name">{user.name}</span>
              <span className="sidebar-user-last">{user.lastMessage}</span>
              <span className="sidebar-user-time">{user.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-panel">
        <div className="chat-header">
          {isMobile && (
            sidebarOpen ? (
              <button
                className="main-sidebar-menu-btn"
                onClick={() => setSidebarOpen(false)}
              >
                ←
              </button>
            ) : (
              <button
                className="main-sidebar-menu-btn"
                onClick={() => setSidebarOpen(true)}
              >
                <sidebarIcons.menu />
              </button>
            )
          )}
          {selectedUser.name}
        </div>

        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              className={`bubble-hover-area${msg.from === 'Yo' ? ' me' : ''}`}
              key={idx}
              ref={el => (messageRefs.current[idx] = el)}
              style={{ position: 'relative' }}
            >
              <div
                className={`chat-bubble${msg.from === 'Yo' ? ' me' : ''}`}
                // SOLO EN MÓVIL: long press para abrir menú
                onTouchStart={isMobile ? (e) => {
                  touchStartX.current = e.touches[0].clientX;
                  const timer = setTimeout(() => {
                    setActionMenuIdx(idx);
                  }, 2000); // 2 segundos
                  setLongPressTimer(timer);
                } : undefined}
                onTouchEnd={isMobile ? (e) => {
                  if (longPressTimer) clearTimeout(longPressTimer);
                  const deltaX = e.changedTouches[0].clientX - touchStartX.current;
                  if (deltaX > 60) {
                    setReplyTo(msg);
                  }
                } : undefined}
              >
                {msg.forwarded && (
                  <div className="forwarded-label">
                    <FaShare style={{ transform: 'scaleX(-1)', marginRight: 4, fontSize: 13, verticalAlign: 'middle' }} />
                    <span>Reenviado</span>
                  </div>
                )}

                {msg.replyTo && (
                  <div
                    className="reply-to"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleReplyClick(msg.replyTo)}
                  >
                    <span className="reply-from">{msg.replyTo.from}:</span>
                    <span className="reply-text">{msg.replyTo.text}</span>
                  </div>
                )}
                <div className="chat-bubble-content">
                  <div
                    className="chat-bubble-text"
                    dangerouslySetInnerHTML={{ __html: replaceFlagsWithImages(msg.text) }}
                    style={{ flex: 1 }}
                  />
                  {/* Botón ⋮ solo en desktop */}
                  {!isMobile && (
                    <button
                      className={`bubble-menu-btn${actionMenuIdx === idx ? ' active' : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        setActionMenuIdx(actionMenuIdx === idx ? null : idx);
                      }}
                      tabIndex={-1}
                      style={{ visibility: 'visible' }}
                    >
                      ⋮
                    </button>
                  )}
                </div>
                <div className="chat-bubble-time">{msg.time}</div>
                {/* Menú de acciones */}
                {actionMenuIdx === idx && (
                  <div
                    className="bubble-action-menu"
                    ref={menuRef}
                    style={{
                      position: 'absolute',
                      top: 0,
                      ...(msg.from === 'Yo'
                        ? { left: 0, right: 'auto', marginLeft: 0, marginRight: 8 }
                        : { left: '100%', marginLeft: 8 }),
                      background: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: 10,
                      boxShadow: '0 4px 16px #0002',
                      zIndex: 10,
                      minWidth: 140,
                      padding: '8px 0'
                    }}
                  >
                    <button className="bubble-action-item" onClick={() => { setReplyTo(msg); setActionMenuIdx(null); }}>Responder</button>
                    <button className="bubble-action-item" onClick={() => { handleForwardClick(msg); setActionMenuIdx(null); }}>Reenviar</button>
                    <button className="bubble-action-item" onClick={() => { /* lógica de reacción */ setActionMenuIdx(null); }}>Reaccionar</button>
                  </div>
                )}

                {msg.imagePreview && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={msg.imagePreview}
                      alt="preview"
                      style={{ maxWidth: 150, borderRadius: 8, cursor: 'pointer' }}
                      onClick={() => setFullscreenImage(msg.imagePreview)}
                    />
                  </div>
                )}
                {msg.file && !msg.imagePreview && (
                  <div
                    className="file-bubble"
                    style={{
                      background: '#f5f5f5',
                      borderLeft: '4px solid #1976d2',
                      borderRadius: 8,
                      padding: '8px 12px',
                      margin: '8px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      maxWidth: 320,
                      boxShadow: '0 1px 4px #0001'
                    }}
                  >
                    {getFileIcon(msg.file)}
                    <a
                      href={msg.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      download={msg.file.name}
                      title={msg.file.name}
                    >
                      {msg.file.name}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {selectedFile && imagePreview && (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              background: 'transparent',
              borderRadius: 16,
              boxShadow: '0 2px 16px #0002',
              width: 380,
              minHeight: 380,
              maxWidth: '90vw',
              maxHeight: '60vh',
              padding: 24,
              zIndex: 10,
            }}
          >
            <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 12, zIndex: 3 }}>
              <button
                type="button"
                title="Resaltador"
                style={{
                  background: tool === 'highlight' ? '#ffe066' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '50%',
                  padding: 8,
                  cursor: 'pointer'
                }}
                onClick={() => { setDrawingMode(true); setTool('highlight'); }}
              >🖍️</button>
              <button
                type="button"
                title="Lápiz"
                style={{
                  background: tool === 'pen' ? '#b3e5fc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '50%',
                  padding: 8,
                  cursor: 'pointer'
                }}
                onClick={() => { setDrawingMode(true); setTool('pen'); }}
              >✏️</button>
              <button
                type="button"
                title="Borrador"
                style={{
                  background: tool === 'eraser' ? '#eee' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '50%',
                  padding: 8,
                  cursor: 'pointer'
                }}
                onClick={() => { setDrawingMode(true); setTool('eraser'); }}
              >🧽</button>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '50%',
                color: '#c00',
                fontSize: 26,
                cursor: 'pointer',
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3
              }}
              aria-label="Eliminar archivo"
              title="Eliminar archivo"
            >
              ✕
            </button>
            <div style={{ position: 'relative', width: 280, height: 280 }}>
              <img
                src={imagePreview}
                alt="preview"
                style={{
                  width: 280,
                  height: 280,
                  objectFit: 'contain',
                  borderRadius: 12,
                  background: 'transparent',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
              />
              {drawingMode && (
                <canvas
                  id="draw-canvas"
                  width={280}
                  height={280}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: 12,
                    cursor: tool === 'eraser' ? 'cell' : 'crosshair',
                    zIndex: 2,
                    width: 280,
                    height: 280,
                    background: 'transparent'
                  }}
                />
              )}
            </div>
          </div>
        )}
        {replyTo && (
          <div className={`reply-preview reply-preview-animate${replyLeaving ? ' reply-preview-leave' : ''}`}>
            <span className="reply-from">{replyTo.from}:</span>
            <span className="reply-text">{replyTo.text}</span>
            <button className="reply-cancel" onClick={handleCancelReply}>✕</button>
          </div>
        )}
        {selectedFile && !imagePreview && (
          <div
            className={`file-preview-animate${fileAnim ? ' file-preview-animate-enter' : ''}${fileLeaving ? ' file-preview-animate-leave' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '12px 0 4px 0',
              fontSize: 15,
              color: '#333',
              width: 'fit-content',
              maxWidth: 320,
              padding: '8px 30px',
            }}
          >
            {getFileIcon(selectedFile)}
            <span
              style={{
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 180,
              }}
              title={selectedFile.name}
            >
              {selectedFile.name}
            </span>
            <button
              type="button"
              onClick={() => {
                setFileLeaving(true);
                setTimeout(() => {
                  setSelectedFile(null);
                  setFileLeaving(false);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }, 300);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#c00',
                fontSize: 18,
                cursor: 'pointer',
                marginLeft: 4,
                padding: 0,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Eliminar archivo"
              title="Eliminar archivo"
            >
              ✕
            </button>
          </div>
        )}
        {forwardModalOpen && (
          <div className="forward-modal">
            <div className="forward-modal-content">
              <div className="forward-modal-header">
                <span>Reenviar mensaje a</span>
                <button onClick={() => setForwardModalOpen(false)}>✕</button>
              </div>
              <input
                type="text"
                placeholder="Buscar"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="forward-modal-search"
              />
              <div className="forward-modal-users">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={`forward-user${selectedForwardUser && selectedForwardUser.id === user.id ? ' selected' : ''}`}
                    onClick={() => setSelectedForwardUser(user)}
                  >
                    <img src={user.avatar} alt={user.name} className="forward-user-avatar" />
                    <span>{user.name}</span>
                  </div>
                ))}
              </div>
              <button
                className="forward-modal-send"
                disabled={!selectedForwardUser}
                onClick={() => {
                  if (!selectedForwardUser) return;
                  const msgToSend = {
                    ...forwardMsg,
                    from: 'Yo',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    forwarded: true
                  };
                  selectedForwardUser.messages.push(msgToSend);
                  setForwardModalOpen(false);
                  setSelectedUser(selectedForwardUser);
                  setTimeout(() => {
                    setMessages(selectedForwardUser.messages);
                    if (messagesEndRef.current) {
                      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 0);
                }}
              >
                Reenviar
              </button>
            </div>
          </div>
        )}
        <form
          className="msg-input-form"
          onSubmit={handleSend}
        >
          <div className="msg-input-box" style={{ width: '100%' }}>
            <button
              type="button"
              className="msg-input-icon emoji"
              onClick={() => setShowEmojiPicker(v => !v)}
              ref={emojiButtonRef}
            >
              <sidebarIcons.emoji />
            </button>
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                style={{
                  position: 'absolute',
                  bottom: '56px',
                  left: 0,
                  zIndex: 10
                }}
              >
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                  previewPosition="none"
                  searchPosition="none"
                  navPosition="top"
                />
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="msg-input"
              rows={1}
              style={{ resize: 'none', overflowY: 'auto' }}
              onKeyDown={e => {
                if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                  setTimeout(() => textareaRef.current && textareaRef.current.focus(), 0);
                }
              }}
            />
            <input
              type="file"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            <button
              type="button"
              className="msg-input-icon clip"
              onClick={handleClipClick}
            >
              <sidebarIcons.clip />
            </button>
          </div>
          <button type="submit" className="msg-btn">
            <span className="msg-btn-icon"><sidebarIcons.enviar /></span>
            <span className="msg-btn-text">Enviar</span>
          </button>
        </form>
      </div>
      {fullscreenImage && (
        <div
          className="fullscreen-image-modal"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Ampliada"
            className="fullscreen-image"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="fullscreen-image-close"
            onClick={() => setFullscreenImage(null)}
            aria-label="Cerrar"
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;