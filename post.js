async function loadPostContent() {
    const params = new URLSearchParams(window.location.search);
    const file = params.get("file");

    if (!file) {
        document.getElementById("post-content").innerHTML = "<p>Lỗi: Không tìm thấy bài viết!</p>";
        return;
    }

    const response = await fetch(`/post/${file}`);
    if (!response.ok) {
        document.getElementById("post-content").innerHTML = "<p>Lỗi: Không thể tải bài viết!</p>";
        return;
    }

    const markdown = await response.text();
    const content = convertMarkdownToHtml(markdown);

    // Tạo div chứa ô và nội dung bài viết
    const postWrapper = document.createElement("div");
    postWrapper.style.display = "flex";
    postWrapper.style.flexDirection = "column";
    postWrapper.style.alignItems = "center"; // Căn giữa web
    postWrapper.style.justifyContent = "center";
    postWrapper.style.width = "100%";
    postWrapper.style.maxWidth = "800px"; // Giới hạn chiều rộng
    postWrapper.style.margin = "0 auto"; // Căn giữa ngang
    postWrapper.style.textAlign = "left"; // Chữ vẫn nằm bên trái trong div

    // Tạo ô màu 3:2
    const banner = document.createElement("div");
    banner.style.width = "100%";
    banner.style.aspectRatio = "3 / 2"; // Đảm bảo tỷ lệ 3:2
    banner.style.backgroundColor = "#ae445a";
    banner.style.marginBottom = "20px";

    // Tạo div chứa nội dung bài viết
    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = content;

    // Xóa nội dung cũ và thêm phần mới
    const postContent = document.getElementById("post-content");
    postContent.innerHTML = "";
    postWrapper.appendChild(banner);
    postWrapper.appendChild(contentDiv);
    postContent.appendChild(postWrapper);
}

function convertMarkdownToHtml(markdown) {
    const metadataRegex = /^---[\s\S]*?---/;
    markdown = markdown.replace(metadataRegex, ""); // Xóa phần metadata

    markdown = markdown.replace(/^# (.*?)$/gm, "<h1>$1</h1>"); // Chuyển đổi tiêu đề
    markdown = markdown.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
    markdown = markdown.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"); // In đậm
    markdown = markdown.replace(/\*(.*?)\*/g, "<i>$1</i>"); // In nghiêng
    markdown = markdown.replace(/\n/g, "<br>"); // Xuống dòng

    return markdown;
}

loadPostContent();
