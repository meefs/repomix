# Claude Code प्लगइन्स

Repomix [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) के लिए आधिकारिक प्लगइन्स प्रदान करता है जो AI-संचालित विकास वातावरण के साथ सहजता से एकीकृत होते हैं। ये प्लगइन्स प्राकृतिक भाषा कमांड का उपयोग करके Claude Code के भीतर सीधे कोडबेस का विश्लेषण और पैकेजिंग करना आसान बनाते हैं।

## उपलब्ध प्लगइन्स

### 1. repomix-mcp (MCP सर्वर प्लगइन)

MCP सर्वर एकीकरण के माध्यम से AI-संचालित कोडबेस विश्लेषण प्रदान करने वाला मूल प्लगइन।

**विशेषताएं:**
- स्थानीय और दूरस्थ रिपॉजिटरी पैक करना
- पैक किए गए आउटपुट खोजना
- अंतर्निहित सुरक्षा स्कैनिंग के साथ फाइलें पढ़ना ([Secretlint](https://github.com/secretlint/secretlint))
- स्वचालित Tree-sitter संपीड़न (लगभग 70% टोकन कमी)

### 2. repomix-commands (स्लैश कमांड प्लगइन)

प्राकृतिक भाषा समर्थन के साथ सुविधाजनक स्लैश कमांड प्रदान करता है।

**उपलब्ध कमांड:**
- `/repomix-commands:pack-local` - विभिन्न विकल्पों के साथ स्थानीय कोडबेस पैक करें
- `/repomix-commands:pack-remote` - दूरस्थ GitHub रिपॉजिटरी पैक और विश्लेषण करें

### 3. repository-explorer (AI विश्लेषण एजेंट प्लगइन)

AI-संचालित रिपॉजिटरी विश्लेषण एजेंट जो Repomix CLI का उपयोग करके कोडबेस को बुद्धिमानी से खोजता है।

**विशेषताएं:**
- प्राकृतिक भाषा में कोडबेस की खोज और विश्लेषण
- बुद्धिमान पैटर्न खोज और कोड संरचना की समझ
- grep और लक्षित फ़ाइल रीडिंग का उपयोग करके चरणबद्ध विश्लेषण
- बड़े रिपॉजिटरी के लिए स्वचालित संदर्भ प्रबंधन

**उपलब्ध कमांड:**
- `/repository-explorer:explore-local` - AI सहायता के साथ स्थानीय कोडबेस का विश्लेषण करें
- `/repository-explorer:explore-remote` - AI सहायता के साथ दूरस्थ GitHub रिपॉजिटरी का विश्लेषण करें

**कैसे काम करता है:**
1. रिपॉजिटरी को पैक करने के लिए `npx repomix@latest` चलाता है
2. आउटपुट को कुशलता से खोजने के लिए Grep और Read टूल का उपयोग करता है
3. अत्यधिक संदर्भ का उपभोग किए बिना व्यापक विश्लेषण प्रदान करता है

## इंस्टॉलेशन

### 1. Repomix प्लगइन मार्केटप्लेस जोड़ें

सबसे पहले, Claude Code में Repomix प्लगइन मार्केटप्लेस जोड़ें:

```text
/plugin marketplace add yamadashy/repomix
```

### 2. प्लगइन्स इंस्टॉल करें

निम्नलिखित कमांड का उपयोग करके प्लगइन्स इंस्टॉल करें:

```text
# MCP सर्वर प्लगइन इंस्टॉल करें (अनुशंसित आधार)
/plugin install repomix-mcp@repomix

# कमांड प्लगइन इंस्टॉल करें (कार्यक्षमता बढ़ाता है)
/plugin install repomix-commands@repomix

# रिपॉजिटरी एक्सप्लोरर प्लगइन इंस्टॉल करें (AI-संचालित विश्लेषण)
/plugin install repository-explorer@repomix
```

::: tip प्लगइन संबंध
`repomix-mcp` प्लगइन को आधार के रूप में अनुशंसित किया जाता है। `repomix-commands` प्लगइन सुविधाजनक स्लैश कमांड प्रदान करता है, जबकि `repository-explorer` AI-संचालित विश्लेषण क्षमताएं जोड़ता है। हालांकि आप उन्हें स्वतंत्र रूप से इंस्टॉल कर सकते हैं, तीनों का उपयोग सबसे व्यापक अनुभव प्रदान करता है।
:::

### विकल्प: इंटरैक्टिव इंस्टॉलेशन

आप इंटरैक्टिव प्लगइन इंस्टॉलर का भी उपयोग कर सकते हैं:

```text
/plugin
```

यह एक इंटरैक्टिव इंटरफ़ेस खोलता है जहां आप उपलब्ध प्लगइन्स ब्राउज़ और इंस्टॉल कर सकते हैं।

## उपयोग के उदाहरण

### स्थानीय कोडबेस पैक करना

प्राकृतिक भाषा निर्देशों के साथ `/repomix-commands:pack-local` कमांड का उपयोग करें:

```text
/repomix-commands:pack-local
इस प्रोजेक्ट को Markdown फॉर्मेट में संपीड़न के साथ पैक करें
```

अन्य उदाहरण:
- "केवल src डायरेक्टरी पैक करें"
- "लाइन नंबर के साथ TypeScript फाइलें पैक करें"
- "JSON फॉर्मेट में आउटपुट जेनरेट करें"

### दूरस्थ रिपॉजिटरी पैक करना

GitHub रिपॉजिटरी का विश्लेषण करने के लिए `/repomix-commands:pack-remote` कमांड का उपयोग करें:

```text
/repomix-commands:pack-remote yamadashy/repomix
yamadashy/repomix रिपॉजिटरी से केवल TypeScript फाइलें पैक करें
```

अन्य उदाहरण:
- "संपीड़न के साथ main ब्रांच पैक करें"
- "केवल दस्तावेज़ीकरण फाइलें शामिल करें"
- "विशिष्ट डायरेक्टरी पैक करें"

### AI के साथ स्थानीय कोडबेस की खोज करें

AI-संचालित विश्लेषण के लिए `/repository-explorer:explore-local` कमांड का उपयोग करें:

```text
/repository-explorer:explore-local ./src
सभी प्रमाणीकरण संबंधी कोड खोजें
```

अन्य उदाहरण:
- "इस प्रोजेक्ट की संरचना का विश्लेषण करें"
- "मुझे मुख्य घटक दिखाएं"
- "सभी API एंडपॉइंट खोजें"

### AI के साथ दूरस्थ रिपॉजिटरी की खोज करें

GitHub रिपॉजिटरी का विश्लेषण करने के लिए `/repository-explorer:explore-remote` कमांड का उपयोग करें:

```text
/repository-explorer:explore-remote facebook/react
मुझे मुख्य घटक आर्किटेक्चर दिखाएं
```

अन्य उदाहरण:
- "रिपॉजिटरी में सभी React हुक खोजें"
- "प्रोजेक्ट संरचना की व्याख्या करें"
- "त्रुटि सीमाएं कहां परिभाषित हैं?"

## संबंधित संसाधन

- [MCP सर्वर दस्तावेज़ीकरण](/guide/mcp-server) - अंतर्निहित MCP सर्वर के बारे में जानें
- [कॉन्फ़िगरेशन](/guide/configuration) - Repomix व्यवहार को अनुकूलित करें
- [सुरक्षा](/guide/security) - सुरक्षा विशेषताओं को समझें
- [कमांड लाइन विकल्प](/guide/command-line-options) - उपलब्ध CLI विकल्प

## प्लगइन सोर्स कोड

प्लगइन सोर्स कोड Repomix रिपॉजिटरी में उपलब्ध है:

- [प्लगइन मार्केटप्लेस](https://github.com/yamadashy/repomix/tree/main/.claude-plugin)
- [MCP प्लगइन](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-mcp)
- [कमांड प्लगइन](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repomix-commands)
- [रिपॉजिटरी एक्सप्लोरर प्लगइन](https://github.com/yamadashy/repomix/tree/main/.claude/plugins/repository-explorer)

## फीडबैक और सहायता

यदि आपको समस्याएं आती हैं या Claude Code प्लगइन्स के लिए सुझाव हैं:

- [GitHub पर issue खोलें](https://github.com/yamadashy/repomix/issues)
- [हमारे Discord समुदाय में शामिल हों](https://discord.gg/wNYzTwZFku)
- [मौजूदा चर्चाएं देखें](https://github.com/yamadashy/repomix/discussions)
