async function getMarkdownFiles() {
    try {
        const response = await fetch("/post/");
        const text = await response.text();
        const files = [...text.matchAll(/href="([^"]+\.md)"/g)].map(match => match[1]);
        return files;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách file:", error);
        return [];
    }
}

async function loadMarkdownTitles() {
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML = "Đang tải...";

    const files = await getMarkdownFiles();
    let posts = [];

    for (const file of files) {
        const response = await fetch(`/post/${file}`);
        if (!response.ok) continue;

        const text = await response.text();
        const metadata = extractMetadataFromMarkdown(text);
        if (!metadata.title || !metadata.date) continue;

        posts.push({ title: metadata.title, date: metadata.date, file });
    }

    // Sắp xếp theo ngày mới nhất
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    postContainer.innerHTML = "";
    posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.className = "post";
        postDiv.style.display = "flex";
        postDiv.style.alignItems = "center";
        postDiv.style.gap = "15px";
        postDiv.style.marginBottom = "15px";
        postDiv.style.borderBottom = "1px solid #ddd";
        postDiv.style.paddingBottom = "10px";

        // Ô màu 3:2 bên trái
        const thumbnail = document.createElement("div");
        thumbnail.style.width = "120px"; 
        thumbnail.style.height = "80px"; 
        thumbnail.style.backgroundColor = "#ae445a";
        thumbnail.style.flexShrink = "0";

        // Khối chứa title + date
        const postInfo = document.createElement("div");
        postInfo.innerHTML = `
            <h2 style="margin: 0;">
                <a href="post.html?file=${encodeURIComponent(post.file)}" style="text-decoration: none; color: #333;">
                    ${post.title}
                </a>
            </h2>
            <small style="color: gray;">${post.date}</small>
        `;

        // Thêm vào phần tử bài viết
        postDiv.appendChild(thumbnail);
        postDiv.appendChild(postInfo);
        postContainer.appendChild(postDiv);
    });
}

function extractMetadataFromMarkdown(markdown) {
    const titleMatch = markdown.match(/^---[\s\S]*?title:\s*"(.*?)"[\s\S]*?---/);
    const dateMatch = markdown.match(/^---[\s\S]*?date:\s*"(.*?)"[\s\S]*?---/);
    return { title: titleMatch ? titleMatch[1] : null, date: dateMatch ? dateMatch[1] : null };
}

loadMarkdownTitles();
