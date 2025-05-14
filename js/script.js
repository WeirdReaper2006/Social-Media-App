// State Management
let currentUser = null;
let currentPage = 'login';
let currentPostType = 'all';

// Initialize local storage if needed
function initializeStorage() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('posts')) {
        localStorage.setItem('posts', JSON.stringify([]));
    }
    if (!localStorage.getItem('comments')) {
        localStorage.setItem('comments', JSON.stringify([]));
    }
    if (!localStorage.getItem('likes')) {
        localStorage.setItem('likes', JSON.stringify([]));
    }
    if (!localStorage.getItem('relationships')) {
        localStorage.setItem('relationships', JSON.stringify([]));
    }
}

// User Authentication Functions
function register(username, email, password) {
    const users = JSON.parse(localStorage.getItem('users'));

    // Check if username or email already exists
    if (users.some(user => user.username === username)) {
        return { success: false, message: 'Username already exists' };
    }

    if (users.some(user => user.email === email)) {
        return { success: false, message: 'Email already exists' };
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
        return {
            success: false,
            message: 'Password must contain at least one uppercase letter and one symbol'
        };
    }


    // Create new user
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, // In a real app, this should be hashed
        createdAt: new Date().toISOString()
    };


    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true, user: newUser };
}


function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users'));

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    } else {
        return { success: false, message: 'Invalid email or password' };
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    navigateTo('login');
}

// Post Functions
function createPost(content, type, mediaUrl = null) {
    if (!currentUser) return { success: false, message: 'You must be logged in to create a post' };

    const posts = JSON.parse(localStorage.getItem('posts'));

    const newPost = {
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUser.username,
        content,
        type, // 'text', 'image', or 'video'
        mediaUrl,
        createdAt: new Date().toISOString()
    };

    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    return { success: true, post: newPost };
}

function deletePost(postId) {
    if (!currentUser) return { success: false, message: 'You must be logged in' };

    let posts = JSON.parse(localStorage.getItem('posts'));
    const postToDelete = posts.find(post => post.id === postId);

    if (!postToDelete) {
        return { success: false, message: 'Post not found' };
    }

    if (postToDelete.userId !== currentUser.id) {
        return { success: false, message: 'You can only delete your own posts' };
    }

    // Remove the post
    posts = posts.filter(post => post.id !== postId);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Also remove related comments and likes
    let comments = JSON.parse(localStorage.getItem('comments'));
    comments = comments.filter(comment => comment.postId !== postId);
    localStorage.setItem('comments', JSON.stringify(comments));

    let likes = JSON.parse(localStorage.getItem('likes'));
    likes = likes.filter(like => like.postId !== postId);
    localStorage.setItem('likes', JSON.stringify(likes));

    return { success: true };
}

function getPosts(type = 'all', userId = null) {
    let posts = JSON.parse(localStorage.getItem('posts'));

    // Filter by type if specified
    if (type !== 'all') {
        posts = posts.filter(post => post.type === type);
    }

    // Filter by user if specified
    if (userId) {
        posts = posts.filter(post => post.userId === userId);
    }

    // Sort by creation date (newest first)
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return posts;
}

// Comment Functions
function addComment(postId, content) {
    if (!currentUser) return { success: false, message: 'You must be logged in to comment' };

    const comments = JSON.parse(localStorage.getItem('comments'));

    const newComment = {
        id: Date.now().toString(),
        postId,
        userId: currentUser.id,
        username: currentUser.username,
        content,
        createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));

    return { success: true, comment: newComment };
}

function getComments(postId) {
    const comments = JSON.parse(localStorage.getItem('comments'));
    return comments
        .filter(comment => comment.postId === postId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

// Like Functions
function toggleLike(postId, type = 'post') {
    if (!currentUser) return { success: false, message: 'You must be logged in to like' };

    const likes = JSON.parse(localStorage.getItem('likes'));

    // Check if the user already liked this post/comment
    const existingLike = likes.find(
        like => like.targetId === postId &&
            like.userId === currentUser.id &&
            like.type === type
    );

    if (existingLike) {
        // Remove the like
        const updatedLikes = likes.filter(like => like.id !== existingLike.id);
        localStorage.setItem('likes', JSON.stringify(updatedLikes));
        return { success: true, action: 'unliked' };
    } else {
        // Add the like
        const newLike = {
            id: Date.now().toString(),
            targetId: postId, // postId or commentId
            type, // 'post' or 'comment'
            userId: currentUser.id,
            createdAt: new Date().toISOString()
        };

        likes.push(newLike);
        localStorage.setItem('likes', JSON.stringify(likes));
        return { success: true, action: 'liked' };
    }
}

function getLikes(targetId, type = 'post') {
    const likes = JSON.parse(localStorage.getItem('likes'));
    return likes.filter(like => like.targetId === targetId && like.type === type);
}

function isLikedByCurrentUser(targetId, type = 'post') {
    if (!currentUser) return false;

    const likes = JSON.parse(localStorage.getItem('likes'));
    return likes.some(
        like => like.targetId === targetId &&
            like.userId === currentUser.id &&
            like.type === type
    );
}
// Send friend request (auto-accepted in this implementation)
function sendFriendRequest(recipientId) {
    if (!currentUser) return { success: false, message: 'You must be logged in to send friend requests' };

    // Check if users exist
    const users = JSON.parse(localStorage.getItem('users'));
    const recipient = users.find(user => user.id === recipientId);

    if (!recipient) {
        return { success: false, message: 'User not found' };
    }

    // Check if already friends
    const relationships = JSON.parse(localStorage.getItem('relationships'));
    const existingRelationship = relationships.find(
        rel => (rel.user1Id === currentUser.id && rel.user2Id === recipientId) ||
            (rel.user1Id === recipientId && rel.user2Id === currentUser.id)
    );

    if (existingRelationship) {
        return { success: false, message: 'You are already friends with this user' };
    }

    // Create new relationship (auto-accepted)
    const newRelationship = {
        id: Date.now().toString(),
        user1Id: currentUser.id,
        user2Id: recipientId,
        createdAt: new Date().toISOString()
    };

    relationships.push(newRelationship);
    localStorage.setItem('relationships', JSON.stringify(relationships));

    return {
        success: true,
        message: `You are now friends with ${recipient.username}`,
        relationship: newRelationship
    };
}

// Remove friend relationship
function removeFriend(userId) {
    if (!currentUser) return { success: false, message: 'You must be logged in' };

    let relationships = JSON.parse(localStorage.getItem('relationships'));
    const relationshipToRemove = relationships.find(
        rel => (rel.user1Id === currentUser.id && rel.user2Id === userId) ||
            (rel.user1Id === userId && rel.user2Id === currentUser.id)
    );

    if (!relationshipToRemove) {
        return { success: false, message: 'Friend relationship not found' };
    }

    // Remove the relationship
    relationships = relationships.filter(rel => rel.id !== relationshipToRemove.id);
    localStorage.setItem('relationships', JSON.stringify(relationships));

    return { success: true, message: 'Friend removed successfully' };
}

// Get user's friends
function getFriends(userId = currentUser.id) {
    if (!currentUser) return [];

    const relationships = JSON.parse(localStorage.getItem('relationships'));
    const users = JSON.parse(localStorage.getItem('users'));

    // Find all relationships where the user is involved
    const userRelationships = relationships.filter(
        rel => rel.user1Id === userId || rel.user2Id === userId
    );

    // Get the friend IDs
    const friendIds = userRelationships.map(rel =>
        rel.user1Id === userId ? rel.user2Id : rel.user1Id
    );

    // Get the friend objects
    const friends = users.filter(user => friendIds.includes(user.id));

    return friends;
}

// Check if two users are friends
function areFriends(user1Id, user2Id) {
    const relationships = JSON.parse(localStorage.getItem('relationships'));

    return relationships.some(
        rel => (rel.user1Id === user1Id && rel.user2Id === user2Id) ||
            (rel.user1Id === user2Id && rel.user2Id === user1Id)
    );
}
// UI Rendering Functions
function renderNavbar() {
    const navMenu = document.getElementById('navMenu');
    navMenu.innerHTML = '';

    if (currentUser) {
        navMenu.innerHTML = `
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-page="feed" data-post-type="all">
                            <i class="fas fa-home"></i> All Posts
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-page="feed" data-post-type="text">
                            <i class="fas fa-file-alt"></i> Text Posts
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-page="feed" data-post-type="image">
                            <i class="fas fa-image"></i> Image Posts
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-page="feed" data-post-type="video">
                            <i class="fas fa-video"></i> Video Posts
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-page="profile">
                            <i class="fas fa-user"></i> Profile
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-page="friends">
                            <i class="fas fa-user-friends"></i> Friends
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </li>
                `;
    } else {
        navMenu.innerHTML = `
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-page="login">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-page="register">
                            <i class="fas fa-user-plus"></i> Register
                        </a>
                    </li>
                `;
    }

    // Add event listeners to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            if (this.id === 'logoutBtn') {
                logout();
                return;
            }

            const page = this.getAttribute('data-page');
            const postType = this.getAttribute('data-post-type');

            if (postType) {
                currentPostType = postType;
            }

            navigateTo(page);
        });
    });
}

function renderLoginPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
                <div class="auth-container">
                    <div class="form-container fade-in">
                        <h2 class="form-title">Log In to ConnectMe</h2>
                        <div id="loginAlert" class="alert hidden"></div>
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="loginEmail">Email</label>
                                <input type="email" id="loginEmail" class="form-control" placeholder="Enter your email" required>
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">Password</label>
                                <input type="password" id="loginPassword" class="form-control" placeholder="Enter your password" required>
                            </div>
                            <button type="submit" class="btn btn-block">Log In</button>
                        </form>
                        <div class="auth-switch">
                            Don't have an account? <a href="#" id="goToRegister">Register</a>
                        </div>
                    </div>
                </div>
            `;

    // Add event listener to login form
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const result = login(email, password);

        if (result.success) {
            navigateTo('feed');
        } else {
            const alert = document.getElementById('loginAlert');
            alert.textContent = result.message;
            alert.classList.remove('hidden', 'alert-success');
            alert.classList.add('alert-danger');

            setTimeout(() => {
                alert.classList.add('hidden');
            }, 3000);
        }
    });

    // Add event listener to register link
    document.getElementById('goToRegister').addEventListener('click', function (e) {
        e.preventDefault();
        navigateTo('register');
    });
}

function renderRegisterPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
                <div class="auth-container">
                    <div class="form-container fade-in">
                        <h2 class="form-title">Create an Account</h2>
                        <div id="registerAlert" class="alert hidden"></div>
                        <form id="registerForm">
                            <div class="form-group">
                                <label for="registerUsername">Username</label>
                                <input type="text" id="registerUsername" class="form-control" placeholder="Choose a username" required>
                            </div>
                            <div class="form-group">
                                <label for="registerEmail">Email</label>
                                <input type="email" id="registerEmail" class="form-control" placeholder="Enter your email" required>
                            </div>
                            <div class="form-group">
                                <label for="registerPassword">Password</label>
                                <input type="password" id="registerPassword" class="form-control" placeholder="Create a password" required>
                                <small class="form-text">Password must contain at least one uppercase letter and one symbol (!@#$%^&*)</small>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm your password" required>
                            </div>
                            <button type="submit" class="btn btn-block">Register</button>
                        </form>
                        <div class="auth-switch">
                            Already have an account? <a href="#" id="goToLogin">Login</a>
                        </div>
                    </div>
                </div>
            `;

    // Add event listener to register form
    document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const alert = document.getElementById('registerAlert');

        if (password !== confirmPassword) {
            alert.textContent = 'Passwords do not match';
            alert.classList.remove('hidden', 'alert-success');
            alert.classList.add('alert-danger');

            setTimeout(() => {
                alert.classList.add('hidden');
            }, 3000);

            return;
        }

        const result = register(username, email, password);

        if (result.success) {
            alert.textContent = 'Registration successful! You can now log in.';
            alert.classList.remove('hidden', 'alert-danger');
            alert.classList.add('alert-success');

            setTimeout(() => {
                navigateTo('login');
            }, 2000);
        } else {
            alert.textContent = result.message;
            alert.classList.remove('hidden', 'alert-success');
            alert.classList.add('alert-danger');

            setTimeout(() => {
                alert.classList.add('hidden');
            }, 3000);
        }
    });

    // Add event listener to login link
    document.getElementById('goToLogin').addEventListener('click', function (e) {
        e.preventDefault();
        navigateTo('login');
    });
}

function renderFeedPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
                <div class="feed container fade-in">
                    <div class="create-post">
                        <div class="create-post-header">
                            <div class="create-post-avatar">${currentUser.username.charAt(0).toUpperCase()}</div>
                            <input type="text" id="postContent" class="create-post-input" placeholder="What's on your mind?">
                        </div>
                        <div id="mediaPreview" class="media-preview"></div>
                        <div class="create-post-actions">
                            <div class="post-type-selector">
                                <div class="post-type-option active" data-type="text">
                                    <i class="fas fa-file-alt"></i> Text
                                </div>
                                <div class="post-type-option" data-type="image">
                                    <i class="fas fa-image"></i> Image
                                    <input type="file" id="imageInput" class="file-input" accept="image/*">
                                </div>
                                <div class="post-type-option" data-type="video">
                                    <i class="fas fa-video"></i> Video
                                    <input type="file" id="videoInput" class="file-input" accept="video/*">
                                </div>
                            </div>
                            <button id="createPostBtn" class="btn">Post</button>
                        </div>
                    </div>
                    
                    <div class="post-type-nav">
                        <button class="post-type-btn ${currentPostType === 'all' ? 'active' : ''}" data-type="all">All Posts</button>
                        <button class="post-type-btn ${currentPostType === 'text' ? 'active' : ''}" data-type="text">Text</button>
                        <button class="post-type-btn ${currentPostType === 'image' ? 'active' : ''}" data-type="image">Images</button>
                        <button class="post-type-btn ${currentPostType === 'video' ? 'active' : ''}" data-type="video">Videos</button>
                    </div>
                    
                    <div id="postsContainer" class="posts-container"></div>
                </div>
            `;

    // Load posts
    loadPosts();

    // Add event listeners to post type buttons
    document.querySelectorAll('.post-type-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            currentPostType = this.getAttribute('data-type');

            // Update active state
            document.querySelectorAll('.post-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Reload posts with the new type
            loadPosts();
        });
    });

    // Add event listeners to post type options in create post
    let selectedPostType = 'text';
    let selectedFile = null;

    document.querySelectorAll('.post-type-option').forEach(option => {
        option.addEventListener('click', function () {
            selectedPostType = this.getAttribute('data-type');

            // Update active state
            document.querySelectorAll('.post-type-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');

            // Clear preview
            document.getElementById('mediaPreview').innerHTML = '';
            selectedFile = null;

            // If it's an image or video, trigger file input
            if (selectedPostType === 'image') {
                document.getElementById('imageInput').click();
            } else if (selectedPostType === 'video') {
                document.getElementById('videoInput').click();
            }
        });
    });

    // Handle image selection
    document.getElementById('imageInput').addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
            selectedFile = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                document.getElementById('mediaPreview').style.display = 'block';
                document.getElementById('mediaPreview').innerHTML = `
                            <img src="${event.target.result}" alt="Selected Image">
                        `;
            };

            reader.readAsDataURL(selectedFile);
        }
    });

    // Handle video selection
    document.getElementById('videoInput').addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
            selectedFile = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                document.getElementById('mediaPreview').style.display = 'block';
                document.getElementById('mediaPreview').innerHTML = `
                            <video controls>
                                <source src="${event.target.result}" type="${selectedFile.type}">
                                Your browser does not support the video tag.
                            </video>
                        `;
            };

            reader.readAsDataURL(selectedFile);
        }
    });

    // Handle create post button
    document.getElementById('createPostBtn').addEventListener('click', function () {
        const content = document.getElementById('postContent').value.trim();

        if (!content && !selectedFile) {
            alert('Please add some content to your post');
            return;
        }

        let mediaUrl = null;

        if (selectedFile) {
            // In a real app, we would upload the file to a server
            // For this demo, we'll use a data URL
            const reader = new FileReader();

            reader.onload = function (event) {
                mediaUrl = event.target.result;

                // Create the post after getting the media URL
                const result = createPost(content, selectedPostType, mediaUrl);

                if (result.success) {
                    // Clear the form
                    document.getElementById('postContent').value = '';
                    document.getElementById('mediaPreview').style.display = 'none';
                    document.getElementById('mediaPreview').innerHTML = '';
                    selectedFile = null;

                    // Reset post type to text
                    selectedPostType = 'text';
                    document.querySelectorAll('.post-type-option').forEach(o => o.classList.remove('active'));
                    document.querySelector('.post-type-option[data-type="text"]').classList.add('active');

                    // Reload posts
                    loadPosts();
                }
            };

            reader.readAsDataURL(selectedFile);
        } else {
            // Create text post
            const result = createPost(content, 'text');

            if (result.success) {
                // Clear the form
                document.getElementById('postContent').value = '';

                // Reload posts
                loadPosts();
            }
        }
    });
}

function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    const posts = getPosts(currentPostType);

    if (posts.length === 0) {
        postsContainer.innerHTML = `
                    <div class="no-posts">
                        <p>No posts to show. Be the first to share something!</p>
                    </div>
                `;
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post fade-in';

        // Check if current user liked this post
        const isLiked = isLikedByCurrentUser(post.id);
        const likeCount = getLikes(post.id).length;
        const commentCount = getComments(post.id).length;

        // Prepare media content based on post type
        let mediaContent = '';
        if (post.type === 'image' && post.mediaUrl) {
            mediaContent = `<img src="${post.mediaUrl}" alt="Post image" class="post-media">`;
        } else if (post.type === 'video' && post.mediaUrl) {
            mediaContent = `
                        <video controls class="post-video">
                            <source src="${post.mediaUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    `;
        }

        postElement.innerHTML = `
                    <div class="post-header">
                        <div class="post-user">
                            <div class="post-avatar">${post.username.charAt(0).toUpperCase()}</div>
                            <div>
                                <div class="post-username">${post.username}</div>
                                <div class="post-date">${new Date(post.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                        <div class="post-actions">
                            ${post.userId === currentUser.id ? `
                                <button class="delete-post-btn" data-id="${post.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="post-content">
                        ${post.content ? `<div class="post-text">${post.content}</div>` : ''}
                        ${mediaContent}
                    </div>
                    <div class="post-footer">
                        <div class="post-stats">
                            <div class="post-like ${isLiked ? 'active' : ''}" data-id="${post.id}">
                                <i class="fas fa-heart"></i> ${likeCount}
                            </div>
                            <div class="post-comment">
                                <i class="fas fa-comment"></i> ${commentCount}
                            </div>
                        </div>
                    </div>
                    <div class="post-comment-form">
                        <input type="text" class="post-comment-input" placeholder="Write a comment...">
                        <button class="btn btn-sm add-comment-btn" data-id="${post.id}">Comment</button>
                    </div>
                    <div class="comments-section" id="comments-${post.id}"></div>
                `;

        postsContainer.appendChild(postElement);

        // Load comments for this post
        loadComments(post.id);
    });

    // Add event listeners to like buttons
    document.querySelectorAll('.post-like').forEach(btn => {
        btn.addEventListener('click', function () {
            const postId = this.getAttribute('data-id');
            const result = toggleLike(postId);

            if (result.success) {
                this.classList.toggle('active');
                const likeCount = getLikes(postId).length;
                this.innerHTML = `<i class="fas fa-heart"></i> ${likeCount}`;
            }
        });
    });

    // Add event listeners to comment buttons
    document.querySelectorAll('.add-comment-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const postId = this.getAttribute('data-id');
            const inputElement = this.previousElementSibling;
            const content = inputElement.value.trim();

            if (content) {
                const result = addComment(postId, content);

                if (result.success) {
                    inputElement.value = '';
                    loadComments(postId);

                    // Update comment count
                    const commentCount = getComments(postId).length;
                    const commentCountElement = document.querySelector(`.post-comment[data-id="${postId}"]`);
                    if (commentCountElement) {
                        commentCountElement.innerHTML = `<i class="fas fa-comment"></i> ${commentCount}`;
                    }
                }
            }
        });
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-post-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this post?')) {
                const postId = this.getAttribute('data-id');
                const result = deletePost(postId);

                if (result.success) {
                    loadPosts();
                }
            }
        });
    });
}

function loadComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    commentsSection.innerHTML = '';

    const comments = getComments(postId);

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';

        const isLiked = isLikedByCurrentUser(comment.id, 'comment');
        const likeCount = getLikes(comment.id, 'comment').length;

        commentElement.innerHTML = `
                    <div class="comment-header">
                        <div class="comment-user">${comment.username}</div>
                        <div class="comment-date">${new Date(comment.createdAt).toLocaleString()}</div>
                    </div>
                    <div class="comment-text">${comment.content}</div>
                    <div class="comment-actions">
                        <div class="comment-like ${isLiked ? 'active' : ''}" data-id="${comment.id}">
                            <i class="fas fa-heart"></i> ${likeCount}
                        </div>
                    </div>
                `;

        commentsSection.appendChild(commentElement);
    });

    // Add event listeners to comment like buttons
    document.querySelectorAll('.comment-like').forEach(btn => {
        btn.addEventListener('click', function () {
            const commentId = this.getAttribute('data-id');
            const result = toggleLike(commentId, 'comment');

            if (result.success) {
                this.classList.toggle('active');
                const likeCount = getLikes(commentId, 'comment').length;
                this.innerHTML = `<i class="fas fa-heart"></i> ${likeCount}`;
            }
        });
    });
}

function renderProfilePage() {
    const mainContent = document.getElementById('mainContent');

    // Get user's posts
    const userPosts = getPosts('all', currentUser.id);

    mainContent.innerHTML = `
                <div class="profile container fade-in">
                    <div class="profile-header">
                        <div class="profile-avatar">${currentUser.username.charAt(0).toUpperCase()}</div>
                        <h2 class="profile-username">${currentUser.username}</h2>
                        <p class="profile-email">${currentUser.email}</p>
                        <div class="profile-stats">
                            <div class="profile-stat">
                                <div class="profile-stat-value">${userPosts.length}</div>
                                <div class="profile-stat-label">Posts</div>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="profile-posts-title">Your Posts</h3>
                    <div id="userPostsContainer" class="posts-container"></div>
                </div>
            `;

    // Load user's posts
    const userPostsContainer = document.getElementById('userPostsContainer');

    if (userPosts.length === 0) {
        userPostsContainer.innerHTML = `
                    <div class="no-posts">
                        <p>You haven't created any posts yet. Share something!</p>
                    </div>
                `;
    } else {
        userPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post fade-in';

            // Check if current user liked this post
            const isLiked = isLikedByCurrentUser(post.id);
            const likeCount = getLikes(post.id).length;
            const commentCount = getComments(post.id).length;

            // Prepare media content based on post type
            let mediaContent = '';
            if (post.type === 'image' && post.mediaUrl) {
                mediaContent = `<img src="${post.mediaUrl}" alt="Post image" class="post-media">`;
            } else if (post.type === 'video' && post.mediaUrl) {
                mediaContent = `
                            <video controls class="post-video">
                                <source src="${post.mediaUrl}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        `;
            }

            postElement.innerHTML = `
                        <div class="post-header">
                            <div class="post-user">
                                <div class="post-avatar">${post.username.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div class="post-username">${post.username}</div>
                                    <div class="post-date">${new Date(post.createdAt).toLocaleString()}</div>
                                </div>
                            </div>
                            <div class="post-actions">
                                <button class="delete-post-btn" data-id="${post.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="post-content">
                            ${post.content ? `<div class="post-text">${post.content}</div>` : ''}
                            ${mediaContent}
                        </div>
                        <div class="post-footer">
                            <div class="post-stats">
                                <div class="post-like ${isLiked ? 'active' : ''}" data-id="${post.id}">
                                    <i class="fas fa-heart"></i> ${likeCount}
                                </div>
                                <div class="post-comment">
                                    <i class="fas fa-comment"></i> ${commentCount}
                                </div>
                            </div>
                        </div>
                        <div class="post-comment-form">
                            <input type="text" class="post-comment-input" placeholder="Write a comment...">
                            <button class="btn btn-sm add-comment-btn" data-id="${post.id}">Comment</button>
                        </div>
                        <div class="comments-section" id="comments-${post.id}"></div>
                    `;

            userPostsContainer.appendChild(postElement);

            // Load comments for this post
            loadComments(post.id);
        });

        // Add event listeners
        document.querySelectorAll('.post-like').forEach(btn => {
            btn.addEventListener('click', function () {
                const postId = this.getAttribute('data-id');
                const result = toggleLike(postId);

                if (result.success) {
                    this.classList.toggle('active');
                    const likeCount = getLikes(postId).length;
                    this.innerHTML = `<i class="fas fa-heart"></i> ${likeCount}`;
                }
            });
        });

        document.querySelectorAll('.add-comment-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const postId = this.getAttribute('data-id');
                const inputElement = this.previousElementSibling;
                const content = inputElement.value.trim();

                if (content) {
                    const result = addComment(postId, content);

                    if (result.success) {
                        inputElement.value = '';
                        loadComments(postId);

                        // Update comment count
                        const commentCount = getComments(postId).length;
                        const commentCountElement = document.querySelector(`.post-comment[data-id="${postId}"]`);
                        if (commentCountElement) {
                            commentCountElement.innerHTML = `<i class="fas fa-comment"></i> ${commentCount}`;
                        }
                    }
                }
            });
        });

        document.querySelectorAll('.delete-post-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                if (confirm('Are you sure you want to delete this post?')) {
                    const postId = this.getAttribute('data-id');
                    const result = deletePost(postId);

                    if (result.success) {
                        renderProfilePage(); // Reload profile page
                    }
                }
            });
        });
    }
}
function renderFriendsPage() {
    const mainContent = document.getElementById('mainContent');

    // Get all users except current user
    const users = JSON.parse(localStorage.getItem('users'))
        .filter(user => user.id !== currentUser.id);

    // Get current user's friends
    const friends = getFriends();
    const friendIds = friends.map(friend => friend.id);

    mainContent.innerHTML = `
                <div class="profile container fade-in">
                    <div class="form-container">
                        <h2 class="form-title">Your Friends</h2>
                        <div id="friendsAlert" class="alert hidden"></div>
                        
                        <div class="friends-container">
                            ${friends.length === 0 ? '<p>You have no friends yet. Connect with someone!</p>' : ''}
                            <ul class="friends-list">
                                ${friends.map(friend => `
                                    <li class="friend-item">
                                        <div class="friend-info">
                                            <div class="post-avatar">${friend.username.charAt(0).toUpperCase()}</div>
                                            <div class="friend-details">
                                                <div class="friend-username">${friend.username}</div>
                                                <div class="friend-email">${friend.email}</div>
                                            </div>
                                        </div>
                                        <button class="btn btn-sm btn-danger remove-friend-btn" data-id="${friend.id}">
                                            Remove
                                        </button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="form-container" style="margin-top: 2rem;">
                        <h2 class="form-title">Find Friends</h2>
                        <ul class="users-list">
                            ${users.map(user => `
                                <li class="friend-item">
                                    <div class="friend-info">
                                        <div class="post-avatar">${user.username.charAt(0).toUpperCase()}</div>
                                        <div class="friend-details">
                                            <div class="friend-username">${user.username}</div>
                                            <div class="friend-email">${user.email}</div>
                                        </div>
                                    </div>
                                    ${friendIds.includes(user.id) ?
            `<button class="btn btn-sm" disabled>Friends</button>` :
            `<button class="btn btn-sm add-friend-btn" data-id="${user.id}">
                                            Add Friend
                                        </button>`
        }
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;

    // Add event listeners to add friend buttons
    document.querySelectorAll('.add-friend-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const userId = this.getAttribute('data-id');
            const result = sendFriendRequest(userId);

            const alert = document.getElementById('friendsAlert');
            alert.textContent = result.message;

            if (result.success) {
                alert.classList.remove('hidden', 'alert-danger');
                alert.classList.add('alert-success');

                // Refresh the page to show updated friend list
                setTimeout(() => {
                    renderFriendsPage();
                }, 1000);
            } else {
                alert.classList.remove('hidden', 'alert-success');
                alert.classList.add('alert-danger');
            }

            setTimeout(() => {
                alert.classList.add('hidden');
            }, 3000);
        });
    });

    // Add event listeners to remove friend buttons
    document.querySelectorAll('.remove-friend-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            if (confirm('Are you sure you want to remove this friend?')) {
                const userId = this.getAttribute('data-id');
                const result = removeFriend(userId);

                const alert = document.getElementById('friendsAlert');
                alert.textContent = result.message;

                if (result.success) {
                    alert.classList.remove('hidden', 'alert-danger');
                    alert.classList.add('alert-success');

                    // Refresh the page to show updated friend list
                    setTimeout(() => {
                        renderFriendsPage();
                    }, 1000);
                } else {
                    alert.classList.remove('hidden', 'alert-success');
                    alert.classList.add('alert-danger');
                }

                setTimeout(() => {
                    alert.classList.add('hidden');
                }, 3000);
            }
        });
    });
}
// Navigation
function navigateTo(page) {
    currentPage = page;

    // Check if user is logged in
    if ((page === 'feed' || page === 'profile') && !currentUser) {
        currentPage = 'login';
    }

    // Render navbar
    renderNavbar();

    // Render page content
    switch (currentPage) {
        case 'login':
            renderLoginPage();
            break;
        case 'register':
            renderRegisterPage();
            break;
        case 'feed':
            renderFeedPage();
            break;
        case 'profile':
            renderProfilePage();
            break;
        case 'friends':
            renderFriendsPage();
            break;
        default:
            renderLoginPage();
    }
}

// Initialize the app
function initApp() {
    initializeStorage();

    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        navigateTo('feed');
    } else {
        navigateTo('login');
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);