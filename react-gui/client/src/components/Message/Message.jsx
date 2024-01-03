import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


import styles from "../Message/Message.module.css";

const botAvatar = "/botIcon.png";

export default function Message({ userPhoto, message, source_contracts }) {
  const sender = message.role;
  const content = message.content;
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  if (sender === "assistant" && source_contracts && source_contracts.length > 0) {
    console.log('Source contracts:', source_contracts);
  }

  return (
    <div className={sender === "assistant" ? styles.botMessageWrapper : styles.messageWrapper}>
      <div className={styles.messageContainer}>
        <img src={sender === "assistant" ? botAvatar : userPhoto} alt={`${sender}'s avatar`} className={styles.avatar} />
        <ReactMarkdown components={components} className={styles.message}>
          {typeof content === 'string' ? content : JSON.stringify(content)}
        </ReactMarkdown>
      </div>
    </div>
  );
}