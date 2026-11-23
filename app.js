
// --- M Drishti Core Engine (app.js) ---

const defaultVideos = [
    {
        id: "vid1",
        title: "MalikLang पाठ 1: बिना अंग्रेजी जाने अपनी बोलचाल की भाषा Hinglish में पहला प्रोग्राम कैसे लिखें?",
        channel: "MalikLang Official (शैलेन्द्र कुमार सिंह)",
        category: "coding",
        views: 420,
        likes: 68,
        subs: 142,
        url: "https://youtube.com",
        earnLink: "https://github.com",
        earnText: "🚀 MalikLang फ्री डाउनलोड करें (Offline)",
        date: "आज",
        comments: [
            "अमित वर्मा: बहुत ही शानदार पहल है भैया, गांव के छात्रों के लिए वरदान है!",
            "प्रिया सिंह: बिना अंग्रेजी के कोडिंग सीखना वाकई बहुत आसान हो गया।"
        ]
    },
    {
        id: "vid2",
        title: "Malik News विशेष बुलेटिन: भारत-नेपाल रेल सेवा, संपादकीय एवं आज के प्रमुख समाचार",
        channel: "Malik News • संपादकीय डेस्क",
        category: "news",
        views: 315,
        likes: 49,
        subs: 210,
        url: "https://youtube.com",
        earnLink: "https://github.io",
        earnText: "📰 Malik News पर पूरा अंक पढ़ें",
        date: "आज",
        comments: [
            "राहुल यादव: संपादकीय और दैनिक बुलेटिन दोनों बहुत जानकारीपूर्ण हैं।"
        ]
    },
    {
        id: "vid3",
        title: "MalikBooks डिजिटल मंच: हिंदी और हिंग्लिश लेखक अपनी ई-बुक मुफ्त में कैसे पब्लिश करें?",
        channel: "MalikBooks प्रकाशन",
        category: "education",
        views: 195,
        likes: 34,
        subs: 98,
        url: "https://youtube.com",
        earnLink: "https://github.io",
        earnText: "📚 MalikBooks पर किताबें पढ़ें और लिखें",
        date: "कल",
        comments: []
    }
];

let videos = JSON.parse(localStorage.getItem("mdrishti_videos")) || defaultVideos;
if (!Array.isArray(videos) || videos.length === 0) {
    videos = defaultVideos;
}
let currentVideo = videos[0];
let activeCategory = "all";
let subscribedChannels = JSON.parse(localStorage.getItem("mdrishti_subs")) || {};

function formatVideoUrl(rawUrl) {
    if (!rawUrl) return "";
    if (rawUrl.includes("://youtube.com")) {
        const vidId = rawUrl.split("v=")[1].split("&")[0];
        return "https://youtube.com" + vidId;
    }
    if (rawUrl.includes("youtu.be/")) {
        const vidId = rawUrl.split("youtu.be/")[1].split("?")[0];
        return "https://youtube.com" + vidId;
    }
    return rawUrl;
}

function loadVideo(video) {
    if (!video) return;
    currentVideo = video;
    video.views = (video.views || 0) + 1;
    saveData();

    const playerContainer = document.getElementById("playerContainer");
    const formattedUrl = formatVideoUrl(video.url);

    if (formattedUrl.endsWith(".mp4") || formattedUrl.endsWith(".webm")) {
        playerContainer.innerHTML = `<video controls src="${formattedUrl}"></video>`;
    } else {
        playerContainer.innerHTML = `<iframe src="${formattedUrl}" allowfullscreen></iframe>`;
    }

    document.getElementById("currentTitle").textContent = video.title;
    document.getElementById("currentMeta").textContent = `${video.views} Views • ${video.date}`;
    document.getElementById("channelName").textContent = video.channel;
    document.getElementById("channelAvatar").textContent = video.channel.charAt(0).toUpperCase();
    document.getElementById("subCount").textContent = video.subs;
    document.getElementById("likeCount").textContent = video.likes;

    const supportBtn = document.getElementById("creatorSupportLink");
    supportBtn.href = video.earnLink || "https://github.io";
    supportBtn.textContent = video.earnText || "❤️ क्रिएटर को सहयोग / लिंक देखें";

    updateSubButton();
    renderComments();
}

function updateSubButton() {
    const subBtn = document.getElementById("subBtn");
    if (subscribedChannels[currentVideo.channel]) {
        subBtn.textContent = "Subscribed ✓";
        subBtn.classList.add("subscribed");
    } else {
        subBtn.textContent = "Subscribe";
        subBtn.classList.remove("subscribed");
    }
}

function toggleSubscribe() {
    if (subscribedChannels[currentVideo.channel]) {
        delete subscribedChannels[currentVideo.channel];
        currentVideo.subs -= 1;
    } else {
        subscribedChannels[currentVideo.channel] = true;
        currentVideo.subs += 1;
    }
    localStorage.setItem("mdrishti_subs", JSON.stringify(subscribedChannels));
    document.getElementById("subCount").textContent = currentVideo.subs;
    updateSubButton();
    saveData();
}

function likeVideo() {
    currentVideo.likes += 1;
    document.getElementById("likeCount").textContent = currentVideo.likes;
    saveData();
}

function shareVideo() {
    const shareText = `${currentVideo.title} - देखें M Drishti पर: ${window.location.href}`;
    if (navigator.share) {
        navigator.share({ title: currentVideo.title, text: shareText, url: window.location.href });
    } else {
        navigator.clipboard.writeText(shareText);
        alert("वीडियो का लिंक कॉपी हो गया है! अब आप इसे कहीं भी शेयर कर सकते हैं।");
    }
}

function renderComments() {
    const list = document.getElementById("commentList");
    if (!currentVideo.comments || currentVideo.comments.length === 0) {
        list.innerHTML = `<div style="font-size:0.85rem; color:#64748b;">अभी कोई टिप्पणी नहीं है। सबसे पहले अपना विचार लिखें!</div>`;
        return;
    }
    list.innerHTML = currentVideo.comments.map(c => `<div class="comment-item">${c}</div>`).join("");
}

function addComment() {
    const input = document.getElementById("commentInput");
    const text = input.value.trim();
    if (!text) return;
    currentVideo.comments.unshift("पाठक: " + text);
    input.value = "";
    saveData();
    renderComments();
}

function renderGrid() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const grid = document.getElementById("videoGrid");

    const filtered = videos.filter(v => {
        const matchCat = activeCategory === "all" || v.category === activeCategory;
        const matchSearch = v.title.toLowerCase().includes(query) || v.channel.toLowerCase().includes(query);
        return matchCat && matchSearch;
    });

    grid.innerHTML = filtered.map(v => `
        <div class="video-card" onclick='loadVideoById("${v.id}")'>
            <div class="thumb">
                <span>▶️ ${v.title.substring(0, 48)}...</span>
                <div class="badge">${v.views} Views</div>
            </div>
            <div class="card-body">
                <div class="card-title">${v.title}</div>
                <div class="card-meta">${v.channel} • ${v.likes} Likes</div>
            </div>
        </div>
    `).join("");
}

function loadVideoById(id) {
    const found = videos.find(v => v.id === id);
    if (found) {
        loadVideo(found);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function setCategory(cat, btn) {
    activeCategory = cat;
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderGrid();
}

function filterVideos() {
    renderGrid();
}

function openModal() {
    document.getElementById("uploadModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("uploadModal").style.display = "none";
}

function submitVideo() {
    const channel = document.getElementById("upChannel").value.trim();
    const title = document.getElementById("upTitle").value.trim();
    const category = document.getElementById("upCategory").value;
    const url = document.getElementById("upUrl").value.trim();
    const earnLink = document.getElementById("upEarnLink").value.trim();

    if (!channel || !title || !url) {
        alert("कृपया चैनल का नाम, वीडियो का शीर्षक और वीडियो लिंक ज़रूर भरें!");
        return;
    }

    const newVid = {
        id: "vid_" + Date.now(),
        title: title,
        channel: channel,
        category: category,
        views: 1,
        likes: 1,
        subs: 1,
        url: url,
        earnLink: earnLink || "https://github.io",
        earnText: earnLink ? "❤️ क्रिएटर को सहयोग / ऑफर देखें" : "📰 Malik News पर जाएं",
        date: "अभी-अभी",
        comments: []
    };

    videos.unshift(newVid);
    saveData();
    closeModal();
    renderGrid();
    loadVideo(newVid);

    document.getElementById("upChannel").value = "";
    document.getElementById("upTitle").value = "";
    document.getElementById("upUrl").value = "";
    document.getElementById("upEarnLink").value = "";
}

function saveData() {
    localStorage.setItem("mdrishti_videos", JSON.stringify(videos));
}

loadVideo(currentVideo);
renderGrid();
 
