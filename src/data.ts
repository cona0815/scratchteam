export const VALID_STUDENTS = [
  "40108",
  "40320",
  "40321",
  "40509",
  "41021",
  "41108",
  "41308",
  "41204",
];

export interface CourseItem {
  id: number;
  chapter: string;
  title: string;
  shortTitle: string;
  description: string;
  videoId: string;
  startTime: number;
  mermaidCode?: string;
  learningPoints?: string[];
  link?: string;
}

export const courseData: CourseItem[] = [
  {
    id: 1,
    chapter: "第1課",
    title: "人物 - 臉型",
    shortTitle: "臉型",
    description:
      "學習使用「橢圓形」工具畫出基礎頭部，接著使用最重要的「變形工具（重新塑形）」，調整兩側的控制點（節點），就能輕鬆捏出可愛的臉頰（腮幫子）或各種獨特的臉型！",
    videoId: "_H-qZ4_QQsM",
    startTime: 5,
  },
  {
    id: 2,
    chapter: "第1課",
    title: "人物 - 髮型塑形",
    shortTitle: "髮型塑形",
    description:
      "頭髮是角色的靈魂！先畫一個大的橢圓形（像馬桶蓋），再利用「變形工具（重新塑形）」點出節點，將節點轉換為「尖角」就能拉出帥氣或可愛的瀏海。",
    videoId: "_H-qZ4_QQsM",
    startTime: 116,
  },
  {
    id: 3,
    chapter: "第1課",
    title: "人物 - 身體與圖層",
    shortTitle: "身體與圖層",
    description:
      "Q版人物的特特色是「頭大身體小」（二頭身）。用簡單的長方形畫出身體後，最重要的一步是使用「移到最下層」功能，讓身體藏在頭部下方，這樣接縫才會自然。",
    videoId: "_H-qZ4_QQsM",
    startTime: 400,
  },
  {
    id: 4,
    chapter: "第1課",
    title: "表情 - 喜怒哀樂設計",
    shortTitle: "喜怒哀樂",
    description:
      "千萬不要重畫！直接對原本的角色按右鍵「複製」造型。利用變形工具修改嘴巴的弧度（開心變半圓、難過嘴角下垂），或調整眼睛的形狀，就能輕鬆做出各種生動的表情。",
    videoId: "WzzlpcN4vL4",
    startTime: 0,
  },
  {
    id: 5,
    chapter: "第2課",
    title: "簡易標題字",
    shortTitle: "簡易標題字",
    description:
      "學習如何在 Scratch 中設計專屬的標題字！透過文字工具輸入文字後，利用顏色搭配、複製並稍微錯位來製作出「陰影」或「立體」效果，讓你的作品封面更加專業吸睛。",
    videoId: "Q-P1e6ryrrg",
    startTime: 0,
  },
  {
    id: 6,
    chapter: "第2課",
    title: "簡易標題動態效果1-放大",
    shortTitle: "動態效果-放大",
    description:
      "為你的標題加上生動的放大效果！學習使用 Scratch 的「尺寸」積木，搭配重複執行的迴圈，讓原本靜態的文字瞬間充滿活力，一出場就吸引大家的目光。",
    videoId: "4TOoorTeh1c",
    startTime: 0,
  },
  {
    id: 7,
    chapter: "第3課",
    title: "動態按鈕設計(4種)",
    shortTitle: "動態按鈕",
    description:
      "學習在 Scratch 中設計四種不同的動態按鈕！利用「碰到滑鼠游標」與「滑鼠被按下」等偵測積木，讓按鈕在滑鼠經過或點擊時產生變色、放大或移動等豐富的互動效果，大幅提升專案的遊戲感。",
    videoId: "mC5w9-f53g4",
    startTime: 0,
  },
  {
    id: 8,
    chapter: "第4課",
    title: "常用物件繪製-塑膠袋",
    shortTitle: "塑膠袋",
    description:
      "學習如何利用 Scratch 的繪圖工具，畫出生活常見的塑膠袋形狀。透過變形工具拉出不規則的邊緣與皺褶，運用簡單的線條表現出塑膠材質的輕透感。",
    videoId: "zhYpboRXsfM",
    startTime: 0,
  },
  {
    id: 9,
    chapter: "第4課",
    title: "常用物件繪製-寶特瓶",
    shortTitle: "寶特瓶",
    description:
      "練習畫出立體的寶特瓶！從瓶蓋、瓶身到標籤，逐步拆解寶特瓶的結構。學會使用幾何圖形組合與圖層堆疊技巧，讓寶特瓶看起來更生動。",
    videoId: "wVFfsmrJCeI",
    startTime: 0,
  },
  {
    id: 10,
    chapter: "第4課",
    title: "常用物件繪製-紅蘿蔔與火車",
    shortTitle: "紅蘿蔔與火車",
    description:
      "挑戰稍微複雜的物件組合！畫出帶有葉子的紅蘿蔔，以及結構豐富的可愛小火車。這個階段將幫助你綜合運用各種形狀的拼貼與節點變形技巧。",
    videoId: "-1MbaAMyH5A",
    startTime: 0,
  },
  {
    id: 11,
    chapter: "第4課",
    title: "常用物件繪製-海星",
    shortTitle: "海星",
    description:
      "學習畫出海底世界不可或缺的海星！練習從一個簡單的多邊形開始，利用變形工具拉出五個觸角，並加上漸層與斑點細節，讓海星更有立體感。",
    videoId: "zUqBJaWUAcM",
    startTime: 0,
  },
  {
    id: 12,
    chapter: "第5課",
    title: "背景一般繪製",
    shortTitle: "一般背景",
    description:
      "學習如何為你的 Scratch 專案繪製專屬背景！運用基本的幾何圖形與填色工具，畫出天空、草地與簡單的自然場景，讓你的角色有一個完美的舞台。",
    videoId: "6ZJmXjef694",
    startTime: 0,
  },
  {
    id: 13,
    chapter: "第5課",
    title: "背景海灘繪製",
    shortTitle: "海灘場景",
    description:
      "進階背景繪製挑戰！跟著教學一步步畫出充滿夏日風情的海灘場景。學習利用漸層色表現海水的深淺，以及如何加上雲朵、沙灘等細節，讓畫面更加豐富生動。",
    videoId: "nB92nMmS4r8",
    startTime: 0,
  },
  {
    id: 14,
    chapter: "第6課",
    title: "訊息整合以運動會為例",
    shortTitle: "訊息整合",
    description:
      "學習如何運用 Scratch 的「廣播訊息」功能整合專案！以運動會為主題，練習讓不同的角色透過接收訊息來觸發動作，完成跨角色、跨背景的互動設計。請參考下方的流程圖來理解訊息的傳遞過程。",
    videoId: "",
    startTime: 0,
    mermaidCode: `graph TD
classDef trigger fill:#e0e7ff,stroke:#6366f1,stroke-width:2px,color:#1e1b4b,font-weight:bold,rx:10px,ry:10px;
classDef msg fill:#fee2e2,stroke:#ef4444,stroke-width:2px,color:#7f1d1d,font-weight:bold,rx:10px,ry:10px;
classDef sprite fill:#f1f5f9,stroke:#94a3b8,stroke-width:2px,color:#334155,font-weight:bold,rx:8px,ry:8px;
classDef action fill:#ffffff,stroke:#e2e8f0,stroke-width:1px,color:#475569,rx:8px,ry:8px;

StartEvent(["🖱️ 玩家點擊「開始」按鈕角色"]):::trigger --> Msg1{{"📢 廣播訊息：選手就位"}}:::msg

Msg1 --> S_Title["標題角色"]:::sprite
Msg1 --> S_Boy1["男生角色"]:::sprite
Msg1 --> S_Girl1["女生角色"]:::sprite
Msg1 --> S_Mascot1["吉祥物角色"]:::sprite

S_Title -.-> A_Title1["動作：隱藏"]:::action
S_Boy1 -.-> A_Boy1["動作：走到起點、說明操作按鍵、變數設為不能跑"]:::action
S_Girl1 -.-> A_Girl1["動作：走到起點、說明操作按鍵、變數設為不能跑"]:::action
S_Mascot1 -.-> A_Mascot1["動作：出現並喊各就位 ➔ 預備 ➔ 起跑槍聲 (Go!)"]:::action

A_Mascot1 --> Msg2{{"📢 廣播訊息：開始"}}:::msg

Msg2 --> S_Boy2["男生角色"]:::sprite
Msg2 --> S_Girl2["女生角色"]:::sprite

S_Boy2 -.-> A_Boy2["動作：變數解鎖 (可以開始交替按 Z、X 跑步)"]:::action
S_Girl2 -.-> A_Girl2["動作：變數解鎖 (可以開始交替按 1、2 跑步)"]:::action

A_Boy2 --> Racing((("🏃 玩家瘋狂按鍵賽跑中 🏃‍♀️"))):::trigger
A_Girl2 --> Racing

Racing --> Condition{"任一選手碰到「終點」?"}:::trigger
Condition -- 是的 --> Msg3{{"📢 廣播訊息：比賽結束"}}:::msg

Msg3 --> S_Boy3["男生角色"]:::sprite
Msg3 --> S_Girl3["女生角色"]:::sprite
Msg3 --> S_Mascot2["吉祥物角色"]:::sprite

S_Boy3 -.-> A_Boy3["動作：變數鎖定不能跑 (贏家多喊一聲：我贏了)"]:::action
S_Girl3 -.-> A_Girl3["動作：變數鎖定不能跑 (贏家多喊一聲：我贏了)"]:::action
S_Mascot2 -.-> A_Mascot2["動作：顯示過關成績「你的紀錄是 {計時器}」 <br> 🛑 停止全部程式"]:::action`,
    learningPoints: [
      "**準備階段 (選手就位)**：由「按鈕」發號施令，大家各自收拾畫面（標題隱藏）、回到起點準備，吉祥物出來主持大局。",
      "**遊戲階段 (開始)**：由「吉祥物」喊完口令後發布，這就像是解除封印，讓兩個選手的變數改變，終於可以接受鍵盤的控制往前跑。",
      "**結算階段 (比賽結束)**：由「先碰到終點的選手」發出，告訴全場比賽結束了。大家收到後立刻鎖定鍵盤停止跑步，最後由吉祥物出來公布成績並關閉整個遊戲。",
    ],
  },
  {
    id: 15,
    chapter: "第7課",
    title: "角色的造型複製、匯出、上傳",
    shortTitle: "複製/匯出/上傳",
    description:
      "學習如何將你在 Scratch 中辛苦設計好的角色或造型匯出備份！只要在「角色區」或「造型區」對著想要匯出的項目按「滑鼠右鍵」，選擇「匯出」，就能將素材儲存到電腦中。日後開啟其他專案時，只要點選「上傳角色」或「上傳造型」，就能重複使用你的專屬素材，大幅節省重新製作的時間！",
    videoId: "WS0bJmAgVlU",
    startTime: 0,
  },
  {
    id: 16,
    chapter: "第7課",
    title: "scratch角色匯出",
    shortTitle: "角色匯出",
    description:
      "進一步學習如何將完整的 Scratch 角色（包含所有的造型與程式碼）匯出儲存到電腦中。這能幫你建立專屬的角色資料庫，未來在任何新專案中都能快速匯入使用！",
    videoId: "F-OTeBzJ8jg",
    startTime: 0,
  },
  {
    id: 17,
    chapter: "第8課",
    title: "重新組合",
    shortTitle: "重新組合",
    description:
      "學習如何重組和合併不同的 Scratch 專案或角色，發揮創意將現有的元素結合起來，製作出全新且更豐富的作品！",
    videoId: "",
    startTime: 0,
  },
  {
    id: 18,
    chapter: "第9課",
    title: "暑期練習：遊戲組",
    shortTitle: "遊戲組練習",
    description:
      "遊戲組至少要自已寫出二個遊戲 (一開始可以參考網站，而後不看網站寫出)",
    videoId: "",
    startTime: 0,
    link: "https://steam.oxxostudio.tw/category/scratch/index.html",
  },
  {
    id: 19,
    chapter: "第9課",
    title: "暑期練習：動畫組",
    shortTitle: "動畫組練習",
    description: "動畫組：至少完成三幕像繪本一樣的畫面安排。",
    videoId: "",
    startTime: 0,
  },
];
