import { console } from 'inspector';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Only allow a single Cat Coder
    let currentPanel: vscode.WebviewPanel | undefined = undefined;

    const previewCommand = vscode.commands.registerCommand('extension.openPreview', () => {
        if (currentPanel) {
            currentPanel.reveal(vscode.ViewColumn.Two);
        } else {
            const editor = vscode.window.activeTextEditor;
            const document = editor?.document;
            // パネル作成
            currentPanel = vscode.window.createWebviewPanel(
                'filePreview', // 識別子
                'File Preview', // タイトル
                vscode.ViewColumn.Two, // 表示する列
                {
                    enableScripts: true,
                }
            );
            currentPanel.webview.html = getWebViewContent(currentPanel, context.extensionUri);
            // 初期のテキストを送る
            if (document) {
                currentPanel.webview.postMessage({ command: 'updateText', text: document.getText(), uri: document.uri.toString(), fileName: document.fileName });
            }
            // WebViewからのメッセージ受信
            currentPanel.webview.onDidReceiveMessage(
                async message => {
                    switch (message.command) {
                        case 'updateTextOnWebView':
                            const uri = vscode.Uri.parse(message.uri, true);
                            const document = await vscode.workspace.openTextDocument(uri);
                            const fullRange = new vscode.Range(
                                document.positionAt(0),
                                document.positionAt(document.getText().length)
                            );
                            const edit = new vscode.WorkspaceEdit();
                            edit.replace(uri, fullRange, message.text);
                            await vscode.workspace.applyEdit(edit);
                            break;
                    }
                },
                undefined,
                context.subscriptions
            );
            // 閉じられた時の処理
            currentPanel.onDidDispose(
                () => {
                  currentPanel = undefined;
                },
                undefined,
                context.subscriptions
            );
        }
    });
    context.subscriptions.push(previewCommand);

    // アクティブなエディターの変更を監視
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor?.document.fileName.endsWith('.txt')) {
            vscode.commands.executeCommand('setContext', 'showPreviewButton', true);
            if (currentPanel) {
                const document = editor.document;
                currentPanel.webview.postMessage({ command: 'updateText', text: document.getText(), uri: document.uri.toString(), fileName: document.fileName });
            }
        } else {
            vscode.commands.executeCommand('setContext', 'showPreviewButton', false);
        }
    });

    // テキスト編集を監視
    vscode.workspace.onDidChangeTextDocument(e => {
        if (currentPanel) {
            const document = e.document;
            currentPanel.webview.postMessage({ command: 'updateText', text: document.getText(), uri: document.uri.toString(), fileName: document.fileName });
        }
    });

    // 初期化時に現在のエディタを確認
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const isTxtFile = activeEditor.document.fileName.endsWith('.txt');
        vscode.commands.executeCommand('setContext', 'showPreviewButton', isTxtFile);
    } else {
        vscode.commands.executeCommand('setContext', 'showPreviewButton', false);
    }
}

function getWebViewContent(panel : vscode.WebviewPanel, extensionUri : vscode.Uri): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>React WebView</title>
        </head>
        <body>
            <div id="root"></div>
            <script src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'out', 'main.js'))}"></script>
        </body>
        </html>
    `;
}

export function deactivate() {}
