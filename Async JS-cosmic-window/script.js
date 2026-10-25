/* ==========================================================================
   COSMIC WINDOW — SPACE DISCOVERY EXPLORER
   Vanilla JavaScript Async Fetching, State Management & Error Handling
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================================
       1. CONSTANTS & CONFIGURATION
       ========================================================================== */

    const API_BASE_URL = "https://api.nasa.gov/planetary/apod";
    const API_STORAGE_KEY = "cosmicWindowApiKey";
    const DEFAULT_API_KEY = "7J6rggTpPjm6PkRq8Kmmbhm7DRPgKLHWTQkzGDRp";
    const MIN_DATE = "1995-06-16"; // Date of the very first NASA APOD

    // Verified Curated Discoveries (used as instant offline / rate-limit fallbacks)
    const CURATED_DISCOVERIES = {
        "2026-10-21": {
            date: "2026-10-21",
            title: "New Ghosts Revealed in Cassiopeia",
            media_type: "image",
            url: "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/october/IC63.png",
            hdurl: "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/october/IC63.png",
            copyright: "NASA, ESA, STScI",
            explanation: "Jinkies, look at all those ghosts! It took 100 hours of observation and a special oxygen filter to capture three faint, ghostly nebulae in the constellation of Cassiopeia. The brightest ghost, IC 63, glows eerie red and blue under the intense radiation of nearby star Gamma Cassiopeiae."
        },
        "2026-10-25": {
            date: "2026-10-25",
            title: "Dark Matter in a Simulated Universe",
            media_type: "image",
            url: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2021/october/DarkMatter_KipacAmnh_1200.jpg",
            hdurl: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2021/october/DarkMatter_KipacAmnh_1200.jpg",
            copyright: "Tom Abel & Ralf Kaehler (KIPAC, SLAC), AMNH",
            explanation: "Is our universe haunted? The gravity of unseen dark matter is the leading explanation for why galaxies rotate so fast and how cosmic filaments are distributed across space. In this frame from a detailed computer simulation, complex filaments of dark matter are strewn about like spider webs."
        },
        "2022-07-12": {
            date: "2022-07-12",
            title: "Webb's First Deep Field",
            media_type: "image",
            url: "https://images-assets.nasa.gov/image/PIA25328/PIA25328~large.jpg",
            hdurl: "https://images-assets.nasa.gov/image/PIA25328/PIA25328~orig.jpg",
            copyright: "NASA, ESA, CSA, STScI",
            explanation: "NASA's James Webb Space Telescope has produced the deepest and sharpest infrared image of the distant universe to date. Known as Webb’s First Deep Field, this image of galaxy cluster SMACS 0723 is overflowing with thousands of galaxies — including the faintest objects ever observed in the infrared."
        },
        "2022-10-19": {
            date: "2022-10-19",
            title: "The Pillars of Creation from Webb",
            media_type: "image",
            url: "https://images-assets.nasa.gov/image/PIA25555/PIA25555~large.jpg",
            hdurl: "https://images-assets.nasa.gov/image/PIA25555/PIA25555~orig.jpg",
            copyright: "NASA, ESA, CSA, STScI, J. DePasquale, A. Pagan",
            explanation: "A lush, highly detailed landscape — the iconic Pillars of Creation — appears in NASA’s James Webb Space Telescope’s near-infrared light view. These towering columns of cool interstellar gas and dust are actively giving birth to new stars inside the Eagle Nebula (M16)."
        },
        "2022-07-13": {
            date: "2022-07-13",
            title: "Cosmic Cliffs of the Carina Nebula",
            media_type: "image",
            url: "https://images-assets.nasa.gov/image/PIA25329/PIA25329~large.jpg",
            hdurl: "https://images-assets.nasa.gov/image/PIA25329/PIA25329~orig.jpg",
            copyright: "NASA, ESA, CSA, STScI",
            explanation: "This landscape of celestial 'mountains' and 'valleys' speckled with glittering stars is actually the edge of a nearby, young, star-forming region called NGC 3324 in the Carina Nebula. Captured in infrared light by NASA's James Webb Space Telescope, this view reveals previously invisible areas of star birth."
        },
        "2021-11-24": {
            date: "2021-11-24",
            title: "The Andromeda Galaxy",
            media_type: "image",
            url: "https://images-assets.nasa.gov/image/PIA15416/PIA15416~large.jpg",
            hdurl: "https://images-assets.nasa.gov/image/PIA15416/PIA15416~orig.jpg",
            copyright: "NASA, JPL-Caltech",
            explanation: "The Andromeda Galaxy (Messier 31) is the nearest major spiral galaxy to our own Milky Way. Spanning roughly 220,000 light-years across and containing hundreds of billions of stars, it is on a slow gravitational dance that will merge with our galaxy in about 4.5 billion years."
        },
        "2019-04-11": {
            date: "2019-04-11",
            title: "First Horizon-Scale Image of a Black Hole",
            media_type: "image",
            url: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2019/april/M87bh_EHT_2629.jpg",
            hdurl: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2019/april/M87bh_EHT_2629.jpg",
            copyright: "Event Horizon Telescope Collaboration",
            explanation: "What does a black hole look like? To find out, radio telescopes from around the Earth coordinated to form the Event Horizon Telescope. The result is the historic first direct visual evidence of the supermassive black hole at the center of galaxy Messier 87."
        }
    };

    /* ==========================================================================
       2. DOM ELEMENT SELECTORS
       ========================================================================== */

    const dateInput = document.getElementById("date-input");
    const searchButton = document.getElementById("search-button");
    const todayButton = document.getElementById("today-button");
    const randomButton = document.getElementById("random-button");
    const presetChips = document.querySelectorAll(".preset-chip[data-date]");

    // API Key Controls
    const apiKeyToggle = document.getElementById("api-key-toggle");
    const apiKeyForm = document.getElementById("api-key-form");
    const apiKeyInput = document.getElementById("api-key-input");
    const saveKeyButton = document.getElementById("save-key-button");
    const resetKeyButton = document.getElementById("reset-key-button");
    const apiKeyStatus = document.getElementById("api-key-status");

    // Message & State Boxes
    const loadingMessage = document.getElementById("loading-message");
    const errorMessage = document.getElementById("error-message");
    const errorHeading = document.getElementById("error-heading");
    const errorText = document.getElementById("error-text");
    const retryButton = document.getElementById("retry-button");
    const archiveFallbackButton = document.getElementById("archive-fallback-button");

    // Discovery Card Elements
    const discoveryCard = document.getElementById("discovery-card");
    const archiveNotice = document.getElementById("archive-notice");
    const spaceImage = document.getElementById("space-image");
    const spaceVideo = document.getElementById("space-video");
    const imageLabel = document.getElementById("image-label");
    const imageDate = document.getElementById("image-date");
    const imageTitle = document.getElementById("image-title");
    const imageExplanation = document.getElementById("image-explanation");
    const imageCredit = document.getElementById("image-credit");
    const originalLink = document.getElementById("original-link");

    /* ==========================================================================
       3. STATE MANAGEMENT
       ========================================================================== */

    let selectedDate = "";
    let activeApiKey = localStorage.getItem(API_STORAGE_KEY) || DEFAULT_API_KEY;
    let isRequestInProgress = false;

    /* ==========================================================================
       4. DATE UTILITIES
       ========================================================================== */

    // Get today's date formatted as YYYY-MM-DD
    function getTodayDateString(offsetDays = 0) {
        const date = new Date();
        if (offsetDays !== 0) {
            date.setDate(date.getDate() + offsetDays);
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // Format date string for human-readable display
    function formatDisplayDate(dateString) {
        if (!dateString) return "Cosmic Archive";
        const date = new Date(`${dateString}T12:00:00`);
        if (Number.isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    // Initialize the date picker min and max attributes
    function setupDatePicker() {
        const today = getTodayDateString();
        dateInput.min = MIN_DATE;
        dateInput.max = today;
        dateInput.value = today;
        selectedDate = today;
    }

    // Generate a random past date between MIN_DATE and today
    function getRandomDate() {
        const start = new Date(`${MIN_DATE}T00:00:00`).getTime();
        const end = new Date().getTime();
        const randomTime = start + Math.random() * (end - start);
        const randomDate = new Date(randomTime);

        const year = randomDate.getFullYear();
        const month = String(randomDate.getMonth() + 1).padStart(2, "0");
        const day = String(randomDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    /* ==========================================================================
       5. HTML PARSER FOR NASA APOD BASIC ARCHIVE
       Directly extracts authentic astronomy pictures to avoid the legacy
       NASA API scraper bug that returns generic 'nasa-logo@2x.png'.
       ========================================================================== */

    function parseApodHtml(html, dateStr) {
        if (!html) return null;

        // 1. Extract Title
        let title = "";
        const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
            title = ogTitleMatch[1].trim();
        } else {
            const centerTitleMatch = html.match(/<center>[\s\S]*?<b>\s*([^<]+?)\s*<\/b>\s*<br>/i);
            if (centerTitleMatch) {
                title = centerTitleMatch[1].trim();
            } else {
                const docTitle = html.match(/<title>([^<]+)<\/title>/i);
                title = docTitle ? docTitle[1].replace(/Astronomy Picture of the Day/i, "").trim() : "Cosmic Discovery";
            }
        }

        // 2. Extract Media (Video vs Image)
        let mediaType = "image";
        let url = "";
        let hdurl = "";

        const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
        if (iframeMatch) {
            mediaType = "video";
            url = iframeMatch[1];
            hdurl = url;
        } else {
            // Check for high-res anchor link wrapping image
            const anchorImgMatch = html.match(/<a\s+href=["']([^"']+\.(?:jpg|jpeg|png|gif|webp))["'][^>]*>\s*<IMG/i)
                || html.match(/<a\s+href=["']([^"']+\.(?:jpg|jpeg|png|gif|webp))["'][^>]*>\s*<img/i);

            const imgTagMatch = html.match(/<IMG\s+SRC=["']([^"']+)["']/i)
                || html.match(/<img[^>]+src=["']([^"']+)["']/i);

            const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);

            if (imgTagMatch) {
                url = imgTagMatch[1].trim();
            } else if (ogImgMatch) {
                url = ogImgMatch[1].trim();
            }

            if (anchorImgMatch) {
                hdurl = anchorImgMatch[1].trim();
            } else {
                hdurl = url;
            }

            // Reject if image resolved to the broken generic NASA site logo
            if (url.includes("nasa-logo")) {
                url = "";
                hdurl = "";
            }

            // Resolve relative paths
            if (url.startsWith("/")) {
                url = "https://assets.science.nasa.gov" + url;
            }
            if (hdurl.startsWith("/")) {
                hdurl = "https://assets.science.nasa.gov" + hdurl;
            }
        }

        // 3. Extract Explanation
        let explanation = "";
        const explMatch = html.match(/<b>\s*Explanation:\s*<\/b>(?:<\/center>)?([\s\S]*?)(?:<p>|<hr>|<strong>Tomorrow's picture|Tomorrow's picture)/i);
        if (explMatch) {
            explanation = explMatch[1]
                .replace(/<[^>]+>/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&#038;/g, "&")
                .replace(/&quot;/g, '"')
                .replace(/\s+/g, " ")
                .replace(/^Explanation:\s*/i, "")
                .trim();
        }

        // 4. Extract Credit / Copyright
        let credit = "";
        const creditMatch = html.match(/<b>\s*(?:Image\s+)?Credit[^:]*:\s*<\/b>([\s\S]*?)<\/center>/i);
        if (creditMatch) {
            credit = creditMatch[1]
                .replace(/<[^>]+>/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/\s+/g, " ")
                .trim();
        }

        return {
            date: dateStr,
            title: title || "Cosmic Discovery",
            media_type: mediaType,
            url,
            hdurl: hdurl || url,
            explanation: explanation || "A stunning view of deep space from NASA's Astronomy Picture of the Day.",
            copyright: credit || "NASA"
        };
    }

    /* ==========================================================================
       6. UI STATE MANAGERS (LOADING / ERROR / CARD)
       ========================================================================== */

    function setFormDisabled(disabled) {
        isRequestInProgress = disabled;
        if (searchButton) searchButton.disabled = disabled;
        if (todayButton) todayButton.disabled = disabled;
        if (randomButton) randomButton.disabled = disabled;
        if (retryButton) retryButton.disabled = disabled;
        presetChips.forEach(chip => { chip.disabled = disabled; });
    }

    function showLoadingState() {
        setFormDisabled(true);
        if (loadingMessage) loadingMessage.hidden = false;
        if (errorMessage) errorMessage.hidden = true;
        if (discoveryCard) discoveryCard.hidden = true;
    }

    function showErrorState(heading, message, showArchiveFallback = true) {
        setFormDisabled(false);
        if (loadingMessage) loadingMessage.hidden = true;
        if (discoveryCard) discoveryCard.hidden = true;

        if (errorMessage) {
            errorMessage.hidden = false;
            if (errorHeading) errorHeading.textContent = heading || "We lost contact with space.";
            if (errorText) errorText.textContent = message || "Something went wrong while loading the discovery.";
        }

        if (archiveFallbackButton) {
            archiveFallbackButton.hidden = !showArchiveFallback;
        }
    }

    function showDiscoveryCard() {
        setFormDisabled(false);
        if (loadingMessage) loadingMessage.hidden = true;
        if (errorMessage) errorMessage.hidden = true;
        if (discoveryCard) discoveryCard.hidden = false;
    }

    /* ==========================================================================
       7. RENDERING A DISCOVERY (IMAGE OR VIDEO)
       ========================================================================== */

    function renderDiscovery(data, isArchivedFallback = false) {
        if (!data || !data.url) return;

        // Populate Metadata
        if (imageDate) imageDate.textContent = formatDisplayDate(data.date);
        if (imageTitle) imageTitle.textContent = data.title || "Untitled Discovery";
        if (imageExplanation) {
            imageExplanation.textContent = data.explanation || "No scientific explanation provided for this entry.";
        }

        // Image Credit
        if (imageCredit) {
            imageCredit.textContent = data.copyright
                ? `Image credit & copyright: ${data.copyright}`
                : "Image credit: NASA / Astronomy Picture of the Day";
        }

        // Handle Archival Notice
        if (archiveNotice) {
            archiveNotice.hidden = !isArchivedFallback;
        }

        if (imageLabel) {
            imageLabel.textContent = isArchivedFallback ? "ARCHIVED DISCOVERY" : "NASA APOD";
        }

        // Media Rendering (Image vs Video)
        if (data.media_type === "video" && data.url) {
            if (spaceImage) {
                spaceImage.hidden = true;
                spaceImage.removeAttribute("src");
            }
            if (spaceVideo) {
                spaceVideo.hidden = false;
                spaceVideo.src = data.url;
            }
        } else {
            if (spaceVideo) {
                spaceVideo.hidden = true;
                spaceVideo.src = "";
            }
            if (spaceImage) {
                spaceImage.hidden = false;
                spaceImage.src = data.url || data.hdurl || "";
                spaceImage.alt = data.title || "NASA Astronomy Picture";
            }
        }

        // High-resolution external link
        if (originalLink) {
            originalLink.href = data.hdurl || data.url || "https://apod.nasa.gov/apod/astropix.html";
        }

        // Highlight matching preset chip if applicable
        presetChips.forEach(chip => {
            chip.classList.toggle("active", chip.dataset.date === data.date);
        });

        showDiscoveryCard();

        // Smooth scroll to results
        discoveryCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    /* ==========================================================================
       8. ASYNC FETCH PIPELINE (DUAL SOURCE + FALLBACK)
       Fetches from NASA's official endpoint with automatic filtering
       against the known legacy 'nasa-logo@2x.png' placeholder bug.
       ========================================================================== */

    async function fetchDiscovery(date) {
        if (isRequestInProgress) return;

        // Input validation
        if (!date) {
            showErrorState("Date Required", "Please choose a date to explore.", false);
            return;
        }

        const today = getTodayDateString();
        if (date > today) {
            showErrorState("Future Date Selected", `The cosmos is still unfolding! Please choose today (${today}) or an earlier date.`, false);
            return;
        }

        if (date < MIN_DATE) {
            showErrorState("Date Precedes Archive", `NASA APOD records begin on June 16, 1995. Please select a date on or after ${MIN_DATE}.`, false);
            return;
        }

        selectedDate = date;
        showLoadingState();

        const yy = date.slice(2, 4);
        const mm = date.slice(5, 7);
        const dd = date.slice(8, 10);
        const yymmdd = `${yy}${mm}${dd}`;

        let discoveryData = null;

        // ----------------------------------------------------------------------
        // Priority Strategy 1: NASA APOD Basic REST API (science.nasa.gov)
        // Provides the genuine, unique daily image directly from NASA's new CMS,
        // completely bypassing the legacy 'nasa-logo@2x.png' scraper bug.
        // ----------------------------------------------------------------------
        try {
            const directRes = await fetch(`https://science.nasa.gov/wp-json/wp/v2/apod-basic/${yymmdd}/html`);
            if (directRes.ok) {
                const html = await directRes.text();
                const parsed = parseApodHtml(html, date);
                if (parsed && parsed.url && !parsed.url.includes("nasa-logo")) {
                    discoveryData = parsed;
                }
            }
        } catch (directErr) {
            console.warn("Direct APOD basic fetch failed, trying API fallback:", directErr);
        }

        // ----------------------------------------------------------------------
        // Strategy 2: NASA Open API (api.nasa.gov)
        // ----------------------------------------------------------------------
        if (!discoveryData) {
            try {
                const queryParams = new URLSearchParams({
                    api_key: activeApiKey,
                    date: date
                });

                const response = await fetch(`${API_BASE_URL}?${queryParams}`);

                if (response.ok) {
                    const data = await response.json();
                    const isBrokenLogo = (data.url && data.url.includes("nasa-logo")) || data.title === "NASA Science";
                    
                    // Only accept if it's NOT the generic fallback logo
                    if (!isBrokenLogo && data.title && data.url) {
                        discoveryData = data;
                    }
                } else if (response.status === 400 && date === today) {
                    // Timezone offset correction
                    const yesterday = getTodayDateString(-1);
                    dateInput.value = yesterday;
                    selectedDate = yesterday;
                    return fetchDiscovery(yesterday);
                }
            } catch (apiErr) {
                console.warn("NASA API fetch error:", apiErr);
            }
        }

        // ----------------------------------------------------------------------
        // Strategy 3: Check Verified Curated Discoveries
        // ----------------------------------------------------------------------
        if (!discoveryData && CURATED_DISCOVERIES[date]) {
            discoveryData = CURATED_DISCOVERIES[date];
        }

        // Render valid discovery if retrieved
        if (discoveryData && discoveryData.url && !discoveryData.url.includes("nasa-logo")) {
            renderDiscovery(discoveryData, false);
            return;
        }

        // ----------------------------------------------------------------------
        // Strategy 4: Error Handling & Diagnostics
        // ----------------------------------------------------------------------
        const isOffline = !navigator.onLine;
        const heading = isOffline
            ? "No Cosmic Connection"
            : "Mission Signal Interrupted";

        const message = isOffline
            ? "Unable to reach NASA's servers. Please check your internet connection and try again."
            : "NASA did not return a valid astronomy picture for this specific date. You can select another date, try our preset discoveries, or view the curated archive.";

        showErrorState(heading, message, true);
    }

    /* ==========================================================================
       9. EVENT LISTENERS & USER INTERACTIONS
       ========================================================================== */

    // Search button
    if (searchButton) {
        searchButton.addEventListener("click", () => {
            fetchDiscovery(dateInput.value);
        });
    }

    // Today button
    if (todayButton) {
        todayButton.addEventListener("click", () => {
            const today = getTodayDateString();
            dateInput.value = today;
            fetchDiscovery(today);
        });
    }

    // Random Date button
    if (randomButton) {
        randomButton.addEventListener("click", () => {
            const randomDate = getRandomDate();
            dateInput.value = randomDate;
            fetchDiscovery(randomDate);
        });
    }

    // Preset Discovery Chips
    presetChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const date = chip.dataset.date;
            if (date) {
                dateInput.value = date;
                fetchDiscovery(date);
            }
        });
    });

    // Retry button on error screen
    if (retryButton) {
        retryButton.addEventListener("click", () => {
            fetchDiscovery(selectedDate || dateInput.value || getTodayDateString());
        });
    }

    // View Archived Discovery button on error screen
    if (archiveFallbackButton) {
        archiveFallbackButton.addEventListener("click", () => {
            const fallbackKey = CURATED_DISCOVERIES[selectedDate] ? selectedDate : "2026-10-21";
            const fallback = CURATED_DISCOVERIES[fallbackKey] || Object.values(CURATED_DISCOVERIES)[0];
            dateInput.value = fallback.date;
            selectedDate = fallback.date;
            renderDiscovery(fallback, true);
        });
    }

    // Date input Enter key trigger
    if (dateInput) {
        dateInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                fetchDiscovery(dateInput.value);
            }
        });
    }

    /* ==========================================================================
       10. API KEY CONFIGURATION MODAL / PANEL
       ========================================================================== */

    if (apiKeyToggle && apiKeyForm) {
        apiKeyToggle.addEventListener("click", () => {
            const isHidden = apiKeyForm.hidden;
            apiKeyForm.hidden = !isHidden;
            apiKeyToggle.setAttribute("aria-expanded", String(isHidden));
            if (isHidden && apiKeyInput) {
                apiKeyInput.value = activeApiKey === DEFAULT_API_KEY ? "" : activeApiKey;
                apiKeyInput.focus();
            }
        });
    }

    if (saveKeyButton && apiKeyInput) {
        saveKeyButton.addEventListener("click", () => {
            const key = apiKeyInput.value.trim();
            if (key) {
                activeApiKey = key;
                localStorage.setItem(API_STORAGE_KEY, key);
                if (apiKeyStatus) {
                    apiKeyStatus.textContent = "✓ Custom NASA API key saved! Now using your personal quota.";
                    apiKeyStatus.className = "api-key-status success";
                }
            } else {
                activeApiKey = DEFAULT_API_KEY;
                localStorage.removeItem(API_STORAGE_KEY);
                if (apiKeyStatus) {
                    apiKeyStatus.textContent = "Reverted to default registered NASA API key.";
                    apiKeyStatus.className = "api-key-status info";
                }
            }
        });
    }

    if (resetKeyButton && apiKeyInput) {
        resetKeyButton.addEventListener("click", () => {
            activeApiKey = DEFAULT_API_KEY;
            localStorage.removeItem(API_STORAGE_KEY);
            apiKeyInput.value = "";
            if (apiKeyStatus) {
                apiKeyStatus.textContent = "Reset to your registered personal NASA API key.";
                apiKeyStatus.className = "api-key-status info";
            }
        });
    }

    /* ==========================================================================
       11. APPLICATION INITIALIZATION
       ========================================================================== */

    setupDatePicker();

    // Fetch initial discovery for today or latest
    fetchDiscovery(dateInput.value);

});