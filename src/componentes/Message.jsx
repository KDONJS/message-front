import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { sidebarIcons } from './SidebarIcons';
import EmojiPicker from 'emoji-picker-react';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaFile } from 'react-icons/fa';

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
  if (!file) return <FaFile />;
  const ext = file.name.split('.').pop().toLowerCase();
  if (file.type && file.type.startsWith('image/')) return <FaFileImage color="#4a90e2" size={24} />;
  if (ext === 'pdf') return <FaFilePdf color="#e74c3c" size={24} />;
  if (ext === 'doc' || ext === 'docx') return <FaFileWord color="#2b579a" size={24} />;
  if (ext === 'txt') return <FaFileAlt color="#888" size={24} />;
  return <FaFile color="#888" size={24} />;
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

  // Nuevos estados para archivos
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [tool, setTool] = useState('highlight');
  const [replyTo, setReplyTo] = useState(null);
  const [replyLeaving, setReplyLeaving] = useState(false);
  const touchStartX = useRef(0);

  // Actualizar mensajes cuando cambia el usuario seleccionado
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

  // Handler para emoji-picker-react
  const handleEmojiSelect = (emojiData) => {
    setInput(input + emojiData.emoji);
    // Ya no cerramos el selector para permitir seleccionar múltiples emojis
    // setShowEmojiPicker(false);
    textareaRef.current.focus();
  };

  // Cierra el picker si se hace clic fuera
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

  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  // Handler para el botón del clip
  const handleClipClick = () => {
    fileInputRef.current.click();
  };

  // Handler para el input file
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

  // Limpia el archivo seleccionado al enviar mensaje
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

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (msg, e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 60) { // Ajusta el umbral si quieres
      setReplyTo(msg);
    }
  };
  const sendMessage = (finalImage) => {
    const newMessage = {
      from: 'Yo',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: selectedFile,
      imagePreview: finalImage,
      replyTo: replyTo,
    };
    
    // Actualizar mensajes del usuario actual
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Actualizar el array de usuarios con los nuevos mensajes
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          messages: updatedMessages,
          lastMessage: input || 'Archivo enviado',
          time: newMessage.time
        };
      }
      return user;
    });
    
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
    }, 350); // Debe coincidir con la duración de la animación
  };

  useEffect(() => {
    if (!drawingMode) return;
    const canvas = document.getElementById('draw-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;

    const getStroke = () => {
      if (tool === 'highlight') {
        ctx.globalAlpha = 0.18; // Más transparente
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
        ctx.globalCompositeOperation = 'destination-out'; // Borra solo lo dibujado
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
      {/* Sidebar principal SOLO en móvil como drawer */}
      {isMobile && mainSidebarOpen && (
        <Sidebar
          open={mainSidebarOpen}
          onClose={() => setMainSidebarOpen(false)}
          className={`main-sidebar${mainSidebarOpen ? ' main-sidebar-mobile-open' : ''}`}
        />
      )}

      {/* Sidebar de chat SOLO en móvil */}
      <div className={`sidebar${sidebarOpen ? ' sidebar-mobile-open' : ''}`}>
        <button
          className="sidebar-close-btn"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>
        <div className="sidebar-title">Chats</div>
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

      {/* Chat panel */}
      <div className="chat-panel">
        <div className="chat-header">
          {/* Botón de menú SOLO en móvil */}
          {isMobile && (
            mainSidebarOpen ? (
              <button
                className="main-sidebar-menu-btn"
                onClick={() => setMainSidebarOpen(false)}
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
            <div className={`bubble-hover-area${msg.from === 'Yo' ? ' me' : ''}`} key={idx}>
              <div
                className={`chat-bubble${msg.from === 'Yo' ? ' me' : ''}`}
                onTouchStart={isMobile ? handleTouchStart : undefined}
                onTouchEnd={isMobile ? (e) => handleTouchEnd(msg, e) : undefined}
              >
                {msg.replyTo && (
                  <div className="reply-to">
                    <span className="reply-from">{msg.replyTo.from}:</span>
                    <span className="reply-text">{msg.replyTo.text}</span>
                  </div>
                )}
                <div className="chat-bubble-text">{msg.text}</div>
                <div className="chat-bubble-time">{msg.time}</div>
                {msg.from !== 'Yo' && (
                  <button
                    className="reply-btn"
                    onClick={() => {
                      setReplyTo(msg);
                      setTimeout(() => textareaRef.current && textareaRef.current.focus(), 0);
                    }}
                    title="Responder"
                    tabIndex={-1}
                  ><sidebarIcons.responder /></button>
                )}
                {/* ...imagen y archivo si existen... */}
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
                  <div style={{ marginTop: 8, fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {getFileIcon(msg.file)}
                    <span>Archivo: {msg.file.name}</span>
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
            {/* Botones de herramientas */}
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
            {/* Botón de eliminar */}
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
        <form
          className="msg-input-form"
          onSubmit={handleSend}
        >
          {/* Previsualización antes de enviar, ahora arriba del input y con botón de eliminar */}
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
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
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
                // Solo en desktop: Enter envía, Shift+Enter hace salto de línea
                if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                  setTimeout(() => textareaRef.current && textareaRef.current.focus(), 0);
                }
              }}
            />
            {/* Input file oculto */}
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