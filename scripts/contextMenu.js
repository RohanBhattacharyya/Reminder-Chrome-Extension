// background.js

// On install, create context menu
browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
        id: "saveLink",
        title: "Save link to break",
        contexts: ["link"]
    });

    // You can re-enable these later if needed
    // browser.contextMenus.create({
    //     id: "saveTextWithUrl",
    //     title: "Save selection with page URL",
    //     contexts: ["selection"]
    // });
    // browser.contextMenus.create({
    //     id: "savePage",
    //     title: "Save this page to memory",
    //     contexts: ["page"]
    // });
});

// On context menu click
browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "saveLink":
            saveLinkToMemory(info, tab);
            break;
    }
});

async function saveLinkToMemory(info, tab) {
    const linkData = {
        id: Date.now().toString(),
        type: 'link',
        url: info.linkUrl,
        title: info.linkText || 'Untitled Link',
        sourceUrl: tab.url,
        sourceTitle: tab.title,
        timestamp: new Date().toISOString(),
        tags: []
    };

    try {
        const result = await browser.storage.local.get('memory_links');
        const existingLinks = result.memory_links || [];
        existingLinks.push(linkData);
        await browser.storage.local.set({ memory_links: existingLinks });
        showNotification(`Link saved: ${linkData.title}`, 'success');
    } catch (error) {
        console.error(error);
        showNotification('Error saving link', 'error');
    }
}

function showNotification(message, type = 'info') {
    const title = type === 'error'
        ? 'Error, Something went wrong'
        : type === 'success'
        ? 'Success, saved to memory'
        : 'Pomodoro Memory';

    browser.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon.png',
        title: title,
        message: message
    });
}
