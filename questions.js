// カテゴリマスター
const categories = {
    anatomy: { name: "乳房の解剖・生理", color: "#4A90D9" },
    positioning: { name: "撮影技術・ポジショニング", color: "#7B68EE" },
    image_quality: { name: "画像評価・画質管理", color: "#20B2AA" },
    pathology: { name: "病変・所見", color: "#FF6B6B" },
    equipment: { name: "装置・物理", color: "#FFA500" },
    safety: { name: "被ばく・安全管理", color: "#32CD32" },
    screening: { name: "検診・精度管理", color: "#BA55D3" }
};

// 問題データ
const questions = [
    {
        id: 1,
        category: "anatomy",
        type: "single",
        question: "乳房の構成組織について正しいのはどれか。",
        choices: [
            { label: "A", text: "乳腺組織は主に脂肪組織で構成される" },
            { label: "B", text: "クーパー靭帯は乳房を支持する" },
            { label: "C", text: "乳頭は乳腺葉の中心に位置する" },
            { label: "D", text: "乳輪には乳腺組織が存在しない" }
        ],
        answer: ["B"],
        explanation: "クーパー靭帯（Cooper's ligament）は乳房懸垂靭帯とも呼ばれ、乳房を胸壁に固定し支持する結合組織です。乳腺組織は腺組織と脂肪組織で構成され、年齢やホルモン状態により比率が変化します。"
    },
    {
        id: 2,
        category: "positioning",
        type: "single",
        question: "MLO（内外斜位）撮影における標準的な角度はどれか。",
        choices: [
            { label: "A", text: "30度" },
            { label: "B", text: "45度" },
            { label: "C", text: "60度" },
            { label: "D", text: "90度" }
        ],
        answer: ["B"],
        explanation: "MLO撮影では、通常30〜60度の角度が使用されますが、標準的には45度が推奨されています。この角度により、乳房組織を最大限に可視化し、胸筋の前縁まで含めることができます。"
    },
    {
        id: 3,
        category: "image_quality",
        type: "single",
        question: "マンモグラフィー画像の画質評価において、最も重要な要素はどれか。",
        choices: [
            { label: "A", text: "コントラスト" },
            { label: "B", text: "解像度" },
            { label: "C", text: "ノイズ" },
            { label: "D", text: "圧迫の適切性" }
        ],
        answer: ["A"],
        explanation: "マンモグラフィーでは、低コントラストの病変（特に浸潤性乳がん）を検出することが重要です。そのため、コントラストが最も重要な画質要素とされています。"
    },
    {
        id: 4,
        category: "pathology",
        type: "single",
        question: "BI-RADS分類において、カテゴリー3に該当するのはどれか。",
        choices: [
            { label: "A", text: "悪性の可能性が高い" },
            { label: "B", text: "良性の可能性が高いが、短期間隔でのフォローアップが必要" },
            { label: "C", text: "追加検査が必要" },
            { label: "D", text: "異常なし" }
        ],
        answer: ["B"],
        explanation: "BI-RADSカテゴリー3は「おそらく良性（Probably Benign）」とされ、悪性の可能性は2%未満ですが、短期間隔（通常6ヶ月）でのフォローアップが推奨されます。"
    },
    {
        id: 5,
        category: "equipment",
        type: "single",
        question: "デジタルマンモグラフィーで使用される検出器の種類として正しいのはどれか。",
        choices: [
            { label: "A", text: "CR（コンピューテッドラジオグラフィ）のみ" },
            { label: "B", text: "DR（ダイレクトラジオグラフィ）のみ" },
            { label: "C", text: "CRとDRの両方" },
            { label: "D", text: "フィルムのみ" }
        ],
        answer: ["C"],
        explanation: "デジタルマンモグラフィーでは、CR（間接デジタル）とDR（直接デジタル）の両方が使用されています。DRはより高い効率と画質を提供しますが、CRも広く使用されています。"
    },
    {
        id: 6,
        category: "safety",
        type: "single",
        question: "マンモグラフィー検査における平均乳腺線量（AGD）の基準値はどれか。",
        choices: [
            { label: "A", text: "1mGy以下" },
            { label: "B", text: "3mGy以下" },
            { label: "C", text: "5mGy以下" },
            { label: "D", text: "10mGy以下" }
        ],
        answer: ["B"],
        explanation: "日本のマンモグラフィー精度管理ガイドラインでは、標準的な乳房（圧迫厚4.5cm、組成50%腺組織）における平均乳腺線量は3mGy以下が推奨されています。"
    },
    {
        id: 7,
        category: "screening",
        type: "single",
        question: "乳がん検診における感度と特異度について正しいのはどれか。",
        choices: [
            { label: "A", text: "感度は真陽性率を表す" },
            { label: "B", text: "特異度は真陰性率を表す" },
            { label: "C", text: "感度と特異度は独立している" },
            { label: "D", text: "すべて正しい" }
        ],
        answer: ["D"],
        explanation: "感度（Sensitivity）は真陽性率（TP/(TP+FN)）、特異度（Specificity）は真陰性率（TN/(TN+FP)）を表します。これらは独立した指標で、それぞれ異なる側面を評価します。"
    },
    {
        id: 8,
        category: "anatomy",
        type: "multiple",
        question: "乳腺の発達に影響を与えるホルモンとして正しいのはどれか。2つ選べ。",
        choices: [
            { label: "A", text: "エストロゲン" },
            { label: "B", text: "プロゲステロン" },
            { label: "C", text: "テストステロン" },
            { label: "D", text: "プロラクチン" }
        ],
        answer: ["A", "B"],
        explanation: "エストロゲンとプロゲステロンは、乳腺の発達と機能に重要な役割を果たす女性ホルモンです。エストロゲンは乳腺管の発達を促進し、プロゲステロンは小葉の発達に関与します。"
    },
    {
        id: 9,
        category: "positioning",
        type: "single",
        question: "CC（頭尾方向）撮影において、最も重要なポイントはどれか。",
        choices: [
            { label: "A", text: "胸筋の前縁を含める" },
            { label: "B", text: "乳房後方の組織を含める" },
            { label: "C", text: "乳頭を中心に配置する" },
            { label: "D", text: "圧迫を最大限に行う" }
        ],
        answer: ["B"],
        explanation: "CC撮影では、乳房後方の組織（特に胸壁に近い部分）を確実に含めることが最も重要です。これにより、MLO撮影で見落とされる可能性のある病変を検出できます。"
    },
    {
        id: 10,
        category: "pathology",
        type: "single",
        question: "マンモグラフィーで検出される石灰化のうち、悪性を疑う所見はどれか。",
        choices: [
            { label: "A", text: "均一な大きさの石灰化" },
            { label: "B", text: "線状・分枝状の石灰化" },
            { label: "C", text: "円形の石灰化" },
            { label: "D", text: "大きな石灰化" }
        ],
        answer: ["B"],
        explanation: "線状・分枝状（linear-branching）の石灰化は、乳管内に沿って分布する悪性所見の特徴です。不均一な大きさ・形状の多形性石灰化も悪性を疑う所見とされています。"
    },
    {
        id: 11,
        category: "image_quality",
        type: "single",
        question: "マンモグラフィー画像におけるアーチファクトの原因として最も多いのはどれか。",
        choices: [
            { label: "A", text: "圧迫不足" },
            { label: "B", text: "患者の動き" },
            { label: "C", text: "検出器の汚れ" },
            { label: "D", text: "X線管の故障" }
        ],
        answer: ["A"],
        explanation: "圧迫不足は、画像のぼけやコントラスト低下を引き起こす最も一般的なアーチファクトの原因です。適切な圧迫により、組織の重なりを減らし、線量を低減し、動きによるぼけを防ぐことができます。"
    },
    {
        id: 12,
        category: "equipment",
        type: "single",
        question: "マンモグラフィー用X線装置の管電圧の標準的な範囲はどれか。",
        choices: [
            { label: "A", text: "20-30kV" },
            { label: "B", text: "25-35kV" },
            { label: "C", text: "40-50kV" },
            { label: "D", text: "60-80kV" }
        ],
        answer: ["B"],
        explanation: "マンモグラフィーでは、軟部組織のコントラストを最適化するため、低い管電圧（通常25-35kV）が使用されます。これにより、脂肪組織と腺組織の間のコントラストが向上します。"
    },
    {
        id: 13,
        category: "safety",
        type: "single",
        question: "マンモグラフィー検査における被ばく線量を低減する方法として正しいのはどれか。",
        choices: [
            { label: "A", text: "管電圧を上げる" },
            { label: "B", text: "圧迫を強くする" },
            { label: "C", text: "フィルム感度を下げる" },
            { label: "D", text: "焦点距離を短くする" }
        ],
        answer: ["B"],
        explanation: "適切な圧迫により、乳房の厚みが減少し、必要なX線量が低減されます。また、組織の重なりが減ることで、より少ない線量で良好な画像が得られます。"
    },
    {
        id: 14,
        category: "screening",
        type: "single",
        question: "マンモグラフィー検診の精度管理において、読影者の再現性を評価する指標はどれか。",
        choices: [
            { label: "A", text: "感度" },
            { label: "B", text: "特異度" },
            { label: "C", text: "κ（カッパ）係数" },
            { label: "D", text: "陽性反応適中度" }
        ],
        answer: ["C"],
        explanation: "κ（カッパ）係数は、読影者間の一致度を評価する指標で、偶然の一致を除いた真の一致度を表します。0.6以上が良好な一致度とされています。"
    },
    {
        id: 15,
        category: "pathology",
        type: "multiple",
        question: "マンモグラフィーで検出される良性所見として正しいのはどれか。2つ選べ。",
        choices: [
            { label: "A", text: "線維腺腫" },
            { label: "B", text: "浸潤性乳管がん" },
            { label: "C", text: "嚢胞" },
            { label: "D", text: "石灰化を伴う浸潤性小葉がん" }
        ],
        answer: ["A", "C"],
        explanation: "線維腺腫と嚢胞は良性病変です。線維腺腫は境界明瞭な腫瘤として、嚢胞は境界明瞭な円形の陰影として描出されます。浸潤性乳管がんと浸潤性小葉がんは悪性病変です。"
    },
    {
        id: 16,
        category: "positioning",
        type: "single",
        question: "MLO撮影において、胸筋の前縁が画像に含まれていない場合の問題点はどれか。",
        choices: [
            { label: "A", text: "線量が増加する" },
            { label: "B", text: "乳房後方の組織が評価できない" },
            { label: "C", text: "圧迫が不十分になる" },
            { label: "D", text: "画像のコントラストが低下する" }
        ],
        answer: ["B"],
        explanation: "MLO撮影では、胸筋の前縁が画像に含まれていることで、乳房後方の組織が適切に撮影されたことを確認できます。胸筋が含まれていない場合、後方組織が撮影範囲外の可能性があります。"
    },
    {
        id: 17,
        category: "image_quality",
        type: "single",
        question: "デジタルマンモグラフィーにおけるウィンドウレベルとウィンドウ幅の説明として正しいのはどれか。",
        choices: [
            { label: "A", text: "ウィンドウレベルは画像の明るさを調整する" },
            { label: "B", text: "ウィンドウ幅は画像のコントラストを調整する" },
            { label: "C", text: "両方とも画像の解像度に影響する" },
            { label: "D", text: "AとBの両方が正しい" }
        ],
        answer: ["D"],
        explanation: "ウィンドウレベルは画像の明るさ（輝度）を調整し、ウィンドウ幅は画像のコントラストを調整します。これらを適切に設定することで、病変の検出能が向上します。"
    },
    {
        id: 18,
        category: "equipment",
        type: "single",
        question: "マンモグラフィー用X線装置のターゲット材として使用されるのはどれか。",
        choices: [
            { label: "A", text: "タングステン" },
            { label: "B", text: "モリブデン" },
            { label: "C", text: "銅" },
            { label: "D", text: "アルミニウム" }
        ],
        answer: ["B"],
        explanation: "マンモグラフィーでは、モリブデン（Mo）ターゲットが標準的に使用されます。モリブデンは特性X線を発生し、軟部組織のコントラストを最適化するのに適しています。"
    },
    {
        id: 19,
        category: "safety",
        type: "single",
        question: "マンモグラフィー検査における被ばく防護の原則として正しいのはどれか。",
        choices: [
            { label: "A", text: "時間、距離、遮蔽の3原則" },
            { label: "B", text: "線量の最適化のみ" },
            { label: "C", text: "被ばくの完全回避" },
            { label: "D", text: "高線量での撮影" }
        ],
        answer: ["A"],
        explanation: "放射線防護の3原則は「時間（被ばく時間の短縮）」「距離（被ばく源からの距離の確保）」「遮蔽（遮蔽体の使用）」です。マンモグラフィーでは、適切な圧迫と最適な撮影条件により線量を最適化します。"
    },
    {
        id: 20,
        category: "screening",
        type: "single",
        question: "マンモグラフィー検診における偽陽性の説明として正しいのはどれか。",
        choices: [
            { label: "A", text: "実際には異常がないのに異常と判定される" },
            { label: "B", text: "実際には異常があるのに正常と判定される" },
            { label: "C", text: "実際に異常があり、異常と判定される" },
            { label: "D", text: "実際に正常で、正常と判定される" }
        ],
        answer: ["A"],
        explanation: "偽陽性（False Positive）は、実際には異常がないのに異常と判定されることです。これにより、不要な追加検査や不安が生じる可能性があります。"
    }
];
