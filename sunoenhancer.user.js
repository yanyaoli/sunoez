// ==UserScript==
// @name         SunoEnhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhance suno.ai with additional features: download songs directly and copy lyrics with ease.
// @author       yanyaoli
// @match        https://app.suno.ai/song/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        const urlParts = window.location.href.split('/');
        const songId = urlParts[urlParts.length - 2];

        function showToast(message, duration = 3000) {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.position = 'fixed';
            toast.style.top = '20px';
            toast.style.right = '20px';
            toast.style.padding = '10px 15px';
            toast.style.borderRadius = '5px';
            toast.style.background = 'rgba(44, 62, 80, 0.7)';
            toast.style.color = 'white';
            toast.style.zIndex = '10000';

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, duration);
        }

        const container = document.querySelector('body > div.css-fhtuey > div.css-7p13yq > div > div > div > div.css-47b328 > div.chakra-stack.css-1e40a21 > div.chakra-stack.css-lw6smx > div.css-0');

        if (!container) return;

        // Remove existing buttons
        const existingButtons = container.querySelectorAll('.better-btn');
        existingButtons.forEach(button => {
            button.remove();
        });

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'better-btn chakra-button css-rb08q';
        downloadBtn.textContent = 'Download';
        downloadBtn.style.marginLeft = '10px';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'better-btn chakra-button css-rb08q';
        copyBtn.textContent = 'Copy Lyrics';
        copyBtn.style.marginLeft = '10px';

        function downloadSong() {
            const downloadUrl = `https://cdn1.suno.ai/${songId}.mp3`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = songId + '.mp3';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function copyLyrics() {
            const pElement = document.querySelector('body > div.css-fhtuey > div.css-7p13yq > div > div > div > div.css-47b328 > div.chakra-stack.css-1e40a21 > div.chakra-stack.css-16rwzp6 > p');
            const textToCopy = pElement ? pElement.textContent : '';

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('Lyrics copied to clipboard!');
            }, (err) => {
                console.error('Could not copy text: ', err);
            });
        }

        downloadBtn.addEventListener('click', downloadSong)
        copyBtn.addEventListener('click', copyLyrics);

        container.appendChild(downloadBtn);
        container.appendChild(copyBtn);
    }

    main();

    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target.nodeName === 'HEAD') {
                main();
                break;
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
