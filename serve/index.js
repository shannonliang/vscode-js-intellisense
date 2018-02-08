const {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    TextDocumentSyncKind,
    CompletionItemKind
} = require("vscode-languageserver");
const fs = require("fs");
// Creates the LSP connection
const connection = createConnection(ProposedFeatures.all);
// Create a manager for open text documents
const documents = new TextDocuments();

// The workspace folder this server is operating on

documents.onDidOpen(event => {
    connection.console.log(
        `[Server(${process.pid}) Document opened: ${event.document.uri}`
    );
});
documents.listen(connection);

//文件内容改动 , 可做代码检测
documents.onDidChangeContent(change => {
    // console.log(change);
    validateTextDocument(change.document);
});
var workspacePath = "D:\\web\\mobile\\afp\\js\\_ccj_\\aa",
    initIntellisenseFiles = [],
    initIntellisenseList = [
        {
            label: "shannonliang",
            kind: CompletionItemKind.Text,
            data: 1
        }
    ],
    curIntellisenseIndex = 0,
    keyWordsByObj = [],
    curLineIntellisenseList = [];

function initIntellisenseCompletionList() {
    findAllFile(workspacePath);
    readAllFile(initIntellisenseFiles);
    console.log('write initIntellisenseList: ');
    console.log(initIntellisenseList);
    console.log('end write initIntellisenseList');
}
function validateTextDocument(textDocument){
    let lines = textDocument.getText().split(/\r?\n/g);
    if(lines.length == 0){
        return;
    }
    let linesLen = lines.length;
    let lastLine = lines[linesLen - 1];
    console.log('当前输入行的内容：' + lastLine);
    let curchart = lastLine[lastLine.length-1];
    if(curchart == '.'){
        let wordsobj = lastLine.match(/\w{3,}(\w|\.)*/ig);
    
        let lastWordObj = wordsobj[wordsobj.length - 1];
        let wordArr = lastWordObj.split('.');
        
        for(var i=0;wordArr && i<wordArr.length;i++){

        }

    }
    
    console.log('当前输入的值：' + curchart);
}
function findAllFile(dir) {
    if(isFile(dir)){
        initIntellisenseFiles.push(dir);
        return;
    }
    var dirArr = fs.readdirSync(dir),
        _thisfn = arguments.callee;
    dirArr.forEach(function (v, i) {
        if (!v.startsWith('.')) {
            var tempdir = dir + '\\' + v;
            if (isFile(tempdir) && tempdir.endsWith('.js')) {
                initIntellisenseFiles.push(tempdir)
            } else if (isDirectory(tempdir)) {
                _thisfn(tempdir);
            }
        }
    });
}

function readAllFile(files) {
    console.log(files);
    var _jsWords = {
        "require":1,
        "define":1,
        "break": 1,
        "case": 1,
        "catch": 1,
        "continue": 1,
        "default": 1,
        "delete": 1,
        "do": 1,
        "else": 1,
        "finally": 1,
        "for": 1,
        "function": 1,
        "if": 1,
        "in": 1,
        "instanceof": 1,
        'new': 1,
        "return": 1,
        "switch": 1,
        "this": 1,
        "throw": 1,
        "try": 1,
        "typeof": 1,
        "var": 1,
        "void": 1,
        "while": 1,
        "with": 1
    },keyWords = [];
    for (var i = 0; i < files.length; i++) {
        var file = files[i],
            fileDataString = readFile(file),
            words = fileDataString.match(/\w{3,}/ig),
            wordsobj = fileDataString.match(/\w{3,}(\w|\.)*/ig);//解析成带对象索引的字符串
        if (!words) {
            continue;
        }
        // console.log('start resolve filename :' + file);

        var newWords = Array.from(new Set(words));
        keyWordsByObj = keyWordsByObj.concat(wordsobj);
        keyWords = keyWords.concat(newWords);

        // console.log('end resolve filename :' + file);
    }
    for(var i=0;i<keyWords.length;i++){
        let key = keyWords[i];
        if(!_jsWords[key] && !(/^[0-9]/.test(key))){
            _jsWords[key] = 1;
            addIntellisenseItem(key);
        }
    }
    for(var i=0;i<keyWordsByObj.length;i++){
        let keys = keyWordsByObj[i],
            keyArr = keys.split('.');
        for(var j=0;j<keyArr.length;j++){
            
        }

    }
    console.log( '智能提示解析的关键字的长度：'+initIntellisenseList.length);
}

function addIntellisenseItem(text) {
    curIntellisenseIndex ++;
    var item = {
            label: text,
            kind: CompletionItemKind.Text,
            data: curIntellisenseIndex
        };
    initIntellisenseList.push(item);
}

function isDirectory(fileName) {
    if (fs.existsSync(fileName)) return fs.statSync(fileName).isDirectory();
}

function isFile(fileName) {
    if (fs.existsSync(fileName)) return fs.statSync(fileName).isFile();
}

function readFile(fileName) {
    if (fs.existsSync(fileName)) return fs.readFileSync(fileName, "utf-8");
}

//初始化设置
connection.onInitialize(params => {
    workspacePath = params.rootPath;
    connection.console.log(
        `[Server(${process.pid}) Started and initialize received,path  ${workspacePath}`
    );
    initIntellisenseCompletionList();
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: [".", ":", "<", '"', "/", "@", "*"]
            },
            documentFormattingProvider: true,
            // hoverProvider: true,
            documentHighlightProvider: true,
            documentSymbolProvider: true,
            definitionProvider: true,
            referencesProvider: true,
            colorProvider: true
        }
    };
});
//监听鼠标滑过事件
// connection.onHover(textDocumentPosition => {
//     const document = documents.get(textDocumentPosition.textDocument.uri);
//     console.log(document);
// });

connection.onDocumentSymbol(documentSymbolParms => {
    const document = documents.get(documentSymbolParms.textDocument.uri);
    // console.log(document);
});
//监听定义
connection.onDefinition(definitionParams => {
    const document = documents.get(definitionParams.textDocument.uri);
    console.log(definitionParams, "definitionParams");
});
//文档引用
connection.onReferences(referenceParams => {
    const document = documents.get(referenceParams.textDocument.uri);
    console.log(referenceParams, "referenceParams");
});

//文档格式化
connection.onDocumentFormatting(formatParams => {
    const document = documents.get(formatParams.textDocument.uri);
    console.log(formatParams, "formatParams");
});

connection.onDocumentHighlight(documentHighlightParams => {
    const document = documents.get(documentHighlightParams.textDocument.uri);
    console.log('onDocumentHighlight');
});

//智能感知部分开始
connection.onCompletion(TextDocumentPositionParams => {
    console.log(TextDocumentPositionParams, "TextDocumentPositionParams");
    // let curLineIndex = TextDocumentPositionParams.position.line;
    // let curLineCharIndex = TextDocumentPositionParams.position.character;

    return initIntellisenseList;
});
connection.onCompletionResolve(item => {
    if (item.data === 1) {
        (item.detail = "TypeScript details"),
        (item.documentation = "TypeScript documentation");
    } else if (item.data === 2) {
        (item.detail = "JavaScript details"),
        (item.documentation = "JavaScript documentation");
    }
    return item;
});
//智能感知部分结束
connection.listen();