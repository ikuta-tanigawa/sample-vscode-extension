import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const previewCommand = vscode.commands.registerCommand('extension.openPreview', () => {
        const panel = vscode.window.createWebviewPanel(
            'filePreview', // 識別子
            'File Preview', // タイトル
            vscode.ViewColumn.Two, // 表示する列
            {
                enableScripts: true,
            }
        );
        panel.webview.html = getWebViewContent(panel, context.extensionUri);
    });
    context.subscriptions.push(previewCommand);

    // アクティブなエディターの変更を監視
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor?.document.fileName.endsWith('.txt')) {
            vscode.commands.executeCommand('setContext', 'showPreviewButton', true);
        } else {
            vscode.commands.executeCommand('setContext', 'showPreviewButton', false);
        }
    });
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

/*
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.getTextContent', () => {
        // 現在アクティブなエディターを取得
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            // ドキュメントの内容を取得
            const document = editor.document;
            const text = document.getText();

            // コンソールに出力
            console.log('Current file content:', text);

            // メッセージ表示（オプション）
            vscode.window.showInformationMessage('Content retrieved. Check the console.');
        } else {
            vscode.window.showErrorMessage('No active editor found.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
*/