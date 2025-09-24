/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Modality, Type } from "@google/genai";

// --- Type Definitions ---
interface Post {
    id: string;
    videoUrl: string;
    thumbnailUrl?: string;
    author: string;
    caption: string;
    music: string;
    likes: number;
    comments: Comment[];
    shares: number;
    isLivePhoto?: boolean;
    isGenerated?: boolean; // To track AI-generated content
}

interface Comment {
    id: string;
    author: string;
    text: string;
    timestamp: number;
    likes: number;
}

interface UserProfile {
    username: string;
    avatar: string;
    bio: string;
    posts: string[]; // array of post IDs
    favorites: string[]; // array of post IDs (for the bookmark icon)
    likedPosts: string[]; // array of post IDs (for the like/heart icon)
    following: string[]; // array of usernames
    followersCount: number;
    likesCount: number; // total likes on user's posts
    ep: number;
    badges: string[];
    unlockedPerks: string[];
}

interface Sound {
    id: string;
    name: string;
    artist: string;
    url: string;
    cover: string;
}

interface Promotion {
    id:string;
    type: 'video' | 'account';
    goal: 'views' | 'profile_visits' | 'messages';
    audience: any;
    budget: number;
    duration: number;
    startDate: number;
    status: 'active' | 'completed' | 'paused';
    stats: {
        reach: number;
        clicks: number;
        spend: number;
    };
}


interface Perk {
    name: string;
    type: 'badge' | 'filter';
    cost: number;
    icon?: string;
    description: string;
    previewCss?: string;
}

// --- DOM Elements ---

// App Screens
const appContainer = document.getElementById('app-container') as HTMLDivElement;

// Main Pages
const videoFeed = document.getElementById('video-feed') as HTMLDivElement;
const profilePage = document.getElementById('profile-page') as HTMLDivElement;
const searchPage = document.getElementById('search-page') as HTMLDivElement;
const inboxPage = document.getElementById('inbox-page') as HTMLDivElement;
const settingsPage = document.getElementById('settings-page') as HTMLDivElement;
const profileGrid = document.getElementById('profile-grid') as HTMLDivElement;
const searchGrid = document.getElementById('search-grid') as HTMLDivElement;
const noResultsMessage = document.getElementById('no-results-message') as HTMLParagraphElement;
const addVideoButton = document.getElementById('add-video-btn') as HTMLButtonElement;
const homeButton = document.getElementById('home-btn') as HTMLAnchorElement;
const discoverButton = document.getElementById('discover-btn') as HTMLAnchorElement;
const inboxButton = document.getElementById('inbox-btn') as HTMLAnchorElement;
const profileButton = document.getElementById('profile-btn') as HTMLAnchorElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const trendingSearchesContainer = document.getElementById('trending-searches-container') as HTMLDivElement;
const trendingTagsContainer = document.getElementById('trending-tags') as HTMLDivElement;
const followingTabButton = document.getElementById('following-tab-btn') as HTMLButtonElement;
const forYouTabButton = document.getElementById('for-you-tab-btn') as HTMLButtonElement;
const communityChallengesList = document.getElementById('community-challenges-list') as HTMLDivElement;


// Sound Page
const soundPage = document.getElementById('sound-page') as HTMLDivElement;
const soundPageBackBtn = document.getElementById('sound-page-back-btn') as HTMLButtonElement;
const soundPageTitle = document.getElementById('sound-page-title') as HTMLHeadingElement;
const soundPageGrid = document.getElementById('sound-page-grid') as HTMLDivElement;


// Login Screen & Modals
const loginPromptModal = document.getElementById('login-prompt-modal') as HTMLDivElement;
const promptSignupEmailButton = document.getElementById('prompt-signup-email-btn') as HTMLButtonElement;
const promptLoginLink = document.getElementById('prompt-login-link') as HTMLAnchorElement;
const loginModal = document.getElementById('login-modal') as HTMLDivElement;
const signupModal = document.getElementById('signup-modal') as HTMLDivElement;
const loginButton = document.getElementById('login-btn') as HTMLButtonElement;
const signupButton = document.getElementById('signup-btn') as HTMLButtonElement;
const loginUsernameInput = document.getElementById('login-username-input') as HTMLInputElement;
const loginPasswordInput = document.getElementById('login-password-input') as HTMLInputElement;
const signupUsernameInput = document.getElementById('signup-username-input') as HTMLInputElement;
const signupPasswordInput = document.getElementById('signup-password-input') as HTMLInputElement;
const loginErrorMessage = document.getElementById('login-error-message') as HTMLParagraphElement;
const signupErrorMessage = document.getElementById('signup-error-message') as HTMLParagraphElement;

// Add Content Modal
const addContentModal = document.getElementById('add-content-modal') as HTMLDivElement;
const openUploadModalButton = document.getElementById('open-upload-modal-btn') as HTMLButtonElement;
const openGenerateModalButton = document.getElementById('open-generate-modal-btn') as HTMLButtonElement;
const openLiveModalButton = document.getElementById('open-live-modal-btn') as HTMLButtonElement;
const cancelAddContentButton = document.getElementById('cancel-add-content-btn') as HTMLButtonElement;
const openCameraModalButton = document.getElementById('open-camera-modal-btn') as HTMLButtonElement;
const openLivePhotoModalButton = document.getElementById('open-live-photo-modal-btn') as HTMLButtonElement;


// Upload Modal
const uploadModal = document.getElementById('upload-modal') as HTMLDivElement;
const cancelUploadButton = document.getElementById('cancel-upload-btn') as HTMLButtonElement;
const discardDraftButton = document.getElementById('discard-draft-btn') as HTMLButtonElement;
const postButton = document.getElementById('post-btn') as HTMLButtonElement;
const videoFileInput = document.getElementById('video-file-input') as HTMLInputElement;
const captionInput = document.getElementById('caption-input') as HTMLTextAreaElement;
const videoPreview = document.getElementById('video-preview') as HTMLVideoElement;
const uploadArea = document.getElementById('upload-area') as HTMLDivElement;
const previewArea = document.getElementById('preview-area') as HTMLDivElement;
const selectSoundButton = document.getElementById('select-sound-btn') as HTMLButtonElement;
const selectFilterButton = document.getElementById('select-filter-btn') as HTMLButtonElement;
const soundSelectionDisplay = document.getElementById('sound-selection-display') as HTMLDivElement;
const selectedSoundTitle = document.getElementById('selected-sound-title') as HTMLSpanElement;
const soundPreviewAudio = document.getElementById('sound-preview-audio') as HTMLAudioElement;
const generateCaptionButton = document.getElementById('generate-caption-btn') as HTMLButtonElement;


// Sound Selection Modal
const soundSelectionModal = document.getElementById('sound-selection-modal') as HTMLDivElement;
const closeSoundSelectionButton = document.getElementById('close-sound-selection-btn') as HTMLButtonElement;
const soundFileInput = document.getElementById('sound-file-input') as HTMLInputElement;
const soundUploadPreview = document.getElementById('sound-upload-preview') as HTMLDivElement;
const uploadedSoundPreview = document.getElementById('uploaded-sound-preview') as HTMLAudioElement;
const soundNameInput = document.getElementById('sound-name-input') as HTMLInputElement;
const useSoundButton = document.getElementById('use-sound-btn') as HTMLButtonElement;
const soundList = document.getElementById('sound-list') as HTMLDivElement;


// Generation Modal
const generationModal = document.getElementById('generation-modal') as HTMLDivElement;
const generationInputStage = document.getElementById('generation-input-stage') as HTMLDivElement;
const generationLoadingView = document.getElementById('generation-loading-view') as HTMLDivElement;
const generationPreviewView = document.getElementById('generation-preview-view') as HTMLDivElement;
const generationCaptionInput = document.getElementById('generation-caption-input') as HTMLTextAreaElement;
const generationVideoPreview = document.getElementById('generation-video-preview') as HTMLVideoElement;
const generationImagePreview = document.getElementById('generation-image-preview') as HTMLImageElement;
const cancelGenerationButton = document.getElementById('cancel-generation-btn') as HTMLButtonElement;
const generateButton = document.getElementById('generate-btn') as HTMLButtonElement;
const postGeneratedButton = document.getElementById('post-generated-btn') as HTMLButtonElement;
const selectFilterGeneratedButton = document.getElementById('select-filter-generated-btn') as HTMLButtonElement;
const loadingMessageElement = document.getElementById('loading-message') as HTMLParagraphElement;
const generateCaptionGeneratedButton = document.getElementById('generate-caption-generated-btn') as HTMLButtonElement;
// -- Generation Tabs
const generateTabButton = document.getElementById('generate-tab-btn') as HTMLButtonElement;
const editTabButton = document.getElementById('edit-tab-btn') as HTMLButtonElement;
// -- Generate View (Text-to-Video)
const generationGenerateView = document.getElementById('generation-generate-view') as HTMLDivElement;
const generationPromptInput = document.getElementById('generation-prompt-input') as HTMLTextAreaElement;
const tryExamplePromptButton = document.getElementById('try-example-prompt-btn') as HTMLButtonElement;
const generationVideoLengthSlider = document.getElementById('generation-video-length') as HTMLInputElement;
const generationVideoLengthValue = document.getElementById('generation-video-length-value') as HTMLSpanElement;
const generationAspectRatioButtons = document.getElementById('generation-aspect-ratio-buttons') as HTMLDivElement;
// -- Edit View (Image Edit)
const generationEditView = document.getElementById('generation-edit-view') as HTMLDivElement;
const editUploadArea = document.getElementById('edit-upload-area') as HTMLDivElement;
const editImageFileInput = document.getElementById('edit-image-file-input') as HTMLInputElement;
const editPreviewArea = document.getElementById('edit-preview-area') as HTMLDivElement;
const editImagePreview = document.getElementById('edit-image-preview') as HTMLImageElement;
const editPromptInput = document.getElementById('edit-prompt-input') as HTMLTextAreaElement;

// Comments Modal
const commentsModal = document.getElementById('comments-modal') as HTMLDivElement;
const closeCommentsButton = document.getElementById('close-comments-btn') as HTMLButtonElement;
const commentsList = document.getElementById('comments-list') as HTMLDivElement;
const commentsCountHeader = document.getElementById('comments-count') as HTMLHeadingElement;
const commentInput = document.getElementById('comment-input') as HTMLInputElement;
const postCommentButton = document.getElementById('post-comment-btn') as HTMLButtonElement;
const commentInputAvatar = document.getElementById('comment-input-avatar') as HTMLImageElement;

// Profile Page
const openSettingsButton = document.getElementById('open-settings-btn') as HTMLButtonElement;
const editProfileButton = document.getElementById('edit-profile-btn') as HTMLButtonElement;
const profileAvatar = profilePage.querySelector('.profile-avatar') as HTMLImageElement;
const profileUsername = profilePage.querySelector('.profile-username') as HTMLHeadingElement;
const profileBio = profilePage.querySelector('.profile-bio') as HTMLParagraphElement;
const profilePostsTab = document.getElementById('profile-posts-tab') as HTMLButtonElement;
const profileFavoritesTab = document.getElementById('profile-favorites-tab') as HTMLButtonElement;
const shareProfileButton = document.getElementById('share-profile-btn') as HTMLButtonElement;
const promoteProfileButton = document.getElementById('promote-profile-btn') as HTMLButtonElement;
const openRewardsHubButton = document.getElementById('open-rewards-hub-btn') as HTMLButtonElement;
const profileEpBalance = document.getElementById('profile-ep-balance') as HTMLSpanElement;
const profileBadgesContainer = document.getElementById('profile-badges') as HTMLDivElement;


// Edit Profile Modal
const editProfileModal = document.getElementById('edit-profile-modal') as HTMLDivElement;
const cancelEditProfileButton = document.getElementById('cancel-edit-profile-btn') as HTMLButtonElement;
const saveProfileButton = document.getElementById('save-profile-btn') as HTMLButtonElement;
const editProfileAvatarPreview = document.getElementById('edit-profile-avatar-preview') as HTMLImageElement;
const editProfileAvatarInput = document.getElementById('edit-profile-avatar-input') as HTMLInputElement;
const editProfileUsernameInput = document.getElementById('edit-profile-username-input') as HTMLInputElement;
const editProfileBioInput = document.getElementById('edit-profile-bio-input') as HTMLTextAreaElement;

// Settings Pages
const backToProfileButton = document.getElementById('back-to-profile-btn') as HTMLButtonElement;
const logoutButton = document.getElementById('logout-btn') as HTMLButtonElement;
const darkModeToggle = document.getElementById('dark-mode-toggle') as HTMLInputElement;
const zenModeToggle = document.getElementById('zen-mode-toggle') as HTMLInputElement;
const privacyPage = document.getElementById('privacy-page') as HTMLDivElement;
const privateAccountToggle = document.getElementById('private-account-toggle') as HTMLInputElement;
const pushNotificationsPage = document.getElementById('push-notifications-page') as HTMLDivElement;
const likesNotificationsToggle = document.getElementById('likes-notifications-toggle') as HTMLInputElement;
const commentsNotificationsToggle = document.getElementById('comments-notifications-toggle') as HTMLInputElement;
const followersNotificationsToggle = document.getElementById('followers-notifications-toggle') as HTMLInputElement;
const dmsNotificationsToggle = document.getElementById('dms-notifications-toggle') as HTMLInputElement;
const openPromotionsDashboardButton = document.getElementById('open-promotions-dashboard-btn') as HTMLButtonElement;


// Live Stream Page
const liveStreamPage = document.getElementById('live-stream-page') as HTMLDivElement;
const endLiveButton = document.getElementById('end-live-btn') as HTMLButtonElement;
const liveVideoPreview = document.getElementById('live-video-preview') as HTMLVideoElement;
const liveChatMessages = document.getElementById('live-chat-messages') as HTMLDivElement;
const liveCommentInput = document.getElementById('live-comment-input') as HTMLInputElement;
const sendLiveCommentButton = document.getElementById('send-live-comment-btn') as HTMLButtonElement;
const liveViewerCount = document.getElementById('live-viewer-count') as HTMLSpanElement;
const floatingHeartsContainer = document.getElementById('floating-hearts-container') as HTMLDivElement;
const liveLikeButton = document.getElementById('live-like-btn') as HTMLButtonElement;


// Camera Modal
const cameraModal = document.getElementById('camera-modal') as HTMLDivElement;
const cameraPreview = document.getElementById('camera-preview') as HTMLVideoElement;
const cancelCameraButton = document.getElementById('cancel-camera-btn') as HTMLButtonElement;
const switchCameraButton = document.getElementById('switch-camera-btn') as HTMLButtonElement;
const recordButton = document.getElementById('record-btn') as HTMLButtonElement;
const toggleFiltersButton = document.getElementById('toggle-filters-btn') as HTMLButtonElement;
const cameraFilterList = document.getElementById('camera-filter-list') as HTMLDivElement;


// Permission Denied Modal
const permissionDeniedModal = document.getElementById('permission-denied-modal') as HTMLDivElement;
const permissionModalTitle = document.getElementById('permission-modal-title') as HTMLHeadingElement;
const permissionModalMessage = document.getElementById('permission-modal-message') as HTMLParagraphElement;
const closePermissionModalButton = document.getElementById('close-permission-modal-btn') as HTMLButtonElement;

// Share Modal
const shareModal = document.getElementById('share-modal') as HTMLDivElement;
const cancelShareButton = document.getElementById('cancel-share-btn') as HTMLButtonElement;
const duetButton = document.getElementById('duet-btn') as HTMLButtonElement;
const copyLinkButton = document.getElementById('copy-link-btn') as HTMLButtonElement;
const nativeShareButton = document.getElementById('native-share-btn') as HTMLButtonElement;

// Duet Modal
const duetModal = document.getElementById('duet-modal') as HTMLDivElement;
const duetCameraPreview = document.getElementById('duet-camera-preview') as HTMLVideoElement;
const duetOriginalVideo = document.getElementById('duet-original-video') as HTMLVideoElement;
const duetCanvas = document.getElementById('duet-canvas') as HTMLCanvasElement;
const cancelDuetButton = document.getElementById('cancel-duet-btn') as HTMLButtonElement;
const recordDuetButton = document.getElementById('record-duet-btn') as HTMLButtonElement;

// Promotion Modals
const promotionTypeModal = document.getElementById('promotion-type-modal') as HTMLDivElement;
const promotionSetupModal = document.getElementById('promotion-setup-modal') as HTMLDivElement;
const promotionsDashboardModal = document.getElementById('promotions-dashboard-modal') as HTMLDivElement;
const promoTypeVideoBtn = document.getElementById('promo-type-video') as HTMLButtonElement;
const promoTypeAccountBtn = document.getElementById('promo-type-account') as HTMLButtonElement;
const promoSetupCloseBtn = document.getElementById('promo-setup-close-btn') as HTMLButtonElement;
const promoSetupBackBtn = document.getElementById('promo-setup-back-btn') as HTMLButtonElement;
const promoNextBtn = document.getElementById('promo-next-btn') as HTMLButtonElement;
const promoSetupTitle = document.getElementById('promo-setup-title') as HTMLHeadingElement;
const promoDashboardCloseBtn = document.getElementById('promo-dashboard-close-btn') as HTMLButtonElement;
const noPromotionsMessage = document.getElementById('no-promotions-message') as HTMLParagraphElement;
const promotionsList = document.getElementById('promotions-list') as HTMLDivElement;

// Filter Modal
const filterModal = document.getElementById('filter-modal') as HTMLDivElement;
const filterModalOverlay = filterModal.querySelector('.modal-overlay') as HTMLDivElement;
const doneFilterButton = document.getElementById('done-filter-btn') as HTMLButtonElement;
const filterList = document.getElementById('filter-list') as HTMLDivElement;
const filterIntensityContainer = document.getElementById('filter-intensity-container') as HTMLDivElement;
const filterIntensitySlider = document.getElementById('filter-intensity-slider') as HTMLInputElement;


// Pull to refresh
const pullToRefreshIndicator = document.getElementById('pull-to-refresh-indicator') as HTMLDivElement;
const pullToRefreshSpinner = pullToRefreshIndicator.querySelector('.loading-spinner') as HTMLDivElement;

// Rewards Hub Modal
const rewardsHubModal = document.getElementById('rewards-hub-modal') as HTMLDivElement;
const rewardsHubCloseButton = document.getElementById('rewards-hub-close-btn') as HTMLButtonElement;
const rewardsHubEpBalance = document.getElementById('rewards-hub-ep-balance') as HTMLSpanElement;
const rewardsBadgesList = document.getElementById('rewards-badges-list') as HTMLDivElement;
const rewardsFiltersList = document.getElementById('rewards-filters-list') as HTMLDivElement;


// --- State and Constants ---
const AUTH_KEY = 'icon_auth_user'; // Stores the currently logged-in username
const USERS_STORAGE_KEY = 'icon_users'; // Stores { [username]: password }
const PROFILES_STORAGE_KEY = 'icon_profiles'; // Stores { [username]: UserProfile }
const POSTS_STORAGE_KEY = 'icon_posts';
const DRAFT_STORAGE_KEY = 'icon_draft';
const SETTINGS_STORAGE_KEY = 'icon_settings';
const PROMOTIONS_STORAGE_KEY = 'icon_promotions';
const EXAMPLE_VIDEO_PROMPT = "A vibrant, abstract animation of swirling colors and shapes, with a calming and hypnotic feel.";
const TRENDING_TERMS = ['nature', 'adventure', 'cars', 'baking', 'animals', 'art', 'creative', 'sourdough', 'dogsoftiktok', 'travel'];
const PROMOTION_INTERESTS = ['Gaming', 'Food', 'Fashion', 'Sports', 'Music', 'Movies', 'Technology', 'Travel', 'Art', 'DIY', 'Comedy', 'Education'];
const SIMULATED_USERS = ['CoolCat_22', 'SunnyDays', 'GamerPro123', 'Wanderlust_Explorer', 'Chef_Anna', 'MusicMan', 'ArtLover99'];
const SIMULATED_MESSAGES = [
    'Wow! This is amazing!', 'Hello from Brazil!', 'Love this!', 'What song is this?', '🔥🔥🔥',
    'So cool!', 'Where is this?', 'You are the best!', 'This is my favorite creator!', 'So talented!', '❤️'
];
const FILTERS: { [key: string]: { css?: string; prompt?: string; isAi?: boolean; aiPrompt?: string; previewCss?: string; perkId?: string; } } = {
    // CSS Filters
    'None': { css: 'none' },
    'Vibrant': { css: 'saturate(1.5) contrast(1.1)' },
    'Vintage': { css: 'sepia(0.5) contrast(0.9) brightness(1.1)' },
    'Noir': { css: 'grayscale(1) contrast(1.5)' },
    'Neon': { css: 'contrast(1.4) hue-rotate(300deg) saturate(1.8)' },
    // Special case, CSS-based but with a specific prompt for thumbnail generation
    'Blur': { css: 'blur(8px)', prompt: 'Apply a background blur effect (bokeh) to this image, keeping the main subject in sharp focus.' },
    // AI Filters
    'Sketch': { isAi: true, aiPrompt: 'Animate this image as if it were a pencil sketch coming to life, with visible sketch lines, cross-hatching, and shading.', previewCss: 'grayscale(1) contrast(200) invert(1)' },
    'Cartoon': { isAi: true, aiPrompt: 'Animate this image into a vibrant, fluid 2D cartoon style, with bold outlines and flat colors, maintaining the original subject and composition.', previewCss: 'saturate(2) contrast(1.2)' },
    'Pixel Art': { isAi: true, aiPrompt: 'Animate this image into a retro 16-bit pixel art style, with blocky details and a limited color palette.', previewCss: 'saturate(0.5) contrast(1.5)'},
    'Claymation': { isAi: true, aiPrompt: 'Animate this image in a stop-motion claymation style. The characters and environment should look like they are made of clay, with visible thumbprints and textures.', previewCss: 'saturate(1.2) contrast(1.1) brightness(1.05)' },
    // --- New Unlockable AI Filters ---
    'Glitch': { isAi: true, aiPrompt: 'Animate this image with a datamosh and glitch effect, with digital artifacts, scan lines, and RGB shifts.', previewCss: 'saturate(1.5) contrast(1.2)', perkId: 'filter_glitch' },
    'Sparkle': { isAi: true, aiPrompt: 'Animate this image by adding magical, glittering sparkles and lens flares that gently drift and shimmer across the scene.', previewCss: 'contrast(1.1) brightness(1.1)', perkId: 'filter_sparkle' }
};
const EP_EARN_RATES = {
    like: 1,
    comment: 5,
    share: 10,
    post: 25, // EP for making a new post
};

const PERKS: { [key: string]: Perk } = {
    'badge_early_adopter': { name: 'Early Adopter', type: 'badge', cost: 100, icon: 'military_tech', description: 'Show you were here from the start.' },
    'badge_super_fan': { name: 'Super Fan', type: 'badge', cost: 500, icon: 'local_fire_department', description: 'For exceptional engagement.' },
    'badge_creator': { name: 'Creator', type: 'badge', cost: 1000, icon: 'emoji_events', description: 'Awarded for posting 10 videos.' },
    'filter_glitch': { name: 'Glitch', type: 'filter', cost: 250, description: 'A datamosh-style AI filter.', previewCss: FILTERS['Glitch'].previewCss },
    'filter_sparkle': { name: 'Sparkle', type: 'filter', cost: 250, description: 'A magical, glittering AI filter.', previewCss: FILTERS['Sparkle'].previewCss }
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// --- App State ---
let posts: Post[] = [];
let users: { [username: string]: string } = {};
let profiles: { [username: string]: UserProfile } = {};
let currentUser: UserProfile | null = null;
let activePost: {
    element: HTMLDivElement | null;
    observer: IntersectionObserver | null;
    video: HTMLVideoElement | null;
    id: string | null;
} = {
    element: null,
    observer: null,
    video: null,
    id: null
};
let activePage: HTMLElement = videoFeed;
let cameraStream: MediaStream | null = null;
let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];
let currentOpenPostId: string | null = null;
let searchDebounceTimeout: number | null = null;
let duetStream: MediaStream | null = null;
let duetRecorder: MediaRecorder | null = null;
let duetCombinedStream: MediaStream | null = null;
let currentGeneratedVideoBlob: Blob | null = null;
let liveStreamIntervals: number[] = [];


// --- Data Management ---

function getMockPosts(): Post[] {
    return [
        { id: '1', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', author: 'naturelover', caption: 'Enjoying the great outdoors! 🌳 #nature #adventure', music: 'Upbeat Acoustic - Indie Folk', likes: 1200000, comments: [], shares: 2500 },
        { id: '2', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', author: 'carfanatic', caption: 'Sunday drive in the beast! 🏎️ #cars #speed', music: 'Synthwave Dreams - Retro Electro', likes: 2500000, comments: [], shares: 8000 },
        { id: '3', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', author: 'bakingqueen', caption: 'Perfecting my sourdough recipe! 🍞 #baking #sourdough', music: 'Cozy Cafe - Smooth Jazz', likes: 850000, comments: [], shares: 1200 },
        { id: '4', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', author: 'petpals', caption: 'My dog is a goofball 😂 #dogsoftiktok #animals', music: 'Funny Song - Kevin MacLeod', likes: 5300000, comments: [], shares: 45000 },
        { id: '5', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', author: 'artbyjane', caption: 'Time-lapse of my latest painting! 🎨 #art #creative', music: 'Lo-Fi Beats - Chillhop', likes: 980000, comments: [], shares: 3200 },
        { id: '6', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', author: 'worldtraveler', caption: 'Exploring ancient ruins. Unforgettable experience! #travel', music: 'Cinematic Adventure - Epic Orchestra', likes: 1800000, comments: [], shares: 9500, isLivePhoto: true },
    ];
}

function loadData() {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const storedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);

    users = storedUsers ? JSON.parse(storedUsers) : { 'user': 'password' }; // Add a default user
    profiles = storedProfiles ? JSON.parse(storedProfiles) : {};

    if (storedPosts) {
        posts = JSON.parse(storedPosts);
    } else {
        posts = getMockPosts();
        // Create profiles for mock post authors if they don't exist
        posts.forEach(post => {
            if (!profiles[post.author]) {
                profiles[post.author] = {
                    username: post.author,
                    avatar: `https://i.pravatar.cc/150?u=${post.author}`,
                    bio: `Content creator passionate about ${post.caption.split('#')[1] || 'life'}.`,
                    posts: [], favorites: [], likedPosts: [], following: [],
                    followersCount: Math.floor(Math.random() * 10000),
                    likesCount: Math.floor(Math.random() * 100000),
                    ep: 0, badges: [], unlockedPerks: []
                };
            }
        });
    }


    // Ensure default user has a profile
    if (!profiles['user']) {
        profiles['user'] = {
            username: 'user',
            avatar: `https://i.pravatar.cc/150?u=user`,
            bio: 'This is a default user profile.',
            posts: [],
            favorites: [],
            likedPosts: [],
            following: [],
            followersCount: 100,
            likesCount: 1500,
            ep: 100,
            badges: [],
            unlockedPerks: []
        };
    }
}

function saveData() {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
}

function saveCurrentUserProfile() {
    if (currentUser) {
        profiles[currentUser.username] = currentUser;
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    }
}

function savePosts() {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
}

// --- Authentication ---

function checkAuth(promptLogin = true): boolean {
    if (currentUser) {
        return true;
    }
    if (promptLogin) {
        loginPromptModal.classList.remove('hidden');
    }
    return false;
}

function handleSignup() {
    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value.trim();

    if (!username || !password) {
        signupErrorMessage.textContent = 'Please enter a username and password.';
        signupErrorMessage.classList.remove('hidden');
        return;
    }

    if (users[username]) {
        signupErrorMessage.textContent = 'Username already taken.';
        signupErrorMessage.classList.remove('hidden');
        return;
    }

    users[username] = password;
    profiles[username] = {
        username,
        avatar: `https://i.pravatar.cc/150?u=${username}`,
        bio: 'Welcome to my ICON profile!',
        posts: [],
        favorites: [],
        likedPosts: [],
        following: [],
        followersCount: 0,
        likesCount: 0,
        ep: 0,
        badges: [],
        unlockedPerks: []
    };

    saveData();
    loginUser(username);
}

function handleLogin() {
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    if (!username || !password) {
        loginErrorMessage.textContent = 'Please enter a username and password.';
        loginErrorMessage.classList.remove('hidden');
        return;
    }

    if (!users[username] || users[username] !== password) {
        loginErrorMessage.textContent = 'Invalid username or password.';
        loginErrorMessage.classList.remove('hidden');
        return;
    }

    loginUser(username);
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem(AUTH_KEY);
    showPage(videoFeed);
    document.body.classList.remove('settings-visible'); // Ensure main view is shown
    // Re-render the UI for guest state
    renderForGuest();
}


function loginUser(username: string) {
    currentUser = profiles[username];
    if (!currentUser) {
        // This case should ideally not happen if signup creates a profile
        profiles[username] = {
            username, avatar: `https://i.pravatar.cc/150?u=${username}`, bio: '', posts: [], favorites: [], likedPosts: [],
            following: [], followersCount: 0, likesCount: 0, ep: 0, badges: [], unlockedPerks: []
        };
        currentUser = profiles[username];
        saveData();
    }
    localStorage.setItem(AUTH_KEY, username);

    loginModal.classList.add('hidden');
    signupModal.classList.add('hidden');
    loginPromptModal.classList.add('hidden');

    renderAppForCurrentUser();
}

function renderForGuest() {
    // Reset profile page to a default state or disable it
    profileUsername.textContent = '@guest';
    profileAvatar.src = 'https://i.pravatar.cc/150';
    profileBio.textContent = 'Log in to see your profile.';
    profileGrid.innerHTML = '';

    // Update comment avatar
    commentInputAvatar.src = 'https://i.pravatar.cc/150';

    // Refresh the feed to show non-personalized state
    refreshFeedUI();
}

function renderAppForCurrentUser() {
    if (!currentUser) return;

    // Update profile page view with current user's data
    profileUsername.textContent = `@${currentUser.username}`;
    profileAvatar.src = currentUser.avatar;
    profileBio.textContent = currentUser.bio;
    updateProfilePage(currentUser.username);

    // Update avatar in comment input area
    commentInputAvatar.src = currentUser.avatar;

    // Refresh the entire feed to update interaction states (likes, follows)
    refreshFeedUI();
}

// --- UI Rendering & Page Navigation ---

function showPage(pageElement: HTMLElement) {
    [videoFeed, profilePage, searchPage, inboxPage, settingsPage, soundPage].forEach(page => {
        page.classList.add('hidden');
    });
    pageElement.classList.remove('hidden');
    activePage = pageElement;

    // Hide settings subpages if we navigate away
    if (pageElement !== settingsPage) {
        document.querySelectorAll('.settings-subpage').forEach(subpage => subpage.classList.add('hidden'));
        document.body.classList.remove('settings-visible');
    }
}

function updateNav(activeButton: HTMLElement) {
    [homeButton, discoverButton, inboxButton, profileButton].forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

const createPostElement = (post: Post): HTMLDivElement => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.postId = post.id;
    postElement.dataset.author = post.author;

    const authorProfile = profiles[post.author] || { avatar: 'https://i.pravatar.cc/150' };
    const isLiked = currentUser?.likedPosts.includes(post.id) ?? false;
    const isFavorited = currentUser?.favorites.includes(post.id) ?? false;
    const isFollowing = currentUser?.following.includes(post.author) ?? false;


    postElement.innerHTML = `
        <video class="post-video" src="${post.videoUrl}" loop playsinline preload="metadata" ${post.isLivePhoto ? 'muted' : ''}></video>
        <div class="video-overlay">
            <div class="post-info">
                <h3>@${post.author}</h3>
                <p>${post.caption.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>')}</p>
                <div class="music-info">
                    <span class="material-symbols-outlined">music_note</span>
                    <span>${post.music}</span>
                </div>
            </div>
            <div class="post-actions">
                <div class="action-item profile">
                    <img src="${authorProfile.avatar}" alt="${post.author}'s avatar" class="avatar">
                    <span class="material-symbols-outlined plus-icon ${isFollowing ? 'hidden' : ''}">add_circle</span>
                    <span class="material-symbols-outlined check-icon ${isFollowing ? '' : 'hidden'}">check_circle</span>
                </div>
                <div class="action-item like-btn ${isLiked ? 'liked' : ''}">
                    <span class="material-symbols-outlined">favorite</span>
                    <p>${post.likes.toLocaleString()}</p>
                </div>
                <div class="action-item comment-btn">
                    <span class="material-symbols-outlined">chat_bubble</span>
                    <p>${post.comments.length.toLocaleString()}</p>
                </div>
                <div class="action-item favorite-btn ${isFavorited ? 'favorited' : ''}">
                    <span class="material-symbols-outlined">bookmark</span>
                    <p>Save</p>
                </div>
                <div class="action-item share-btn">
                    <span class="material-symbols-outlined">share</span>
                    <p>${post.shares.toLocaleString()}</p>
                </div>
                <div class="spinning-disc-container">
                    <div class="spinning-disc"></div>
                </div>
            </div>
        </div>
        ${post.isLivePhoto ? '<div class="live-photo-badge">LIVE</div><div class="live-photo-interaction-hint"><span class="material-symbols-outlined">touch_app</span><p>Press and hold</p></div>' : ''}
    `;

    // Add event listeners
    postElement.querySelector('.like-btn')?.addEventListener('click', () => handleLike(post.id, postElement));
    postElement.querySelector('.comment-btn')?.addEventListener('click', () => openCommentsModal(post.id));
    postElement.querySelector('.favorite-btn')?.addEventListener('click', () => handleFavorite(post.id, postElement));
    postElement.querySelector('.share-btn')?.addEventListener('click', () => shareModal.classList.remove('hidden'));
    postElement.querySelector('.profile')?.addEventListener('click', () => handleFollow(post.author, postElement));

    return postElement;
};

function populateFeed() {
    videoFeed.innerHTML = ''; // Clear existing feed
    // Re-add tabs
    videoFeed.innerHTML = `
        <div id="feed-tabs">
            <button id="following-tab-btn" class="feed-tab-btn">Following</button>
            <button id="for-you-tab-btn" class="feed-tab-btn active">For You</button>
        </div>
    `;
    posts.forEach(post => {
        videoFeed.appendChild(createPostElement(post));
    });

    // Re-attach tab listeners
    videoFeed.querySelector('#following-tab-btn')?.addEventListener('click', () => switchFeed('following'));
    videoFeed.querySelector('#for-you-tab-btn')?.addEventListener('click', () => switchFeed('for-you'));
}

function updatePostUI(postElement: HTMLElement) {
    const postId = postElement.dataset.postId;
    const author = postElement.dataset.author;
    if (!postId || !author) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = currentUser?.likedPosts.includes(postId) ?? false;
    const isFavorited = currentUser?.favorites.includes(postId) ?? false;
    const isFollowing = currentUser?.following.includes(author) ?? false;

    const likeBtn = postElement.querySelector('.like-btn') as HTMLDivElement;
    const favoriteBtn = postElement.querySelector('.favorite-btn') as HTMLDivElement;
    const plusIcon = postElement.querySelector('.plus-icon') as HTMLElement;
    const checkIcon = postElement.querySelector('.check-icon') as HTMLElement;
    const likeCountEl = likeBtn.querySelector('p') as HTMLParagraphElement;

    likeBtn.classList.toggle('liked', isLiked);
    favoriteBtn.classList.toggle('favorited', isFavorited);
    plusIcon.classList.toggle('hidden', isFollowing);
    checkIcon.classList.toggle('hidden', !isFollowing);
    likeCountEl.textContent = post.likes.toLocaleString();
}


function refreshFeedUI() {
    const scrollPosition = videoFeed.scrollTop;
    populateFeed();
    videoFeed.scrollTop = scrollPosition; // Restore scroll position
    document.querySelectorAll('.post').forEach(el => updatePostUI(el as HTMLElement));
}

// --- User Actions ---
function handleLike(postId: string, postElement: HTMLElement) {
    if (!checkAuth()) return;
    const post = posts.find(p => p.id === postId);
    if (!post || !currentUser) return;

    const likedIndex = currentUser.likedPosts.indexOf(postId);
    if (likedIndex > -1) {
        currentUser.likedPosts.splice(likedIndex, 1);
        post.likes--;
    } else {
        currentUser.likedPosts.push(postId);
        post.likes++;
    }

    saveCurrentUserProfile();
    savePosts();
    updatePostUI(postElement);
}

function handleFavorite(postId: string, postElement: HTMLElement) {
    if (!checkAuth()) return;
    if (!currentUser) return;

    const favoritedIndex = currentUser.favorites.indexOf(postId);
    if (favoritedIndex > -1) {
        currentUser.favorites.splice(favoritedIndex, 1);
    } else {
        currentUser.favorites.push(postId);
    }

    saveCurrentUserProfile();
    updatePostUI(postElement);
}


function handleFollow(authorUsername: string, postElement: HTMLElement) {
    if (!checkAuth() || !currentUser || currentUser.username === authorUsername) return;

    const followingIndex = currentUser.following.indexOf(authorUsername);
    if (followingIndex > -1) {
        currentUser.following.splice(followingIndex, 1);
    } else {
        currentUser.following.push(authorUsername);
    }

    saveCurrentUserProfile();

    // Update all visible posts by the same author
    document.querySelectorAll(`.post[data-author="${authorUsername}"]`).forEach(el => {
        updatePostUI(el as HTMLElement);
    });
}


function openCommentsModal(postId: string) {
    if (!checkAuth()) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    currentOpenPostId = postId;
    commentsList.innerHTML = '';

    commentsCountHeader.textContent = `${post.comments.length} comments`;

    post.comments.forEach(comment => {
        commentsList.appendChild(createCommentElement(comment));
    });

    commentsModal.classList.remove('hidden');
}

function createCommentElement(comment: Comment): HTMLDivElement {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment-item';
    const authorProfile = profiles[comment.author] || { avatar: `https://i.pravatar.cc/150?u=${comment.author}` };

    commentElement.innerHTML = `
        <img src="${authorProfile.avatar}" alt="${comment.author}" class="comment-avatar">
        <div class="comment-body">
            <div class="comment-content">
                <p><span class="username">@${comment.author}</span></p>
                <p class="text">${comment.text}</p>
                <div class="comment-footer">
                    <span>${new Date(comment.timestamp).toLocaleDateString()}</span>
                    <span>Reply</span>
                </div>
            </div>
            <div class="comment-like-action">
                <span class="material-symbols-outlined">favorite</span>
                <span class="likes-count">${comment.likes}</span>
            </div>
        </div>
    `;
    return commentElement;
}

function handlePostComment() {
    if (!checkAuth() || !currentUser || !currentOpenPostId) return;

    const text = commentInput.value.trim();
    if (!text) return;

    const post = posts.find(p => p.id === currentOpenPostId);
    if (!post) return;

    const newComment: Comment = {
        id: `c${Date.now()}`,
        author: currentUser.username,
        text,
        timestamp: Date.now(),
        likes: 0
    };

    post.comments.push(newComment);
    savePosts();

    // Real-time UI update
    commentsList.appendChild(createCommentElement(newComment));
    commentsCountHeader.textContent = `${post.comments.length} comments`;
    commentInput.value = '';
    commentsList.scrollTop = commentsList.scrollHeight; // Scroll to new comment

    // Update comment count on the post in the feed
    const postElement = document.querySelector(`.post[data-post-id="${currentOpenPostId}"]`);
    if (postElement) {
        const commentBtn = postElement.querySelector('.comment-btn p') as HTMLParagraphElement;
        commentBtn.textContent = post.comments.length.toLocaleString();
    }
}


function updateProfilePage(username: string) {
    const profile = profiles[username];
    if (!profile) return;

    profileGrid.innerHTML = '';
    const userPosts = posts.filter(p => p.author === username);
    userPosts.forEach(post => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.innerHTML = `<video class="grid-item-video" src="${post.videoUrl}#t=0.1" preload="metadata"></video>`;
        profileGrid.appendChild(item);
    });
}

function switchFeed(feedType: 'for-you' | 'following') {
    if (feedType === 'following') {
        if (!checkAuth()) return;
        // Logic to filter and show following feed
        forYouTabButton.classList.remove('active');
        followingTabButton.classList.add('active');
    } else {
        // Logic to show for-you feed
        followingTabButton.classList.remove('active');
        forYouTabButton.classList.add('active');
    }
    // For now, just visually switch tab, full implementation needs feed rebuild
}

// --- New Feature Implementations ---

// Utility to stop media streams
function stopStream(stream: MediaStream | null) {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// Utility to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

async function openCamera() {
    if (!checkAuth()) return;
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        cameraPreview.srcObject = cameraStream;
        cameraModal.classList.remove('hidden');
    } catch (err) {
        console.error("Camera access denied:", err);
        permissionModalTitle.textContent = "Camera Access Denied";
        permissionModalMessage.textContent = "To record video, please allow access to your camera and microphone in your browser settings.";
        permissionDeniedModal.classList.remove('hidden');
    }
}

function closeCamera() {
    stopStream(cameraStream);
    cameraStream = null;
    cameraModal.classList.add('hidden');
    recordButton.classList.remove('recording');
}

function startRecording() {
    if (!cameraStream) return;
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(cameraStream);
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
    mediaRecorder.onstop = () => {
        const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        closeCamera();
        // Open upload modal with the recorded video
        videoPreview.src = videoUrl;
        previewArea.classList.remove('hidden');
        uploadArea.classList.add('hidden');
        captionInput.value = '';
        uploadModal.classList.remove('hidden');
    };
    mediaRecorder.start();
    recordButton.classList.add('recording');
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    recordButton.classList.remove('recording');
}

async function goLive() {
    if (!checkAuth()) return;
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        liveVideoPreview.srcObject = cameraStream;
        liveStreamPage.classList.remove('hidden');
        appContainer.classList.add('live-active');

        // Start simulation
        let viewers = Math.floor(Math.random() * 100) + 50;
        liveViewerCount.textContent = viewers.toString();

        const viewerInterval = window.setInterval(() => {
            viewers += Math.floor(Math.random() * 11) - 5;
            if (viewers < 10) viewers = 10;
            liveViewerCount.textContent = viewers.toString();
        }, 3000);

        const chatInterval = window.setInterval(() => {
            const user = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
            const message = SIMULATED_MESSAGES[Math.floor(Math.random() * SIMULATED_MESSAGES.length)];
            const messageEl = document.createElement('div');
            messageEl.className = 'live-chat-message';
            messageEl.innerHTML = `<span class="username">@${user}</span> ${message}`;
            liveChatMessages.appendChild(messageEl);
            liveChatMessages.scrollTop = liveChatMessages.scrollHeight;
        }, 2500);

        liveStreamIntervals.push(viewerInterval, chatInterval);

    } catch (err) {
        console.error("Camera access denied for live:", err);
        permissionModalTitle.textContent = "Camera Access Denied";
        permissionModalMessage.textContent = "To go live, please allow access to your camera in your browser settings.";
        permissionDeniedModal.classList.remove('hidden');
    }
}

function endLive() {
    stopStream(cameraStream);
    cameraStream = null;
    liveStreamPage.classList.add('hidden');
    appContainer.classList.remove('live-active');
    liveStreamIntervals.forEach(clearInterval);
    liveStreamIntervals = [];
    liveChatMessages.innerHTML = '';
    liveCommentInput.value = '';
}

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️'; // Can also use an SVG or image
    heart.style.fontSize = `${Math.random() * 20 + 15}px`;
    heart.style.left = `${Math.random() * 40 + 30}%`;
    heart.style.animationDuration = `${Math.random() * 2 + 3}s`;
    floatingHeartsContainer.appendChild(heart);
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

async function handleGenerateVideo() {
    if (!checkAuth()) return;
    const activeTab = document.querySelector('.modal-tab-btn.active')?.getAttribute('data-tab');

    generationInputStage.classList.add('hidden');
    generationLoadingView.classList.remove('hidden');
    let loadingMessageInterval: number | null = null;
    try {
        const messages = ["Warming up the AI...", "Gathering pixels...", "Teaching robots to dream...", "Compositing frames...", "Adding a little magic...", "Almost ready!"];
        let messageIndex = 0;
        loadingMessageElement.textContent = messages[messageIndex];
        loadingMessageInterval = window.setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            loadingMessageElement.textContent = messages[messageIndex];
        }, 3000);

        let operation;
        if (activeTab === 'generate') {
            const prompt = generationPromptInput.value;
            if (!prompt) throw new Error("Prompt is empty.");
            operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: prompt,
            });
        } else { // 'edit' tab for Live Photo
            const imageFile = editImageFileInput.files?.[0];
            if (!imageFile) throw new Error("No image selected for Live Photo.");
            const base64Image = await fileToBase64(imageFile);
            const prompt = editPromptInput.value || "Animate this image subtly.";
            operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: prompt,
                image: {
                    imageBytes: base64Image.split(',')[1],
                    mimeType: imageFile.type,
                },
            });
        }

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) throw new Error("Video generation failed to produce a link.");

        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) throw new Error("Failed to download generated video.");

        currentGeneratedVideoBlob = await videoResponse.blob();
        const videoUrl = URL.createObjectURL(currentGeneratedVideoBlob);

        generationVideoPreview.src = videoUrl;
        generationVideoPreview.classList.remove('hidden');
        generationImagePreview.classList.add('hidden');

        generationLoadingView.classList.add('hidden');
        generationPreviewView.classList.remove('hidden');

    } catch (error) {
        console.error("AI Generation Error:", error);
        alert(`An error occurred during generation: ${(error as Error).message}`);
        generationLoadingView.classList.add('hidden');
        generationInputStage.classList.remove('hidden'); // Show input again
    } finally {
        if (loadingMessageInterval) clearInterval(loadingMessageInterval);
    }
}

function postGeneratedContent(isLivePhoto: boolean) {
    if (!checkAuth() || !currentUser || !currentGeneratedVideoBlob) return;

    const caption = generationCaptionInput.value;
    const videoUrl = URL.createObjectURL(currentGeneratedVideoBlob);

    const newPost: Post = {
        id: `p${Date.now()}`,
        videoUrl: videoUrl,
        author: currentUser.username,
        caption: caption,
        music: isLivePhoto ? 'Live Photo' : 'AI Generated',
        likes: 0,
        comments: [],
        shares: 0,
        isGenerated: true,
        isLivePhoto: isLivePhoto
    };
    posts.unshift(newPost);
    currentUser.posts.push(newPost.id);

    savePosts();
    saveCurrentUserProfile();

    refreshFeedUI();
    generationModal.classList.add('hidden');
    showPage(videoFeed);

    // Reset generation modal state
    currentGeneratedVideoBlob = null;
    generationCaptionInput.value = '';
    generationPromptInput.value = '';
    generationPreviewView.classList.add('hidden');
    generationInputStage.classList.remove('hidden');
}


// --- Initialization ---

function setupEventListeners() {
    // Navigation
    homeButton.addEventListener('click', (e) => { e.preventDefault(); showPage(videoFeed); updateNav(homeButton); });
    discoverButton.addEventListener('click', (e) => { e.preventDefault(); showPage(searchPage); updateNav(discoverButton); });
    inboxButton.addEventListener('click', (e) => { e.preventDefault(); if(checkAuth()) { showPage(inboxPage); updateNav(inboxButton); } });
    profileButton.addEventListener('click', (e) => { e.preventDefault(); if(checkAuth()) { showPage(profilePage); updateNav(profileButton); } });

    // Authentication Modals
    signupButton.addEventListener('click', handleSignup);
    loginButton.addEventListener('click', handleLogin);
    logoutButton.addEventListener('click', handleLogout);

    promptSignupEmailButton.addEventListener('click', () => {
        loginPromptModal.classList.add('hidden');
        signupModal.classList.remove('hidden');
    });

    promptLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginPromptModal.classList.add('hidden');
        loginModal.classList.remove('hidden');
    });

    // Generic Modal Close Buttons
    document.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', () => {
            const modalId = (el as HTMLElement).dataset.closeModal;
            if (modalId) {
                const modal = document.getElementById(modalId);
                modal?.classList.add('hidden');
            }
        });
    });

    // Comments Modal
    closeCommentsButton.addEventListener('click', () => commentsModal.classList.add('hidden'));
    postCommentButton.addEventListener('click', handlePostComment);
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlePostComment();
    });

    // Settings
    openSettingsButton.addEventListener('click', () => {
        showPage(settingsPage);
        document.body.classList.add('settings-visible');
    });
    backToProfileButton.addEventListener('click', () => {
        showPage(profilePage);
        document.body.classList.remove('settings-visible');
    });
    document.querySelectorAll('.settings-back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = (btn as HTMLElement).dataset.target;
            if (targetId) {
                showPage(document.getElementById(targetId) as HTMLElement);
            }
        });
    });

    // Add Content
    addVideoButton.addEventListener('click', () => {
        if (checkAuth()) {
            addContentModal.classList.remove('hidden');
        }
    });
    cancelAddContentButton.addEventListener('click', () => addContentModal.classList.add('hidden'));
    
    openUploadModalButton.addEventListener('click', () => {
        addContentModal.classList.add('hidden');
        uploadModal.classList.remove('hidden');
    });
    
    openCameraModalButton.addEventListener('click', () => {
        addContentModal.classList.add('hidden');
        openCamera();
    });
    
    openGenerateModalButton.addEventListener('click', () => {
        addContentModal.classList.add('hidden');
        generationModal.classList.remove('hidden');
        generateTabButton.click(); // Ensure generate tab is active
    });
    
    openLivePhotoModalButton.addEventListener('click', () => {
        addContentModal.classList.add('hidden');
        generationModal.classList.remove('hidden');
        editTabButton.click(); // Switch to edit tab for live photo
    });
    
    openLiveModalButton.addEventListener('click', () => {
        addContentModal.classList.add('hidden');
        goLive();
    });


    // Upload
    cancelUploadButton.addEventListener('click', () => uploadModal.classList.add('hidden'));
    postButton.addEventListener('click', () => {
        if (!checkAuth() || !currentUser) return;
        const caption = captionInput.value;
        const videoSrc = videoPreview.src;
        if (!videoSrc) return; // No video selected

        const newPost: Post = {
            id: `p${Date.now()}`,
            videoUrl: videoSrc,
            author: currentUser.username,
            caption: caption,
            music: 'Original Sound',
            likes: 0,
            comments: [],
            shares: 0
        };
        posts.unshift(newPost); // Add to beginning of array
        currentUser.posts.push(newPost.id);

        savePosts();
        saveCurrentUserProfile();

        refreshFeedUI();
        uploadModal.classList.add('hidden');
        showPage(videoFeed);
    });

    // Camera Modal Listeners
    cancelCameraButton.addEventListener('click', closeCamera);
    recordButton.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            stopRecording();
        } else {
            startRecording();
        }
    });

    // Live Stream Listeners
    endLiveButton.addEventListener('click', endLive);
    liveLikeButton.addEventListener('click', createFloatingHeart);
    sendLiveCommentButton.addEventListener('click', () => {
        const text = liveCommentInput.value.trim();
        if (text && currentUser) {
            const messageEl = document.createElement('div');
            messageEl.className = 'live-chat-message self';
            messageEl.innerHTML = `<span class="username">@${currentUser.username}</span> ${text}`;
            liveChatMessages.appendChild(messageEl);
            liveChatMessages.scrollTop = liveChatMessages.scrollHeight;
            liveCommentInput.value = '';
        }
    });

    // Generation Modal Listeners
    generateTabButton.addEventListener('click', () => {
        generateTabButton.classList.add('active');
        editTabButton.classList.remove('active');
        generationGenerateView.classList.remove('hidden');
        generationEditView.classList.add('hidden');
    });
    editTabButton.addEventListener('click', () => {
        editTabButton.classList.add('active');
        generateTabButton.classList.remove('active');
        generationEditView.classList.remove('hidden');
        generationGenerateView.classList.add('hidden');
    });
    cancelGenerationButton.addEventListener('click', () => generationModal.classList.add('hidden'));
    generateButton.addEventListener('click', handleGenerateVideo);
    postGeneratedButton.addEventListener('click', () => {
         const isLivePhoto = !generationGenerateView.classList.contains('hidden');
         postGeneratedContent(isLivePhoto);
    });

    editImageFileInput.addEventListener('change', async () => {
        const file = editImageFileInput.files?.[0];
        if (file) {
            const dataUrl = await fileToBase64(file);
            editImagePreview.src = dataUrl;
            editPreviewArea.classList.remove('hidden');
            editUploadArea.classList.add('hidden');
            editPromptInput.classList.remove('hidden');
        }
    });
    
    closePermissionModalButton.addEventListener('click', () => permissionDeniedModal.classList.add('hidden'));

}

async function initApp() {
    loadData();
    const loggedInUsername = localStorage.getItem(AUTH_KEY);

    if (loggedInUsername && profiles[loggedInUsername]) {
        loginUser(loggedInUsername);
    } else {
        renderForGuest();
    }

    populateFeed();
    setupEventListeners();
    showPage(videoFeed);
    updateNav(homeButton);
}

// --- Start the app ---
initApp();
window.clearTimeout(searchDebounceTimeout as number);
