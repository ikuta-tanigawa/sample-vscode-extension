import React, { useState, useEffect, useRef } from 'react';

const vscode = acquireVsCodeApi();

const App: React.FC = () => {
    const [title, setTitle] = useState<string>('init');
    const [text, setText] = useState<string>('');
    const [uri, setUri] = useState<string>('');

    useEffect(() => {
        const handler = (event : MessageEvent) => {
            const message = event.data;
            switch (message.command) {
                case 'updateText':
                    setTitle(message.fileName);
                    setText(message.text);
                    setUri(message.uri);
                    break;
            }
        };
        window.addEventListener('message', handler);
        return () => {
            window.removeEventListener('message', handler);
        };
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (uri !== '') {
            vscode.postMessage({
                command: 'updateTextOnWebView',
                text: e.target.value,
                uri: uri
            })
        }
    };

    return (
        <div>
            <h3>{title}</h3>
            <textarea style={{resize: 'none', width: '100%', height: '80vh'}} value={text} onChange={onChange} />
        </div>
    );
};

export default App;
