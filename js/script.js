// Preloaded users
let users = [
    { username: "john", password: "123", name: "John Doe", pic: "https://i.pravatar.cc/40?img=1" },
    { username: "jane", password: "456", name: "Jane Smith", pic: "https://i.pravatar.cc/40?img=2" }
  ];
  
  let currentUser = null;
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  
  function toggleForm(section) {
    document.getElementById("registerSection").style.display = section === "register" ? "block" : "none";
    document.querySelector(".form-box").style.display = section === "login" ? "block" : "none";
  }
  
  function login() {
    const uname = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const user = users.find(u => u.username === uname && u.password === pass);
  
    if (user) {
      currentUser = user;
      document.getElementById("loginContainer").style.display = "none";
      document.getElementById("app").style.display = "block";
      document.getElementById("userName").textContent = user.name;
      document.getElementById("logoutBtn").style.display = "inline-block";
      renderPosts();
    } else {
      document.getElementById("loginError").textContent = "Invalid credentials!";
    }
  }
  
  function logout() {
    currentUser = null;
    document.getElementById("app").style.display = "none";
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("userName").textContent = "";
    document.getElementById("loginError").textContent = "";
    document.getElementById("logoutBtn").style.display = "none";
  }
  
  function register() {
    const name = document.getElementById("regName").value;
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const pic = document.getElementById("regPic").value || `https://i.pravatar.cc/40?u=${username}`;
  
    if (!name || !username || !password) {
      document.getElementById("registerError").textContent = "All fields except picture are required.";
      return;
    }
  
    if (users.find(u => u.username === username)) {
      document.getElementById("registerError").textContent = "Username already exists.";
      return;
    }
  
    users.push({ username, password, name, pic });
    toggleForm("login");
  }
  
  function createPost() {
    const content = document.getElementById("newPost").value.trim();
    if (!content) return;
    posts.unshift({ user: currentUser, content, likes: 0, likedBy: [], comments: [] });
    document.getElementById("newPost").value = "";
    savePosts();
    renderPosts();
  }
  
  function deletePost(index) {
    posts.splice(index, 1);
    savePosts();
    renderPosts();
  }
  
  function likePost(index) {
    const post = posts[index];
    if (post.likedBy.includes(currentUser.username)) {
      post.likes--;
      post.likedBy = post.likedBy.filter(username => username !== currentUser.username);
    } else {
      post.likes++;
      post.likedBy.push(currentUser.username);
    }
    savePosts();
    renderPosts();
  }
  
  function commentOnPost(index) {
    const commentInput = document.getElementById(`comment-${index}`);
    const comment = commentInput.value.trim();
    if (comment) {
      posts[index].comments.push({ user: currentUser, text: comment });
      commentInput.value = "";
      savePosts();
      renderPosts();
    }
  }
  
  function renderPosts() {
    const postContainer = document.getElementById("posts");
    postContainer.innerHTML = "";
  
    posts.forEach((post, index) => {
      const postEl = document.createElement("div");
      postEl.className = "post fade-in";
      const commentsHTML = post.comments.map(c => `<div class="comment"><strong>${c.user.name}:</strong> ${c.text}</div>`).join("");
  
      postEl.innerHTML = `
        <div class="post-header">
          <img src="${post.user.pic}" alt="Profile">
          <div>
            <strong>${post.user.name}</strong>
            <p>@${post.user.username}</p>
          </div>
        </div>
        <p>${post.content}</p>
        <div class="post-actions">
          <button onclick="likePost(${index})">Like (${post.likes})</button>
          ${currentUser.username === post.user.username ? `<button onclick="deletePost(${index})">Delete</button>` : ""}
        </div>
        <div class="comments">
          ${commentsHTML}
        </div>
        <input id="comment-${index}" type="text" placeholder="Add a comment...">
        <button onclick="commentOnPost(${index})">Comment</button>
      `;
      postContainer.appendChild(postEl);
    });
  }
  
  function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
  }
  
